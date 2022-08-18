import React, {useEffect, useReducer, useRef, useState} from 'react';

import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  KeyboardAvoidingView,
  FlatList,
  Keyboard,
  LogBox,
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

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import NumericInput from 'react-native-numeric-input';

//Component
import styles from './style';
import clc from 'cli-color';
import API from '../../../api/SeviceApi';
import Text_Input from '../../../components/TextInput/index';
import Searchable_Dropdown from '../../../components/SearchableDropdown/index';
import { useDispatch } from 'react-redux';
import { fetchPropetry } from '../../../Store/Action/properties.action';

import TextReuseableComponent from '../../Text/index';

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
  const [unitCount, setUnitCount] = useState('');
  const [actualUnitCount, setActualUnitCount] = useState('');
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
      icon1: 'chevron-up',
      icon2: 'chevron-down',
      data: [],
    },
    {
      id: 1,
      select: '',
      selectId: '',
      error: '',
      name: 'Manufacturer',
      icon1: 'chevron-up',
      icon2: 'chevron-down',
      data: [],
    },
  ]);
  const [unitMixes, setUnitMixes] = useState([
    {
      id: 1,
      select: '',
      selectId: '',
      error: '',
      name: 'BR',
      value: 0,
    },
    {
      id: 2,
      select: '',
      selectId: '',
      error: '',
      name: 'BA',
      value: 0,
    },
    {
      id: 3,
      select: '',
      selectId: '',
      error: '',
      name: '# Units',
      value: 0,
    },
    {
      id: 4,
      select: '',
      selectId: '',
      error: '',
      name: 'Gal/Unit/Day',
      value: 0,
    },
    // {
    //   id: 5,
    //   select: '',
    //   selectId: '',
    //   error: '',
    //   name: 'Total/Gal/Day',
    //   value: '',
    // },
  ]);
  const [totalGalDay, setTotalGalDay] = useState(
    (unitMixes[2].value * unitMixes[3].value).toString(),
  );
  const [sumNoOfUnit, setSumNoOfUnit] = useState(0);
  const [sumTotalGalDay, setSumTotalGalDay] = useState(0);
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


  
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('CurrLocate', currLocate);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
      setActualUnitCount(propertyData?.unit_actual_count);
      setRadialDis(propertyData?.radial_dist);
      setContactName(propertyData?.contact_name);
      setContactPhone(propertyData?.contact_phone);
      setContactEmail(propertyData?.contact_email);
      setLat(propertyData?.latitude);
      setLong(propertyData?.longitude);
      setLocationSelected(true);
      let uMdata = propertyData?.unit_mixes;
      let tGD = 0;
      let nOU = 0;
      for (let i = 0; i < uMdata?.length; i++) {
        const singleTGD = uMdata[i].no_of_units * uMdata[i].gud;
        nOU = nOU + Number(uMdata[i].no_of_units);
        tGD = tGD + Number(singleTGD);
      }
      console.log('NOU', nOU);
      console.log('TGD', tGD);
      setSumNoOfUnit(nOU);
      setSumTotalGalDay(tGD);
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
    const ownerRes = await API.get('/property/owner/own');

    setOwnerData(ownerRes?.data?.data);

    const manuResponse = await API.get('/property/equipment/manufacturer/all');

    setAllManuList(manuResponse?.data?.data);

    const utilRes = await API.get('/property/equipment/utility-type');

    let utilArr = [...utilAndManu];
    utilArr[0].data = utilRes?.data?.data;
    setUtilAndManu(utilArr);
    setUtilTypes(utilRes?.data?.data);
    setLoadingState(false);
    setLoadingStateDev(false);
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
      listSlide2[1].data = [];
      allManu.map((manuItem) => {
        if (manuItem?.utility_type[0]?.name != undefined) {
          if (some.name == manuItem?.utility_type[0]?.name) {
            console.log('CHALA TRUE');
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

  const AddRow = () => {
    if (unitCount) {
      animate();
      setAddUnitMix(true);
    } else {
      Toast.show('Please add Unit Count first', Toast.SHORT);
    }
  };

  const AddNewRow = () => {
    if (unitMixes[2].value < 1) {
      Toast.show('No of Units required', Toast.SHORT);
    } else if (unitMixes[2].value > 0 && unitMixes[3].value < 1) {
      Toast.show('Gal/Unit/Day required', Toast.SHORT);
    } else if (
      unitMixes[2].value > Number(unitCount) ||
      sumNoOfUnit + unitMixes[2].value > Number(unitCount)
    ) {
      Toast.show(
        'Total # Units should be less than or equal to Unit Count',
        Toast.SHORT,
      );
    } else {
      let arr = [...unitMix];
      let data = {
        br: unitMixes[0].value,
        ba: unitMixes[1].value,
        no_of_units: unitMixes[2].value,
        gud: unitMixes[3].value,
      };
      arr.push(data);
      setSumNoOfUnit(sumNoOfUnit + unitMixes[2].value);
      setSumTotalGalDay(sumTotalGalDay + totalGalDay);
      arr.filter;
      setUnitMix(arr);
      clearUnitMixData();
    }
  };

  const editOldRow = () => {
    let editArr = [...unitMix];

    const SumNOU = unitMixes[2].value - editArr[unitMixIndex].no_of_units;
    const SumTGD =
      totalGalDay -
      editArr[unitMixIndex].no_of_units * editArr[unitMixIndex].gud;
    if (SumNOU > 0) {
      setSumNoOfUnit(sumNoOfUnit + SumNOU);
    } else if (SumNOU < 0) {
      setSumNoOfUnit(sumNoOfUnit + SumNOU);
    }
    if (SumTGD > 0) {
      setSumTotalGalDay(sumTotalGalDay + SumTGD);
    } else if (SumTGD < 0) {
      setSumTotalGalDay(sumTotalGalDay + SumTGD);
    }
    editArr[unitMixIndex].br = unitMixes[0].value;
    editArr[unitMixIndex].ba = unitMixes[1].value;
    editArr[unitMixIndex].no_of_units = unitMixes[2].value;
    editArr[unitMixIndex].gud = unitMixes[3].value;

    setUnitMix(editArr);
    clearUnitMixData();
  };

  const deleteRow = async (index, id) => {
    if (type == 'Edit') {
      const delUnitMix = await API.post(`/property/unit-mix/unitMix/${id}`);
      console.log('DELUNITMIX', delUnitMix);
      if (delUnitMix?.data?.bool) {
        let arr = [...unitMix];
        arr.splice(index, 1);
        setUnitMix(arr);
      }
    } else {
      setSumTotalGalDay(
        sumTotalGalDay - unitMix[index].no_of_units * unitMix[index].gud,
      );
      setSumNoOfUnit(sumNoOfUnit - unitMix[index].no_of_units);
      let arr = [...unitMix];
      arr.splice(index, 1);
      setUnitMix(arr);
    }
  };

  const getRowData = (item, index) => {
    setUnitMixFlag(true);
    let uniMx = [...unitMixes];
    uniMx[0].value = item.br;
    uniMx[1].value = item.ba;
    uniMx[2].value = item.no_of_units;
    uniMx[3].value = item.gud;
    setTotalGalDay(item.no_of_units * item.gud);
    setUnitMixes(uniMx);
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
    setTotalGalDay(0);
    let uniMx = [...unitMixes];
    uniMx[0].value = 0;
    uniMx[1].value = 0;
    uniMx[2].value = 0;
    uniMx[3].value = 0;
    setUnitMixes(uniMx);
    setUnitMixIndex(null);
    setUnitMixFlag(false);
    setAddUnitMix(false);
  };

  const showMoreFn = (indexx) => {
    setAddNewType(false);
    setShowAddManufacturer(false);
    setShowEditManufacturer(false);
    setAddUnitMix(false);
    animate();
    dropDownShow.map((item, index) => {
      if (index == indexx) {
        let dropDownVal = [...dropDownShow];
        dropDownVal[index].value = true;
        setDropDownShow(dropDownVal);
      } else {
        let dropDownVal = [...dropDownShow];
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
    const ManufacturersResponse = await API.get(
      '/property/equipment/manufacturer/all',
    );
    console.log('ManufacturersResponse', ManufacturersResponse?.data);
    animate();
    const delManu = await API.post(`/property/pivot/${item.id}`);
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
    if (type != 'Add' && unitCount < actualUnitCount) {
      Toast.show(
        'You have already added units greater than Unit Count',
        Toast.SHORT,
      );
      return;
    }
    //! -------------------------+++

    if (!locationSelected) {
      Alert.alert('Location Required', 'Please Select Property Location');
      return;
    } else {
      setSelectLocation(false);
      setBtnLoading(true);

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
        const res = await API.post(`/property/add`, propData);
        console.log(res.data);
        if (res?.data?.bool) {
          clearInputs();
          addedSuccessfully();
          console.log('PROPERTY RUNNINg');
          setBtnLoading(false);
          Alert.alert('Success', 'Property Added Successfully');
        } else {
          setBtnLoading(false);
          Alert.alert('Error', res?.data?.message);
        }
      } else {
        const response = await API.post(
          `/property/update/${propertyData.id}`,
          propData,
        );
        console.log(response?.data);
        closeModal();
        if (response?.data?.bool) {
          addedSuccessfully();
          clearInputs();
          setBtnLoading(false);
          Alert.alert('Success', response?.data?.message);
        } else {
          setBtnLoading(false);
          Alert.alert('Error', response?.data?.message);
        }
      }

      dispatch(fetchPropetry())
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
    setSumNoOfUnit(0);
    setSumTotalGalDay(0);
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
    setError({
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
    setPropertyFlag(false);
  };

  const deviceTypeInfoComponent = (flag) => {
    return (
      <View
        style={[
          styles.utilAndManuSectionContainer,
          {
            height: dropDownShow[2].value ? width * 0.7 : 0,
          },
        ]}>
        {addNewType && showAddType == 'Utility Type' ? (
          <View>
            <View>
              <TextReuseableComponent title style={styles.addTypeHeading} value={`Add New ${showAddType} Type`} />
            </View>
            <Text_Input
              placeholder={'Type New Utility Type Name'}
              value={addUtility}
              hide={!dropDownShow[2].value}
              style={styles.addTypeTextInput}
              onChangeText={(text) => {
                setAddUtility(text);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: width * 0.1,
              }}>
              <TouchableOpacity onPress={() => cancelAddType()}>
                <TextReuseableComponent title style={styles.addTypeButtons} value={"Cancel"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => doneAddType('Utility', true)}
                disabled={addUtility ? false : true}>
                <TextReuseableComponent title style={[
                    styles.addTypeButtons,
                    {
                      color: addUtility ? '#25AAE1ec' : '#d0d0d0',
                    },
                  ]} value={"Add"} />
              </TouchableOpacity>
            </View>
          </View>
        ) : addNewType && showAddType == 'Manufacturer' ? (
          addNewUType ? (
            <View>
              <View>
                <TextReuseableComponent title style={styles.addTypeHeading} value={`Add New ${showAddType} Type`} />
              </View>
              <Text_Input
                placeholder={'Type New Utility Type Name'}
                value={addUtility}
                hide={!dropDownShow[2].value}
                style={styles.addTypeTextInput}
                onChangeText={(text) => {
                  setAddUtility(text);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: width * 0.1,
                }}>
                <TouchableOpacity onPress={() => cancelAddUType()}>
                  <TextReuseableComponent title style={styles.addTypeButtons} value={"Cancel"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => doneAddType('Utility', false)}
                  disabled={addUtility ? false : true}>
                  <TextReuseableComponent title style={[
                      styles.addTypeButtons,
                      {
                        color: addUtility ? '#25AAE1ec' : '#d0d0d0',
                        borderColor: addUtility ? '#25AAE1ec' : '#d0d0d0',
                      },
                    ]} value={"Add"} />
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
                  <TextReuseableComponent title style={styles.addTypeHeading} value={`Add New ${showAddType} Type`} />
                </View>
                <Text_Input
                  placeholder={'Type New Manufacturer Name'}
                  hide={!dropDownShow[2].value}
                  value={addManufacturer}
                  style={styles.addTypeTextInput}
                  onChangeText={(text) => {
                    setAddManufacturer(text);
                  }}
                />
                <View>
                  <TextReuseableComponent title style={styles.addTypeHeading} value={"Select Utility Type"} />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    }}>
                    <Searchable_Dropdown
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
                        trueIcon: 'chevron-up',
                        falseIcon: 'chevron-down',
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
                            <TextReuseableComponent title style={styles.utilListContainer} value={item.name} />
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
                        <TextReuseableComponent title style={styles.addTypeButtons} value={"Cancel"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => doneAddType('Manufacturer')}
                        disabled={
                          addManufacturer && selectAddManuUtil?.length > 0
                            ? false
                            : true
                        }>
                        <TextReuseableComponent title style={[
                            styles.addTypeButtons,
                            {
                              color:
                                addManufacturer && selectAddManuUtil?.length > 0
                                  ? '#25AAE1ec'
                                  : '#d0d0d0',
                              borderColor:
                                addManufacturer && selectAddManuUtil?.length > 0
                                  ? '#25AAE1ec'
                                  : '#d0d0d0',
                            },
                          ]} value={"Add"} />
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
                  <TextReuseableComponent title style={styles.meterDesciptionHeading} value={`${item.name}*`} />
                  <View style={styles.mainDropDownView}>
                    <Searchable_Dropdown
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
                        trueIcon: item.icon1,
                        falseIcon: item.icon2,
                        placeholder:
                          index == 1
                            ? utilAndManu[0].selectId
                              ? utilAndManu[1].data?.length > 0
                                ? 'Select Manufacturer'
                                : 'No Manufacturer'
                              : 'First Select Utility Type'
                            : index == 0 && 'Select Utility Type',
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
                <TextReuseableComponent title style={styles.addTypeButtons} value={"Cancel"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  flag == 'add'
                    ? addManufacturers()
                    : editManufacturers(utilAndManu[1].select)
                }
                disabled={
                  utilAndManu[0]?.selectId !== '' &&
                  utilAndManu[1]?.selectId !== ''
                    ? false
                    : true
                }>
                <TextReuseableComponent title style={[
                    styles.addTypeButtons,
                    {
                      color:
                        utilAndManu[0]?.selectId !== '' &&
                        utilAndManu[1]?.selectId !== ''
                          ? '#25AAE1ec'
                          : '#d0d0d0',
                      borderColor:
                        utilAndManu[0]?.selectId !== '' &&
                        utilAndManu[1]?.selectId !== ''
                          ? '#25AAE1ec'
                          : '#d0d0d0',
                    },
                  ]} value={flag == 'add' ? 'Add' : 'Edit'} />
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
          <TextReuseableComponent title style={{color: '#787878'}} value={item.name} />
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
      const UtilityResponse = await API.post(
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

        // this.getToken();
        callApi();

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
      const ManufacturersResponse = await API.post(
        '/property/equipment/manufacturer/add',
        data,
      );
      if (ManufacturersResponse?.data?.bool) {
        // this.setState({loadManufacturers: true});
        console.log('datachecckk-->>', ManufacturersResponse?.data?.data);
        animate();
        // this.getToken();
        callApi();
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
                  <TextReuseableComponent title style={styles.radialDisHeading} value={"RADIAL DISTANCE (KM)*"} />
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
                    <TextReuseableComponent title style={styles.addTypeHeading} value={`${radialDis} KM`} />
                  </View>
                </View>
                <View style={styles.autoCompleteInputContainer}>
                  <GooglePlacesAutocomplete
                    placeholder="Address"
                    query={{
                      key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                      language: 'en', // language of the results
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    disableScroll={false}
                    // textInputProps={{
                    //   onFocus: () => {

                    //   }
                    // }}
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

                {currLocate != null ? (
                  <View style={styles.loactionPinContainer}>
                    <Icon
                      size={width * 0.12}
                      color="#f00"
                      name={'location-pin'}
                    />
                  </View>
                ) : null}
                {currLocate != null
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
                      <TextReuseableComponent title style={styles.modalHeading} value={`${type == 'Add' ? 'New' : 'Edit'} Property`} />
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
                        <TextReuseableComponent title style={styles.desciptionHeading} value={"Property Name & Address"} />
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
                            height: dropDownShow[0].value ? width * 0.18 : 0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <Text_Input
                          placeholder="Enter Property Name*"
                          value={Name}
                          hide={!dropDownShow[0].value}
                          onChangeText={(text) => {
                            setName(text);
                            setError((oldState) => ({
                              ...oldState,
                              property: '',
                            }));
                          }}
                          error={error.property}
                          style={{...styles.input, width: '99.99%'}}
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
                            height: dropDownShow[0].value ? width * 0.18 : 0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={selectMeterLocation}
                          style={styles.loactionBtn}>
                          <TextReuseableComponent title style={styles.loactionBtnText} value={locationBtn ? locationBtn : currAddr} />
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
                        <TextReuseableComponent title style={[styles.desciptionHeading]} value={"Unit Count & Unit Mix"} />
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
                            height: dropDownShow[1].value ? 'auto' : 0,
                            marginBottom: width * 0.05,
                          }}>
                          <FlatList
                            data={unitMixes}
                            numColumns={2}
                            renderItem={({item, index}) => (
                              <View
                                style={{
                                  marginHorizontal: width * 0.05,
                                  marginVertical: width * 0.02,
                                }}>
                                <TextReuseableComponent title style={[
                                    styles.addTypeHeading,
                                    {
                                      textTransform:
                                        index < 2 ? 'none' : 'capitalize',
                                      marginBottom: 0,
                                      fontWeight: 'bold',
                                      textAlign: index > 3 ? 'center' : 'left',
                                    },
                                  ]} value={`${item.name} ${index == 2 || index == 3 ? '*' : ''}`} />
                                <NumericInput
                                  value={item.value}
                                  onChange={(value) => {
                                    let device = [...unitMixes];
                                    device[index].value = value;
                                    setUnitMixes(device);
                                    if (index > 1) {
                                      setTotalGalDay(
                                        unitMixes[2].value * unitMixes[3].value,
                                      );
                                    }
                                  }}
                                  onLimitReached={(isMax, msg) =>
                                    console.log(isMax, msg)
                                  }
                                  totalWidth={width * 0.35}
                                  totalHeight={width * 0.1}
                                  iconSize={25}
                                  step={1}
                                  minValue={0}
                                  valueType="real"
                                  rounded
                                  textColor="#B0228C"
                                  iconStyle={{color: '#000'}}
                                  rightButtonBackgroundColor="#eee"
                                  leftButtonBackgroundColor="#eee"
                                />
                              </View>
                            )}
                          />
                          <View
                            style={{
                              width: width * 0.9,
                              marginVertical: width * 0.02,
                              height: dropDownShow[1].value ? 'auto' : 0,
                              alignItems: 'center',
                              overflow: 'hidden',
                            }}>
                            <TextReuseableComponent title style={[
                                styles.addTypeHeading,
                                {
                                  marginBottom: 0,
                                  fontWeight: 'bold',
                                },
                              ]} value={"Total/Gal/Day"} />
                            <Text_Input
                              dense
                              editable={false}
                              hide={!dropDownShow[1].value}
                              style={{...styles.input, width: width * 0.35}}
                              value={totalGalDay.toString()}
                            />
                          </View>

                          <View
                            style={[
                              styles.unitMixButtonContainer,
                              {
                                height: dropDownShow[1].value ? 'auto' : 0,
                              },
                            ]}>
                            <TouchableOpacity onPress={clearUnitMixData}>
                              <TextReuseableComponent title style={styles.unitMixButtonText} value={"Cancel"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={unitMixFlag ? editOldRow : AddNewRow}>
                              <TextReuseableComponent title style={styles.unitMixButtonText} value={unitMixFlag ? 'Edit' : 'Add'} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.unitCountAndMixContainer,
                            {
                              height: dropDownShow[1].value ? 'auto' : 0,
                              marginBottom: dropDownShow[1].value
                                ? width * 0.05
                                : 0,
                            },
                          ]}>
                          <View
                            style={{
                              height: width * 0.05,
                              width: width * 0.8,
                              alignSelf: 'center',
                              alignItems: 'flex-end',
                              flexDirection: 'row',
                            }}>
                            <TextReuseableComponent title style={styles.desciptionHeading} value={"Unit Count*"} />
                          </View>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                height: dropDownShow[1].value
                                  ? width * 0.18
                                  : 0,
                                overflow: 'hidden',
                                marginVertical: width * 0.015,
                              },
                            ]}>
                            <Text_Input
                              placeholder="Unit Count"
                              style={styles.input}
                              value={unitCount}
                              hide={!dropDownShow[1].value}
                              keyboardType="decimal-pad"
                              onChangeText={(text) => {
                                setUnitCount(text);
                              }}
                            />
                          </View>
                          {unitMix.map((item, index) => (
                            <View key={index} style={{flexDirection: 'row'}}>
                              <TouchableOpacity
                                style={styles.unitMixData}
                                onPress={() => getRowData(item, index)}>
                                <View style={styles.unitMixDataContainer}>
                                  <TextReuseableComponent title style={styles.unitMixDataHeading} value={"# of Units"} />
                                  <TextReuseableComponent title style={styles.unitMixDataValues} value={item.no_of_units} />
                                </View>
                                <View style={styles.unitMixDataContainer}>
                                  <TextReuseableComponent title style={styles.unitMixDataHeading} value={"Total/Gal/Day"} />
                                  <TextReuseableComponent title style={styles.unitMixDataValues} value={item.no_of_units * item.gud} />
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
                          <View
                            style={{
                              backgroundColor: '#fff',
                              borderTopWidth: 2,
                              borderColor: '#787878',
                              height: width * 0.12,
                              width: width * 0.8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 8,
                            }}
                            onPress={() => getRowData(item, index)}>
                            <View style={styles.unitMixDataContainer}>
                              <TextReuseableComponent title style={styles.unitMixDataHeading} value={"Sum # Units"} />
                              <TextReuseableComponent title style={styles.unitMixDataValues} value={sumNoOfUnit} />
                            </View>
                            <View style={styles.unitMixDataContainer}>
                              <TextReuseableComponent title style={styles.unitMixDataHeading} value={"Sum Total/Gal/Day"} />
                              <TextReuseableComponent title style={styles.unitMixDataValues} value={sumTotalGalDay} />
                            </View>
                            <View style={styles.unitMixDataContainer}>
                              <TextReuseableComponent title style={styles.unitMixDataHeading} value={"ADC"} />
                              <TextReuseableComponent title style={styles.unitMixDataValues} value={sumNoOfUnit > 0
                                  ? Math.round(sumTotalGalDay / sumNoOfUnit)
                                  : 0} />
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={AddRow}
                            style={styles.addNewRowBtn}>
                            <TextReuseableComponent title style={{color: '#25AAE1ec'}} value={"Add New Rows"} />
                          </TouchableOpacity>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(2)}>
                        <TextReuseableComponent title style={[styles.desciptionHeading]} value={"Utility Type & Manufacturer"} />
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
                                    ? width * 0.7
                                    : manufacturersArray?.length > 0
                                    ? 'auto'
                                    : width * 0.2
                                  : 0,
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
                                    <TextReuseableComponent title style={{color: '#25AAE1ec'}} value={"Add Manufacturer"} />
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
                        <TextReuseableComponent title style={styles.desciptionHeading} value={"owner info & contact person"} />
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
                        style={{
                          ...styles.inputContainer,
                          height: dropDownShow[3].value ? width * 0.18 : 0,
                          overflow: 'hidden',
                        }}>
                        <Text_Input
                          placeholder="Company Specific ID"
                          style={styles.input}
                          hide={!dropDownShow[3].value}
                          value={CustomId}
                          onChangeText={(text) => {
                            setCustomId(text);
                          }}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[3].value ? 'auto' : 0,

                            overflow: 'hidden',
                          },
                        ]}>
                        <Searchable_Dropdown
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
                            trueIcon: 'chevron-up',
                            falseIcon: 'chevron-down',
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
                            height: dropDownShow[3].value ? width * 0.18 : 0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <Text_Input
                          placeholder="Contact Name"
                          style={styles.input}
                          hide={!dropDownShow[3].value}
                          value={contactName}
                          onChangeText={(text) => {
                            setContactName(text);
                          }}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[3].value ? width * 0.18 : 0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <Text_Input
                          placeholder="Contact Phone"
                          style={styles.input}
                          hide={!dropDownShow[3].value}
                          value={contactPhone}
                          onChangeText={(text) => {
                            setContactPhone(text);
                          }}
                        />
                      </View>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[3].value ? width * 0.18 : 0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <Text_Input
                          placeholder="Email"
                          style={styles.input}
                          hide={!dropDownShow[3].value}
                          value={contactEmail}
                          onChangeText={(text) => {
                            setContactEmail(text);
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
