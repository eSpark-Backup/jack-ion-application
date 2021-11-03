import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  LayoutAnimation,
  PermissionsAndroid,
  Alert,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, FAB, HelperText, Divider } from 'react-native-paper';
import { Menu as MenuT, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Fonts } from '../../../../../../utils/fonts';
import Drop from 'react-native-vector-icons/Ionicons';
import Scanner from 'react-native-vector-icons/Ionicons';
import Delete from 'react-native-vector-icons/MaterialIcons';
import { DotsLoader } from 'react-native-indicator';
import TextTicker from 'react-native-text-ticker';
import { create } from 'apisauce';
import Base_URL from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import Back from 'react-native-vector-icons/MaterialIcons';
import MeterTypeBuilder from '../../../../../../components/modal/MeterTypeBuilder';
import SearchableDropdown from 'react-native-searchable-dropdown';
import clc from 'cli-color';
const { width, height } = Dimensions.get('window');
const api = create({ baseURL: Base_URL });

export default function UnitEdit({
  modalVisible,
  closeModal,
  handleEditUnit,
  // meterMenuVisible,
  unitsArray,
  buildingName,
  unitDetails,
  meterTypes,
  buildingId,
  reRun,
  type,
  modalName,
  doneIcon,
  doneBtnTitle,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [meterMenuVisible, setMeterMenuVisible] = useState(false);
  const [typeOfMeters, setTypeOfMeters] = useState([]);
  const [meterListArray, setMeterListArray] = useState([]);
  const [state, setState] = useState({
    isScannerVisible: false,
    hasAccess: false,
    scanResult: false,
    scan: false,
    scanIndex: 0,
    result: '',
    newSerial: '',
    typeOfMetersVisible: false,
    isModalMeterVisible: false,
    measureOfUnit: [],
    manufacturersData: [],
    devicesData: [],
    typeOfMeterIndex: '',
    meterTypeBuilder: false,
    lastUnitData: '',
    meterList: [],
  });
  const [error, setError] = useState({
    errorUnits: '',
  });

  const getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('It Worked', token);
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
      meterList: antiIntersection,
    }));
  };

  useEffect(() => {
    getToken();
  }, [modalVisible]);

  useEffect(() => {
    setMeterListArray(meterTypes);
    console.log('un in mod-->>', unitDetails);
    setState((oldState) => ({
      ...oldState,
      lastUnitData: unitDetails?.unit?.name,
    }));
  }, [meterTypes, unitDetails]);

  const addMeterInNewArray = async (value) => {
    setMeterMenuVisible(false);
    // console.log('value Of selectable meter_______', value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const data = {
      id: value.id,
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
      manufacturersName: '',
      manufacturersError: '',
      deviceId: '',
      deviceName: '',
      deviceError: '',
      meterAttachedError: '',
      meterSerialNum: '',
      customMeterId: '',
      name: value.name,
      icon: value.icon,
      meterTypeMenu: false,
    };
    const newArray = [...meterListData];
    newArray.push(data);
    setMeterListData(newArray);

    const newList = state.meterList.filter((item) => item.id !== value.id);
    // setMeterListArray(newList);
    setState((oldState) => ({
      ...oldState,
      meterList: newList,
    }));
    const unitResponse = await api.get(`/property/equipment/type/all-types`);
    // console.log('Check types add--->', unitResponse.data);
    setTypeOfMeters(unitResponse?.data?.data);
    // console.log('Check types add state.meterList--->', state.meterList);
    // console.log('Check types add meterListData--->', meterListData);
    // console.log('Check types add meterMenuVisible--->', meterMenuVisible);
  };

  const deleteMeterInNewArray = (value) => {
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


    // setMeterListArray(newArray.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };
  //!----------->
  // useEffect(() => {
  //   console.log('Check types use state.meterList--->', state.meterList);
  //   console.log('Check types use meterListData--->', meterListData);
  //   console.log('Check types use meterMenuVisible--->', meterMenuVisible);
  // }, [meterListData,meterMenuVisible,state]);
  const showMoreInputs = (value, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].showOtherInputs = !value.showOtherInputs; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // this.setState({showOtherInputs: !this.state.showOtherInputs});
  };

  const handleMetertypeModal = async (index) => {
    const unitResponse = await api.get(
      `/property/equipment/unit-of-measure/all`,
    );

    // this.setState({ measureOfUnit: unitResponse?.data?.data, typeOfMeterIndex: index },
    //   () => console.log('measureOfUnit Of_______', this.state.measureOfUnit),
    // );
    setState((oldState) => ({
      ...oldState,
      measureOfUnit: unitResponse?.data?.data,
      typeOfMeterIndex: index,
      isModalMeterVisible: true,
      meterTypeBuilder: true,
    }));
  };

  const showTypesOfMeter = (item, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].meterTypeMenu = true; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const onGetMeterTypeId = (item, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].meterTypeName =
      item.model +
      ' ' +
      '(x' +
      item.multiplier +
      ' ' +
      item.unit_of_measure +
      ')'; // replace e.target.value with whatever you want to change it to
    newArr[index].meterType = item.id; // replace e.target.value with whatever you want to change it to
    // console.log(newArr[index],'mter types') // replace e.target.value with whatever you want to change it to
    newArr[index].meterTypeMenu = false; // replace e.target.value with whatever you want to change it to
    // this.setState({meterListData: newArr});
    setMeterListData(newArr);
  };

  // useEffect(() => {
  //   // setMeterListArray(meterTypes);
  //   // console.log('XXXXX state', state);
  // }, [state]);
  const toggleScanner = async (value) => {
    setState((oldState) => ({
      ...oldState,
      scanIndex: value,
    }));
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
  };
  const onScanned = (e) => {
    const check = e.data.substring(0, 4);
    if (check == 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      let newArr = [...meterListData]; // copying the old datas array
      newArr[state.scanIndex].deviceSerialNum = e.data; // replace e.target.value with whatever you want to change it to
      setMeterListData(newArr);
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
  };
  const scannerModal = () => {
    setState((oldState) => ({
      ...oldState,
      isScannerVisible: false,
      scan: false,
    }));
  };
  //!-------->
  const onChangeMultipleField = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].deviceSerialNum = e; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const onChangeMeterSerial = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].meterSerialNum = e; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const onChangeManufacturer = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].manufacturersName = e; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const onChangeDevice = (e, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].deviceName = e; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const hideTypesOfMeter = (item, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].meterTypeMenu = false; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
  };
  const handleMetertypeSelection = (child) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[state.typeOfMeterIndex].meterTypeName = child.name; // replace e.target.value with whatever you want to change it to
    newArr[state.typeOfMeterIndex].meterType = child.id;
    // this.setState({ meterListData: newArr });
    // console.log('checkchild-->', child);
    setMeterListData(newArr);
    setState((oldState) => ({
      ...oldState,
      meterTypeBuilder: false,
    }));
  };
  // console.log('got Meters', typeOfMeters); // ye jb hoga jb select hoga meter type
  // console.log('got unit details', unitDetails);

  const handleMeterTypeClose = () => {
    setState((oldState) => ({
      ...oldState,
      meterTypeBuilder: false,
    }));
  };

  const changeUtilityAndToggle = () => {
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
    // console.log('data--->');
  };

  const callApi = async () => {
    const ManufacturersResponse = await api.get(
      '/property/equipment/manufacturer/all',
    );

    // console.log(
    //   clc.bgBlueBright('io', JSON.stringify(ManufacturersResponse?.data?.data)),
    // );
    setState((oldState) => ({
      ...oldState,
      manufacturersData: ManufacturersResponse?.data?.data,
    }));
  };

  const getDevice = async (some, index) => {
    const deviceResponse = await api.get(
      `/property/equipment/device/all/${some?.id}`,
    );
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].manufacturersName = some?.name; // replace e.target.value with whatever you want to change it to
    newArr[index].manufacturersId = some?.id; // replace e.target.value with whatever you want to change it to
    newArr[index].deviceName = ''; // replace e.target.value with whatever you want to change it to
    newArr[index].meterType = ''; // replace e.target.value with whatever you want to change it to
    setMeterListData(newArr);
    setState((oldState) => ({
      ...oldState,
      devicesData: deviceResponse?.data?.data,
    }));
  };
  const getDeviceData = (some, index) => {
    let newArr = [...meterListData]; // copying the old datas array
    newArr[index].deviceName = some?.name; // replace e.target.value with whatever you want to change it to
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
        type_id: data.meterType,
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
    console.log('e-ss--->')
    setMeterMenuVisible(true);
    callApi();
  }
  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        isVisible={modalVisible}
        // isVisible={true}
        style={styles.modal1Container}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalInner}>
            <View
              style={[
                styles.boxConatainer,
                {
                  height:
                    meterListData.length == 0 ? height * 0.46 : height * 0.55,
                },
              ]}>
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
                  <View style={{ flex: 1 }}>
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
                          type == 'meterDirect'
                            ? null
                            : setState((oldState) => ({
                              ...oldState,
                              lastUnitData: text,
                            }));
                        }}
                        disabled={type == 'meterDirect'
                          ? true
                          : false}
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
                            // top: height * 0.005,
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
                                  type == 'meterDirect' || type == "addMeterDirect" ? null : (
                                    <TextInput.Icon
                                      name={() => (
                                        <TouchableOpacity
                                          onPress={() =>
                                            toggleScanner(meterIndex)
                                          }>
                                          <Scanner name="scan" size={20} />
                                        </TouchableOpacity>
                                      )}
                                    />
                                  )
                                }
                                onChangeText={(text) =>
                                  type == 'meterDirect' || type == "addMeterDirect"
                                    ? null
                                    : onChangeMultipleField(text, meterIndex)
                                }
                                disabled={type == 'meterDirect' || type == "addMeterDirect"
                                  ? true
                                  : false}
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
                            {item.deviceSerialError ? (
                              <HelperText
                                type="error"
                                visible={item.deviceSerialError}>
                                {item.deviceSerialError}
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
                                // console.log('kuch', item.id);
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
                              itemTextStyle={{ color: '#222' }}
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
                              itemTextStyle={{ color: '#222' }}
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
                                {/* <View style={styles.meterDesciptionContainer}>
                                  <Text style={styles.meterDesciptionHeading}>
                                    Custom Meter ID
                                  </Text>
                                </View>
                                <View style={styles.meterInputContainer}>
                                  <TextInput
                                    placeholder=""
                                    dense={true}
                                    keyboardType="numeric"
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
                                </View> */}
                              </View>
                            ) : (
                              console.log('Check Item', item)
                            )}
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
                              onPress={handleOpenMeterSelection}
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                zIndex: 1,
                              }}
                            // android_ripple={{
                            //   color: '#25AAE1ec',
                            //   borderless: true,
                            //   radius: height * 0.08,
                            // }}
                            >
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
                              setMeterMenuVisible(true);
                              callApi();
                            }}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              zIndex: 1,
                            }}
                          // android_ripple={{
                          //   color: '#25AAE1ec',
                          //   borderless: true,
                          //   radius: height * 0.08,
                          // }}
                          >
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
                      }
                      onRequestClose={() => setMeterMenuVisible(false)}>
                      <ScrollView>
                        {state.meterList.map((item, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // paddingLeft: width * 0.02,
                            }}>
                            <Drop name={item.icon} size={15} color="#3E89BF" />
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
                        <Text style={{ color: 'black' }}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddNewUnit}>
                      <View style={styles.submitBotton}>
                        {/* {doneIcon ? (
                          <>
                            {doneIcon}
                            <Text style={{color: 'white'}}>{doneBtnTitle}</Text>
                          </>
                        ) : (
                        )} */}
                        <Plus name={type == 'meterDirect' || type == 'addMeterDirect' || type == 'add' ? "plus" : 'pencil-plus'} color="white" size={18} />
                        <Text style={{ color: 'white' }}>
                          {type == 'meterDirect' || type == 'addMeterDirect' || type == 'add' ? "Add Unit" : 'Edit Unit'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        animationIn="bounceInUp"
        animationOut="bounceInDown"
        backdropOpacity={5}
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
      {/* Meter type builder */}

      {/* <MeterTypeBuilder
        isVisible={state.meterTypeBuilder}
        title="Meter Type Builder"
        measureOfUnit={state.measureOfUnit}
        // manufacturers={state.manufacturersData}
        doneBtnTitle="Save"
        meterTypeSelect={handleMetertypeSelection}
        style={{height: height * 0.55}}
        onCancel={handleMeterTypeClose}
        // onDone={this.editAlert}
      ></MeterTypeBuilder> */}
    </View>
  );
}

