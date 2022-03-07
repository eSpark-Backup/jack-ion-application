import React, {useEffect, useRef, useState} from 'react';

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
  ActivityIndicator,
  ToastAndroid,
  Image,
  LayoutAnimation,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, IconToggle} from 'react-native-material-ui';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SystemSetting from 'react-native-system-setting';
import SearchableDropDown from 'react-native-searchable-dropdown';
import EncryptedStorage from 'react-native-encrypted-storage';
import {create} from 'apisauce';

//Component
import styles from './style';
import {Fonts} from '../../../utils/fonts';
import Base_URL from '../../../api/WebServices';

export default function AddEditProperty({
  modalVisible,
  closeModal,
  type,
  currAddr,
  currLocate,
}) {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0322;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const circleRef = useRef(null);
  const api = create({baseURL: Base_URL});

  const [loadingStateManage, setLoadingStateManage] = useState(false);
  const [loadingStateBill, setLoadingStateBill] = useState(false);
  const [addNewType, setAddNewType] = useState(false);
  const [showAddType, setShowAddType] = useState('');
  const [billCompList, setBillCompList] = useState([]);
  const [addBilling, setAddBilling] = useState('');
  const [BillingCompany, setBillingCompany] = useState('');
  const [BillingCompanyId, setBillingCompanyId] = useState('');
  const [manageCompList, setManageCompList] = useState([]);
  const [addManagement, setAddManagement] = useState('');
  const [managementCompany, setManagementCompany] = useState('');
  const [managementCompanyId, setManagementCompanyId] = useState(null);
  const [avoidKeyboard, setAvoidKeyboard] = useState(false);
  const [selectLocation, setSelectLocation] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [latDelta, setLatDelta] = useState(LATITUDE_DELTA);
  const [longDelta, setLongDelta] = useState(LONGITUDE_DELTA);
  const [radialDis, setRadialDis] = useState(0.1);
  const [locationBtn, setLocationBtn] = useState('');
  const [markers, setMarkers] = useState(currLocate);
  const [CustomId, setCustomId] = useState('');
  const [unitCount, setUnitCount] = useState('');
  const [unitMix, setUnitMix] = useState([1]);
  const [ownerData, setOwnerData] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [Name, setName] = useState('');
  const [Street, setStreet] = useState('');
  const [City, setCity] = useState('');
  const [State, setState] = useState('');
  const [ZipCode, setZipCode] = useState('');
  const [error, setError] = useState({
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
  });
  const [dropDownShow, setDropDownShow] = useState([
    {value: true},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
  ]);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }

    setLoadingStateManage(true);
    const ManageRes = await api.get('/property/management-company/all');

    let list = ManageRes?.data?.data?.managementCompany;
    let filter = [];
    for (let i = 0; i < list.length; i++) {
      const data = {
        name: list[i].manager_name,
        id: list[i].id,
      };
      filter.push(data);
    }

    setManageCompList(filter);
    setLoadingStateManage(false);

    setLoadingStateBill(true);
    const BillingRes = await api.get('/property/billing-company/all');

    setBillCompList(BillingRes?.data?.data?.billingCompany);
    setLoadingStateBill(false);

    const ownerRes = await api.get('/property/owner/own');

    console.log('ownerRes--->', ownerRes?.data?.data);
    setOwnerData(ownerRes?.data?.data);
  };

  const AddNewRow = () => {
    let arr = [...unitMix];
    arr.push(2);
    setUnitMix(arr);
  };

  const showMoreFn = (indexx) => {
    // this.setState({
    //   addNewType: false,
    //   showEditManufacturer: false,
    //   showAddManufacturer: false,
    // });
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
    dropDownShow.map((item, index) => {
      if (index == indexx) {
        let dropDownVal = [...dropDownShow];
        console.log('el --->', dropDownVal[index]);
        dropDownVal[index].value = true;
        setDropDownShow(dropDownVal);
      } else {
        let dropDownVal = [...dropDownShow];
        console.log('el --->', dropDownVal[index]);
        dropDownVal[index].value = false;
        setDropDownShow(dropDownVal);
      }
    });
  };

  const selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    setSelectLocation(true);
  };

  const catchLocation = (region) => {
    setLat(region?.lat);
    setLong(region?.lng);
  };

  const fetchAddressData = (searchdata) => {
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
    setStreet(Street);
    setCity(City);
    setState(State);
    setZipCode(ZipCode);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      setLat(lat);
      setLong(long);
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
    setAddNewType(true);
    setShowAddType(value);
    // this.setState({showAddType: value}, () => {
    //   if (value == 'Model Number') {
    //     this.setState({enableDevice: false});
    //     console.log('Model Number Adding------');
    //     this.getAllDevices();
    //   }
    // });
  };

  const cancelAddType = () => {
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
    // let deviceData = [...this.state.addDevice]; // copying the old datas array
    // deviceData[0].select = '';
    // deviceData[0].selectId = '';
    // deviceData[1].select = '';
    // deviceData[1].selectId = '';
    // deviceData[2].select = '';
    // deviceData[2].selectId = '';
    setAddNewType(false);
    setShowAddType('');
    setAddManagement('');
    setAddBilling('');
    // this.setState({
    //   addManufacturer: '',
    //   addUtility: '',
    //   addMeter: '',
    //   addDevice: deviceData,
    //   devicesArray: [],
    //   modelArr: [],
    //   selectedDevice: {},
    //   addModelNumber: '',
    //   productNo: '',
    //   modelNo: '',
    // });
  };

  const doneAddType = async (val, temp) => {
    console.log('Show Add Type', this.state.showAddType);
    if (this.state.showAddType == 'Utility' || val == 'Utility') {
      let data = {
        name: this.state.addUtility,
      };
      if (temp) {
        this.setState({loadingState: true});
      } else {
        this.setState({loadingStateDev: true});
      }
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
        if (!temp) {
          this.setState({
            showAddType: 'Manufacturer',
            addNewType: true,
            addNewUType: false,
            addUtility: '',
          });
        } else {
          this.cancelAddType();
        }
        this.setState({loadingState: false, loadingStateDev: false});
        this.getToken();
        alert(UtilityResponse?.data?.message);
      } else {
        alert(UtilityResponse?.data?.message);
        this.setState({loadingState: false, loadingStateDev: false});
      }
    } else if (
      this.state.showAddType == 'Manufacturer' ||
      val == 'Manufacturer'
    ) {
      console.log('chala');
      let utilIds = [];
      for (let i = 0; i < this.state.selectAddManuUtil?.length; i++) {
        utilIds.push(this.state.selectAddManuUtil[i].id);
      }
      let data = {
        name: this.state.addManufacturer,
        utility_type_id: utilIds,
      };
      this.setState({loadingStateDev: true});
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
        this.setState({loadingStateDev: false});
      } else {
        alert(ManufacturersResponse?.data?.message);
        this.setState({loadingStateDev: false});
      }
    } else if (
      this.state.showAddType == 'Model Number' ||
      val == 'Model Number'
    ) {
      let data = {
        model_no: this.state.addModelNumber,
        device_id: this.state.selectedDevice?.id,
      };
      this.setState({loadingStateDev: true});
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
        this.setState({loadingStateDev: false});
      } else {
        alert(ModelNumberResponse?.data?.message);
        this.setState({loadingStateDev: false});
      }
    } else if (this.state.showAddType == 'Meter' || val == 'Meter') {
      let data = {
        name: this.state.addMeter,
      };
      this.setState({loadingState: true});
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
        this.setState({loadingState: false});
        alert(MeterResponse?.data?.message);
      } else {
        this.setState({loadingState: false});
        alert(MeterResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Billing' || val == 'Billing') {
      let data = {
        name: this.state.addBilling,
      };
      setLoadingStateBill(true);
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
        callApi();
        cancelAddType();
        setLoadingStateBill(false);
        alert(BillingResponse?.data?.message);
      } else {
        setLoadingStateBill(false);
        alert(BillingResponse?.data?.message);
      }
    } else if (showAddType == 'Management' || val == 'Management') {
      let data = {
        manager_name: addManagement,
      };
      console.log('Management Company data -->>', data);
      setLoadingStateManage(false);
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
        callApi();
        cancelAddType();
        setLoadingStateManage(false);
        alert(ManagementResponse?.data?.message);
      } else {
        setLoadingStateManage(false);
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
      this.setState({loadingStateDev: true});
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
        cancelAddType();
        this.setState({loadingStateDev: false});
        alert(DeviceTypesR4esponse?.data?.message);
      } else {
        this.setState({loadingStateDev: false});
        alert(DeviceTypesResponse?.data?.message);
      }
    }
  };

  console.log('UNIT MIX ARRAY', unitMix);
  return (
    <View>
      <KeyboardAvoidingView behavior="height">
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          coverScreen={true}
          statusBarTranslucent={true}
          style={{
            margin: 0,
            // bottom: avoidKeyboard ? width * 0.45 : 0,
          }}
          isVisible={modalVisible}>
          {selectLocation ? (
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
                      value={Number(radialDis)}
                      onValueChange={(value) =>
                        setRadialDis(value.toString().slice(0, 3))
                      }
                      step={0.1}
                    />
                    <Text>{radialDis} KM</Text>
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
                      catchLocation(details.geometry.location);
                      console.log('DETAILS', details);
                      fetchAddressData(details?.formatted_address);
                      setLocationBtn(details?.formatted_address);
                    }}
                    onFail={(error) => console.error(error)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => getCurrentLocation()}
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
                  onPress={() => {
                    setSelectLocation(false);
                    setLocationSelected(true);
                  }}
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

                {markers.length > 0 || currLocate.length > 0 ? (
                  <View
                    style={{
                      // backgroundColor: 'blue',
                      width: width * 0.12,
                      top: width * 0.4,
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
                ) : null}
                {markers.length > 0 || currLocate.length > 0 ? (
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
                    <Circle
                      center={{
                        latitude: lat,
                        longitude: long,
                      }}
                      ref={circleRef}
                      onLayout={() =>
                        circleRef.current.setNativeProps({
                          strokeColor: 'rgba(12,170,225,1)',
                          fillColor: 'rgba(12,170,225,0.3)',
                        })
                      }
                      radius={radialDis * 1000}
                      // fillColor="rgba(12,170,225,0.3)"
                      // strokeColor="rgba(12,170,225,1)"
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
                      <Text style={styles.modalHeading}>
                        {type == 'Add' ? 'New' : 'Edit'} Property
                      </Text>
                      <Pressable
                        onPress={closeModal}
                        // onPress={this.clearInputs}
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
                  <KeyboardAwareScrollView
                    style={{flex: 1, width: '90%', backgroundColor: '#fff'}}
                    contentContainerStyle={{backgroundColor: '#fff'}}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}>
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(0)}>
                        <Text style={styles.desciptionHeading}>
                          Property Name & Address
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[0].value
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
                            height: dropDownShow[0].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Enter Property Name*"
                          value={Name}
                          onChangeText={(text) => {
                            setName(text);
                            setError((oldState) => ({
                              ...oldState,
                              property: '',
                            }));
                          }}
                          error={error.property}
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
                      {error.property ? (
                        <HelperText type="error" visible={error.property}>
                          {error.property}
                        </HelperText>
                      ) : null}

                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[0].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={selectMeterLocation}
                          style={styles.loactionBtn}>
                          <Text style={styles.loactionBtnText}>
                            {locationBtn ? locationBtn : currAddr}
                          </Text>
                          <IonicIcon
                            name="location"
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(1)}>
                        <Text style={[styles.desciptionHeading]}>
                          Unit Count & Unit Mix
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[1].value
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
                            height: dropDownShow[1].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Unit Count"
                          style={styles.input}
                          value={unitCount}
                          onChangeText={(text) => {
                            setUnitCount(text);
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
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Text style={{marginHorizontal: width * 0.01}}>
                          Sq. Ft
                        </Text>
                        <Text style={{marginHorizontal: width * 0.01}}>
                          Unit Type
                        </Text>
                        <Text style={{marginHorizontal: width * 0.01}}>
                          Classes
                        </Text>
                        <Text style={{marginHorizontal: width * 0.01}}>
                          Bedrooms
                        </Text>
                        <Text style={{marginHorizontal: width * 0.01}}>
                          Action
                        </Text>
                      </View>

                      {unitMix.map((item, index) => (
                        <View>
                          <Text>ROW</Text>
                          <TouchableOpacity
                            onPress={() => {
                              let arr = [...unitMix];
                              arr.splice(index, 1);
                              setUnitMix(arr);
                            }}>
                            <Text>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity onPress={AddNewRow}>
                        <Text>Add New Rows</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(2)}>
                        <Text style={[styles.desciptionHeading]}>
                          Utility Type & Manufacturer
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[2].value
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
                      {/* <ScrollView
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled>
                      {this.state.loadingStateDev || this.state.loadingState ? (
                        <ActivityIndicator size="large" color={'#25AAE1ec'} />
                      ) : (
                        <>
                          <View
                            style={{
                              // height: height * 0.25,
                              width: '100%',
                              alignSelf: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                              // justifyContent: 'center',
                              zIndex: 2,
                              height: dropDownShow[1].value
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
                                  {this.state.loadManuList ? (
                                    <ActivityIndicator
                                      size="large"
                                      style={{bottom: 15}}
                                      color={'#25AAE1ec'}
                                    />
                                  ) : (
                                    this.state.manufacturersArray.length >
                                      0 && (
                                      <FlatList
                                        data={this.state.manufacturersArray}
                                        renderItem={this.renderManufacturerList}
                                      />
                                    )
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
                                    {this.state.addManuLoad ? (
                                      <ActivityIndicator
                                        size="small"
                                        color={'#25AAE1ec'}
                                      />
                                    ) : (
                                      <Text style={{color: '#25AAE1ec'}}>
                                        Add Manufacturer
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              )}
                            {this.state.showAddManufacturer &&
                              this.deviceTypeInfoComponent('add')}
                            {this.state.showEditManufacturer &&
                              this.deviceTypeInfoComponent('edit')}
                          </View>
                          {error.utilType ? (
                            <HelperText
                              type="error"
                              visible={error.utilType}>
                              {error.utilType}
                            </HelperText>
                          ) : null}
                        </>
                      )}
                    </ScrollView> */}
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(3)}>
                        <Text style={styles.desciptionHeading}>
                          owner info & contact person
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[3].value
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
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Company Specific ID"
                          style={styles.input}
                          value={CustomId}
                          onChangeText={(text) => {
                            setCustomId(text);
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
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,

                            overflow: 'hidden',
                            justifyContent: 'center',
                          },
                        ]}>
                        <SearchableDropDown
                          onItemSelect={(item) => {
                            setOwnerId(item.id);
                            setOwnerName(item.name);
                            // this.setState({
                            //   CustomerName: item.id,
                            //   ownerName: item.name,
                            // });
                          }}
                          containerStyle={styles.dropDownFullContainer}
                          itemStyle={styles.dropDownItems}
                          itemTextStyle={styles.dropDownItemText}
                          itemsContainerStyle={styles.dropDownItemContainer}
                          items={ownerData}
                          resetValue={false}
                          textInputProps={{
                            placeholder: 'Owner or Developer Name',
                            underlineColorAndroid: 'transparent',
                            style: styles.dropDownFullTextInput,
                            onTextChange: (text) => {
                              setOwnerName(text);
                            },
                            value: setTimeout(() => ownerName, 200),
                            defaultValue: ownerName,
                          }}
                          listProps={{
                            nestedScrollEnabled: true,
                          }}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Contact Name"
                          style={styles.input}
                          value={contactName}
                          onChangeText={(text) => {
                            setContactName(text);
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
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Contact Phone"
                          style={styles.input}
                          value={contactPhone}
                          onChangeText={(text) => {
                            setContactPhone(text);
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
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Email"
                          style={styles.input}
                          value={contactEmail}
                          onChangeText={(text) => {
                            setContactEmail(text);
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
                      {/* <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(3)}>
                        <Text style={styles.desciptionHeading}>
                          management company
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[3].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity> */}
                      {/* <View
                        style={[
                          styles.bothViewContainer,
                          {
                            height: dropDownShow[3].value
                              ? width * 0.18
                              : width * 0.0,
                          },
                        ]}>
                        {loadingStateManage ? (
                          <ActivityIndicator size="large" color={'#25AAE1ec'} />
                        ) : addNewType && showAddType == 'Management' ? (
                          <View>
                            <View>
                              <Text style={styles.addTypeHeading}>
                                Add New {showAddType} Company
                              </Text>
                            </View>
                            <TextInput
                              placeholder={'Type New Management Company Name'}
                              value={addManagement}
                              style={styles.addTypeTextInput}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                              onChangeText={(text) => {
                                setAddManagement(text);
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                              }}>
                              <TouchableOpacity onPress={() => cancelAddType()}>
                                <Text style={styles.addTypeButtons}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => doneAddType('Management')}
                                disabled={addManagement ? false : true}>
                                <Text
                                  style={[
                                    styles.addTypeButtons,
                                    {
                                      color: addBilling
                                        ? '#25AAE1ec'
                                        : '#d0d0d0',
                                    },
                                  ]}>
                                  Add
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.mainDropDownView}>
                            <SearchableDropDown
                              onItemSelect={(item) => {
                                setManagementCompany(item.name);
                                setManagementCompanyId(item.id);
                              }}
                              containerStyle={styles.dropDownContainer}
                              itemStyle={styles.dropDownItems}
                              itemTextStyle={styles.dropDownItemText}
                              itemsContainerStyle={styles.dropDownItemContainer}
                              items={manageCompList}
                              resetValue={false}
                              textInputProps={{
                                placeholder: 'Management Company',
                                underlineColorAndroid: 'transparent',
                                style: styles.dropDownTextInput,
                                onTextChange: (text) => {
                                  setManagementCompany(text);
                                },
                                value: setTimeout(() => managementCompany, 200),
                                defaultValue: managementCompany,
                              }}
                              listProps={{
                                nestedScrollEnabled: true,
                              }}
                            />
                            <TouchableOpacity
                              style={styles.addNewButton}
                              onPress={() => showAddNewType('Management')}>
                              <Icon
                                size={width * 0.06}
                                color="#fff"
                                name={'add'}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View> */}
                      {/* <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(4)}>
                        <Text style={styles.desciptionHeading}>
                          billing company
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[4].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity> */}
                      {/* <View
                        style={[
                          styles.bothViewContainer,
                          {
                            height: dropDownShow[4].value
                              ? width * 0.18
                              : width * 0.0,
                          },
                        ]}>
                        {loadingStateBill ? (
                          <ActivityIndicator size="large" color={'#25AAE1ec'} />
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                            }}>
                            {addNewType && showAddType == 'Billing' ? (
                              <View>
                                <View>
                                  <Text style={styles.addTypeHeading}>
                                    Add New {showAddType} Company
                                  </Text>
                                </View>
                                <TextInput
                                  placeholder={'Type New Billing Company Name'}
                                  value={addBilling}
                                  style={styles.addTypeTextInput}
                                  mode={'outlined'}
                                  theme={{
                                    colors: {
                                      text: '#25AAE1ec',
                                      primary: '#25AAE1ec',
                                      selectionColor: 'red',
                                    },
                                  }}
                                  onChangeText={(text) => {
                                    setAddBilling(text);
                                  }}
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => cancelAddType()}>
                                    <Text style={styles.addTypeButtons}>
                                      Cancel
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => doneAddType('Billing')}
                                    disabled={addBilling ? false : true}>
                                    <Text
                                      style={[
                                        styles.addTypeButtons,
                                        {
                                          color: addBilling
                                            ? '#25AAE1ec'
                                            : '#d0d0d0',
                                        },
                                      ]}>
                                      Add
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View style={styles.mainDropDownView}>
                                <SearchableDropDown
                                  onItemSelect={(item) => {
                                    setBillingCompany(item.name);
                                    setBillingCompanyId(item.id);
                                  }}
                                  containerStyle={styles.dropDownContainer}
                                  itemStyle={styles.dropDownItems}
                                  itemTextStyle={styles.dropDownItemText}
                                  itemsContainerStyle={
                                    styles.dropDownItemContainer
                                  }
                                  items={billCompList}
                                  resetValue={false}
                                  textInputProps={{
                                    placeholder: 'Billing Company',
                                    underlineColorAndroid: 'transparent',
                                    style: styles.dropDownTextInput,
                                    onTextChange: (text) => {
                                      setBillingCompany(text);
                                    },
                                    value: setTimeout(
                                      () => BillingCompany,
                                      200,
                                    ),

                                    defaultValue: BillingCompany,
                                  }}
                                  listProps={{
                                    nestedScrollEnabled: true,
                                  }}
                                />
                                <TouchableOpacity
                                  style={styles.addNewButton}
                                  onPress={() => showAddNewType('Billing')}>
                                  <Icon
                                    size={width * 0.06}
                                    color="#fff"
                                    name={'add'}
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </View> */}
                    </View>
                  </KeyboardAwareScrollView>
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
