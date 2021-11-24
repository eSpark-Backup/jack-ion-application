import React, {useState, useEffect} from 'react';
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
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, FAB, HelperText, Divider} from 'react-native-paper';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Fonts} from '../../../../../../utils/fonts';
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
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Iconi from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import {withOrientation} from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';

const {width, height} = Dimensions.get('window');
const api = create({baseURL: Base_URL});
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
  const [selectLocation, setSelectLocation] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({});
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
      name: 'Note',
      value: '',
    },
  ]);
  const [meterMenuVisible, setMeterMenuVisible] = useState(false);
  const [sliderNumber, setSliderNumber] = useState(1);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [doneAnimation, setDoneAnimation] = useState(false);
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

  const getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const res = await api.get('/property/equipment/meter/all-meters');

    let arr1 = res.data?.data;
    let arr2 = meterTypes;
    console.log('arr1--->', arr1);
    console.log('arr2--->', arr2);

    const antiIntersection = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
    );
    console.log('antiIntersection--->', antiIntersection);
    setState((oldState) => ({
      ...oldState,
      meterList: antiIntersection.sort((a, b) => (a.name > b.name ? 1 : -1)),
    }));
  };

  useUpdateEffect(() => {
    if (flag) {
      getToken();
    }
    callApi();
  }, [modalVisible]);

  useEffect(() => {
    _renderMap();
  }, []);

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

  const deleteMeterInNewArray = (value) => {
    disableFlag();
    const newList = meterListData.filter((item) => item.id !== value.id);
    setMeterListData(newList);
    const data = {
      id: value.id,
      name: value.name,
      icon: value.icon,
    };
    const newArray = [...state.meterList];
    newArray.push(data);
    setState((oldState) => ({
      ...oldState,
      meterList: newArray.sort((a, b) => (a.name > b.name ? 1 : -1)),
    }));
  };
  //!----------->

  const showMoreInputs = (value, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].showOtherInputs = !value.showOtherInputs; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

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
  const onChangeInitialReading = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].initialMeterReading = e; // replace e.target.value with whatever you want to change it to
    newArr[index].initialMeterReadingError = ''; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const onChangeMeterSerial = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].meterSerialNum = e; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
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
  const onChangeDevice = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].deviceName = e; // replace e.target.value with whatever you want to change it to
    newArr[index].deviceError = ''; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };

  const changeUtilityAndToggle = () => {
    enableFlag();
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
  const getDeviceData = (some, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].deviceName = some?.name; // replace e.target.value with whatever you want to change it to
    newArr[index].deviceError = ''; // replace e.target.value with whatever you want to change it to
    newArr[index].meterType = some?.id; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };

  const handleAddNewUnit = async () => {
    let matchUnit;
    if (type == 'add') {
      matchUnit = unitsArray?.filter((e) => e.name == state.lastUnitData);
    }
    const checkSerial = meterListData.filter(
      (item) => item.deviceSerialNum === '',
    );
    const checkInitial = meterListData.filter(
      (item) => item.initialMeterReading === '',
    );
    const checkManufacturer = meterListData.filter(
      (item) => item.manufacturersId == '',
    );
    const checkDevice = meterListData.filter((item) => item.meterType == '');

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
      meterListData.length == 0 &&
      (type == 'addMeterDirect' || type == 'meterDirect' || type == 'add')
    ) {
      alert('Select meter and continue');
      return;
    }
    if (
      type == 'add' ||
      type == 'meterDirect' ||
      type == 'addMeterDirect' ||
      meterListData.length != 0
    ) {
      if (checkSerial.length) {
        meterListData.map((data, index) => {
          if (data.deviceSerialNum == '') {
            let newArr = [...meterListData];
            newArr[index].deviceSerialError = 'Device serial required';
            setMeterListData(newArr);
            return;
          } else {
            let newArr = [...meterListData];
            newArr[index].deviceSerialError = '';
            setMeterListData(newArr);
          }
        });
        return;
      } else {
        meterListData.map((data, index) => {
          let newArr = [...meterListData];
          newArr[index].deviceSerialError = '';
          setMeterListData(newArr);
        });
      }
      if (checkInitial.length) {
        meterListData.map((data, index) => {
          if (data.initialMeterReading == '') {
            let newArr = [...meterListData];
            newArr[index].initialMeterReadingError =
              'Initial meter reading required';
            setMeterListData(newArr);
            return;
          } else {
            let newArr = [...meterListData];
            newArr[index].initialMeterReadingError = '';
            setMeterListData(newArr);
          }
        });
        return;
      } else {
        meterListData.map((data, index) => {
          let newArr = [...meterListData];
          newArr[index].deviceSerialError = '';
          setMeterListData(newArr);
        });
      }
      if (checkManufacturer.length) {
        meterListData.map((data, index) => {
          if (data.meterType == '') {
            let newArr = [...meterListData];
            newArr[index].manufacturersError = 'Please select a manufacturer';
            setMeterListData(newArr);
            return;
          } else {
            let newArr = [...meterListData];
            newArr[index].manufacturersError = '';
            setMeterListData(newArr);
          }
        });
        return;
      } else {
        meterListData.map((data, index) => {
          let newArr = [...meterListData];
          newArr[index].manufacturersError = '';
          setMeterListData(newArr);
        });
      }
      if (checkDevice.length) {
        meterListData.map((data, index) => {
          if (data.meterType == '') {
            let newArr = [...meterListData];
            newArr[index].deviceError = 'Please select a device';
            setMeterListData(newArr);
            return;
          } else {
            let newArr = [...meterListData];
            newArr[index].deviceError = '';
            setMeterListData(newArr);
          }
        });
        return;
      } else {
        meterListData.map((data, index) => {
          let newArr = [...meterListData];
          newArr[index].deviceError = '';
          setMeterListData(newArr);
        });
      }
    }
    var loopData = [];
    meterListData.map((data, index) => {
      loopData.push({
        meter_id: data.id,
        device_serial_number: data.deviceSerialNum,
        meter_serial_number: data.meterSerialNum,
        device_id: data.meterType,
        initial_meter_reading: data.initialMeterReading,
      });
    });
    let data = {
      name: state.lastUnitData,
      building_id: buildingId,
      meters: loopData,
    };
    console.log('data--->', data);
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
          console.log('datachecckk-->>', unitResponse),
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

  const handleOpenMeterSelection = () => {
    // console.log('e-ss--->');
    setMeterMenuVisible(true);
    callApi();
  };
  const changeSlider = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSliderNumber(sliderNumber + 1);
    setSliderProgress(sliderProgress + 0.2);
  };
  // const renderSlide1 = ({ item }) => {
  //   return (

  //   );
  // };
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
  const renderSlide2 = ({item}) => {
    return (
      <View
        style={{
          width: width * 0.9,
          alignItems: 'center',
        }}>
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
  const renderSlide3 = ({item, index}) => {
    // console.log('index check slider 3 ---> ',index)
    return (
      <View style={{width: width * 0.8}}>
        <Text style={[styles.meterDesciptionHeading, {top: width * 0.01}]}>
          {item.name}
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
            type == 'meterDirect' || type == 'addMeterDirect' ? true : false
          }
          style={styles.meterInput}
          mode={'outlined'}
          numberOfLines={index == 2 ? 3 : 1}
          multiline={index == 2 ? true : false}
          theme={{
            colors: {
              text: '#25AAE1ec',
              primary: '#25AAE1ec',
              selectionColor: 'red',
            },
          }}
        />
        {/* {item.error ? (
          <HelperText
            type="error"
            visible={item.error}>
            {item.error}
          </HelperText>
        ) : null} */}
      </View>
    );
  };
  const renderSlide4 = ({item}) => {
    return (
      <View style={{flex: 1, width: width * 0.8}}>
        <Text
          style={[
            styles.meterDesciptionHeading,
            {
              fontSize: width * 0.06,
              marginBottom: width * 0.02,
            },
          ]}>
          slider4
        </Text>
      </View>
    );
  };

  const selectMeterLocation = () => {
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
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  const cameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
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
        const source = {uri: res.uri};
        // console.log('response', JSON.stringify(res));
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
    setRegion(region);
  };

  const imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      // console.log('Response = ', res);

      if (res.didCancel) {
        // console.log('User cancelled image picker');
      } else if (res.error) {
        // console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        // console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = {uri: res.uri};
        // console.log('response', JSON.stringify(res));
        // this.setState({
        //   filePath: res,
        //   fileData: res.data,
        //   fileUri: res.uri
        // });
        setFilePath(res);
      }
    });
  };

  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        statusBarTranslucent
        style={{top: width * -0.1}}
        // onBackdropPress={() => closeModal()}
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
                {/* <View
                  style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>Select Location</Text>
                </View> */}
                {markers.length > 0 && (
                  <View
                    style={{
                      // backgroundColor: 'blue',
                      width: width * 0.12,
                      height: height * 0.11,
                      zIndex: 1,
                      position: 'absolute',
                      alignItems: 'center',
                      // justifyContent: 'center',
                      elevation: 1,
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
                    >
                      {/* <Marker
                      coordinate={markers[0].coordinate}
                      title={'Your Location'}
                      draggable
                    /> */}
                    </MapView>
                    <TouchableOpacity
                      onPress={() => setSelectLocation(false)}
                      style={{
                        backgroundColor: '#25AAE1ec',
                        zIndex: 1,
                        position: 'absolute',
                        height: width * 0.12,
                        width: width * 0.12,
                        borderRadius: width * 0.3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: width * 0.005,
                        top: '84%',
                        left: '84%',
                      }}>
                      <Icon
                        size={width * 0.07}
                        color="#fff"
                        name={sliderNumber == 5 ? 'check' : 'navigate-next'}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  height: width * 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  borderRadius: width * 0.03,
                }}>
                <View
                  style={{
                    height: width * 0.18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={[
                      styles.meterDesciptionHeading,
                      {
                        fontSize: width * 0.06,
                        marginBottom: width * 0.02,
                        textTransform: 'capitalize',
                      },
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
                  <Progress.Bar
                    progress={sliderProgress}
                    width={width * 0.8}
                    color={'#25AAE1ec'}
                  />
                </View>
                {sliderNumber == 2 ? (
                  <FlatList
                    contentContainerStyle={{flex: 1, justifyContent: 'center'}}
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
                    <FlatList
                      contentContainerStyle={{flex: 1}}
                      data={slide2}
                      renderItem={renderSlide3}
                    />
                  </View>
                ) : sliderNumber == 4 ? (
                  <View style={styles.container}>
                    {filePath?.assets &&
                      filePath?.assets.map(({uri}) => (
                        <Image
                          resizeMode="cover"
                          resizeMethod="scale"
                          style={{width: width * 0.3, height: width * 0.3}}
                          source={{uri: uri}}
                        />
                      ))}
                    <TouchableOpacity
                      onPress={cameraLaunch}
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
                    <View style={styles.container}>
                      {/* <View style={{position: 'absolute',}}>

                            </View> */}
                      <Image
                        resizeMode="cover"
                        resizeMethod="scale"
                        style={{width: width * 0.9, height: width * 0.62}}
                        source={require('../../../../../../../Images/animated-check.gif')}
                      />
                    </View>
                  ) : (
                    <View style={styles.container}>
                      <Text>Check Meter Status</Text>
                    </View>
                  )
                ) : (
                  <View
                    style={{height: width * 0.62, justifyContent: 'center'}}>
                    {slide1.map((item, index) => (
                      <View style={{width: width * 0.8}}>
                        <View style={styles.meterDesciptionContainer}>
                          <Text style={styles.meterDesciptionHeading}>
                            {item.name}
                          </Text>
                        </View>
                        <SearchableDropdown
                          onItemSelect={(item) => {
                            getDevice(item, index);
                          }}
                          containerStyle={{
                            paddingVertical: width * 0.02,
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
                            placeholder: item.name,
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: width * 0.027,
                              margin: 0,
                              borderColor: item.error ? '#A3001B' : 'black',
                              borderWidth: width * 0.0019,
                              borderRadius: width * 0.015,
                              backgroundColor: '#F6F6F6',
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
                        {item.error ? (
                          <HelperText type="error" visible={item.error}>
                            {item.error}
                          </HelperText>
                        ) : null}
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
                  {doneAnimation ? (
                    <Text style={[styles.buttonText, {width: width * 0.7}]}>
                      {newMeter.name.charAt(0).toUpperCase() +
                        newMeter.name.slice(1).toLowerCase()}{' '}
                      Meter added succesfully please checking installation
                      status...
                    </Text>
                  ) : (
                    <TouchableOpacity
                      style={{
                        height: width * 0.12,
                        width: width * 0.12,
                        position: 'absolute',
                        right: width * 0.0,
                        borderRadius: width * 0.3,
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
                            : sliderNumber == 4 && filePath?.assets != undefined
                            ? '#25AAE1ec'
                            : sliderNumber == 5 && filePath?.assets != undefined
                            ? '#25AAE1ec'
                            : '#D0D0D0',
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: width * 0.005,
                      }}
                      onPress={changeSlider}
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
                          : sliderNumber == 4 && filePath?.assets != undefined
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
            <View style={styles.modalInner}>
              <View style={[styles.boxConatainer, {height: width * 1}]}>
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
                        onPress={changeUtilityAndToggle}
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
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <View style={{flex: 1}}>
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
                    </View>
                    {meterListData &&
                      meterListData.map((item, meterIndex) => (
                        <View
                          style={{
                            alignItems: 'center',
                            overflow: 'hidden',
                            marginBottom: height * 0.02,
                          }}>
                          <View
                            style={{
                              width: width * 0.75,
                            }}>
                            <View>
                              <View style={styles.utilityInScrHeadView}>
                                <Drop
                                  name={item.icon}
                                  size={width * 0.06}
                                  color="#3E89BF"
                                />
                                <Text
                                  style={[
                                    styles.utilityInScrHead,
                                    {
                                      color: '#000',
                                      textTransform: 'capitalize',
                                    },
                                  ]}>
                                  {item.name}
                                </Text>
                                <TouchableOpacity
                                  style={{
                                    position: 'absolute',
                                    right: 0,
                                  }}
                                  onPress={() => deleteMeterInNewArray(item)}>
                                  <Delete
                                    name={'delete-forever'}
                                    size={height * 0.04}
                                    color="#25AAE1ec"
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.meterDesciptionContainer}>
                                <Text style={styles.meterDesciptionHeading}>
                                  Device serial number
                                </Text>
                              </View>
                              <View style={styles.meterInputContainer}>
                                <TextInput
                                  placeholder="Serial Number"
                                  value={item.deviceSerialNum}
                                  dense={true}
                                  error={item.deviceSerialError}
                                  right={
                                    type == 'meterDirect' ||
                                    type == 'addMeterDirect' ? null : (
                                      <TextInput.Icon
                                        name={() => (
                                          <TouchableOpacity
                                            onPress={() =>
                                              toggleScanner(meterIndex)
                                            }
                                            style={{zIndex: 1}}>
                                            <Scanner name="scan" size={20} />
                                          </TouchableOpacity>
                                        )}
                                      />
                                    )
                                  }
                                  onChangeText={(text) =>
                                    type == 'meterDirect' ||
                                    type == 'addMeterDirect'
                                      ? null
                                      : onChangeMultipleField(text, meterIndex)
                                  }
                                  disabled={
                                    type == 'meterDirect' ||
                                    type == 'addMeterDirect'
                                      ? true
                                      : false
                                  }
                                  style={styles.meterInput}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                    },
                                  }}></TextInput>
                              </View>
                              <View style={styles.meterDesciptionContainer}>
                                <Text style={styles.meterDesciptionHeading}>
                                  Initial Meter Reading
                                </Text>
                              </View>
                              <View style={styles.meterInputContainer}>
                                <TextInput
                                  keyboardType="numeric"
                                  placeholder="Initial Meter Reading"
                                  value={item.initialMeterReading}
                                  dense={true}
                                  error={item.initialMeterReadingError}
                                  onChangeText={(text) =>
                                    onChangeInitialReading(text, meterIndex)
                                  }
                                  style={styles.meterInput}
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
                              {item.initialMeterReadingError ? (
                                <HelperText
                                  type="error"
                                  visible={item.initialMeterReadingError}>
                                  {item.initialMeterReadingError}
                                </HelperText>
                              ) : null}
                              {/*//todoK */}
                              <View style={styles.meterDesciptionContainer}>
                                <Text style={styles.meterDesciptionHeading}>
                                  Manufacturers
                                </Text>
                              </View>
                              <SearchableDropdown
                                onItemSelect={(item) => {
                                  getDevice(item, meterIndex);
                                }}
                                containerStyle={{
                                  paddingVertical: width * 0.02,
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
                                  maxHeight: height * 0.1,
                                }}
                                items={state.manufacturersData}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Manufacturer*',
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    margin: 0,
                                    borderColor: item.manufacturersError
                                      ? '#A3001B'
                                      : 'black',
                                    borderWidth: width * 0.0019,
                                    borderRadius: width * 0.015,
                                    backgroundColor: '#F6F6F6',
                                  },
                                  onTextChange: (text) => {
                                    onChangeManufacturer(text, meterIndex);
                                  },
                                  value: setTimeout(
                                    () => item.manufacturersName,
                                    200,
                                  ),
                                  defaultValue: item.manufacturersName,
                                }}
                                listProps={{
                                  nestedScrollEnabled: true,
                                }}
                              />
                              {item.manufacturersError ? (
                                <HelperText
                                  type="error"
                                  visible={item.manufacturersError}>
                                  {item.manufacturersError}
                                </HelperText>
                              ) : null}
                              <View style={styles.meterDesciptionContainer}>
                                <Text style={styles.meterDesciptionHeading}>
                                  Devices
                                </Text>
                              </View>
                              <SearchableDropdown
                                onItemSelect={(item) => {
                                  getDeviceData(item, meterIndex);
                                }}
                                containerStyle={{
                                  paddingVertical: width * 0.02,
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
                                  maxHeight: height * 0.1,
                                }}
                                items={state.devicesData}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Devices',
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    margin: 0,
                                    borderColor: item.deviceError
                                      ? '#A3001B'
                                      : 'black',
                                    borderWidth: width * 0.0019,
                                    borderRadius: width * 0.015,
                                    backgroundColor: '#F6F6F6',
                                  },
                                  onTextChange: (text) => {
                                    onChangeDevice(text, meterIndex);
                                  },
                                  value: setTimeout(() => item.deviceName, 200),
                                  defaultValue: item.deviceName,
                                }}
                                listProps={{
                                  nestedScrollEnabled: true,
                                }}
                              />
                              {item.deviceError ? (
                                <HelperText
                                  type="error"
                                  visible={item.deviceError}>
                                  {item.deviceError}
                                </HelperText>
                              ) : null}
                              {item.showOtherInputs == true ? (
                                <View>
                                  <View style={styles.meterDesciptionContainer}>
                                    <Text style={styles.meterDesciptionHeading}>
                                      Meter Serial Number
                                    </Text>
                                  </View>
                                  <View style={styles.meterInputContainer}>
                                    <TextInput
                                      placeholder="Meter Serial"
                                      dense={true}
                                      style={styles.meterInput}
                                      mode={'outlined'}
                                      onChangeText={(text) =>
                                        onChangeMeterSerial(text, meterIndex)
                                      }
                                      theme={{
                                        colors: {
                                          text: '#25AAE1ec',
                                          primary: '#25AAE1ec',
                                          selectionColor: 'red',
                                        },
                                      }}
                                    />
                                  </View>
                                </View>
                              ) : // console.log('Check Item', item)
                              null}
                              <TouchableOpacity
                                onPress={() => showMoreInputs(item, meterIndex)}
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}>
                                {/*//todo: Button for meter */}
                                <Text
                                  style={{
                                    fontSize: height * 0.018,
                                    color: '#25AAE1ec',
                                  }}>
                                  {item.showOtherInputs
                                    ? 'Show Less'
                                    : 'Show More'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                  </ScrollView>
                  {/* Box Footer */}
                  <View style={styles.footerBtn}>
                    <View
                      style={{
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MenuT
                        visible={meterMenuVisible}
                        anchor={
                          type == 'addMeterDirect' || type == 'meterDirect' ? (
                            meterListData.length == 1 ? (
                              <View style={{marginLeft: width * 0.02}}>
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
                                onPress={() => setShowAddMeterSlider(true)}
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
                          ) : state.meterList.length ? (
                            <TouchableOpacity
                              onPress={() => {
                                LayoutAnimation.configureNext(
                                  LayoutAnimation.Presets.easeInEaseOut,
                                );
                                setShowAddMeterSlider(true);
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
                            <View style={{marginLeft: width * 0.02}}>
                              <Text
                                style={{
                                  fontSize: height * 0.018,
                                  color: '#25AAE1ec',
                                }}>
                                No Meters
                              </Text>
                            </View>
                          )
                        }
                        onRequestClose={() => setMeterMenuVisible(false)}>
                        <ScrollView>
                          {state.meterList.map((item, index) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Drop
                                name={item.icon}
                                size={15}
                                color="#3E89BF"
                              />
                              <MenuItem
                                textStyle={styles.textCapitalize}
                                onPress={() => addMeterInNewArray(item)}>
                                {item.name}
                              </MenuItem>
                            </View>
                          ))}
                        </ScrollView>
                      </MenuT>
                    </View>
                    <View style={styles.addUnitBtnContainer}>
                      <TouchableOpacity onPress={changeUtilityAndToggle}>
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
                    </View>
                  </View>
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
  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxInner: {
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-around',
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
    height: height * 0.035,
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
  meterDesciptionContainer: {
    // width: width * 0.7,
    // backgroundColor: 'red'
  },
  meterDesciptionHeading: {
    fontSize: width * 0.03,
    color: '#3E4A4F',
    textTransform: 'uppercase',
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
    elevation: width * 0.01,
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
    elevation: width * 0.01,
  },
  footerBtn: {
    width: width * 0.8,
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    borderTopWidth: width * 0.001,
    backgroundColor: 'white',
  },
  input: {
    width: width * 0.75,
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
});