const styles = StyleSheet.create({
  modal1Container: {
    // zIndex: 0,
  },
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
    // width: width * .85,
    // height: height * .5,
  },
  boxInner: {
    // flex: 1,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    // alignItems: 'center',
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
    // backgroundColor: 'red',
    // marginBottom: height * .01
  },
  inputContainer: {
    // height: height * .09,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "yellow"
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
    height: height * 0.042,
    width: width * 0.7,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    // flexDirection: 'row',
    // alignSelf: 'center',
    // alignItems: 'flex-end',
    // marginBottom: height * .01
  },
  meterDesciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: Fonts.ComfortaaRegular,
  },
  meterInputContainer: {
    // height: height * .09,
    width: width * 0.8,
    justifyContent: 'center',
  },
  meterInput: {
    // height: height * .07,
    width: width * 0.75,
    justifyContent: 'flex-end',
    fontSize: height * 0.018,
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  addUnitBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // width: width * .48,
    // margin: width * .02,
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
    // height: height * 0.07,
    width: width * 0.75,
    fontSize: height * 0.018,
  },
  boxConatainerlist: {
    flex: 1,
    marginVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
  },
  boxInnerlist: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    overflow: 'hidden',
  },
  currentReadContainer: {
    width: '100%',
  },
  inputFilterView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 1,
    marginVertical: height * 0.001,
    paddingHorizontal: height * 0.02,
  },

  filterUtility: {
    alignItems: 'center',
    height: height * 0.16,
    // backgroundColor: '#fff',
    padding: width * 0.02,
    elevation: 1,
    marginVertical: width * 0.001,
  },
  propText: {
    textTransform: 'capitalize',
    fontFamily: Fonts.Montserrat,
    fontSize: width * 0.04,
    color: '#001522',
    // textAlign: 'center',
    textShadowOffset: {
      width: width * 0.002,
      height: height * 0.002,
    },
    textShadowRadius: width * 0.005,
    textShadowColor: '#09BAF2',
  },
});
