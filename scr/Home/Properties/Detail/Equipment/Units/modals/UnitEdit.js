import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Dimensions,
  LayoutAnimation,
  PermissionsAndroid,
  Alert,
  Platform,
  FlatList,
  Image,
  Linking,
  ActivityIndicator,
  Switch,
  Keyboard,
  LogBox,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Video from 'react-native-video';
import SystemSetting from 'react-native-system-setting';
import { Icon } from 'react-native-material-ui';
import { TextInput, HelperText } from 'react-native-paper';
import { DotsLoader, OpacityDotsLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
} from 'react-native-maps';
import clc from 'cli-color';

import { Fonts } from '../../../../../../utils/fonts';
import Searchable_Dropdown from '../../../../../../components/SearchableDropdown/index';
import Text_Input from '../../../../../../components/TextInput';
import useUpdateEffect from '../../../../../../hooks/useUpdateEffect';
import API from '../../../../../../api/SeviceApi';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function UnitEdit({
  flag,
  propertyId,
  propertyLat,
  propertyLong,
  enableFlag,
  disableFlag,
  modalVisible,
  closeModal,
  reRun,
  meterTypes,
  modalName,
  buildingName,
  buildingId,
  unitDetails,
  unitsArray,
  openModal,
  unitMixesId,
  type,
  userRole,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [editMeterIndex, setEditMeterIndex] = useState(null);
  const inputRef = useRef(null);
  const [defaultMeterValues, setDefaultMeterValues] = useState(false);
  const [defaultDeviceValues, setDefaultDeviceValues] = useState('');
  const [defaultData, setDefaultData] = useState([]);
  const [defaultInfoData, setDefaultInfoData] = useState([]);
  const [defaultScreen, setDefaultScreen] = useState(false);
  const [radialDis, setRadialDis] = useState(100);
  const [isActivityLoader, setIsActivityLoader] = useState(false);
  const [loadMeters, setLoadMeters] = useState(false);
  const [loadManufacturers, setLoadManufacturers] = useState(false);
  const [attachedToId, setAttachedToId] = useState(null);
  const [attachedTo, setAttachedTo] = useState('');
  const [attachedToData, setAttachedToData] = useState([]);
  const [filePath, setFilePath] = useState('');
  const [reasonPath, setReasonPath] = useState([]);
  const [imageBase64, setImageBase64] = useState('');
  const [reasonBase64, setReasonBase64] = useState('');
  const [meterData, setMeterData] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(1);
  const [addTypeInput, setAddTypeInput] = useState(false);
  const [letsFinish, setLetsFinish] = useState(false);
  const [letsUpdateMeterData, setLetsUpdateMeterData] = useState(false);
  const [newMeterType, setNewMeterType] = useState('');
  const [typeLoader, setTypeLoader] = useState(false);
  const [selectLocation, setSelectLocation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [latDelta, setLatDelta] = useState(LATITUDE_DELTA);
  const [longDelta, setLongDelta] = useState(LONGITUDE_DELTA);
  const [installationStatus, setInstallationStatus] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [checkSerial, setCheckSerial] = useState(false);
  const [defaultManuLis, setDefaultManuLis] = useState([]);
  const [productNo, setProductNo] = useState('');
  const [addModelNo, setAddModelNo] = useState('');
  const [modelArr, setModelArr] = useState([]);
  const [addProductNo, setAddProductNo] = useState('');
  const [scroll, setScroll] = useState(false);
  const [slide1, setSlide1] = useState([
    {
      id: 0,
      select: '',
      selectId: '',
      error: '',
      name: 'Manufacturer',
      data: [],
    },
    {
      id: 1,
      selectId: '',
      select: '',
      error: '',
      name: 'Device',
      data: [],
    },
    // {
    //   id: 2,
    //   selectId: '',
    //   select: '',
    //   error: '',
    //   name: 'Model Number',
    //   data: [],
    // },
  ]);
  const [addDevice, setAddDevice] = useState([
    // {
    //   id: 0,
    //   select: '',
    //   selectId: '',
    //   name: 'Manufacturer',
    //   data: [],
    // },
    {
      id: 0,
      selectId: '',
      select: '',
      name: 'Device Type',
      data: [],
    },
    {
      id: 1,
      selectId: '',
      select: '',
      name: 'New Device',
      data: [],
    },
  ]);
  const [slide2, setSlide2] = useState([
    {
      id: 0,
      error: '',
      name: 'Device Serial Number',
      value:
        type == 'meterDirect' || type == 'addMeterDirect'
          ? unitDetails?.unit?.meterSerial
          : '',
    },
    {
      id: 1,
      error: '',
      name: 'Initial Meter Reading',
      value: '0',
    },
    {
      id: 2,
      error: '',
      name: 'Attached To',
      value: '',
    },
  ]);
  // console.log('METERLISTDATA', meterListData);
  const helperDefaultData = useRef([]);

  const [selectUtil, setSelectUtil] = useState([]);
  const [unitMix, setUnitMix] = useState([]);
  const [unitMixIcon, setUnitMixIcon] = useState(false);
  const [unitMixId, setUnitMixId] = useState(null);
  const [selectedUnitMix, setSelectedUnitMix] = useState('');
  const [selectedUtil, setSelectedUtil] = useState('');
  const [selectedUtilId, setSelectedUtilId] = useState(null);
  const [selectedDevId, setSelectedDevId] = useState(null);
  const [utilTypes, setUtilTypes] = useState([]);
  const [utilLength, setUtilLength] = useState(0);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [newMeterFlag, setNewMeterFlag] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);
  const selectedTypes = useRef([]);
  const [reasons, setReasons] = useState([]);
  const [reasonArr, setReasonArr] = useState([]);
  const [meterAddingId, setMeterAddingId] = useState('');
  const [devEdit, setDevEdit] = useState(false);
  const [existingDev, setExistingDev] = useState(false);
  const [reasonId, setReasonId] = useState(null);
  const [reasonDes, setReasonDes] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [addManufacturer, setAddManufacturer] = useState('');
  const [addUtility, setAddUtility] = useState('');
  const [addAttached, setAddAttached] = useState('');
  const [showAddType, setShowAddType] = useState('');
  const [meterListLoader, setMeterListLoader] = useState(true);
  const [sliderNumber, setSliderNumber] = useState(1);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [doneAnimation, setDoneAnimation] = useState(false);
  const [hideBtn, setHideBtn] = useState(false);
  const [addNewType, setAddNewType] = useState(false);
  const [showAddMeterSlider, setShowAddMeterSlider] = useState(false);
  const [devicesArray, setDevicesArray] = useState([]);
  const [enableDevice, setEnableDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [addModelNumber, setAddModelNumber] = useState('');
  const [noScroll, setNoScroll] = useState(false);
  const [state, setState] = useState({
    isScannerVisible: false,
    hasAccess: false,
    scan: false,
    scanIndex: 0,
    result: '',
    newSerial: '',
    manufacturersData: [],
    devicesData: [],
    lastUnitData: '',

    checkIndex: 0,
  });
  const [newMeter, setNewMeter] = useState({
    id: 0,
    number: 1,
    deviceSerialNum:
      type == 'meterDirect' || type == 'addMeterDirect'
        ? unitDetails?.unit?.meterSerial
        : '',
    deviceSerialError: '',
    meterType: '',
    meterTypeName: '',
    meterTypeError: '',
    meterAttachedTo: '',
    manufacturersId: '',
    initialMeterReadingError: '',
    initialMeterReading: '',
    manufacturersName: '',
    manufacturersError: '',
    deviceId: '',
    deviceName: '',
    deviceError: '',
    meterAttachedError: '',
    meterSerialNum: '',
    customMeterId: '',
    name: '',
    icon: '',
    meterTypeMenu: false,
  });
  const [error, setError] = useState({
    errorUnits: '',
    errorUnitMix: '',
  });

  const verticalOffset = useRef(-180);

  const turnLocationOn = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS == 'android') {
      SystemSetting.switchLocation();
    }
  };

  const sendInstallationStatus = (status) => {
    setHideBtn(true);
    setInstallationStatus(status);
    setStatusAnimation(true);
    setTimeout(() => {
      setHideBtn(false);
    }, 4000);
  };

  const enableLocation = async (oldPos) => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    if (!location) {
      Alert.alert('Enable Location', 'Kindly TurnOn Location to Add Meter', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Turn On Location',
          onPress: turnLocationOn,
        },
      ]);
    } else {
      if (Platform.OS == 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then((result) => {
            if (result == RESULTS.GRANTED) {
              checkLocation(true, oldPos);
            } else {
              checkLocation(false);
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
      if (Platform.OS == 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            checkLocation(true, oldPos);
          } else {
            checkLocation(false);
          }
        } catch (err) {
          alert(err);
        }
      }
    }
  };

  const AddTypes = (item, type) => {
    if (type == 'Models') {
      console.log('ADD CHALA', item);
      const items = [...modelArr];
      items.push(item);
      setModelArr(items);
      setAddModelNo('');
      // this.setState({modelArr: items, modelNo: ''});
    } else {
      console.log('ADD CHALA', item);
      setSelectedUtil(item.name);
      setSelectedUtilId(item.id);
      const items = selectUtil;
      items.push(item);
      // selectedTypes.current = items;

      setSelectUtil(items);
    }
  };

  const checkLocation = async (locationAccess, oldPos) => {
    if (locationAccess) {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });

      setShowAddMeterSlider(true);
      _renderMap(oldPos);
    } else {
      Alert.alert(
        `You don't have access for the Location`,
        `To Change the permission Open Settings`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: openSettings,
          },
        ],
      );
    }
  };

  const requestCameraPermission = async (type) => {
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          console.log('kia hai result camera ka', result);
          if (result == RESULTS.GRANTED) {
            cameraLaunch(type);
          } else {
            // console.log('Denied',)
            Alert.alert(
              "You don't have access for the Camera",
              'To Change the Permission Open Settings',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () =>
                    openSettings().catch(() =>
                      console.warn('cannot open settings!'),
                    ),
                },
              ],
            );
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          cameraLaunch(type);
        } else {
          Alert.alert(
            "You don't have access for the Camera",
            'To Change the Permission Open Settings',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: async () =>
                  await SystemSetting.openAppSystemSettings(),
              },
            ],
          );
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  useUpdateEffect(async () => {
    if (type == 'add' || type == 'addMeterDirect') {
      setLoadMeters(false);
    } else {
      setLoadMeters(true);
    }

    callApi();

    let arr2 = meterTypes;

    if (arr2.length > 0) {
      setMeterListData(arr2);
    }
  }, [modalVisible]);

  // useEffect(() => {
  //   _renderMap();
  // }, []);
  useEffect(() => {
    console.log(clc.xterm(80)('AYA PROPERTY ID', propertyId));
    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    if (type == 'meterDirect' || type == 'addMeterDirect') {
      let newArr = [...slide2]; // copying the old datas array
      newArr[0].value = unitDetails?.unit?.meterSerial; // replace e.target.value with whatever you want to change it to
      // newArr[index].deviceSerialError = ''; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
    }
    // console.log('showAddMeterSlider------->', showAddMeterSlider);
  }, [showAddMeterSlider]);

  useEffect(async () => {
    if (flag) {
      setState((oldState) => ({
        ...oldState,
        lastUnitData: unitDetails?.unit?.name,
      }));
      const propertyData = await API.get(`/property/${propertyId}`);

      const Mixes = propertyData?.data?.data?.property?.unit_mixes;
      const unitMixes = Mixes.map((item) => {
        const { select_option: name, ...rest } = item;
        return { name, ...rest };
      });
      setUnitMix(unitMixes);
      if (type != 'add') {
        // setUnitMix(propertyData?.data?.data?.property?.unit_mixes);
        setUnitMixId(unitMixesId);
        unitMixes?.map((item) => {
          if (item.id == unitMixesId) {
            setSelectedUnitMix(item.name);
          }
        });
        console.log('UNITMIXES');
      }
    }
    // callApi();
  }, [meterTypes, unitDetails, modalVisible]);

  useEffect(() => {
    if (sliderNumber == 5) {
      setDoneAnimation(true);
      setTimeout(() => {
        setDoneAnimation(false);
      }, 5000);
    }
  }, [sliderNumber]);

  //!----------->

  const toggleScanner = async (value) => {
    disableFlag();
    setState((oldState) => ({
      ...oldState,
      scanIndex: value,
    }));
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (state.hasAccess) {
            setState((oldState) => ({
              ...oldState,
              isScannerVisible: true,
              hasAccess: true,
              scan: true,
            }));
          } else {
            setState((oldState) => ({
              ...oldState,
              hasAccess: true,
            }));
          }
          // setState((oldState) => ({
          //   ...oldState,
          //   isScannerVisible: true,
          //   hasAccess: true,
          //   scan: true,
          // }));
        } else {
          setState((oldState) => ({
            ...oldState,
            hasAccess: false,
          }));
          // Alert.alert(
          //   "You don't have access for the Camera",
          //   'Kindly TurnOn Camera Permission from Settings to use Scanner',
          // );
        }
        return granted;
      } catch (err) {
        alert(err);
      }
    }
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          if (result == RESULTS.GRANTED) {
            closeModal();
            setTimeout(() => {
              setState((oldState) => ({
                ...oldState,
                isScannerVisible: true,
                hasAccess: true,
                scan: true,
              }));
            }, 450);
          }
          if (result == RESULTS.DENIED) {
            setState((oldState) => ({
              ...oldState,
              hasAccess: false,
            }));
            Alert.alert(
              "You don't have access for the Camera",
              'Kindly TurnOn Camera Permission from Settings to use Scanner',
            );
          }
          if (result == RESULTS.BLOCKED) {
            setState((oldState) => ({
              ...oldState,
              hasAccess: false,
            }));
            Alert.alert(
              "You don't have access for the Camera",
              'Kindly TurnOn Camera Permission from Settings to use Scanner',
            );
          }
        })
        .catch((e) => {
          alert(err);
        });
    }
  };

  const onScanned = (e) => {
    const check = e.data.substring(0, 4);
    if (check == 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      let newArr = [...slide2]; // copying the old datas array
      newArr[state.scanIndex].value = e.data; // replace e.target.value with whatever you want to change it to
      // newArr[state.scanIndex].deviceSerialError = ''; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
      setState((oldState) => ({
        ...oldState,
        result: e,
        scan: false,
        newSerial: e.data,
        isScannerVisible: false,
      }));
      setTimeout(() => {
        RNBeep.beep(false);
      }, 500);
    }
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        closeModal();
      }, 400);
    }
  };

  const scannerModal = () => {
    setState((oldState) => ({
      ...oldState,
      isScannerVisible: false,
      scan: false,
    }));
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        closeModal();
      }, 400);
    }
  };

  //!-------->
  const onChangeMultipleField = (e, index) => {
    let newArr = [...slide2]; // copying the old datas array
    newArr[index].value = e; // replace e.target.value with whatever you want to change it to
    setSlide2(newArr);
  };

  const onChangeManufacturer = (e, index) => {
    let listSlide = [...slide1]; // copying the old datas array

    //! for onchangeDevice

    if (index == 0) {
      listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = '';
      listSlide[0].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[0].error = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].error = ''; // replace e.target.value with whatever you want to change it to
    }

    setSlide1(listSlide);
  };

  const onChangeAttachedTo = (e) => {
    setAttachedTo(e);
    setAttachedToId(null);
  };

  const changeUtilityAndToggle = () => {
    enableFlag();
    setMeterData([]);
    setMeterListData([]);
    setError((oldState) => ({
      ...oldState,
      errorUnits: '',
      errorUnitMix: '',
    }));
    setUnitMix([]);
    setUnitMixId(null);
    setSelectedUnitMix('');
    closeModal();
    if (type == 'addMeterDirect' || type == 'add') {
      setState((oldState) => ({
        ...oldState,
        lastUnitData: '',
      }));
    }
  };

  const callApi = async (oldDev) => {
    setReasons([]);
    setLoadManufacturers(true);

    const defaultUnitData = await API.get(
      `/property/default-meter-device/${propertyId}`,
    );

    let defaultUtilityType = [];

    if (defaultUnitData.ok) {
      const some = defaultUnitData?.data?.data?.default_meter_device;

      setSelectedUtil(some.utility_type_name[0].name);
      setSelectedUtilId(some.utility_type_name[0].id);

      helperDefaultData.current = some;

      const utilityIds = some?.utility_type_id;
      const utilityRes = some?.utility_type_name;
      setDefaultData(some);

      setUtilLength(utilityIds.length);
      defaultUtilityType = some?.utility_type_name;

      const defaultDis =
        defaultUnitData?.data?.data?.defaultLocation?.radial_dist;
      setRadialDis(defaultDis * 1000);

      setState((oldState) => ({
        ...oldState,
        manufacturersData:
          defaultUnitData?.data?.data?.default_meter_device.manufacturers,
      }));
      // setDefaultManuLis(
      //   defaultUnitData?.data?.data?.default_meter_device.manufacturers,
      // );
    }

    const propertyData = await API.get(`/property/${propertyId}`);

    const propManus = propertyData?.data?.data.property.utility_manufacturers;

    let manufacturers = [];
    let utilities = [];

    propManus.map((item) => {
      manufacturers.push(item.manufacturer);
      utilities.push(item.utility_type);
    });

    setDefaultManuLis(manufacturers);
    setUtilTypes(utilities);

    const DeviceTypesResponse = await API.get(
      '/property/equipment/device-type/all',
    );
    let deviceData = [...addDevice]; // copying the old datas array
    deviceData[0].data = DeviceTypesResponse?.data?.data;
    setAddDevice(deviceData);
    const AttachedToResponse = await API.get(
      '/property/equipment/attached_to/attach',
    );
    // console.log('AttachedToResponse_________', AttachedToResponse?.data?.data);
    setAttachedToData(AttachedToResponse?.data?.data);
    const reasoneResponce = await API.get(
      '/property/equipment/unit/option-reasons/all',
    );

    setReasons(reasoneResponce?.data?.data);
    // console.log('reasons_________', reasoneResponce?.data?.data);

    // xxx

    let UtilArray = [...defaultUtilityType];
    let ManuArray = [...defaultManuLis];
    // console.log('Utility DATA', UtilArray);
    // console.log('SLIDE DATA', ManuArray);
    let empSlide = [...slide1]; // copying the old datas array
    empSlide[0].data = [];
    setSlide1(empSlide);
    UtilArray.filter((item) => {
      ManuArray.map((manuItem) => {
        if (manuItem?.utility_type[0]?.name != undefined) {
          if (item.name == manuItem?.utility_type[0]?.name) {
            let listSlide = [...slide1]; // copying the old datas array
            // console.log('MANUITEM BATA', manuItem.devices[0].model_nos);
            listSlide[0].data.push(manuItem);
            if (manuItem.devices.length > 0) {
              listSlide[1].data = manuItem.devices;
              if (manuItem.devices[0].model_nos.length > 0) {
                const modelNos = manuItem.devices[0].model_nos.map((item) => {
                  const { model_no: name, ...rest } = item;
                  return { name, ...rest };
                });
                // listSlide[2].data = modelNos;
              }
            }
            setSlide1(listSlide);
          }
        }
      });
    });
    const defaultDevices = helperDefaultData.current.manufacturers[0].devices;

    //? Some thing wrong with this code -----------

    console.log('devEdit', devEdit);
    if (defaultDevices.length > 0 && !oldDev) {
      console.log('existingDev', existingDev);
      const filterDevices = defaultDevices.filter(
        (item) => item.manufacturer_id === slide1[0].data[0]?.id,
      );
      setDefaultInfoData(filterDevices);
      let listSlide = [...slide1]; // copying the old datas array
      listSlide[0].select = filterDevices[0]?.manufacturer; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = filterDevices[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = filterDevices[0]?.name; // replace e.target.value with whatever you want to change it to
      listSlide[1].selectId = filterDevices[0]?.id; // replace e.target.value with whatever you want to change it to
      // listSlide[2].select = filterDevices[0]?.model_nos[0]?.model_no; // replace e.target.value with whatever you want to change it to
      // listSlide[2].selectId = filterDevices[0]?.model_nos[0]?.id; // replace e.target.value with whatever you want to change it to
      setProductNo(filterDevices[0]?.product_desc);
      setSlide1(listSlide);
      setLoadManufacturers(false);
      setLoadMeters(false);
    } else if (!defaultDevices.length > 0) {
      let listSlide = [...slide1]; // copying the old datas array
      listSlide[0].select = slide1[0].data[0]?.name; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = slide1[0].data[0]?.id; // replace e.target.value with whatever you want to change it to
      setSlide1(listSlide);
      setLoadManufacturers(false);
      setLoadMeters(false);
    }
  };

  const getdefaultDeviceData = (val) => {
    // setDefaultDeviceValues(val);
    // if (val) {
    let listSlide = [...slide1]; // copying the old datas array
    listSlide[0].select = defaultInfoData[0]?.manufacturer; // replace e.target.value with whatever you want to change it to
    listSlide[0].selectId = defaultInfoData[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
    listSlide[1].select = defaultInfoData[0]?.name; // replace e.target.value with whatever you want to change it to
    listSlide[1].selectId = defaultInfoData[0]?.id; // replace e.target.value with whatever you want to change it to
    // listSlide[2].select = defaultInfoData[0]?.model_nos[0]?.model_no; // replace e.target.value with whatever you want to change it to
    // listSlide[2].selectId = defaultInfoData[0]?.model_nos[0]?.id; // replace e.target.value with whatever you want to change it to
    setProductNo(defaultInfoData[0]?.product_desc);
    setSlide1(listSlide);
    // }
  };

  const getdefaultMeterData = (val) => {
    setDefaultMeterValues(val);
    if (val) {
      // setNewMeter((oldState) => ({ check later
      //   ...oldState,
      //   id: defaultData?.meter_id[0],
      //   name: defaultData?.meter_name[0]?.name,
      // }));

      const utilityIds = defaultData.utility_type_id;

      const filterRes = utilTypes.filter((item1) =>
        utilityIds.some((item2) => item1.id == item2),
      );
      console.log(' UTILITY RES', filterRes);
      setSelectUtil(filterRes);
    }
  };

  const getAllDevices = async () => {
    console.log('get all Devices-->>>');

    const devicesResponse = await API.get(`/property/equipment/device/all`);
    if (devicesResponse.ok) {
      console.log('cha;a', devicesResponse?.data?.data);
      setDevicesArray(devicesResponse?.data?.data);
      setEnableDevice(true);
    } else {
      alert('Something wrong');
    }
  };

  const getDevice = async (some, index) => {
    console.log('get devices--->', some?.id);
    console.log('get devices--->', some);
    // const deviceResponse = await API.get(
    //   `/property/equipment/device/all/${some?.id}`,
    // );
    // const defaultDeviceResponse = await API.get(
    //   `/property/default-meter-device/${propertyId}`,
    // );

    // console.log(
    //   'Default Meter Devices',
    //   defaultDeviceResponse?.data?.data?.default_meter_device.devices,
    // );
    // const DefaultDevices =
    //   defaultDeviceResponse?.data?.data?.default_meter_device.manufacturers[0]
    //     .devices;

    // const filterDevices = DefaultDevices.filter(
    //   (item) => item.manufacturer_id === some?.id,
    // );

    // setState((oldState) => ({
    //   ...oldState,
    //   devicesData: deviceResponse?.data?.data,
    // }));
    // setState((oldState) => ({
    //   ...oldState,
    //   devicesData:
    //     defaultDeviceResponse?.data?.data?.default_meter_device.devices,
    // }));

    let listSlide = [...slide1]; // copying the old datas array
    listSlide[index].select = some?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = some?.id; // replace e.target.value with whatever you want to change it to
    if (index == 0) {
      listSlide[1].data = some.devices;
      // listSlide[1].data = deviceResponse?.data?.data;
      listSlide[1].selectId = '';
      // listSlide[2].selectId = '';
      listSlide[1].select = '';
      // listSlide[2].select = '';
    }
    if (index == 1) {
      const product_desc = some?.product_desc;
      console.log('MODEL NOS OF DEVICE', some?.model_nos);
      const modelNos = some?.model_nos.map((item) => {
        const { model_no: name, ...rest } = item;
        return { name, ...rest };
      });
      // listSlide[2].data = modelNos;
      // listSlide[2].selectId = '';
      // listSlide[2].select = '';
      // this.setState((prevState) => ({
      //   error: {
      //     // object that we want to update
      //     ...prevState.error, // keep all other key-value pairs
      //     deviceId: '',
      //   },
      // }));
      setProductNo(product_desc);
      console.log(clc.cyanBright('product desc of device'), product_desc);
      console.log('DAEA of models', modelNos);
    }
    setSlide1(listSlide);
  };

  const removeMeterAlert = (i, ind) => {
    Alert.alert('Becareful', 'Are you sure to delete meter permanently', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => removeMeter(i, ind),
      },
    ]);
  };

  const removeMeter = async (item, index) => {
    if (type == 'add') {
      let listArr = [...meterListData];
      listArr.splice(index, 1);
      setMeterListData(listArr);
      let listData = [...meterData];
      listData.splice(index, 1);
      setMeterData(listData);
      reRun();
    } else {
      const sumOfLengths = meterListData.length - meterData.length;
      const indOfMData = index - sumOfLengths;
      const delMeter = await API.post(
        `/property/equipment/unit/unit-meter/${item.id}`,
      );
      if (delMeter.data.bool) {
        if (indOfMData >= 0) {
          let listData = [...meterData];
          listData.splice(indOfMData, 1);
          setMeterData(listData);
        }
        let listArr = [...meterListData];
        listArr.splice(index, 1);
        setMeterListData(listArr);
        reRun();
      } else {
        alert(delMeter.data.message);
      }
    }
    // if (item.id != null) {
    //   const delMeter = await API.post(
    //     `/property/equipment/unit/unit-meter/${item.id}`,
    //   );
    //   if (delMeter.data.bool) {
    //     if (indOfMData >= 0) {
    //       let listData = [...meterData];
    //       listData.splice(indOfMData, 1);
    //       setMeterData(listData);
    //     }
    //     let listArr = [...meterListData];
    //     listArr.splice(index, 1);
    //     setMeterListData(listArr);
    //     reRun();
    //   } else {
    //     alert(delMeter.data.message)
    //   }
    // } else {
    //   if (indOfMData >= 0) {
    //     let listData = [...meterData];
    //     listData.splice(indOfMData, 1);
    //     setMeterData(listData);
    //   }
    //   let listArr = [...meterListData];
    //   listArr.splice(index, 1);
    //   setMeterListData(listArr);
    //   reRun();
    // }
  };

  const handleAddNewUnit = async () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    let matchUnit;
    if (type == 'add') {
      matchUnit = unitsArray?.filter((e) => e.name == state.lastUnitData);
    }

    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
    }));
    if (!state.lastUnitData) {
      setError((oldState) => ({
        ...oldState,
        errorUnits: 'Unit Required',
      }));
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        errorUnits: '',
      }));
    }
    if (type == 'add' && matchUnit.length != 0) {
      setError((oldState) => ({
        ...oldState,
        errorUnits: 'This unit already exist',
      }));
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        errorUnits: '',
      }));
    }
    if (unitMixId == null) {
      setError((oldState) => ({
        ...oldState,
        errorUnitMix: 'Please select Unit Mix',
      }));
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        errorUnitMix: '',
      }));
    }
    if (
      meterData.length == 0 &&
      (type == 'addMeterDirect' || type == 'meterDirect' || type == 'add')
    ) {
      alert('Select meter and continue');
      return;
    }
    setIsActivityLoader(true);
    let data = {
      name: state.lastUnitData,
      building_id: buildingId,
      defaultRadial_dist: radialDis,
      unit_mix_id: unitMixId,
      meters: meterData,
    };

    // console.log('Meter Data 1', unitDetails?.unit?.id);
    // console.log('Meter Data 2', meterData[1].reasons);
    console.log('data--->', data);
    console.log('data meters--->', data.meters);
    if (type == 'add' || type == 'addMeterDirect') {
      console.log('ADD CHALA');
      const unitResponse = await API.post(
        `/property/equipment/unit/add-unit`,
        data,
      );
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        reRun(unitResponse?.data?.data);
        // console.log('datachecckk-->>', unitResponse?.data?.data);
      } else {
        setIsActivityLoader(false);
        console.log('EDIT RESPONSE FALSE MILA');
        console.log(unitResponse?.data);
        alert(unitResponse?.data?.message);
      }
      // console.log('Add unit response', unitResponse?.data);
    } else {
      console.log('EDIT CHALA');
      const unitResponse = await API.post(
        `/property/equipment/unit/update-unit/${unitDetails?.unit?.id}`,
        data,
      );
      // console.log(
      //   'Unitmeterchecckk-->>',
      //   unitResponse?.data?.data?.unit?.unit_meter,
      // );
      // console.log('update data check-->>', unitResponse?.data);
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        reRun(unitResponse?.data?.data);
      } else {
        setIsActivityLoader(false);
        console.log('ADD RESPONSE FALSE MILA');
        alert(unitResponse?.data?.message);
      }
    }
  };

  // const handleOpenMeterSelection = () => {
  //   // console.log('e-ss--->');
  //   setMeterMenuVisible(true);
  //   callApi();
  // };

  const checkingSerial = async () => {
    let data = {
      device_serial_number: slide2[0].value,
    };
    const SerialResponse = await API.post(
      '/property/equipment/unit/get-meter-info',
      data,
    );
    setCheckSerial(false);
    if (!SerialResponse?.data?.bool) {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
      setSliderNumber(sliderNumber + 1);
      setSliderProgress(sliderProgress + 0.25);
    } else {
      Alert.alert(
        'Device Serial Already Exists',
        'Please type or scan another Device Serial Number',
      );
    }
  };

  const doSome = (item, index) => {
    // let UtilArray = typeof items !== 'undefined' ? [...items] : [...selectUtil];
    let ManuArray = [...defaultManuLis];
    // console.log('Utility DATA', UtilArray);
    console.log('SLIDE  ', ManuArray);
    let empSlide = [...slide1]; // copying the old datas array
    empSlide[0].data = [];
    setSlide1(empSlide);
    let temp = [];
    let listSlide2 = [...slide1];
    ManuArray.map((manuItem) => {
      if (manuItem?.utility_type[0]?.name != undefined) {
        if (item.name == manuItem?.utility_type[0]?.name) {
          temp.push(manuItem);
          listSlide2[0].select = manuItem?.name;
          listSlide2[0].selectId = manuItem?.id;
          listSlide2[0].data = temp;
          if (manuItem?.devices.length > 0) {
            listSlide2[1].select = manuItem?.devices[0]?.name; // replace e.target.value with whatever you want to change it to
            listSlide2[1].selectId = manuItem?.devices[0]?.id;
            listSlide2[1].data = manuItem?.devices;
            // listSlide2[2].select = manuItem?.devices[0]?.model_nos[0]?.model_no; // replace e.target.value with whatever you want to change it to
            // listSlide2[2].selectId = manuItem?.devices[0]?.model_nos[0]?.id; // replace e.target.value with whatever you want to change it to
            const modelNos = manuItem.devices[0].model_nos.map((item) => {
              const { model_no: name, ...rest } = item;
              return { name, ...rest };
            });
            // listSlide2[2].data = modelNos;
            setProductNo(manuItem?.devices[0]?.product_desc);
          } else {
            listSlide2[1].select = ''; // replace e.target.value with whatever you want to change it to
            listSlide2[1].selectId = '';
            listSlide2[1].data = [];
            // listSlide2[2].select = ''; // replace e.target.value with whatever you want to change it to
            // listSlide2[2].selectId = ''; // replace e.target.value with whatever you want to change it to
            // listSlide2[2].data = [];
            setProductNo('');
          }
          setSlide1(listSlide2);
        }
      }
    });
  };

  const changeSlider = () => {
    if (!devEdit && sliderNumber == 2) {
      setCheckSerial(true);
      checkingSerial();
    } else if (sliderNumber == 4) {
      var dis = getDistance(
        {
          latitude: propertyLat,
          longitude: propertyLong,
        },
        {
          latitude: lat,
          longitude: long,
        },
      );
      if (dis > radialDis) {
        console.log('DIS BTW', dis);
        console.log('RADIAL DIS', radialDis);

        Toast.show('Add Meter inside the permises of Property', Toast.SHORT);
      } else {
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        setSliderNumber(sliderNumber + 1);
        setSliderProgress(sliderProgress + 0.25);
      }
    } else {
      if (sliderNumber == 1) {
        // let UtilArray = [...selectUtil];
        // let ManuArray = [...defaultManuLis];
        // console.log('Utility DATA', UtilArray);
        // console.log('SLIDE DATA', ManuArray);
        // let empSlide = [...slide1]; // copying the old datas array
        // empSlide[0].data = [];
        // setSlide1(empSlide);
        // const filterManu = UtilArray.filter((item) => {
        //   ManuArray.map((manuItem) => {
        //     if (manuItem?.utility_type[0]?.name != undefined) {
        //       console.log('Current Utility Name', item.name);
        //       console.log('Current manuItem', manuItem?.utility_type[0]?.name);
        //       if (item.name == manuItem?.utility_type[0]?.name) {
        //         console.log('Current manuItem', manuItem);
        //         let listSlide = [...slide1]; // copying the old datas array
        //         listSlide[0].data.push(manuItem);
        //         setSlide1(listSlide);
        //         console.log('LIST SLIDE', listSlide[0].data);
        //       }
        //     }
        //   });
        // });
        // const defaultDevices = defaultData.devices;
        // console.log('default Devices', defaultDevices);
        // const filterDevices = defaultDevices.filter(
        //   (item) => item.manufacturer_id === slide1[0].data[0]?.id,
        // );
        // setDefaultInfoData(filterDevices);
        // console.log('Filter Devices', filterDevices);
        // let listSlide = [...slide1]; // copying the old datas array
        // listSlide[0].select = filterDevices[0]?.manufacturer; // replace e.target.value with whatever you want to change it to
        // listSlide[0].selectId = filterDevices[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
        // listSlide[1].select = filterDevices[0]?.name; // replace e.target.value with whatever you want to change it to
        // listSlide[1].selectId = filterDevices[0]?.id; // replace e.target.value with whatever you want to change it to
        // listSlide[2].select = filterDevices[0]?.model_nos[0]?.model_no; // replace e.target.value with whatever you want to change it to
        // listSlide[2].selectId = filterDevices[0]?.model_nos[0]?.id; // replace e.target.value with whatever you want to change it to
        // setProductNo(filterDevices[0]?.product_desc);
        // setSlide1(listSlide);
      }

      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
      setSliderNumber(sliderNumber + 1);
      setSliderProgress(sliderProgress + 0.25);
    }
  };

  const finishSlider = () => {
    setLoadMeters(true);
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowAddType(false);
    console.log('selectedID', selectedDevId);
    // if (selectedDevId != null) {
    //   const addMeter = meterListData.filter((item) => item.id != selectedDevId);
    //   console.log('ADDMETER', addMeter);
    //   setMeterListData(addMeter);
    // }
    setLetsFinish(true);

    // console.log('meterArray------>', meterArray);
    setStatusAnimation(false);

    setShowAddMeterSlider(false);
    alert('Meter information added succesfully');
  };

  useUpdateEffect(() => {
    if (letsFinish) {
      updateData();
    }
  }, [letsFinish]);

  useUpdateEffect(() => {
    console.log('Get meterData Information---->>', meterData);
  }, [meterData]);

  const updateData = () => {
    const reasonBase64s = [];
    for (let i = 0; i < reasonPath?.length; i++) {
      reasonBase64s.push(`data:image/jpeg;base64,${reasonPath[i]?.base64}`);
    }
    let meterVals = {
      device: {
        manufacturer_id: slide1[0].selectId,
        product_desc: productNo,
      },

      id: devEdit ? selectedDevId : null,
      // meter_name: [{id: newMeter.id, name: newMeter.name}],
      // model_no_id: slide1[2].selectId,
      device_serial_number: slide2[0].value,
      device_id: slide1[1].selectId,
      initial_meter_reading: slide2[1].value,
      latitude: lat,
      longitude: long,
      defaultLatitude: propertyLat,
      defaultLongitude: propertyLong,
      attachedTo_id: attachedToId,
      attachedTo_name: attachedTo,
      thumbnail: filePath,
      installation_status: installationStatus,
      utility_type_id: selectedUtilId,
      reasons: [
        {
          options_reason_id: reasonId,
          text_reason: reasonDes,
          picture: reasonBase64s,
        },
      ],
    };
    var meterArray = [...meterListData]; // copying the old datas array
    if (editMeterIndex != null) {
      console.log('IF CHAL', meterVals);
      let meterData = [...meterListData];
      meterData[editMeterIndex] = meterVals;
      setMeterListData(meterData);
    } else {
      meterArray.push(meterVals);
      console.log('ELSE CHAL');
      setMeterListData(meterArray);
    }

    setLetsFinish(false);
    setLetsUpdateMeterData(true);
  };
  useUpdateEffect(() => {
    if (letsUpdateMeterData) {
      updateMeterData();
    }
  }, [letsUpdateMeterData]);

  const updateMeterData = () => {
    const reasonBase64s = [];
    for (let i = 0; i < reasonPath?.length; i++) {
      reasonBase64s.push(`data:image/jpeg;base64,${reasonPath[0]?.base64}`);
    }
    console.log('METERLISTDATA BATAO', meterListData);
    console.log('METERDATA BATAO', meterData);
    var loopData = [...meterData];
    let meterVals = {};
    meterListData?.map((item) => {
      console.log('Get REASONS Information---->>', item.reasons);
      let newReasonArr = [...reasonArr];
      if (type != 'add' || type != 'addMeterDirect') {
        newReasonArr.push({
          options_reason_id:
            item?.reasons[0]?.options_reason_id == null
              ? 0
              : item?.reasons[0]?.options_reason_id,
          text_reason:
            item?.reasons[0]?.text_reason == null
              ? 0
              : item?.reasons[0]?.text_reason,
          picture: reasonBase64s,
        });
      }
      meterVals = {
        device_serial_number: item.device_serial_number,
        device_id: item.device_id,
        device: item.device,
        initial_meter_reading: item.initial_meter_reading,
        latitude: item.latitude,
        longitude: item.longitude,
        defaultLatitude: propertyLat,
        defaultLongitude: propertyLong,
        ...(item.id != null && { id: item.id }),
        // id: item.id,
        attachedTo_id: item.attachedTo_id,
        thumbnail: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
        utility_type_id: item.utility_type_id,
        installation_status: Number(item.installation_status),
        ...(item.installation_status == 2 &&
          (type == 'add' || type == 'addMeterDirect'
            ? {
              reason:
                item.reasons == undefined
                  ? []
                  : {
                    options_reason_id:
                      item?.reasons[0]?.options_reason_id == null
                        ? 0
                        : item?.reasons[0]?.options_reason_id,
                    text_reason:
                      item?.reasons[0]?.text_reason == null
                        ? 0
                        : item?.reasons[0]?.text_reason,
                    picture: [`data:image/jpeg;base64,${reasonBase64s}`],
                  },
            }
            : {
              reasons: item.reasons == undefined ? [] : newReasonArr,
            })),
      };
    });
    if (editMeterIndex != null) {
      console.log('METER DATA IF CHALA');
      let data = [...meterData];
      data[editMeterIndex] = meterVals;
      setMeterData(loopData);
    } else {
      console.log('METER DATA ELSE CHALA');
      loopData.push(meterVals);
      console.log('LOOP DATA', loopData);
      setMeterData(loopData);
    }
    setLetsUpdateMeterData(false);
    // console.log('oldMeterListData finishSlider----->>>>>', meterArray);
    cancelMeter();
  };

  const typeSwitcher = (arg) => {
    switch (arg.toLowerCase()) {
      case 'hot water':
        return require('../../../../../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../../../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../../../../../Images/electric.png');
      case 'gas':
        return require('../../../../../../../Images/gass.png');
      case 'water':
        return require('../../../../../../../Images/all-waters.png');
      default:
        break;
    }
  };

  const renderSlide3 = (item, index) => {
    // console.log('index check slider 3 ---> ',index)
    if (index == 1 && item.value == null) {
      let newArr = [...slide2]; // copying the old datas array
      newArr[index].value = '0'; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
    }
    return (
      <View style={{ width: width * 0.8 }} key={item.id}>
        {index < 2 && (
          <Text style={[styles.meterDesciptionHeading, { top: width * 0.01 }]}>
            {item.name}
          </Text>
        )}
        {index < 2 && (
          <Text_Input
            placeholder={item.name}
            value={index == 1 && item.value == null ? '0' : item.value}
            keyboardType={index == 1 ? 'numeric' : 'default'}
            error={item.error}
            right={
              index == 0 &&
              (type == 'meterDirect' || type == 'addMeterDirect' ? null : (
                <TextInput.Icon
                  disabled={
                    devEdit
                      ? true
                      : (index == 0 && type == 'meterDirect') ||
                        type == 'addMeterDirect'
                        ? true
                        : false
                  }
                  name={() => (
                    <TouchableOpacity
                      disabled={
                        devEdit
                          ? true
                          : (index == 0 && type == 'meterDirect') ||
                            type == 'addMeterDirect'
                            ? true
                            : false
                      }
                      onPress={() => toggleScanner(index)}
                      style={{ zIndex: 1 }}>
                      <Ionicons name="scan" size={width * 0.06} />
                    </TouchableOpacity>
                  )}
                />
              ))
            }
            onChangeText={(text) =>
              index == 0
                ? type == 'meterDirect' || type == 'addMeterDirect'
                  ? null
                  : onChangeMultipleField(text, index)
                : onChangeMultipleField(text, index)
            }
            disabled={
              devEdit
                ? true
                : (index == 0 && type == 'meterDirect') ||
                  type == 'addMeterDirect'
                  ? true
                  : false
            }
            style={{
              ...styles.meterInput,
              marginVertical: width * 0.02,
            }}
          />
        )}
        {index == 2 && showAddType !== 'Attached To' ? (
          <View style={{ margin: 0 }}>
            <Text style={[styles.meterDesciptionHeading]}>Attached To*</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginVertical: width * 0.02,
              }}>
              <Searchable_Dropdown
                onItemSelect={(item) => {
                  // getDevice(item, index);
                  setAttachedToId(item.id);
                  setAttachedTo(item.name);
                }}
                containerStyle={{
                  width: width * 0.7,
                }}
                itemStyle={{
                  padding: width * 0.027,
                  backgroundColor: 'rgb(247, 247, 247)',
                  borderColor: '#bbb',
                  borderWidth: width * 0.0015,
                  borderRadius: width * 0.015,
                }}
                itemTextStyle={{ color: '#222' }}
                itemsContainerStyle={{
                  maxHeight: width * 0.25,
                }}
                // items={item.data}
                items={attachedToData}
                resetValue={false}
                textInputProps={{
                  placeholder: 'Select Attached To',
                  underlineColorAndroid: 'transparent',
                  trueIcon: 'chevron-up',
                  falseIcon: 'chevron-down',
                  style: {
                    margin: 0,
                    borderTopLeftRadius: width * 0.015,
                    borderBottomLeftRadius: width * 0.015,
                    borderTopRigthRadius: 0,
                    borderBottomRightRadius: 0,
                    borderColor: 'black',
                    height: width * 0.13,
                    backgroundColor: '#F6F6F6',
                    borderTopWidth: width * 0.0019,
                    borderLeftWidth: width * 0.0019,
                    borderBottomWidth: width * 0.0019,
                    borderRightWidth: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  onTextChange: (text) => {
                    onChangeAttachedTo(text);
                  },
                  // onFocus: () => {
                  //   setVerticalOffs(-180);
                  //   console.log('chala onFoucs');
                  // },
                  value: setTimeout(() => attachedTo, 200),
                  defaultValue: attachedTo,
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
              <TouchableOpacity
                style={{
                  width: width * 0.1,
                  backgroundColor: '#25AAE199',
                  borderTopRightRadius: width * 0.015,
                  borderBottomRightRadius: width * 0.015,
                  borderTopWidth: width * 0.0019,
                  borderRightWidth: width * 0.0019,
                  borderBottomWidth: width * 0.0019,
                  height: width * 0.134,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => showAddNewType('Attached To')}>
                <Icon size={width * 0.06} color="#fff" name={'add'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          index == 2 && (
            <View style={{ borderTopWidth: 2, paddingVertical: 10 }}>
              <View>
                <Text style={styles.meterDesciptionHeading}>
                  Add New {showAddType}
                </Text>
              </View>
              <Text_Input
                placeholder={'Type new Attached To'}
                value={addAttached}
                style={{ ...styles.meterInput, marginVertical: width * 0.02 }}
                onChangeText={(text) => {
                  setAddAttached(text);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: width * 0.03,
                }}>
                <TouchableOpacity onPress={cancelAddNewType}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: width * 0.045,
                      color: '#25AAE1ec',
                      width: width * 0.2,
                      textAlign: 'center',
                      borderWidth: 2,
                      borderColor: '#25AAE1ec',
                      borderRadius: 5,
                      padding: 3,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={doneAddType}
                  disabled={
                    showAddType == 'Manufacturer' && addManufacturer
                      ? false
                      : showAddType != 'Manufacturer' &&
                        addDevice[0].selectId &&
                        addDevice[1].selectId &&
                        addDevice[2].select
                        ? false
                        : showAddType == 'Utility' && addUtility
                          ? false
                          : showAddType == 'Attached To' && addAttached
                            ? false
                            : true
                  }>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: width * 0.045,
                      color:
                        showAddType == 'Manufacturer' && addManufacturer
                          ? '#25AAE1ec'
                          : showAddType != 'Manufacturer' &&
                            addDevice[0].selectId &&
                            addDevice[1].selectId &&
                            addDevice[2].select
                            ? '#25AAE1ec'
                            : showAddType == 'Utility' && addUtility
                              ? '#25AAE1ec'
                              : showAddType == 'Attached To' && addAttached
                                ? '#25AAE1ec'
                                : '#D0D0D0',
                      width: width * 0.15,
                      borderWidth: 2,
                      borderColor:
                        showAddType == 'Manufacturer' && addManufacturer
                          ? '#25AAE1ec'
                          : showAddType != 'Manufacturer' &&
                            addDevice[0].selectId &&
                            addDevice[1].selectId &&
                            addDevice[2].select
                            ? '#25AAE1ec'
                            : showAddType == 'Utility' && addUtility
                              ? '#25AAE1ec'
                              : showAddType == 'Attached To' && addAttached
                                ? '#25AAE1ec'
                                : '#D0D0D0',
                      borderRadius: 5,
                      padding: 3,
                      textAlign: 'center',
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      </View>
    );
  };

  const renderSlide5 = ({ item, index }) => {
    // console.log('index check slider 3 ---> ',index)
    return (
      <View style={{ width: width * 0.8 }} key={item.id}>
        <Text style={[styles.meterDesciptionHeading, { top: width * 0.01 }]}>
          {item.name}
        </Text>
        <Text_Input
          placeholder={item.name}
          value={item.value}
          keyboardType={index == 1 ? 'numeric' : 'default'}
          error={item.error}
          onChangeText={(text) =>
            index == 0
              ? type == 'meterDirect' || type == 'addMeterDirect'
                ? null
                : onChangeMultipleField(text, index)
              : onChangeMultipleField(text, index)
          }
          disabled={
            type == 'meterDirect' || type == 'addMeterDirect' ? true : false
          }
          style={styles.meterInput}
        />
      </View>
    );
  };

  const selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    setSelectLocation(true);
  };

  const _renderMap = (oldPos) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Positon Batao', position);
        // var lat = parseFloat(position.coords.latitude);
        // var long = parseFloat(position.coords.longitude);
        var lat = parseFloat(propertyLat);
        var long = parseFloat(propertyLong);

        if (!oldPos) {
          setLat(lat);
          setLong(long);
        }

        // this.setState({initialPosition: initialRegion});
        // console.log('What we Get', this.state.initialPosition);
        setMarkers([
          {
            coordinate: {
              latitude: lat,
              longitude: long,
            },
          },
        ]);
      },
      (error) => console.log('geo location', error),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    );
  };

  const cameraLaunch = (type) => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
      includeBase64: true,
    };
    ImagePicker.launchCamera(options, (res) => {
      // console.log('Response = ', res);

      if (res.didCancel) {
        // console.log('User cancelled image picker');
      } else if (res.error) {
        // console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        // console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        // console.log('response', res);
        if (type == 'reason') {
          if (reasonPath.length < 5) {
            const imageArr = [...reasonPath];
            imageArr.push(res.assets[0]);
            setReasonPath(imageArr);
          } else {
            alert("Can't upload more than 5 photos");
          }
        } else {
          setImageBase64(res.assets[0].base64);
          setFilePath(res.assets[0].uri);
        }
      }
    });
  };

  const moveMarker = (region, gesture) => {
    if (gesture.isGesture) {
      setLat(region?.latitude);
      setLong(region?.longitude);
      setLatDelta(region?.latitudeDelta);
      setLongDelta(region?.longitudeDelta);
    }
  };

  const catchLocation = (region) => {
    setLat(region?.lat);
    setLong(region?.lng);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      setLat(lat);
      setLong(long);
    });
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      console.log('Keyboard Shown');
      setScroll(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyboard Hidden');
      setVerticalOffs(-400);
      setScroll(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const getPropertyLocation = () => {
    var lat = parseFloat(propertyLat);
    var long = parseFloat(propertyLong);
    setLat(lat);
    setLong(long);
  };

  const imageGalleryLaunch = (type) => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        // console.log('User cancelled image picker');
      } else if (res.error) {
        // console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        // console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        // console.log('response', res);
        if (type == 'reason') {
          if (reasonPath.length < 5) {
            const imageArr = [...reasonPath];
            imageArr.push(res.assets[0]);
            setReasonPath(imageArr);
          } else {
            alert("Can't upload more than 5 photos");
          }
        } else {
          setImageBase64(res.assets[0].base64);
          setFilePath(res.assets[0].uri);

          console.log('FIle PAth Array');
        }
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
      }
    });
  };

  const removeImage = (index, type) => {
    if (type == 'reason') {
      const imageArr = [...reasonPath];
      imageArr.splice(
        reasonPath.findIndex((i) => i.uri === index),
        1,
      );
      setReasonPath(imageArr);
    }
  };

  const cancelMeter = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setAddTypeInput(false);
    setAddNewType(false);
    setShowAddType('');

    setDefaultDeviceValues(false);
    setDefaultMeterValues(false);
    setNewMeterFlag(true);
    setSliderNumber(1);
    setSliderProgress(0);
    setReasonText('');
    setReasonId(null);
    setReasonDes('');
    setInstallationStatus(0);
    setStatusAnimation(false);
    setFilePath('');
    setReasonPath([]);
    setReasonArr([]);
    setAttachedToId(null);
    setAttachedTo('');
    setProductNo('');
    setAddModelNo('');
    setAddProductNo('');
    setSelectUtil([]);
    setSelectedDevId(null);
    setDefaultScreen(false);
    slide1?.map((item, index) => {
      let newArr = [...slide1];
      newArr[index].data = [];
      newArr[index].select = '';
      newArr[index].selectId = '';
    });
    slide2?.map((item, index) => {
      let newArr = [...slide2];
      newArr[0].value = '';
      newArr[1].value = '0';
      // newArr[2].value = '';
    });
    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
    }));
    setLoadMeters(false);
    setDevEdit(false);
    setExistingDev(false);
    setEditMeterIndex(null);
    setShowAddMeterSlider(false);
  };

  const showAddNewType = (value) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    // setAddNewType(true);
    console.log('Value', value);
    setShowAddType(value);
    if (value == 'Model Number') {
      setEnableDevice(false);
      console.log('Model Number Adding------');
      getAllDevices();
    }
  };

  const getNewDeviceData = (value, index) => {
    let listSlide = [...addDevice]; // copying the old datas array
    listSlide[index].select = value?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = value?.id; // replace e.target.value with whatever you want to change it to
    setAddDevice(listSlide);
  };

  const onChangeNewDevice = (e, index) => {
    let listSlide = [...addDevice]; // copying the old datas array
    listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
    setAddDevice(listSlide);
  };

  const doneAddType = async () => {
    if (showAddType == 'Manufacturer') {
      let data = {
        name: addManufacturer,
      };
      const ManufacturersResponse = await API.post(
        '/property/equipment/manufacturer/add',
        data,
      );
      if (ManufacturersResponse?.data?.bool) {
        setShowAddType('');
        console.log('datachecckk-->>', ManufacturersResponse?.data?.data);
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        callApi();
        cancelAddNewType();
      } else {
        alert(ManufacturersResponse?.data?.message);
      }
    } else if (showAddType == 'Model Number') {
      let data = {
        model_no: addModelNumber,
        device_id: selectedDevice?.id,
      };
      setLoadingState(true);
      const ModelNumberResponse = await API.post(
        '/property/equipment/model-number/number',
        data,
      );
      if (ModelNumberResponse?.data?.bool) {
        console.log('datachecckk-->>', ModelNumberResponse?.data?.data);
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        setLoadingState(false);
        cancelAddNewType();
      } else {
        alert(ModelNumberResponse?.data?.message);
        setLoadingState(false);
      }
    } else if (showAddType == 'Utility') {
      let data = {
        name: addUtility,
      };
      setLoadingState(true);
      const UtilityResponse = await API.post(
        '/property/equipment/utility-type',
        data,
      );
      if (UtilityResponse?.data?.bool) {
        console.log('datachecckk-->>', UtilityResponse?.data?.data);
        setShowAddType('');
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        setLoadingState(false);
        callApi();
        cancelAddNewType();
      } else {
        alert(UtilityResponse?.data?.message);
        setLoadingState(false);
      }
    } else if (showAddType == 'Attached To') {
      let data = {
        name: addAttached,
      };
      setLoadingState(true);
      const AttachedToResponse = await API.post(
        '/property/equipment/attached_to/attach',
        data,
      );
      if (AttachedToResponse?.data?.bool) {
        console.log('datachecckk-->>', AttachedToResponse?.data?.data);
        setShowAddType('');
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        setLoadingState(false);
        callApi();
        cancelAddNewType();
      } else {
        alert(AttachedToResponse?.data?.message);
        setLoadingState(false);
      }
    } else {
      //* FIXME: Device Adding
      let data = {
        name: addDevice[1].select,
        manufacturer_id: slide1[0].selectId,
        device_type_id: addDevice[0].selectId,
        model_nos: modelArr,
        product_desc: addProductNo,
      };
      const DeviceTypesResponse = await API.post(
        '/property/equipment/device/add',
        data,
      );
      if (DeviceTypesResponse?.data?.bool) {
        console.log('datachecckk-->>', DeviceTypesResponse?.data?.data);
        LayoutAnimation.configureNext({
          duration: 300,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
        cancelAddNewType();
        callApi();
      } else {
        alert(DeviceTypesResponse?.data?.message);
      }
    }
  };

  const removeSelections = (items) => {
    doSome(items);
    let listSlide = [...slide1];
    listSlide[0].selectId = '';
    listSlide[0].select = '';

    setSlide1(listSlide);
  };

  const cancelAddNewType = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setAddNewType(false);
    let deviceData = [...addDevice]; // copying the old datas array
    deviceData[0].select = '';
    deviceData[0].selectId = '';
    deviceData[1].select = '';
    deviceData[1].selectId = '';
    // deviceData[2].select = '';
    // deviceData[2].selectId = '';
    setAddDevice(deviceData);
    setAddManufacturer('');
    setAddUtility('');
    setAddAttached('');
    setShowAddType('');
    setAddTypeInput(false);
    setNewMeterFlag(true);
    setDevicesArray([]);
    setSelectedDevice({});
    setAddModelNumber('');
  };

  const getMeterData = async (data, index) => {
    callApi(true);
    setSelectedMeter(index + 1);
    console.log('Unit Mix Id', data.unit_mix_id);
    if (data.id) {
      console.log('DATA.ID', data.id);
      setDevEdit(true);
      setSelectedDevId(data.id);
      setEditMeterIndex(index);
    } else {
      setExistingDev(true);
      setEditMeterIndex(index);
      setSelectedDevId(null);
    }
    setLoadManufacturers(true);
    console.log('DATA', data);
    setDefaultMeterValues(false);
    setDefaultDeviceValues(false);
    setNewMeterFlag(false);
    unitMix?.map((item) => {
      if (item.id == data.unit_mix_id) {
        setSelectedUnitMix(item.name);
      }
    });
    setReasonArr(data.reasons);
    setLat(data.latitude);
    setLong(data.longitude);
    setProductNo(data.device.product_desc);
    setAttachedToId(data.attachedTo_id);
    setAttachedTo(data.attachedTo_name);
    console.log('GET METER DATA', data.installation_status);
    if (data.installation_status == 1) {
      setInstallationStatus(data.installation_status);
      setStatusAnimation(true);
    } else {
      setInstallationStatus(0);
      setStatusAnimation(false);
    }
    setFilePath(data.thumbnail);
    setReasonPath([]);
    setSelectedUtilId(data.utility_type_id);
    utilTypes.filter((item) => {
      if (item.id == data.utility_type_id) {
        setSelectedUtil(item.name);
      }
    });

    let newArr = [...slide2];
    newArr[0].value = data.device_serial_number;
    newArr[1].value = data.initial_meter_reading;

    let deviceData = [...slide1];
    deviceData[0].selectId = data.device.manufacturer_id;
    deviceData[1].selectId = data.device_id;
    const manuData = await API.get(`/property/equipment/manufacturer/all`);
    let manuLis = [];
    if (manuData.data.bool) {
      manuLis = manuData.data.data;

      manuLis?.filter((item) => {
        if (item.id == data.device.manufacturer_id) {
          deviceData[0].select = item.name;
          item.devices.filter((devItem) => {
            if (devItem.id == data.device_id) {
              deviceData[1].select = devItem.name;
            }
          });
        }
      });
      setLoadManufacturers(false);
    }

    // setLoadManufacturers(false);
    // setShowAddMeterSlider(false);

    // setNewMeter((oldState) => ({
    //   ...oldState,
    //   id: data?.meter_name[0]?.id,
    //   name: data?.meter_name[0]?.name,
    //   number: index + 1,
    // }));
  };

  const slideBacker = () => {
    setSliderNumber(sliderNumber - 1);
    setSliderProgress(sliderProgress - 0.25);
    setShowAddType(false);
  };

  const [verticalOffs, setVerticalOffs] = useState(-400);

  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        statusBarTranslucent
        style={{ margin: 0 }}
        // onBackdropPress={() => se7tShowAddMeterSlider(false)}
        isVisible={modalVisible}>
        {isActivityLoader ? (
          <View styles={styles.boxInner}>
            <View styles={styles.boxHeader}>
              <ActivityIndicator color="#25AAE1ec" size="large" />
            </View>
          </View>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            scrollEnabled={
              sliderNumber == 1
                ? true
                : sliderNumber == 2
                  ? true
                  : showAddType == 'Device'
                    ? true
                    : false
            }
            contentContainerStyle={{ backgroundColor: '#fff' }}
            style={{
              flex: 1,
              marginBottom: scroll ? 150 : 0,
              backgroundColor: '#fff',
            }}>
            {showAddMeterSlider ? (
              selectLocation ? (
                <View
                  style={{
                    height: width * 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: width * 0.03,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      zIndex: 2,
                      position: 'absolute',
                      top: width * 0.04,
                      width: width * 0.72,
                    }}>
                    <GooglePlacesAutocomplete
                      placeholder="Address"
                      query={{
                        key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                        language: 'en', // language of the results
                      }}
                      fetchDetails={true}
                      onPress={(data, details) =>
                        catchLocation(details.geometry.location)
                      }
                      onFail={(error) => console.error(error)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => getPropertyLocation()}
                    style={[styles.doneButton, { bottom: width * 0.32 }]}>
                    <Icon
                      size={width * 0.07}
                      color="#fff"
                      name={'location-city'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => getCurrentLocation()}
                    style={[styles.doneButton, { bottom: width * 0.18 }]}>
                    <Icon size={width * 0.07} color="#fff" name={'gps-fixed'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectLocation(false)}
                    style={styles.doneButton}>
                    <Icon
                      size={width * 0.07}
                      color="#fff"
                      name={sliderNumber == 5 ? 'check' : 'navigate-next'}
                    />
                  </TouchableOpacity>
                  {markers.length > 0 && (
                    <View
                      style={{
                        // backgroundColor: 'blue',
                        width: width * 0.12,
                        // height: height * 0.11,
                        zIndex: 1,
                        position: 'absolute',
                        top: width * 0.4,
                        alignItems: 'center',
                      }}>
                      <Icon
                        size={width * 0.12}
                        color="#f00"
                        name={'location-pin'}
                      />
                    </View>
                  )}
                  {markers.length > 0 ? (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: width * 0.3,
                      }}>
                      <MapView
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: width * 0.03,
                        }}
                        // scrollEnabled={false}
                        // initialRegion={{
                        //   latitude: lat,
                        //   longitude: long,
                        //   latitudeDelta: LATITUDE_DELTA,
                        //   longitudeDelta: LONGITUDE_DELTA,
                        // }}
                        region={{
                          latitude: lat,
                          longitude: long,
                          latitudeDelta: latDelta,
                          longitudeDelta: longDelta,
                        }}
                        zoomEnabled={true}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        onRegionChangeComplete={(e, ges) => moveMarker(e, ges)}
                      // onPress={(e) => this.getLocation(e)}
                      >
                        <Marker
                          coordinate={{
                            latitude: parseFloat(propertyLat),
                            longitude: parseFloat(propertyLong),
                          }}
                          title={'Property Location'}
                          // icon={require('../../../../../../../Images/Proplocate.png')}
                          draggable>
                          <Image
                            source={require('../../../../../../../Images/Proplocate.png')}
                            // resizeMode="center"
                            style={{
                              width: width * 0.2,
                              height: height * 0.08,
                              // backgroundColor: 'red',
                            }}
                          />
                        </Marker>
                        <Circle
                          center={{
                            latitude: parseFloat(propertyLat),
                            longitude: parseFloat(propertyLong),
                          }}
                          radius={radialDis}
                          fillColor="rgba(12,170,225,0.3)"
                          strokeColor="rgba(12,170,225,1)"
                        />
                      </MapView>
                    </View>
                  ) : null}
                </View>
              ) : addNewType ? (
                <View style={styles.boxInner}>
                  <View
                    style={{
                      // height: width * 0.18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      // width: width * 0.85,
                    }}>
                    <Text
                      style={[
                        styles.meterDesciptionHeading,
                        { fontSize: width * 0.06 },
                      ]}>
                      Add {showAddType}
                    </Text>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: width * 0,
                        top: width * 0.025,
                      }}
                      onPress={() =>
                        Alert.alert(
                          'Alert',
                          'Are you sure you want to clear current selected data',
                          [
                            { text: 'No', style: 'cancel' },
                            {
                              text: 'Yes',
                              onPress: cancelAddNewType,
                            },
                          ],
                        )
                      }>
                      <Icon
                        name="cancel"
                        size={width * 0.06}
                        color="black"
                        maxOpacity={0.5}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: width * 0.62,
                      width: width * 0.8,
                      justifyContent: 'center',
                    }}>
                    {showAddType == 'Manufacturer' && (
                      <View>
                        <View>
                          <Text style={[styles.meterDesciptionHeading]}>
                            New {showAddType}
                          </Text>
                        </View>
                        <Text_Input
                          placeholder={'Type new manufacturer'}
                          value={addManufacturer}
                          style={styles.meterInput}
                          onChangeText={(text) => {
                            setAddManufacturer(text);
                          }}
                        />
                      </View>
                    )}
                    {showAddType == 'Device' && (
                      <View style={{ zIndex: 10 }}>
                        {addDevice &&
                          addDevice?.map((item, index) => (
                            <View
                              style={{
                                width: width * 0.8,
                                // zIndex: 9,
                              }}
                              key={item.id}>
                              <View>
                                <Text style={styles.meterDesciptionHeading}>
                                  {item.name}
                                </Text>
                              </View>
                              {index < 2 ? (
                                <Searchable_Dropdown
                                  onItemSelect={(items) => {
                                    getNewDeviceData(items, index);
                                  }}
                                  containerStyle={{
                                    paddingBottom: width * 0.02,
                                  }}
                                  itemStyle={{
                                    padding: width * 0.027,
                                    backgroundColor: '#fff',
                                    borderColor: '#bbb',
                                    borderWidth: width * 0.0015,
                                    borderRadius: width * 0.015,
                                    margin: width * 0.005,
                                  }}
                                  itemTextStyle={{ color: '#222' }}
                                  itemsContainerStyle={
                                    Platform.OS == 'android'
                                      ? {
                                        height: width * 0.2,
                                        zIndex: 1,
                                        position: 'absolute',
                                        width: width * 0.8,
                                        top: width * 0.1,
                                        flex: 1,
                                        zIndex: 20,
                                        backgroundColor: 'white',
                                        elevation: width * 0.01,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                          width: 0,
                                          height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                      }
                                      : { height: width * 0.2, zIndex: 1 }
                                  }
                                  items={item.data}
                                  resetValue={false}
                                  textInputProps={{
                                    placeholder: item.name,
                                    underlineColorAndroid: 'transparent',
                                    trueIcon: 'chevron-up',
                                    falseIcon: 'chevron-down',
                                    style: {
                                      margin: 0,
                                      borderRadius: width * 0.015,
                                      height: width * 0.13,
                                      backgroundColor: '#F6F6F6',
                                      borderWidth: width * 0.0019,
                                    },
                                    onTextChange: (text) => {
                                      onChangeNewDevice(text, index);
                                    },
                                    value: setTimeout(() => item.select, 200),
                                    defaultValue: item.select,
                                  }}
                                  listProps={{
                                    nestedScrollEnabled: true,
                                  }}
                                />
                              ) : (
                                <View>
                                  <Text_Input
                                    placeholder={'Type new Device'}
                                    value={item.select}
                                    style={styles.meterInput}
                                    onChangeText={(text) => {
                                      onChangeNewDevice(text, index);
                                    }}
                                  />
                                  <View>
                                    <View>
                                      <Text
                                        style={styles.meterDesciptionHeading}>
                                        Model Number* (Bekkar hai)
                                      </Text>
                                    </View>
                                    <Text_Input
                                      placeholder="Type Model Number"
                                      value={addModelNo}
                                      style={styles.meterInput}
                                      onChangeText={(text) => {
                                        setAddModelNo(text);
                                      }}
                                    />
                                  </View>
                                  <View>
                                    <View>
                                      <Text
                                        style={styles.meterDesciptionHeading}>
                                        Product Description*
                                      </Text>
                                    </View>
                                    <Text_Input
                                      placeholder="Type Product Description"
                                      value={addProductNo}
                                      style={styles.meterInput}
                                      onChangeText={(text) => {
                                        setAddProductNo(text);
                                      }}
                                    />
                                  </View>
                                </View>
                              )}
                            </View>
                          ))}
                      </View>
                    )}
                    {showAddType == 'Utility' && (
                      <View>
                        <View>
                          <Text style={[styles.meterDesciptionHeading]}>
                            New {showAddType} Type
                          </Text>
                        </View>
                        <Text_Input
                          placeholder="Type new utility"
                          value={addUtility}
                          style={styles.meterInput}
                          onChangeText={(text) => {
                            setAddUtility(text);
                          }}
                        />
                      </View>
                    )}
                    {showAddType == 'Attached To' && (
                      <View>
                        <View>
                          <Text style={[styles.meterDesciptionHeading]}>
                            Add New {showAddType}
                          </Text>
                        </View>
                        <Text_Input
                          placeholder={'Type new Attached To'}
                          value={addAttached}
                          style={styles.meterInput}
                          onChangeText={(text) => {
                            setAddAttached(text);
                          }}
                        />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={doneAddType}
                    style={[
                      styles.doneButton,
                      {
                        backgroundColor:
                          showAddType == 'Manufacturer' && addManufacturer
                            ? '#25AAE1ec'
                            : showAddType != 'Manufacturer' &&
                              addDevice[0].selectId &&
                              addDevice[1].selectId &&
                              addDevice[2].select
                              ? '#25AAE1ec'
                              : showAddType == 'Utility' && addUtility
                                ? '#25AAE1ec'
                                : showAddType == 'Attached To' && addAttached
                                  ? '#25AAE1ec'
                                  : '#D0D0D0',
                      },
                    ]}
                    disabled={
                      showAddType == 'Manufacturer' && addManufacturer
                        ? false
                        : showAddType != 'Manufacturer' &&
                          addDevice[0].selectId &&
                          addDevice[1].selectId &&
                          addDevice[2].select
                          ? false
                          : showAddType == 'Utility' && addUtility
                            ? false
                            : showAddType == 'Attached To' && addAttached
                              ? false
                              : true
                    }>
                    <Icon size={width * 0.07} color="#fff" name={'add'} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    height: height,
                    padding: 20,
                    backgroundColor: 'white',
                    // backgroundColor: 'pink',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    // borderRadius: width * 0.03,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      height: width * 0.18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 8,
                    }}>
                    <View
                      style={{
                        width: width * 0.85,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        height: width * 0.25,
                      }}>
                      <Text
                        style={[
                          styles.meterDesciptionHeading,
                          { fontSize: width * 0.045, fontWeight: 'bold' },
                        ]}>
                        Meter-
                        {newMeterFlag
                          ? meterListData.length + 1
                          : selectedMeter}
                      </Text>
                    </View>
                    {sliderNumber < 6 ? (
                      <TouchableOpacity
                        style={{
                          height: '100%',
                          width: '100%',
                          flexDirection: 'row-reverse',
                          position: 'absolute',
                          // right: 0,
                          top: 1,
                        }}
                        onPress={() =>
                          Alert.alert(
                            'Alert',
                            'Are you sure you want to clear current selected data',
                            [
                              { text: 'No', style: 'cancel' },
                              {
                                text: 'Yes',
                                onPress: cancelMeter,
                              },
                            ],
                          )
                        }>
                        <Icon
                          name="cancel"
                          size={width * 0.06}
                          color="black"
                          maxOpacity={0.5}
                        />
                      </TouchableOpacity>
                    ) : null}
                    <Progress.Bar
                      progress={sliderProgress}
                      width={width * 0.8}
                      color={'#25AAE1ec'}
                      style={{ marginBottom: width * 0.03 }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        width: width * 0.85,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.meterDesciptionHeading,
                          {
                            fontSize: width * 0.045,
                            height: width * 0.2,
                            top: -5,
                            textTransform:
                              sliderNumber == 4 ? 'none' : 'capitalize',
                          },
                        ]}>
                        {sliderNumber == 1 && showAddType == ''
                          ? 'Utility Type & Device Info'
                          : sliderNumber == 2
                            ? 'Attached To'
                            : sliderNumber == 3
                              ? 'Installation Image'
                              : sliderNumber == 4
                                ? 'GPS Location of Install'
                                : sliderNumber == 5
                                  ? 'Install Status'
                                  : ''}
                      </Text>
                    </View>
                    <View style={{ height: 5 }} />
                  </View>
                  {sliderNumber == 1 ? (
                    <View
                      style={{
                        flex: 1,
                        height: width * 0.8,
                        justifyContent: 'flex-start',
                        zIndex: 99,
                        overflow: 'hidden',
                      }}>
                      {loadingState ? (
                        <ActivityIndicator
                          size="large"
                          color="#25AAE1ec"
                          style={{ alignSelf: 'center', flex: 1 }}
                        />
                      ) : loadManufacturers ? (
                        <ActivityIndicator
                          size="large"
                          color="#25AAE1ec"
                          style={{ alignSelf: 'center', flex: 1 }}
                        />
                      ) : (
                        <View>
                          <View
                            style={{
                              flex: 1,
                              height: width * 0.8,
                              width: width * 0.9,
                              alignItems: 'center',
                            }}>
                            {!typeLoader ? (
                              <>
                                {!showAddType ? (
                                  <View
                                    style={{
                                      width: width * 0.8,
                                    }}>
                                    <Text style={styles.meterDesciptionHeading}>
                                      Utility Type*
                                    </Text>
                                    <View
                                      pointerEvents={'auto'}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        marginVertical: width * 0.015,
                                      }}>
                                      <Searchable_Dropdown
                                        onItemSelect={(item, index) => {
                                          // getDevice(item, index);
                                          console.log('Test', item);
                                          AddTypes(item);
                                          forceUpdate();
                                          doSome(item, index);
                                        }}
                                        containerStyle={{
                                          width: width * 0.8,
                                        }}
                                        itemStyle={{
                                          padding: width * 0.027,
                                          backgroundColor: 'rgb(247, 247, 247)',
                                          borderColor: '#bbb',
                                          borderWidth: width * 0.0015,
                                          borderRadius: width * 0.015,
                                        }}
                                        itemTextStyle={{ color: '#222' }}
                                        itemsContainerStyle={{
                                          maxHeight: height * 0.08,
                                        }}
                                        items={utilTypes}
                                        resetValue={false}
                                        textInputProps={{
                                          placeholder: 'Add Utility Type',
                                          underlineColorAndroid: 'transparent',
                                          trueIcon: 'chevron-up',
                                          falseIcon: 'chevron-down',
                                          style: {
                                            margin: 0,
                                            borderTopLeftRadius: width * 0.015,
                                            borderBottomLeftRadius:
                                              width * 0.015,
                                            borderColor: 'black',
                                            height: width * 0.13,
                                            backgroundColor: '#F6F6F6',
                                            borderTopWidth: width * 0.0019,
                                            borderLeftWidth: width * 0.0019,
                                            borderBottomWidth: width * 0.0019,
                                            borderRightWidth: width * 0.0019,
                                            borderTopRightRadius: width * 0.015,
                                            borderBottomRightRadius:
                                              width * 0.015,
                                          },
                                          // onFocus: () => setScroll(false),
                                          onTextChange: (text) => {
                                            setSelectedUtil(text);
                                            setSelectedUtilId(null);
                                          },
                                          value: setTimeout(
                                            () => selectedUtil,
                                            200,
                                          ),
                                          defaultValue: selectedUtil,
                                        }}
                                        listProps={{
                                          nestedScrollEnabled: true,
                                        }}
                                      />
                                    </View>
                                  </View>
                                ) : null}
                                {/* <View
                                  style={{
                                    alignItems: 'flex-end',
                                    marginVertical: height * 0.01,
                                    width: width * 0.8,
                                  }}>
                                  <Switch
                                    trackColor={{
                                      false: '#767577',
                                      true: '#81b0ff',
                                    }}
                                    thumbColor={'#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(val) =>
                                      getdefaultMeterData(val)
                                    }
                                    value={defaultMeterValues}
                                  />
                                </View> */}
                              </>
                            ) : (
                              <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator
                                  size={'large'}
                                  color="#25AAE1ec"
                                />
                              </View>
                            )}
                            {!showAddType ? (
                              <View>
                                {slide1?.map((item, index) => (
                                  <View
                                    style={{ width: width * 0.8 }}
                                    key={item.id}>
                                    <Text style={styles.meterDesciptionHeading}>
                                      {item.name}*
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        marginVertical: width * 0.015,
                                      }}>
                                      <Searchable_Dropdown
                                        onItemSelect={(item) => {
                                          getDevice(item, index);
                                        }}
                                        containerStyle={{
                                          width:
                                            index > 0
                                              ? width * 0.7
                                              : width * 0.8,
                                        }}
                                        itemStyle={{
                                          padding: width * 0.027,
                                          backgroundColor: 'rgb(247, 247, 247)',
                                          borderColor: '#bbb',
                                          borderWidth: width * 0.0015,
                                          borderRadius: width * 0.015,
                                        }}
                                        itemTextStyle={{ color: '#222' }}
                                        itemsContainerStyle={{
                                          maxHeight: height * 0.08,
                                        }}
                                        items={item.data}
                                        resetValue={false}
                                        textInputProps={{
                                          editable:
                                            index > 0
                                              ? slide1[0].selectId &&
                                                !defaultDeviceValues
                                                ? true
                                                : false
                                              : defaultDeviceValues
                                                ? false
                                                : true,

                                          placeholder:
                                            index == 0
                                              ? selectUtil.length > 0
                                                ? item.name
                                                : 'First Select Utility Type'
                                              : index == 1
                                                ? slide1[1].data.length > 0
                                                  ? item.name
                                                  : 'No Device'
                                                : index == 1
                                                  ? slide1[0].selectId
                                                    ? item.name
                                                    : 'First Select Manufacture'
                                                  : index == 2
                                                    ? slide1[1].selectId
                                                      ? item.name
                                                      : 'First Select Device'
                                                    : item.name,
                                          underlineColorAndroid: 'transparent',
                                          trueIcon: 'chevron-up',
                                          falseIcon: 'chevron-down',
                                          style: {
                                            margin: 0,
                                            borderTopLeftRadius: width * 0.015,
                                            borderBottomLeftRadius:
                                              width * 0.015,
                                            borderColor: item.error
                                              ? '#A3001B'
                                              : 'black',
                                            height: width * 0.13,
                                            backgroundColor: '#F6F6F6',
                                            borderTopWidth: width * 0.0019,
                                            borderLeftWidth: width * 0.0019,
                                            borderBottomWidth: width * 0.0019,
                                            borderRightWidth:
                                              index == 0 ? width * 0.0019 : 0,
                                            borderTopRightRadius:
                                              index == 0 ? width * 0.015 : 0,
                                            borderBottomRightRadius:
                                              index == 0 ? width * 0.015 : 0,
                                          },
                                          onTextChange: (text) => {
                                            onChangeManufacturer(text, index);
                                          },
                                          // onFocus: () => {
                                          //   console.log('Focused slide1 items');
                                          //   setScroll(true);
                                          // },
                                          value: setTimeout(
                                            () => item.select,
                                            200,
                                          ),
                                          defaultValue: item.select,
                                        }}
                                        listProps={{
                                          nestedScrollEnabled: true,
                                        }}
                                      />
                                      {index > 0 && (
                                        <TouchableOpacity
                                          style={{
                                            width: width * 0.1,
                                            backgroundColor:
                                              index == 1 && slide1[0].selectId
                                                ? '#25AAE199'
                                                : index == 2 &&
                                                  slide1[1].data.length > 0
                                                  ? '#25AAE199'
                                                  : '#D0D0D0',
                                            borderTopRightRadius: width * 0.015,
                                            borderBottomRightRadius:
                                              width * 0.015,
                                            borderTopWidth: width * 0.0019,
                                            borderRightWidth: width * 0.0019,
                                            borderBottomWidth: width * 0.0019,
                                            height: width * 0.134,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}
                                          disabled={
                                            index == 1 && slide1[0].selectId
                                              ? false
                                              : index == 2 &&
                                                slide1[1].data.length > 0
                                                ? false
                                                : true
                                          }
                                          onPress={() =>
                                            showAddNewType(item.name)
                                          }>
                                          <Icon
                                            size={width * 0.06}
                                            color="#fff"
                                            name={'add'}
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                ))}
                                <View
                                  style={
                                    {
                                      // flexDirection: 'row',
                                      // justifyContent: 'space-between',
                                      // backgroundColor: 'tomato',
                                    }
                                  }>
                                  <View>
                                    <View
                                      style={[
                                        styles.desciptionContainer,
                                        {
                                          alignSelf: 'flex-start',
                                          width: width * 0.35,
                                        },
                                      ]}>
                                      <Text
                                        style={[
                                          styles.desciptionHeading,
                                          {
                                            height: width * 0.05,
                                            textAlignVertical: 'bottom',
                                          },
                                        ]}>
                                        Product Desc*
                                      </Text>
                                    </View>
                                    <View>
                                      <Text_Input
                                        placeholder="Type Product Description"
                                        value={
                                          productNo?.length > 24
                                            ? productNo.slice(0, 24) + '...'
                                            : productNo
                                        }
                                        editable={false}
                                        style={{
                                          width: width * 0.8,
                                        }}
                                      />
                                    </View>
                                  </View>
                                  {/* <View
                                    style={{
                                      alignItems: 'flex-end',
                                      marginVertical: height * 0.01,
                                    }}>
                                    <Switch
                                      trackColor={{
                                        false: '#767577',
                                        true: '#81b0ff',
                                      }}
                                      thumbColor={'#f4f3f4'}
                                      ios_backgroundColor="#3e3e3e"
                                      onValueChange={(val) =>
                                        getdefaultDeviceData(val)
                                      }
                                      value={defaultDeviceValues}
                                    />
                                  </View> */}
                                </View>
                              </View>
                            ) : (
                              <>
                                <View>
                                  {showAddType == 'Manufacturer' && (
                                    <View>
                                      <View>
                                        <Text
                                          style={[
                                            styles.meterDesciptionHeading,
                                            { fontWeight: 'bold' },
                                          ]}>
                                          New {showAddType}
                                        </Text>
                                      </View>
                                      <Text_Input
                                        placeholder={'Type new manufacturer'}
                                        value={addManufacturer}
                                        style={styles.meterInput}
                                        onChangeText={(text) => {
                                          setAddManufacturer(text);
                                        }}
                                      />
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-around',
                                          alignItems: 'center',
                                        }}>
                                        <TouchableOpacity
                                          onPress={cancelAddNewType}>
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              fontSize: width * 0.045,
                                              color: '#25AAE1ec',
                                              width: width * 0.17,
                                              textAlign: 'center',
                                            }}>
                                            Cancel
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={doneAddType}
                                          disabled={
                                            showAddType == 'Manufacturer' &&
                                              addManufacturer
                                              ? false
                                              : showAddType != 'Manufacturer' &&
                                                addDevice[0].selectId &&
                                                addDevice[1].selectId &&
                                                addDevice[2].select
                                                ? false
                                                : showAddType == 'Utility' &&
                                                  addUtility
                                                  ? false
                                                  : showAddType == 'Attached To' &&
                                                    addAttached
                                                    ? false
                                                    : true
                                          }>
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              fontSize: width * 0.045,
                                              color:
                                                showAddType == 'Manufacturer' &&
                                                  addManufacturer
                                                  ? '#25AAE1ec'
                                                  : showAddType !=
                                                    'Manufacturer' &&
                                                    addDevice[0].selectId &&
                                                    addDevice[1].selectId &&
                                                    addDevice[2].select
                                                    ? '#25AAE1ec'
                                                    : showAddType == 'Utility' &&
                                                      addUtility
                                                      ? '#25AAE1ec'
                                                      : showAddType ==
                                                        'Attached To' &&
                                                        addAttached
                                                        ? '#25AAE1ec'
                                                        : '#D0D0D0',
                                              width: width * 0.15,
                                              textAlign: 'center',
                                            }}>
                                            Add
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                                  {showAddType == 'Device' && (
                                    <View
                                      style={{
                                        zIndex: 10,
                                      }}>
                                      <Text
                                        style={{
                                          alignSelf: 'flex-start',
                                          fontSize: width * 0.03,
                                          color: '#3E4A4F',
                                          textTransform: 'capitalize',
                                          fontFamily: Fonts.ComfortaaRegular,
                                          marginBottom: width * 0.01,
                                          fontWeight: 'bold',
                                        }}>
                                        Add New Device
                                      </Text>
                                      {addDevice &&
                                        addDevice?.map((item, index) => (
                                          <View
                                            style={{
                                              width: width * 0.8,
                                              // zIndex: 9,
                                            }}
                                            key={item.id}>
                                            <View>
                                              <Text
                                                style={
                                                  styles.meterDesciptionHeading
                                                }>
                                                {item.name}
                                              </Text>
                                            </View>
                                            {index < 1 ? (
                                              <Searchable_Dropdown
                                                onItemSelect={(items) => {
                                                  getNewDeviceData(
                                                    items,
                                                    index,
                                                  );
                                                }}
                                                containerStyle={{
                                                  marginVertical: width * 0.02,
                                                }}
                                                itemStyle={{
                                                  padding: width * 0.027,
                                                  backgroundColor:
                                                    'rgb(247, 247, 247)',
                                                  borderColor: '#bbb',
                                                  borderWidth: width * 0.0015,
                                                  borderRadius: width * 0.015,
                                                }}
                                                itemTextStyle={{ color: '#222' }}
                                                itemsContainerStyle={
                                                  { maxHeight: height * 0.08 }
                                                  // Platform.OS == 'android'
                                                  //   ? {
                                                  //       height: width * 0.2,
                                                  //       zIndex: 1,
                                                  //       position: 'absolute',
                                                  //       width: width * 0.8,
                                                  //       top: width * 0.1,
                                                  //       flex: 1,
                                                  //       zIndex: 20,
                                                  //       backgroundColor:
                                                  //         'white',
                                                  //       elevation: width * 0.01,
                                                  //       shadowColor: '#000',
                                                  //       shadowOffset: {
                                                  //         width: 0,
                                                  //         height: 2,
                                                  //       },
                                                  //       shadowOpacity: 0.25,
                                                  //       shadowRadius: 3.84,
                                                  //     }
                                                  //   : {
                                                  //       height: width * 0.2,
                                                  //       zIndex: 1,
                                                  //     }
                                                }
                                                items={item.data}
                                                resetValue={false}
                                                textInputProps={{
                                                  placeholder: item.name,
                                                  underlineColorAndroid:
                                                    'transparent',
                                                  trueIcon: 'chevron-up',
                                                  falseIcon: 'chevron-down',
                                                  style: {
                                                    margin: 0,
                                                    borderRadius: width * 0.015,
                                                    height: width * 0.13,
                                                    backgroundColor: '#F6F6F6',
                                                    borderWidth: width * 0.0019,
                                                  },
                                                  onTextChange: (text) => {
                                                    onChangeNewDevice(
                                                      text,
                                                      index,
                                                    );
                                                  },
                                                  value: setTimeout(
                                                    () => item.select,
                                                    200,
                                                  ),
                                                  defaultValue: item.select,
                                                }}
                                                listProps={{
                                                  nestedScrollEnabled: true,
                                                }}
                                              />
                                            ) : (
                                              <View>
                                                {/*
                                            //! Ye New Device Adding ka hai
                                             */}
                                                <Text_Input
                                                  placeholder={
                                                    'Type New Device Name'
                                                  }
                                                  value={item.select}
                                                  style={{
                                                    ...styles.meterInput,
                                                    marginVertical:
                                                      width * 0.02,
                                                  }}
                                                  onChangeText={(text) => {
                                                    onChangeNewDevice(
                                                      text,
                                                      index,
                                                    );
                                                  }}
                                                />
                                                <View>
                                                  <View>
                                                    <Text
                                                      style={
                                                        styles.meterDesciptionHeading
                                                      }>
                                                      Model Number*
                                                    </Text>
                                                  </View>
                                                  <View
                                                    style={{
                                                      flexDirection: 'row',
                                                      width: width * 0.8,
                                                      justifyContent:
                                                        'space-between',
                                                      marginVertical:
                                                        width * 0.02,
                                                    }}>
                                                    <Text_Input
                                                      placeholder="Type Model Number"
                                                      value={addModelNo}
                                                      style={{
                                                        ...styles.meterInput,
                                                        width: width * 0.6,
                                                      }}
                                                      onSubmitEditing={
                                                        Keyboard.dismiss
                                                      }
                                                      onFocus={() => {
                                                        console.log(
                                                          'Focusing Model number',
                                                        );
                                                        setVerticalOffs(-60);
                                                      }}
                                                      onChangeText={(text) => {
                                                        setAddModelNo(text);
                                                      }}
                                                    />
                                                    <TouchableOpacity
                                                      style={{
                                                        // backgroundColor: '#25AAE1ec',
                                                        width: width * 0.14,
                                                        height: width * 0.13,
                                                        borderWidth: 2,
                                                        borderRadius: 5,
                                                        alignSelf: 'flex-end',
                                                        borderColor:
                                                          '#25AAE1ec',
                                                        justifyContent:
                                                          'center',
                                                        alignItems: 'center',
                                                      }}
                                                      onPress={() =>
                                                        AddTypes(
                                                          addModelNo,
                                                          'Models',
                                                        )
                                                      }>
                                                      <Icon
                                                        size={width * 0.1}
                                                        color="#25AAE1ec"
                                                        name={'add'}
                                                      />
                                                    </TouchableOpacity>
                                                  </View>
                                                  {modelArr.length > 0 && (
                                                    <FlatList
                                                      data={modelArr}
                                                      horizontal
                                                      style={{
                                                        width: width * 0.8,
                                                        marginVertical:
                                                          width * 0.02,
                                                      }}
                                                      showsHorizontalScrollIndicator={
                                                        false
                                                      }
                                                      renderItem={({ item }) => (
                                                        <>
                                                          <View
                                                            style={{
                                                              borderWidth: 1,
                                                              borderRadius: 8,
                                                              flexDirection:
                                                                'row',
                                                              padding: 5,
                                                              // margin: 5,
                                                              height:
                                                                width * 0.1,
                                                              alignItems:
                                                                'center',
                                                              justifyContent:
                                                                'center',
                                                            }}>
                                                            <Text
                                                              style={{
                                                                color: 'black',
                                                              }}>
                                                              {item}
                                                            </Text>
                                                            <TouchableOpacity
                                                              onPress={() => {
                                                                const items = modelArr.filter(
                                                                  (sitem) =>
                                                                    sitem !==
                                                                    item,
                                                                );
                                                                setModelArr(
                                                                  items,
                                                                );
                                                              }}>
                                                              <Icon
                                                                name="close"
                                                                size={
                                                                  width * 0.05
                                                                }
                                                              />
                                                            </TouchableOpacity>
                                                          </View>
                                                          <View
                                                            style={{ width: 5 }}
                                                          />
                                                        </>
                                                      )}
                                                    />
                                                  )}
                                                </View>
                                                <View>
                                                  <View>
                                                    <Text
                                                      style={
                                                        styles.meterDesciptionHeading
                                                      }>
                                                      Product Description*
                                                    </Text>
                                                  </View>
                                                  <Text_Input
                                                    placeholder="Type Product Description"
                                                    value={addProductNo}
                                                    style={{
                                                      ...styles.meterInput,
                                                      marginVertical:
                                                        width * 0.02,
                                                    }}
                                                    onSubmitEditing={
                                                      Keyboard.dismiss
                                                    }
                                                    onChangeText={(text) => {
                                                      setAddProductNo(text);
                                                    }}
                                                    onFocus={() => {
                                                      console.log(
                                                        'Focusing Product Desc',
                                                      );
                                                      setVerticalOffs(-60);
                                                    }}
                                                  />
                                                </View>
                                              </View>
                                            )}
                                          </View>
                                        ))}
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-around',
                                          alignItems: 'center',
                                          marginTop: width * 0.05,
                                        }}>
                                        <TouchableOpacity
                                          onPress={cancelAddNewType}>
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              fontSize: width * 0.045,
                                              color: '#25AAE1ec',
                                              width: width * 0.2,
                                              textAlign: 'center',
                                              borderColor: '#25AAE1ec',
                                              borderWidth: 2,
                                              padding: 3,
                                              borderRadius: 5,
                                            }}>
                                            Cancel
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={doneAddType}
                                          disabled={
                                            showAddType == 'Manufacturer' &&
                                              addManufacturer
                                              ? false
                                              : showAddType != 'Manufacturer' &&
                                                addDevice[0].selectId &&
                                                addDevice[1].select &&
                                                modelArr.length > 0 &&
                                                addProductNo != ''
                                                ? // && addDevice[2].select
                                                false
                                                : showAddType == 'Utility' &&
                                                  addUtility
                                                  ? false
                                                  : showAddType == 'Attached To' &&
                                                    addAttached
                                                    ? false
                                                    : true
                                          }>
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              fontSize: width * 0.045,
                                              color:
                                                showAddType == 'Manufacturer' &&
                                                  addManufacturer
                                                  ? '#25AAE1ec'
                                                  : showAddType !=
                                                    'Manufacturer' &&
                                                    addDevice[0].selectId &&
                                                    addDevice[1].select &&
                                                    modelArr.length > 0 &&
                                                    addProductNo != ''
                                                    ? '#25AAE1ec'
                                                    : showAddType == 'Utility' &&
                                                      addUtility
                                                      ? '#25AAE1ec'
                                                      : showAddType ==
                                                        'Attached To' &&
                                                        addAttached
                                                        ? '#25AAE1ec'
                                                        : '#D0D0D0',
                                              borderColor:
                                                showAddType == 'Manufacturer' &&
                                                  addManufacturer
                                                  ? '#25AAE1ec'
                                                  : showAddType !=
                                                    'Manufacturer' &&
                                                    addDevice[0].selectId &&
                                                    addDevice[1].select &&
                                                    modelArr.length > 0 &&
                                                    addProductNo != ''
                                                    ? '#25AAE1ec'
                                                    : showAddType == 'Utility' &&
                                                      addUtility
                                                      ? '#25AAE1ec'
                                                      : showAddType ==
                                                        'Attached To' &&
                                                        addAttached
                                                        ? '#25AAE1ec'
                                                        : '#D0D0D0',
                                              width: width * 0.15,
                                              textAlign: 'center',
                                              borderWidth: 2,
                                              padding: 3,
                                              borderRadius: 5,
                                            }}>
                                            Add
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                                  {showAddType == 'Model Number' && (
                                    <View
                                      style={{
                                        width: '100%',
                                        zIndex: 2,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        // backgroundColor: 'pink',
                                      }}>
                                      {!enableDevice ? (
                                        <ActivityIndicator
                                          size={'large'}
                                          color="#25AAE1ec"
                                        />
                                      ) : (
                                        <View>
                                          <View>
                                            <View>
                                              <Text
                                                style={{
                                                  fontSize: width * 0.03,
                                                  color: '#3E4A4F',
                                                  textTransform: 'capitalize',
                                                  fontFamily:
                                                    Fonts.ComfortaaRegular,
                                                  marginBottom: width * 0.01,
                                                  fontWeight: 'bold',
                                                }}>
                                                Select Device
                                              </Text>
                                            </View>
                                            <Searchable_Dropdown
                                              onItemSelect={(item) => {
                                                // this.getNewDeviceData(items, index);
                                                setSelectedDevice(item);
                                                console.log('kia ha', item);
                                              }}
                                              containerStyle={{
                                                paddingBottom: width * 0.02,
                                              }}
                                              itemStyle={{
                                                padding: width * 0.027,
                                                backgroundColor: '#fff',
                                                borderColor: '#bbb',
                                                borderWidth: width * 0.0015,
                                                borderRadius: width * 0.015,
                                                margin: width * 0.005,
                                              }}
                                              itemTextStyle={{ color: '#222' }}
                                              itemsContainerStyle={
                                                Platform.OS == 'android'
                                                  ? {
                                                    height: width * 0.2,
                                                    zIndex: 1,
                                                    position: 'absolute',
                                                    width: width * 0.8,
                                                    top: width * 0.1,
                                                    flex: 1,
                                                    zIndex: 20,
                                                    backgroundColor: 'white',
                                                    elevation: width * 0.01,
                                                    shadowColor: '#000',
                                                    shadowOffset: {
                                                      width: 0,
                                                      height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                  }
                                                  : {
                                                    height: width * 0.2,
                                                    zIndex: 1,
                                                  }
                                              }
                                              items={devicesArray}
                                              resetValue={false}
                                              textInputProps={{
                                                editable: enableDevice,
                                                placeholder: 'Select Device',
                                                underlineColorAndroid:
                                                  'transparent',
                                                trueIcon: 'chevron-up',
                                                falseIcon: 'chevron-down',
                                                style: {
                                                  padding: width * 0.027,
                                                  margin: 0,
                                                  borderRadius: width * 0.015,
                                                  height: width * 0.13,
                                                  backgroundColor: '#F6F6F6',
                                                  borderWidth: width * 0.0019,
                                                },

                                                onTextChange: (text) => {
                                                  // this.onChangeNewDevice(text, index);
                                                  console.log('tes', text);
                                                },
                                                value: setTimeout(
                                                  () => selectedDevice?.name,
                                                  200,
                                                ),
                                                defaultValue:
                                                  selectedDevice?.name,
                                              }}
                                              listProps={{
                                                nestedScrollEnabled: true,
                                              }}
                                            />
                                          </View>
                                          <View>
                                            <Text
                                              style={{
                                                fontSize: width * 0.03,
                                                color: '#3E4A4F',
                                                textTransform: 'capitalize',
                                                fontFamily:
                                                  Fonts.ComfortaaRegular,
                                                marginBottom: width * 0.01,
                                                fontWeight: 'bold',
                                              }}>
                                              Add New {showAddType}
                                            </Text>
                                          </View>
                                          <Text_Input
                                            placeholder="Type New Model Number"
                                            value={addModelNumber}
                                            style={{
                                              width: width * 0.8,
                                              justifyContent: 'flex-end',
                                              fontSize: width * 0.036,
                                            }}
                                            onChangeText={(text) => {
                                              setAddModelNumber(text);
                                            }}
                                          />
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              justifyContent: 'space-around',
                                              marginVertical: height * 0.01,
                                            }}>
                                            <TouchableOpacity
                                              onPress={cancelAddNewType}
                                            // onPress={() => console.log('Cancel Press')}
                                            >
                                              <Text
                                                style={{
                                                  fontWeight: 'bold',
                                                  fontSize: width * 0.045,
                                                  color: '#25AAE1ec',
                                                  width: width * 0.16,
                                                  textAlign: 'center',
                                                }}>
                                                Cancel
                                              </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                              onPress={doneAddType}
                                              // onPress={() => console.log('Press Done')}
                                              disabled={
                                                addModelNumber ? false : true
                                              }>
                                              <Text
                                                style={{
                                                  fontWeight: 'bold',
                                                  fontSize: width * 0.045,
                                                  color: addModelNumber
                                                    ? '#25AAE1ec'
                                                    : '#d0d0d0',
                                                  width: width * 0.16,
                                                  textAlign: 'center',
                                                }}>
                                                Add
                                              </Text>
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      )}
                                    </View>
                                  )}
                                </View>
                              </>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  ) : sliderNumber == 2 ? (
                    <View
                      style={{
                        flex: 1,
                        height: width * 0.8,
                        width: width * 0.9,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
                      {loadingState ? (
                        <ActivityIndicator
                          size="large"
                          color="#25AAE1ec"
                          style={{ alignSelf: 'center', flex: 1 }}
                        />
                      ) : (
                        <View>
                          {slide2.map((item, index) =>
                            renderSlide3(item, index),
                          )}
                          {/* <FlatList
                            data={slide2}
                            renderItem={renderSlide3}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled={true}
                          /> */}
                        </View>
                      )}
                    </View>
                  ) : sliderNumber == 3 ? (
                    <View style={styles.container}>
                      <TouchableOpacity
                        onPress={requestCameraPermission}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          Launch Camera Directly
                        </Text>
                        <Ionicons
                          name="camera"
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      <Text style={[styles.buttonText, { opacity: 0.5 }]}>
                        ------------- OR --------------
                      </Text>
                      <TouchableOpacity
                        onPress={imageGalleryLaunch}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          Launch Image Gallery Directly
                        </Text>
                        <Ionicons
                          name="images"
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>

                      {filePath != '' && filePath != null && (
                        <View>
                          <TouchableOpacity
                            style={styles.installImageRemove}
                            onPress={() => setFilePath('')}>
                            <Ionicons name="close-circle" size={width * 0.08} />
                          </TouchableOpacity>
                          <Image
                            resizeMode="cover"
                            // resizeMethod="scale"
                            style={{
                              flex: 1,
                              width: width * 0.7,
                              height: width * 0.35,
                              marginVertical: 5,
                            }}
                            source={{ uri: filePath }}
                          />
                        </View>
                      )}
                    </View>
                  ) : // <View style={styles.container}>
                    //   <View
                    //     style={{
                    //       flex: 1,
                    //       width: width,
                    //       alignItems: 'center',
                    //       justifyContent: 'center',
                    //       marginTop: width * 0.01,
                    //     }}>
                    //     <View
                    //       style={{
                    //         flex: 1,
                    //         zIndex: 2,
                    //         position: 'absolute',
                    //         top: width * 0.04,
                    //         width: width * 0.72,
                    //       }}>
                    //       <GooglePlacesAutocomplete
                    //         placeholder="Address"
                    //         query={{
                    //           key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                    //           language: 'en', // language of the results
                    //         }}
                    //         fetchDetails={true}
                    //         onPress={(data, details) =>
                    //           catchLocation(details.geometry.location)
                    //         }
                    //         onFail={(error) => console.error(error)}
                    //       />
                    //     </View>
                    //     <TouchableOpacity
                    //       onPress={() => getPropertyLocation()}
                    //       style={[
                    //         styles.doneButton,
                    //         {bottom: width * 0.15, right: width * 0.025},
                    //       ]}>
                    //       <Icon
                    //         size={width * 0.07}
                    //         color="#fff"
                    //         name={'location-city'}
                    //       />
                    //     </TouchableOpacity>
                    //     <TouchableOpacity
                    //       onPress={() => getCurrentLocation()}
                    //       style={[
                    //         styles.doneButton,
                    //         {bottom: 5, right: width * 0.025},
                    //       ]}>
                    //       <Icon
                    //         size={width * 0.07}
                    //         color="#fff"
                    //         name={'gps-fixed'}
                    //       />
                    //     </TouchableOpacity>
                    //     {markers.length > 0 && (
                    //       <View
                    //         style={{
                    //           // backgroundColor: 'blue',
                    //           width: width * 0.13,
                    //           height: width * 0.22,
                    //           zIndex: 1,
                    //           position: 'absolute',
                    //           alignItems: 'center',
                    //         }}>
                    //         <Icon
                    //           size={width * 0.12}
                    //           color="#f00"
                    //           name={'location-pin'}
                    //         />
                    //       </View>
                    //     )}
                    //     {markers.length > 0 ? (
                    //       <View
                    //         style={{
                    //           width: '100%',
                    //           height: '100%',
                    //           borderRadius: width * 0.3,
                    //         }}>
                    //         <MapView
                    //           style={{
                    //             width: '100%',
                    //             height: '100%',
                    //             borderRadius: width * 0.03,
                    //           }}
                    //           // scrollEnabled={false}
                    //           // initialRegion={{
                    //           //   latitude: parseFloat(propertyLat),
                    //           //   longitude: parseFloat(propertyLong),
                    //           //   latitudeDelta: LATITUDE_DELTA,
                    //           //   longitudeDelta: LONGITUDE_DELTA,
                    //           // }}
                    //           region={{
                    //             latitude: lat,
                    //             longitude: long,
                    //             latitudeDelta: latDelta,
                    //             longitudeDelta: longDelta,
                    //           }}
                    //           zoomEnabled={true}
                    //           provider={PROVIDER_GOOGLE}
                    //           showsUserLocation={true}
                    //           showsMyLocationButton={false}
                    //           onRegionChangeComplete={(e, ges) =>
                    //             moveMarker(e, ges)
                    //           }
                    //           // onPress={(e) => this.getLocation(e)}
                    //         >
                    //           <Marker
                    //             coordinate={{
                    //               latitude: parseFloat(propertyLat),
                    //               longitude: parseFloat(propertyLong),
                    //             }}
                    //             title={'Property Location'}
                    //             // icon={require('../../../../../../../Images/Proplocate.png')}
                    //             draggable>
                    //             <View
                    //               style={{
                    //                 width: width * 0.1,
                    //                 height: width * 0.1,
                    //                 backgroundColor: 'transparent',
                    //               }}>
                    //               <Image
                    //                 source={require('../../../../../../../Images/Proplocate.png')}
                    //                 // resizeMode="center"
                    //                 resizeMode="cover"
                    //                 resizeMethod="auto"
                    //                 style={{
                    //                   width: width * 0.1,
                    //                   height: width * 0.1,
                    //                   // backgroundColor: 'red',
                    //                 }}
                    //               />
                    //             </View>
                    //           </Marker>
                    //           <Circle
                    //             center={{
                    //               latitude: parseFloat(propertyLat),
                    //               longitude: parseFloat(propertyLong),
                    //             }}
                    //             radius={radialDis}
                    //             fillColor="rgba(12,170,225,0.3)"
                    //             strokeColor="rgba(12,170,225,1)"
                    //           />
                    //         </MapView>
                    //       </View>
                    //     ) : null}
                    //   </View>
                    // </View>
                    sliderNumber == 4 ? (
                      <View style={styles.container}>
                        <View
                          style={{
                            flex: 1,
                            width: width,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: width * 0.01,
                          }}>
                          <View
                            style={{
                              flex: 1,
                              zIndex: 2,
                              position: 'absolute',
                              top: width * 0.04,
                              width: width * 0.72,
                            }}>
                            <GooglePlacesAutocomplete
                              placeholder="Address"
                              query={{
                                key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                                language: 'en', // language of the results
                              }}
                              fetchDetails={true}
                              onPress={(data, details) =>
                                catchLocation(details.geometry.location)
                              }
                              onFail={(error) => console.error(error)}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => getPropertyLocation()}
                            style={[
                              styles.doneButton,
                              { bottom: width * 0.15, right: width * 0.025 },
                            ]}>
                            <Icon
                              size={width * 0.07}
                              color="#fff"
                              name={'location-city'}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => getCurrentLocation()}
                            style={[
                              styles.doneButton,
                              { bottom: 5, right: width * 0.025 },
                            ]}>
                            <Icon
                              size={width * 0.07}
                              color="#fff"
                              name={'gps-fixed'}
                            />
                          </TouchableOpacity>
                          {markers.length > 0 && (
                            <View
                              style={{
                                // backgroundColor: 'blue',
                                width: width * 0.13,
                                height: width * 0.22,
                                zIndex: 1,
                                position: 'absolute',
                                alignItems: 'center',
                              }}>
                              <Icon
                                size={width * 0.12}
                                color="#f00"
                                name={'location-pin'}
                              />
                            </View>
                          )}
                          {markers.length > 0 ? (
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: width * 0.3,
                              }}>
                              <MapView
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: width * 0.03,
                                }}
                                // scrollEnabled={false}
                                // initialRegion={{
                                //   latitude: parseFloat(propertyLat),
                                //   longitude: parseFloat(propertyLong),
                                //   latitudeDelta: LATITUDE_DELTA,
                                //   longitudeDelta: LONGITUDE_DELTA,
                                // }}
                                region={{
                                  latitude: lat,
                                  longitude: long,
                                  latitudeDelta: latDelta,
                                  longitudeDelta: longDelta,
                                }}
                                zoomEnabled={true}
                                minZoomLevel={17}
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                showsMyLocationButton={false}
                                onRegionChangeComplete={(e, ges) =>
                                  moveMarker(e, ges)
                                }
                              // onPress={(e) => this.getLocation(e)}
                              >
                                <Marker
                                  coordinate={{
                                    latitude: parseFloat(propertyLat),
                                    longitude: parseFloat(propertyLong),
                                  }}
                                  title={'Property Location'}
                                  // icon={require('../../../../../../../Images/Proplocate.png')}
                                  draggable>
                                  <View
                                    style={{
                                      width: width * 0.1,
                                      height: width * 0.1,
                                      backgroundColor: 'transparent',
                                    }}>
                                    <Image
                                      source={require('../../../../../../../Images/Proplocate.png')}
                                      // resizeMode="center"
                                      resizeMode="cover"
                                      resizeMethod="auto"
                                      style={{
                                        width: width * 0.1,
                                        height: width * 0.1,
                                        // backgroundColor: 'red',
                                      }}
                                    />
                                  </View>
                                </Marker>
                                <Circle
                                  center={{
                                    latitude: parseFloat(propertyLat),
                                    longitude: parseFloat(propertyLong),
                                  }}
                                  radius={radialDis}
                                  fillColor="rgba(12,170,225,0.3)"
                                  strokeColor="rgba(12,170,225,1)"
                                />
                              </MapView>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ) : sliderNumber == 5 ? (
                      doneAnimation ? (
                        <Image
                          resizeMode="contain"
                          resizeMethod="auto"
                          style={{
                            flex: 1,
                            width: width * 0.3,
                            height: width * 0.8,
                          }}
                          source={require('../../../../../../../Images/aniLoad.gif')}
                        />
                      ) : (
                        <View style={styles.reasonFileContainer}>
                          {installationStatus == 1 && statusAnimation == true && (
                            <View style={{ alignItems: 'center' }}>
                              <Video
                                source={require('../../../../../../../Images/checkmarkv.mp4')}
                                repeat
                                style={{
                                  width: width * 0.3,
                                  height: width * 0.3,
                                }}
                                resizeMode="contain"
                                controls={false}
                              />
                              <Text
                                style={{
                                  fontSize: width * 0.06,
                                  fontWeight: 'bold',
                                  color: '#00B1DC',
                                }}>
                                Installation Successful
                              </Text>
                              <Text>Meter is installed Successfully</Text>
                            </View>
                          )}
                          {installationStatus == 2 && statusAnimation == true && (
                            <View style={{ alignItems: 'center' }}>
                              <Image
                                resizeMode="contain"
                                resizeMethod="auto"
                                style={{
                                  width: width * 0.3,
                                  height: width * 0.3,
                                }}
                                source={require('../../../../../../../Images/cross.gif')}
                              />
                              <Text
                                style={{
                                  fontSize: width * 0.06,
                                  fontWeight: 'bold',
                                  color: '#FF0000',
                                }}>
                                Installation not Succeed
                              </Text>
                              <Text>Meter is not installed</Text>
                            </View>
                          )}
                          {installationStatus == 2 && statusAnimation == false && (
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  width: width * 0.8,
                                }}>
                                <Text style={styles.meterDesciptionHeading}>
                                  Reason*
                                </Text>
                                <Searchable_Dropdown
                                  onItemSelect={(item) => {
                                    setReasonText(item.name);
                                    setReasonId(item.id);
                                  }}
                                  containerStyle={{
                                    marginVertical: width * 0.02,
                                  }}
                                  itemStyle={{
                                    padding: width * 0.027,
                                    backgroundColor: 'rgb(247, 247, 247)',
                                    borderColor: '#bbb',
                                    borderWidth: width * 0.0015,
                                    borderRadius: width * 0.015,
                                    // padding: width * 0.027,
                                    // backgroundColor: '#fff',
                                    // borderColor: '#bbb',
                                    // borderWidth: width * 0.0015,
                                    // borderRadius: width * 0.015,
                                    // margin: width * 0.005,
                                  }}
                                  itemTextStyle={{ color: '#222' }}
                                  itemsContainerStyle={{ maxHeight: width * 0.25 }}
                                  items={reasons}
                                  resetValue={false}
                                  textInputProps={{
                                    placeholder: 'Select Reasons',
                                    underlineColorAndroid: 'transparent',
                                    trueIcon: 'chevron-up',
                                    falseIcon: 'chevron-down',
                                    style: {
                                      margin: 0,
                                      borderRadius: width * 0.015,
                                      height: width * 0.13,
                                      backgroundColor: '#F6F6F6',
                                      borderWidth: width * 0.0019,
                                    },
                                    onTextChange: (text) => {
                                      setReasonText(text);
                                    },
                                    value: setTimeout(() => reasonText, 200),
                                    defaultValue: reasonText,
                                  }}
                                  listProps={{
                                    nestedScrollEnabled: true,
                                  }}
                                />
                                <Text style={styles.meterDesciptionHeading}>
                                  Reason Description*
                                </Text>
                                <Text_Input
                                  placeholder="Describe Your Reason"
                                  value={reasonDes}
                                  style={{
                                    ...styles.meterInput,
                                    marginVertical: width * 0.02,
                                  }}
                                  onChangeText={(text) => {
                                    setReasonDes(text);
                                  }}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      requestCameraPermission('reason')
                                    }
                                    style={[styles.button, { width: width * 0.1 }]}>
                                    <Ionicons
                                      name="camera"
                                      size={width * 0.05}
                                      color="#3E4A4F"
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => imageGalleryLaunch('reason')}
                                    style={[styles.button, { width: width * 0.1 }]}>
                                    <Ionicons
                                      name="images"
                                      size={width * 0.05}
                                      color="#3E4A4F"
                                    />
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.imageListContainer}>
                                  {reasonPath.length > 0 ? (
                                    <ScrollView
                                      horizontal
                                      showsHorizontalScrollIndicator={false}>
                                      <View
                                        style={{ flexDirection: 'row', flex: 1 }}>
                                        {reasonPath?.map(({ uri, index }) => (
                                          <View style={styles.imageContainer}>
                                            <TouchableOpacity
                                              onPress={() =>
                                                removeImage(uri, 'reason')
                                              }
                                              style={styles.imageRemovebtn}>
                                              <Ionicons
                                                name="close-circle"
                                                size={width * 0.07}
                                              />
                                            </TouchableOpacity>
                                            <Image
                                              resizeMode="cover"
                                              style={{
                                                alignSelf: 'center',
                                                height: width * 0.25,
                                                width: width * 0.25,
                                              }}
                                              source={{ uri: uri }}
                                              key={index}
                                            />
                                          </View>
                                        ))}
                                      </View>
                                    </ScrollView>
                                  ) : (
                                    <Text style={{ textAlign: 'center' }}>
                                      No Image Uploaded
                                    </Text>
                                  )}
                                </View>
                              </View>

                              {/* <TouchableOpacity
                            onPress={() => imageGalleryLaunch('reason')}
                            style={styles.button1}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#25AAE1ec',
                                height: width * 0.12,
                                paddingHorizontal: width * 0.03,
                              }}>
                              <Ionicons
                                name="images"
                                size={width * 0.05}
                                color="#fff"
                                style={{marginRight: width * 0.01}}
                              />
                              <Text style={styles.buttonText}>Upload File</Text>
                            </View>
                            {reasonPath?.assets &&
                              reasonPath?.assets.map((item) => (
                                <Text
                                  style={{
                                    // width: width * 0.45,
                                    flex: 1,
                                    height: width * 0.09,
                                    paddingHorizontal: width * 0.01,
                                  }}>
                                  File: {item.fileName.slice(10)}
                                </Text>
                              ))}
                          </TouchableOpacity> */}
                            </View>
                          )}
                          {installationStatus == 0 && statusAnimation == false && (
                            <View
                              style={{
                                flex: 1,
                                // backgroundColor: 'yellow',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                              }}>
                              <TouchableOpacity
                                onPress={() => sendInstallationStatus(1)}
                                style={[
                                  styles.attemptBtn,
                                  { backgroundColor: 'green' },
                                ]}>
                                <Text style={styles.attemptText}>
                                  Attempted and installed
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setInstallationStatus(2);
                                  setStatusAnimation(true);
                                  setTimeout(() => {
                                    setStatusAnimation(false);
                                  }, 5000);
                                }}
                                style={[
                                  styles.attemptBtn,
                                  { backgroundColor: '#f00' },
                                ]}>
                                <Text style={styles.attemptText}>
                                  Attempted but incomplete
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )
                    ) : null}

                  <View
                    style={{
                      height: width * 0.2,
                      width: width * 0.85,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: 'red',
                    }}>
                    {doneAnimation || checkSerial || hideBtn ? (
                      !hideBtn ? (
                        doneAnimation ? (
                          <Text
                            style={[styles.buttonText, { width: width * 0.7 }]}>
                            {newMeter.name.charAt(0).toUpperCase() +
                              newMeter.name.slice(1).toLowerCase()}{' '}
                            Meter added succesfully please checking installation
                            status...
                          </Text>
                        ) : (
                          <Text
                            style={[styles.buttonText, { width: width * 0.7 }]}>
                            Please wait while checking Device Serial Number...
                          </Text>
                        )
                      ) : null
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          position: 'absolute',
                          width: width * 0.95,
                          height: width * 0.12,
                          zIndex: 1,
                        }}>
                        {sliderNumber > 1 && (
                          <TouchableOpacity
                            onPress={slideBacker}
                            style={[
                              styles.doneButton,
                              {
                                position: 'relative',
                                right: 0,
                                bottom: 0,
                              },
                            ]}>
                            <Icon
                              size={width * 0.07}
                              color="#fff"
                              name={'navigate-before'}
                            />
                          </TouchableOpacity>
                        )}
                        {showAddType == false && (
                          <TouchableOpacity
                            style={[
                              styles.doneButton,
                              {
                                right: 0,
                                bottom: 0,
                                backgroundColor:
                                  sliderNumber == 1 &&
                                    slide1[0].selectId &&
                                    slide1[1].selectId &&
                                    selectedUtil &&
                                    selectedUtilId != null
                                    ? '#25AAE1ec'
                                    : sliderNumber == 2 &&
                                      slide2[0].value &&
                                      slide2[1].value &&
                                      attachedToId != null
                                      ? '#25AAE1ec'
                                      : sliderNumber == 3
                                        ? '#25AAE1ec'
                                        : sliderNumber == 4 &&
                                          lat != undefined &&
                                          long != undefined
                                          ? '#25AAE1ec'
                                          : (sliderNumber == 5 &&
                                            installationStatus == 1) ||
                                            (sliderNumber == 5 &&
                                              installationStatus == 2 &&
                                              reasonId &&
                                              reasonDes)
                                            ? '#25AAE1ec'
                                            : '#D0D0D0',
                              },
                            ]}
                            onPress={
                              userRole == 2
                                ? finishSlider
                                : sliderNumber == 5
                                  ? finishSlider
                                  : changeSlider
                            }
                            disabled={
                              sliderNumber == 1 &&
                                slide1[0].selectId &&
                                slide1[1].selectId &&
                                selectedUtil &&
                                selectedUtilId != null
                                ? false
                                : sliderNumber == 2 &&
                                  slide2[0].value &&
                                  slide2[1].value &&
                                  attachedToId != null
                                  ? false
                                  : sliderNumber == 3
                                    ? false
                                    : sliderNumber == 4 &&
                                      lat != undefined &&
                                      long != undefined
                                      ? false
                                      : (sliderNumber == 5 &&
                                        installationStatus == 1) ||
                                        (sliderNumber == 5 &&
                                          installationStatus == 2 &&
                                          reasonId &&
                                          reasonDes)
                                        ? false
                                        : true
                            }>
                            <Icon
                              size={width * 0.07}
                              color="#fff"
                              name={
                                sliderNumber == 5 ? 'check' : 'navigate-next'
                              }
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              )
            ) : defaultScreen ? (
              <View
                style={{
                  height: height,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  // borderRadius: width * 0.03,
                  overflow: 'hidden',
                  // backgroundColor: 'pink',
                  // justifyContent: 'center',
                }}>
                <View
                  style={{
                    height: width * 0.18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width * 0.85,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.meterDesciptionHeading,
                        { fontSize: width * 0.06 },
                      ]}>
                      Make Selection
                    </Text>

                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                      }}
                      onPress={() =>
                        Alert.alert(
                          'Alert',
                          'Are you sure you want to clear current selected data',
                          [
                            { text: 'No', style: 'cancel' },
                            {
                              text: 'Yes',
                              onPress: cancelMeter,
                            },
                          ],
                        )
                      }>
                      <Icon
                        name="cancel"
                        size={width * 0.06}
                        color="black"
                        maxOpacity={0.5}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    // backgroundColor: 'yellow',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>Use Default Values</Text>
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={defaultValues ? '#25AAE1ec ' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setDefaultValues(!defaultValues)}
                    value={defaultValues}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => useDefaultOrNot()}
                  style={styles.doneButton}>
                  <Icon
                    size={width * 0.07}
                    color="#fff"
                    name={'navigate-next'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.boxInner}>
                {/* Box Header */}
                <View style={styles.boxHeader}>
                  <View style={styles.boxHeaderInner}>
                    {/* <Icon
                      name={'business'}
                      size={height * 0.05}
                      color="#5e5e5e"
                    /> */}
                    <Pressable
                      style={{ marginLeft: 5, top: 8 }}
                      onPress={() =>
                        Alert.alert(
                          'Alert',
                          'Are you sure you want to clear current selected data',
                          [
                            { text: 'No', style: 'cancel' },
                            {
                              text: 'Yes',
                              onPress: changeUtilityAndToggle,
                            },
                          ],
                        )
                      }
                      android_ripple={{
                        color: '#5e5e5e',
                        borderless: true,
                        // radius: width * 0.03,
                      }}>
                      <Text
                        style={[
                          styles.modalHeading,
                          { color: '#5e5e5e', fontSize: width * 0.04 },
                        ]}>
                        Cancel
                      </Text>
                    </Pressable>
                    <Text style={[styles.modalHeading, { top: 8 }]}>
                      {modalName}
                    </Text>
                    <Pressable
                      style={{ marginRight: 5, top: 8 }}
                      onPress={handleAddNewUnit}
                      android_ripple={{
                        color: '#25AAE1',
                        borderless: true,
                        // radius: width * 0.03,
                      }}>
                      <Text
                        style={[
                          styles.modalHeading,
                          { color: '#25AAE1', fontSize: width * 0.04 },
                        ]}>
                        Confirm
                      </Text>
                    </Pressable>
                    {/* <Pressable
                      onPress={() =>
                        Alert.alert(
                          'Alert',
                          'Are you sure you want to clear current selected data',
                          [
                            {text: 'No', style: 'cancel'},
                            {
                              text: 'Yes',
                              onPress: changeUtilityAndToggle,
                            },
                          ],
                        )
                      }
                      android_ripple={{
                        color: 'black',
                        borderless: true,
                        radius: width * 0.03,
                      }}>
                      <Icon
                        name="cancel"
                        size={height * 0.035}
                        color="black"
                        maxOpacity={0.5}
                      />
                    </Pressable> */}
                  </View>
                </View>
                {/* Box Body */}
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'pink',
                    paddingTop: 8,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <View style={styles.desciptionContainer}>
                      <MaterialCommunityIcons
                        name={'office-building'}
                        size={height * 0.02}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>BUILDING*</Text>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        { marginVertical: width * 0.02 },
                      ]}>
                      {/* //todo: This is Drop down picker */}
                      <Text_Input
                        placeholder="Building Name"
                        value={buildingName}
                        editable={false}
                        style={styles.input}
                      />
                    </View>
                    <View style={styles.desciptionContainer}>
                      <Text style={styles.desciptionHeading}>UNIT*</Text>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        { marginVertical: width * 0.02 },
                      ]}>
                      <Text_Input
                        placeholder="Unit Name"
                        value={state.lastUnitData}
                        onChangeText={(text) => {
                          LayoutAnimation.configureNext({
                            duration: 300,
                            create: {
                              type: LayoutAnimation.Types.easeInEaseOut,
                              property: LayoutAnimation.Properties.opacity,
                            },
                            update: {
                              type: LayoutAnimation.Types.easeInEaseOut,
                            },
                          });
                          setError((oldState) => ({
                            ...oldState,
                            errorUnits: '',
                          }));
                          type == 'meterDirect'
                            ? null
                            : (setState((oldState) => ({
                              ...oldState,
                              lastUnitData: text,
                            })),
                              console.log('unit Name', state.lastUnitData));
                        }}
                        disabled={type == 'meterDirect' ? true : false}
                        style={styles.input}
                        error={error.errorUnits}
                      />
                    </View>
                    <View style={{ width: '80%' }}>
                      {error.errorUnits ? (
                        <HelperText type="error" visible={error.errorUnits}>
                          {error.errorUnits}
                        </HelperText>
                      ) : null}
                    </View>
                    <View style={styles.desciptionContainer}>
                      <Text style={styles.desciptionHeading}>UNIT MIX*</Text>
                    </View>
                    <View style={{ zIndex: 1 }}>
                      {/* {unitMixIcon ? (
                        <FontAwesome
                          name="chevron-up"
                          style={{
                            position: 'absolute',
                            left: width * 0.3,
                            top: width * 0.07,
                          }}
                        />
                      ) : (
                        <FontAwesome
                          name="chevron-down"
                          style={{
                            position: 'absolute',
                            left: width * 0.3,
                            top: width * 0.07,
                          }}
                        />
                      )} */}
                    </View>
                    <View style={[styles.inputContainer]}>
                      <Searchable_Dropdown
                        onItemSelect={(item) => {
                          setSelectedUnitMix(item.name);
                          setUnitMixId(item.id);
                        }}
                        containerStyle={{
                          marginVertical: width * 0.02,
                        }}
                        itemStyle={{
                          padding: width * 0.027,
                          backgroundColor: '#fff',
                          borderColor: '#bbb',
                          borderWidth: width * 0.0015,
                          borderRadius: width * 0.015,
                          margin: width * 0.005,
                        }}
                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{
                          maxHeight: width * 0.25,
                        }}
                        items={unitMix}
                        resetValue={false}
                        onFocus={true}
                        textInputProps={{
                          placeholder: 'Select Unit Mix',
                          underlineColorAndroid: 'transparent',
                          trueIcon: 'chevron-up',
                          falseIcon: 'chevron-down',
                          onBlur: () => setUnitMixIcon(false),
                          onFocus: () => setUnitMixIcon(true),
                          style: {
                            width: width * 0.8,
                            margin: 0,
                            height: width * 0.13,
                            borderRadius: width * 0.015,
                            backgroundColor: '#F6F6F6',
                            borderWidth: width * 0.0019,
                          },
                          onTextChange: (text) => {
                            console.log(text);
                          },
                          value: setTimeout(() => selectedUnitMix, 200),
                          defaultValue: selectedUnitMix,
                        }}
                        listProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                    <View style={{ width: '80%' }}>
                      {error.errorUnitMix ? (
                        <HelperText type="error" visible={error.errorUnitMix}>
                          {error.errorUnitMix}
                        </HelperText>
                      ) : null}
                    </View>
                  </View>
                  {/* </View> */}
                  <View
                    style={{
                      flex: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor: 'yellow',
                    }}>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          flex: 8,
                          flexDirection: 'row',
                          // height: width * 0.15,
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          padding: 5,
                        },
                      ]}>
                      {loadMeters ? (
                        <ActivityIndicator color={'#25AAE1ec'} size={'large'} />
                      ) : (
                        meterListData?.length > 0 &&
                        meterListData?.map((item, index) => (
                          <TouchableOpacity
                            // disabled={true}
                            onPress={() => {
                              LayoutAnimation.configureNext({
                                duration: 300,
                                create: {
                                  type: LayoutAnimation.Types.easeInEaseOut,
                                  property: LayoutAnimation.Properties.opacity,
                                },
                                update: {
                                  type: LayoutAnimation.Types.easeInEaseOut,
                                },
                              }),
                                // setShowAddMeterSlider(true),
                                // setDefaultScreen(true),
                                getMeterData(item, index);
                              enableLocation(true);
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-around',
                              padding: 8,
                              margin: width * 0.01,
                              elevation: 2,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderRadius: 5,
                              shadowColor: '#000',
                              shadowOffset: {
                                width: 0,
                                height: 1,
                              },
                              shadowOpacity: 0.2,
                              shadowRadius: 1.41,
                            }}>
                            {/* <Image
                                  source={typeSwitcher(item.meter_name)}
                                  style={styles.untiDetailImage}
                                /> */}

                            <Text
                              style={[
                                styles.meterDesciptionHeading,
                                {
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                  fontSize: width * 0.045,
                                },
                              ]}>
                              {/* {item.meter_name[0].name} */}
                              Meter-{index + 1}
                            </Text>
                            <TouchableOpacity
                              onPress={() => removeMeterAlert(item, index)}
                              style={{
                                zIndex: 1,
                                backgroundColor: '#fff',
                              }}>
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={width * 0.07}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        ))
                      )}
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        {type == 'addMeterDirect' || type == 'meterDirect' ? (
                          meterData.length == 1 ? (
                            <View style={{ marginLeft: width * 0.02 }}>
                              <Text
                                style={{
                                  fontSize: height * 0.04,
                                  color: '#25AAE1ec',
                                }}>
                                No Meters
                              </Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                LayoutAnimation.configureNext({
                                  duration: 300,
                                  create: {
                                    type: LayoutAnimation.Types.easeInEaseOut,
                                    property:
                                      LayoutAnimation.Properties.opacity,
                                  },
                                  update: {
                                    type: LayoutAnimation.Types.easeInEaseOut,
                                  },
                                }),
                                  callApi();
                                enableLocation();
                              }}
                              style={{
                                // flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                zIndex: 1,
                                borderWidth: 2,
                                borderRadius: 5,
                                borderColor: '#25AAE1ec',
                                paddingVertical: width * 0.01,
                              }}>
                              {/*//todo: Button for meter */}
                              <Text
                                style={{
                                  fontSize: width * 0.06,
                                  color: '#25AAE1ec',
                                }}>
                                Add Meter
                              </Text>
                            </TouchableOpacity>
                          )
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              callApi();
                              enableLocation();
                            }}
                            style={{
                              // flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              zIndex: 1,
                              borderWidth: 2,
                              borderRadius: 5,
                              borderColor: '#25AAE1ec',
                              paddingHorizontal: width * 0.02,
                              paddingVertical: width * 0.01,
                            }}>
                            {/*//todo: Button for meter */}
                            <Text
                              style={{
                                fontSize: width * 0.06,
                                color: '#25AAE1ec',
                              }}>
                              Add Meter
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  {/* Box Footer */}
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      flex: 2,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <View style={styles.footerBtn}>
                      {/* <View style={styles.addUnitBtnContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert(
                              'Alert',
                              'Are you sure you want to clear current selected data',
                              [
                                {text: 'No', style: 'cancel'},
                                {
                                  text: 'Yes',
                                  onPress: changeUtilityAndToggle,
                                },
                              ],
                            )
                          }>
                          <View style={styles.cancelBotton}>
                            <MaterialCommunityIcons name="close" color="black" size={18} />
                            <Text style={{color: 'black'}}>Cancel</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddNewUnit}>
                          <View style={styles.submitBotton}>
                            <MaterialCommunityIcons
                              name={
                                type == 'meterDirect' ||
                                type == 'addMeterDirect' ||
                                type == 'add'
                                  ? 'plus'
                                  : 'pencil-plus'
                              }
                              color="white"
                              size={18}
                            />
                            <Text style={{color: 'white'}}>
                              {type == 'meterDirect' ||
                              type == 'addMeterDirect' ||
                              type == 'add'
                                ? 'Add Unit'
                                : 'Edit Unit'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </KeyboardAwareScrollView>
        )}
      </Modal>
      <Modal
        animationIn="bounceInUp"
        animationOut="bounceInDown"
        backdropOpacity={5}
        statusBarTranslucent
        isVisible={state.isScannerVisible}>
        {state.scan && (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
              borderRadius: width * 0.02,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: height * 0.02,
              }}>
              <TouchableOpacity onPress={scannerModal}>
                <MaterialIcons
                  size={width * 0.08}
                  color="white"
                  name="keyboard-backspace"
                />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                  paddingLeft: width * 0.08,
                }}>
                Scan Barcode
              </Text>
            </View>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{ flex: 1 }}
              type={RNCamera.Constants.Type.back}
              autoFocus="on"
              onBarCodeRead={onScanned}
              captureAudio={false}>
              <BarcodeMask outerMaskOpacity={0} />
            </RNCamera>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  boxInner: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // borderRadius: width * 0.03,
    width: width,
    height: height,
  },
  boxHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    height: width * 0.2,
  },
  boxHeaderInner: {
    flex: 1,
    // top: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
  },
  modalHeading: {
    fontSize: width * 0.048,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    // right: width * 0.02,
  },
  desciptionContainer: {
    height: width * 0.05,
    width: width * 0.8,
    alignSelf: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  inputContainer: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: Fonts.ComfortaaRegular,
  },
  utilityInScrHeadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: width * 0.001,
  },
  utilityInScrHead: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.034,
    textAlign: 'center',
  },
  meterDesciptionHeading: {
    fontSize: width * 0.04,
    color: '#3E4A4F',
    textTransform: 'capitalize',
    fontFamily: Fonts.ComfortaaRegular,
  },
  meterInputContainer: {
    width: width * 0.8,
    justifyContent: 'center',
  },
  meterInput: {
    width: width * 0.8,
    justifyContent: 'flex-end',
    fontSize: width * 0.036,
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  addUnitBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cancelBotton: {
    width: width * 0.205,
    height: height * 0.05,
    margin: width * 0.01,
    padding: width * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E2E2E2',
    borderRadius: width * 0.02,
    elevation: width * 0.001,
  },
  submitBotton: {
    width: width * 0.235,
    height: height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: width * 0.01,
    padding: width * 0.015,
    borderRadius: width * 0.02,
    backgroundColor: '#25AAE1',
    elevation: width * 0.001,
  },
  footerBtn: {
    width: width * 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    // borderTopWidth: width * 0.001,
    // borderColor: '#25AAE1ec',
    // top: '20%',
  },
  input: {
    width: width * 0.8,
    fontSize: height * 0.018,
  },
  slide: {
    width: width * 1,
    backgroundColor: '#25AAE1',
    height: height * 0.5,
  },
  title: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.05,
    color: '#3E4A4F',
    // marginTop: height * .05
  },
  discription: {
    // fontFamily: Fonts.MavenProMedium,
    fontSize: height * 0.025,
    textAlign: 'center',
    color: '#A1A1A1',
    // marginTop: height * .05
  },
  buttonCircle: {
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: height * 0.2,
    elevation: height * 0.005,
    backgroundColor: '#25AAE1ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  installImageRemove: {
    width: width * 0.08,
    position: 'absolute',
    top: width * 0.015,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  untiDetailImage: {
    height: width * 0.05,
    width: width * 0.05,
    marginRight: width * 0.01,
  },
  container: {
    //Container for Add/Edit Unit Meter
    flex: 1,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    marginVertical: width * 0.04,
  },
  reasonFileContainer: {
    flex: 1,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: width * 0.7,
    height: width * 0.1,
    borderColor: '#25AAE1ec',
    borderWidth: width * 0.003,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: width * 0.005,
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    marginVertical: width * 0.005,
    elevation: width * 0.003,
  },
  button1: {
    width: width * 0.8,
    height: width * 0.12,
    borderColor: '#25AAE1ec',
    borderWidth: width * 0.003,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: width * 0.005,
    flexDirection: 'row',
    // marginTop: width * 0.04,
    elevation: width * 0.003,
  },
  attemptBtn: {
    width: width * 0.5,
    height: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.01,
    marginVertical: width * 0.03,
    elevation: width * 0.003,
  },
  attemptText: {
    color: '#f5f5f5',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  buttonText: {
    // textAlign: 'center',
    fontSize: width * 0.03,
    fontFamily: Fonts.Montserrat,
    color: '#3E4A4F',
    marginRight: width * 0.01,
  },
  doneButton: {
    backgroundColor: '#25AAE1ec',
    zIndex: 1,
    position: 'absolute',
    height: width * 0.12,
    width: width * 0.12,
    borderRadius: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: width * 0.005,
    bottom: width * 0.04,
    right: width * 0.03,
  },
  imageListContainer: {
    width: width * 0.68,
    height: width * 0.3,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 0,
    elevation: 2,
  },
  imageContainer: {
    borderWidth: 2,
    marginVertical: 2,
    marginHorizontal: 2,
    height: width * 0.27,
    width: width * 0.27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRemovebtn: {
    position: 'absolute',
    zIndex: 1,
    right: -1,
    top: -1,
  },
  unitMixData: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#787878',
    height: width * 0.12,
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 8,
  },
  unitMixDataContainer: {
    marginHorizontal: width * 0.02,
    alignItems: 'center',
  },
  unitMixDataHeading: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  unitMixDataValues: {
    fontSize: width * 0.03,
  },
  unitMixSideBtns: {
    borderWidth: 2,
    borderColor: '#787878',
    height: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
