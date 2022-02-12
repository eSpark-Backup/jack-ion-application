import React, {Component, version} from 'react';

import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Pressable,
  Alert,
  FlatList,
  ToastAndroid,
  TouchableHighlightBase,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

//Packages

import Iconi from 'react-native-vector-icons/Ionicons';
import Geocoder from 'react-native-geocoding';
import Toast from 'react-native-simple-toast';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../components/Loader';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
import Base_URL from '../../api/WebServices';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import SystemSetting from 'react-native-system-setting';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getDistance} from 'geolib';
import MapView, {PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

// Components
import {Fonts} from '../../utils/fonts';
import styles from './FormStyle';
import ContextProp from './Context/propContext';
import {create} from 'apisauce';
import {call} from 'react-native-reanimated';
import SearchableDropDown from 'react-native-searchable-dropdown';
import clc, {bold} from 'cli-color';
const {width, height} = Dimensions.get('window');

const api = create({baseURL: Base_URL});
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Splash extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isVisible: false,
      count: 0,
      Name: '',
      Street: '',
      State: '',
      City: '',
      ZipCode: '',
      CustomId: '',
      CustomerName: '',
      customerjobDes: '',
      customerPhone: '',
      customerEmail: '',
      avoidKeyboard: false,
      selectedMeterId: null,
      selectedMetersId: [],
      loadManufacturers: false,
      loadMeters: false,
      selectLocation: false,
      locationBtn: 'Select Location',
      locationSelected: false,
      companies: false,
      markers: [],
      manageCompList: [],
      iniLat: 0,
      iniLong: 0,
      lat: 0,
      long: 0,
      latDelta: LATITUDE_DELTA,
      longDelta: LONGITUDE_DELTA,
      loadScreen: false,
      open: false,
      meterList: [],
      BillingCompany: '',
      BillingCompanyId: '',
      managementCompany: '',
      managementCompanyId: '',
      radialDis: 0.1,
      selectMeter: '',
      selectManagement: '',
      selectUtil: [],
      selectMeters: [],
      selectDevices: [],
      modelNo: '',
      productNo: '',
      btnLoading: false,
      addNewType: false,
      showAddType: '',
      addUtility: '',
      addManufacturer: '',
      addMeter: '',
      addManagement: '',
      addModelNumber: '',
      addBilling: '',
      addMeter: '',
      //* working here
      productD: '',
      enableDevice: false,
      devicesArray: [],
      showAddManufacturer: false,
      showEditManufacturer: false,
      manufacturersArray: [],
      modelArr: [],
      selectedDevice: {},
      currentManuIndex: null,
      devIdsArr: [],
      addDevice: [
        {
          id: 0,
          select: '',
          selectId: '',
          name: 'Select Manufacturer',
          data: [],
        },
        {
          id: 1,
          selectId: '',
          select: '',
          name: 'Select Device Type',
          data: [],
        },
        {
          id: 2,
          selectId: '',
          select: '',
          name: 'Add New Device',
          data: [],
        },
      ],
      info: {
        propName: '',
        propStreet: '',
        propState: '',
        propCity: '',
        propZipCode: '',
        propBillComp: '',
        propManageComp: '',
        propCustomId: '',
        propCustomId: '',
        propContactName: '',
        propContactTitle: '',
        proContactPhone: '',
        proContactEmail: '',
      },
      error: {
        property: '',
        meterId: '',
        utilType: '',
        deviceId: '',
        street: '',
        city: '',
        zipcode: '',
        st: '',
        modelNos: '',
        devIdsArr: '',
      },
      value: '',
      dropDownShow: [
        {value: true},
        {value: false},
        {value: false},
        {value: false},
        {value: false},
        {value: false},
        {value: false},
      ],
      deviceData: [
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
        {
          id: 2,
          selectId: '',
          select: '',
          error: '',
          name: 'Model Number',
          data: [],
        },
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    // alert('Keyboard Shown');
    // if (this.state.dropDownShow[3].value) {
    //   this.setState({avoidKeyboard: true});
    // }
    this.state.dropDownShow[3].value
      ? this.setState({avoidKeyboard: true})
      : this.state.dropDownShow[4].value
      ? this.setState({avoidKeyboard: true})
      : this.state.dropDownShow[5].value
      ? this.setState({avoidKeyboard: true})
      : this.state.dropDownShow[6].value
      ? this.setState({avoidKeyboard: true})
      : null;
  };

  _keyboardDidHide = () => {
    // alert('Keyboard Hidden');
    this.setState({avoidKeyboard: false});
  };

  toggleModalAddProp = () => {
    this.setState({isModalAddPropVisible: !this.state.isModalAddPropVisible});
  };

  typeSwitcher = (arg) => {
    switch (arg.toLowerCase()) {
      case 'hot water':
        return require('../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../Images/electric.png');
      case 'gas':
        return require('../../../Images/gass.png');
      case 'water':
        return require('../../../Images/all-waters.png');
      default:
        break;
    }
  };

  getNewDeviceData = (value, index) => {
    let listSlide = [...this.state.addDevice]; // copying the old datas array
    listSlide[index].select = value?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = value?.id; // replace e.target.value with whatever you want to change it to
    this.setState({addDevice: listSlide});
  };

  onChangeNewDevice = (e, index) => {
    let listSlide = [...this.state.addDevice]; // copying the old datas array
    listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
    this.setState({addDevice: listSlide});
  };

  addMeterInNewArray = (value) => {
    let newArr = [...this.state.selectedMetersId];
    newArr.push(parseInt(value.id));
    console.log('ITEM VALUE', value);
    this.setState({selectedMeterId: value.id, selectedMetersId: newArr});
    this.setState({selectMeter: value.name});
    this.setState((prevState) => ({
      ...prevState,
      error: {
        ...prevState.error, // keep all other key-value pairs
        meterId: '', // update the value of specific key
      },
    }));
    console.log('selectedMeterId VALUE', this.state.selectedMeterId);
  };

  renderMeterInfo = ({item}) => {
    return (
      <View
        style={{
          width: width * 0.8,
          alignItems: 'center',
        }}
        key={item?.id}>
        <TouchableOpacity
          style={{
            height: width * 0.12,
            width: '100%',
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
          onPress={() => this.addMeterInNewArray(item)}>
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
                source={this.typeSwitcher(item.name)}
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
            {item.id == this.state.selectedMeterId ? (
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

  clearInputs = () => {
    this.toggleModalAddProp();
    this.setState({
      Name: '',
      Street: '',
      State: '',
      City: '',
      ZipCode: '',
      CustomId: '',
      CustomerName: '',
      customerjobDes: '',
      customerPhone: '',
      customerEmail: '',
      BillingCompanyId: '',
      BillingCompany: 'BILLING COMPANY',
      managementCompanyId: '',
      managementCompany: 'MANAGEMENT COMPANY',
      error: '',
      locationSelected: false,
      locationBtn: 'Select Location',
      lat: null,
      long: null,
      selectMeter: '',
      selectUtil: [],
      manufacturersArray: [],
      selectDevices: [],
      addDevice: [
        {
          id: 0,
          select: '',
          selectId: '',
          name: 'Select Manufacturer',
          data: [],
        },
        {
          id: 1,
          selectId: '',
          select: '',
          name: 'Select Device Type',
          data: [],
        },
        {
          id: 2,
          selectId: '',
          select: '',
          name: 'Add New Device',
          data: [],
        },
      ],
      deviceData: [
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
        {
          id: 2,
          selectId: '',
          select: '',
          error: '',
          name: 'Model Number',
          data: [],
        },
      ],
      addNewType: false,
      productD: '',
    });
  };

  checkLocation = async (locationAccess) => {
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
      this.setState({isModalAddPropVisible: true});
      this._renderMap();
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

  showAddNewType = (value) => {
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
    this.setState({addNewType: true});
    this.setState({showAddType: value}, () => {
      if (value == 'Model Number') {
        this.setState({enableDevice: false});
        console.log('Model Number Adding------');
        this.getAllDevices();
      }
    });
  };

  addProperty = () => {
    console.log('kiya Mila', this.state.Name);
    const selectUtilIds = [];
    this.setState({btnLoading: true});
    if (!this.state.Name) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: 'Invalid Property', // update the value of specific key
        },
      }));
      Toast.show('Invalid Property', Toast.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: '', // update the value of specific key
        },
      }));
    }
    if (!this.state.Street) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: 'Invalid Street', // update the value of specific key
        },
      }));
      Toast.show('Invalid Street', Toast.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: '', // update the value of specific key
        },
      }));
    }

    // if (this.state.selectedMeterId == null) {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       meterId: 'Please select a meter from above', // update the value of specific key
    //     },
    //   }));
    //   Toast.show('Please select a meter', Toast.SHORT);
    //   return;
    // } else {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       meterId: '', // update the value of specific key
    //     },
    //   }));
    // }

    if (this.state.selectedMetersId.length < 1) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          meterId: 'Please select a meter from above', // update the value of specific key
        },
      }));
      Toast.show('Please select a meter', Toast.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          meterId: '', // update the value of specific key
        },
      }));
    }

    if (this.state.selectUtil == null) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          utilType: 'Please select a utility type from above', // update the value of specific key
        },
      }));
      Toast.show('Please select a Utility Type', Toast.SHORT);
      return;
    } else {
      for (let i = 0; i < this.state.selectUtil?.length; i++) {
        selectUtilIds.push(this.state.selectUtil[i].id);
      }
      console.log('SELECTED UTILITY IDs', selectUtilIds);
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          utilType: '', // update the value of specific key
        },
      }));
    }
    //! -------------------------+++
    // if (this.state.deviceData[1].selectId === '') {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       deviceId: 'Please select a device from above', // update the value of specific key
    //     },
    //   }));
    //   Toast.show('Please select a device', Toast.SHORT);
    //   return;
    // } else {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       ...prevState.error, // keep all other key-value pairs
    //       deviceId: '', // update the value of specific key
    //     },
    //   }));
    // }
    if (this.state.devIdsArr.length < 1) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          devIdsArr: 'Please add a Manufacturer from above', // update the value of specific key
        },
      }));
      Toast.show('Please Add Manufacturers', Toast.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          ...prevState.error, // keep all other key-value pairs
          devIdsArr: '', // update the value of specific key
        },
      }));
    }
    if (!this.state.locationSelected) {
      Alert.alert('Location Required', 'Please Select Property Location');
      return;
    } else {
      this.setState({locationSelected: false});

      console.log('Before', this.state.info.propName);
      // const info = { ...this.state.info, propName: 'Good HAI' }
      this.setState(
        Object.assign(this.state.info, {
          propName: this.state.Name,
          propStreet: this.state.Street,
          propState: this.state.State,
          propCity: this.state.City,
          propZipCode: this.state.ZipCode,
          propBillComp: this.state.BillingCompanyId
            ? this.state.BillingCompany
            : '',
          propBillCompId: this.state.BillingCompanyId,
          propManageComp: this.state.managementCompanyId
            ? this.state.managementCompany
            : '',
          propManageCompId: this.state.managementCompanyId,
          propCustomId: this.state.CustomId,
          propContactName: this.state.CustomerName,
          propContactTitle: this.state.customerjobDes,
          propContactPhone: this.state.customerPhone,
          propContactEmail: this.state.customerEmail,
          meter_id: this.state.selectedMetersId,
          device_id: this.state.devIdsArr,
          // model_no_id: this.state.modelNoIdArray,
          propLat: this.state.lat,
          propLong: this.state.long,
          utility_type_id: selectUtilIds,
          radial_dist: Number(this.state.radialDis),
        }),
        () => this.props.loader(true),
        {btnLoading: false},
      );
      this.context.addProp(this.state.info);
      this.clearInputs();
    }
  };

  cancelAddType = () => {
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
    let deviceData = [...this.state.addDevice]; // copying the old datas array
    deviceData[0].select = '';
    deviceData[0].selectId = '';
    deviceData[1].select = '';
    deviceData[1].selectId = '';
    deviceData[2].select = '';
    deviceData[2].selectId = '';
    this.setState({
      addNewType: false,
      showAddType: '',
      addManufacturer: '',
      addUtility: '',
      addMeter: '',
      addDevice: deviceData,
      devicesArray: [],
      modelArr: [],
      selectedDevice: {},
      addModelNumber: '',
      productNo: '',
      modelNo: '',
    });
  };

  deviceTypeInfoComponent = (flag) => {
    const {deviceData} = this.state;
    return (
      <View
        style={{
          // height: height * 0.25,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          // justifyContent: 'center',
          zIndex: 2,
          height: this.state.dropDownShow[3].value
            ? height * 0.5
            : height * 0.0,
          overflow: 'hidden',
          // backgroundColor: 'tomato',
        }}>
        {this.state.addNewType && this.state.showAddType == 'Manufacturer' ? (
          <View
            style={{
              width: '100%',
              zIndex: 2,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View>
              <View>
                <Text
                  style={{
                    fontSize: width * 0.03,
                    color: '#3E4A4F',
                    textTransform: 'capitalize',
                    fontFamily: Fonts.ComfortaaRegular,
                    marginBottom: width * 0.01,
                    fontWeight: 'bold',
                  }}>
                  Add New {this.state.showAddType}
                </Text>
              </View>
              <TextInput
                placeholder={'Type New Manufacturer Name'}
                value={this.state.addManufacturer}
                style={{
                  width: width * 0.8,
                  justifyContent: 'flex-end',
                  fontSize: width * 0.036,
                }}
                mode={'outlined'}
                theme={{
                  colors: {
                    text: '#25AAE1ec',
                    primary: '#25AAE1ec',
                    selectionColor: 'red',
                  },
                }}
                onChangeText={(text) => {
                  this.setState({addManufacturer: text});
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginVertical: height * 0.01,
                }}>
                <TouchableOpacity onPress={() => this.cancelAddType()}>
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
                  onPress={() => this.doneAddType()}
                  disabled={this.state.addManufacturer ? false : true}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: width * 0.045,
                      color: this.state.addManufacturer
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
          </View>
        ) : this.state.addNewType && this.state.showAddType == 'Device' ? (
          <ScrollView
            style={{
              width: '90%',
              zIndex: 2,
              alignSelf: 'center',
            }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}>
            {this.state.addDevice &&
              this.state.addDevice?.map((item, index) => (
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
                    <SearchableDropDown
                      onItemSelect={(items) => {
                        this.getNewDeviceData(items, index);
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
                          this.onChangeNewDevice(text, index);
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
                        placeholder={'Type New Device Name'}
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
                          this.onChangeNewDevice(text, index);
                        }}
                      />
                      <View>
                        <View>
                          <Text style={styles.meterDesciptionHeading}>
                            Model Number*
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: width * 0.8,
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            placeholder="Type Model Number"
                            value={this.state.modelNo}
                            showSoftInputOnFocus={false}
                            style={[styles.meterInput, {width: width * 0.6}]}
                            mode={'outlined'}
                            theme={{
                              colors: {
                                text: '#25AAE1ec',
                                primary: '#25AAE1ec',
                                selectionColor: 'red',
                              },
                            }}
                            onChangeText={(text) => {
                              this.setState({modelNo: text});
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              // backgroundColor: '#25AAE1ec',
                              width: width * 0.14,
                              height: width * 0.14,
                              borderWidth: 2,
                              borderRadius: 5,
                              alignSelf: 'flex-end',
                              borderColor: '#25AAE1ec',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() =>
                              this.AddTypes(this.state.modelNo, 'Models')
                            }>
                            <Icon
                              size={width * 0.1}
                              color="#25AAE1ec"
                              name={'add'}
                            />
                          </TouchableOpacity>
                        </View>
                        {this.state.modelArr.length > 0 && (
                          <FlatList
                            data={this.state.modelArr}
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
                                <Text style={{color: 'black'}}>{item}</Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    const items = this.state.modelArr.filter(
                                      (sitem) => sitem !== item,
                                    );
                                    this.setState({modelArr: items});
                                  }}>
                                  <Icon name="close" size={width * 0.05} />
                                </TouchableOpacity>
                              </View>
                            )}
                          />
                        )}
                      </View>
                      <View>
                        <View>
                          <Text style={styles.meterDesciptionHeading}>
                            Product Description*
                          </Text>
                        </View>
                        <TextInput
                          placeholder="Type Product Description"
                          value={this.state.productNo}
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
                            this.setState({productNo: text});
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
                marginVertical: height * 0.01,
              }}>
              <TouchableOpacity onPress={() => this.cancelAddType()}>
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
                onPress={() => this.doneAddType()}
                disabled={
                  this.state.addDevice[0].selectId &&
                  this.state.addDevice[1].selectId &&
                  this.state.addDevice[2].select !== '' &&
                  this.state.modelArr.length > 0 &&
                  this.state.productNo !== ''
                    ? false
                    : true
                }>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: width * 0.045,
                    color:
                      this.state.addDevice[0].selectId &&
                      this.state.addDevice[1].selectId &&
                      this.state.addDevice[2].select !== '' &&
                      this.state.modelArr.length > 0 &&
                      this.state.productNo !== ''
                        ? '#25AAE1ec'
                        : '#d0d0d0',
                    width: width * 0.16,
                    textAlign: 'center',
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : this.state.addNewType &&
          this.state.showAddType == 'Model Number' ? (
          <View
            style={{
              width: '100%',
              zIndex: 2,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {!this.state.enableDevice ? (
              <ActivityIndicator size={'large'} color="#25AAE1ec" />
            ) : (
              <View>
                <View>
                  <View>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        color: '#3E4A4F',
                        textTransform: 'capitalize',
                        fontFamily: Fonts.ComfortaaRegular,
                        marginBottom: width * 0.01,
                        fontWeight: 'bold',
                      }}>
                      Select Device
                    </Text>
                  </View>
                  <SearchableDropDown
                    onItemSelect={(item) => {
                      // this.getNewDeviceData(items, index);
                      this.setState({selectedDevice: item});
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
                    items={this.state.devicesArray}
                    resetValue={false}
                    textInputProps={{
                      editable: this.state.enableDevice,
                      placeholder: 'Select Device',
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
                        // this.onChangeNewDevice(text, index);
                        console.log('tes', text);
                      },
                      value: setTimeout(
                        () => this.state.selectedDevice?.name,
                        200,
                      ),
                      defaultValue: this.state.selectedDevice?.name,
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
                      fontFamily: Fonts.ComfortaaRegular,
                      marginBottom: width * 0.01,
                      fontWeight: 'bold',
                    }}>
                    Add New {this.state.showAddType}
                  </Text>
                </View>
                <TextInput
                  placeholder={'Type New Model Number'}
                  value={this.state.addModelNumber}
                  style={{
                    width: width * 0.8,
                    justifyContent: 'flex-end',
                    fontSize: width * 0.036,
                  }}
                  mode={'outlined'}
                  theme={{
                    colors: {
                      text: '#25AAE1ec',
                      primary: '#25AAE1ec',
                      selectionColor: 'red',
                    },
                  }}
                  onChangeText={(text) => {
                    this.setState({addModelNumber: text});
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: height * 0.01,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.cancelAddType()}
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
                    onPress={() => this.doneAddType()}
                    // onPress={() => console.log('Press Done')}
                    disabled={this.state.addModelNumber ? false : true}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: width * 0.045,
                        color: this.state.addModelNumber
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
        ) : (
          <View>
            {deviceData.map((item, index) => {
              if (index == 0) {
                return (
                  <View
                    style={{
                      width: '90%',
                      zIndex: 2,
                      alignSelf: 'center',
                    }}
                    key={item.id}>
                    <Text style={styles.meterDesciptionHeading}>
                      {item.name}*
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        pointerEvents={
                          index > 0
                            ? deviceData[0].selectId
                              ? 'auto'
                              : 'none'
                            : 'auto'
                        }>
                        <SearchableDropDown
                          onItemSelect={(item) => {
                            this.getDevice(item, index);
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
                            zIndex: 99,
                          }}
                          itemTextStyle={{color: '#222'}}
                          itemsContainerStyle={{
                            maxHeight: height * 0.08,
                          }}
                          items={item.data}
                          resetValue={false}
                          textInputProps={{
                            editable:
                              index == 2
                                ? deviceData[1].selectId
                                  ? true
                                  : false
                                : true,
                            placeholder:
                              index == 1
                                ? deviceData[0].selectId
                                  ? item.name
                                  : 'First Select Manufacturer'
                                : index == 2
                                ? deviceData[1].selectId
                                  ? item.name
                                  : 'First Select Device'
                                : item.name,
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: width * 0.027,
                              margin: 0,
                              borderTopLeftRadius: width * 0.015,
                              borderBottomLeftRadius: width * 0.015,
                              borderColor: item.error ? '#A3001B' : 'black',
                              height: width * 0.13,
                              backgroundColor: '#F6F6F6',
                              borderTopWidth: width * 0.0019,
                              borderLeftWidth: width * 0.0019,
                              borderBottomWidth: width * 0.0019,
                              zIndex: 0,
                            },
                            onTextChange: (text) => {
                              this.onChangeManufacturer(text, index);
                            },
                            value: setTimeout(() => item.select, 200),
                            defaultValue: item.select,
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
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
                        onPress={() => this.showAddNewType(item.name)}>
                        <Icon size={width * 0.06} color="#fff" name={'add'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
              if (index == 1) {
                return (
                  <View
                    style={{
                      width: '90%',
                      zIndex: 2,
                      alignSelf: 'center',
                    }}
                    key={item.id}>
                    <Text style={styles.meterDesciptionHeading}>
                      {item.name}*
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        pointerEvents={
                          index > 0
                            ? deviceData[0].selectId
                              ? 'auto'
                              : 'none'
                            : 'auto'
                        }>
                        <SearchableDropDown
                          multi={true}
                          selectedItems={this.state.selectDevices}
                          onItemSelect={(item) => {
                            // this.getDevice(item, index);
                            this.AddTypes(item, 'Devices');
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
                            zIndex: 99,
                          }}
                          itemTextStyle={{color: '#222'}}
                          itemsContainerStyle={{
                            maxHeight: height * 0.08,
                          }}
                          items={item.data}
                          onRemoveItem={(item, index) => {
                            const items = this.state.selectDevices.filter(
                              (sitem) => sitem.id !== item.id,
                            );
                            // selectedTypes.current = items;
                            this.setState({selectDevices: items});
                          }}
                          resetValue={false}
                          textInputProps={{
                            editable:
                              index == 2
                                ? deviceData[1].selectId
                                  ? true
                                  : false
                                : true,
                            placeholder:
                              index == 1
                                ? deviceData[0].selectId
                                  ? item.name
                                  : 'First Select Manufacturer'
                                : index == 2
                                ? deviceData[1].selectId
                                  ? item.name
                                  : 'First Select Device'
                                : item.name,
                            underlineColorAndroid: 'transparent',
                            style: {
                              padding: width * 0.027,
                              margin: 0,
                              borderTopLeftRadius: width * 0.015,
                              borderBottomLeftRadius: width * 0.015,
                              borderColor: item.error ? '#A3001B' : 'black',
                              height: width * 0.13,
                              backgroundColor: '#F6F6F6',
                              borderTopWidth: width * 0.0019,
                              borderLeftWidth: width * 0.0019,
                              borderBottomWidth: width * 0.0019,
                              zIndex: 0,
                            },
                            // onTextChange: (text) => {
                            //   this.onChangeManufacturer(text, index);
                            // },
                            // value: setTimeout(() => item.select, 200),
                            // defaultValue: item.select,
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
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
                        onPress={() => this.showAddNewType(item.name)}>
                        <Icon size={width * 0.06} color="#fff" name={'add'} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <FlatList
                        data={this.state.selectDevices}
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
                            <Text style={{color: 'black'}}>{item.name}</Text>
                            <TouchableOpacity
                              onPress={() => {
                                const items = this.state.selectDevices.filter(
                                  (sitem) => sitem.id !== item.id,
                                );
                                this.setState({selectDevices: items});
                              }}>
                              <Icon name="close" size={width * 0.05} />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                );
              }
            })}
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() => this.showAddNewType('Model Number')}>
              <View
                style={{
                  height: width * 0.1,
                  width: width * 0.4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#25AAE1',
                }}>
                <Text style={{color: '#25AAE1'}}>Add New Model No</Text>
              </View>
            </TouchableOpacity>
            {/* <View
              style={{
                width: width * 0.8,
              }}>
              <View
                style={[
                  styles.desciptionContainer,
                  {
                    alignSelf: 'flex-start',
                    borderBottomWidth: 0,
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
                  this.state.productD.length > 24
                    ? this.state.productD.slice(0, 24) + '...'
                    : this.state.productD
                }
                selection
                dense={true}
                editable={false}
                // showSoftInputOnFocus={false}
                style={[
                  styles.input,
                  {
                    width: '100%',
                  },
                ]}
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
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'row',
                // backgroundColor: 'pink',
                marginTop: 8,
              }}>
              <TouchableOpacity onPress={() => this.cancelManu(flag)}>
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
                onPress={() =>
                  flag == 'add'
                    ? this.addManufacturer(
                        deviceData[0].select,
                        deviceData[0].selectId,
                      )
                    : this.editManufacturer(
                        deviceData[0].select,
                        deviceData[0].selectId,
                      )
                }
                disabled={
                  deviceData[0].selectId !== '' &&
                  this.state.selectDevices.length > 0
                    ? false
                    : true
                }>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: width * 0.045,
                    color:
                      deviceData[0].selectId !== '' &&
                      this.state.selectDevices.length > 0
                        ? '#25AAE1ec'
                        : 'grey',
                    width: width * 0.16,
                    textAlign: 'center',
                  }}>
                  {flag == 'add' ? 'Add' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {this.state.error.deviceId ? (
          <HelperText type="error" visible={this.state.error.deviceId}>
            {this.state.error.deviceId}
          </HelperText>
        ) : null}
      </View>
    );
  };

  editManufacturer = (manu, manuId) => {
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

    const {currentManuIndex} = this.state;
    let newArr = [...this.state.manufacturersArray];

    let newDevice = [...this.state.selectDevices]; // used for getting only name and id of devices

    newArr[currentManuIndex].name = manu;
    newArr[currentManuIndex].manu_Id = manuId;
    newArr[currentManuIndex].devices = newDevice;

    this.setState(
      {
        manufacturersArray: newArr,
        showEditManufacturer: false,
      },
      () => {
        const newD = newArr.map(({devices}) => devices.map(({id}) => id));
        this.setState({devIdsArr: newD.flat()}, () =>
          console.log(
            clc.greenBright('kia hai devices Ids'),
            this.state.devIdsArr,
          ),
        );
      },
    );
  };

  addManufacturer = (manu, manuId) => {
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

    const compareName = (obj1, obj2) => {
      return obj1.name === obj2.name;
    };

    let newArr = [...this.state.manufacturersArray]; // used for adding in the list
    let deviceArr = [...this.state.deviceData]; // used for clearing data
    // let newDevice = [...this.state.selectDevices]; // used for getting only name and id of devices

    console.log('Kia hai manu', manu, ' ', manuId);

    newArr.push({
      name: manu,
      manu_Id: manuId,
      devices: this.state.selectDevices,
    });

    deviceArr[0].select = '';
    deviceArr[0].selectId = '';

    deviceArr[0].data = deviceArr[0].data.filter((b) => {
      let indexFound = newArr.findIndex((a) => compareName(a, b));
      return indexFound === -1;
    });

    this.setState(
      {
        selectDevices: [],
        manufacturersArray: newArr,
        deviceData: deviceArr,
        showAddManufacturer: false,
      },
      () => {
        const newD = newArr.map(({devices}) => devices.map(({id}) => id));
        this.setState({devIdsArr: newD.flat()}, () =>
          console.log(
            clc.greenBright('kia hai devices Ids'),
            this.state.devIdsArr,
          ),
        );
        console.log(
          clc.cyan('kia ha Manu Arr'),
          JSON.stringify(this.state.manufacturersArray),
        );
      },
    );
  };

  doneAddType = async () => {
    console.log('Show Add Type', this.state.showAddType);
    if (this.state.showAddType == 'Manufacturer') {
      let data = {
        name: this.state.addManufacturer,
      };
      const ManufacturersResponse = await api.post(
        '/property/equipment/manufacturer/add',
        data,
      );
      if (ManufacturersResponse?.data?.bool) {
        // this.setState({loadManufacturers: true});
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
        this.getToken();
        this.cancelAddType();
      } else {
        alert(ManufacturersResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Model Number') {
      let data = {
        model_no: this.state.addModelNumber,
        device_id: this.state.selectedDevice?.id,
      };

      const ModelNumberResponse = await api.post(
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
        this.getToken();
        this.cancelAddType();
      }
    } else if (this.state.showAddType == 'Utility') {
      let data = {
        name: this.state.addUtility,
      };
      const UtilityResponse = await api.post(
        '/property/equipment/utility-type',
        data,
      );
      if (UtilityResponse?.data?.bool) {
        console.log('datachecckk-->>', UtilityResponse?.data?.data);
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
        this.getToken();
        this.cancelAddType();
        alert(UtilityResponse?.data?.message);
      } else {
        alert(UtilityResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Meter') {
      let data = {
        name: this.state.addMeter,
      };
      const MeterResponse = await api.post(
        '/property/equipment/meter/add-meter',
        data,
      );
      if (MeterResponse?.data?.bool) {
        console.log('datachecckk-->>', MeterResponse?.data?.data);
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
        this.getToken();
        this.cancelAddType();
        alert(MeterResponse?.data?.message);
      } else {
        alert(MeterResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Billing') {
      let data = {
        name: this.state.addBilling,
      };
      const BillingResponse = await api.post(
        '/property/billing-company/add',
        data,
      );
      if (BillingResponse?.data?.bool) {
        console.log('datachecckk-->>', BillingResponse?.data?.data);
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
        this.getToken();
        this.cancelAddType();
        alert(BillingResponse?.data?.message);
      } else {
        alert(BillingResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Management') {
      let data = {
        manager_name: this.state.addManagement,
      };
      console.log('Management Company data -->>', data);
      const ManagementResponse = await api.post(
        '/property/management-company/add',
        data,
      );
      console.log('Management Company-->>', ManagementResponse?.data?.data);
      if (ManagementResponse?.data?.bool) {
        console.log('datachecckk-->>', ManagementResponse?.data?.data);
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
        this.getToken();
        this.cancelAddType();
        alert(ManagementResponse?.data?.message);
      } else {
        alert(ManagementResponse?.data?.message);
      }
    } else {
      this.setState({modelArr: []});
      let data = {
        name: this.state.addDevice[2].select,
        manufacturer_id: this.state.addDevice[0].selectId,
        device_type_id: this.state.addDevice[1].selectId,
        model_nos: this.state.modelArr,
        product_desc: this.state.productNo,
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
        this.getToken();
        this.cancelAddType();
        alert(DeviceTypesResponse?.data?.message);
      } else {
        alert(DeviceTypesResponse?.data?.message);
      }
    }
  };

  setValue(callback) {
    this.setState((state) => ({
      value: callback(state),
    }));
    setTimeout(() => {
      console.log('--->value', this.state.value);
    }, 1000);
  }

  handleOpenDropDown = (value) => {
    this.setState({open: !this.state.open, companies: value});
  };

  handleDropDownData = (value) => {
    if (this.state.companies) {
      this.setState({BillingCompany: value.name, BillingCompanyId: value.id});
    } else {
      this.setState({
        managementCompany: value.manager_name,
        managementCompanyId: value.id,
      });
    }
    this.setState({open: !this.state.open});
  };

  handleCloseDropDown = () => {
    this.setState({BillingCompany: 'BILLING COMPANY'});
    this.setState({open: false});
  };

  moveMarker = (region, gesture) => {
    if (gesture.isGesture) {
      this.setState({lat: region?.latitude, latDelta: region?.latitudeDelta});
      this.setState({
        long: region?.longitude,
        longDelta: region?.longitudeDelta,
      });
    }

    var dis = getDistance(
      {
        latitude: this.state.iniLat,
        longitude: this.state.iniLong,
      },
      {
        latitude: region?.latitude,
        longitude: region?.longitude,
      },
    );
  };

  catchLocation = (region) => {
    this.setState({lat: region?.lat});
    this.setState({long: region?.lng});
  };

  fetchAddressData = (searchdata) => {
    console.log('SEARCH STR', searchdata);
    const searchStr = ',';
    var searchStrLen = searchStr.length;
    var startIndex = 0,
      index,
      indices = [];

    while ((index = searchdata.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    const Street = searchdata.slice(0, indices[0]);
    const City = searchdata.slice(indices[0] + 2, indices[1]);
    const State = searchdata.slice(indices[1] + 2, indices[1] + 4);
    const ZipCode = searchdata.slice(indices[1] + 5, indices[2]);

    console.log('DATA', indices);
    console.log('Street', Street);
    console.log('City', City);
    console.log('State', State);
    console.log('Zipcode', ZipCode);
    this.setState({Street: Street});
    this.setState({City: City});
    this.setState({State: State});
    this.setState({ZipCode: ZipCode});
  };

  selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    this.setState({selectLocation: true});
  };

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      this.setState({lat: lat, long: long});
    });
  };

  _renderMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Positon Batao', position);
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        this.setState({lat: lat, long: long, iniLat: lat, iniLong: long});

        this.setState({
          markers: [
            {
              coordinate: {
                latitude: lat,
                longitude: long,
              },
            },
          ],
        });
        console.log('What we Get', this.state.markers);
      },
      (error) => console.log('geo location', error),
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  turnLocationOn = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS == 'android') {
      SystemSetting.switchLocation();
    }
  };

  getAllDevices = async () => {
    console.log('get all Devices-->>>');
    const devicesResponse = await api.get(`/property/equipment/device/all/`);
    if (devicesResponse.ok) {
      console.log('cha;a', devicesResponse?.data?.data);
      this.setState({
        devicesArray: devicesResponse?.data?.data,
        enableDevice: true,
      });
    } else {
      alert('Something wrong');
    }
  };

  //* karna hai set
  getDevice = async (some, index) => {
    console.log('get devices--->');
    const deviceResponse = await api.get(
      `/property/equipment/device/all/${some?.id}`,
    );
    // setState((oldState) => ({
    //   ...oldState,
    //   devicesData: deviceResponse?.data?.data,
    // }));
    let listSlide = [...this.state.deviceData]; // copying the old datas array
    listSlide[index].select = some?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = some?.id; // replace e.target.value with whatever you want to change it to
    console.log('XX___--->>', some?.name);
    if (index == 0) {
      listSlide[1].data = deviceResponse?.data?.data;
      listSlide[1].selectId = '';
      listSlide[1].select = '';
      this.setState((prevState) => ({
        selectDevices: [],
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          deviceId: '',
        },
        productD: '',
      }));
    }
    if (index == 1) {
      const product_desc = some?.product_desc;
      const modelNos = some?.model_nos.map((item) => {
        const {model_no: name, ...rest} = item;
        return {name, ...rest};
      });
      listSlide[2].data = modelNos;
      listSlide[2].selectId = '';
      listSlide[2].select = '';
      this.setState((prevState) => ({
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          deviceId: '',
        },
        productD: '',
      }));
      this.setState({productD: product_desc});
      console.log(clc.cyanBright('product desc of device'), product_desc);
      console.log('DAEA of models', modelNos);
    }
    if (index == 2) {
      listSlide[2].selectId = some?.id;
      listSlide[2].select = some?.name;
    }
    this.setState({deviceData: listSlide});
  };

  //* karna hai set
  onChangeManufacturer = (e, index) => {
    let listSlide = [...this.state.deviceData]; // copying the old datas array

    //! for onchangeDevice

    if (index == 0) {
      listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[0].error = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = '';
      listSlide[1].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].error = ''; // replace e.target.value with whatever you want to change it to
      listSlide[2].select = '';
      listSlide[2].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[2].error = '';
    } else if (index == 1) {
      listSlide[2].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[2].select = '';
      listSlide[2].error = ''; // replace e.target.value with whatever you want to change it to
    } else if (index == 2) {
      listSlide[2].selectId = '';
      listSlide[2].select = '';
      listSlide[2].error = ''; // replace e.target.value with whatever you want to change it to
    }

    this.setState({deviceData: listSlide});
  };

  getToken = async () => {
    // setMeterListLoader(true);
    // this.setState({loadManufacturers: true, loadMeters: true});
    this.context.getBillingCompany();
    this.context.getManagementCompany();
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const res = await api.get('/property/equipment/meter/all-meters');

    let arr1 = res.data?.data;
    let arr2 = arr1.sort((a, b) => (a.name > b.name ? 1 : -1));
    // console.log('arr1--->', arr1);
    this.setState({meterList: arr2});
    // this.setState({loadMeters: false});

    const utilRes = await api.get('/property/equipment/utility-type');

    // console.log('arr1--->', utilRes);
    this.setState({utilTypes: utilRes?.data?.data});

    const ManufacturersResponse = await api.get(
      '/property/equipment/manufacturer/all',
    );

    let listSlide = [...this.state.deviceData]; // copying the old datas array
    listSlide[0].data = ManufacturersResponse?.data?.data;
    this.setState({deviceData: listSlide});
    // this.setState({loadManufacturers: false});

    let deviceDataManufacturer = [...this.state.addDevice]; // copying the old datas array
    deviceDataManufacturer[0].data = ManufacturersResponse?.data?.data;
    this.setState({addDevice: deviceDataManufacturer});

    const DeviceTypesResponse = await api.get(
      '/property/equipment/device-type/all',
    );

    let deviceData = [...this.state.addDevice]; // copying the old datas array
    deviceData[1].data = DeviceTypesResponse?.data?.data;
    this.setState({addDevice: deviceData});

    // const ModelNumberResponse = await api.get(
    //   '/property/equipment/model-number/number',
    // );

    // let modelDataDevice = [...this.state.deviceData];
    // modelDataDevice[2].data = ModelNumberResponse?.data?.data;
    // this.setState({deviceData: modelDataDevice});

    let filter = [];
    for (let i = 0; i < this.context.manageCompList.length; i++) {
      const data = {
        name: this.context.manageCompList[i].manager_name,
        id: this.context.manageCompList[i].id,
      };
      filter.push(data);
    }
    this.setState({manageCompList: filter});
    // console.log('filtered manage company list', filter);
  };

  AddTypes = (item, type) => {
    if (type == 'Meter') {
      console.log('ADD CHALA Meter', item);
      const items = this.state.selectMeters;
      items.push(item);
      // selectedTypes.current = items;
      this.setState({selectMeters: items}, () =>
        console.log(
          'Multi Meters list',
          clc.bgCyan(JSON.stringify(this.state.selectMeters)),
        ),
      );
      this.addMeterInNewArray(item);
    } else if (type == 'Utility') {
      console.log('ADD CHALA', item);
      const items = this.state.selectUtil;
      items.push(item);
      // selectedTypes.current = items;
      this.setState({selectUtil: items});
    } else if (type == 'Devices') {
      console.log('ADD CHALA', item);
      const items = [...this.state.selectDevices];
      items.push(item);
      // selectedTypes.current = items;
      this.setState({selectDevices: items}, () =>
        console.log(
          'what is the manufacturersArray',
          this.state.manufacturersArray,
        ),
      );
    } else if (type == 'Models') {
      if (item !== '') {
        console.log('ADD CHALA', item);
        const items = [...this.state.modelArr];
        items.push(item);
        this.setState({modelArr: items, modelNo: ''});
      }
    }
  };

  enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    this.getToken();
    Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');
    if (!location) {
      Alert.alert('Enable Loaction', 'Kindly TurnOn Location to Add Meter', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: this.turnLocationOn,
        },
      ]);
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          var lat = parseFloat(position.coords.latitude);
          var long = parseFloat(position.coords.longitude);
          this.setState({lat: lat, long: long});
          Geocoder.from({
            latitude: lat,
            longitude: long,
          })
            .then((json) => {
              var locationName = json.results[0].formatted_address;
              this.fetchAddressData(locationName);
              this.setState({
                locationBtn: locationName,
              });
            })
            .catch((error) => console.warn(error));
        },
        (error) => console.log('geo location', error),
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      );
      if (Platform.OS == 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then((result) => {
            if (result == RESULTS.GRANTED) {
              this.checkLocation(true);
            } else {
              this.checkLocation(false);
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
            this.checkLocation(true);
          } else {
            this.checkLocation(false);
          }
        } catch (err) {
          alert(err);
        }
      }
    }
  };

  showMoreFn = (indexx) => {
    this.setState({addNewType: false});
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
    this.state.dropDownShow.map((item, index) => {
      if (index == indexx) {
        let dropDownShow = [...this.state.dropDownShow];
        console.log('el --->', dropDownShow[index]);
        // let dropDownShow = [...this.state.dropDownShow];
        // let index = markers.findIndex(el => console.log('el--->',el));
        // dropDownShow[index] = { ...dropDownShow[index], key: false };
        dropDownShow[index].value = true;
        this.setState({dropDownShow});
      } else {
        let dropDownShow = [...this.state.dropDownShow];
        console.log('el --->', dropDownShow[index]);
        // let dropDownShow = [...this.state.dropDownShow];
        // let index = markers.findIndex(el => console.log('el--->',el));
        // dropDownShow[index] = { ...dropDownShow[index], key: false };
        dropDownShow[index].value = false;
        this.setState({dropDownShow});
      }
    });

    // let dropDownShow = [...this.state.dropDownShow];
    // // console.log('el index--->',index)
    // // let index = markers.findIndex(el => console.log('el--->',el));
    // dropDownShow[indexx] = true;
    // this.setState({ dropDownShow });
    // let dropDownShow = [...this.state.dropDownShow];
    // // let index = markers.findIndex(el => console.log('el--->',el));
    // dropDownShow[indexx] = { ...dropDownShow[indexx], key: true };
    // this.setState({ dropDownShow });
    // // const newArray = [...this.state.dropDownShow];
  };

  cancelManu = (flag) => {
    if (flag == 'add') {
      let deviceArr = [...this.state.deviceData]; // used for clearing data
      deviceArr[0].select = '';
      deviceArr[0].selectId = '';
      this.setState({deviceData: deviceArr, showAddManufacturer: false});
    } else {
      console.log('COUNT Final', this.state.count);
      this.setState({
        selectDevices: [],
        showEditManufacturer: false,
      });
    }
  };

  openEditManu = async (item, index) => {
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

    console.log('get devices---> Open Edit');
    const deviceResponse = await api.get(
      `/property/equipment/device/all/${item.manu_Id}`,
    );
    // let manuArr = [...this.state.manufacturersArray];
    let newArr = [...this.state.deviceData];

    newArr[0].select = item.name;
    newArr[0].selectId = item.manu_Id;
    newArr[1].data = deviceResponse?.data?.data;

    console.log('item.name', item.name);
    console.log('item.id', item.manu_Id);

    this.setState(
      {
        count: 0,
        deviceData: newArr,
        selectDevices: item.devices,
        currentManuIndex: index,
      },
      () => {
        this.setState({showEditManufacturer: true});
        console.log(
          clc.xterm(149)('Devices Array on Open Edit'),
          JSON.stringify(this.state.deviceData),
        );
      },
    );
  };

  openAddManu = () => {
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
    let newArr = [...this.state.deviceData];

    newArr[0].select = '';
    newArr[0].selectId = '';

    this.setState({
      count: 0,
      selectDevices: [],
      deviceData: newArr,
      showAddManufacturer: true,
    });
  };

  renderManufacturerList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.openEditManu(item, index)}
        style={{
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#787878',
          height: width * 0.1,
          width: width * 0.8,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
        <Text style={{color: '#787878'}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {loadManufacturers, loadMeters, deviceData} = this.state;

    return (
      <View style={styles.headingInner}>
        {this.state.loadScreen ? <Loader /> : null}
        <TouchableOpacity
          onPress={() => this.enableLocation()}
          style={styles.addBotton}>
          <Icon name="add" size={width * 0.06} color="black" maxOpacity={0.5} />
        </TouchableOpacity>
        <Properties
          name="home-city-outline"
          size={width * 0.08}
          color="white"
        />
        <Text style={styles.mainHeadiing}>Properties</Text>
        <KeyboardAvoidingView behavior="height">
          <Modal
            animationIn="slideInDown"
            animationOut="slideOutUp"
            coverScreen={true}
            statusBarTranslucent={true}
            style={{
              margin: 0,
              bottom: this.state.avoidKeyboard ? width * 0.5 : 0,
            }}
            isVisible={this.state.isModalAddPropVisible}>
            {this.state.selectLocation ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View
                  style={{
                    width: width * 0.9,
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
                      top: width * 0.16,
                      width: width * 0.72,
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        marginTop: width * 0.02,
                        marginLeft: width * 0.03,
                      }}>
                      RADIAL DISTANCE (KM)*
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: width * 0.01,
                      }}>
                      <Slider
                        style={{width: width * 0.55, height: width * 0.08}}
                        minimumValue={0.1}
                        maximumValue={1}
                        thumbTintColor="#25AAE1ec"
                        minimumTrackTintColor="#25AAE1ec"
                        maximumTrackTintColor="#000000"
                        value={Number(this.state.radialDis)}
                        onValueChange={(value) =>
                          this.setState({
                            radialDis: value.toString().slice(0, 3),
                          })
                        }
                        step={0.1}
                      />
                      <Text>{this.state.radialDis} KM</Text>
                    </View>
                  </View>
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
                      enablePoweredByContainer={false}
                      disableScroll={false}
                      onPress={(data, details) => {
                        this.catchLocation(details.geometry.location);
                        console.log('DETAILS', details);
                        this.fetchAddressData(details?.formatted_address);
                        this.setState({
                          locationBtn: details?.formatted_address,
                        });
                      }}
                      onFail={(error) => console.error(error)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => this.getCurrentLocation()}
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
                      bottom: width * 0.2,
                      right: width * 0.03,
                    }}>
                    <Icon size={width * 0.07} color="#fff" name={'gps-fixed'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        selectLocation: false,
                        locationSelected: true,
                      })
                    }
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
                      bottom: width * 0.04,
                      right: width * 0.03,
                    }}>
                    <Icon
                      size={width * 0.07}
                      color="#fff"
                      name={'navigate-next'}
                    />
                  </TouchableOpacity>

                  {this.state.markers.length > 0 && (
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
                  {this.state.markers.length > 0 ? (
                    <MapView
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'flex-end',
                        alignItems: 'center',

                        width: '100%',
                        height: '100%',
                        borderRadius: width * 0.03,
                      }}
                      region={{
                        latitude: this.state.lat,
                        longitude: this.state.long,
                        latitudeDelta: this.state.latDelta,
                        longitudeDelta: this.state.longDelta,
                      }}
                      zoomEnabled={true}
                      provider={PROVIDER_GOOGLE}
                      showsUserLocation={true}
                      showsMyLocationButton={false}
                      onRegionChangeComplete={(e, ges) =>
                        this.moveMarker(e, ges)
                      }
                      // onPress={(e) => this.getLocation(e)}
                    >
                      <Circle
                        center={{
                          latitude: this.state.lat,
                          longitude: this.state.long,
                        }}
                        radius={this.state.radialDis * 1000}
                        fillColor="rgba(12,170,225,0.3)"
                        strokeColor="rgba(12,170,225,1)"
                      />
                    </MapView>
                  ) : null}
                </View>
              </View>
            ) : (
              <View style={styles.modalInner}>
                <View style={styles.boxConatainer}>
                  <View style={styles.boxInner}>
                    {/* Box Header */}
                    <View style={styles.boxHeader}>
                      <View style={styles.boxHeaderInner}>
                        <Icon
                          name={'business'}
                          size={height * 0.05}
                          color="#5e5e5e"
                        />
                        <Text style={styles.modalHeading}>New Property</Text>
                        <Pressable
                          onPress={this.clearInputs}
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
                      style={{width: '90%'}}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}>
                      <View style={{flex: 1}}>
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(0)}>
                          <Text style={styles.desciptionHeading}>
                            information
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[0].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[0].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Enter Property Name*"
                            value={this.state.Name}
                            onChangeText={(text) => {
                              this.setState({Name: text});
                              this.setState((prevState) => ({
                                error: {
                                  // object that we want to update
                                  ...prevState.error, // keep all other key-value pairs
                                  property: '',
                                },
                              }));
                            }}
                            error={this.state.error.property}
                            style={[styles.input, {width: '99%'}]}
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
                        {this.state.error.property ? (
                          <HelperText
                            type="error"
                            visible={this.state.error.property}>
                            {this.state.error.property}
                          </HelperText>
                        ) : null}
                        {/* <View style={styles.inputContainer}>
                          <TextInput
                            placeholder="Enter Street*"
                            error={this.state.error.street}
                            value={this.state.Street}
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState({Street: text});
                              this.setState((prevState) => ({
                                error: {
                                  // object that we want to update
                                  ...prevState.error, // keep all other key-value pairs
                                  street: '',
                                },
                              }));
                            }}
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
                        {this.state.error.street ? (
                          <HelperText
                            type="error"
                            visible={this.state.error.street}>
                            {this.state.error.street}
                          </HelperText>
                        ) : null} */}
                        {/* <View style={styles.inputContainer}>
                          <TextInput
                            error={this.state.error.city}
                            placeholder="Enter City"
                            value={this.state.City}
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState({City: text});
                            }}
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
                        {/* <View
                          style={[
                            styles.inputContainer,
                            {
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            },
                          ]}>
                          <TextInput
                            error={this.state.error.st}
                            placeholder="Enter State"
                            value={this.state.State}
                            style={[styles.input, {width: width * 0.36}]}
                            onChangeText={(text) => {
                              this.setState({State: text});
                            }}
                            mode={'outlined'}
                            theme={{
                              colors: {
                                text: '#25AAE1ec',
                                primary: '#25AAE1ec',
                                selectionColor: 'red',
                              },
                            }}
                          />

                          <TextInput
                            error={this.state.error.zipcode}
                            placeholder="Enter Zipcode"
                            value={this.state.ZipCode}
                            style={[styles.input, {width: width * 0.36}]}
                            onChangeText={(text) => {
                              this.setState({ZipCode: text});
                            }}
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
                        {/* <View
                        style={{
                          flex: 1,
                          zIndex: 1,
                          position: 'absolute',
                          padding: 10,
                          width: width * 0.52,
                          // paddingTop: Constants.statusBarHeight + 10,
                          backgroundColor: '#ecf0f1',
                        }}>
                        <GooglePlacesAutocomplete
                          placeholder="Address"
                          query={{
                            key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                            language: 'en', // language of the results
                          }}
                          onPress={(data, details = null) => console.log(data)}
                          onFail={(error) => console.error(error)}
                        />
                      </View> */}
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[0].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={this.selectMeterLocation}
                            style={{
                              width: width * 0.8,
                              // height: width * 0.1,
                              borderColor: '#25AAE1ec',
                              borderWidth: width * 0.003,
                              backgroundColor: 'white',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderRadius: width * 0.005,
                              paddingVertical: width * 0.02,
                              paddingHorizontal: width * 0.02,
                              flexDirection: 'row',
                              marginVertical: width * 0.015,
                              elevation: width * 0.003,
                            }}>
                            <Text
                              style={{
                                fontSize: width * 0.03,
                                fontFamily: Fonts.Montserrat,
                                color: '#3E4A4F',
                                marginRight: width * 0.01,
                              }}>
                              {this.state.locationBtn}
                            </Text>
                            <Iconi
                              name="location"
                              size={width * 0.05}
                              color="#3E4A4F"
                            />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(2)}>
                          <Text style={styles.desciptionHeading}>
                            Utility Type Info
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[2].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            width: '100%',
                            zIndex: 2,
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginTop: width * 0.02,
                            height: this.state.dropDownShow[2].value
                              ? height * 0.16
                              : height * 0.0,
                            overflow: 'hidden',
                          }}>
                          {this.state.addNewType &&
                          this.state.showAddType == 'Utility' ? (
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.03,
                                    color: '#3E4A4F',
                                    textTransform: 'capitalize',
                                    fontFamily: Fonts.ComfortaaRegular,
                                    marginBottom: width * 0.01,
                                    fontWeight: 'bold',
                                  }}>
                                  Add New {this.state.showAddType} Type
                                </Text>
                              </View>
                              <TextInput
                                placeholder={'Type New Utility Type Name'}
                                value={this.state.addUtility}
                                style={{
                                  width: width * 0.8,
                                  justifyContent: 'flex-end',
                                  fontSize: width * 0.036,
                                }}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                                onChangeText={(text) => {
                                  this.setState({addUtility: text});
                                }}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.cancelAddType()}>
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
                                  onPress={() => this.doneAddType()}
                                  disabled={
                                    this.state.addUtility ? false : true
                                  }>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: width * 0.045,
                                      color: this.state.addUtility
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
                          ) : (
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                }}>
                                <SearchableDropDown
                                  multi={true}
                                  selectedItems={this.state.selectUtil}
                                  onItemSelect={(item) => {
                                    console.log('Test', item);
                                    this.AddTypes(item, 'Utility');
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
                                  items={this.state.utilTypes}
                                  onRemoveItem={(item, index) => {
                                    const items = this.state.selectUtil.filter(
                                      (sitem) => sitem.id !== item.id,
                                    );
                                    // selectedTypes.current = items;
                                    this.setState({selectUtil: items});
                                  }}
                                  resetValue={false}
                                  textInputProps={{
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
                                  onPress={() =>
                                    this.showAddNewType('Utility')
                                  }>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View>
                                <FlatList
                                  data={this.state.selectUtil}
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
                                        onPress={() => {
                                          const items = this.state.selectUtil.filter(
                                            (sitem) => sitem.id !== item.id,
                                          );
                                          this.setState({selectUtil: items});
                                        }}>
                                        <Icon
                                          name="close"
                                          size={width * 0.05}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                        {this.state.error.utilType ? (
                          <HelperText
                            type="error"
                            visible={this.state.error.utilType}>
                            {this.state.error.utilType}
                          </HelperText>
                        ) : null}
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(1)}>
                          <Text style={styles.desciptionHeading}>
                            Point of Entry
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[1].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            width: '100%',
                            zIndex: 2,
                            alignSelf: 'center',
                            // justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: width * 0.02,
                            height: this.state.dropDownShow[1].value
                              ? height * 0.16
                              : height * 0.0,
                            overflow: 'hidden',
                          }}>
                          {this.state.addNewType &&
                          this.state.showAddType == 'Meter' ? (
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.03,
                                    color: '#3E4A4F',
                                    textTransform: 'capitalize',
                                    fontFamily: Fonts.ComfortaaRegular,
                                    marginBottom: width * 0.01,
                                    fontWeight: 'bold',
                                  }}>
                                  Add New {this.state.showAddType} type
                                </Text>
                              </View>
                              <TextInput
                                placeholder={'Type New Meter Type Name'}
                                value={this.state.addMeter}
                                style={{
                                  width: width * 0.8,
                                  justifyContent: 'flex-end',
                                  fontSize: width * 0.036,
                                }}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                                onChangeText={(text) => {
                                  this.setState({addMeter: text});
                                }}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.cancelAddType()}>
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
                                  onPress={() => this.doneAddType()}
                                  disabled={this.state.addMeter ? false : true}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: width * 0.045,
                                      color: this.state.addMeter
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
                          ) : (
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                }}>
                                <SearchableDropDown
                                  multi={true}
                                  selectedItems={this.state.selectMeters}
                                  onItemSelect={(item) => {
                                    console.log('Testing', item);
                                    this.AddTypes(item, 'Meter');
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
                                  items={this.state.meterList}
                                  onRemoveItem={(item, index) => {
                                    const items = this.state.selectMeters.filter(
                                      (sitem) => sitem.id !== item.id,
                                    );

                                    this.setState({selectMeters: items});
                                  }}
                                  resetValue={false}
                                  textInputProps={{
                                    placeholder: 'Select Meter Type',
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
                                    //   this.setState({selectMeter: text});
                                    // },
                                    // value: this.state.selectMeter,
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
                                  onPress={() => this.showAddNewType('Meter')}>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View>
                                <FlatList
                                  data={this.state.selectMeters}
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
                                        onPress={() => {
                                          const items = this.state.selectMeters.filter(
                                            (sitem) => sitem.id !== item.id,
                                          );
                                          this.setState({
                                            selectMeters: items,
                                          });
                                        }}>
                                        <Icon
                                          name="close"
                                          size={width * 0.05}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                        {this.state.error.meterId ? (
                          <HelperText
                            type="error"
                            visible={this.state.error.meterId}>
                            {this.state.error.meterId}
                          </HelperText>
                        ) : null}
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(3)}>
                          <Text style={styles.desciptionHeading}>
                            device Type Info
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[3].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        {/*
                         //! multi-manufacturer
                        */}
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          nestedScrollEnabled>
                          <View
                            style={{
                              // height: height * 0.25,
                              width: '100%',
                              alignSelf: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                              // justifyContent: 'center',
                              zIndex: 2,
                              height: this.state.dropDownShow[3].value
                                ? this.state.showAddManufacturer ||
                                  this.state.showEditManufacturer
                                  ? height * 0.5
                                  : this.state.manufacturersArray.length > 0
                                  ? height * 0.25
                                  : height * 0.15
                                : height * 0.0,
                              overflow: 'hidden',
                              // backgroundColor: 'tomato',
                            }}>
                            {!this.state.showAddManufacturer &&
                              !this.state.showEditManufacturer && (
                                <View style={{paddingVertical: 10}}>
                                  {this.state.manufacturersArray.length > 0 && (
                                    <FlatList
                                      data={this.state.manufacturersArray}
                                      renderItem={this.renderManufacturerList}
                                    />
                                  )}
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.openAddManu();
                                    }}
                                    style={{
                                      alignSelf: 'center',
                                      backgroundColor: '#fff',
                                      borderWidth: 2,
                                      borderColor: '#25AAE1ec',
                                      height: width * 0.1,
                                      width: width * 0.8,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Text style={{color: '#25AAE1ec'}}>
                                      Add Manufacturer
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            {this.state.showAddManufacturer &&
                              this.deviceTypeInfoComponent('add')}
                            {this.state.showEditManufacturer &&
                              this.deviceTypeInfoComponent('edit')}
                          </View>
                        </ScrollView>
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(4)}>
                          <Text style={styles.desciptionHeading}>owner</Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[4].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[4].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Company Specific ID"
                            style={styles.input}
                            value={this.state.CustomId}
                            onChangeText={(text) => {
                              this.setState({CustomId: text});
                            }}
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

                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[4].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Customer Name"
                            style={styles.input}
                            value={this.state.CustomerName}
                            onChangeText={(text) => {
                              this.setState({CustomerName: text});
                            }}
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
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[4].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Title / Job Description"
                            style={styles.input}
                            value={this.state.customerjobDes}
                            onChangeText={(text) => {
                              this.setState({customerjobDes: text});
                            }}
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
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[4].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Phone"
                            style={styles.input}
                            value={this.state.customerPhone}
                            onChangeText={(text) => {
                              this.setState({customerPhone: text});
                            }}
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
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              height: this.state.dropDownShow[4].value
                                ? height * 0.09
                                : height * 0.0,
                              overflow: 'hidden',
                            },
                          ]}>
                          <TextInput
                            placeholder="Email"
                            style={styles.input}
                            value={this.state.customerEmail}
                            onChangeText={(text) => {
                              this.setState({customerEmail: text});
                            }}
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
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(5)}>
                          <Text style={styles.desciptionHeading}>
                            management company
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[5].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            width: '100%',
                            zIndex: 2,
                            alignSelf: 'center',
                            alignItems: 'center',
                            height: this.state.dropDownShow[5].value
                              ? height * 0.16
                              : height * 0.0,
                            overflow: 'hidden',
                          }}>
                          {this.state.addNewType &&
                          this.state.showAddType == 'Management' ? (
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.03,
                                    color: '#3E4A4F',
                                    textTransform: 'capitalize',
                                    fontFamily: Fonts.ComfortaaRegular,
                                    marginBottom: width * 0.01,
                                    fontWeight: 'bold',
                                  }}>
                                  Add New {this.state.showAddType} Company
                                </Text>
                              </View>
                              <TextInput
                                placeholder={'Type New Management Company Name'}
                                value={this.state.addManagement}
                                style={{
                                  width: width * 0.8,
                                  justifyContent: 'flex-end',
                                  fontSize: width * 0.036,
                                }}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                                onChangeText={(text) => {
                                  this.setState({addManagement: text});
                                }}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.cancelAddType()}>
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
                                  onPress={() => this.doneAddType()}
                                  disabled={
                                    this.state.addManagement ? false : true
                                  }>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: width * 0.045,
                                      color: this.state.addManagement
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
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                              }}>
                              {/* <TouchableOpacity
                          onPress={() => this.handleOpenDropDown(false)}
                          style={{
                            ...styles.billingCompanyBtn,
                          }}>
                          <Text>{this.state.managementCompany}</Text>
                        </TouchableOpacity> */}
                              <SearchableDropDown
                                onItemSelect={(item) => {
                                  this.setState({
                                    managementCompany: item.name,
                                    managementCompanyId: item.id,
                                  });
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
                                  zIndex: 99,
                                }}
                                itemTextStyle={{color: '#222'}}
                                itemsContainerStyle={{
                                  maxHeight: height * 0.08,
                                }}
                                items={this.state.manageCompList}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Management Company',
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    backgroundColor: 'rgb(247, 247, 247)',
                                    borderColor: '#bbb',
                                    borderWidth: width * 0.0015,
                                    borderRadius: width * 0.015,
                                    zIndex: 99,
                                  },
                                }}
                                itemTextStyle={{color: '#222'}}
                                itemsContainerStyle={{
                                  maxHeight: height * 0.08,
                                }}
                                items={this.state.manageCompList}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Management Company',
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
                                    zIndex: 0,
                                  },
                                  onTextChange: (text) => {
                                    this.setState({managementCompany: text});
                                  },
                                  value: setTimeout(
                                    () => this.state.managementCompany,
                                    200,
                                  ),
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
                                onPress={() =>
                                  this.showAddNewType('Management')
                                }>
                                <Icon
                                  size={width * 0.06}
                                  color="#fff"
                                  name={'add'}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.desciptionContainer}
                          onPress={() => this.showMoreFn(6)}>
                          <Text style={styles.desciptionHeading}>
                            billing company
                          </Text>
                          <Iconi
                            name={
                              this.state.dropDownShow[6].value
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            width: '100%',
                            zIndex: 2,
                            alignSelf: 'center',
                            alignItems: 'center',
                            height: this.state.dropDownShow[6].value
                              ? height * 0.16
                              : height * 0.0,
                            overflow: 'hidden',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                            }}>
                            {/* <TouchableOpacity
                          onPress={() => this.handleOpenDropDown(true)}
                          style={{
                            ...styles.billingCompanyBtn,
                          }}>
                          <Text>{this.state.BillingCompany}</Text>
                        </TouchableOpacity> */}
                            {this.state.addNewType &&
                            this.state.showAddType == 'Billing' ? (
                              <View>
                                <View>
                                  <Text
                                    style={{
                                      fontSize: width * 0.03,
                                      color: '#3E4A4F',
                                      textTransform: 'capitalize',
                                      fontFamily: Fonts.ComfortaaRegular,
                                      marginBottom: width * 0.01,
                                      fontWeight: 'bold',
                                    }}>
                                    Add New {this.state.showAddType} Company
                                  </Text>
                                </View>
                                <TextInput
                                  placeholder={'Type New Billing Company Name'}
                                  value={this.state.addBilling}
                                  style={{
                                    width: width * 0.8,
                                    justifyContent: 'flex-end',
                                    fontSize: width * 0.036,
                                  }}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                    },
                                  }}
                                  onChangeText={(text) => {
                                    this.setState({addBilling: text});
                                  }}
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => this.cancelAddType()}>
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
                                    onPress={() => this.doneAddType()}
                                    disabled={
                                      this.state.addBilling ? false : true
                                    }>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: width * 0.045,
                                        color: this.state.addBilling
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
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'flex-start',
                                }}>
                                <SearchableDropDown
                                  onItemSelect={(item) => {
                                    this.setState({
                                      BillingCompany: item.name,
                                      BillingCompanyId: item.id,
                                    });
                                    // console.log('kia mila', item);
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
                                    zIndex: 99,
                                  }}
                                  itemTextStyle={{color: '#222'}}
                                  itemsContainerStyle={{
                                    maxHeight: height * 0.08,
                                  }}
                                  items={this.context.propitemList}
                                  resetValue={false}
                                  textInputProps={{
                                    placeholder: 'Billing Company',
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
                                      zIndex: 0,
                                    },
                                    onTextChange: (text) => {
                                      this.setState({BillingCompany: text});
                                    },
                                    value: setTimeout(
                                      () => this.state.BillingCompany,
                                      200,
                                    ),

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
                                  onPress={() =>
                                    this.showAddNewType('Billing')
                                  }>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                            {/* <Modal
                          animationIn="fadeIn"
                          animationOut="fadeOut"
                          isVisible={this.state.open}
                          style={styles.billingModalContainer}>
                          <View style={styles.billingModalInner}>
                            <View style={styles.billingModalHeader}>
                              <Text style={styles.billingModalHeading}>
                                {this.state.companies
                                  ? 'Billing Companies'
                                  : 'Management Companies'}
                              </Text>
                              <Pressable
                                onPress={this.handleCloseDropDown}
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
                            {this.context.propitemList &&
                              this.state.companies &&
                              this.context.propitemList.map((data) => (
                                <TouchableOpacity
                                  onPress={() => this.handleDropDownData(data)}
                                  style={styles.billingCompanies}>
                                  <Text>{data.name}</Text>
                                </TouchableOpacity>
                              ))}

                            {this.context.manageCompList &&
                              !this.state.companies &&
                              this.context.manageCompList.map((data) => (
                                <TouchableOpacity
                                  onPress={() => this.handleDropDownData(data)}
                                  style={styles.billingCompanies}>
                                  <Text>{data.manager_name}</Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        </Modal> */}
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                    {/* Box Header */}
                    <View style={styles.boxHeader}>
                      <View style={styles.bottonContainer}>
                        <FAB
                          onPress={this.addProperty}
                          style={styles.submitBotton}
                          color="white"
                          icon="check"
                          label={'Add property'}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Modal>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
