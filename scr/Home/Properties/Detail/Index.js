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
  ActivityIndicator,
  ToastAndroid,
  Image,
  LayoutAnimation,
  PermissionsAndroid,
} from 'react-native';

//Packages
import Iconi from 'react-native-vector-icons/Ionicons';
import EncryptedStorage from 'react-native-encrypted-storage';
import Menu from 'react-native-vector-icons/Entypo';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Locate from 'react-native-vector-icons/Feather';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Modal from 'react-native-modal';
import Folder from 'react-native-vector-icons/Feather';
import Equip from 'react-native-vector-icons/Feather';
import Chart from 'react-native-vector-icons/Feather';
import Message from 'react-native-vector-icons/Feather';
import Docs from 'react-native-vector-icons/Ionicons';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
  VictoryPie,
} from 'victory-native';
import SearchableDropDown from 'react-native-searchable-dropdown';
import ContextProp from '../Context/propContext';
import {TextInput, FAB, HelperText} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
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
import style from './style';
import {Fonts} from '../../../utils/fonts';
import Base_URL from '../../../api/WebServices';
import {create} from 'apisauce';
import CustumStatusBar from '../../../components/StatusBar';
import Loader from '../../../components/Loader';
import AddEditProperty from '../../../components/modal/AddEditProperty';
import SystemSetting from 'react-native-system-setting';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const dataBar2 = {
  actual: [
    null,
    {x: 'MON', y: 11},
    {x: 'TUE', y: 15},
    {x: 'WED', y: 18},
    {x: 'THU', y: 1},
    {x: 'FRI', y: 5},
    {x: 'SAT', y: 2},
    {x: 'SUN', y: 3},
  ],
  planned: [
    null,
    {x: 'MON', y: 12},
    {x: 'TUE', y: 10},
    {x: 'WED', y: 13},
    {x: 'THU', y: 1},
    {x: 'FRI', y: 5},
    {x: 'SAT', y: 2},
    {x: 'SUN', y: 8},
  ],
};
const api = create({baseURL: Base_URL});

export default class Splash extends React.Component {
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
    this.setState({isLoading: true});
    this.getToken();
    Geocoder.init('AIzaSyAVCQa1ZgYSuqHfZLIkhMQ_C6W5L5Wi42A');
    const token = await EncryptedStorage.getItem('user_token');
    console.log('Get Token', token);
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const propertyData = this.props.navigation.state.params.item.item;
    this.getPropertyDetails(propertyData?.id);
    this.getMetersLocation(propertyData?.id);
    console.log('Property Data', propertyData?.data?.data?.property);

