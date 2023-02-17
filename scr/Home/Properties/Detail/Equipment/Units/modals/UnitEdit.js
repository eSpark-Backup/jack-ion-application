import React, {useState, useEffect, useRef, useReducer} from 'react';
import {
  ScrollView,
  StyleSheet,
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

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Video from 'react-native-video';
import SystemSetting from 'react-native-system-setting';
import {Icon} from 'react-native-material-ui';
import {TextInput, HelperText} from 'react-native-paper';
import {DotsLoader, OpacityDotsLoader} from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RNCamera} from 'react-native-camera';
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
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';
import clc from 'cli-color';

import {Fonts} from '../../../../../../utils/fonts';
import Searchable_Dropdown from '../../../../../../components/SearchableDropdown/index';
import Text_Input from '../../../../../../components/TextInput';
import useUpdateEffect from '../../../../../../hooks/useUpdateEffect';
import API from '../../../../../../api/SeviceApi';

import TextReuseableComponent from '../../../../../../components/Text/index';

const {width, height} = Dimensions.get('window');
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
  selectedMeterForEdit,
  addNewMeter,
  addMeterUnitMix,
  addMeterUnitMixId,
  fromPAD,
  navigation,
  navigateTo,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [editMeterIndex, setEditMeterIndex] = useState(null);
  const [unitMixLoader, setUnitMixLoader] = useState(false);
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
  const [updateStatus, setUpdateStatus] = useState(false);
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
      name: 'Attached To',
      value: '',
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
      name: 'Device Serial Number*',
      value:
        type == 'meterDirect' || type == 'addMeterDirect'
          ? unitDetails?.unit?.meterSerial
          : '',
    },
  ]);
  const helperDefaultData = useRef([]);

  const meterInfo = selectedMeterForEdit?.item;
  const meterNum = selectedMeterForEdit?.index;

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
  const [meterName, setMeterName] = useState(1);
  const [editMeter, setEditMeter] = useState(false);

  const verticalOffset = useRef(-180);

  const turnLocationOn = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS == 'android') {
      SystemSetting.switchLocation();
    }
  };

  // console.log('addMeterUnitMixId', addMeterUnitMixId);
  // console.log('selectedUnitMix', selectedUnitMix);
  // console.log('meterInfo', meterInfo);

  const sendInstallationStatus = (status) => {
    setHideBtn(true);
    setInstallationStatus(status);
    setStatusAnimation(true);
    setTimeout(() => {
      // setLetsFinish(true);
      setHideBtn(false);
    }, 4000);
  };

  const enableLocation = async (oldPos) => {
    const location = await SystemSetting.isLocationEnabled();
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
      const items = [...modelArr];
      items.push(item);
      setModelArr(items);
      setAddModelNo('');
      // this.setState({modelArr: items, modelNo: ''});
    } else {
      setSelectedUtil(item.name);
      setSelectedUtilId(item.id);
      const items = selectUtil;
      items.push(item);
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
          if (result == RESULTS.GRANTED) {
            cameraLaunch(type);
          } else {
            Alert.alert(
              "You don't have access for the Camera",
              'To Change the Permission Open Settings',
              [
                {text: 'Cancel', style: 'cancel'},
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
              {text: 'Cancel', style: 'cancel'},
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

  useEffect(async () => {
    if (type == 'add' || type == 'addMeterDirect') {
      setLoadMeters(false);
    } else {
      setMeterName(meterTypes.length + 1);
      setLoadMeters(true);
    }

    console.log('update EFfect chala');

    callApi();

    let arr2 = meterTypes;

    const update = arr2?.map((meter) => {
      meter['defaultLatitude'] = propertyLat;
      meter['defaultLongitude'] = propertyLong;
      return meter;
    });
    setMeterListData(update);
  }, [modalVisible]);

  // useEffect(() => {
  //   _renderMap();
  // }, []);
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    if (type == 'meterDirect' || type == 'addMeterDirect') {
      let newArr = [...slide2]; // copying the old datas array
      newArr[2].value = unitDetails?.unit?.meterSerial; // replace e.target.value with whatever you want to change it to
      // newArr[index].deviceSerialError = ''; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
    }
  }, [showAddMeterSlider]);

  useEffect(() => {
    if (addNewMeter) {
      setSliderNumber(2);
      setSliderProgress(sliderProgress + 0.25);
      setUnitMixId(addMeterUnitMixId);
      setSelectedUnitMix(addMeterUnitMix);
      enableLocation();
      // handleAddMeter()
    }
  }, [modalVisible, addNewMeter]);

  useEffect(async () => {
    if (flag) {
      setUnitMixLoader(true);
      setState((oldState) => ({
        ...oldState,
        lastUnitData: unitDetails?.unit?.name,
      }));
      const propertyData = await API.get(`/property/${propertyId}`);

      const Mixes = propertyData?.data?.data?.property?.unit_mixes;
      const unitMixes = Mixes.map((item) => {
        const {select_option: name, ...rest} = item;
        return {name, ...rest};
      });
      setUnitMix(unitMixes);
      if (modalVisible) {
        if (unitMixesId && !addNewMeter) {
          console.log('yeh chala kia??', unitMixesId);
          setUnitMixId(unitMixesId);
          unitMixes?.map((item) => {
            if (item.id == unitMixesId) {
              setSelectedUnitMix(item.name);
            }
          });
        }
      }
      setUnitMixLoader(false);
    }
    // callApi();
  }, [meterTypes, unitDetails, modalVisible]);

  useEffect(() => {
    if (sliderNumber == 5) {
      setDoneAnimation(true);
      setTimeout(() => {
        setDoneAnimation(false);
        setStatusAnimation(false);
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
        } else {
          setState((oldState) => ({
            ...oldState,
            hasAccess: false,
          }));
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

    console.log('Getting Data');
    const defaultUnitData = await API.get(
      `/property/default-meter-device/${propertyId}`,
    );

    let defaultUtilityType = [];

    if (defaultUnitData.ok && !oldDev) {
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
    setAttachedToData(AttachedToResponse?.data?.data);
    const reasoneResponce = await API.get(
      '/property/equipment/unit/option-reasons/all',
    );

    setReasons(reasoneResponce?.data?.data);

    let UtilArray = [...defaultUtilityType];
    let ManuArray = [...manufacturers];
    let empSlide = [...slide1]; // copying the old datas array
    empSlide[0].data = [];
    setSlide1(empSlide);
    UtilArray.filter((item) => {
      ManuArray.map((manuItem) => {
        if (manuItem?.utility_type[0]?.name != undefined) {
          if (item.name == manuItem?.utility_type[0]?.name) {
            let listSlide = [...slide1]; // copying the old datas array
            listSlide[0].data.push(manuItem);
            if (manuItem.devices.length > 0) {
              listSlide[1].data = manuItem.devices;
              if (manuItem.devices[0].model_nos.length > 0) {
                const modelNos = manuItem.devices[0].model_nos.map((item) => {
                  const {model_no: name, ...rest} = item;
                  return {name, ...rest};
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

    if (defaultDevices.length > 0 && !oldDev) {
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
      setSelectUtil(filterRes);
    }
  };

  const getAllDevices = async () => {
    const devicesResponse = await API.get(`/property/equipment/device/all`);
    if (devicesResponse.ok) {
      setDevicesArray(devicesResponse?.data?.data);
      setEnableDevice(true);
    } else {
      alert('Something wrong');
    }
  };

  const getDevice = async (some, index) => {
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
      const modelNos = some?.model_nos.map((item) => {
        const {model_no: name, ...rest} = item;
        return {name, ...rest};
      });
      setProductNo(product_desc);
    }
    setSlide1(listSlide);
  };

  const removeMeterAlert = (i, ind) => {
    Alert.alert('Becareful', 'Are you sure to delete meter permanently', [
      {text: 'No', style: 'cancel'},
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
    if (unitMixId == null && unitMixId == undefined) {
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
    console.log('unitMixId', unitMixId);
    setIsActivityLoader(true);
    let data = {
      name: state.lastUnitData,
      building_id: buildingId,
      defaultRadial_dist: radialDis,
      unit_mix_id: unitMixId,
      meters: meterData,
    };

    if (type == 'add' || type == 'addMeterDirect') {
      const unitResponse = await API.post(
        `/property/equipment/unit/add-unit`,
        data,
      );
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        reRun(unitResponse?.data?.data);
      } else {
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
      }
    } else {
      const unitResponse = await API.post(
        `/property/equipment/unit/update-unit/${unitDetails?.unit?.id}`,
        data,
      );
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        reRun(unitResponse?.data?.data);
      } else {
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
      }
    }
  };

  const handleAddMeter = async () => {
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
    if (type == 'add' || addNewMeter || !devEdit) {
      matchUnit = unitsArray?.filter((e) => e.name == state.lastUnitData);
      setSliderNumber(2);
      setSliderProgress(sliderProgress + 0.25);
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
    if (
      unitMixId == null &&
      selectedUnitMix == '' &&
      addMeterUnitMixId == null &&
      addMeterUnitMix == ''
    ) {
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

    callApi();
    enableLocation();
  };

  const checkingSerial = async () => {
    let data = {
      device_serial_number: slide2[2].value,
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
      if (type == 'add' || !devEdit) {
        setSliderNumber(5);
        setSliderProgress(sliderProgress + 0.75);
      } else {
        setSliderNumber(sliderNumber + 1);
        setSliderProgress(sliderProgress + 0.25);
      }
    } else {
      Alert.alert(
        'Device Serial Already Exists',
        'Please type or scan another Device Serial Number',
      );
    }
  };

  const doSome = (item, index) => {
    let ManuArray = [...defaultManuLis];
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
              const {model_no: name, ...rest} = item;
              return {name, ...rest};
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
        Toast.show('Add Meter inside the premises of Property', Toast.SHORT);
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
      setStatusAnimation(false);
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
        // listSlide[0].sfinishSliderelectId = filterDevices[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
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

  const finishSlider = (data) => {
    console.log('Finish SLider data:', data);
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
    setStatusAnimation(false);

    setShowAddMeterSlider(false);
    setImmediate(() => {
      addDeviceInUnit(data);
    });
  };
  const addDeviceInUnit = async (mData) => {
    setIsActivityLoader(true);

    console.log('unitMixId', unitMixId);

    let data = {
      name: state.lastUnitData,
      building_id: buildingId,
      defaultRadial_dist: radialDis,
      unit_mix_id: unitMixId,
      meters: mData ? mData : meterData,
    };
    if (type == 'add' || type == 'addMeterDirect') {
      const unitResponse = await API.post(
        `/property/equipment/unit/add-unit`,
        data,
      );
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        reRun(unitResponse?.data?.data);
        cancelMeter();
      } else {
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        cancelMeter();
      }
    } else {
      try {
        console.log('unitDetails?.unit?.id', unitDetails?.unit?.id);
        const unitResponse = await API.post(
          `/property/equipment/unit/update-unit/${unitDetails?.unit?.id}`,
          data,
        );
        console.log('Update Unit Payload', data);
        if (unitResponse?.data?.bool) {
          console.log(
            'Update Unit Response',
            unitResponse?.data?.data?.unit?.unit_meter,
          );
          if (fromPAD) {
            navigateTo.unitId = unitDetails?.unit?.id;
            navigation.navigate('U_Details', navigateTo);
            setIsActivityLoader(false);
            cancelMeter();
          } else {
            changeUtilityAndToggle();
            setIsActivityLoader(false);
            // alert(unitResponse?.data?.message);
            reRun(unitResponse?.data?.data);
            cancelMeter();
          }
        } else {
          setIsActivityLoader(false);
          alert(unitResponse?.data?.message);
          cancelMeter();
        }
      } catch (error) {
        console.log('error', error);
      }
    }
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
      meter_name: [{id: newMeter.id, name: newMeter.name}],
      // model_no_id: slide1[2].selectId,
      device_serial_number: slide2[2].value,
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
      let meterData = [...meterListData];
      meterData[editMeterIndex] = meterVals;
      setMeterListData(meterData);
    } else {
      meterArray.push(meterVals);
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
    var loopData = [...meterData];
    let meterVals = {};
    meterListData?.map((item) => {
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
        ...(item.id != null && {id: item.id}),
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
    finishSlider(meterListData);
    // if (editMeterIndex != null) {
    //   console.log("meterListData: ", meterListData);
    //   setMeterData(meterListData);
    // } else {
    //   loopData.push(meterVals);
    //   setMeterData(loopData);
    // }
    setLetsUpdateMeterData(false);
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
    if (index == 1 && item.value == null) {
      let newArr = [...slide2]; // copying the old datas array
      newArr[index].value = '0'; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
    }
    return (
      <View style={{width: width * 0.8}} key={item.id}>
        {index > 0 && (
          <>
            <TextReuseableComponent
              title
              style={[styles.meterDesciptionHeading, {top: width * 0.01}]}
              value={item.name}
            />
            <Text_Input
              placeholder={item.name}
              value={index == 1 && item.value == null ? '0' : item.value}
              keyboardType={index == 1 ? 'numeric' : 'default'}
              error={item.error}
              right={
                index == 2 &&
                (type == 'meterDirect' || type == 'addMeterDirect' ? null : (
                  <TextInput.Icon
                    // disabled={
                    //   devEdit
                    //     ? true
                    //     : (index == 2 && type == 'meterDirect') ||
                    //       type == 'addMeterDirect'
                    //       ? true
                    //       : false
                    // }
                    name={() => (
                      <TouchableOpacity
                        // disabled={
                        //   devEdit
                        //     ? true
                        //     : (index == 2 && type == 'meterDirect') ||
                        //       type == 'addMeterDirect'
                        //       ? true
                        //       : false
                        // }
                        onPress={() => toggleScanner(index)}
                        style={{zIndex: 1}}>
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
              // disabled={
              //   devEdit
              //     ? true
              //     : (index == 0 && type == 'meterDirect') ||
              //       type == 'addMeterDirect'
              //       ? true
              //       : false
              // }
              style={{
                ...styles.meterInput,
                marginVertical: width * 0.02,
              }}
            />
          </>
        )}

        {index == 0 && showAddType !== 'Attached To' ? (
          <View style={{margin: 0}}>
            <TextReuseableComponent
              title
              style={[styles.meterDesciptionHeading]}
              value={'Attached To*'}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginVertical: width * 0.02,
              }}>
              <Searchable_Dropdown
                onItemSelect={(item) => {
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
                itemTextStyle={{color: '#222'}}
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
          index == 0 && (
            <View style={{borderTopWidth: 2, paddingVertical: 10}}>
              <View>
                <TextReuseableComponent
                  title
                  style={styles.meterDesciptionHeading}
                  value={`Add New ${showAddType}`}
                />
              </View>
              <Text_Input
                placeholder={'Type new Attached To'}
                value={addAttached}
                style={{...styles.meterInput, marginVertical: width * 0.02}}
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
                  <TextReuseableComponent
                    title
                    style={{
                      color: '#25AAE1ec',
                      width: width * 0.2,
                      textAlign: 'center',
                      borderWidth: 2,
                      borderColor: '#25AAE1ec',
                      borderRadius: 5,
                      padding: 3,
                    }}
                    value={'Cancel'}
                  />
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
                  <TextReuseableComponent
                    title
                    style={{
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
                    }}
                    value={'Add'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      </View>
    );
  };

  const renderSlide5 = ({item, index}) => {
    // console.log('index check slider 3 ---> ',index)
    return (
      <View style={{width: width * 0.8}} key={item.id}>
        <TextReuseableComponent
          title
          style={[styles.meterDesciptionHeading, {top: width * 0.01}]}
          value={item.name}
        />
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
    setSelectLocation(true);
  };

  const _renderMap = (oldPos) => {
    Geolocation.getCurrentPosition(
      (position) => {
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
      (error) => {
        console.log('error Geoloaction', error);
      },
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
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
      setScroll(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
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
        }
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
    if (addNewMeter) {
      closeModal();
    }
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
      newArr[1].value = '0';
      newArr[2].value = '';
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
    setEditMeter(true);
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
    setShowAddType(value);
    if (value == 'Model Number') {
      setEnableDevice(false);
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
    if (data.id) {
      setDevEdit(true);
      setSelectedDevId(data.id);
      setEditMeterIndex(index);
    } else {
      setExistingDev(true);
      setEditMeterIndex(index);
      setSelectedDevId(null);
    }
    setLoadManufacturers(true);
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
    if (
      data.installation_status == 1 ||
      data.installation_status == 'Complete'
    ) {
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
    newArr[1].value = data.initial_meter_reading;
    newArr[2].value = data.device_serial_number;

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
  };

  // console.log("showAddMeterSlider =", showAddMeterSlider)
  // console.log("select Location    =", selectLocation)
  // console.log("add New Type       =", addNewType)
  // console.log("slider Number      =", sliderNumber)
  // console.log("doneAnimation      =", doneAnimation)
  // console.log("installationStatus =", installationStatus)
  // console.log("statusAnimation    =", statusAnimation)
  // console.log("updateStatus", updateStatus)
  // console.log("Edit MEter", editMeter)
  // console.log("Add  MEter", addNewMeter)
  // console.log("from PAD", fromPAD);
  // console.log("Slider num", sliderNumber)
  // console.log("meterInfo", meterInfo)
  // console.log("statusAnim", statusAnimation)
  // console.log("instStatus", installationStatus)

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
        style={{margin: 0}}
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
            contentContainerStyle={{backgroundColor: '#fff'}}
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
                    style={[styles.doneButton, {bottom: width * 0.32}]}>
                    <Icon
                      size={width * 0.07}
                      color="#fff"
                      name={'location-city'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => getCurrentLocation()}
                    style={[styles.doneButton, {bottom: width * 0.18}]}>
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
                    <TextReuseableComponent
                      title
                      style={styles.meterDesciptionHeading}
                      value={`Add ${showAddType}`}
                    />
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
                            {text: 'No', style: 'cancel'},
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
                          <TextReuseableComponent
                            title
                            style={styles.meterDesciptionHeading}
                            value={`New ${showAddType}`}
                          />
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
                      <View style={{zIndex: 10}}>
                        {addDevice &&
                          addDevice?.map((item, index) => (
                            <View
                              style={{
                                width: width * 0.8,
                                // zIndex: 9,
                              }}
                              key={item.id}>
                              <View>
                                <TextReuseableComponent
                                  title
                                  style={styles.meterDesciptionHeading}
                                  value={item.name}
                                />
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
                                  itemTextStyle={{color: '#222'}}
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
                                      : {height: width * 0.2, zIndex: 1}
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
                                      <TextReuseableComponent
                                        title
                                        style={styles.meterDesciptionHeading}
                                        value={'Model Number*'}
                                      />
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
                                      <TextReuseableComponent
                                        title
                                        style={styles.meterDesciptionHeading}
                                        value={'Product Description*'}
                                      />
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
                          <TextReuseableComponent
                            title
                            style={styles.meterDesciptionHeading}
                            value={`New ${showAddType} Type`}
                          />
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
                          <TextReuseableComponent
                            title
                            style={styles.meterDesciptionHeading}
                            value={`Add New ${showAddType}`}
                          />
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
                      <TextReuseableComponent
                        title
                        style={styles.meterDesciptionHeading}
                        value={`Meter- ${
                          newMeterFlag ? meterName : selectedMeter
                        }`}
                      />
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
                              {text: 'No', style: 'cancel'},
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
                      style={{marginBottom: width * 0.03}}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        width: width * 0.85,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TextReuseableComponent
                        title
                        style={[
                          styles.meterDesciptionHeading,
                          {
                            height: width * 0.2,
                            top: -5,
                            textTransform:
                              sliderNumber == 4 ? 'none' : 'capitalize',
                          },
                        ]}
                        value={
                          sliderNumber == 1 && showAddType == ''
                            ? 'Utility Type & Device Info'
                            : sliderNumber == 2
                            ? 'Attached To'
                            : sliderNumber == 3
                            ? 'Installation Image'
                            : sliderNumber == 4
                            ? 'GPS Location of Install'
                            : sliderNumber == 5
                            ? 'Install Status'
                            : ''
                        }
                      />
                    </View>
                    <View style={{height: 5}} />
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
                          style={{alignSelf: 'center', flex: 1}}
                        />
                      ) : loadManufacturers ? (
                        <ActivityIndicator
                          size="large"
                          color="#25AAE1ec"
                          style={{alignSelf: 'center', flex: 1}}
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
                                    <TextReuseableComponent
                                      title
                                      style={styles.meterDesciptionHeading}
                                      value={'Utility Type*'}
                                    />
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
                                        itemTextStyle={{color: '#222'}}
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
                              <View style={{flex: 1, justifyContent: 'center'}}>
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
                                    style={{width: width * 0.8}}
                                    key={item.id}>
                                    <TextReuseableComponent
                                      title
                                      style={styles.meterDesciptionHeading}
                                      value={`${item.name}*`}
                                    />
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
                                        itemTextStyle={{color: '#222'}}
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
                                      <TextReuseableComponent
                                        title
                                        style={[
                                          styles.desciptionHeading,
                                          {
                                            textAlignVertical: 'bottom',
                                          },
                                        ]}
                                        value={'Product Desc*'}
                                      />
                                    </View>
                                    <View>
                                      <Text_Input
                                        placeholder="Type Product Description"
                                        value={
                                          productNo?.length > 24
                                            ? productNo?.slice(0, 24) + '...'
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
                                        <TextReuseableComponent
                                          title
                                          style={styles.meterDesciptionHeading}
                                          value={`New ${showAddType}`}
                                        />
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
                                          <TextReuseableComponent
                                            title
                                            style={{
                                              color: '#25AAE1ec',
                                              width: width * 0.17,
                                              textAlign: 'center',
                                            }}
                                            value={'Cancel'}
                                          />
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
                                          <TextReuseableComponent
                                            title
                                            style={{
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
                                            }}
                                            value={'Add'}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                                  {showAddType == 'Device' && (
                                    <View
                                      style={{
                                        zIndex: 10,
                                      }}>
                                      <TextReuseableComponent
                                        title
                                        style={{
                                          alignSelf: 'flex-start',
                                          color: '#3E4A4F',
                                          textTransform: 'capitalize',
                                          marginBottom: width * 0.01,
                                        }}
                                        value={'Add New Device'}
                                      />
                                      {addDevice &&
                                        addDevice?.map((item, index) => (
                                          <View
                                            style={{
                                              width: width * 0.8,
                                              // zIndex: 9,
                                            }}
                                            key={item.id}>
                                            <View>
                                              <TextReuseableComponent
                                                title
                                                style={
                                                  styles.meterDesciptionHeading
                                                }
                                                value={item.name}
                                              />
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
                                                itemTextStyle={{color: '#222'}}
                                                itemsContainerStyle={
                                                  {maxHeight: height * 0.08}
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
                                                    <TextReuseableComponent
                                                      title
                                                      style={
                                                        styles.meterDesciptionHeading
                                                      }
                                                      value={'Model Number*'}
                                                    />
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
                                                      renderItem={({item}) => (
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
                                                            <TextReuseableComponent
                                                              title
                                                              value={item}
                                                            />
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
                                                            style={{width: 5}}
                                                          />
                                                        </>
                                                      )}
                                                    />
                                                  )}
                                                </View>
                                                <View>
                                                  <View>
                                                    <TextReuseableComponent
                                                      title
                                                      style={
                                                        styles.meterDesciptionHeading
                                                      }
                                                      value={
                                                        'Product Description*'
                                                      }
                                                    />
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
                                          <TextReuseableComponent
                                            title
                                            style={{
                                              color: '#25AAE1ec',
                                              width: width * 0.2,
                                              textAlign: 'center',
                                              borderColor: '#25AAE1ec',
                                              borderWidth: 2,
                                              padding: 3,
                                              borderRadius: 5,
                                            }}
                                            value={'Cancel'}
                                          />
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
                                          <TextReuseableComponent
                                            title
                                            style={{
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
                                            }}
                                            value={'Add'}
                                          />
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
                                              <TextReuseableComponent
                                                title
                                                style={{
                                                  color: '#3E4A4F',
                                                  textTransform: 'capitalize',
                                                  fontFamily:
                                                    Fonts.ComfortaaRegular,
                                                  marginBottom: width * 0.01,
                                                }}
                                                value={'Select Device'}
                                              />
                                            </View>
                                            <Searchable_Dropdown
                                              onItemSelect={(item) => {
                                                // this.getNewDeviceData(items, index);
                                                setSelectedDevice(item);
                                                // console.log('kia ha', item);
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
                                              itemTextStyle={{color: '#222'}}
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
                                            <TextReuseableComponent
                                              title
                                              style={{
                                                color: '#3E4A4F',
                                                textTransform: 'capitalize',
                                                marginBottom: width * 0.01,
                                              }}
                                              value={`Add New ${showAddType}`}
                                            />
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
                                              <TextReuseableComponent
                                                title
                                                style={{
                                                  color: '#25AAE1ec',
                                                  width: width * 0.16,
                                                  textAlign: 'center',
                                                }}
                                                value={'Cancel'}
                                              />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                              onPress={doneAddType}
                                              // onPress={() => console.log('Press Done')}
                                              disabled={
                                                addModelNumber ? false : true
                                              }>
                                              <TextReuseableComponent
                                                title
                                                style={{
                                                  color: addModelNumber
                                                    ? '#25AAE1ec'
                                                    : '#d0d0d0',
                                                  width: width * 0.16,
                                                  textAlign: 'center',
                                                }}
                                                value={'Add'}
                                              />
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
                          style={{alignSelf: 'center', flex: 1}}
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
                        <TextReuseableComponent
                          title
                          style={styles.buttonText}
                          value={'Launch Camera Directly'}
                        />
                        <Ionicons
                          name="camera"
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      <TextReuseableComponent
                        title
                        style={[styles.buttonText, {opacity: 0.5}]}
                        value={'------------- OR --------------'}
                      />
                      <TouchableOpacity
                        onPress={imageGalleryLaunch}
                        style={styles.button}>
                        <TextReuseableComponent
                          title
                          style={styles.buttonText}
                          value={'Launch Image Gallery Directly'}
                        />
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
                            source={{uri: filePath}}
                          />
                        </View>
                      )}
                    </View>
                  ) : sliderNumber == 4 ? (
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
                            {bottom: width * 0.15, right: width * 0.025},
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
                            {bottom: 5, right: width * 0.025},
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
                      <View
                        style={{
                          flex: 1,
                          width: width * 0.85,
                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: 'red',
                        }}>
                        <View style={styles.reasonFileContainer}>
                          {(installationStatus == 1 &&
                            statusAnimation == true) ||
                          meterInfo?.installation_status == 'Complete' ? (
                            <View style={{alignItems: 'center'}}>
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
                              <TextReuseableComponent
                                title
                                style={{
                                  color: '#00B1DC',
                                }}
                                value={'Installation Successful'}
                              />
                              <TextReuseableComponent
                                title
                                value={'Meter is installed Successfully'}
                              />
                            </View>
                          ) : null}
                          {installationStatus == 2 && statusAnimation == true && (
                            <View style={{alignItems: 'center'}}>
                              <Image
                                resizeMode="contain"
                                resizeMethod="auto"
                                style={{
                                  width: width * 0.3,
                                  height: width * 0.3,
                                }}
                                source={require('../../../../../../../Images/cross.gif')}
                              />
                              <TextReuseableComponent
                                title
                                style={{
                                  color: '#FF0000',
                                }}
                                value={'Installation not Succeed'}
                              />
                              <TextReuseableComponent
                                title
                                value={'Meter is not installed'}
                              />
                            </View>
                          )}
                          {installationStatus == 2 && statusAnimation == false && (
                            <>
                              <View style={{flex: 1}}>
                                <View
                                  style={{
                                    width: width * 0.8,
                                  }}>
                                  <TextReuseableComponent
                                    title
                                    style={styles.meterDesciptionHeading}
                                    value={'Reason*'}
                                  />
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
                                    itemTextStyle={{color: '#222'}}
                                    itemsContainerStyle={{
                                      maxHeight: width * 0.25,
                                    }}
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
                                  <TextReuseableComponent
                                    title
                                    style={styles.meterDesciptionHeading}
                                    value={'Reason Description*'}
                                  />
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
                                      style={[
                                        styles.button,
                                        {width: width * 0.1},
                                      ]}>
                                      <Ionicons
                                        name="camera"
                                        size={width * 0.05}
                                        color="#3E4A4F"
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        imageGalleryLaunch('reason')
                                      }
                                      style={[
                                        styles.button,
                                        {width: width * 0.1},
                                      ]}>
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
                                          style={{
                                            flexDirection: 'row',
                                            flex: 1,
                                          }}>
                                          {reasonPath?.map(({uri, index}) => (
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
                                                source={{uri: uri}}
                                                key={index}
                                              />
                                            </View>
                                          ))}
                                        </View>
                                      </ScrollView>
                                    ) : (
                                      <TextReuseableComponent
                                        title
                                        style={{textAlign: 'center'}}
                                        value={'No Image Uploaded'}
                                      />
                                    )}
                                  </View>
                                </View>
                              </View>
                              {!addNewMeter && !editMeter && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setLetsFinish(true);
                                  }}
                                  style={{
                                    borderRadius: width * 0.02,
                                    padding: 10,
                                    width: width * 0.8,
                                    // flex: 1,
                                    backgroundColor: '#25aae1',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <TextReuseableComponent
                                    title
                                    style={{color: 'white'}}
                                    value={'Save Changes'}
                                  />
                                </TouchableOpacity>
                              )}
                            </>
                          )}
                          {(installationStatus == 0 ||
                            installationStatus == 'Complete') &&
                            statusAnimation == false &&
                            meterInfo?.installation_status != 'Complete' && (
                              <View
                                style={{
                                  flex: 1,
                                  // backgroundColor: 'yellow',
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    sendInstallationStatus(1);
                                    setStatusAnimation(true);
                                    // setUpdateStatus(false)
                                  }}
                                  style={[
                                    styles.attemptBtn,
                                    {backgroundColor: 'green'},
                                  ]}>
                                  <TextReuseableComponent
                                    title
                                    style={styles.attemptText}
                                    value={'Attempted and installed'}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setInstallationStatus(2);
                                    setStatusAnimation(true);
                                    setUpdateStatus(false);
                                    setTimeout(() => {
                                      setStatusAnimation(false);
                                      // setLetsFinish(true);
                                    }, 2000);
                                  }}
                                  style={[
                                    styles.attemptBtn,
                                    {backgroundColor: '#f00'},
                                  ]}>
                                  <TextReuseableComponent
                                    title
                                    style={styles.attemptText}
                                    value={'Attempted but incomplete'}
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                        </View>
                        {sliderNumber == 5 &&
                          !addNewMeter &&
                          !editMeter &&
                          statusAnimation == true && (
                            <TouchableOpacity
                              onPress={() => {
                                setLetsFinish(true);
                              }}
                              style={{
                                borderRadius: width * 0.02,
                                padding: 10,
                                width: width * 0.95,
                                // flex: 1,
                                backgroundColor: '#25aae1',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <TextReuseableComponent
                                title
                                style={{color: 'white'}}
                                value={'Save Changes'}
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    )
                  ) : null}

                  {doneAnimation || checkSerial || hideBtn ? (
                    !hideBtn ? (
                      doneAnimation ? (
                        <TextReuseableComponent
                          title
                          style={[styles.buttonText, {width: width * 0.7}]}
                          value={`Meter added successfully checking installation status...`}
                        />
                      ) : (
                        <TextReuseableComponent
                          title
                          style={[styles.buttonText, {width: width * 0.7}]}
                          value={
                            'Please wait while checking Device Serial Number...'
                          }
                        />
                      )
                    ) : null
                  ) : (
                    <>
                      {editMeter || addNewMeter ? (
                        <View
                          style={{
                            height: width * 0.2,
                            width: width * 0.85,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              // flex: 1,
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
                                          slide2[1].value &&
                                          slide2[2].value &&
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
                                          meterInfo?.installation_status ==
                                            'Complete' ||
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
                                    ? () => {
                                        setLetsFinish(true);
                                        // if (editMeterIndex == null) {
                                        //   console.log('editMeterIndex.,.....',)
                                        //   finishSlider()
                                        // } else {
                                        //   setLetsFinish(true);
                                        // }
                                      }
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
                                      slide2[2].value &&
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
                                      meterInfo?.installation_status ==
                                        'Complete' ||
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
                                    sliderNumber == 5
                                      ? 'check'
                                      : 'navigate-next'
                                  }
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      ) : null}
                      {sliderNumber != 5 && !addNewMeter && !editMeter && (
                        <TouchableOpacity
                          onPress={() => {
                            setLetsFinish(true);

                            // setTimeout(() => {
                            //   finishSlider()
                            // }, 5000);
                          }}
                          style={{
                            borderRadius: width * 0.02,
                            padding: 10,
                            width: width * 0.95,
                            // flex: 1,
                            backgroundColor: '#25aae1',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextReuseableComponent
                            title
                            style={{
                              color: 'white',
                              justifyContent: 'center',
                            }}
                            value={'Save Changes'}
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
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
                    <TextReuseableComponent
                      title
                      style={styles.meterDesciptionHeading}
                      value={'Make Selection'}
                    />

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
                            {text: 'No', style: 'cancel'},
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
                  <TextReuseableComponent title value={'Use Default Values'} />
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
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
                    <TouchableOpacity
                      style={{marginLeft: 5, top: 8}}
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
                      <TextReuseableComponent
                        title
                        style={{
                          color: 'black',
                          fontFamily: Fonts.ComfortaaRegular,
                        }}
                        value={'Cancel'}
                      />
                    </TouchableOpacity>
                    <TextReuseableComponent
                      title
                      style={[styles.modalHeading, {top: 8}]}
                      value={meterInfo ? 'Meter-' + (meterNum + 1) : modalName}
                    />
                    <View
                      style={{marginRight: 5, top: 8, width: width * 0.15}}
                      onPress={handleAddNewUnit}>
                      {meterInfo ? (
                        <TouchableOpacity
                          onPress={() => {
                            getMeterData(meterInfo, meterNum);
                            enableLocation(true);
                            setEditMeter(true);
                          }}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextReuseableComponent
                            title
                            style={{
                              color: 'black',
                              fontFamily: Fonts.ComfortaaRegular,
                            }}
                            value={'Edit'}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>
                {!addNewMeter && (!meterInfo || meterInfo == null) ? (
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
                        <TextReuseableComponent
                          title
                          style={styles.desciptionHeading}
                          value={'BUILDING*'}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {marginVertical: width * 0.02},
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
                        <TextReuseableComponent
                          title
                          style={styles.desciptionHeading}
                          value={'UNIT*'}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {marginVertical: width * 0.02},
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
                      <View style={{width: '80%'}}>
                        {error.errorUnits ? (
                          <HelperText type="error" visible={error.errorUnits}>
                            {error.errorUnits}
                          </HelperText>
                        ) : null}
                      </View>
                      <View style={styles.desciptionContainer}>
                        <TextReuseableComponent
                          title
                          style={styles.desciptionHeading}
                          value={'UNIT MIX*'}
                        />
                      </View>
                      <View style={{zIndex: 1}}></View>
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
                          itemTextStyle={{color: '#222'}}
                          itemsContainerStyle={{
                            maxHeight: width * 0.25,
                          }}
                          items={unitMix}
                          resetValue={false}
                          onFocus={true}
                          btnDisabled={unitMixLoader}
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
                            value: selectedUnitMix,
                            defaultValue: selectedUnitMix,
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View style={{width: '80%'}}>
                        {error.errorUnitMix ? (
                          <HelperText type="error" visible={error.errorUnitMix}>
                            {error.errorUnitMix}
                          </HelperText>
                        ) : null}
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            addDeviceInUnit();
                          }}
                          style={{
                            borderRadius: width * 0.02,
                            padding: 10,
                            marginBottom: 20,
                            marginTop: 20,
                            backgroundColor: '#25aae1',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextReuseableComponent
                            title
                            style={{color: 'white'}}
                            value={'Save Unit'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* <View
                    style={{
                      flex: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {meterListData?.length > 0 && <View>
                      <TextReuseableComponent heading value={"Meters"} style={{ marginTop: 5 }} />
                    </View>}
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          flex: 8,
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          padding: 5,
                        },
                      ]}>
                      <ScrollView showsVerticalScrollIndicator={false} >
                        {loadMeters ? (
                          <ActivityIndicator color={'#25AAE1ec'} size={'large'} />
                        ) : (
                          meterListData?.length === 0 ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TextReuseableComponent heading style={{
                              color: '#25AAE1ec',
                            }} value={"No Meters"} />
                          </View> :
                            meterListData?.length > 0 &&
                            meterListData?.map((item, index) => (
                              <TouchableOpacity
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
                                    getMeterData(item, index);
                                  enableLocation(true);
                                }}
                                style={styles.meterContainer}>
                                <TextReuseableComponent title style={
                                  styles.meterDesciptionHeading
                                } value={`Meter- ${index + 1}`} />
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
                      </ScrollView>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        {type == 'addMeterDirect' || type == 'meterDirect' ? (
                          meterData.length == 1 ? (
                            <View style={{ marginLeft: width * 0.02 }}>
                              <TextReuseableComponent title style={{
                                color: '#25AAE1ec',
                              }} value={"No Meters"} />
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
                                  handleAddMeter();
                              }}
                              style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                zIndex: 1,
                                borderWidth: 2,
                                borderRadius: 5,
                                borderColor: '#25AAE1ec',
                                paddingVertical: width * 0.01,
                              }}>
                              <TextReuseableComponent title style={{
                                color: '#25AAE1ec',
                              }} value={"Add Meter"} />
                            </TouchableOpacity>
                          )
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              handleAddMeter();
                            }}
                            style={{
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              zIndex: 1,
                              borderWidth: 2,
                              borderRadius: 5,
                              borderColor: '#25AAE1ec',
                              width: width * 0.8,
                              marginTop: width * 0.035,
                              paddingHorizontal: width * 0.02,
                              paddingVertical: width * 0.01,
                            }}>
                            <TextReuseableComponent title style={{
                              color: '#25AAE1ec',
                            }} value={"Add Meter"} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View> */}
                    <View
                      style={{
                        // backgroundColor: 'pink',
                        flex: 2,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <View style={styles.footerBtn}></View>
                    </View>
                  </View>
                ) : null}
                {!addNewMeter && meterInfo ? (
                  <View style={{marginTop: 20}}>
                    <View style={styles.infoViewContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomWidth: width * 0.003,
                          marginVertical: height * 0.01,
                          paddingBottom: 5,
                          // marginHorizontal: 15,
                          width: width * 0.8,
                        }}>
                        <TextReuseableComponent
                          title
                          style={{
                            flex: 1,
                            color: '#25AAE1ec',
                            fontFamily: Fonts.Montserrat,
                            borderColor: 'black',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                          }}
                          value={'Meter Details'}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setEditMeter(false);
                            setSliderNumber(2);
                            setSliderProgress(sliderProgress + 0.25);
                            getMeterData(meterInfo, meterNum);
                            enableLocation(true);
                          }}
                          style={{
                            position: 'absolute',
                            right: 0,
                            borderRadius: width * 0.02,
                            paddingHorizontal: 10,
                            // backgroundColor: '#25aae1',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <MaterialIcons
                            name="edit"
                            color="black"
                            size={width * 0.045}
                          />
                          {/* <TextReuseableComponent title style={{
                          color: 'black',
                        }} value={"Edit"} /> */}
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: width * 0.8,
                          alignItems: 'center',
                          marginVertical: height * 0.01,
                          marginBottom: height * 0.01,
                        }}>
                        <TextReuseableComponent
                          title
                          style={[
                            styles.dataFieldText,
                            {width: '45%', textAlign: 'left'},
                          ]}
                          value={'Attached To:'}
                        />
                        <View style={{width: '55%', alignItems: 'flex-end'}}>
                          <View
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}>
                            <TextReuseableComponent
                              title
                              value={
                                meterInfo?.attachedTo_name == null ||
                                meterInfo?.attachedTo_name == ''
                                  ? '--'
                                  : meterInfo?.attachedTo_name
                              }
                            />
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: width * 0.8,
                          alignItems: 'center',
                          marginVertical: height * 0.01,
                          marginBottom: height * 0.01,
                        }}>
                        <TextReuseableComponent
                          title
                          style={[
                            styles.dataFieldText,
                            {width: '45%', textAlign: 'left'},
                          ]}
                          value={'Initial Meter Reading:'}
                        />
                        <View style={{width: '55%', alignItems: 'flex-end'}}>
                          <View
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}>
                            <TextReuseableComponent
                              title
                              value={
                                meterInfo?.initial_meter_reading == null ||
                                meterInfo?.initial_meter_reading == ''
                                  ? '--'
                                  : meterInfo?.initial_meter_reading
                              }
                            />
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: width * 0.8,
                          alignItems: 'center',
                          marginVertical: height * 0.01,
                        }}>
                        <TextReuseableComponent
                          title
                          style={[
                            styles.dataFieldText,
                            {width: '45%', textAlign: 'left'},
                          ]}
                          value={'Device Serial Number:'}
                        />
                        <View style={{width: '55%', alignItems: 'flex-end'}}>
                          <View
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}>
                            <TextReuseableComponent
                              title
                              value={
                                meterInfo?.device_serial_number == null ||
                                meterInfo?.device_serial_number == ''
                                  ? '--'
                                  : meterInfo?.device_serial_number
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.infoViewContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomWidth: width * 0.003,
                          marginVertical: height * 0.01,
                          paddingBottom: 5,
                          // marginHorizontal: 15,
                          width: width * 0.8,
                        }}>
                        <TextReuseableComponent
                          title
                          style={{
                            flex: 1,
                            color: '#25AAE1ec',
                            fontFamily: Fonts.Montserrat,
                            borderColor: 'black',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                          }}
                          value={'Installation Status'}
                        />
                        {meterInfo?.installation_status == 'Incomplete' && (
                          <TouchableOpacity
                            onPress={() => {
                              setEditMeter(false);
                              setStatusAnimation(false);
                              setSliderNumber(5);
                              setSliderProgress(sliderProgress + 0.75);
                              getMeterData(meterInfo, meterNum);
                              enableLocation(true);
                            }}
                            style={{
                              position: 'absolute',
                              right: 0,
                              borderRadius: width * 0.02,
                              paddingHorizontal: 10,
                              // backgroundColor: '#25aae1',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <MaterialIcons
                              name="edit"
                              color="black"
                              size={width * 0.045}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: width * 0.8,
                          alignItems: 'center',
                          marginVertical: height * 0.01,
                        }}>
                        <TextReuseableComponent
                          title
                          style={[
                            styles.dataFieldText,
                            {width: '45%', textAlign: 'left'},
                          ]}
                          value={'Installation Status:'}
                        />
                        <View style={{width: '55%', alignItems: 'flex-end'}}>
                          <View
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}>
                            <TextReuseableComponent
                              title
                              value={
                                meterInfo?.installation_status == null ||
                                meterInfo?.installation_status == ''
                                  ? '--'
                                  : meterInfo?.installation_status
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
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
              <TextReuseableComponent
                title
                style={{
                  textAlign: 'center',
                  color: 'white',
                  paddingLeft: width * 0.08,
                }}
                value={'Scan Barcode'}
              />
            </View>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{flex: 1}}
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
  infoViewContainer: {
    width: width * 0.9,
    elevation: width * 0.01,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
    borderRadius: width * 0.05,
  },
  dataFieldText: {
    fontSize: height * 0.022,
    fontFamily: Fonts.Montserrat,
    width: width * 0.7,
    textAlign: 'center',
  },
  dataFieldHeadings: {
    fontSize: width * 0.05,
    color: '#25AAE1ec',
    fontFamily: Fonts.Montserrat,
    marginTop: height * 0.01,
    borderColor: 'black',
    borderBottomWidth: width * 0.003,
    textTransform: 'uppercase',
    marginBottom: height * 0.01,
    textAlign: 'center',
    width: width * 0.8,
  },
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
  meterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    margin: width * 0.01,
    width: width * 0.75,
    elevation: 2,
    backgroundColor: 'white',
    // borderWidth: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  meterDesciptionHeading: {
    marginRight: width * 0.07,
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
    textAlign: 'center',
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
