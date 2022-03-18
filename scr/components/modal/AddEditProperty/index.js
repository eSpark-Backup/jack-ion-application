import React, {useEffect, useReducer, useRef, useState} from 'react';

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
  Keyboard,
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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';

//Component
import styles from './style';
import {Fonts} from '../../../utils/fonts';
import Base_URL from '../../../api/WebServices';
import style from './style';
import clc from 'cli-color';

export default function AddEditProperty({
  modalVisible,
  closeModal,
  type,
  currAddr,
  currLocate,
  addedSuccessfully,
  propertyData,
  flag,
  toggleflag,
}) {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0322;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const circleRef = useRef(null);
  const api = create({baseURL: Base_URL});

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loadManuList, setLoadManuList] = useState(false);
  const [loadingStateDev, setLoadingStateDev] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [addNewUType, setAddNewUType] = useState(false);
  const [addNewType, setAddNewType] = useState(false);
  const [showAddType, setShowAddType] = useState('');
  const [showAddManufacturer, setShowAddManufacturer] = useState(false);
  const [showEditManufacturer, setShowEditManufacturer] = useState(false);
  const [allManuList, setAllManuList] = useState([]);
  const [utilTypes, setUtilTypes] = useState([]);
  const [addManufacturer, setAddManufacturer] = useState('');
  const [addUtility, setAddUtility] = useState('');
  const [selectAddManuUtil, setSelectAddManuUtil] = useState([]);
  const [manufacturersArray, setManufacturersArray] = useState([]);
  const [currentManuIndex, setCurrentManuIndex] = useState(null);
  const [avoidKeyboard, setAvoidKeyboard] = useState(false);
  const [avoidMargin, setAvoidMargin] = useState(0);
  const [selectLocation, setSelectLocation] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [latDelta, setLatDelta] = useState(LATITUDE_DELTA);
  const [longDelta, setLongDelta] = useState(LONGITUDE_DELTA);
  const [radialDis, setRadialDis] = useState(0.1);
  const [locationBtn, setLocationBtn] = useState('');
  const [CustomId, setCustomId] = useState('');
  const [unitTypeList, setUnitTypeList] = useState([{id: 1, name: 'br'}]);
  const [classesList, setClassesList] = useState([{id: 1, name: 'br'}]);
  const [unitCount, setUnitCount] = useState('');
  const [unitMix, setUnitMix] = useState([]);
  const [sqft, setSqft] = useState('');
  const [unitType, setUnitType] = useState('');
  const [classes, setClasses] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [addUnitMix, setAddUnitMix] = useState(false);
  const [unitMixIndex, setUnitMixIndex] = useState(null);
  const [unitMixFlag, setUnitMixFlag] = useState(false);
  const [ownerData, setOwnerData] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [Name, setName] = useState('');
  const [propertyFlag, setPropertyFlag] = useState(false);
  const [Street, setStreet] = useState('');
  const [City, setCity] = useState('');
  const [State, setState] = useState('');
  const [ZipCode, setZipCode] = useState('');
  const [utilAndManu, setUtilAndManu] = useState([
    {
      id: 0,
      select: '',
      selectId: '',
      error: '',
      name: 'Utility Type',
      placeholder: 'Select Utilty Type',
      data: [],
    },
    {
      id: 0,
      select: '',
      selectId: '',
      error: '',
      name: 'Manufacturer',
      data: [],
    },
  ]);
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
    console.log('CurrLocate', currLocate.lat);

    console.log('AGAY BRHA');
    callApi();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    return () => {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    };
  }, []);

  if (flag && !propertyFlag) {
    console.log('flag true');
    if (propertyData) {
      console.log('PROPERTY DATA', propertyData);
      console.log(
        'utility_manufacturers DATA',
        propertyData.utility_manufacturers,
      );
      const Manufactures = propertyData.utility_manufacturers;

      let newArr = [...manufacturersArray];
      for (let i = 0; i < Manufactures?.length; i++) {
        newArr.push({
          id: Manufactures[i].id,
          name: Manufactures[i].manufacturer.name,
          manufacturer_id: Manufactures[i].manufacturer.id,
          utility_type: Manufactures[i].utility_type.name,
          utility_type_id: Manufactures[i].utility_type.id,
        });
        console.log('newArr Batao', newArr);
      }
      setManufacturersArray(newArr);

      setName(propertyData?.name);
      setStreet(propertyData?.street);
      setCity(propertyData?.city);
      setState(propertyData?.st);
      setZipCode(propertyData?.zipcode);
      setCustomId(propertyData?.custom_id);
      setOwnerId(propertyData?.owner_id);
      setOwnerName(propertyData?.owner);
      setUnitMix(propertyData?.unit_mixes);
      setUnitCount(propertyData?.unit_count?.toString());
      setRadialDis(propertyData?.radial_dist);
      setContactName(propertyData?.contact_name);
      setContactPhone(propertyData?.contact_phone);
      setContactEmail(propertyData?.contact_email);
      setLat(propertyData?.latitude);
      setLong(propertyData?.longitude);
      setLocationSelected(true);
    }
    setPropertyFlag(true);
    toggleflag();
  }

  const _keyboardDidShow = () => {
    animate();
    console.log('KEYBORD SHOW');
    if (dropDownShow[2].value) {
      setAvoidMargin(0.35);
      setAvoidKeyboard(true);
    } else if (dropDownShow[3].value) {
      setAvoidMargin(0.45);
      setAvoidKeyboard(true);
    }
  };

  const _keyboardDidHide = () => {
    animate();
    setAvoidKeyboard(false);
  };

  const callApi = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }

    const ownerRes = await api.get('/property/owner/own');

    console.log('ownerRes--->', ownerRes?.data?.data);
    setOwnerData(ownerRes?.data?.data);

    const manuResponse = await api.get('/property/equipment/manufacturer/all');

    setAllManuList(manuResponse?.data?.data);

    const utilRes = await api.get('/property/equipment/utility-type');

    let utilArr = [...utilAndManu];
    utilArr[0].data = utilRes?.data?.data;
    setUtilAndManu(utilArr);
    setUtilTypes(utilRes?.data?.data);
  };

  const onChangeUtilAndManu = (e, index) => {
    let listSlide = [...utilAndManu]; // copying the old datas array

    if (index == 0) {
      listSlide[index].select = e; // replace e.target.value with whatever you want to change it to
      listSlide[0].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[0].error = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].select = '';
      listSlide[1].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[1].error = ''; // replace e.target.value with whatever you want to change it to
    } else if (index == 1) {
      listSlide[index].select = e;
      listSlide[index].selectId = ''; // replace e.target.value with whatever you want to change it to
      listSlide[index].error = ''; // replace e.target.value with whatever you want to change it to
    }
    setUtilAndManu(listSlide);
  };

  const animate = () => {
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
  };

  const AddTypes = (item) => {
    console.log('PUSHING', item);
    const items = selectAddManuUtil;
    items.push(item);
    console.log('PUSHED', items);
    setSelectAddManuUtil(items);
    console.log('AFTER PUSHED');
    forceUpdate();
  };

  const getData = async (some, index) => {
    console.log('get devices--->', some);

    let listSlide = [...utilAndManu]; // copying the old datas array
    listSlide[index].select = some?.name; // replace e.target.value with whatever you want to change it to
    listSlide[index].selectId = some?.id; // replace e.target.value with whatever you want to change it to
    console.log('XX___--->>', some?.name);
    if (index == 0) {
      let allManu = [...allManuList];

      let temp = [];
      let listSlide2 = [...utilAndManu]; // copying the old datas array

      allManu.map((manuItem) => {
        if (manuItem?.utility_type[0]?.name != undefined) {
          if (some.name == manuItem?.utility_type[0]?.name) {
            temp.push(manuItem);
            listSlide2[1].data = temp;
            setUtilAndManu(listSlide2);
          }
        }
      });
      let updateData = [...utilAndManu];
      updateData[1].select = ''; // replace e.target.value with whatever you want to change it to
      updateData[1].selectId = '';
      setUtilAndManu(updateData);
    }

    setUtilAndManu(listSlide);
  };

  const AddNewRow = () => {
    let arr = [...unitMix];
    let data = {
      square_feets: sqft,
      unit_type: unitType,
      classes: classes,
      bedrooms: bedrooms,
    };
    arr.push(data);
    setUnitMix(arr);
    clearUnitMixData();
  };

  const editOldRow = () => {
    let editArr = [...unitMix];
    editArr[unitMixIndex].square_feets = sqft;
    editArr[unitMixIndex].unit_type = unitType;
    editArr[unitMixIndex].classes = classes;
    editArr[unitMixIndex].bedrooms = bedrooms;
    setUnitMix(editArr);
    clearUnitMixData();
  };

  const deleteRow = async (index, id) => {
    if (type == 'Edit') {
      const token = await EncryptedStorage.getItem('user_token');
      if (token != null) {
        api.setHeader('Authorization', 'Bearer ' + token);
      }
      const delUnitMix = await api.delete(`/property/unit-mix/unitMix/${id}`);
      console.log('DELUNITMIX', delUnitMix);
      if (delUnitMix?.data?.bool) {
        let arr = [...unitMix];
        arr.splice(index, 1);
        setUnitMix(arr);
      }
    } else {
      let arr = [...unitMix];
      arr.splice(index, 1);
      setUnitMix(arr);
    }
  };

  const getRowData = (item, index) => {
    setUnitMixFlag(true);
    setSqft(item.square_feets);
    setUnitType(item.unit_type);
    setClasses(item.classes);
    setBedrooms(item.bedrooms);
    setUnitMixIndex(index);
    setAddUnitMix(true);
  };

  const clearUnitMixData = () => {
    animate();
    setSqft('');
    setUnitType('');
    setClasses('');
    setBedrooms('');
    setUnitMixIndex(null);
    setUnitMixFlag(false);
    setAddUnitMix(false);
  };

  const showMoreFn = (indexx) => {
    setAddNewType(false);
    setShowAddManufacturer(false);
    setShowEditManufacturer(false);
    animate();
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

  const addManufacturers = () => {
    animate();

    const compareName = (obj1, obj2) => {
      return obj1.name === obj2.name;
    };

    let newArr = [...manufacturersArray]; // used for adding in the list
    let deviceArr = [...utilAndManu]; // used for clearing data
    let deviceArr2 = [...allManuList]; // used for clearing data

    newArr.push({
      name: utilAndManu[1].select,
      manufacturer_id: utilAndManu[1].selectId,
      utility_type: utilAndManu[0].select,
      utility_type_id: utilAndManu[0].selectId,
    });

    deviceArr[0].select = '';
    deviceArr[0].selectId = '';
    deviceArr[1].select = '';
    deviceArr[1].selectId = '';

    deviceArr2 = deviceArr2.filter((b) => {
      let indexFound = newArr.findIndex((a) => compareName(a, b));
      return indexFound === -1;
    });

    setManufacturersArray(newArr);
    setShowAddManufacturer(false);
    setAllManuList(deviceArr2);
  };

  const editManufacturers = () => {
    animate();

    let newArr = [...manufacturersArray];
    if (manufacturersArray[currentManuIndex]?.id) {
      newArr[currentManuIndex].id = manufacturersArray[currentManuIndex]?.id;
    }
    newArr[currentManuIndex].name = utilAndManu[1].select;
    newArr[currentManuIndex].manufacturer_id = utilAndManu[1].selectId;
    newArr[currentManuIndex].utility_type = utilAndManu[0].select;
    newArr[currentManuIndex].utility_type_id = utilAndManu[0].selectId;
    setManufacturersArray(newArr);
    setShowEditManufacturer(false);
  };

  const DeleteManufacture = (item) => {
    setLoadManuList(true);
    console.log('DEVICE DATA', utilAndManu[0].data);
    checkManufacture(item);
  };

  const checkManufacture = async (item) => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const ManufacturersResponse = await api.get(
      '/property/equipment/manufacturer/all',
    );
    console.log('ManufacturersResponse', ManufacturersResponse?.data);
    animate();
    const delManu = await api.delete(`/property/pivot/${item.id}`);
    console.log('DELMANU', delManu);

    let manuData = [...allManuList];
    manuData = ManufacturersResponse?.data?.data;

    const items = manufacturersArray.filter(
      (sitem) => sitem.manufacturer_id !== item.manufacturer_id,
    );

    console.log('ITEMS', items);

    let result = manuData.filter(
      (o1) => !items.some((o2) => o1.id === o2.manufacturer_id),
    );

    console.log(clc.redBright('Kia hai all manufacs', JSON.stringify(result)));
    setManufacturersArray(items);
    setAllManuList(result);
    setLoadManuList(false);
  };

  const cancelManu = (flag) => {
    if (flag == 'add') {
      let utilManuArr = [...utilAndManu]; // used for clearing data
      utilManuArr[0].select = '';
      utilManuArr[0].selectId = '';
      utilManuArr[1].select = '';
      utilManuArr[1].selectId = '';
      setUtilAndManu(utilManuArr);
      setShowAddManufacturer(false);
    } else {
      let utilManuArr = [...utilAndManu]; // used for clearing data
      utilManuArr[0].select = '';
      utilManuArr[0].selectId = '';
      utilManuArr[1].select = '';
      utilManuArr[1].selectId = '';
      setUtilAndManu(utilManuArr);
      setShowEditManufacturer(false);
    }
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
    var searchStrLen = searchStr?.length;
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
    animate();
    setAddNewType(true);
    setShowAddType(value);
  };

  const showAddUNewType = () => {
    animate();
    setAddNewUType(true);
  };

  const cancelAddUType = () => {
    animate();
    setAddNewUType(false);
    setShowAddType('Manufacturer');
  };

  const cancelAddType = () => {
    animate();
    setAddNewType(false);
    setShowAddType('');
    setAddManufacturer('');
    setAddUtility('');
    setSelectAddManuUtil([]);
  };

  const openAddManu = async () => {
    animate();

    setShowAddManufacturer(true);
  };

  const openEditManu = async (item, index) => {
    animate();

    console.log('get devices---> Open Edit');

    let newArr = [...utilAndManu];

    newArr[0].select = item.utility_type;
    newArr[0].selectId = item.utility_type_id;
    newArr[1].select = item.name;
    newArr[1].selectId = item.manu_Id;

    console.log('item.name', item.name);
    console.log('item.id', item.manu_Id);
    setUtilAndManu(newArr);
    setCurrentManuIndex(index);
    setShowEditManufacturer(true);
  };

  const addProperty = async () => {
    setBtnLoading(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const selectUtilIds = [];

    const selectManuIds = [];
    const utilAndManuIds = [];
    // this.setState({btnLoading: true});
    if (!Name) {
      setError((oldState) => ({
        ...oldState,
        property: 'Invalid Property Name',
      }));

      Toast.show('Invalid Property Name', Toast.SHORT);
      setBtnLoading(false);
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        property: '',
      }));
    }
    if (!Street) {
      setError((oldState) => ({
        ...oldState,
        street: 'Invalid Street',
      }));

      Toast.show('Invalid Street', Toast.SHORT);
      setBtnLoading(false);
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        street: '',
      }));
    }

    if (manufacturersArray?.length < 1) {
      setError((oldState) => ({
        ...oldState,
        utilType: 'Please select Manufacturer',
      }));

      Toast.show('Please select a Utility Type', Toast.SHORT);
      setBtnLoading(false);
      return;
    } else {
      console.log('MANUFACTURERS ARRAY', manufacturersArray);

      for (let i = 0; i < manufacturersArray?.length; i++) {
        if (type == 'Add') {
          utilAndManuIds.push({
            manufacturer_id: manufacturersArray[i].manufacturer_id,
            utility_type_id: manufacturersArray[i].utility_type_id,
          });
        } else {
          console.log('ELSE CHALA');

          utilAndManuIds.push({
            id: manufacturersArray[i].id ?? null,
            manufacturer_name: manufacturersArray[i].manufacturer_id,
            manufacturer_id: manufacturersArray[i].manufacturer_id,
            utility_type_id: manufacturersArray[i].utility_type_id,
          });
        }
      }
      console.log('SELECTED UTILITY IDs', selectUtilIds);
      setError((oldState) => ({
        ...oldState,
        utilType: '',
      }));
    }
    //! -------------------------+++

    if (!locationSelected) {
      Alert.alert('Location Required', 'Please Select Property Location');
      setBtnLoading(false);
      return;
    } else {
      setSelectLocation(false);

      // console.log('Before', this.state.info.propName);
      // const info = { ...this.state.info, propName: 'Good HAI' }
      let propData = {
        name: Name,
        street: Street,
        st: State,
        city: City,
        zipcode: ZipCode,
        custom_id: CustomId,
        owner_id: ownerId,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        // manufacturer_id: selectManuIds,
        // utility_type_id: selectUtilIds,
        unit_count: unitCount,
        utility_manufacturers: utilAndManuIds,
        unit_mixes: unitMix,
        radial_dist: Number(radialDis),
        latitude: lat,
        longitude: long,
      };

      console.log('PROPDATA', propData);
      if (type == 'Add') {
        const res = await api.post(`/property/add`, propData);
        console.log(res.data);
        if (res?.data?.bool) {
          console.log(res.data);
          addedSuccessfully();
          clearInputs();
          console.log('PROPERTY RUNNINg');
          setBtnLoading(false);
          Alert.alert('Success', 'Property Added Successfully');
        } else {
          Alert.alert('Error', res?.data?.message);
        }
      } else {
        const response = await api.patch(
          `/property/update/${propertyData.id}`,
          propData,
        );
        console.log(response?.data);
        if (response?.data?.bool) {
          console.log(response.data);
          addedSuccessfully();
          clearInputs();
          setBtnLoading(false);
          Alert.alert('Success', response?.data?.message);
        } else {
          Alert.alert('Error', response?.data?.message);
        }
      }

      // this.setState(
      //   Object.assign(this.state.info, {
      //     propName: this.state.Name,
      //     propStreet: this.state.Street,
      //     propState: this.state.State,
      //     propCity: this.state.City,
      //     propZipCode: this.state.ZipCode,
      //     propBillComp: this.state.BillingCompanyId
      //       ? this.state.BillingCompany
      //       : '',
      //     propBillCompId: this.state.BillingCompanyId,
      //     propManageComp: this.state.managementCompanyId
      //       ? this.state.managementCompany
      //       : '',
      //     propManageCompId: this.state.managementCompanyId,
      //     propCustomId: this.state.CustomId,
      //     propContactName: this.state.CustomerName,
      //     propContactTitle: this.state.customerjobDes,
      //     propContactPhone: this.state.customerPhone,
      //     propContactEmail: this.state.customerEmail,
      //     // meter_id: this.state.selectedMetersId,
      //     manufacturer_id: this.state.manuIdsArr,
      //     device_id: this.state.devIdsArr,
      //     model_no_id: this.state.deviceData[2].data,
      //     propLat: this.state.lat,
      //     propLong: this.state.long,
      //     utility_type_id: selectUtilIds,
      //     radial_dist: Number(this.state.radialDis),
      //   }),
      //   () => this.props.loader(true),
      //   {btnLoading: false},
      // );
      // this.context.addProp(this.state.info);
    }
  };

  const clearInputs = () => {
    closeModal();
    setName('');
    setStreet('');
    setState('');
    setCity('');
    setZipCode('');
    setCustomId('');
    setOwnerId('');
    setOwnerName('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setUnitCount('');
    setUnitMix([]);
    setLocationSelected(false);
    setLat(null);
    setLong(null);
    setManufacturersArray([]);
    setShowAddManufacturer(false);
    setShowEditManufacturer(false);
    setAddNewType(false);
    setLocationBtn('');
    setDropDownShow([
      {value: true},
      {value: false},
      {value: false},
      {value: false},
      {value: false},
    ]);
    setPropertyFlag(false);
  };

  const deviceTypeInfoComponent = (flag) => {
    return (
      <View
        style={[
          styles.utilAndManuSectionContainer,
          {
            height: dropDownShow[2].value ? width * 0.65 : width * 0.0,
          },
        ]}>
        {addNewType && showAddType == 'Utility Type' ? (
          <View>
            <View>
              <Text style={styles.addTypeHeading}>
                Add New {showAddType} Type
              </Text>
            </View>
            <TextInput
              placeholder={'Type New Utility Type Name'}
              value={addUtility}
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
                setAddUtility(text);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity onPress={() => cancelAddType()}>
                <Text style={styles.addTypeButtons}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => doneAddType('Utility', true)}
                disabled={addUtility ? false : true}>
                <Text
                  style={[
                    styles.addTypeButtons,
                    {
                      color: addUtility ? '#25AAE1ec' : '#d0d0d0',
                    },
                  ]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : addNewType && showAddType == 'Manufacturer' ? (
          addNewUType ? (
            <View>
              <View>
                <Text style={styles.addTypeHeading}>
                  Add New {showAddType} Type
                </Text>
              </View>
              <TextInput
                placeholder={'Type New Utility Type Name'}
                value={addUtility}
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
                  setAddUtility(text);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity onPress={() => cancelAddUType()}>
                  <Text style={styles.addTypeButtons}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => doneAddType('Utility', false)}
                  disabled={addUtility ? false : true}>
                  <Text
                    style={[
                      styles.addTypeButtons,
                      {
                        color: addUtility ? '#25AAE1ec' : '#d0d0d0',
                      },
                    ]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                zIndex: 2,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <View>
                <View>
                  <Text style={styles.addTypeHeading}>
                    Add New {showAddType}
                  </Text>
                </View>
                <TextInput
                  placeholder={'Type New Manufacturer Name'}
                  value={addManufacturer}
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
                    setAddManufacturer(text);
                  }}
                />
                <View>
                  <Text style={styles.addTypeHeading}>Select Utility Type</Text>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    }}>
                    <SearchableDropDown
                      multi={true}
                      selectedItems={selectAddManuUtil}
                      onItemSelect={(item) => {
                        console.log('Test', item);
                        AddTypes(item);
                      }}
                      containerStyle={styles.dropDownContainer}
                      itemStyle={styles.dropDownItems}
                      itemTextStyle={styles.dropDownItemText}
                      itemsContainerStyle={styles.dropDownItemContainer}
                      items={utilTypes}
                      onRemoveItem={(item, index) => {
                        const items = selectAddManuUtil.filter(
                          (sitem) => sitem.id !== item.id,
                        );
                        setSelectAddManuUtil(items);
                      }}
                      resetValue={false}
                      textInputProps={{
                        placeholder: 'Add Utility Type',
                        underlineColorAndroid: 'transparent',
                        style: styles.dropDownTextInput,
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                    <TouchableOpacity
                      style={styles.addNewButton}
                      onPress={() => showAddUNewType('Utility Type')}>
                      <Icon size={width * 0.06} color="#fff" name={'add'} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <FlatList
                      data={selectAddManuUtil}
                      style={{height: width * 0.15, width: width * 0.8}}
                      horizontal
                      renderItem={({item}) => (
                        <>
                          <View style={styles.utilListContainer}>
                            <Text style={{color: 'black'}}>{item.name}</Text>
                            <TouchableOpacity
                              onPress={() => {
                                const items = selectAddManuUtil.filter(
                                  (sitem) => sitem.id !== item.id,
                                );
                                setSelectAddManuUtil(items);
                              }}>
                              <Icon name="close" size={width * 0.05} />
                            </TouchableOpacity>
                          </View>
                          <View style={{width: 5}} />
                        </>
                      )}
                    />
                    <View style={styles.addManuBtnContainer}>
                      <TouchableOpacity onPress={() => cancelAddType()}>
                        <Text style={styles.addTypeButtons}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => doneAddType('Manufacturer')}
                        disabled={
                          addManufacturer && selectAddManuUtil?.length > 0
                            ? false
                            : true
                        }>
                        <Text
                          style={[
                            styles.addTypeButtons,
                            {
                              color:
                                addManufacturer && selectAddManuUtil?.length > 0
                                  ? '#25AAE1ec'
                                  : '#d0d0d0',
                            },
                          ]}>
                          Add
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        ) : (
          <View>
            {utilAndManu?.map((item, index) => {
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
                  <View style={styles.mainDropDownView}>
                    <SearchableDropDown
                      onItemSelect={(item) => {
                        getData(item, index);
                      }}
                      containerStyle={styles.dropDownContainer}
                      itemStyle={styles.dropDownItems}
                      itemTextStyle={styles.dropDownItemText}
                      itemsContainerStyle={styles.dropDownItemContainer}
                      items={item.data}
                      resetValue={false}
                      textInputProps={{
                        placeholder:
                          index == 1
                            ? utilAndManu[0].selectId
                              ? 'Select Manufacturer'
                              : 'First Select Utility Type'
                            : index == 0 && 'Select Utility Type',
                        underlineColorAndroid: 'transparent',
                        style: styles.dropDownTextInput,
                        onTextChange: (text) => {
                          onChangeUtilAndManu(text, index);
                        },
                        value: setTimeout(() => item.select, 200),
                        defaultValue: item.select,
                      }}
                      listProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                    <TouchableOpacity
                      style={styles.addNewButton}
                      onPress={() => showAddNewType(item.name)}>
                      <Icon size={width * 0.06} color="#fff" name={'add'} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <View style={styles.bottomBtnContainer}>
              <TouchableOpacity onPress={() => cancelManu(flag)}>
                <Text style={styles.addTypeButtons}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  flag == 'add'
                    ? addManufacturers()
                    : editManufacturers(utilAndManu[1].select)
                }
                disabled={
                  utilAndManu[0].selectId !== '' &&
                  utilAndManu[1].selectId !== ''
                    ? false
                    : true
                }>
                <Text
                  style={[
                    styles.addTypeButtons,
                    {
                      color:
                        utilAndManu[0].selectId !== '' &&
                        utilAndManu[1].selectId !== ''
                          ? '#25AAE1ec'
                          : 'grey',
                    },
                  ]}>
                  {flag == 'add' ? 'Add' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {error.deviceId ? (
          <HelperText type="error" visible={error.deviceId}>
            {error.deviceId}
          </HelperText>
        ) : null}
      </View>
    );
  };

  const renderManufacturerList = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => openEditManu(item, index)}
          style={styles.manufacturersArrItem}>
          <Text style={{color: '#787878'}}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => DeleteManufacture(item)}
          style={styles.manufacturersArrItemDel}>
          <MaterialCommunityIcon name="delete" size={width * 0.08} />
        </TouchableOpacity>
      </View>
    );
  };

  const doneAddType = async (val, temp) => {
    console.log('Show Add Type', showAddType);
    if (showAddType == 'Utility Type' || val == 'Utility') {
      let data = {
        name: addUtility,
      };
      if (temp) {
        setLoadingState(true);
      } else {
        setLoadingStateDev(true);
      }
      const UtilityResponse = await api.post(
        '/property/equipment/utility-type',
        data,
      );
      if (UtilityResponse?.data?.bool) {
        console.log('datachecckk-->>', UtilityResponse?.data?.data);
        animate();
        if (!temp) {
          this.setState({
            showAddType: 'Manufacturer',
            addNewType: true,
            addNewUType: false,
            addUtility: '',
          });
        } else {
          cancelAddType();
        }

        setLoadingState(false);
        setLoadingStateDev(false);
        this.getToken();
        alert(UtilityResponse?.data?.message);
      } else {
        alert(UtilityResponse?.data?.message);
        setLoadingState(false);
        setLoadingStateDev(false);
      }
    } else if (showAddType == 'Manufacturer' || val == 'Manufacturer') {
      console.log('chala');
      let utilIds = [];
      for (let i = 0; i < selectAddManuUtil?.length; i++) {
        utilIds.push(selectAddManuUtil[i].id);
      }
      let data = {
        name: addManufacturer,
        utility_type_id: utilIds,
      };
      setLoadingStateDev(true);
      const ManufacturersResponse = await api.post(
        '/property/equipment/manufacturer/add',
        data,
      );
      if (ManufacturersResponse?.data?.bool) {
        // this.setState({loadManufacturers: true});
        console.log('datachecckk-->>', ManufacturersResponse?.data?.data);
        animate();
        this.getToken();
        cancelAddType();
        setLoadingStateDev(false);
      } else {
        alert(ManufacturersResponse?.data?.message);
        setLoadingStateDev(false);
      }
    }
  };

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
            bottom: avoidKeyboard ? width * avoidMargin : 0,
          }}
          isVisible={modalVisible}>
          {selectLocation ? (
            <View style={styles.loactionSelectionMainView}>
              <View style={styles.loactionSelectionInnerView}>
                <View style={styles.radialDisContainer}>
                  <Text style={styles.radialDisHeading}>
                    RADIAL DISTANCE (KM)*
                  </Text>
                  <View style={styles.radialDisSlider}>
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
                <View style={styles.autoCompleteInputContainer}>
                  <GooglePlacesAutocomplete
                    placeholder="Address"
                    query={{
                      key: 'AIzaSyAVCQa1ZgYSuqHfZLIkhMQ_C6W5L5Wi42A',
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
                  style={styles.currentLocationBtn}>
                  <Icon size={width * 0.07} color="#fff" name={'gps-fixed'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectLocation(false);
                    setLocationSelected(true);
                  }}
                  style={styles.loactionDoneBtn}>
                  <Icon
                    size={width * 0.07}
                    color="#fff"
                    name={'navigate-next'}
                  />
                </TouchableOpacity>

                {currLocate ? (
                  <View style={styles.loactionPinContainer}>
                    <Icon
                      size={width * 0.12}
                      color="#f00"
                      name={'location-pin'}
                    />
                  </View>
                ) : null}
                {currLocate
                  ? (console.log('CURRLOCATE', currLocate),
                    (
                      <MapView
                        style={styles.mapView}
                        region={{
                          latitude: lat == 0 ? currLocate.lat : lat,
                          longitude: long == 0 ? currLocate.lng : long,
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
                            latitude: lat == 0 ? currLocate.lat : lat,
                            longitude: long == 0 ? currLocate.lng : long,
                          }}
                          ref={circleRef}
                          onLayout={() =>
                            circleRef.current.setNativeProps({
                              strokeColor: 'rgba(12,170,225,1)',
                              fillColor: 'rgba(12,170,225,0.3)',
                            })
                          }
                          radius={radialDis * 1000}
                        />
                      </MapView>
                    ))
                  : null}
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
                        onPress={clearInputs}
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
                      {addUnitMix ? (
                        <View
                          style={{
                            height: dropDownShow[1].value
                              ? 'auto'
                              : width * 0.0,
                          }}>
                          <View>
                            <Text
                              style={[
                                styles.addTypeHeading,
                                {
                                  marginLeft: width * 0.04,
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Square Feets
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: dropDownShow[1].value
                                  ? width * 0.18
                                  : width * 0.0,
                                overflow: 'hidden',
                                // marginBottom: width * 0.015,
                              },
                            ]}>
                            <TextInput
                              placeholder="Square Feet"
                              style={styles.input}
                              value={sqft}
                              keyboardType="decimal-pad"
                              onChangeText={(text) => {
                                setSqft(text);
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
                          <View>
                            <Text
                              style={[
                                styles.addTypeHeading,
                                {
                                  marginLeft: width * 0.04,
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Unit Types
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: dropDownShow[1].value
                                  ? 'auto'
                                  : width * 0.0,
                                overflow: 'hidden',
                                justifyContent: 'center',
                              },
                            ]}>
                            <SearchableDropDown
                              onItemSelect={(item) => {
                                setUnitType(item.name);
                              }}
                              containerStyle={styles.dropDownFullContainer}
                              itemStyle={styles.dropDownItems}
                              itemTextStyle={styles.dropDownItemText}
                              itemsContainerStyle={styles.dropDownItemContainer}
                              items={unitTypeList}
                              resetValue={false}
                              textInputProps={{
                                placeholder: 'Unit Types',
                                underlineColorAndroid: 'transparent',
                                placeholderTextColor: '#777',
                                style: styles.dropDownFullTextInput,
                                onTextChange: (text) => {
                                  setUnitType(text);
                                },
                                value: setTimeout(() => unitType, 200),
                                defaultValue: unitType,
                              }}
                              listProps={{
                                nestedScrollEnabled: true,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.addTypeHeading,
                                {
                                  marginLeft: width * 0.04,
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Classes
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: dropDownShow[1].value
                                  ? 'auto'
                                  : width * 0.0,
                                overflow: 'hidden',
                                justifyContent: 'center',
                              },
                            ]}>
                            <SearchableDropDown
                              onItemSelect={(item) => {
                                setClasses(item.name);
                              }}
                              containerStyle={styles.dropDownFullContainer}
                              itemStyle={styles.dropDownItems}
                              itemTextStyle={styles.dropDownItemText}
                              itemsContainerStyle={styles.dropDownItemContainer}
                              items={classesList}
                              resetValue={false}
                              textInputProps={{
                                placeholder: 'Classes',
                                underlineColorAndroid: 'transparent',
                                placeholderTextColor: '#777',
                                style: styles.dropDownFullTextInput,
                                onTextChange: (text) => {
                                  setClasses(text);
                                },
                                value: setTimeout(() => classes, 200),
                                defaultValue: classes,
                              }}
                              listProps={{
                                nestedScrollEnabled: true,
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.addTypeHeading,
                                {
                                  marginLeft: width * 0.04,
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                },
                              ]}>
                              Bedrooms
                            </Text>
                          </View>
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
                              placeholder="Bedrooms"
                              style={styles.input}
                              value={bedrooms}
                              keyboardType="decimal-pad"
                              onChangeText={(text) => {
                                setBedrooms(text);
                              }}
                              onFocus={() => {
                                animate();
                                setAvoidKeyboard(true);
                                setAvoidMargin(0.25);
                              }}
                              onBlur={() => {
                                animate();
                                setAvoidMargin(0);
                                setAvoidKeyboard(false);
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
                              styles.unitMixButtonContainer,
                              {
                                height: dropDownShow[1].value
                                  ? 'auto'
                                  : width * 0.0,
                              },
                            ]}>
                            <TouchableOpacity onPress={clearUnitMixData}>
                              <Text style={styles.unitMixButtonText}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={unitMixFlag ? editOldRow : AddNewRow}>
                              <Text
                                style={[
                                  styles.unitMixButtonText,
                                  {
                                    color:
                                      sqft && unitType && classes && bedrooms
                                        ? '#25AAE1ec'
                                        : '#d0d0d0',
                                  },
                                ]}>
                                {unitMixFlag ? 'Edit' : 'Add'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.unitCountAndMixContainer,
                            {
                              height: dropDownShow[1].value
                                ? 'auto'
                                : width * 0.0,
                            },
                          ]}>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: dropDownShow[1].value
                                  ? width * 0.18
                                  : width * 0.0,
                                overflow: 'hidden',
                                marginBottom: width * 0.015,
                              },
                            ]}>
                            <TextInput
                              placeholder="Unit Count"
                              style={styles.input}
                              value={unitCount}
                              keyboardType="decimal-pad"
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
                          {unitMix.map((item, index) => (
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity
                                style={styles.unitMixData}
                                onPress={() => getRowData(item, index)}>
                                <View style={styles.unitMixDataContainer}>
                                  <Text style={styles.unitMixDataHeading}>
                                    Sq. Ft
                                  </Text>
                                  <Text style={styles.unitMixDataValues}>
                                    {item.square_feets}
                                  </Text>
                                </View>
                                <View style={styles.unitMixDataContainer}>
                                  <Text style={styles.unitMixDataHeading}>
                                    Unit Type
                                  </Text>
                                  <Text style={styles.unitMixDataValues}>
                                    {item.unit_type}
                                  </Text>
                                </View>
                                <View style={styles.unitMixDataContainer}>
                                  <Text style={styles.unitMixDataHeading}>
                                    Classes
                                  </Text>
                                  <Text style={styles.unitMixDataValues}>
                                    {item.classes}
                                  </Text>
                                </View>
                                <View style={styles.unitMixDataContainer}>
                                  <Text style={styles.unitMixDataHeading}>
                                    Bedrooms
                                  </Text>
                                  <Text style={styles.unitMixDataValues}>
                                    {item.bedrooms}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => deleteRow(index, item?.id)}
                                style={styles.unitMixRemoveBtn}>
                                <MaterialCommunityIcon
                                  name="delete"
                                  size={width * 0.08}
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                          <TouchableOpacity
                            onPress={() => {
                              animate();
                              setAddUnitMix(true);
                            }}
                            style={styles.addNewRowBtn}>
                            <Text style={{color: '#25AAE1ec'}}>
                              Add New Rows
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
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
                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled>
                        {loadingStateDev || loadingState ? (
                          <ActivityIndicator size="large" color={'#25AAE1ec'} />
                        ) : (
                          <>
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                height: dropDownShow[2].value
                                  ? showAddManufacturer || showEditManufacturer
                                    ? width * 0.65
                                    : manufacturersArray?.length > 0
                                    ? 'auto'
                                    : width * 0.2
                                  : width * 0.0,
                                overflow: 'hidden',
                              }}>
                              {!showAddManufacturer && !showEditManufacturer && (
                                <View style={{paddingVertical: 10}}>
                                  {loadManuList ? (
                                    <ActivityIndicator
                                      size="large"
                                      style={{bottom: 15}}
                                      color={'#25AAE1ec'}
                                    />
                                  ) : (
                                    manufacturersArray?.length > 0 && (
                                      <FlatList
                                        data={manufacturersArray}
                                        renderItem={renderManufacturerList}
                                      />
                                    )
                                  )}

                                  <TouchableOpacity
                                    onPress={openAddManu}
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
                                    {/* {this.state.addManuLoad ? (
                                      <ActivityIndicator
                                        size="small"
                                        color={'#25AAE1ec'}
                                      />
                                    ) : ( */}
                                    <Text style={{color: '#25AAE1ec'}}>
                                      Add Manufacturer
                                    </Text>
                                    {/* )} */}
                                  </TouchableOpacity>
                                </View>
                              )}
                              {showAddManufacturer &&
                                deviceTypeInfoComponent('add')}
                              {showEditManufacturer &&
                                deviceTypeInfoComponent('edit')}
                            </View>
                            {error.utilType ? (
                              <HelperText type="error" visible={error.utilType}>
                                {error.utilType}
                              </HelperText>
                            ) : null}
                          </>
                        )}
                      </ScrollView>
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
                              ? 'auto'
                              : width * 0.0,

                            overflow: 'hidden',
                            justifyContent: 'center',
                          },
                        ]}>
                        <SearchableDropDown
                          onItemSelect={(item) => {
                            setOwnerId(item.id);
                            setOwnerName(item.name);
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
                    </View>
                  </KeyboardAwareScrollView>
                  {/* Box Header */}
                  <View style={styles.boxHeader}>
                    <View style={styles.bottonContainer}>
                      <FAB
                        onPress={addProperty}
                        style={styles.submitBotton}
                        color="white"
                        icon="check"
                        label={type == 'Add' ? 'Add property' : 'Edit Property'}
                        loading={btnLoading}
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