    console.log(
      'LIST DATA >>>>>',
      this.props.navigation.state.params.item.item,
    );
  }

  getPropertyDetails = async (id) => {
    this.setState({isLoading: true});
    const transceiverRes = await api.get(`/property/transceivers${id}`);

    if (transceiverRes?.data?.bool) {
      this.setState({
        onlineUnits: transceiverRes?.data?.data?.transceivers[0],
        offlineUnits: transceiverRes?.data?.data?.transceivers[1],
      });
    }

    const propertyRes = await api.get(`/property/${id}`);
    console.log('PROPERTYRES', propertyRes?.data?.data?.property);

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

    this.setState({
      propertyData: currPropData,
      propertyId: currPropData?.id,
      listData: currPropData,
      lat: currPropData.latitude,
      long: currPropData.longitude,
      BillingCompany: currPropData?.billing_company,
      BillingCompanyId: currPropData?.billing_company_id,
      managementCompany: currPropData?.management_company,
      managementCompanyId: currPropData?.management_company_id,
      customId: currPropData.custom_id,
      isLoading: false,
    });

    var lat = parseFloat(currPropData.latitude);
    var long = parseFloat(currPropData.longitude);
    Geocoder.from({
      latitude: lat,
      longitude: long,
    })
      .then((json) => {
        console.log('JSON', json.results[0]);
        var locationName = json.results[0].formatted_address;
        this.setState({
          locationBtn: locationName,
        });
      })
      .catch((error) => console.warn(error));
  };

  getToken = async () => {
    this.context.getBillingCompany();
    this.context.getManagementCompany();
    const token = await EncryptedStorage.getItem('user_token');
    console.log('Get Token', token);
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }

    const ownerRes = await api.get('/property/owner/own');

    console.log('ownerRes--->', ownerRes?.data?.data);
    this.setState({ownerData: ownerRes?.data?.data});
  };

  getMetersLocation = async (propertyId) => {
    const token = await EncryptedStorage.getItem('user_token');
    console.log('Get Token', token);
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    this.setState({isLoading: true});
    const metersLocation = await api.get(
      `/property/location-meters/${propertyId}`,
    );
    console.log('Meters Location', metersLocation?.data?.data);
    if (metersLocation?.data?.bool) {
      this.setState({markers: metersLocation?.data?.data, isLoading: false});
      let index = metersLocation?.data?.data.length - 1;
      this.setState({
        propMarkers: metersLocation?.data?.data[index]?.property?.position,
      });
    }
  };

  getBack = () => {
    this.props.navigation.goBack();
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    // this.getToken();
    // Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');
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
      // Geolocation.getCurrentPosition(
      //   (position) => {
      //     var lat = parseFloat(position.coords.latitude);
      //     var long = parseFloat(position.coords.longitude);
      //     // this.setState({lat: lat, long: long});
      //     Geocoder.from({
      //       latitude: lat,
      //       longitude: long,
      //     })
      //       .then((json) => {
      //         var locationName = json.results[0].formatted_address;
      //         console.log('LOACTION NAME', locationName);
      //         // this.fetchAddressData(locationName);
      //         this.setState({
      //           locationBtn: locationName,
      //         });
      //       })
      //       .catch((error) => console.warn(error));
      //   },
      //   (error) => console.log('geo locations', error),
      //   {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      // );
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
      const propertyRes = await api.get(`/property/${this.state.propertyId}`);
      console.log('PROPERTYRES', propertyRes?.data?.data?.property);

      this.setState({propertyData: propertyRes?.data?.data?.property});

      if (propertyRes?.data?.bool) {
        this.setState({isEditPropVisible: true, propertyflag: true});
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

  toggleModalEditProp = () => {
    this.setState({
      isModalAdEditPropVisible: !this.state.isModalAdEditPropVisible,
    });
    this.context.getBillingCompany();
    this.context.getManagementCompany();
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        property: '',
        property_id: '',
        street: '', // update the value of specific key
      },
    }));
  };

  onEditSucces = () => {
    this.setState({
      isEditPropVisible: false,
      isLoading: true,
      isLoading: false,
    });
    this.getPropertyDetails(this.state.propertyId);
  };

  onCancel = () => {
    this.setState({
      listData: this.props.navigation.state.params.item.item,
      // isModalAdEditPropVisible: !this.state.isModalAdEditPropVisible,
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
    // let deviceData = [...this.state.addDevice]; // copying the old datas array
    // deviceData[0].select = '';
    // deviceData[0].selectId = '';
    // deviceData[1].select = '';
    // deviceData[1].selectId = '';
    // deviceData[2].select = '';
    // deviceData[2].selectId = '';
    this.setState({
      addNewType: false,
      showAddType: '',
      addBilling: '',
      addManagement: '',
      // addManufacturer: '',
      // addUtility: '',
      // addMeter: '',
      // addDevice: deviceData,
      // devicesArray: [],
      // modelArr: [],
      // selectedDevice: {},
      // addModelNumber: '',
      // productNo: '',
      // modelNo: '',
    });
  };

  editProp = async () => {
    if (this.state?.listData?.name === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: 'Invalid Property', // update the value of specific key
        },
      }));
      ToastAndroid.show('Invalid Property', ToastAndroid.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: false, // update the value of specific key
        },
      }));
    }
    // if (this.state?.listData?.property_id === '') {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       property_id: 'Invalid Custom ID', // update the value of specific key
    //     },
    //   }));
    //   ToastAndroid.show('Invalid Property', ToastAndroid.SHORT);

    //   return;
    // } else {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       property_id: false, // update the value of specific key
    //     },
    //   }));
    // }
    if (this.state.BillingCompanyId == null) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: 'Please select Billing ID', // update the value of specific key
        },
      }));
      ToastAndroid.show('Please Select Billing Company', ToastAndroid.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: false, // update the value of specific key
        },
      }));
    }
    if (this.state?.listData?.street === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: 'Invalid Street Name', // update the value of specific key
        },
      }));
      ToastAndroid.show('Invalid Street', ToastAndroid.SHORT);

      return;
    } else {
      this.setState({isLoading: true});
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: false, // update the value of specific key
        },
      }));
      const data = {
        property_id: this.state.customId,
        zipcode: this.state.listData.zipcode,
        name: this.state.listData.name,
        street: this.state.listData.street,
        city: this.state.listData.city,
        billing_company_id: this.state.BillingCompanyId,
        management_company: this.state.managementCompany,
        billing_company: this.state.BillingCompany,
        management_company_id: this.state.managementCompanyId,
        contact_name: this.state.listData.contact_name,
        contact_title: this.state.listData.contact_title,
        contact_phone: this.state.listData.contact_phone,
        contact_email: this.state.listData.contact_email,
        // maintainance_email: null,
        // maintainance_name: null,
        // maintainance_phone_number: null,
        // maintainance_superviser_contact: null,
        // maintainance_superviser_email: null,
        // maintainance_superviser_name: null,
        // office_contact_number: null,
      };

      const response = await api.patch(
        `/property/update/${this.state?.listData?.id}`,
        data,
      );

      console.log(response?.data);
      this.setState({isLoading: false});
      if (response?.data?.bool) {
        this.toggleModalEditProp();
      } else {
        Alert.alert('Error', response?.data?.message);
      }
    }
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

  naviagateToSupport = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  showMoreFn = (indexx) => {
    // this.setState({
    //   addNewType: false,
    //   // showEditManufacturer: false,
    //   // showAddManufacturer: false,
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
  };

  selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    this.setState({selectLocation: true});
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
    this.setState((prevState) => ({
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        billingId: '',
      },
    }));
  };
  doneAddType = async (val, temp) => {
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
      this.setState({loadingStateBill: true});
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
        this.setState({loadingStateBill: false});
        alert(BillingResponse?.data?.message);
      } else {
        this.setState({loadingStateBill: false});
        alert(BillingResponse?.data?.message);
      }
    } else if (this.state.showAddType == 'Management' || val == 'Management') {
      let data = {
        manager_name: this.state.addManagement,
      };
      console.log('Management Company data -->>', data);
      this.setState({loadingStateManage: true});
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

        this.setState({loadingStateManage: false});
        alert(ManagementResponse?.data?.message);
      } else {
        this.setState({loadingStateManage: false});
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
        this.getToken();
        this.cancelAddType();
        this.setState({loadingStateDev: false});
        alert(DeviceTypesR4esponse?.data?.message);
      } else {
        this.setState({loadingStateDev: false});
        alert(DeviceTypesResponse?.data?.message);
      }
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

  handleCloseDropDown = () => {
    this.setState({BillingCompany: 'BILLING COMPANY'});
    this.setState({open: false});
  };

  toggleflag = () => {
    console.log('TOGGLEFLAG');
    this.setState({propertyflag: false});
  };

  render() {
    const {onlineUnits, offlineUnits} = this.state;
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
          <Modal
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            isVisible={this.state.isModalVisible}
            swipeDirection="left"
            onSwipeStart={() => this.toggleModal()}
            onBackdropPress={() => this.toggleModal()}
            backdropColor="black"
            statusBarTranslucent
            style={styles.sideModalContainer}>
            <CustumStatusBar backColor />
            <View style={{backgroundColor: '#35afe2', height: height * 0.05}} />
            <View style={styles.drawerMainContainer}>
              <View>
                <Menu
                  name="menu"
                  size={height * 0.05}
                  color="white"
                  onPress={() => this.toggleModal()}
                  style={{backgroundColor: '#35afe2'}}
                />
              </View>
              <View style={styles.drawerContentContainer}>
                <TouchableOpacity onPress={() => this.naviagateToDetail()}>
                  <View style={styles.drawerContent}>
                    <Detail
                      name="account-details-outline"
                      size={height * 0.035}
                      color="#7575ff"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Details</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.naviagateToEquip()}>
                  <View style={styles.drawerContent}>
                    <Equip
                      name="rss"
                      size={height * 0.035}
                      color="#ff9f71"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Units</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.naviagateToChart()}>
                  <View style={styles.drawerContent}>
                    <Chart
                      name="pie-chart"
                      size={height * 0.035}
                      color="#009349"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Charts</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{bottom: height * 0.05}}
                onPress={this.naviagateToSupport}>
                <View
                  style={[
                    styles.drawerBottom,
                    {
                      flexDirection: 'row',
                      // alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: height * 0.015,
                      marginBottom: height * 0.01,
                    },
                  ]}>
                  <Detail
                    name="help-circle-outline"
                    size={height * 0.035}
                    color="#35afe2"
                    style={{
                      ...styles.drawerBtnIcon,
                      bottom: Platform.OS == 'ios' ? 2 : null,
                    }}
                  />
                  <Text style={styles.drawerbtn}>Support</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
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
                size={height * 0.04}
                color="white"
                style={{right: 90}}
                onPress={this.toggleModal}
              />
              <View style={{flexDirection: 'row', right: 15}}>
                <Detail
                  name="account-details-outline"
                  size={height * 0.05}
                  color="white"
                  style={{top: height * 0.002}}
                />
                <Text style={styles.mainHeadiing}>Details</Text>
              </View>
            </View>
          </View>
          <ScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled">
            <View style={styles.bodyContainer}>
              <MapView
                style={styles.map}
                scrollEnabled={false}
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

                {this.state.markers.length > 0 &&
                  this.state.markers.map(
                    (marker) =>
                      marker?.position?.lat && (
                        <Marker
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
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                coverScreen={true}
                statusBarTranslucent={true}
                style={{
                  margin: 0,
                }}
                isVisible={this.state.isModalAdEditPropVisible}>
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
                          <Text style={styles.modalHeading}>Edit Property</Text>
                          <Pressable
                            onPress={this.onCancel}
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
                        keyboardShouldPersistTaps={'handled'}>
                        <View style={{flex: 1}}>
                          <TouchableOpacity
                            style={styles.desciptionContainer}
                            onPress={() => this.showMoreFn(0)}>
                            <Text style={styles.desciptionHeading}>
                              Property Name & Address
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
                              label="Property Name*"
                              value={this.state?.listData?.name}
                              error={this.state.error.property}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    name: text, // update the value of specific key
                                  },
                                  error: {
                                    // object that we want to update
                                    ...prevState.error, // keep all other key-value pairs
                                    property: '',
                                  },
                                }));
                              }}
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
                                  width: width * 0.65,
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
                            onPress={() => this.showMoreFn(1)}>
                            <Text style={[styles.desciptionHeading]}>
                              Utility Type, Manufacturer & Device
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
                          {/* <View style={styles.inputContainer}>
                            <TextInput
                              value={this.state?.listData?.street}
                              error={this.state.error.street}
                              label="Street*"
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    street: text, // update the value of specific key
                                  },
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
                              value={this.state?.listData?.city}
                              error={this.state.error.city}
                              label="City"
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    city: text, // update the value of specific key
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
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              },
                            ]}>
                            <TextInput
                              value={this.state?.listData?.st}
                              error={this.state.error.st}
                              label="St"
                              style={[styles.input, {width: width * 0.36}]}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    st: text, // update the value of specific key
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

                            <TextInput
                              value={this.state?.listData?.zipcode}
                              error={this.state.error.zipcode}
                              label="ZipCode"
                              style={[styles.input, {width: width * 0.36}]}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    zipcode: text, // update the value of specific key
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
                          <View style={styles.inputContainer}>
                            <TextInput
                              label="Custom ID*"
                              error={this.state.error.property_id}
                              value={this.state.customId}
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState({customId: text});
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    property_id: text, // update the value of specific key
                                  },
                                  error: {
                                    // object that we want to update
                                    ...prevState.error, // keep all other key-value pairs
                                    property_id: '',
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
                          </View> */}
                          <TouchableOpacity
                            style={styles.desciptionContainer}
                            onPress={() => this.showMoreFn(2)}>
                            <Text style={styles.desciptionHeading}>
                              owner info & contact person
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
                            style={[
                              styles.inputContainer,
                              {
                                height: this.state.dropDownShow[2].value
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
                                height: this.state.dropDownShow[2].value
                                  ? 'auto'
                                  : height * 0.0,

                                overflow: 'hidden',
                              },
                            ]}>
                            <SearchableDropDown
                              onItemSelect={(item) => {
                                this.setState({
                                  CustomerName: item.id,
                                  ownerName: item.name,
                                });
                              }}
                              containerStyle={{
                                paddingVertical: width * 0.02,
                                width: '99.50%',
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
                              items={this.state.ownerData}
                              resetValue={false}
                              textInputProps={{
                                placeholder: 'Owner or Developer Name',
                                underlineColorAndroid: 'transparent',
                                style: {
                                  padding: width * 0.027,
                                  margin: 0,
                                  borderRadius: 5,
                                  borderColor: 'black',
                                  height: width * 0.13,
                                  backgroundColor: '#F6F6F6',
                                  borderWidth: width * 0.0019,
                                  zIndex: 0,
                                },
                                onTextChange: (text) => {
                                  this.setState({ownerName: text});
                                },
                                value: setTimeout(
                                  () => this.state.ownerName,
                                  200,
                                ),
                                defaultValue: this.state.ownerName,
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
                                height: this.state.dropDownShow[2].value
                                  ? 'auto'
                                  : height * 0.0,

                                overflow: 'hidden',
                              },
                            ]}>
                            <TextInput
                              placeholder="Contact Name"
                              label="Contact Name"
                              style={styles.input}
                              value={this.state.listData?.contact_name}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    contact_name: text, // update the value of specific key
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
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: this.state.dropDownShow[2].value
                                  ? 'auto'
                                  : height * 0.0,

                                overflow: 'hidden',
                              },
                            ]}>
                            <TextInput
                              placeholder="Phone"
                              label="Phone"
                              style={styles.input}
                              value={this.state.listData?.contact_phone}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    contact_phone: text, // update the value of specific key
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
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: this.state.dropDownShow[2].value
                                  ? 'auto'
                                  : height * 0.0,

                                overflow: 'hidden',
                              },
                            ]}>
                            <TextInput
                              placeholder="Email"
                              label="Email"
                              style={styles.input}
                              value={this.state.listData?.contact_email}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    contact_email: text, // update the value of specific key
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

                          <TouchableOpacity
                            style={styles.desciptionContainer}
                            onPress={() => {
                              this.showMoreFn(3);
                            }}>
                            <Text style={styles.desciptionHeading}>
                              management company*
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
                          <View
                            style={{
                              width: '100%',
                              zIndex: 2,
                              alignSelf: 'center',
                              alignItems: 'center',
                              height: this.state.dropDownShow[3].value
                                ? 'auto'
                                : height * 0.0,
                              overflow: 'hidden',
                            }}>
                            {this.state.loadingStateManage ? (
                              <ActivityIndicator
                                size="large"
                                color={'#25AAE1ec'}
                              />
                            ) : this.state.addNewType &&
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
                                  placeholder={
                                    'Type New Management Company Name'
                                  }
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
                                    onPress={() =>
                                      this.doneAddType('Management')
                                    }
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
                                  items={this.context.manageCompList}
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
                                    defaultValue: this.state.managementCompany,
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
                            onPress={() => {
                              this.showMoreFn(4);
                            }}>
                            <Text style={styles.desciptionHeading}>
                              billing company*
                            </Text>
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
                            style={{
                              width: '100%',
                              zIndex: 2,
                              alignSelf: 'center',
                              alignItems: 'center',
                              height: this.state.dropDownShow[4].value
                                ? 'auto'
                                : height * 0.0,
                              overflow: 'hidden',
                            }}>
                            {this.state.loadingStateBill ? (
                              <ActivityIndicator
                                size="large"
                                color={'#25AAE1ec'}
                              />
                            ) : this.state.addNewType &&
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
                                    onPress={() => this.doneAddType('Billing')}
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
                                    defaultValue: this.state.BillingCompany,
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
                          </View>
                          {/* <View style={styles.inputContainer}>
                            <TouchableOpacity
                              onPress={() => this.handleOpenDropDown(true)}
                              style={{
                                ...styles.billingCompanyBtn,
                                borderColor: this.state.error.billingId
                                  ? '#A3001B'
                                  : 'gray',
                              }}>
                              <Text>
                                {this.state.BillingCompany == null
                                  ? 'Select Company'
                                  : this.state.BillingCompany}
                              </Text>
                            </TouchableOpacity>
                            <Modal
                              animationIn="fadeIn"
                              animationOut="fadeOut"
                              isVisible={this.state.open}
                              style={styles.billingModalContainer}>
                              <View style={styles.billingModalInner}>
                                <View style={styles.billingModalHeader}>
                                  <Text style={styles.billingModalHeading}>
                                    {this.state.companies
                                      ? 'Billing Companies'
                                      : 'Managemnet Companies'}
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
                                {this.context.propitemList < 0 && (
                                  <ActivityIndicator
                                    color={'#25AAE1ec'}
                                    size={'large'}
                                  />
                                )}
                                {this.context.propitemList &&
                                  this.state.companies &&
                                  this.context.propitemList.map((data) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.handleDropDownData(data)
                                      }
                                      style={styles.billingCompanies}>
                                      <Text>{data.name}</Text>
                                    </TouchableOpacity>
                                  ))}
                                {this.context.manageCompList &&
                                  !this.state.companies &&
                                  this.context.manageCompList.map((data) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.handleDropDownData(data)
                                      }
                                      style={styles.billingCompanies}>
                                      <Text>{data.manager_name}</Text>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            </Modal>
                          </View> */}
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
                            onPress={this.editProp}
                            style={styles.submitBotton}
                            color="white"
                            icon="check"
                            label="Update"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={styles.mainDataContainer}>
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
                        <Text
                          style={[
                            styles.dataFieldText,
                            {width: null, textAlign: 'auto'},
                          ]}>
                          {item == null || item == ''
                            ? '--'
                            : this.state.utilTypes.length - 1 == index
                            ? item
                            : item + ', '}
                        </Text>
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
                        <Text
                          style={[
                            styles.dataFieldText,
                            {width: null, textAlign: 'auto'},
                          ]}>
                          {item == null || item == ''
                            ? '--'
                            : this.state.manus.length - 1 == index
                            ? item
                            : item + ', '}
                        </Text>
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

                <View style={styles.barViewContainer}>
                  <View style={styles.barView}>
                    <VictoryPie
                      width={width * 0.75}
                      height={width * 0.75}
                      innerRadius={width * 0.35}
                      labelRadius={width * 0.28}
                      data={[
                        {x: onlineUnits, y: onlineUnits},
                        {x: offlineUnits, y: offlineUnits},
                      ]}
                      colorScale={['#175CA1', '#DCDCDC']}
                      style={{
                        labels: {
                          fill: 'white',
                          fontWeight: 'bold',
                          alignItems: 'center',
                        },
                      }}
                    />
                    {/* <AnimatedCircularProgress
                      size={height * 0.2}
                      width={height * 0.035}
                      backgroundWidth={height * 0.035}
                      fill={this.state.points}
                      tintColor="#09BAF2"
                      backgroundColor="#3d5875"
                      arcSweepAngle={360}
                      rotation={0}
                      lineCap="butt">
                      {(fill) => (
                        <Text style={styles.barText}>
                          Transceiver {'\n'} {Math.round((100 * fill) / 100)} %
                        </Text>
                      )}
                    </AnimatedCircularProgress> */}
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
