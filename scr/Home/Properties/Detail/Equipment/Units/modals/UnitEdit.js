import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Modal from 'react-native-modal';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import SystemSetting from 'react-native-system-setting';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, FAB, HelperText, Divider } from 'react-native-paper';
import { DotsLoader, OpacityDotsLoader } from 'react-native-indicator';
import { Menu as MenuT, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Fonts } from '../../../../../../utils/fonts';
import Drop from 'react-native-vector-icons/Ionicons';
import Scanner from 'react-native-vector-icons/Ionicons';
import Delete from 'react-native-vector-icons/MaterialIcons';
import { create } from 'apisauce';
import Base_URL from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import Back from 'react-native-vector-icons/MaterialIcons';
import AppIntroSlider from 'react-native-app-intro-slider';
import SearchableDropdown from 'react-native-searchable-dropdown';
import useUpdateEffect from '../../../../../../hooks/useUpdateEffect';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Iconi from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import { withOrientation } from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const api = create({ baseURL: Base_URL });
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function UnitEdit({
  modalVisible,
  closeModal,
  unitsArray,
  buildingName,
  unitDetails,
  meterTypes,
  buildingId,
  reRun,
  type,
  modalName,
  flag,
  enableFlag,
  disableFlag,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [filePath, setFilePath] = useState({});
  const [imageBase64, setImageBase64] = useState('');
  const [meterData, setMeterData] = useState([]);
  const [selectLocation, setSelectLocation] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [checkSerial, setCheckSerial] = useState(false);
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
      value: '',
    },
    {
      id: 1,
      error: '',
      name: 'Initial Meter Reading',
      value: '',
    },
    {
      id: 2,
      error: '',
      name: 'Meter Serial Number',
      value: '',
    },
  ]);
  const [addManufacturer, setAddManufacturer] = useState('');
  const [showAddType, setShowAddType] = useState(false);
  const [meterListLoader, setMeterListLoader] = useState(true);
  const [sliderNumber, setSliderNumber] = useState(1);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [doneAnimation, setDoneAnimation] = useState(false);
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

  const enableLocation = async () => {
    if (Platform.OS == 'ios') {
      request(
        PERMISSIONS.IOS.LOCATION_ALWAYS || PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      )
        .then((result) => {
          console.log('kia hai result camera ka', result);
          if (result == RESULTS.GRANTED) {
            checkLocation(true);
          } else {
            // console.log('Denied',)
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
          console.log('Access');
          // alert("You've access for the Location");
        } else {
          checkLocation(false);

          console.log('Denied');
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  const checkLocation = async (locationAccess) => {
    const location = await SystemSetting.isLocationEnabled();

    if (locationAccess) {
      !location
        ? Alert.alert(
          'Enable Loaction',
          'Kindly TurnOn Location to Add Meter',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () =>
                SystemSetting.switchLocation(() => {
                  console.log('switch location successfully');
                }),
            },
          ],
        )
        : LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
            onPress: async () => await SystemSetting.openAppSystemSettings(),
          },
        ],
      );
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          console.log('kia hai result camera ka', result);
          if (result == RESULTS.GRANTED) {
            cameraLaunch();
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
          cameraLaunch();
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

    const antiIntersection = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
    );
    console.log('antiIntersection--->', antiIntersection);
    setState((oldState) => ({
      ...oldState,
      meterList: antiIntersection.sort((a, b) => (a.name > b.name ? 1 : -1)),
    }));
    setMeterListLoader(false);
  };

  useUpdateEffect(() => {
    if (flag) {
      getToken();
    }
    callApi();
  }, [modalVisible]);

  // useEffect(() => {
  //   _renderMap();
  // }, []);
  useEffect(() => {
    console.log('meterData--->', meterData.length);
  }, [meterData]);
  useEffect(() => {
    if (flag) {
      console.log('un in mod-->>', unitDetails);
      setState((oldState) => ({
        ...oldState,
        lastUnitData: unitDetails?.unit?.name,
      }));
    }
    callApi();
  }, [meterTypes, unitDetails]);

  useEffect(() => {
    console.log('sliderProgress-->>', sliderProgress);
    if (sliderNumber == 5) {
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
    // const data = {
    //   id: value.id,
    //   deviceSerialNum:
    //     type == 'meterDirect' || type == 'addMeterDirect'
    //       ? unitDetails?.unit?.meterSerial
    //       : '',
    //   deviceSerialError: '',
    //   meterType: '',
    //   meterTypeName: '',
    //   meterTypeError: '',
    //   meterAttachedTo: '',
    //   manufacturersId: '',
    //   initialMeterReadingError: '',
    //   initialMeterReading: '',
    //   manufacturersName: '',
    //   manufacturersError: '',
    //   deviceId: '',
    //   deviceName: '',
    //   deviceError: '',
    //   meterAttachedError: '',
    //   meterSerialNum: '',
    //   customMeterId: '',
    //   name: value.name,
    //   icon: value.icon,
    //   meterTypeMenu: false,
    // };
    // const newArray = [...meterListData];
    // newArray.push(data);
    // setMeterListData(newArray);

    // const newList = state.meterList.filter((item) => item.id !== value.id);
    // setState((oldState) => ({
    //   ...oldState,
    //   meterList: newList,
    // }));
  };

  // const deleteMeterInNewArray = (value) => {
  //   disableFlag();
  //   const newList = meterListData.filter((item) => item.id !== value.id);
  //   setMeterListData(newList);
  //   const data = {
  //     id: value.id,
  //     name: value.name,
  //     icon: value.icon,
  //   };
  //   const newArray = [...state.meterList];
  //   newArray.push(data);
  //   setState((oldState) => ({
  //     ...oldState,
  //     meterList: newArray.sort((a, b) => (a.name > b.name ? 1 : -1)),
  //   }));
  // };
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
    // newArr[index].deviceSerialError = ''; // replace e.target.value with whatever you want to change it to
    setSlide2(newArr);
  };
  // const onChangeInitialReading = (e, index) => {
  //   let newArr = [...meterListData]; // copying the old datas array
  //   newArr[index].initialMeterReading = e; // replace e.target.value with whatever you want to change it to
  //   newArr[index].initialMeterReadingError = ''; // replace e.target.value with whatever you want to change it to
  //   setMeterListData(newArr);
  // };
  // const onChangeMeterSerial = (e, index) => {
  //   let newArr = [...meterListData]; // copying the old datas array
  //   newArr[index].meterSerialNum = e; // replace e.target.value with whatever you want to change it to
  //   setMeterListData(newArr);
  // };
  const onChangeManufacturer = (e, index) => {
    // let newArr = [...meterListData]; // copying the old datas array
    // newArr[index].manufacturersName = e; // replace e.target.value with whatever you want to change it to
    // newArr[index].manufacturersError = ''; // replace e.target.value with whatever you want to change it to
    // newArr[index].deviceName = ''; // replace e.target.value with whatever you want to change it to
    // newArr[index].meterType = '';
    // setMeterListData(newArr);

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
  // const onChangeDevice = (e, index) => {
  //   let newArr = [...meterListData]; // copying the old datas array
  //   newArr[index].deviceName = e; // replace e.target.value with whatever you want to change it to
  //   newArr[index].deviceError = ''; // replace e.target.value with whatever you want to change it to
  //   setMeterListData(newArr);
  // };

  const changeUtilityAndToggle = () => {
    // setNewMeter((oldState) => ({
    //   ...oldState,
    //   id: 0,
    //   name: '',
    // }));
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
  };

  const getDevice = async (some, index) => {
    console.log('get devices--->');
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
    }
    setSlide1(listSlide);
  };

  // const getDeviceData = (some, index) => {
  //   let newArr = [...meterListData]; // copying the old datas array
  //   newArr[index].deviceName = some?.name; // replace e.target.value with whatever you want to change it to
  //   newArr[index].deviceError = ''; // replace e.target.value with whatever you want to change it to
  //   newArr[index].meterType = some?.id; // replace e.target.value with whatever you want to change it to
  //   setMeterListData(newArr);
  // };

  const handleAddNewUnit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let matchUnit;
    if (type == 'add') {
      matchUnit = unitsArray?.filter((e) => e.name == state.lastUnitData);
    }
    // const checkSerial = meterListData.filter(
    //   (item) => item.deviceSerialNum === '',
    // );
    // const checkInitial = meterListData.filter(
    //   (item) => item.initialMeterReading === '',
    // );
    // const checkManufacturer = meterListData.filter(
    //   (item) => item.manufacturersId == '',
    // );
    // const checkDevice = meterListData.filter((item) => item.meterType == '');
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
    // if (
    //   type == 'add' ||
    //   type == 'meterDirect' ||
    //   type == 'addMeterDirect' ||
    //   meterListData.length != 0
    // ) {
    //   if (checkSerial.length) {
    //     meterListData.map((data, index) => {
    //       if (data.deviceSerialNum == '') {
    //         let newArr = [...meterListData];
    //         newArr[index].deviceSerialError = 'Device serial required';
    //         setMeterListData(newArr);
    //         return;
    //       } else {
    //         let newArr = [...meterListData];
    //         newArr[index].deviceSerialError = '';
    //         setMeterListData(newArr);
    //       }
    //     });
    //     return;
    //   } else {
    //     meterListData.map((data, index) => {
    //       let newArr = [...meterListData];
    //       newArr[index].deviceSerialError = '';
    //       setMeterListData(newArr);
    //     });
    //   }
    //   if (checkInitial.length) {
    //     meterListData.map((data, index) => {
    //       if (data.initialMeterReading == '') {
    //         let newArr = [...meterListData];
    //         newArr[index].initialMeterReadingError =
    //           'Initial meter reading required';
    //         setMeterListData(newArr);
    //         return;
    //       } else {
    //         let newArr = [...meterListData];
    //         newArr[index].initialMeterReadingError = '';
    //         setMeterListData(newArr);
    //       }
    //     });
    //     return;
    //   } else {
    //     meterListData.map((data, index) => {
    //       let newArr = [...meterListData];
    //       newArr[index].deviceSerialError = '';
    //       setMeterListData(newArr);
    //     });
    //   }
    //   if (checkManufacturer.length) {
    //     meterListData.map((data, index) => {
    //       if (data.meterType == '') {
    //         let newArr = [...meterListData];
    //         newArr[index].manufacturersError = 'Please select a manufacturer';
    //         setMeterListData(newArr);
    //         return;
    //       } else {
    //         let newArr = [...meterListData];
    //         newArr[index].manufacturersError = '';
    //         setMeterListData(newArr);
    //       }
    //     });
    //     return;
    //   } else {
    //     meterListData.map((data, index) => {
    //       let newArr = [...meterListData];
    //       newArr[index].manufacturersError = '';
    //       setMeterListData(newArr);
    //     });
    //   }
    //   if (checkDevice.length) {
    //     meterListData.map((data, index) => {
    //       if (data.meterType == '') {
    //         let newArr = [...meterListData];
    //         newArr[index].deviceError = 'Please select a device';
    //         setMeterListData(newArr);
    //         return;
    //       } else {
    //         let newArr = [...meterListData];
    //         newArr[index].deviceError = '';
    //         setMeterListData(newArr);
    //       }
    //     });
    //     return;
    //   } else {
    //     meterListData.map((data, index) => {
    //       let newArr = [...meterListData];
    //       newArr[index].deviceError = '';
    //       setMeterListData(newArr);
    //     });
    //   }
    // }
    // var loopData = [];
    // meterListData.map((data, index) => {
    //   loopData.push({
    //     meter_id: data.id,
    //     device_serial_number: data.deviceSerialNum,
    //     meter_serial_number: data.meterSerialNum,
    //     device_id: data.meterType,
    //     initial_meter_reading: data.initialMeterReading,
    //   });
    // });
    let data = {
      name: state.lastUnitData,
      building_id: buildingId,
      meters: meterData,
    };
    // console.log('data--->', data);
    if (type == 'add' || type == 'addMeterDirect') {
      const unitResponse = await api.post(
        `/property/equipment/unit/add-unit`,
        data,
      );

      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        reRun(unitResponse?.data?.data);
        console.log('datachecckk-->>', unitResponse?.data?.data);
      } else {
        alert(unitResponse?.data?.message);
      }
    } else {
      try {
        const unitResponse = await api.patch(
          `/property/equipment/unit/update-unit/${unitDetails?.unit?.id}`,
          data,
          console.log('datachecckk-->>', unitResponse?.data?.data),
        );
        if (unitResponse?.data?.bool) {
          changeUtilityAndToggle();
          reRun(unitResponse?.data?.data);
        } else {
          alert(unitResponse?.data?.message);
        }
      } catch (e) {
        console.log('e---->', e);
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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSliderNumber(sliderNumber + 1);
      setSliderProgress(sliderProgress + 0.25);
    } else {
      Alert.alert(
        'Device Serial Already Exists',
        'Please type or scan another Device Serial Number',
      );
    }
  };

  const changeSlider = () => {
    if (sliderNumber == 3) {
      setCheckSerial(true);
      checkingSerial();
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSliderNumber(sliderNumber + 1);
      setSliderProgress(sliderProgress + 0.25);
    }
  };

  const finishSlider = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAddMeterSlider(false);
    var loopData = [...meterData];
    loopData.push({
      meter_id: newMeter.id,
      device_serial_number: slide2[0].value,
      meter_serial_number: slide2[2].value,
      device_id: slide1[1].selectId,
      initial_meter_reading: slide2[1].value,
      latitude: lat,
      longitude: long,
      thumbnail: `data:image/jpeg;base64,${imageBase64}`,
    });
    setMeterData(loopData);
    setSliderNumber(1);
    setSliderProgress(0);
    setFilePath({});
    slide1.map((item, index) => {
      let newArr = [...slide1];
      newArr[index].data = [];
      newArr[index].select = '';
      newArr[index].selectId = '';
    });
    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
    }));
    slide2.map((item, index) => {
      let newArr = [...slide2];
      newArr[index].value = '';
    });
    const addMeter = state.meterList.filter((item) => item.id === newMeter.id);
    let meterArray = [...meterListData]; // copying the old datas array
    meterArray.push(addMeter[0]);
    setMeterListData(meterArray);

    const newList = state.meterList.filter((item) => item.id !== newMeter.id);
    setState((oldState) => ({
      ...oldState,
      meterList: newList,
    }));
  };
  const typeSwitcher = (arg) => {
    switch (arg) {
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
  const renderSlide2 = ({ item }) => {
    return (
      <View
        style={{
          width: width * 0.9,
          alignItems: 'center',
        }} key={item?.id}>
        <TouchableOpacity
          style={{
            height: width * 0.12,
            width: width * 0.8,
            elevation: width * 0.005,
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
  const renderSlide3 = ({ item, index }) => {
    // console.log('index check slider 3 ---> ',index)
    return (
      <View style={{ width: width * 0.8 }} key={item.id}>
        <Text style={[styles.meterDesciptionHeading, { top: width * 0.01 }]}>
          {item.name + (index < 2 ? "*" : '')}
        </Text>
        <TextInput
          placeholder={item.name}
          value={item.value}
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
                    style={{ zIndex: 1 }}>
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
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        setLat(lat);
        setLong(long);
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
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

  const cameraLaunch = () => {
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
        const source = { uri: res.uri };
        console.log('response', res);
        setImageBase64(res.assets[0].base64);
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
        setFilePath(res);
      }
    });
  };

  const moveMarker = (region) => {
    // console.log('Region Ata>>>>>>>>>>>', region);
    setLat(region?.latitude);
    setLong(region?.longitude);
  };

  const imageGalleryLaunch = () => {
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
        const source = { uri: res.uri };
        console.log('response', res.assets[0]);
        setImageBase64(res.assets[0].base64);
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
        setFilePath(res);
      }
    });
  };

  const cancelMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSliderNumber(1);
    setSliderProgress(0);
    setFilePath({});
    slide1.map((item, index) => {
      let newArr = [...slide1];
      newArr[index].data = [];
      newArr[index].select = '';
      newArr[index].selectId = '';
    });
    slide2.map((item, index) => {
      let newArr = [...slide2];
      newArr[index].value = '';
    });
    setNewMeter((oldState) => ({
      ...oldState,
      id: 0,
      name: '',
    }));
    setShowAddMeterSlider(false)
  }
  const showAddNewType = (value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAddNewType(true)
    setShowAddType(value)
  };
  const getNewDeviceData = (value, index) => {
    let listSlide = [...addDevice]; // copying the old datas array
    listSlide[index].select = value?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = value?.id; // replace e.target.value with whatever you want to change it to
    setAddDevice(listSlide);
  }

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
        '/property/equipment/manufacturer/add', data
      );
      if (ManufacturersResponse?.data?.bool) {
        console.log('datachecckk-->>', ManufacturersResponse?.data?.data)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        callApi()
        cancelAddNewType()
      } else {
        alert(ManufacturersResponse?.data?.message);
      }

    } else {
      let data = {
        name: addDevice[2].select,
        manufacturer_id: addDevice[0].selectId,
        device_type_id: addDevice[1].selectId
      };
      const DeviceTypesResponse = await api.post('/property/equipment/device/add', data);
      if (DeviceTypesResponse?.data?.bool) {
        console.log('datachecckk-->>', DeviceTypesResponse?.data?.data)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        callApi()
        cancelAddNewType()
      } else {
        alert(DeviceTypesResponse?.data?.message);
      }
    }
  };
  const cancelAddNewType = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAddNewType(false);
    let deviceData = [...addDevice]; // copying the old datas array
    deviceData[0].select = '';
    deviceData[0].selectId = '';
    deviceData[1].select = '';
    deviceData[1].selectId = '';
    deviceData[2].select = '';
    deviceData[2].selectId = '';
    setAddDevice(deviceData);
    setAddManufacturer('')
  }
  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        statusBarTranslucent
        style={{ top: width * -0.1 }}
        // onBackdropPress={() => setShowAddMeterSlider(false)}
        isVisible={modalVisible}>
        <KeyboardAvoidingView behavior="padding">
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
                      height: height * 0.11,
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
                      initialRegion={{
                        latitude: lat,
                        longitude: long,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                      }}
                      zoomEnabled={true}
                      provider={PROVIDER_GOOGLE}
                      showsUserLocation={true}
                      showsMyLocationButton={true}
                      onRegionChange={(e) => moveMarker(e)}
                    // onPress={(e) => this.getLocation(e)}
                    ></MapView>
                  </View>
                ) : null}
              </View>
            ) : addNewType ? (
              <View style={styles.boxInner}>
                <View
                  style={{
                    height: width * 0.18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: "row",
                    width: width * .85
                  }}>
                  <Text
                    style={[
                      styles.meterDesciptionHeading, { fontSize: width * .06 }
                    ]}>
                    Add {showAddType}
                  </Text>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: width * 0,
                      top: width * .025
                    }}
                    onPress={() =>
                      Alert.alert(
                        "Alert",
                        'Are you sure you want to clear current selected data',
                        [
                          { text: 'No', style: 'cancel' },
                          {
                            text: 'Yes',
                            onPress: cancelAddNewType,
                          }
                        ])
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
                    justifyContent: 'center'
                  }}>
                  {showAddType == "Manufacturer" ?
                    <View>
                      <View>
                        <Text style={[styles.meterDesciptionHeading,]}>
                          New {showAddType}
                        </Text>
                      </View>
                      <TextInput
                        placeholder={"Type new manufacturer"}
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
                        onChangeText={(text) => { setAddManufacturer(text) }}
                      />
                    </View>
                    :
                    <View>
                      {
                        addDevice &&
                        addDevice.map((item, index) =>
                          <View style={{ width: width * 0.8 }} key={item.id}>
                            <View>
                              <Text style={styles.meterDesciptionHeading}>
                                {item.name}
                              </Text>
                            </View>
                            {index < 2 ?
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
                                  margin: width * .005,
                                }}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{
                                  maxHeight: width * 0.15,
                                  position: 'absolute',
                                  width: width * .8,
                                  top: width * .15,
                                  zIndex: 1,
                                  backgroundColor: 'white',
                                  elevation: width * .01,
                                }}
                                items={item.data}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: item.name,
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    margin: 0,
                                    borderRadius: width * 0.015,
                                    height: width * .13,
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
                              :
                              <TextInput
                                placeholder={"Type new Device"}
                                value={item.select}
                                style={styles.meterInput}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                    zIndex: 10
                                  },
                                }}
                                onChangeText={(text) => { onChangeNewDevice(text, index) }}
                              />
                            }
                          </View>
                        )
                      }
                    </View>
                  }
                </View>
                <TouchableOpacity
                  onPress={doneAddType}
                  style={[styles.doneButton, {
                    backgroundColor: showAddType == "Manufacturer" && addManufacturer ? '#25AAE1ec' :
                      showAddType != "Manufacturer" && addDevice[0].selectId && addDevice[1].selectId && addDevice[2].select ? "#25AAE1ec" : "#D0D0D0"
                  }]}
                  disabled={
                    showAddType == "Manufacturer" && addManufacturer ? false :
                      showAddType != "Manufacturer" && addDevice[0].selectId && addDevice[1].selectId && addDevice[2].select ? false : true
                  }
                >
                  <Icon
                    size={width * 0.07}
                    color="#fff"
                    name={'add'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  height: width * 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  borderRadius: width * 0.03,
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
                      flexDirection: 'row',
                      width: width * 0.85,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.meterDesciptionHeading, { fontSize: width * 0.06 },
                      ]}>
                      {sliderNumber == 1
                        ? 'Device Selection'
                        : sliderNumber == 2
                          ? 'Meter Type Selection'
                          : sliderNumber == 3
                            ? 'Device Information'
                            : sliderNumber == 4
                              ? 'Thumbnail & Location'
                              : sliderNumber == 5
                                ? 'Installation Status'
                                : 'Device Selection'}
                    </Text>
                    {sliderNumber < 5 ?
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                        }}
                        onPress={() =>
                          Alert.alert(
                            "Alert",
                            'Are you sure you want to clear current selected data',
                            [
                              { text: 'No', style: 'cancel' },
                              {
                                text: 'Yes',
                                onPress: cancelMeter,
                              }
                            ])}>
                        <Icon
                          name="cancel"
                          size={width * 0.06}
                          color="black"
                          maxOpacity={0.5}
                        />
                      </TouchableOpacity>
                      : null}
                  </View>
                  <Progress.Bar
                    progress={sliderProgress}
                    width={width * 0.8}
                    color={'#25AAE1ec'}
                  />
                </View>
                {sliderNumber == 2 ? (
                  <FlatList
                    contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                    data={state.meterList}
                    renderItem={renderSlide2}
                  />
                ) : sliderNumber == 3 ? (
                  <View
                    style={{
                      height: width * 0.62,
                      width: width * 0.9,
                      alignItems: 'center',
                    }}>
                    <FlatList data={slide2} renderItem={renderSlide3} />
                  </View>
                ) : sliderNumber == 4 ? (
                  <View style={styles.container}>
                    {filePath?.assets &&
                      filePath?.assets.map(({ uri,index }) => (
                        <Image
                          resizeMode="cover"
                          resizeMethod="scale"
                          style={{ width: width * 0.28, height: width * 0.28 }}
                          source={{ uri: uri }}
                          key={index}
                        />
                      ))}
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
                    <Text style={[styles.buttonText, { opacity: .5 }]}>
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
                    <TouchableOpacity
                      onPress={selectMeterLocation}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Change Location</Text>
                      <Iconi
                        name="location"
                        size={width * 0.05}
                        color="#3E4A4F"
                      />
                    </TouchableOpacity>
                  </View>
                ) : sliderNumber == 5 ? (
                  doneAnimation ? (
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={{ width: width * 0.9, height: width * 0.62 }}
                      source={require('../../../../../../../Images/animated-check.gif')}
                    />
                  ) : (
                    <View style={styles.container}>
                      <Text>Check Meter Status</Text>
                    </View>
                  )
                ) : (
                  <View
                    style={{ height: width * 0.62, justifyContent: 'center' }}>
                    {slide1.map((item, index) => (
                      <View style={{ width: width * 0.8 }} key={item.id}>
                        <Text style={styles.meterDesciptionHeading}>
                          {item.name}*
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                          <SearchableDropdown
                            onItemSelect={(item) => {
                              getDevice(item, index);
                            }}
                            containerStyle={{
                              paddingBottom: width * 0.02,
                              width: width * .7,
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
                              placeholder: item.name,
                              underlineColorAndroid: 'transparent',
                              style: {
                                padding: width * 0.027,
                                margin: 0,
                                borderTopLeftRadius: width * 0.015,
                                borderBottomLeftRadius: width * 0.015,
                                borderColor: item.error ? '#A3001B' : 'black',
                                height: width * .13,
                                backgroundColor: '#F6F6F6',
                                borderTopWidth: width * 0.0019,
                                borderLeftWidth: width * 0.0019,
                                borderBottomWidth: width * 0.0019,
                              },
                              onTextChange: (text) => {
                                onChangeManufacturer(text, index);
                              },
                              value: setTimeout(() => item.select, 200),
                              defaultValue: item.select,
                            }}
                            listProps={{
                              nestedScrollEnabled: true,
                            }}
                          />
                          <TouchableOpacity style={{
                            width: width * .1,
                            backgroundColor: "#25AAE199",
                            borderTopRightRadius: width * 0.015,
                            borderBottomRightRadius: width * 0.015,
                            borderTopWidth: width * 0.0019,
                            borderRightWidth: width * 0.0019,
                            borderBottomWidth: width * 0.0019,
                            height: width * .13,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                            onPress={() => showAddNewType(item.name)}
                          >
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
                )}
                <View
                  style={{
                    height: width * 0.2,
                    width: width * 0.85,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {doneAnimation || checkSerial ? (
                    (doneAnimation ?
                      <Text style={[styles.buttonText, { width: width * 0.7 }]}>
                        {newMeter.name.charAt(0).toUpperCase() +
                          newMeter.name.slice(1).toLowerCase()}{' '}
                        Meter added succesfully please checking installation
                        status...
                      </Text>
                      : (
                        <Text style={[styles.buttonText, { width: width * 0.7 }]}>
                          Please wait while checking Device Serial Number...
                        </Text>
                      ))
                  ) : (
                    <TouchableOpacity
                      style={[styles.doneButton, {
                        right: 0,
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
                                slide2[1].value
                                ? '#25AAE1ec'
                                : sliderNumber == 4 &&
                                  filePath?.assets != undefined &&
                                  lat != undefined &&
                                  long != undefined
                                  ? '#25AAE1ec'
                                  : sliderNumber == 5 && filePath?.assets != undefined
                                    ? '#25AAE1ec'
                                    : '#D0D0D0',
                      }]}
                      onPress={sliderNumber == 5 ? finishSlider : changeSlider}
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
                              slide2[1].value
                              ? false
                              : sliderNumber == 4 &&
                                filePath?.assets != undefined &&
                                lat != undefined &&
                                long != undefined
                                ? false
                                : sliderNumber == 5 && filePath?.assets != undefined
                                  ? false
                                  : true
                      }>
                      <Icon
                        size={width * 0.07}
                        color="#fff"
                        name={sliderNumber == 5 ? 'check' : 'navigate-next'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          ) : (
            <View style={styles.boxInner}>
              {/* Box Header */}
              <View style={styles.boxHeader}>
                <View style={styles.boxHeaderInner}>
                  <Icon
                    name={'business'}
                    size={height * 0.05}
                    color="#5e5e5e"
                  />
                  <Text style={styles.modalHeading}>{modalName}</Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Alert",
                        'Are you sure you want to clear current selected data',
                        [
                          { text: 'No', style: 'cancel' },
                          {
                            text: 'Yes',
                            onPress: changeUtilityAndToggle,
                          }
                        ])}
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
                  </Pressable>
                </View>
              </View>
              {/* Box Body */}
              <View style={{ height: width * 0.62, justifyContent: 'center' }}>
                {/* <View style={{ flex: 1 }}> */}
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
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
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
                {error.errorUnits ? (
                  <HelperText type="error" visible={error.errorUnits}>
                    {error.errorUnits}
                  </HelperText>
                ) : null}
                {/* </View> */}
                <View
                  style={[
                    styles.inputContainer,
                    {
                      flexDirection: 'row',
                      height: width * 0.15,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    },
                  ]}>
                  {meterListData &&
                    meterListData.map((item) => (
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          source={typeSwitcher(item.name)}
                          style={styles.untiDetailImage}
                        />
                        <Text
                          style={[
                            styles.meterDesciptionHeading
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
              {/* Box Footer */}
              <View style={styles.footerBtn}>
                <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {type == 'addMeterDirect' || type == 'meterDirect' ? (
                    meterData.length == 1 ? (
                      <View style={{ marginLeft: width * 0.02 }}>
                        <Text
                          style={{
                            fontSize: height * 0.018,
                            color: '#25AAE1ec',
                          }}>
                          No Meters
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={
                          (() =>
                            LayoutAnimation.configureNext(
                              LayoutAnimation.Presets.easeInEaseOut,
                            ),
                            setShowAddMeterSlider(true))
                        }
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          zIndex: 1,
                        }}>
                        {/*//todo: Button for meter */}
                        <Plus name="plus" size={25} color="#25AAE1ec" />
                        <Text
                          style={{
                            fontSize: height * 0.018,
                            color: '#25AAE1ec',
                          }}>
                          Meter
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : !meterListLoader ? (
                    state.meterList.length ? (
                      <TouchableOpacity
                        onPress={() => {
                          enableLocation();
                          callApi();
                        }}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          zIndex: 1,
                        }}>
                        {/*//todo: Button for meter */}
                        <Plus name="plus" size={25} color="#25AAE1ec" />
                        <Text
                          style={{
                            fontSize: height * 0.018,
                            color: '#25AAE1ec',
                          }}>
                          Meter
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ marginLeft: width * 0.02 }}>
                        <Text
                          style={{
                            fontSize: height * 0.018,
                            color: '#25AAE1ec',
                          }}>
                          No Meters
                        </Text>
                      </View>
                    )
                  ) : (
                    <View style={{ marginLeft: width * 0.02 }}>
                      <DotsLoader color="#25AAE1ec" />
                    </View>
                  )}
                </View>
                <View style={styles.addUnitBtnContainer}>
                  <TouchableOpacity onPress={() =>
                    Alert.alert(
                      "Alert",
                      'Are you sure you want to clear current selected data',
                      [
                        { text: 'No', style: 'cancel' },
                        {
                          text: 'Yes',
                          onPress: changeUtilityAndToggle,
                        }
                      ])}>
                    <View style={styles.cancelBotton}>
                      <Plus name="close" color="black" size={18} />
                      <Text style={{ color: 'black' }}>Cancel</Text>
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
                      <Text style={{ color: 'white' }}>
                        {type == 'meterDirect' ||
                          type == 'addMeterDirect' ||
                          type == 'add'
                          ? 'Add Unit'
                          : 'Edit Unit'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
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
    </View >
  );
}

const styles = StyleSheet.create({
  boxInner: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: width * 0.03,
    height: width * 1,
  },
  boxHeader: {
    width: width * 0.8,
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
    right: width * 0.02,
  },
  desciptionContainer: {
    height: width * 0.05,
    width: width * 0.7,
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
    marginBottom: width * .01,
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
    width: width * 0.8,
    height: width * 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    borderTopWidth: width * 0.001,
    backgroundColor: 'white',
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
    height: width * 0.62,
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
    bottom: width * .04,
    right: width * .03,
  }
});
