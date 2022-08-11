import React from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  UIManager,
  Pressable,
  Alert,
  Platform,
  ToastAndroid,
  Image,
  LayoutAnimation,
  PermissionsAndroid,
} from 'react-native';

//Packages
import EncryptedStorage from 'react-native-encrypted-storage';
import Menu from 'react-native-vector-icons/Entypo';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Locate from 'react-native-vector-icons/Feather';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Folder from 'react-native-vector-icons/Feather';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {VictoryPie} from 'victory-native';
import Drawer from '../../../components/modal/Drawer/index';
import ContextProp from '../Context/propContext';
import {TextInput, FAB, HelperText} from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

// Components
import styles from './style';
import {Fonts} from '../../../utils/fonts';
import CustumStatusBar from '../../../components/StatusBar';
import Loader from '../../../components/Loader';
import AddEditProperty from '../../../components/modal/AddEditProperty';
import SystemSetting from 'react-native-system-setting';
import API from '../../../api/SeviceApi';
import { connect } from 'react-redux';
import { fetchPropetry } from '../../../Store/Action/properties.action';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

 class Details extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      propertyData: null,
      propertyflag: false,
      isModalVisible: false,
      isEditPropVisible: false,
      points: 80,
      onlineUnits: 0,
      offlineUnits: 0,
      notInstalledUnits: 0,
      isLoading: false,
      addNewType: false,
      showAddType: '',
      propertyId: null,
      loadingStateManage: false,
      listData: {},
      utilTypes: [],
      manus: [],
      ownerData: [],
      locationBtn: '',
      addBilling: '',
      BillingCompany: 'BILLING COMPANY',
      BillingCompanyId: null,
      addManagement: '',
      managementCompany: 'MANAGEMENT COMPANY',
      managementCompanyId: '',
      customId: 0,
      companies: false,
      companiesLoader: false,
      selectLocation: false,
      selectAddManuUtil: [],
      unitMixes: [],
      tpanelData: [],
      tBunchData: null,
      sumNoOfUnits: 0,
      sumTotalGalDay: 0,
      meterCount: 0,
      installStatus: 0,
      lat: 0,
      long: 0,
      markers: [],
      propMarkers: [],
      error: {
        property: '',
        property_id: '',
        street: '',
        city: '',
        zipcode: '',
      },
      dropDownShow: [
        {value: true},
        {value: false},
        {value: false},
        {value: false},
        {value: false},
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');

    const propertyData = this.props.navigation.state.params.item.item;
    this.getPropertyDetails(propertyData?.id);
    this.getMetersLocation(propertyData?.id);
    this.getTpanelData(propertyData?.id);
    this.getBunchData(propertyData?.id)
  }

  getTpanelData = async (id) => {
    const tPanelRes = await API.get(`/property/tpanel/${id}`);
    console.log('TPANEL DATA', tPanelRes?.data?.data);
    if (tPanelRes?.data?.bool) {
      this.setState({
        tpanelData: tPanelRes?.data?.data?.unit,
      });
    }
  };

  getBunchData = async (id) => {
    const tBunchRes = await API.get(`/property/details-bunch/${id}`);
    console.log('TBunch DATA', tBunchRes?.data?.data);
    if (tBunchRes?.data?.bool) {
      this.setState({
        tBunchData: tBunchRes?.data?.data,
      });
    }
  };

  getPropertyDetails = async (id) => {
    this.setState({ isLoading: true });

    const propertyRes = await API.get(`/property/${id}`);
    console.log("propertyRes propertyRes", propertyRes)
    const currPropData = propertyRes?.data?.data?.property;
    const utilityManufacturersArr =
      propertyRes?.data?.data?.property?.utility_manufacturers;

    let utilTypes = [];
    let manus = [];
    utilityManufacturersArr.filter((item) => {
      utilTypes.push(item.utility_type.name);
      manus.push(item.manufacturer.name);
    });

    this.setState({utilTypes, manus});

    console.log('UTILITY TYPES', utilTypes);
    console.log('MANUFACTURERS', manus);

    let uMdata = currPropData.unit_mixes;
    let nOU = 0;
    let tGD = 0;

    for (let i = 0; i < uMdata?.length; i++) {
      const singleTGD = uMdata[i].no_of_units * uMdata[i].gud;
      nOU = nOU + Number(uMdata[i].no_of_units);
      tGD = tGD + Number(singleTGD);
    }

    this.setState({
      listData: currPropData,
      propertyData: currPropData,
      propertyId: currPropData?.id,
      lat: currPropData?.latitude,
      long: currPropData?.longitude,
      BillingCompany: currPropData?.billing_company,
      BillingCompanyId: currPropData?.billing_company_id,
      managementCompany: currPropData?.management_company,
      managementCompanyId: currPropData?.management_company_id,
      customId: currPropData?.custom_id,
      isLoading: false,
      unitMixes: currPropData?.unit_mixes,
      sumNoOfUnits: nOU,
      sumTotalGalDay: tGD,
      meterCount: currPropData?.unit_mixes[0]?.meters.count,
      installStatus:
        currPropData?.unit_mixes[0]?.meters.complete +
        '/' +
        currPropData?.unit_mixes[0]?.meters.count,
    });

    const transceiverRes = await API.get(`/property/transceivers/${id}`);

    if (transceiverRes?.data?.bool) {
      this.setState({
        onlineUnits: transceiverRes?.data?.data?.installs[0],
        offlineUnits: transceiverRes?.data?.data?.installs[1],
        notInstalledUnits: transceiverRes?.data?.data?.installs[2],
      });
    }

    var lat = parseFloat(currPropData.latitude);
    var long = parseFloat(currPropData.longitude);
    Geocoder.from({
      latitude: lat,
      longitude: long,
    })
      .then((json) => {
        var locationName = json.results[0].formatted_address;
        this.setState({
          locationBtn: locationName,
        });
      })
      .catch((error) => console.warn(error));
  };

  getMetersLocation = async (propertyId) => {
    this.setState({isLoading: true});
    const metersLocation = await API.get(
      `/property/location-meters/${propertyId}`,
    );
    if (metersLocation?.data?.bool) {
      this.setState({markers: metersLocation?.data?.data, isLoading: false});
      let index = metersLocation?.data?.data?.length - 1;
      this.setState({
        propMarkers: metersLocation?.data?.data[index]?.property?.position,
      });
    }
  };

  getBack = () => {
    this.props.navigation.navigate('Properties');
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  enableLocation = async () => {
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
      // this.getPropertyDetails(this.state.propertyId);
      const propertyRes = await API.get(`/property/${this.state.propertyId}`);

      this.setState({propertyData: propertyRes?.data?.data?.property});

      if (propertyRes?.data?.bool) {
        this.setState({isEditPropVisible: true, propertyflag: true});
        this.context.doLoad();
      }
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

  onEditSucces = () => {
    this.setState({
      isEditPropVisible: false,
      isLoading: true,
      isLoading: false,
    });
    this.props.fetchPropetry()
    this.getPropertyDetails(this.state.propertyId);
  };

  onCancel = () => {
    this.setState({
      listData: this.props.navigation.state.params.item.item,
      isEditPropVisible: false,
    });
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        property: '',
        property_id: '',
        billingId: false,
        street: '', // update the value of specific key
      },
    }));
  };

  naviagateToEquip = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };

  naviagateToDetail = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate(
      'Detail',
      this.props.navigation.state.params,
    );
  };

  naviagateToChart = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'Charts',
      this.props.navigation.state.params,
    );
  };
  naviagateToAlerts = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'Alerts',
      this.props.navigation.state.params,
    );
  };

  naviagateToSupport = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  toggleflag = () => {
    console.log('TOGGLEFLAG');
    this.setState({ propertyflag: false });
  };

  render() {
    const { onlineUnits, offlineUnits, notInstalledUnits, tBunchData } = this.state;
    return (
      <>
        {/* {Platform.OS == 'ios' && <CustumStatusBar />} */}
        <CustumStatusBar />
        <View style={styles.container}>
          <AddEditProperty
            modalVisible={this.state.isEditPropVisible}
            closeModal={this.onCancel}
            currLocate={this.state.propMarkers}
            currAddr={this.state.locationBtn}
            propertyData={
              this.state.propertyData == null
                ? this.props.navigation.state.params.item.item
                : this.state.propertyData
            }
            addedSuccessfully={this.onEditSucces}
            type={'Edit'}
            flag={this.state.propertyflag}
            toggleflag={this.toggleflag}
          />
          {this.state.isLoading && <Loader />}
          <Drawer
            isVisible={this.state.isModalVisible}
            onCancel={this.toggleModal}
            naviagateToDetail={this.naviagateToDetail}
            naviagateToEquip={this.naviagateToEquip}
            naviagateToChart={this.naviagateToChart}
            naviagateToAlerts={this.naviagateToAlerts}
            naviagateToSupport={this.naviagateToSupport}
          />

          <StatusBar hidden backgroundColor="white" barStyle="dark-content" />
          <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.getBack()}
                style={styles.menuView}>
                <Back
                  size={width * 0.08}
                  color="white"
                  name="keyboard-backspace"
                />
              </TouchableOpacity>
              <View style={styles.searchView}>
                <Search
                  name="search"
                  size={height * 0.04}
                  style={{ marginLeft: width * 0.015 }}
                  color="white"
                />
                <TextInput
                  dense={true}
                  underlineColor="transparent"
                  placeholderTextColor="white"
                  placeholder="Search"
                  style={styles.search}
                  onChangeText={(e) => this.setState({ currentWei: e })}
                  theme={{
                    colors: {
                      text: 'white',
                      primary: '#25dAE1',
                      selectionColor: 'transparent',
                      background: 'transparent',
                    },
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.headingContainer}>
            <View style={styles.headingInner}>
              <Menu
                name="menu"
                size={width * 0.08}
                color="white"
                style={styles.menuButton}
                onPress={this.toggleModal}
              />
              <Detail
                name="account-details-outline"
                size={width * 0.08}
                color="white"
                style={{ top: height * 0.002 }}
              />
              <Text style={styles.mainHeadiing}>Details</Text>
              {/* </View> */}
            </View>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled">
            <View style={styles.bodyContainer}>
              <MapView
                style={styles.map}
                // scrollEnabled={false}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: parseFloat(this.state.lat),
                  longitude: parseFloat(this.state.long),
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                region={{
                  latitude: parseFloat(this.state.lat),
                  longitude: parseFloat(this.state.long),
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(this.state.lat),
                    longitude: parseFloat(this.state.long),
                  }}
                  style={{
                    zIndex: 1,
                  }}
                  title={'Property Location'}
                  draggable
                />

                {this.state.markers?.length > 0 &&
                  this.state.markers.map(
                    (marker, index) =>
                      marker?.position?.lat && (
                        <Marker
                          key={index}
                          coordinate={{
                            latitude: marker?.position?.lat,
                            longitude: marker?.position?.lng,
                          }}
                          style={{
                            zIndex: 5,
                          }}
                          title={'Meter'}>
                          <View
                            style={{
                              width: width * 0.05,
                              height: width * 0.05,
                            }}>
                            <Image
                              source={require('../../../../Images/meter-icon.png')}
                              resizeMode="center"
                              // resizeMode="cover"
                              resizeMethod="auto"
                              style={{
                                width: width * 0.05,
                                height: width * 0.05,
                              }}
                            />
                          </View>
                        </Marker>
                      ),
                  )}
              </MapView>
              <View style={styles.clientName}>
                <Properties name="home-city-outline" size={width * 0.08} />
                <Text style={styles.clientNameHeading}>
                  {this.state.listData.name == null
                    ? 'Untitled'
                    : this.state.listData.name}
                </Text>
                <Pressable
                  style={styles.clientDataEdit}
                  onPress={() => this.enableLocation()}
                  android_ripple={{
                    color: 'white',
                    radius: width * 0.1,
                  }}>
                  <Text style={styles.editBottonText}>Edit</Text>
                </Pressable>
              </View>

              <View style={styles.mainDataContainer}>
                <TouchableOpacity
                  style={{ ...styles.infoViewContainer, paddingHorizontal: 10 }}
                  onPress={() =>
                    this.props.navigation.navigate(
                      'Tpanel',
                      {
                        propertyData: this.props.navigation.state.params.item
                          .item,
                        tpanelData: this.state.tpanelData,
                      },
                      // this.state.tpanelData,
                      // {
                      //   propertyData: this.props.navigation.state.params.item
                      //     .item,
                      // },
                    )
                  }>
                  <Text
                    style={{ ...styles.dataFieldHeadings, borderBottomWidth: 0 }}>
                    Tpanel
                  </Text>
                  {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      <View
                        style={{
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginBottom: width * 0.01,
                        }}>
                        <Text style={styles.tpanelHeads}>Device Serial</Text>
                        <Text style={styles.tpanelHeads}>Building</Text>
                        <Text style={styles.tpanelHeads}>Unit</Text>
                        <Text style={styles.tpanelHeads}>Utility Type</Text>
                        <Text style={styles.tpanelHeads}>Manufacturer</Text>
                        <Text style={styles.tpanelHeads}>Device</Text>
                        <Text style={styles.tpanelHeads}>Attached To</Text>
                        <Text style={styles.tpanelHeads}>Signal Strength</Text>
                        <Text style={styles.tpanelHeads}>Temperature</Text>
                        <Text style={styles.tpanelHeads}>Battery</Text>
                        <Text style={styles.tpanelHeads}>Meter Usage</Text>
                        <Text style={styles.tpanelHeads}>Meter Reading</Text>
                      </View>
                      {this.state.tpanelData.map(
                        (item) =>
                          item.unit_meter.length > 0 && (
                            <View style={styles.tpanelValuesContainer}>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.device_serial_number,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.building}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.name}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.utility_type_name.name,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.manufacturer.name,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map((i) => i.device.name)}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map((i) => i.attachedTo_name)}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.meter_read.signal_strength,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.meter_read.temperature,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.meter_read.battery,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.meter_read.meter_usage,
                                )}
                              </Text>
                              <Text style={styles.tpanelValues}>
                                {item.unit_meter.map(
                                  (i) => i.meter_read.meter_reading,
                                )}
                              </Text>
                            </View>
                          ),
                      )}
                    </View>
                  </ScrollView> */}
                  {/* <ScrollView
                    nestedScrollEnabled
                    style={{width: width * 0.85, height: width * 0.2}}>
                    {this.state.unitMixes.map((item, index) => (
                      <View style={styles.unitMixesValuesContainer}>
                        <Text style={styles.unitMixesHeads}>{index + 1}</Text>
                        <Text style={styles.unitMixesValues}>{item.br}</Text>
                        <Text style={styles.unitMixesValues}>{item.ba}</Text>
                        <Text style={styles.unitMixesValues}>
                          {item.no_of_units}
                        </Text>
                        <Text style={styles.unitMixesValues}>{item.gud}</Text>
                        <Text style={styles.unitMixesValues}>
                          {item.no_of_units * item.gud}
                        </Text>
                      </View>
                    ))}
                  </ScrollView> */}
                </TouchableOpacity>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>ADDRESS</Text>
                  <View style={styles.infoViewInner}>
                    <Locate name="map-pin" size={width * 0.06} />
                    <Text style={[styles.dataFieldText, {overflow: 'scroll'}]}>
                      {`${
                        this.state.listData.street == null
                          ? ''
                          : this.state.listData.street
                      } \n ${
                        this.state.listData.city == null
                          ? ''
                          : this.state.listData.city + ','
                      } ${
                        this.state.listData.st == null
                          ? ''
                          : this.state.listData.st
                      } ${
                        this.state.listData.zipcode == null
                          ? ''
                          : this.state.listData.zipcode
                      }`}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>CUSTOM ID</Text>
                  <View style={styles.infoViewInner}>
                    <Folder name="folder" size={width * 0.06} />
                    <Text style={styles.dataFieldText}>
                      {this.state.listData.custom_id == null ||
                      this.state.listData.custom_id == ''
                        ? '--'
                        : this.state.listData.custom_id}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Other Details</Text>
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Unit Count:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.3, textAlign: 'auto'},
                      ]}>
                      {this.state.listData.unit_count == null ||
                      this.state.listData.unit_count == ''
                        ? '--'
                        : this.state.listData.unit_count}
                    </Text>
                  </View>
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Utility Type:
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{flexDirection: 'row'}}>
                      {this.state.utilTypes.map((item, index) => (
                        <View
                          style={{borderWidth: 1, borderRadius: 5, padding: 3}}>
                          <Text
                            style={[
                              styles.dataFieldText,
                              {width: null, textAlign: 'auto'},
                            ]}>
                            {item == null || item == ''
                              ? '--'
                              : this.state.utilTypes?.length - 1 == index
                              ? item
                              : item + ', '}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Manufacturer:
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{flexDirection: 'row'}}>
                      {this.state.manus.map((item, index) => (
                        <View
                          style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 3,
                          }}>
                          <Text
                            style={[
                              styles.dataFieldText,
                              {width: null, textAlign: 'auto'},
                            ]}>
                            {item == null || item == ''
                              ? '--'
                              : this.state.manus?.length - 1 == index
                              ? item
                              : item + ', '}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>
                    Owner/Developer Name
                  </Text>
                  <View style={styles.infoViewInner}>
                    <Folder name="folder" size={width * 0.06} />
                    <Text style={styles.dataFieldText}>
                      {this.state.listData.owner == null ||
                      this.state.listData.owner == ''
                        ? '--'
                        : this.state.listData.owner}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>
                    Meter Count & Installation Status
                  </Text>
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Meter Count:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.3, textAlign: 'auto'},
                      ]}>
                      {this.state.meterCount}
                    </Text>
                  </View>
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <Text style={[styles.dataFieldText, {textAlign: 'left'}]}>
                      Complete Installations:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.3, textAlign: 'auto'},
                      ]}>
                      {this.state.installStatus}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Unit Mixes</Text>
                  <View style={styles.unitMixesHeadContainer}>
                    <Text style={styles.unitMixesHeads}>#</Text>
                    <Text style={styles.unitMixesHeads}>BR</Text>
                    <Text style={styles.unitMixesHeads}>BA</Text>
                    <Text style={styles.unitMixesHeads}># Units</Text>
                    <Text style={styles.unitMixesHeads}>G/U/D</Text>
                    <Text style={styles.unitMixesHeads}>T/G/D</Text>
                  </View>
                  <ScrollView
                    nestedScrollEnabled
                    style={{width: width * 0.85, height: width * 0.2}}>
                    {this.state.unitMixes.map((item, index) => (
                      <View style={styles.unitMixesValuesContainer}>
                        <Text style={styles.unitMixesHeads}>{index + 1}</Text>
                        <Text style={styles.unitMixesValues}>{item.br}</Text>
                        <Text style={styles.unitMixesValues}>{item.ba}</Text>
                        <Text style={styles.unitMixesValues}>
                          {item.no_of_units}
                        </Text>
                        <Text style={styles.unitMixesValues}>{item.gud}</Text>
                        <Text style={styles.unitMixesValues}>
                          {item.no_of_units * item.gud}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.sumUnitMixes}>
                    <Text style={styles.sumUnitMixesHead}>Sum # Units</Text>
                    <Text style={styles.sumUnitMixesHead}>Sum T/G/D</Text>
                    <Text style={styles.sumUnitMixesHead}>ADC</Text>
                  </View>
                  <View style={styles.sumUnitMixesValuesView}>
                    <Text>{this.state.sumNoOfUnits}</Text>
                    <Text>{this.state.sumTotalGalDay}</Text>
                    <Text>
                      {this.state.sumNoOfUnits > 0
                        ? Math.round(
                            this.state.sumTotalGalDay / this.state.sumNoOfUnits,
                          )
                        : 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.contactViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Contact Info</Text>
                  <View style={styles.contactInfoContainer}>
                    <View style={styles.contactInfoInner}>
                      <Icon
                        name="account-box"
                        size={height * 0.04}
                        color="white"
                        maxOpacity={0.5}
                      />
                    </View>
                    <TextInput
                      value={this.state.listData?.contact_name}
                      placeholder="Contact Name"
                      onChangeText={(text) => console.log(text)}
                      editable={false}
                      style={styles.contactInput}
                    />
                  </View>
                  <View style={styles.contactInfoContainer}>
                    <View style={styles.contactInfoInner}>
                      <Icon
                        name="phone"
                        size={height * 0.04}
                        color="white"
                        maxOpacity={0.5}
                      />
                    </View>
                    <TextInput
                      value={this.state.listData?.contact_phone}
                      placeholder="Phone"
                      onChangeText={(text) => console.log(text)}
                      editable={false}
                      style={styles.contactInput}
                    />
                  </View>
                  <View style={styles.contactInfoContainer}>
                    <View style={styles.contactInfoInner}>
                      <Icon
                        name="mail-outline"
                        size={height * 0.04}
                        color="white"
                        maxOpacity={0.5}
                      />
                    </View>
                    <TextInput
                      value={this.state.listData?.contact_email}
                      placeholder="Email"
                      onChangeText={(text) => console.log(text)}
                      editable={false}
                      style={styles.contactInput}
                    />
                  </View>
                </View>

                <View style={styles.barView}>
                  <Text style={{position: 'absolute'}}>
                    {onlineUnits == 0 && offlineUnits == 0
                      ? 'No Installations'
                      : 'Installation'}
                  </Text>
                  <VictoryPie
                    width={width * 0.75}
                    height={width * 0.75}
                    innerRadius={width * 0.35}
                    labelRadius={width * 0.28}
                    padAngle={1}
                    data={[
                      {x: onlineUnits, y: onlineUnits},
                      {x: offlineUnits, y: offlineUnits},
                      {x: notInstalledUnits, y: notInstalledUnits},
                    ]}
                    colorScale={['#175CA1', '#ff1414', '#dcdcdc']}
                    style={{
                      labels: {
                        fill: 'white',
                        fontWeight: 'bold',
                        alignItems: 'center',
                      },
                    }}
                  />
                </View>
                <View style={styles.onlineOfflineView}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.onlineView} />
                    <Text style={styles.onlineText}>Complete</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.offlineView} />
                    <Text style={styles.offlineText}>Incomplete</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        ...styles.offlineView,
                        backgroundColor: '#dcdcdc',
                      }}
                    />
                    <Text style={styles.offlineText}>Not Installed</Text>
                  </View>
                </View>
                {console.log({ tBunchData })}
                <View style={styles.bunchContainer}>
                  <View style={styles.rowSpaceBtw}>
                    <Text>
                      Avg. Consumption Rate
                    </Text>
                    <Text>
                      {tBunchData?.avgConsumption}%
                    </Text>
                  </View>

                  <View style={styles.rowSpaceEvenly}>
                        <View style={[styles.bunchAlertContainer, {backgroundColor: 'blue'}]}>
                            <Text style={{textTransform: 'capitalize', color: '#fff'}}>
                                Soft
                            </Text>
                            <Text style={{ color: '#fff'}}>
                                {'  '}{tBunchData?.alert_level_count[0]?.alert_count || 0}
                            </Text>
                        </View>
                        <View style={[styles.bunchAlertContainer, {backgroundColor: 'yellow'}]}>
                            <Text style={{textTransform: 'capitalize'}}>
                                Medium
                            </Text>
                            <Text>
                                {'  '}{tBunchData?.alert_level_count[1]?.alert_count || 0}
                            </Text>
                        </View>
                        <View style={[styles.bunchAlertContainer, {backgroundColor: 'red'}]}>
                            <Text style={{textTransform: 'capitalize'}}>
                                Hard
                            </Text>
                            <Text>
                                {'  '}{tBunchData?.alert_level_count[2]?.alert_count || 0}
                            </Text>
                        </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isLoading: state.propertyReducer.isLoading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    fetchPropetry: () => dispatch(fetchPropetry()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details)
