import React, {useState, useEffect, useRef, useReducer} from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
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
  ToastAndroid,
  Switch,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Video from 'react-native-video';
import SystemSetting from 'react-native-system-setting';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, FAB, HelperText, Divider} from 'react-native-paper';
import {DotsLoader, OpacityDotsLoader} from 'react-native-indicator';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Fonts} from '../../../../../../utils/fonts';
import PropIcon from '../../../../../../../Images/proplocation.png';
import Drop from 'react-native-vector-icons/Ionicons';
import Scanner from 'react-native-vector-icons/Ionicons';
import Delete from 'react-native-vector-icons/MaterialIcons';
import {create} from 'apisauce';
import Base_URL from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import Back from 'react-native-vector-icons/MaterialIcons';
import AppIntroSlider from 'react-native-app-intro-slider';
import SearchableDropdown from 'react-native-searchable-dropdown';
import useUpdateEffect from '../../../../../../hooks/useUpdateEffect';
import {Icon as IconX} from 'react-native-elements';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import Iconi from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import {withOrientation} from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
  Circle,
} from 'react-native-maps';
import {add, color, set} from 'react-native-reanimated';
import clc from 'cli-color';

const {width, height} = Dimensions.get('window');
const api = create({baseURL: Base_URL});
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
  type,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [defaultMeterValues, setDefaultMeterValues] = useState(true);
  const [defaultDeviceValues, setDefaultDeviceValues] = useState(true);
  const [defaultData, setDefaultData] = useState([]);
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
  const [addTypeInput, setAddTypeInput] = useState(false);
  const [letsFinish, setLetsFinish] = useState(false);
  const [letsUpdateMeterData, setLetsUpdateMeterData] = useState(false);
  const [newMeterType, setNewMeterType] = useState('');
  const [typeLoader, setTypeLoader] = useState(false);
  const [selectLocation, setSelectLocation] = useState(false);
  const [statusAnimation, setStatusAnimation] = useState(false);
  const [iniLat, setIniLat] = useState(0);
  const [iniLong, setIniLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [latDelta, setLatDelta] = useState(LATITUDE_DELTA);
  const [longDelta, setLongDelta] = useState(LONGITUDE_DELTA);
  const [installationStatus, setInstallationStatus] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [checkSerial, setCheckSerial] = useState(false);
  const [modelNo, setModelNo] = useState('');
  const [productNo, setProductNo] = useState('');
  const [addModelNo, setAddModelNo] = useState('');
  const [addProductNo, setAddProductNo] = useState('');
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
  ]);
  const [addDevice, setAddDevice] = useState([
    {
      id: 0,
      select: '',
      selectId: '',
      name: 'Manufacturer',
      data: [],
    },
    {
      id: 1,
      selectId: '',
      select: '',
      name: 'Device Type',
      data: [],
    },
    {
      id: 2,
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
      name: 'Meter Serial Number',
      value: '',
    },
    // {
    //   id: 2,
    //   error: '',
    //   name: 'Attached To',
    //   value: '',
    // },
  ]);
  const [selectUtil, setSelectUtil] = useState([]);
  const [utilTypes, setUtilTypes] = useState([]);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [newMeterFlag, setNewMeterFlag] = useState(true);
  const [inputFocus, setInputFocus] = useState(false);
  const selectedTypes = useRef([]);
  const [reasons, setReasons] = useState([]);
  const [reasonArr, setReasonArr] = useState([]);
  const [meterAddingId, setMeterAddingId] = useState('');
  const [reasonId, setReasonId] = useState(null);
  const [reasonDes, setReasonDes] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [addManufacturer, setAddManufacturer] = useState('');
  const [addUtility, setAddUtility] = useState('');
  const [addAttached, setAddAttached] = useState('');
  const [showAddType, setShowAddType] = useState(false);
  const [meterListLoader, setMeterListLoader] = useState(true);
  const [sliderNumber, setSliderNumber] = useState(1);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [doneAnimation, setDoneAnimation] = useState(false);
  const [hideBtn, setHideBtn] = useState(false);
  const [addNewType, setAddNewType] = useState(false);
  const [showAddMeterSlider, setShowAddMeterSlider] = useState(false);
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
    meterList: [],
    checkIndex: 0,
  });
  const [newMeter, setNewMeter] = useState({
    id: 0,
    number: 0,
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

  const enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    if (!location) {
      Alert.alert('Enable Loaction', 'Kindly TurnOn Location to Add Meter', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: turnLocationOn,
        },
      ]);
    } else {
      if (Platform.OS == 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then((result) => {
            if (result == RESULTS.GRANTED) {
              checkLocation(true);
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
            checkLocation(true);
          } else {
            checkLocation(false);
          }
        } catch (err) {
          alert(err);
        }
      }
    }
  };

  const AddTypes = (item) => {
    console.log('ADD CHALA', item);
    const items = selectUtil;
    items.push(item);
    // selectedTypes.current = items;
    setSelectUtil(items);
  };

  const checkLocation = async (locationAccess) => {
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
      _renderMap();
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

  const getToken = async () => {
    setMeterListLoader(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const res = await api.get('/property/equipment/meter/all-meters');

    let arr1 = res.data?.data;
    let arr2 = meterTypes;
    // console.log('arr1--->', arr1);
    // console.log('arr2--->', arr2);
    // console.log('antiIntersection arr1--->', arr1);
    // console.log('antiIntersection arr2--->', arr2);

    // const antiIntersection = arr1.filter(
    //   (item1) => !arr2.some((item2) => item1.id == item2.meter_id),
    // );

    // // console.log('antiIntersection--->', antiIntersection);
    setState((oldState) => ({
      ...oldState,
      // meterList: antiIntersection.sort((a, b) => (a.name > b.name ? 1 : -1)),
      meterList: arr1,
    }));
    setMeterListLoader(false);
  };

  useUpdateEffect(async () => {
    if (type == 'add' || type == 'addMeterDirect') {
      console.log('CONDITION CHALI');
      setLoadMeters(false);
    } else {
      setLoadMeters(true);
    }
    if (flag) {
      getToken();
    }
    callApi();
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const res = await api.get('/property/equipment/meter/all-meters');
    let arr1 = res.data?.data;
    let arr2 = meterTypes;
    // console.log('antiIntersection USEEFFECT arr1--->', arr1);
    console.log('antiIntersection USEEFFECT arr2--->', arr2);

    if (arr2.length > 0) {
      const Intersection = arr2.filter((item1) =>
        arr1.some((item2) => item1.meter_id == item2.id),
      );
      // console.log('Intersection--->>>>', Intersection);
      let arr3 = unitDetails?.unit?.unit_meter;
      var getMeter = Intersection.filter((item1) =>
        arr3.some((item2) => item1.meter_id == item2.meter_id),
      );
      // console.log(
      //   'Get Meter Information---->>',
      //   getMeter[0].reasons[0].options_reason_id,
      // );
      setMeterListData(getMeter);
      // if (getMeter.length) {

      // }
    }
    setLoadMeters(false);
  }, [modalVisible]);

  // useEffect(() => {
  //   _renderMap();
  // }, []);
  useEffect(() => {
    console.log(clc.xterm(80)('AYA PROPERTY ID', propertyId));
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
      console.log('un in mod-->>', unitDetails);
      setState((oldState) => ({
        ...oldState,
        lastUnitData: unitDetails?.unit?.name,
      }));
    }
    callApi();
  }, [meterTypes, unitDetails, modalVisible]);

  useEffect(() => {
    console.log('sliderProgress-->>', sliderProgress);
    if (sliderNumber == 6) {
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      setDoneAnimation(true);
      setTimeout(() => {
        setDoneAnimation(false);
      }, 5000);
    }
  }, [sliderNumber]);

  const addMeterInNewArray = (value) => {
    // setMeterMenuVisible(false);
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNewMeter((oldState) => ({
      ...oldState,
      id: value.id,
      name: value.name,
    }));
  };

  //!----------->

  const toggleScanner = async (value) => {
    disableFlag();
    setState((oldState) => ({
      ...oldState,
      scanIndex: value,
    }));
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === true) {
          setState((oldState) => ({
            ...oldState,
            isScannerVisible: true,
            hasAccess: true,
            scan: true,
          }));
        } else {
          setState((oldState) => ({
            ...oldState,
            hasAccess: false,
          }));
          Alert.alert(
            "You don't have access for the Camera",
            'Kindly TurnOn Camera Permission from Settings to use Scanner',
          );
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
    listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
    listSlide[0].selectId = ''; // replace e.target.value with whatever you want to change it to
    listSlide[0].error = ''; // replace e.target.value with whatever you want to change it to
    listSlide[1].error = ''; // replace e.target.value with whatever you want to change it to
    listSlide[1].selectId = ''; // replace e.target.value with whatever you want to change it to
    if (index == 0) {
      listSlide[1].select = '';
    } else {
      listSlide[0].select = '';
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
    }));
    closeModal();
    if (type == 'addMeterDirect' || type == 'add') {
      setState((oldState) => ({
        ...oldState,
        lastUnitData: '',
      }));
    }
  };

  const callApi = async () => {
    setReasons([]);
    setLoadManufacturers(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const utilRes = await api.get('/property/equipment/utility-type/all');
    // console.log('utilRes--->', utilRes?.data?.data);
    setUtilTypes(utilRes?.data?.data);
    const utilityRes = utilRes?.data?.data;

    const defaultUnitData = await api.get(
      `/property/default-meter-device/${propertyId}`,
    );

    // console.log('Default Unit Data--->', defaultUnitData);
    if (defaultUnitData.ok) {
      // console.log(
      //   clc.cyanBright(
      //     'WE Got Default Data',
      //     JSON.stringify(defaultUnitData?.data?.data),
      //   ),
      // );
      const some = defaultUnitData?.data?.data?.default_meter_device;
      setDefaultData(some);
      let listSlide = [...slide1]; // copying the old datas array
      listSlide[0].select = some?.devices[0]?.manufacturer; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = some?.devices[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = some?.devices[0]?.name; // replace e.target.value with whatever you want to change it to
      listSlide[1].selectId = some?.devices[0]?.id; // replace e.target.value with whatever you want to change it to
      setModelNo(some?.device_name?.model_no);
      setProductNo(some?.devices[0]?.product_desc);
      setSlide1(listSlide);
      setNewMeter((oldState) => ({
        ...oldState,
        id: some?.meter_id[0],
        name: some?.meter_name[0]?.name,
      }));

      const utilityIds = some?.utility_type_id;

      const filterRes = utilityRes.filter((item1) =>
        utilityIds.some((item2) => item1.id == item2),
      );
      // console.log(' UTILITY RES', filterRes);
      setSelectUtil(filterRes);

      const defaultDis =
        defaultUnitData?.data?.data?.defaultLocation?.radial_dist;
      setRadialDis(defaultDis * 1000);
    }
    const ManufacturersResponse = await api.get(
      '/property/equipment/manufacturer/all',
    );
    setState((oldState) => ({
      ...oldState,
      manufacturersData: ManufacturersResponse?.data?.data,
    }));
    let listSlide = [...slide1]; // copying the old datas array
    listSlide[0].data = ManufacturersResponse?.data?.data;
    setSlide1(listSlide);
    let deviceDataManufacturer = [...addDevice]; // copying the old datas array
    deviceDataManufacturer[0].data = ManufacturersResponse?.data?.data;
    setAddDevice(deviceDataManufacturer);
    const DeviceTypesResponse = await api.get(
      '/property/equipment/device-type/all',
    );
    let deviceData = [...addDevice]; // copying the old datas array
    deviceData[1].data = DeviceTypesResponse?.data?.data;
    setAddDevice(deviceData);
    const AttachedToResponse = await api.get(
      '/property/equipment/attached_to/attach',
    );
    // console.log('AttachedToResponse_________', AttachedToResponse?.data);
    setAttachedToData(AttachedToResponse?.data?.data);
    const reasoneResponce = await api.get(
      '/property/equipment/unit/reasons/all',
    );

    let reasonArr = reasoneResponce?.data?.data;
    const uniqueArr = [
      ...new Map(reasonArr?.map((v) => [v.options_reason_id, v])).values(),
    ];
    setReasons(uniqueArr);
    // console.log('reasons_________', reasoneResponce?.data?.data);
    setLoadManufacturers(false);
  };

  const getdefaultDeviceData = (val) => {
    setDefaultDeviceValues(val);
    if (val) {
      let listSlide = [...slide1]; // copying the old datas array
      listSlide[0].select = defaultData?.devices[0]?.manufacturer; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = defaultData?.devices[0]?.manufacturer_id; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = defaultData?.devices[0]?.name; // replace e.target.value with whatever you want to change it to
      listSlide[1].selectId = defaultData?.devices[0]?.id; // replace e.target.value with whatever you want to change it to
      setModelNo(defaultData?.device_name?.model_no);
      setProductNo(defaultData?.devices[0]?.product_desc);
      setSlide1(listSlide);
    }
  };

  const getdefaultMeterData = (val) => {
    setDefaultMeterValues(val);
    if (val) {
      setNewMeter((oldState) => ({
        ...oldState,
        id: defaultData?.meter_id[0],
        name: defaultData?.meter_name[0]?.name,
      }));

      const utilityIds = defaultData.utility_type_id;

      const filterRes = utilTypes.filter((item1) =>
        utilityIds.some((item2) => item1.id == item2),
      );
      console.log(' UTILITY RES', filterRes);
      setSelectUtil(filterRes);
    }
  };

  const getDevice = async (some, index) => {
    console.log('get devices--->', some?.id);
    const deviceResponse = await api.get(
      `/property/equipment/device/all/${some?.id}`,
    );
    setState((oldState) => ({
      ...oldState,
      devicesData: deviceResponse?.data?.data,
    }));
    let listSlide = [...slide1]; // copying the old datas array
    listSlide[index].select = some?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = some?.id; // replace e.target.value with whatever you want to change it to
    if (index == 0) {
      listSlide[1].data = deviceResponse?.data?.data;
      listSlide[1].selectId = '';
      listSlide[1].select = '';
    } else if (index == 1) {
      console.log('get model_no--->', some?.model_nos);

      setModelNo(some?.model_no);
      setProductNo(some?.product_desc);
    }
    setSlide1(listSlide);
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
      meters: meterData,
    };

    // console.log('Meter Data 1', meterData[0].reasons);
    // console.log('Meter Data 2', meterData[1].reasons);
    // console.log('data--->', data);
    if (type == 'add' || type == 'addMeterDirect') {
      const unitResponse = await api.post(
        `/property/equipment/unit/add-unit`,
        data,
      );
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        setIsActivityLoader(false);
        alert(unitResponse?.data?.message);
        reRun(unitResponse?.data?.data);
        console.log('datachecckk-->>', unitResponse?.data?.data);
      } else {
        setIsActivityLoader(false);
        console.log('ADD RESPONSE FALSE MILA');
        alert(unitResponse?.data?.message);
      }
      console.log('Add unit response', unitResponse?.data);
    } else {
      const unitResponse = await api.patch(
        `/property/equipment/unit/update-unit/${unitDetails?.unit?.id}`,
        data,
      );
      console.log('datachecckk-->>', unitResponse?.data?.data);
      console.log(
        'Unitmeterchecckk-->>',
        unitResponse?.data?.data?.unit?.unit_meter,
      );
      console.log('update data check-->>', unitResponse?.data);
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
    const SerialResponse = await api.post(
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
      setSliderProgress(sliderProgress + 0.2);
    } else {
      Alert.alert(
        'Device Serial Already Exists',
        'Please type or scan another Device Serial Number',
      );
    }
  };

  const changeSlider = () => {
    if (sliderNumber == 3 && meterAddingId == '') {
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
        setSliderProgress(sliderProgress + 0.2);
      }
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
      setSliderProgress(sliderProgress + 0.2);
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
    const addMeter = meterListData.filter(
      (item) => item.meter_id != meterAddingId,
    );
    setMeterListData(addMeter);
    setLetsFinish(true);

    // console.log('meterArray------>', meterArray);
    setStatusAnimation(false);
    // const newList = state.meterList.filter((item) => item.id != newMeter.id);
    // setState((oldState) => ({
    //   ...oldState,
    //   meterList: newList,
    // }));
    setShowAddMeterSlider(false);
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
    const selectUtilIds = [];
    for (let i = 0; i < reasonPath?.length; i++) {
      reasonBase64s.push(`data:image/jpeg;base64,${reasonPath[i]?.base64}`);
    }
    for (let i = 0; i < selectUtil?.length; i++) {
      selectUtilIds.push(selectUtil[i].id);
    }
    var meterArray = [...meterListData]; // copying the old datas array
    meterArray.push({
      device: {
        manufacturer: slide1[0].select,
        manufacturer_id: slide1[0].selectId,
        name: slide1[1].select,
      },
      meter_id: newMeter.id,
      meter_name: newMeter.name,
      device_serial_number: slide2[0].value,
      meter_serial_number: slide2[2].value,
      device_id: slide1[1].selectId,
      initial_meter_reading: slide2[1].value,
      latitude: lat,
      longitude: long,
      attachedTo_id: attachedToId,
      attachedTo_name: attachedTo,
      thumbnail: filePath,
      installation_status: installationStatus,
      utility_type_id: selectUtilIds,
      reasons: [
        {
          options_reason_id: reasonId,
          text_reason: reasonDes,
          picture: reasonBase64s,
        },
      ],
    });
    setMeterListData(meterArray);

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

    meterListData?.map((item) => {
      // console.log('Get meterData Information---->>', item.reasons);
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
      loopData.push({
        meter_id: item.meter_id,
        device_serial_number: item.device_serial_number,
        meter_serial_number: item.meter_serial_number,
        device_id: item.device_id,
        initial_meter_reading: item.initial_meter_reading,
        latitude: item.latitude,
        longitude: item.longitude,
        attachedTo_id: item.attachedTo_id,
        thumbnail: `data:image/jpeg;base64,${imageBase64}`,
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
      });
    });
    setMeterData(loopData);
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

  const renderSlide2 = ({item}) => {
    return (
      <View
        style={{
          width: width * 0.9,
          alignItems: 'center',
        }}
        key={item?.id}>
        <TouchableOpacity
          style={{
            height: width * 0.12,
            width: width * 0.8,
            // elevation: width * 0.005,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            backgroundColor: 'white',
            paddingHorizontal: width * 0.01,
            borderRadius: width * 0.007,
            marginVertical: width * 0.01,
            justifyContent: 'center',
          }}
          onPress={() => addMeterInNewArray(item)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <Drop name={item.icon} size={15} color="#3E89BF" /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={typeSwitcher(item.name)}
                style={styles.untiDetailImage}
              />
              <Text
                style={{
                  fontSize: width * 0.05,
                  fontFamily: Fonts.Montserrat,
                  textTransform: 'capitalize',
                }}>
                {item.name}
              </Text>
            </View>
            {item.id == newMeter.id ? (
              <Iconi
                name="radio-button-on"
                size={width * 0.05}
                color="#25AAE1ec"
              />
            ) : (
              <Iconi
                name="radio-button-off"
                size={width * 0.05}
                color="black"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSlide3 = ({item, index}) => {
    // console.log('index check slider 3 ---> ',index)
    if (index == 1 && item.value == null) {
      let newArr = [...slide2]; // copying the old datas array
      newArr[index].value = '0'; // replace e.target.value with whatever you want to change it to
      setSlide2(newArr);
    }
    return (
      <View style={{width: width * 0.8}} key={item.id}>
        <Text style={[styles.meterDesciptionHeading, {top: width * 0.01}]}>
          {item.name + (index < 3 ? '*' : '')}
        </Text>
        <TextInput
          placeholder={item.name}
          value={index == 1 && item.value == null ? '0' : item.value}
          dense={true}
          keyboardType={index == 1 ? 'numeric' : 'default'}
          error={item.error}
          right={
            index == 0 &&
            (type == 'meterDirect' || type == 'addMeterDirect' ? null : (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity
                    onPress={() => toggleScanner(index)}
                    style={{zIndex: 1}}>
                    <Scanner name="scan" size={width * 0.06} />
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
            meterAddingId && index != 2
              ? true
              : (index == 0 && type == 'meterDirect') ||
                type == 'addMeterDirect'
              ? true
              : false
          }
          style={styles.meterInput}
          mode={'outlined'}
          // numberOfLines={index == 2 ? 3 : 1}
          // multiline={index == 2 ? true : false}
          theme={{
            colors: {
              text: '#25AAE1ec',
              primary: '#25AAE1ec',
              selectionColor: 'red',
            },
          }}
        />
      </View>
    );
  };

  const renderSlide5 = ({item, index}) => {
    // console.log('index check slider 3 ---> ',index)
    return (
      <View style={{width: width * 0.8}} key={item.id}>
        <Text style={[styles.meterDesciptionHeading, {top: width * 0.01}]}>
          {item.name}
        </Text>
        <TextInput
          placeholder={item.name}
          value={item.value}
          dense={true}
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
          mode={'outlined'}
          // numberOfLines={index == 2 ? 3 : 1}
          // multiline={index == 2 ? true : false}
          theme={{
            colors: {
              text: '#25AAE1ec',
              primary: '#25AAE1ec',
              selectionColor: 'red',
            },
          }}
        />
      </View>
    );
  };

  const selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    setSelectLocation(true);
  };

  const _renderMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Positon Batao', position);
        // var lat = parseFloat(position.coords.latitude);
        // var long = parseFloat(position.coords.longitude);
        var lat = parseFloat(propertyLat);
        var long = parseFloat(propertyLong);
        setIniLat(lat);
        setIniLong(long);
        setLat(lat);
        setLong(long);

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
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  const cameraLaunch = (type) => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
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
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
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
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyboard Hidden');
      setVerticalOffs(-180);
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
    setDefaultDeviceValues(true);
    setDefaultMeterValues(true);
    setNewMeterFlag(true);
    setSliderNumber(1);
    setSliderProgress(0);
    setReasonText('');
    setReasonId(null);
    setReasonDes('');
    setInstallationStatus(0);
    setFilePath('');
    setReasonPath([]);
    setReasonArr([]);
    setAttachedToId(null);
    setAttachedTo('');
    setModelNo('');
    setProductNo('');
    setAddModelNo('');
    setAddProductNo('');
    setSelectUtil([]);
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
      newArr[2].value = '';
    });
    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
    }));
    setLoadMeters(false);
    setShowAddMeterSlider(false);
    if (meterAddingId) {
      let removeMeterLIst = state.meterList.filter(
        (item) => item.id != newMeter.id,
      );
      setState((oldState) => ({
        ...oldState,
        meterList: removeMeterLIst,
      }));
      console.log('removeMeterLIst-->', removeMeterLIst);
    }
    setMeterAddingId('');
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
      const ManufacturersResponse = await api.post(
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
    } else if (showAddType == 'Utility') {
      let data = {
        name: addUtility,
      };
      const UtilityResponse = await api.post(
        '/property/equipment/utility-type/add',
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
        callApi();
        cancelAddNewType();
      } else {
        alert(UtilityResponse?.data?.message);
      }
    } else if (showAddType == 'Attached To') {
      let data = {
        name: addAttached,
      };
      const AttachedToResponse = await api.post(
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
        callApi();
        cancelAddNewType();
      } else {
        alert(AttachedToResponse?.data?.message);
      }
    } else {
      //* FIXME: Device Adding
      let data = {
        name: addDevice[2].select,
        manufacturer_id: addDevice[0].selectId,
        device_type_id: addDevice[1].selectId,
        model_no: addModelNo,
        product_no: addProductNo,
      };
      const DeviceTypesResponse = await api.post(
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
        callApi();
        cancelAddNewType();
      } else {
        alert(DeviceTypesResponse?.data?.message);
      }
    }
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
    deviceData[2].select = '';
    deviceData[2].selectId = '';
    setAddDevice(deviceData);
    setAddManufacturer('');
    setAddUtility('');
    setAddAttached('');
    setShowAddType(false);
    setAddTypeInput(false);
    setNewMeterFlag(true);
  };

  const getMeterData = (data, index) => {
    console.log('REASONS DATA', data.reasons);
    // if (data.reasons.length > 0) {
    //   setReasonText(data.reasons.name);
    //   setReasonId(data.reasons.options_reason_id);
    //   setReasonDes(data.reasons.text_reason);
    // }
    setReasonArr(data.reasons);
    setMeterAddingId(data.meter_id);
    // let arr1 = {
    //   id: data.meter_id,
    //   name: data.meter_name,
    // };
    // let arr2 = [...state.meterList];
    // arr2.push(arr1);
    // setState((oldState) => ({
    //   ...oldState,
    //   meterList: arr2,
    // }));
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
    slide1?.map((item, index) => {
      let newArr = [...slide1];
      newArr[index].data = [];
      newArr[0].select = data.device.manufacturer;
      newArr[1].select = data.device.name;
      newArr[0].selectId = data.device.manufacturer_id;
      newArr[1].selectId = data.device_id;
    });
    slide2?.map((item, index) => {
      let newArr = [...slide2];
      newArr[0].value = data.device_serial_number;
      newArr[1].value = data.initial_meter_reading;
      newArr[2].value = data.meter_serial_number;
    });
    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
      number: index + 1,
    }));
    setNewMeterFlag(false);
    setShowAddMeterSlider(false);
  };

  const slideBacker = () => {
    setSliderNumber(sliderNumber - 1);
    setSliderProgress(sliderProgress - 0.2);
    setShowAddType(false);
  };

  const [verticalOffs, setVerticalOffs] = useState(-180);

  const AddNewMeterType = async () => {
    setTypeLoader(true);
    setAddTypeInput(false);
    setNewMeterType('');
    let data = {
      name: newMeterType,
    };
    console.log('New Meter Type', data);
    const addres = await api.post('/property/equipment/meter/add-meter', data);
    if (addres?.data?.bool) {
      const res = await api.get('/property/equipment/meter/all-meters');
      let arr1 = res.data?.data;
      let arr2 = meterTypes;
      // console.log('arr1--->', arr1);
      // console.log('arr2--->', arr2);

      const antiIntersection = arr1.filter(
        (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
      );
      console.log('antiIntersection--->', antiIntersection);
      setState((oldState) => ({
        ...oldState,
        meterList: antiIntersection.sort((a, b) => (a.name > b.name ? 1 : -1)),
      }));
      setTypeLoader(false);
    } else {
      alert('Add Meter Failed');
      setTypeLoader(false);
    }
  };
  // console.log('Slide @ means IMR value', typeof slide2[1].value);
  // console.log('Slide @ means IMR value type', slide2[1].value);
  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        statusBarTranslucent
        style={{margin: 0}}
        // onBackdropPress={() => se7tShowAddMeterSlider(false)}
        isVisible={modalVisible}>
        {isActivityLoader ? (
          <View styles={styles.boxInner}>
            <View styles={styles.boxHeader}>
              <ActivityIndicator color="#25AAE1ec" size="large" />
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            style={{flex: 1, justifyContent: 'flex-end'}}
            behavior={Platform.OS ? 'padding' : 'height'}
            keyboardVerticalOffset={verticalOffs}>
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
                      name={sliderNumber == 6 ? 'check' : 'navigate-next'}
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
                        {fontSize: width * 0.06},
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
                          <Text style={[styles.meterDesciptionHeading]}>
                            New {showAddType}
                          </Text>
                        </View>
                        <TextInput
                          placeholder={'Type new manufacturer'}
                          value={addManufacturer}
                          style={styles.meterInput}
                          mode={'outlined'}
                          theme={{
                            colors: {
                              text: '#25AAE1ec',
                              primary: '#25AAE1ec',
                              selectionColor: 'red',
                            },
                          }}
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
                                <Text style={styles.meterDesciptionHeading}>
                                  {item.name}
                                </Text>
                              </View>
                              {index < 2 ? (
                                <SearchableDropdown
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
                                    style: {
                                      padding: width * 0.027,
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
                                  <TextInput
                                    placeholder={'Type new Device'}
                                    value={item.select}
                                    style={styles.meterInput}
                                    mode={'outlined'}
                                    theme={{
                                      colors: {
                                        text: '#25AAE1ec',
                                        primary: '#25AAE1ec',
                                        selectionColor: 'red',
                                        zIndex: 10,
                                      },
                                    }}
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
                                    <TextInput
                                      placeholder="Type Model Number"
                                      value={addModelNo}
                                      showSoftInputOnFocus={false}
                                      style={styles.meterInput}
                                      mode={'outlined'}
                                      theme={{
                                        colors: {
                                          text: '#25AAE1ec',
                                          primary: '#25AAE1ec',
                                          selectionColor: 'red',
                                        },
                                      }}
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
                                    <TextInput
                                      placeholder="Type Product Description"
                                      value={addProductNo}
                                      showSoftInputOnFocus={false}
                                      style={styles.meterInput}
                                      mode={'outlined'}
                                      theme={{
                                        colors: {
                                          text: '#25AAE1ec',
                                          primary: '#25AAE1ec',
                                          selectionColor: 'red',
                                        },
                                      }}
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
                        <TextInput
                          placeholder={'Type new utility'}
                          value={addUtility}
                          style={styles.meterInput}
                          mode={'outlined'}
                          theme={{
                            colors: {
                              text: '#25AAE1ec',
                              primary: '#25AAE1ec',
                              selectionColor: 'red',
                            },
                          }}
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
                        <TextInput
                          placeholder={'Type new Attached To'}
                          value={addAttached}
                          style={styles.meterInput}
                          mode={'outlined'}
                          theme={{
                            colors: {
                              text: '#25AAE1ec',
                              primary: '#25AAE1ec',
                              selectionColor: 'red',
                            },
                          }}
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
                          {fontSize: width * 0.045, fontWeight: 'bold'},
                        ]}>
                        Meter Number{' '}
                        {newMeterFlag
                          ? meterListData.length + 1
                          : newMeter.number}
                      </Text>
                    </View>
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
                      <Text
                        style={[
                          styles.meterDesciptionHeading,
                          {
                            fontSize: width * 0.045,
                            height: width * 0.2,
                            top: -5,
                          },
                        ]}>
                        {sliderNumber == 1
                          ? 'Device Selection'
                          : sliderNumber == 2
                          ? 'Meter Type Selection'
                          : sliderNumber == 3
                          ? 'Device Information'
                          : sliderNumber == 4
                          ? 'Use Location'
                          : sliderNumber == 5
                          ? 'Set Thumbnail'
                          : sliderNumber == 6
                          ? 'Installation Status'
                          : 'Device Selection'}
                      </Text>
                      {sliderNumber < 6 ? (
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: width * -0.12,
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
                    </View>
                    <View style={{height: 5}} />
                  </View>
                  {sliderNumber == 2 ? (
                    <View
                      style={{
                        flex: 1,
                        height: width * 0.8,
                        width: width * 0.9,
                        alignItems: 'center',
                      }}>
                      {!typeLoader ? (
                        <>
                          <View
                            style={{
                              // height: height * 0.15,
                              marginVertical: height * 0.025,
                              // backgroundColor: 'seagreen',
                            }}>
                            {!addTypeInput ? (
                              <View
                                pointerEvents={'auto'}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                }}>
                                <SearchableDropdown
                                  items={state.meterList}
                                  onItemSelect={(item) => {
                                    console.log('kiasdad', item);
                                    addMeterInNewArray(item);
                                  }}
                                  containerStyle={{
                                    paddingBottom: width * 0.02,
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
                                    maxHeight: height * 0.08,
                                  }}
                                  resetValue={false}
                                  textInputProps={{
                                    editable: !defaultMeterValues,
                                    placeholder: 'Add Meter Type',
                                    underlineColorAndroid: 'transparent',
                                    style: {
                                      padding: width * 0.027,
                                      margin: 0,
                                      borderTopLeftRadius: width * 0.015,
                                      borderBottomLeftRadius: width * 0.015,
                                      borderColor: 'black',
                                      height: width * 0.13,
                                      backgroundColor: '#F6F6F6',
                                      borderTopWidth: width * 0.0019,
                                      borderLeftWidth: width * 0.0019,
                                      borderBottomWidth: width * 0.0019,
                                    },
                                    onTextChange: (text) => {},
                                    value: setTimeout(() => newMeter.name, 200),
                                    defaultValue: newMeter.name,
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
                                    height: width * 0.13,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => setAddTypeInput(true)}>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'space-evenly',
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
                                  New Meter Type
                                </Text>
                                <TextInput
                                  placeholder="Type New Meter Name"
                                  // value={}
                                  dense
                                  style={[
                                    styles.meterInput,
                                    {height: width * 0.13},
                                  ]}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                      zIndex: 10,
                                    },
                                  }}
                                  onChangeText={(text) => {
                                    setNewMeterType(text);
                                  }}
                                />

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    width: width * 0.8,
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                  }}>
                                  <TouchableOpacity onPress={cancelAddNewType}>
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
                                    disabled={!newMeterType}
                                    onPress={AddNewMeterType}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: width * 0.045,
                                        color: !newMeterType
                                          ? '#737373'
                                          : '#25AAE1ec',
                                        width: width * 0.15,
                                        textAlign: 'center',
                                      }}>
                                      Add
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              width: width * 0.8,
                              // backgroundColor: 'pink',
                            }}>
                            {showAddType !== 'Utility' ? (
                              <View
                                pointerEvents={'auto'}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                }}>
                                <SearchableDropdown
                                  multi={true}
                                  selectedItems={selectUtil}
                                  onItemSelect={(item) => {
                                    // getDevice(item, index);
                                    console.log('Test', item);
                                    AddTypes(item);
                                    forceUpdate();
                                  }}
                                  containerStyle={{
                                    paddingBottom: width * 0.02,
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
                                    maxHeight: height * 0.08,
                                  }}
                                  // items={item.data}
                                  items={utilTypes}
                                  onRemoveItem={(item, index) => {
                                    const items = selectUtil.filter(
                                      (sitem) => sitem.id !== item.id,
                                    );
                                    // selectedTypes.current = items;
                                    setSelectUtil(items);
                                  }}
                                  resetValue={false}
                                  textInputProps={{
                                    editable: !defaultMeterValues,
                                    placeholder: 'Add Utility Type',
                                    underlineColorAndroid: 'transparent',
                                    style: {
                                      padding: width * 0.027,
                                      margin: 0,
                                      borderTopLeftRadius: width * 0.015,
                                      borderBottomLeftRadius: width * 0.015,
                                      borderColor: 'black',
                                      height: width * 0.13,
                                      backgroundColor: '#F6F6F6',
                                      borderTopWidth: width * 0.0019,
                                      borderLeftWidth: width * 0.0019,
                                      borderBottomWidth: width * 0.0019,
                                    },
                                    // onTextChange: (text) => {
                                    //   onChangeManufacturer(text, index);
                                    // },
                                    // value: setTimeout(() => item.select, 200),
                                    // defaultValue: item.select,
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
                                    height: width * 0.13,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => showAddNewType('Utility')}>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <View>
                                {showAddType == 'Utility' && (
                                  <View>
                                    <View>
                                      <Text
                                        style={[
                                          styles.meterDesciptionHeading,
                                          {fontWeight: 'bold'},
                                        ]}>
                                        New {showAddType} Type
                                      </Text>
                                    </View>
                                    <TextInput
                                      placeholder={'Type new utility'}
                                      value={addUtility}
                                      style={styles.meterInput}
                                      mode={'outlined'}
                                      theme={{
                                        colors: {
                                          text: '#25AAE1ec',
                                          primary: '#25AAE1ec',
                                          selectionColor: 'red',
                                        },
                                      }}
                                      onChangeText={(text) => {
                                        setAddUtility(text);
                                      }}
                                    />
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                      }}>
                                      <TouchableOpacity
                                        onPress={() => setShowAddType(false)}>
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
                                                    'Attached To' && addAttached
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
                              </View>
                            )}

                            <View>
                              <FlatList
                                data={selectUtil}
                                // extraData={selectedTypes.current}
                                horizontal
                                renderItem={({item}) => (
                                  <View
                                    style={{
                                      borderWidth: 1,
                                      borderRadius: 8,
                                      flexDirection: 'row',
                                      padding: 5,
                                      margin: 5,
                                      height: width * 0.1,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Text style={{color: 'black'}}>
                                      {item.name}
                                    </Text>
                                    <TouchableOpacity
                                      disabled={defaultMeterValues}
                                      onPress={() => {
                                        const items = selectUtil.filter(
                                          (sitem) => sitem.id !== item.id,
                                        );
                                        setSelectUtil(items);
                                      }}>
                                      <Icon name="close" size={width * 0.05} />
                                    </TouchableOpacity>
                                  </View>
                                )}
                              />
                            </View>
                            <Switch
                              trackColor={{
                                false: '#767577',
                                true: '#81b0ff',
                              }}
                              thumbColor={'#f4f3f4'}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={(val) => getdefaultMeterData(val)}
                              value={defaultMeterValues}
                            />
                          </View>
                        </>
                      ) : (
                        <View style={{flex: 1, justifyContent: 'center'}}>
                          <ActivityIndicator size={'large'} color="#25AAE1ec" />
                        </View>
                      )}
                    </View>
                  ) : sliderNumber == 3 ? (
                    <View
                      style={{
                        flex: 1,
                        height: width * 0.8,
                        width: width * 0.9,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        // backgroundColor: 'pink',
                      }}>
                      <FlatList data={slide2} renderItem={renderSlide3} />
                      {showAddType !== 'Attached To' ? (
                        <View
                          style={{
                            flex: 20,
                            height: width * 0.25,
                            width: width * 0.8,
                            // backgroundColor: 'yellow',
                            // bottom: '20%',
                          }}>
                          <Text
                            style={[
                              styles.meterDesciptionHeading,
                              {top: width * 0.01},
                            ]}>
                            Attached To*
                          </Text>
                          <View
                            pointerEvents={'auto'}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                            }}>
                            <SearchableDropdown
                              onItemSelect={(item) => {
                                // getDevice(item, index);
                                setAttachedToId(item.id);
                                setAttachedTo(item.name);
                              }}
                              containerStyle={{
                                paddingBottom: width * 0.02,
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
                                maxHeight: height * 0.08,
                              }}
                              // items={item.data}
                              items={attachedToData}
                              resetValue={false}
                              textInputProps={{
                                placeholder: 'Select Attached To',
                                underlineColorAndroid: 'transparent',
                                style: {
                                  padding: width * 0.027,
                                  margin: 0,
                                  borderTopLeftRadius: width * 0.015,
                                  borderBottomLeftRadius: width * 0.015,
                                  borderColor: 'black',
                                  height: width * 0.13,
                                  backgroundColor: '#F6F6F6',
                                  borderTopWidth: width * 0.0019,
                                  borderLeftWidth: width * 0.0019,
                                  borderBottomWidth: width * 0.0019,
                                },
                                onTextChange: (text) => {
                                  onChangeAttachedTo(text);
                                },
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
                                height: width * 0.13,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={() => showAddNewType('Attached To')}>
                              <Icon
                                size={width * 0.06}
                                color="#fff"
                                name={'add'}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View style={{flex: 20}}>
                          {showAddType == 'Attached To' && (
                            <View>
                              <View>
                                <Text
                                  style={[
                                    styles.meterDesciptionHeading,
                                    {fontWeight: 'bold'},
                                  ]}>
                                  Add New {showAddType}
                                </Text>
                              </View>
                              <TextInput
                                placeholder={'Type new Attached To'}
                                value={addAttached}
                                style={styles.meterInput}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                                onChangeText={(text) => {
                                  setAddAttached(text);
                                }}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity onPress={cancelAddNewType}>
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
                                      : showAddType == 'Utility' && addUtility
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
                                          : showAddType != 'Manufacturer' &&
                                            addDevice[0].selectId &&
                                            addDevice[1].selectId &&
                                            addDevice[2].select
                                          ? '#25AAE1ec'
                                          : showAddType == 'Utility' &&
                                            addUtility
                                          ? '#25AAE1ec'
                                          : showAddType == 'Attached To' &&
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
                              flex: 1,
                              // backgroundColor: 'blue',
                              width: width * 0.14,
                              // height: height * 0.11,
                              zIndex: 1,
                              position: 'absolute',
                              // top: width * 0.4,
                              alignItems: 'center',
                              justifyContent: 'center',
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
                    <View style={styles.container}>
                      <TouchableOpacity
                        onPress={requestCameraPermission}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          Launch Camera Directly
                        </Text>
                        <Iconi
                          name="camera"
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      <Text style={[styles.buttonText, {opacity: 0.5}]}>
                        ------------- OR --------------
                      </Text>
                      <TouchableOpacity
                        onPress={imageGalleryLaunch}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                          Launch Image Gallery Directly
                        </Text>
                        <Iconi
                          name="images"
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>

                      {filePath != '' && filePath != null && (
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
                      )}
                    </View>
                  ) : sliderNumber == 6 ? (
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
                          <View style={{flex: 1}}>
                            <View
                              style={{
                                width: width * 0.8,
                              }}>
                              <Text
                                style={[
                                  styles.meterDesciptionHeading,
                                  {marginBottom: 0},
                                ]}>
                                Reason*
                              </Text>
                              <SearchableDropdown
                                onItemSelect={(item) => {
                                  setReasonText(item.name);
                                  setReasonId(item.options_reason_id);
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
                                        maxHeight: width * 0.15,
                                        position: 'absolute',
                                        width: width * 0.8,
                                        top: width * 0.15,
                                        zIndex: 11,
                                        backgroundColor: 'white',
                                        elevation: width * 0.01,
                                      }
                                    : {maxHeight: width * 0.15}
                                }
                                items={reasons}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Select Reasons',
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    margin: 0,
                                    borderRadius: width * 0.015,
                                    height: width * 0.13,
                                    backgroundColor: '#F6F6F6',
                                    borderWidth: width * 0.0019,
                                  },
                                  onTextChange: (text) => {
                                    setReasonText(text);
                                  },
                                  value: reasonText,
                                }}
                                listProps={{
                                  nestedScrollEnabled: true,
                                }}
                              />
                              <Text
                                style={[
                                  styles.meterDesciptionHeading,
                                  {marginBottom: 0},
                                ]}>
                                Reason Description*
                              </Text>
                              <TextInput
                                placeholder="Describe Your Reason"
                                value={reasonDes}
                                style={styles.meterInput}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                    zIndex: 10,
                                  },
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
                                  style={[styles.button, {width: width * 0.1}]}>
                                  <Iconi
                                    name="camera"
                                    size={width * 0.05}
                                    color="#3E4A4F"
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => imageGalleryLaunch('reason')}
                                  style={[styles.button, {width: width * 0.1}]}>
                                  <Iconi
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
                                      style={{flexDirection: 'row', flex: 1}}>
                                      {reasonPath?.map(({uri, index}) => (
                                        <View style={styles.imageContainer}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              removeImage(uri, 'reason')
                                            }
                                            style={styles.imageRemovebtn}>
                                            <Iconi
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
                                  <Text style={{textAlign: 'center'}}>
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
                              <Iconi
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
                                {backgroundColor: 'green'},
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
                                {backgroundColor: '#f00'},
                              ]}>
                              <Text style={styles.attemptText}>
                                Attempted and incomplete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        height: width * 0.8,
                        justifyContent: 'flex-start',
                      }}>
                      {/* sliderNumber == 1 */}
                      {loadManufacturers ? (
                        <ActivityIndicator
                          size="large"
                          color="#25AAE1ec"
                          style={{alignSelf: 'center', flex: 1}}
                        />
                      ) : (
                        <View>
                          {!showAddType ? (
                            <View>
                              {slide1?.map((item, index) => (
                                <View
                                  style={{width: width * 0.8}}
                                  key={item.id}>
                                  <Text style={styles.meterDesciptionHeading}>
                                    {item.name}*
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'flex-start',
                                    }}>
                                    <SearchableDropdown
                                      onItemSelect={(item) => {
                                        getDevice(item, index);
                                      }}
                                      containerStyle={{
                                        paddingBottom: width * 0.02,
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
                                          index == 1
                                            ? slide1[0].selectId
                                              ? item.name
                                              : 'First Select Manufacture'
                                            : item.name,
                                        underlineColorAndroid: 'transparent',
                                        style: {
                                          padding: width * 0.027,
                                          margin: 0,
                                          borderTopLeftRadius: width * 0.015,
                                          borderBottomLeftRadius: width * 0.015,
                                          borderColor: item.error
                                            ? '#A3001B'
                                            : 'black',
                                          height: width * 0.13,
                                          backgroundColor: '#F6F6F6',
                                          borderTopWidth: width * 0.0019,
                                          borderLeftWidth: width * 0.0019,
                                          borderBottomWidth: width * 0.0019,
                                        },
                                        onTextChange: (text) => {
                                          onChangeManufacturer(text, index);
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
                                    <TouchableOpacity
                                      style={{
                                        width: width * 0.1,
                                        backgroundColor: '#25AAE199',
                                        borderTopRightRadius: width * 0.015,
                                        borderBottomRightRadius: width * 0.015,
                                        borderTopWidth: width * 0.0019,
                                        borderRightWidth: width * 0.0019,
                                        borderBottomWidth: width * 0.0019,
                                        height: width * 0.13,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                      onPress={() => showAddNewType(item.name)}>
                                      <Icon
                                        size={width * 0.06}
                                        color="#fff"
                                        name={'add'}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))}
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
                                          {fontWeight: 'bold'},
                                        ]}>
                                        New {showAddType}
                                      </Text>
                                    </View>
                                    <TextInput
                                      placeholder={'Type new manufacturer'}
                                      value={addManufacturer}
                                      style={styles.meterInput}
                                      mode={'outlined'}
                                      theme={{
                                        colors: {
                                          text: '#25AAE1ec',
                                          primary: '#25AAE1ec',
                                          selectionColor: 'red',
                                        },
                                      }}
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
                                                    'Attached To' && addAttached
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
                                          {index < 2 ? (
                                            <SearchableDropdown
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
                                                  : {
                                                      height: width * 0.2,
                                                      zIndex: 1,
                                                    }
                                              }
                                              items={item.data}
                                              resetValue={false}
                                              textInputProps={{
                                                placeholder: item.name,
                                                underlineColorAndroid:
                                                  'transparent',
                                                style: {
                                                  padding: width * 0.027,
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
                                              <TextInput
                                                placeholder={
                                                  'Type New Device Name'
                                                }
                                                value={item.select}
                                                style={styles.meterInput}
                                                mode={'outlined'}
                                                theme={{
                                                  colors: {
                                                    text: '#25AAE1ec',
                                                    primary: '#25AAE1ec',
                                                    selectionColor: 'red',
                                                    zIndex: 10,
                                                  },
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
                                                <TextInput
                                                  placeholder="Type Model Number"
                                                  value={addModelNo}
                                                  // showSoftInputOnFocus={false}
                                                  style={styles.meterInput}
                                                  onSubmitEditing={
                                                    Keyboard.dismiss
                                                  }
                                                  mode={'outlined'}
                                                  theme={{
                                                    colors: {
                                                      text: '#25AAE1ec',
                                                      primary: '#25AAE1ec',
                                                      selectionColor: 'red',
                                                    },
                                                  }}
                                                  onFocus={() => {
                                                    console.log(
                                                      'Focusing Model number',
                                                    );
                                                    setVerticalOffs(-60);
                                                  }}
                                                  onBlur={() => {
                                                    console.log(
                                                      'Blurring Model number',
                                                    );
                                                    setVerticalOffs(-180);
                                                  }}
                                                  onChangeText={(text) => {
                                                    setAddModelNo(text);
                                                  }}
                                                />
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
                                                <TextInput
                                                  placeholder="Type Product Description"
                                                  value={addProductNo}
                                                  // showSoftInputOnFocus={false}
                                                  style={styles.meterInput}
                                                  mode={'outlined'}
                                                  onSubmitEditing={
                                                    Keyboard.dismiss
                                                  }
                                                  theme={{
                                                    colors: {
                                                      text: '#25AAE1ec',
                                                      primary: '#25AAE1ec',
                                                      selectionColor: 'red',
                                                    },
                                                  }}
                                                  onChangeText={(text) => {
                                                    setAddProductNo(text);
                                                  }}
                                                  onFocus={() => {
                                                    console.log(
                                                      'Focusing Product Desc',
                                                    );
                                                    setVerticalOffs(-60);
                                                  }}
                                                  onBlur={() => {
                                                    console.log(
                                                      'Blurring Product Desc',
                                                    );
                                                    setVerticalOffs(-180);
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
                                                    'Attached To' && addAttached
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
                              </View>
                            </>
                          )}
                          {showAddType !== 'Device' && (
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
                                    xxModel Number*
                                  </Text>
                                </View>
                                {slide1?.map((item, index) =>
                                  index === 1 ? (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                      }}>
                                      <SearchableDropdown
                                        onItemSelect={(item) => {
                                          getDevice(item, index);
                                        }}
                                        containerStyle={{
                                          paddingBottom: width * 0.02,
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
                                          maxHeight: height * 0.08,
                                        }}
                                        items={item.data}
                                        resetValue={false}
                                        textInputProps={{
                                          editable:
                                            index > 0
                                              ? slide1[1].selectId &&
                                                !defaultDeviceValues
                                                ? true
                                                : false
                                              : defaultDeviceValues
                                              ? false
                                              : true,

                                          placeholder:
                                            index == 1
                                              ? slide1[1].selectId
                                                ? item.name
                                                : 'First Select Device'
                                              : item.name,
                                          underlineColorAndroid: 'transparent',
                                          style: {
                                            padding: width * 0.027,
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
                                          },
                                          onTextChange: (text) => {
                                            onChangeManufacturer(text, index);
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
                                      <TouchableOpacity
                                        style={{
                                          width: width * 0.1,
                                          backgroundColor: '#25AAE199',
                                          borderTopRightRadius: width * 0.015,
                                          borderBottomRightRadius:
                                            width * 0.015,
                                          borderTopWidth: width * 0.0019,
                                          borderRightWidth: width * 0.0019,
                                          borderBottomWidth: width * 0.0019,
                                          height: width * 0.13,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                        onPress={() =>
                                          showAddNewType(item.name)
                                        }>
                                        <Icon
                                          size={width * 0.06}
                                          color="#fff"
                                          name={'add'}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  ) : null,
                                )}
                                {/* <TextInput
                                  placeholder="Model Number"
                                  value={modelNo}
                                  dense={true}
                                  editable={false}
                                  showSoftInputOnFocus={false}
                                  style={[styles.input, {width: width * 0.38}]}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                    },
                                  }}
                                /> */}
                              </View>
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
                                <TextInput
                                  placeholder="Type Product Description"
                                  value={
                                    productNo?.length > 24
                                      ? productNo.slice(0, 24) + '...'
                                      : productNo
                                  }
                                  selection
                                  dense={true}
                                  editable={false}
                                  showSoftInputOnFocus={false}
                                  style={[styles.input, {width: '100%'}]}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                    },
                                  }}
                                />
                              </View>
                              <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={'#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={(val) =>
                                  getdefaultDeviceData(val)
                                }
                                value={defaultDeviceValues}
                              />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  )}

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
                            style={[styles.buttonText, {width: width * 0.7}]}>
                            {newMeter.name.charAt(0).toUpperCase() +
                              newMeter.name.slice(1).toLowerCase()}{' '}
                            Meter added succesfully please checking installation
                            status...
                          </Text>
                        ) : (
                          <Text
                            style={[styles.buttonText, {width: width * 0.7}]}>
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
                                  slide1[1].selectId
                                    ? '#25AAE1ec'
                                    : sliderNumber == 2 &&
                                      newMeter.id != 0 &&
                                      newMeter.name
                                    ? '#25AAE1ec'
                                    : sliderNumber == 3 &&
                                      slide2[0].value &&
                                      slide2[1].value &&
                                      attachedToId != null
                                    ? '#25AAE1ec'
                                    : sliderNumber == 4 &&
                                      lat != undefined &&
                                      long != undefined
                                    ? '#25AAE1ec'
                                    : sliderNumber == 5 &&
                                      filePath != '' &&
                                      filePath != null
                                    ? '#25AAE1ec'
                                    : (sliderNumber == 6 &&
                                        installationStatus == 1) ||
                                      (sliderNumber == 6 &&
                                        installationStatus == 2 &&
                                        reasonId &&
                                        reasonDes)
                                    ? '#25AAE1ec'
                                    : '#D0D0D0',
                              },
                            ]}
                            onPress={
                              sliderNumber == 6 ? finishSlider : changeSlider
                            }
                            disabled={
                              sliderNumber == 1 &&
                              slide1[0].selectId &&
                              slide1[1].selectId
                                ? false
                                : sliderNumber == 2 &&
                                  newMeter.id != 0 &&
                                  newMeter.name
                                ? false
                                : sliderNumber == 3 &&
                                  slide2[0].value &&
                                  slide2[1].value &&
                                  attachedToId != null
                                ? false
                                : sliderNumber == 4 &&
                                  lat != undefined &&
                                  long != undefined
                                ? false
                                : sliderNumber == 5 &&
                                  filePath != '' &&
                                  filePath != null
                                ? false
                                : (sliderNumber == 6 &&
                                    installationStatus == 1) ||
                                  (sliderNumber == 6 &&
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
                                sliderNumber == 6 ? 'check' : 'navigate-next'
                              }
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      // </View>
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
                        {fontSize: width * 0.06},
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
                  <Text>Use Default Values</Text>
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
                    <Pressable
                      style={{marginLeft: 5}}
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
                        color: '#5e5e5e',
                        borderless: true,
                        // radius: width * 0.03,
                      }}>
                      <Text
                        style={[
                          styles.modalHeading,
                          {color: '#5e5e5e', fontSize: width * 0.04},
                        ]}>
                        Cancel
                      </Text>
                    </Pressable>
                    <Text style={styles.modalHeading}>{modalName}</Text>
                    <Pressable
                      style={{marginRight: 5}}
                      onPress={handleAddNewUnit}
                      android_ripple={{
                        color: '#25AAE1',
                        borderless: true,
                        // radius: width * 0.03,
                      }}>
                      <Text
                        style={[
                          styles.modalHeading,
                          {color: '#25AAE1', fontSize: width * 0.04},
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
                      <Build
                        name={'office-building'}
                        size={height * 0.02}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>BUILDING*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      {/* //todo: This is Drop down picker */}
                      <TextInput
                        placeholder="Building Name"
                        value={buildingName}
                        dense={true}
                        editable={false}
                        showSoftInputOnFocus={false}
                        style={styles.input}
                        mode={'outlined'}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                          },
                        }}
                      />
                    </View>
                    <View style={styles.desciptionContainer}>
                      <Text style={styles.desciptionHeading}>UNIT*</Text>
                    </View>
                    <View style={[styles.inputContainer]}>
                      <TextInput
                        placeholder="Unit Name"
                        value={state.lastUnitData}
                        dense={true}
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
                        mode={'outlined'}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                          },
                        }}
                      />
                    </View>
                    <View style={{width: '80%'}}>
                      {error.errorUnits ? (
                        <HelperText type="error" visible={error.errorUnits}>
                          {error.errorUnits}
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
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          padding: 5,
                        },
                      ]}>
                      {loadMeters ? (
                        <ActivityIndicator color={'#25AAE1ec'} size={'large'} />
                      ) : (
                        meterListData.length > 0 &&
                        meterListData?.map(
                          (item, index) => (
                            console.log('meterListData+++>>>>>', index),
                            (
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
                                    // setShowAddMeterSlider(true),
                                    // setDefaultScreen(true),
                                    getMeterData(item, index);
                                  enableLocation();
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: width * 0.02,
                                  margin: width * 0.01,
                                  elevation: 2,
                                  backgroundColor: 'white',
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
                                    {marginBottom: 0},
                                  ]}>
                                  {item.meter_name}
                                </Text>
                              </TouchableOpacity>
                            )
                          ),
                        )
                      )}
                    </View>
                    <View
                      style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      {type == 'addMeterDirect' || type == 'meterDirect' ? (
                        meterData.length == 1 ? (
                          <View style={{marginLeft: width * 0.02}}>
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
                                  property: LayoutAnimation.Properties.opacity,
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
                            }}>
                            {/*//todo: Button for meter */}
                            <Text
                              style={{
                                fontSize: height * 0.04,
                                color: '#25AAE1ec',
                              }}>
                              Add Meter
                            </Text>
                            <IconX
                              name="plus-circle"
                              type="feather"
                              size={width * 0.1}
                              color={'#25AAE1ec'}
                            />
                          </TouchableOpacity>
                        )
                      ) : !meterListLoader ? (
                        state.meterList.length ? (
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
                            }}>
                            {/*//todo: Button for meter */}
                            <Text
                              style={{
                                fontSize: height * 0.04,
                                color: '#25AAE1ec',
                              }}>
                              Add Meter
                            </Text>
                            <IconX
                              name="plus-circle"
                              type="feather"
                              size={width * 0.1}
                              color={'#25AAE1ec'}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={{marginLeft: width * 0.02}}>
                            <Text
                              style={{
                                fontSize: height * 0.04,
                                color: '#25AAE1ec',
                              }}>
                              No Meters
                            </Text>
                          </View>
                        )
                      ) : (
                        <View style={{marginBottom: width * 0.05}}>
                          <DotsLoader color="#25AAE1ec" />
                        </View>
                      )}
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
                            <Plus name="close" color="black" size={18} />
                            <Text style={{color: 'black'}}>Cancel</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddNewUnit}>
                          <View style={styles.submitBotton}>
                            <Plus
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
          </KeyboardAvoidingView>
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
                <Back
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
  boxInner: {
    backgroundColor: '#fff',
    alignItems: 'center',
    // borderRadius: width * 0.03,
    width: width,
    height: height,
  },
  boxHeader: {
    // backgroundColor: 'tomato',
    marginTop: 8,
    width: '100%',
    height: width * 0.18,
  },
  boxHeaderInner: {
    flex: 1,
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
    fontSize: width * 0.03,
    color: '#3E4A4F',
    textTransform: 'capitalize',
    fontFamily: Fonts.ComfortaaRegular,
    marginBottom: width * 0.01,
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
});
