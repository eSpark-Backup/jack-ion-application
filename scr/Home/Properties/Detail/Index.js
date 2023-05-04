import React from 'react';

import {
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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

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
import {connect} from 'react-redux';
import {fetchPropetry} from '../../../Store/Action/properties.action';
import TextReuseableComponent from '../../../components/Text/index';

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
      shimmers: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
      ],
      unitMixes: [],
      tpanelData: [],
      tBunchData: null,
      sumNoOfUnits: 0,
      sumTotalGalDay: 0,
      meterCount: 0,
      installStatus: 0,
      lat: 0,
      long: 0,
      detailsSelected: false,
      equipmentsSelected: false,
      propertyTitle: '',
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
    this.setState({isLoading: true});
    Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');

    this.setPropertyData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.navigation.state.params.item.item !==
      prevProps.navigation.state.params.item.item
    ) {
      this.setPropertyData();
    }
  }
  getTpanelData = async (id) => {
    const tPanelRes = await API.get(`/property/tpanel/${id}`);
    if (tPanelRes?.data?.bool) {
      this.setState({
        tpanelData: tPanelRes?.data?.data?.unit,
      });
    }
  };

  getBunchData = async (id) => {
    const tBunchRes = await API.get(`/property/details-bunch/${id}`);
    if (tBunchRes?.data?.bool) {
      this.setState({
        tBunchData: tBunchRes?.data?.data,
      });
    }
  };

  setPropertyData = () => {
    const propertyData = this.props.navigation.state.params.item.item;
    this.getPropertyDetails(propertyData?.id);
    this.getMetersLocation(propertyData?.id);
    this.getTpanelData(propertyData?.id);
    this.getBunchData(propertyData?.id);
  };

  getPropertyDetails = async (id) => {
    this.setState({isLoading: true});

    const propertyRes = await API.get(`/property/${id}`);
    const currPropData = propertyRes?.data?.data?.property;
    const utilityManufacturersArr =
      propertyRes?.data?.data?.property?.utility_manufacturers;

    let utilTypes = [];
    let manus = [];
    utilityManufacturersArr.filter((item) => {
      const found = utilTypes.find(
        (utilItem) => utilItem == item?.utility_type?.name,
      );
      if (!found) {
        utilTypes.push(item.utility_type.name);
      }
      manus.push(item.manufacturer.name);
    });

    this.setState({utilTypes, manus});
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

    const transceiverRes = await API.get(`/property/details-bunch/${id}`);
    console.log('Details Bunch', transceiverRes?.data?.data?.installs);
    // console.log('Transcievers', transceiverRes?.data,
    //   transceiverRes?.data?.data?.installs[1],
    //   transceiverRes?.data?.data?.installs[2],);
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
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      detailsSelected: true,
      equipmentsSelected: false,
      propertyTitle: this.state.listData.name,
    });
  };

  enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
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
    this.props.fetchPropetry();
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
    this.setState({
      detailsSelected: false,
      equipmentsSelected: true,
      isModalVisible: false,
    });
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };

  naviagateToDetail = () => {
    this.setState({
      isModalVisible: false,
      detailsSelected: true,
      equipmentsSelected: false,
    });
    this.props.navigation.navigate(
      'Detail',
      this.props.navigation.state.params,
    );
  };

  navigateToReport = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'PropertyReport',
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
    this.setState({propertyflag: false});
  };

  renderShimmers = (item) => (
    <View key={item.id} style={styles.skeletonMainContainer}>
      <SkeletonPlaceholder>
        <View style={styles.skeletonInnerContainer}>
          <View style={styles.skeletonMapContainer} />
          <View style={styles.skeletonTitleContainer}>
            <View style={styles.skeletonTitleLeft}></View>
            <View style={styles.skeletonTitleMiddle}></View>
            <View style={styles.skeletonTitleRight}></View>
          </View>
          <View style={styles.skeletonTpanelContainer} />
          <View style={styles.skeletonGatewayContainer} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );

  render() {
    const {
      onlineUnits,
      offlineUnits,
      notInstalledUnits,
      tBunchData,
      propertyData,
    } = this.state;
    return (
      <>
        <CustumStatusBar />
        <View style={styles.container}>
          <AddEditProperty
            modalVisible={this.state.isEditPropVisible}
            closeModal={this.onCancel}
            currLocate={this.state.propMarkers}
            currAddr={this.state.locationBtn}
            propertyData={
              this.state.propertyData == null
                ? this.props?.navigation?.state?.params?.item?.item
                : this.state.propertyData
            }
            addedSuccessfully={this.onEditSucces}
            type={'Edit'}
            flag={this.state.propertyflag}
            toggleflag={this.toggleflag}
          />

          <Drawer
            isVisible={this.state.isModalVisible}
            onCancel={this.toggleModal}
            naviagateToDetail={this.naviagateToDetail}
            detailsSelected={this.state.detailsSelected}
            equipmentsSelected={this.state.equipmentsSelected}
            naviagateToEquip={this.naviagateToEquip}
            naviagateToChart={this.naviagateToChart}
            naviagateToAlerts={this.naviagateToAlerts}
            naviagateToSupport={this.naviagateToSupport}
            navigateToReport={this.navigateToReport}
            propertyName={this.state.propertyTitle}
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
                  style={{marginLeft: width * 0.015}}
                  color="white"
                />
                <TextInput
                  dense={true}
                  underlineColor="transparent"
                  placeholderTextColor="white"
                  placeholder="Search"
                  style={styles.search}
                  onChangeText={(e) => this.setState({currentWei: e})}
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
                style={{top: height * 0.002}}
              />
              <TextReuseableComponent
                title
                style={styles.mainHeadiing}
                value={'Details'}
              />
            </View>
          </View>
          {(this.state.listData.name == 'undefined' ||
            !this.state.listData.name) &&
            this.state.shimmers.map((item) => this.renderShimmers(item))}
          <ScrollView
            style={{flex: 1}}
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
                  this.state.markers.map((marker, index) =>
                    marker?.position?.lat ? (
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
                    ) : null,
                  )}
              </MapView>
              <View style={styles.clientName}>
                <Properties
                  name="home-city-outline"
                  size={width * 0.1}
                  style={{color: '#25AAE1ec'}}
                />
                <TextReuseableComponent
                  title
                  style={styles.clientNameHeading}
                  value={
                    this.state.listData.name == null
                      ? 'Untitled'
                      : this.state.listData.name.substring(0, 28)
                  }
                />
                <TouchableOpacity
                  style={styles.clientDataEdit}
                  onPress={() => this.enableLocation()}>
                  <TextReuseableComponent
                    title
                    style={styles.editBottonText}
                    value={'Edit'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.mainDataContainer}>
                <TouchableOpacity
                  style={{...styles.infoViewContainer, paddingHorizontal: 10}}
                  onPress={() =>
                    this.props.navigation.navigate('Tpanel', {
                      propertyData: this.props.navigation.state.params.item
                        .item,
                      tpanelData: this.state.tpanelData,
                    })
                  }>
                  <TextReuseableComponent
                    title
                    style={{...styles.dataFieldHeadings, borderBottomWidth: 0}}
                    value={'Device Inventory'}
                  />
                </TouchableOpacity>

                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Gateway'}
                  />
                  <View style={styles.infoViewInner}>
                    <Icon name="router" size={width * 0.06} />
                    {propertyData?.gateway ? (
                      <View style={{justifyContent: 'flex-end'}}>
                        <TextReuseableComponent
                          title
                          style={{
                            textAlign: 'left',
                            fontSize: height * 0.022,
                            fontFamily: Fonts.Montserrat,
                          }}
                          value={`${propertyData?.gateway?.serial_number} Synced`}
                        />
                      </View>
                    ) : (
                      <>
                        <TextReuseableComponent
                          title
                          style={[styles.dataFieldText, {textAlign: 'left'}]}
                          value={'No Gateway Programmed!'}
                        />
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'ADDRESS'}
                  />
                  <View style={[styles.infoViewInner, {height: 'auto'}]}>
                    <Locate name="map-pin" size={width * 0.06} />
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {overflow: 'scroll', textAlign: 'left'},
                      ]}
                      value={`${
                        this.state.listData.street == null
                          ? ''
                          : this.state.listData.street
                      } ${
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
                    />
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'CUSTOM ID'}
                  />
                  <View style={styles.infoViewInner}>
                    <Folder
                      name="folder"
                      size={width * 0.06}
                      style={{textAlign: 'left'}}
                    />
                    <TextReuseableComponent
                      title
                      style={[styles.dataFieldText, {textAlign: 'right'}]}
                      value={
                        this.state.listData.custom_id == null ||
                        this.state.listData.custom_id == ''
                          ? '--'
                          : this.state.listData.custom_id
                      }
                    />
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Other Details'}
                  />
                  <View
                    style={{
                      height: height * 0.05,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: width * 0.8,
                    }}>
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {flex: 1, textAlign: 'left'},
                      ]}
                      value={'Unit Count:'}
                    />
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {width: '60%', textAlign: 'right'},
                      ]}
                      value={
                        this.state.listData.unit_count == null ||
                        this.state.listData.unit_count == ''
                          ? '--'
                          : this.state.listData.unit_count
                      }
                    />
                  </View>

                  <View
                    style={{
                      height: height * 0.05,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.8,
                      alignItems: 'center',
                      marginVertical: height * 0.01,
                      width: width * 0.8,
                    }}>
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {flex: 1, textAlign: 'left'},
                      ]}
                      value={'Utility Type:'}
                    />
                    <View style={{width: '55%', alignItems: 'flex-end'}}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{flexDirection: 'row'}}>
                        {this.state?.utilTypes?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                              marginHorizontal:
                                this.state?.utilTypes.length > 1 ? 5 : null,
                            }}>
                            <TextReuseableComponent
                              title
                              style={[
                                styles.dataFieldText,
                                {
                                  width: null,
                                  textAlign: 'auto',
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  padding: 3,
                                },
                              ]}
                              value={item}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  <View
                    style={{
                      height: height * 0.05,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: width * 0.8,
                      alignItems: 'center',
                      marginVertical: height * 0.01,
                      marginBottom: height * 0.01,
                      width: width * 0.8,
                    }}>
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {flex: 1, textAlign: 'left'},
                      ]}
                      value={'Manufacturer:'}
                    />
                    <View style={{width: '55%', alignItems: 'flex-end'}}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{flexDirection: 'row'}}>
                        {this.state?.manus?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              justifyContent: 'center',
                              textAlign: 'center',
                              marginHorizontal:
                                this.state?.manus.length > 1 ? 5 : null,
                            }}>
                            <TextReuseableComponent
                              title
                              style={[
                                styles.dataFieldText,
                                {
                                  width: null,
                                  textAlign: 'auto',
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  padding: 3,
                                },
                              ]}
                              value={item}
                            />
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>

                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Owner/Developer Name'}
                  />
                  <View style={styles.infoViewInner}>
                    <Folder name="folder" size={width * 0.06} />
                    <TextReuseableComponent
                      title
                      style={[styles.dataFieldText, {textAlign: 'right'}]}
                      value={
                        this.state.listData.owner == null ||
                        this.state.listData.owner == ''
                          ? '--'
                          : this.state.listData.owner
                      }
                    />
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Meter Count & Installation Status'}
                  />
                  <View style={[styles.infoViewInner, {height: width * 0.07}]}>
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}
                      value={'Meter Count:'}
                    />
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'right'},
                      ]}
                      value={
                        this.state.meterCount == null ||
                        this.state.meterCount == ''
                          ? '--'
                          : this.state.meterCount
                      }
                    />
                  </View>
                  <View
                    style={[
                      styles.infoViewInner,
                      {height: height * 0.06, justifyContent: 'space-between'},
                    ]}>
                    <TextReuseableComponent
                      subHeading
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.6, textAlign: 'left'},
                      ]}
                      value={'Complete Installations:'}
                    />
                    <TextReuseableComponent
                      title
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.2, textAlign: 'right'},
                      ]}
                      value={
                        this.state.installStatus === 'undefined/undefined' ||
                        this.state.installStatus == '' ||
                        this.state.installStatus == null
                          ? '--'
                          : this.state.installStatus
                      }
                    />
                  </View>
                </View>
                <View
                  style={[styles.infoViewContainer, {maxHeight: height * 0.4}]}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Unit Mixes'}
                  />
                  <View style={styles.unitMixesHeadContainer}>
                    <TextReuseableComponent
                      title
                      style={styles.unitmixesHeadSmall}
                      value={'#'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitmixesHeadSmall}
                      value={'BR'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitmixesHeadSmall}
                      value={'BA'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitMixesHeads}
                      value={'#Units'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitMixesHeads}
                      value={'G/U/D'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitMixesHeads}
                      value={'T/G/D'}
                    />
                  </View>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    style={{
                      width: width * 0.8,
                      maxHeight: height * 0.4,
                      marginVertical: height * 0.01,
                    }}>
                    {this.state.unitMixes.map((item, index) => (
                      <View key={index} style={styles.unitMixesValuesContainer}>
                        <TextReuseableComponent
                          title
                          style={styles.unitmixesValueSmall}
                          value={index + 1}
                        />
                        <TextReuseableComponent
                          title
                          style={styles.unitmixesValueSmall}
                          value={item.br}
                        />
                        <TextReuseableComponent
                          title
                          style={styles.unitmixesValueSmall}
                          value={item.ba}
                        />
                        <TextReuseableComponent
                          title
                          style={styles.unitMixesValues}
                          value={item.no_of_units}
                        />
                        <TextReuseableComponent
                          title
                          style={styles.unitMixesValues}
                          value={item.gud}
                        />
                        <TextReuseableComponent
                          title
                          style={styles.unitMixesValues}
                          value={item.no_of_units * item.gud}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.sumUnitMixes}>
                    <TextReuseableComponent
                      title
                      style={styles.sumUnitMixesHead}
                      value={'Sum # Units'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.sumUnitMixesHead}
                      value={'Sum T/G/D'}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.sumUnitMixesHead}
                      value={'ADC'}
                    />
                  </View>
                  <View style={styles.sumUnitMixesValuesView}>
                    <TextReuseableComponent
                      title
                      value={this.state.sumNoOfUnits}
                    />
                    <TextReuseableComponent
                      title
                      value={this.state.sumTotalGalDay}
                    />
                    <TextReuseableComponent
                      title
                      value={
                        this.state.sumNoOfUnits > 0
                          ? Math.round(
                              this.state.sumTotalGalDay /
                                this.state.sumNoOfUnits,
                            )
                          : 0
                      }
                    />
                  </View>
                </View>

                <View style={styles.contactViewContainer}>
                  <TextReuseableComponent
                    title
                    style={styles.dataFieldHeadings}
                    value={'Contact Info'}
                  />
                  {this.state.listData?.contact_name ||
                  this.state.listData?.contact_phone ||
                  this.state.listData?.contact_email ? (
                    <>
                      <View style={styles.contactInfoContainer}>
                        <View style={styles.contactInfoInner}>
                          <Icon
                            name="account-box"
                            size={height * 0.04}
                            color="#444444"
                            maxOpacity={0.1}
                          />
                        </View>
                        <View style={styles.contactInfoText}>
                          <TextReuseableComponent
                            title
                            value={this.state.listData?.contact_name}
                          />
                        </View>
                      </View>
                      <View style={styles.contactInfoContainer}>
                        <View style={styles.contactInfoInner}>
                          <Icon
                            name="phone"
                            size={height * 0.04}
                            color="#444444"
                            maxOpacity={0.5}
                          />
                        </View>
                        <View style={styles.contactInfoText}>
                          <TextReuseableComponent
                            title
                            value={this.state.listData?.contact_phone}
                          />
                        </View>
                      </View>
                      <View style={styles.contactInfoContainer}>
                        <View style={styles.contactInfoInner}>
                          <Icon
                            name="mail-outline"
                            size={height * 0.03}
                            color="#444444"
                            maxOpacity={0.5}
                          />
                        </View>
                        <View style={styles.contactInfoText}>
                          <TextReuseableComponent
                            title
                            value={this.state.listData?.contact_email}
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <View
                      style={{
                        height: height * 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TextReuseableComponent
                        subHeading
                        value={'No Contact Info Available'}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.barView}>
                  <TextReuseableComponent
                    title
                    style={{position: 'absolute'}}
                    value={
                      onlineUnits == 0 && offlineUnits == 0
                        ? 'No Installations'
                        : 'Installation'
                    }
                  />
                  <VictoryPie
                    width={width * 0.75}
                    height={width * 0.75}
                    innerRadius={width * 0.35}
                    labelRadius={width * 0.28}
                    padAngle={1}
                    labels={({datum}) => (datum.y == 0 ? '' : datum.y)}
                    data={[
                      {x: onlineUnits, y: onlineUnits},
                      {x: offlineUnits, y: offlineUnits},
                      {x: notInstalledUnits, y: notInstalledUnits},
                    ]}
                    colorScale={['#3e95c7', '#ff1414', '#dcdcdc']}
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.onlineView} />
                    <TextReuseableComponent
                      title
                      style={styles.onlineText}
                      value={'Installed'}
                    />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.offlineView} />
                    <TextReuseableComponent
                      title
                      style={styles.offlineText}
                      value={'Not Installed'}
                    />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        ...styles.offlineView,
                        backgroundColor: '#dcdcdc',
                      }}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.offlineText}
                      value={'Incomplete'}
                    />
                  </View>
                </View>
                <View style={styles.bunchContainer}>
                  <View style={styles.rowSpaceBtw}>
                    <TextReuseableComponent
                      title
                      value={'Avg. Consumption Rate'}
                    />
                    <TextReuseableComponent
                      title
                      value={`${tBunchData?.avgConsumption || '0.00'} %`}
                    />
                  </View>

                  <View style={styles.rowSpaceEvenly}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        this?.props?.navigation?.navigate(
                          'ConsumptionComparison',
                          {propId: propertyData?.id},
                        )
                      }
                      style={[
                        styles.bunchAlertContainer,
                        {backgroundColor: '#3e89bf'},
                      ]}>
                      <TextReuseableComponent
                        title
                        style={{textTransform: 'capitalize', color: '#fff'}}
                        value={'Soft:'}
                      />
                      <TextReuseableComponent
                        title
                        style={{color: '#fff'}}
                        value={
                          tBunchData?.alert_level_count[0]?.alert_count || 0
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        this?.props?.navigation?.navigate(
                          'ConsumptionComparison',
                          {propId: propertyData?.id},
                        )
                      }
                      style={[
                        styles.bunchAlertContainer,
                        {backgroundColor: '#FFC107'},
                      ]}>
                      <TextReuseableComponent
                        title
                        style={{textTransform: 'capitalize'}}
                        value={'Medium:'}
                      />
                      <TextReuseableComponent
                        title
                        value={
                          tBunchData?.alert_level_count[1]?.alert_count || 0
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        this?.props?.navigation?.navigate(
                          'ConsumptionComparison',
                          {propId: propertyData?.id},
                        )
                      }
                      style={[
                        styles.bunchAlertContainer,
                        {backgroundColor: '#DC3545'},
                      ]}>
                      <TextReuseableComponent
                        title
                        style={{textTransform: 'capitalize'}}
                        value={'High:'}
                      />
                      <TextReuseableComponent
                        title
                        value={
                          tBunchData?.alert_level_count[2]?.alert_count || 0
                        }
                      />
                    </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Details);
