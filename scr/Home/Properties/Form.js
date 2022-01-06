import React, {Component, version} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Pressable,
  Alert,
  FlatList,
} from 'react-native';

//Packages

import Iconi from 'react-native-vector-icons/Ionicons';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../components/Loader';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
import Base_URL from '../../api/WebServices';

import Modal from 'react-native-modal';
import SystemSetting from 'react-native-system-setting';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';
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
const {width, height} = Dimensions.get('window');

const api = create({Base_URL});
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Splash extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isVisible: false,
      Name: '',
      Street: '',
      State: '',
      City: '',
      ZipCode: '',
      BillComp: 'ION',
      ManageComp: '',
      CustomId: '',
      CustomerName: '',
      customerjobDes: '',
      customerPhone: '',
      customerEmail: '',
      ContactName: '',
      ContactTitle: '',
      ContactPhone: '',
      ContactEmail: '',
      newMeter: '',
      city: '',
      st: '',
      street: '',
      zipCode: '',
      selectLocation: false,
      locationSelected: false,
      markers: [],
      lat: 0,
      long: 0,
      loadScreen: false,
      open: false,
      meterList: [],
      BillingCompany: 'BILLING COMPANY*',
      BillingCompanyId: '',
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
        billingId: '',
        propertyId: '',
        street: '',
        city: '',
        zipcode: '',
        st: '',
      },
      value: '',
      items: [
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'},
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.setValue = this.setValue.bind(this);
  }

  toggleModalAddProp = () => {
    this.setState({isModalAddPropVisible: !this.state.isModalAddPropVisible});
  };

  renderMeterInfo = ({item}) => {
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
          // onPress={() => addMeterInNewArray(item)}
        >
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
            {/* {item.id == this.state.newMeter.id ? (
              <Iconi
                name="radio-button-on"
                size={width * 0.05}
                color="#25AAE1ec"
              />
            ) : (
              )} */}
            <Iconi name="radio-button-off" size={width * 0.05} color="black" />
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
      BillComp: '',
      ManageComp: '',
      CustomId: '',
      CustomerName: '',
      customerjobDes: '',
      customerPhone: '',
      customerEmail: '',
      ContactName: '',
      ContactTitle: '',
      ContactPhone: '',
      ContactEmail: '',
      BillingCompanyId: '',
      BillingCompany: 'BILLING COMPANY',
      error: '',
      lat: null,
      long: null,
      locationSelected: false,
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

  addProperty = () => {
    console.log('kiya Mila', this.state.Name);
    if (!this.state.Name) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: 'Invalid Property', // update the value of specific key
        },
      }));
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
    if (!this.state.locationSelected) {
      Alert.alert('Location Required', 'Please Select Property Location');
      return;
    } else {
      this.setState({locationSelected: false});
    }
    if (!this.state.BillingCompanyId) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: 'Select Billing Company', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: '', // update the value of specific key
        },
      }));
    }
    if (this.state.CustomId === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          propertyId: 'Invalid custom id', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          ...prevState.error, // keep all other key-value pairs
          propertyId: '', // update the value of specific key
        },
      }));
      console.log('Before', this.state.info.propName);
      // const info = { ...this.state.info, propName: 'Good HAI' }
      this.setState(
        Object.assign(this.state.info, {
          propName: this.state.Name,
          propStreet: this.state.Street,
          propState: this.state.State,
          propCity: this.state.City,
          propZipCode: this.state.ZipCode,
          propBillCompId: this.state.BillingCompanyId,
          propManageComp: this.state.ManageComp,
          propCustomId: this.state.CustomId,
          propBillComp: this.state.BillingCompany,
          propContactName: this.state.ContactName,
          propContactTitle: this.state.ContactTitle,
          propContactPhone: this.state.ContactPhone,
          propContactEmail: this.state.ContactEmail,
          propLat: this.state.lat,
          propLong: this.state.long,
        }),
        () => this.props.loader(true),
      );
      this.context.addProp(this.state.info);
      this.clearInputs();
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

  handleOpenDropDown = () => {
    this.context.getBillingCompany();
    this.setState({open: !this.state.open});
  };

  handleDropDownData = (value) => {
    this.setState({BillingCompany: value.name, BillingCompanyId: value.id});
    this.setState({open: !this.state.open});
    this.setState((prevState) => ({
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        billingId: '',
      },
    }));
  };

  handleCloseDropDown = () => {
    this.setState({BillingCompany: 'BILLING COMPANY'});
    this.setState({open: false});
  };

  moveMarker = (region) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({lat: region?.latitude});
      this.setState({long: region?.longitude});
    }, 200);
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
        this.setState({lat: lat, long: long});
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        // this.setState({initialPosition: initialRegion});
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

  getToken = async () => {
    // setMeterListLoader(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const res = await api.get('/property/equipment/meter/all-meters');

    let arr1 = res.data?.data;
    // let arr2 = arr1.sort((a, b) => (a.name > b.name ? 1 : -1));
    console.log('arr1--->', res);
    // console.log('arr2--->', arr2);
    // console.log('antiIntersection arr1--->', arr1);
    // console.log('antiIntersection arr2--->', arr2);

    // const antiIntersection = arr1.filter(
    //   (item1) => !arr2.some((item2) => item1.id == item2.meter_id),
    // );
    // console.log('antiIntersection--->', antiIntersection);
    // this.setState({meterList: arr2});

    // setMeterListLoader(false);
  };

  enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    this.getToken();

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

  render() {
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
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          coverScreen={true}
          statusBarTranslucent={true}
          style={{
            margin: 0,
          }}
          isVisible={this.state.isModalAddPropVisible}>
          {this.state.selectLocation ? (
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
                  // padding: 10,
                  top: width * 0.04,
                  width: width * 0.72,
                  // paddingTop: Constants.statusBarHeight + 10,
                  // backgroundColor: '#ecf0f1',
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
                  this.setState({selectLocation: false, locationSelected: true})
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
                <Icon size={width * 0.07} color="#fff" name={'navigate-next'} />
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
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: width * 0.3,
                  }}>
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
                    // scrollEnabled={false}
                    // initialRegion={{
                    //   latitude: this.state.lat,
                    //   longitude: this.state.long,
                    //   latitudeDelta: LATITUDE_DELTA,
                    //   longitudeDelta: LONGITUDE_DELTA,
                    // }}
                    region={{
                      latitude: this.state.lat,
                      longitude: this.state.long,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                    zoomEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    onRegionChange={(e) => this.moveMarker(e)}
                    // onPress={(e) => this.getLocation(e)}
                  ></MapView>
                </View>
              ) : null}
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
                    style={{height: height * 0.6}}
                    showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1}}>
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>
                          information
                        </Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Enter Property Name*"
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
                      {this.state.error.property ? (
                        <HelperText
                          type="error"
                          visible={this.state.error.property}>
                          {this.state.error.property}
                        </HelperText>
                      ) : null}
                      <View style={styles.inputContainer}>
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
                      ) : null}
                      <View style={styles.inputContainer}>
                        <TextInput
                          error={this.state.error.st}
                          placeholder="Enter State"
                          value={this.state.State}
                          style={styles.input}
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
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          },
                        ]}>
                        <TextInput
                          error={this.state.error.city}
                          placeholder="Enter City"
                          value={this.state.City}
                          style={[styles.input, {width: width * 0.36}]}
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
                      </View>
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
                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          onPress={this.selectMeterLocation}
                          style={{
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
                          }}>
                          <Text
                            style={{
                              fontSize: width * 0.03,
                              fontFamily: Fonts.Montserrat,
                              color: '#3E4A4F',
                              marginRight: width * 0.01,
                            }}>
                            Select Location
                          </Text>
                          <Iconi
                            name="location"
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>
                          meter Type Info
                        </Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <View
                          style={{
                            height: height * 0.2,
                            marginVertical: height * 0.025,
                          }}>
                          <FlatList
                            contentContainerStyle={{
                              justifyContent: 'center',
                            }}
                            data={this.state.meterList}
                            renderItem={this.renderMeterInfo}
                          />
                        </View>
                      </View>
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>
                          device Type Info
                        </Text>
                      </View>
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>owner</Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Company Specific ID"
                          error={this.state.error.propertyId}
                          style={styles.input}
                          onChangeText={(text) => {
                            this.setState({CustomId: text});
                            this.setState((prevState) => ({
                              error: {
                                // object that we want to update
                                ...prevState.error, // keep all other key-value pairs
                                propertyId: '',
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
                      {this.state.error.propertyId ? (
                        <HelperText
                          type="error"
                          visible={this.state.error.propertyId}>
                          {this.state.error.propertyId}
                        </HelperText>
                      ) : null}
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Customer Name"
                          style={styles.input}
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
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Title / Job Description"
                          style={styles.input}
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
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Phone"
                          style={styles.input}
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
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="Email"
                          style={styles.input}
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
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>
                          management company
                        </Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          style={{
                            ...styles.billingCompanyBtn,
                            borderColor: this.state.error.billingId
                              ? '#A3001B'
                              : 'gray',
                          }}>
                          <Text>MANAGEMENT COMPANY</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.desciptionContainer}>
                        <Text style={styles.desciptionHeading}>
                          billing company
                        </Text>
                      </View>
                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          onPress={this.handleOpenDropDown}
                          style={{
                            ...styles.billingCompanyBtn,
                            borderColor: this.state.error.billingId
                              ? '#A3001B'
                              : 'gray',
                          }}>
                          <Text>{this.state.BillingCompany}</Text>
                        </TouchableOpacity>
                        <Modal
                          animationIn="fadeIn"
                          animationOut="fadeOut"
                          isVisible={this.state.open}
                          style={styles.billingModalContainer}>
                          <View style={styles.billingModalInner}>
                            <View style={styles.billingModalHeader}>
                              <Text style={styles.billingModalHeading}>
                                Billing Companies
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
                              this.context.propitemList.map((data) => (
                                <TouchableOpacity
                                  onPress={() => this.handleDropDownData(data)}
                                  style={styles.billingCompanies}>
                                  <Text>{data.name}</Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        </Modal>
                      </View>
                      {this.state.error.billingId ? (
                        <HelperText
                          type="error"
                          visible={this.state.error.billingId}>
                          {this.state.error.billingId}
                        </HelperText>
                      ) : null}
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
                        label="Add property"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Modal>
      </View>
    );
  }
}
