import React, {Component, Fragment, version} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  UIManager,
  Pressable,
  Alert,
  Image,
  Keyboard,
  PermissionsAndroid,
  Frag,
  KeyboardAvoidingView,
  // TextInput
  CheckBox,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Home from 'react-native-vector-icons/FontAwesome5';
import Check from 'react-native-vector-icons/Feather';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Modal from 'react-native-modal';
import Barcode from 'react-native-vector-icons/MaterialCommunityIcons';
import Drop from 'react-native-vector-icons/Ionicons';
import Scanner from 'react-native-vector-icons/Ionicons';
import Chart from 'react-native-vector-icons/Feather';
import Delete from 'react-native-vector-icons/MaterialIcons';
import Equip from 'react-native-vector-icons/Feather';
import Message from 'react-native-vector-icons/Feather';
import Trash from 'react-native-vector-icons/Feather';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import Edit from 'react-native-vector-icons/MaterialIcons';
import Fire from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import Compact from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, FAB, HelperText, Divider} from 'react-native-paper';
import {DotsLoader} from 'react-native-indicator';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import Base_URL from '../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import TextTicker from 'react-native-text-ticker';
import DropDownPicker from 'react-native-dropdown-picker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {create} from 'apisauce';
import UpdateModal from '../../../../components/modal/UpdateModal';
import {Header, Button} from 'react-native-elements';

// Components
import {Fonts} from '../../../../utils/fonts';
import File from './Form';
import styles from './style';
import style from './style';
import ContextProp from '../../Context/propContext';
import Filter from '../../Filter';
// import { FlatList } from 'react-native-gesture-handler';
import {color} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
// import {SafeAreaView} from 'react-navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import clc from 'cli-color';
import Index from '../../../Index';
const {width, height} = Dimensions.get('window');
let listViewRef;
let manufacturers = [
  {
    id: 1,
    name: 'AMCO',
  },
  {
    id: 2,
    name: 'Badger',
  },
  {
    id: 3,
    name: 'Conservice',
  },
];
const models = [
  {
    id: 1,
    name: 'C4000 Digital Compound (AMCO Bypass)',
  },
  {
    id: 2,
    name: 'Compound RTR',
  },
  {
    id: 3,
    name: 'MJ09 Brass',
  },
];

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      noCode: false,
      hColor: '',
      autoIncrement: false,
      unitIndex: 1,
      buildIndex: 0,
      pressedText: 'Select Type',
      pressedUnit: '',
      pressedCode: '',
      pressedAndEdit: '',
      scanner: null,
      meterId: 0,
      barcodes: [],
      scan: false,
      scanResult: false,
      isModalMeterVisible: false,
      textStyle: false,
      loader: true,
      scanIndex: null,
      searchList: [],
      meterListData: [],
      meterListArray: [],
      open: false,
      value: null,
      items: [
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'},
      ],
      uScr: false,
      unitInputIndex: 0,
      itemName: '',
      file: null,
      addU: false,
      isModalVisible: false,
      isModalUnitVisible: false,
      isModalMunitVisible: false,
      points: 80,
      custom_meter_id: '',
      meterSerial: '',
      selected: false,
      animatedValue: new Animated.Value(0),
      newBuild: 'A',
      newUnit: 'Unit-0',
      newUnitAdd: '',
      meterList: false,
      showOtherInputs: false,
      gotData: false,
      newSerial: '',
      newMeter: '',
      buildName: '',
      buildDescription: '',
      loaderBuildings: true,
      visible: false,
      unitsArray: [],
      unitsArraySend: [],
      buildingData: [],
      lastUnitData: '',
      editModal: false,
      editBuilding: '',
      editBuildDes: '',
      showSearch: false,
      showFilter: false,
      newUnitInfo: {
        indexUnits: '',
        unitBuild: '',
        unitName: '',
        unitSerial: '',
        unitMeter: '',
      },
      newBuildInfo: {
        newBuildIndex: '',
        newBuildName: '',
        newBuildUnits: [],
      },
      editData: {
        atIndex: '',
        id: '',
        editBuild: '',
        editUnit: '',
        editSerial: '',
        editMeter: '',
      },
      dataBuild: [],
      meterTypeData: {
        manufacturer: '',
        model: '',
        multiplier: 1,
        unit_of_measure_id: '',
      },
      typeOfMeters: [],
      typeOfMetersVisible: false,
      typeOfMeterIndex: '',
      measureOfUnit: [],
      selectedManufacuter: [],
      selectedModel: [],
      dataActivityTop: [],
      dataActivity: [],
      realData: [],
      ListA: [],
      vals: '',
      ListB: [],
      ListC: [],
      error: {
        buildingName: false,
        units: false,
      },
      measureOfUnitName: '',
      errorUnits: {
        units: '',
        meter: false,
        deviceSerial: '',
      },
      meterTypeInputs: [
        {
          name: 'MANUFACTURER*',
          showList: false,
          input: '',
          error: '',
        },
        {
          name: 'MODEL*',
          showList: false,
          input: '',
          error: '',
        },
        // {
        //   name: 'SIZE*',
        //   showList: false,
        //   input: '',
        // },
        {
          name: 'MULTIPLIER*',
          showList: false,
          input: '1',
          error: '',
        },
        {
          name: 'UNIT OF MEASURE*',
          showList: false,
          input: '',
          error: '',
        },
      ],
      editBuildId: 0,
    };
    this.state.realData = this.state.realData.map((item) => {
      item.isSelected = false;
      item.checkBarcode = false;
      item.checkMeterRead = false;
      item.checkProgramDevice = false;
      item.isSelectedClass = styles.infoViewContainer;
      item.isSelectedView = styles.unitListInfo;
      item.barcode = styles.barcodeVisible;
      item.meterRead = styles.meterReading;
      item.programDevice = styles.programDevice;

      return item;
    });
    this.state.dataActivity = this.state.dataActivity.map((element) => {
      element.build = this.state.buildName;
      return element;
    });

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  componentDidMount() {
    this.setState({loader: true, loaderBuildings: true});
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
    this.getToken();
  }

  onFocusFunction = () => {
    this.setState({loader: true, loaderBuildings: true});
    this.getToken();
    console.log('Equip--->', this.props.navigation.state.params.item.item.id);
    this.setState({isModalVisible: false});
  };

  showSuggestion = (index) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;

    this.setState({meterTypeInputs: newArr});
  };

  // onChangeInputs = (index, text) => {
  //   let newArr = [...this.state.meterTypeInputs];
  //   newArr[index].input = text;
  //   this.setState({ meterTypeInputs: newArr });
  // };

  hideSuggestion = (index, val, name) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;
    newArr[index].input = val;
    newArr[index].error = '';
    this.setState({meterTypeInputs: newArr}, () =>
      console.log('Meter Type', this.state.meterTypeInputs),
    );
    if (index == 0) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, manufacturer: val},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 1) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, model: val},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 2) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, multiplier: val},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 3) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, unit_of_measure_id: val},
          measureOfUnitName: name,
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
  };

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      this.checkData();
    }
  };
  get_filterVal = (payload) => {
    console.log('Devce serial', payload);
    this.setState({showFilter: false});
    this.filerUnits(payload);
  };

  checkData = async () => {
    const response = await this.api.get(
      `/property/equipment/building/all-buildings/${this.props.navigation.state.params.item.item.id}`,
    );
    // console.log('Check response buildings--->', response);
    if (response?.ok == true) {
      this.setState({dataBuild: response?.data?.data});
      this.setState({loaderBuildings: false});
      if (response?.data?.data?.length != 0) {
        this.setState({
          buildingData: response?.data?.data[0],
          editBuildDes: response?.data?.data[0].descriptions,
          editBuildId: response?.data?.data[0].id,
        });
        console.log('Building Id', response?.data?.data[0].id);
        const data = {
          building_id: response?.data?.data[0].id,
        };
        // this.setState({items: response?.data?.data});
        const unitResponse = await this.api.post(
          `/property/equipment/unit/all-units`,
          data,
        );
        console.log('Check unitResponse unit--->', unitResponse?.data?.data);
        console.log(
          'Check UNIT Meter --->',
          unitResponse?.data?.data[1].unit_meter,
        );
        // console.log('buildingData--->', this.state.buildingData);

        if (unitResponse?.ok == true) {
          this.setState({realData: unitResponse?.data?.data, loader: false});
          let arry = unitResponse?.data?.data;
          let lastElement = arry[arry.length - 1];
          // console.log('lastElement--->', lastElement)
          this.setState({
            lastUnitData: lastElement.name,
            newUnit: lastElement.name,
          });
          console.log('buildingId--->', this.state.editBuildId);
        } else {
          alert('Network Issue');
          this.setState({loader: false});
        }
      } else {
        this.setState({loader: false});
      }
    } else {
      alert('Network Issue');
      this.setState({loaderBuildings: false});
    }
  };

  filerUnits = async (serial) => {
    console.log('Get filert', serial);
    let data = {
      building_id: this.state.editBuildId,
      device_serial_number: serial,
    };

    if (serial) {
      this.setState({loader: true});
      const unitResponse = await this.api.post(
        `/property/equipment/unit/all-units`,
        data,
      );
      console.log('Search Units===>', unitResponse);
      if (unitResponse?.data?.bool) {
        this.setState({realData: unitResponse?.data?.data, loader: false});
        console.log('Search Units===>', unitResponse.data.data);
        this.setState({loader: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({loader: false});
      }
    } else {
      this.setState({loader: true});
      const unitResponse = await this.api.post(
        `/property/equipment/unit/all-units`,
        data,
      );
      console.log('Search Units===>', unitResponse);
      if (unitResponse?.data?.bool) {
        this.setState({realData: unitResponse?.data?.data, loader: false});
        console.log('Search Units===>', unitResponse.data.data);
        this.setState({loader: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({loader: false});
      }
    }
  };

  searchUnits = async (e) => {
    this.setState({loadFor: e});
    console.log('Get filert', serial);
    let data = {
      building_id: this.state.editBuildId,
      search: e,
      device_serial_number: serial,
    };

    if (e || serial) {
      this.setState({searchLoading: true});
      const unitResponse = await this.api.post(
        `/property/equipment/unit/all-units`,
        data,
      );
      console.log('Search Units===>', unitResponse);
      if (unitResponse?.data?.bool) {
        this.setState({searchList: unitResponse.data.data});
        console.log('Search Units===>', unitResponse.data.data);
        this.setState({searchLoading: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({searchLoading: false});
      }
    } else {
      this.setState({searchList: []});
    }
  };

  getLoopOfUnits = (text) => {
    console.log('text-->', text);
    const n = text == undefined ? 10 : text;
    var value = this.state.unitIndex - 1;
    var int = this.state.newUnit;
    var str = this.state.newUnit;
    // var tName = 'arun_4874';
    int = parseInt(int.match(/\d+/)) + 1;
    str = str.replace(/[0-9]/g, '');
    console.log('int-------->', int);
    console.log('str-------->', str);

    var loopData = [];
    var i;
    for (i = 0; i < n; i++) {
      loopData.push({
        name: str + ' ' + int,
        num: value + 1,
      }),
        (value = value + 1);
      int = int + 1;
    }
    this.setState({unitsArray: loopData}, () =>
      console.log('array--->', this.state.unitsArray),
    );
  };

  addInput = (value, i) => {
    // console.log(value, 'value-->');
    // console.log('Index-->', i);
    this.setState({newUnit: value});
    if (this.state.autoIncrement == true) {
      var int = value;
      var str = value;
      // var tName = 'arun_4874';
      int = parseInt(int.match(/\d+/));
      str = str.replace(/[0-9]/g, '');
      let unitsArray = [...this.state.unitsArray];
      this.state.unitsArray.map((item, index) => {
        if (index >= i) {
          unitsArray[index] = {
            ...unitsArray[index],
            name: str + (isNaN(int) ? '' : int),
          };
          this.setState({unitsArray}, () =>
            console.log('onchane===>', this.state.unitsArray),
          );
          int = int + 1;
          console.log('int---check', int);
        }
      });
    } else {
      let unitsArray = [...this.state.unitsArray];
      unitsArray[i] = {...unitsArray[i], name: value};
      this.setState({unitsArray}, () =>
        console.log('onchane===>', this.state.unitsArray),
      );
    }
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  toggleModalUnit = () => {
    this.setState({isModalUnitVisible: !this.state.isModalUnitVisible});
  };
  toggleModalMunit = () => {
    this.setState({isModalMunitVisible: !this.state.isModalMunitVisible});
  };
  toggleModalBuild = () => {
    this.setState({isModalBuildVisible: !this.state.isModalBuildVisible});
  };
  toggleModalEdit = () => {
    this.setState({isModalEditVisible: !this.state.isModalEditVisible});
  };
  toggleAddUtility = () => {
    this.setState({isModaladdUVisible: !this.state.isModaladdUVisible});
  };
  scannerModal = () => {
    this.setState({isScannerVisible: false});
    this.setState({scan: false});
  };

  // scanAgain = () => {
  //   this.setState({
  //     scan: true,
  //     scanResult: false,
  //   });
  // };

  hideMenu = () => {
    this.setState({visible: false});
  };

  showMenu = () => {
    this.setState({visible: true});
  };

  naviagateToDetail = () => {
    // this.toggleModal();
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
    // this.toggleModal();
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  selectAndCloseAdd = async () => {
    this.toggleModalUnit();
    this.changeLayoutMeter2();
    this.setState({gotData: false});
    if (!this.state.isModalUnitVisible) {
      const unitResponse = await this.api.get(
        `/property/equipment/meter/all-meters`,
      );
      console.log('Check meter add--->', unitResponse);
      this.setState({
        meterListArray: unitResponse?.data?.data.sort((a, b) =>
          a.name > b.name ? 1 : -1,
        ),
        gotData: true,
      });
      console.log(
        'Check meter add--->',
        unitResponse?.data?.data.sort((a, b) => (a.name > b.name ? 1 : -1)),
      );
    }
  };
  selectAndCloseAddMultiple = () => {
    this.toggleModalMunit();
    this.changeLayoutMeter2();
    this.getLoopOfUnits();
  };
  selectAndCloseAddBuild = () => {
    this.toggleModalBuild();
    this.changeLayoutMeter2();
    this.getLoopOfUnits();
  };
  changeLayoutMeter = () => {
    // listViewRef.scrollToEnd({animated: true});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter: !this.state.meter, meter2: false});
  };
  changeLayoutMeter2 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter2: !this.state.meter2, meter: false});
  };
  changeLayoutMeter3 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter3: !this.state.meter3});
    Keyboard.dismiss();
  };
  changeLayoutUnit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({addU: !this.state.addU});
  };
  changeLayoutEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({editU: !this.state.editU});
  };

  changeLayoutUtilityScr = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({uScr: !this.state.uScr});
  };

  changeAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  changeUtilityAndToggle = () => {
    this.toggleModalUnit();
    this.setState({uScr: false});
    this.setState({newBuild: 'A'});
    // this.setState({ newUnit: '' });
    this.setState({newSerial: ''});
    this.setState({newMeter: ''});
    this.setState({newMeter: '', meterListData: []});
    this.setState((prevState) => ({
      ...prevState,
      errorUnits: {
        // object that we want to update
        ...prevState.errorUnits, // keep all other key-value pairs
        units: '', // update the value of specific key
      },
    }));
  };
  changeUtilityAndToggleAddU = () => {
    this.toggleAddUtility();
    this.changeLayoutUtilityScr();
    // this.setState({ meterList: !this.state.newUnit });
  };
  editAndToggleEdit = (unit) => {
    this.toggleModalEdit();
    this.actionOnPress(unit);
  };
  programDevice = (unit) => {
    this.toggleModalEdit();
    unit.item.isSelected = true;
    // this.actionOnPress(unit);
  };
  handleAddNewUnit = async () => {
    const matchUnit = this.state.realData.filter(
      (e) => e.name == this.state.lastUnitData,
    );
    // console.log('matchUnit--->', matchUnit)
    // console.log('lastUnitData--->', this.state.lastUnitData)
    const checkSerial = this.state.meterListData.filter(
      (item) => item.deviceSerialNum === '',
    );
    const checkMeterType = this.state.meterListData.filter(
      (item) => item.meterType == '',
    );

    if (!this.state.lastUnitData) {
      this.setState((prevState) => ({
        ...prevState,
        errorUnits: {
          // object that we want to update
          ...prevState.errorUnits, // keep all other key-value pairs
          units: 'Unit Required', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        errorUnits: {
          // object that we want to update
          ...prevState.errorUnits, // keep all other key-value pairs
          units: '', // update the value of specific key
        },
      }));
    }
    if (matchUnit.length != 0) {
      this.setState((prevState) => ({
        ...prevState,
        errorUnits: {
          // object that we want to update
          ...prevState.errorUnits, // keep all other key-value pairs
          units: 'This unit already exist', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        errorUnits: {
          // object that we want to update
          ...prevState.errorUnits, // keep all other key-value pairs
          units: '', // update the value of specific key
        },
      }));
    }
    if (this.state.meterListData.length == 0) {
      alert('Select meter and continue');
      return;
    }
    if (checkSerial.length) {
      this.state.meterListData.map((data, index) => {
        if (data.deviceSerialNum == '') {
          // dispatch(modalAction.show({ title: "empty input" + data.id }));
          // console.log('deviceSerialNum',index)
          let newArr = [...this.state.meterListData];
          newArr[index].deviceSerialError = 'Device serial required';
          this.setState({meterListData: newArr});
          return;
        } else {
          // console.log('deviceSerialNum else',index)
          let newArr = [...this.state.meterListData];
          newArr[index].deviceSerialError = '';
          this.setState({meterListData: newArr});
        }
      });
    } else {
      this.state.meterListData.map((data, index) => {
        let newArr = [...this.state.meterListData];
        newArr[index].deviceSerialError = '';
        this.setState({meterListData: newArr});
      });
    }
    if (checkMeterType.length) {
      this.state.meterListData.map((data, index) => {
        if (data.meterType == '') {
          // dispatch(modalAction.show({ title: "empty input" + data.id }));
          // console.log('deviceSerialNum',index)
          let newArr = [...this.state.meterListData];
          newArr[index].meterTypeError = 'Meter Type Required';
          this.setState({meterListData: newArr});
          return;
        } else {
          // console.log('deviceSerialNum else',index)
          let newArr = [...this.state.meterListData];
          newArr[index].meterTypeError = '';
          this.setState({meterListData: newArr});
        }
      });
    } else {
      this.state.meterListData.map((data, index) => {
        let newArr = [...this.state.meterListData];
        newArr[index].meterTypeError = '';
        this.setState({meterListData: newArr});
      });
      var loopData = [];
      this.state.meterListData.map((data, index) => {
        loopData.push({
          meter_id: data.id,
          device_serial_number: data.deviceSerialNum,
          meter_serial_number: data.meterSerialNum,
          custom_meter_id: data.customMeterId,
          type_id: data.meterType,
        });
      });
      const data = {
        name: this.state.lastUnitData,
        building_id: this.state.buildingData.id,
        meters: loopData,
      };
      console.log('data--->', data);
      try {
        const unitResponse = await this.api.post(
          `/property/equipment/unit/add-unit`,
          data,
        );
        console.log('Check unitResponse add--->', unitResponse);
        this.setState({loader: true, loaderBuildings: true});
        this.checkData();
      } catch (e) {
        alert(e);
        console.log('errorrr--->', e);
      }
      this.changeUtilityAndToggle();
    }
  };
  addMeterInNewArray = async (value) => {
    this.setState({visible: false});
    console.log('value Of selectable meter_______', value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const data = {
      id: value.id,
      deviceSerialNum: '',
      deviceSerialError: '',
      meterType: '',
      meterTypeName: '',
      meterTypeError: '',
      meterAttachedTo: '',
      meterAttachedError: '',
      meterSerialNum: '12357841',
      customMeterId: '6564678',
      name: value.name,
      icon: value.icon,
      meterTypeMenu: false,
    };
    const newArray = [...this.state.meterListData];
    newArray.push(data);
    this.setState({meterListData: newArray});
    const newList = this.state.meterListArray.filter(
      (item) => item.id !== value.id,
    );
    this.setState({meterListArray: newList});
    const unitResponse = await this.api.get(
      `/property/equipment/type/all-types`,
    );
    console.log('Check types add--->', unitResponse.data);
    this.setState({typeOfMeters: unitResponse?.data?.data}, () =>
      console.log('Meter Type Of_______', this.state.typeOfMeters),
    );
  };
  showMoreInputs = (value, index) => {
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].showOtherInputs = !value.showOtherInputs; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  onChangeMultipleField = (e, index) => {
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].deviceSerialNum = e; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
  };
  onChangeTypeBuilder = (e, index) => {
    let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
    newArr[index].input = e; // replace e.target.value with whatever you want to change it to
    this.setState({meterTypeInputs: newArr}, () =>
      console.log('e--->', this.state.meterTypeInputs),
    );
    if (index == 0) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, manufacturer: e},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 1) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, model: e},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 2) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, multiplier: Number(e)},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 3) {
      this.setState(
        {
          meterTypeData: {...this.state.meterTypeData, unit_of_measure_id: e},
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
  };
  showTypesOfMeter = (item, index) => {
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].meterTypeMenu = true; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
  };
  hideTypesOfMeter = (item, index) => {
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].meterTypeMenu = false; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
  };
  onGetMeterTypeId = (item, index) => {
    let newArr = [...this.state.meterListData]; // copying the old datas array
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
    this.setState({meterListData: newArr});
  };

  deleteMeterInNewArray = (value) => {
    const newList = this.state.meterListData.filter(
      (item) => item.id !== value.id,
    );
    this.setState({meterListData: newList});

    const data = {
      id: value.id,
      name: value.name,
      icon: value.icon,
    };
    const newArray = [...this.state.meterListArray];
    newArray.push(data);
    this.setState({
      meterListArray: newArray.sort((a, b) => (a.name > b.name ? 1 : -1)),
    });
  };
  toggleScanner = async (value) => {
    this.setState({scanIndex: value});
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === true) {
        this.setState({hasAccess: true});
        this.setState({isScannerVisible: true});
        this.setState({scanResult: false});
        this.setState({scan: true});
        console.log('Access');
      } else {
        this.setState({hasAccess: false});
        Alert.alert(
          "You don't have access for the Camera",
          'Kindly TurnOn Camera Permission from Settings to use Scanner',
        );
        console.log('Denied');
      }
      return granted;
    } catch (err) {
      alert(err);
    }
  };
  onScanned = (e) => {
    const check = e.data.substring(0, 4);
    if (check == 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      let newArr = [...this.state.meterListData]; // copying the old datas array
      newArr[this.state.scanIndex].deviceSerialNum = e.data; // replace e.target.value with whatever you want to change it to
      this.setState({meterListData: newArr}, () =>
        console.log('e--->', this.state.meterListData),
      );
      this.setState({
        result: e,
        scan: false,
        newSerial: e.data,
        isScannerVisible: false,
      });

      setTimeout(() => {
        RNBeep.beep(false);
      }, 500);
    }
  };

  editOnPress = () => {
    if (this.state.typedBuild == '' || this.state.typedUnit == '') {
      alert('Kindly Fill the Required');
    } else {
      this.editUnit();
      this.toggleModalEdit();
    }
  };

  _renderSearchPropList = (unit) => (
    <TouchableOpacity onPress={() => this.actionOnPress(unit)}>
      <View style={[styles.infoViewContainer]}>
        <View style={styles.infoViewInner}>
          <Home
            name="house-user"
            size={width * 0.07}
            style={{
              marginLeft: width * 0.01,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              // alignItems: 'center',
              justifyContent: 'center',
              width: width * 0.3,
              overflow: 'hidden',
              marginLeft: width * 0.01,
              // backgroundColor:'red'
            }}>
            <TextTicker duration={5000} style={styles.dataFieldText} key={unit}>
              {unit.item.name}
            </TextTicker>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: width * 0.01,
              }}>
              {unit.item?.unit_meter.length ? (
                unit.item?.unit_meter?.map((item) => (
                  // console.log('item--->meter', item),
                  <Image
                    source={this.typeSwitcher(item.meter_name)}
                    style={{
                      height: width * 0.05,
                      width: width * 0.05,
                    }}
                  />
                ))
              ) : (
                <Text>No meters</Text>
              )}
            </View>
          </View>
          {/* <View style={[styles.meterReading]}> */}
          {/* <Text style={styles.dataFieldText}>
                  {unit.item?.unit_meter?.length}
                </Text>
                <Text style={styles.dataFieldText}>Meters</Text> */}
          {/* </View> */}
          {/* <Text style={styles.dataFieldText}>{unit.item.code}</Text> */}
          <TouchableOpacity
            style={[styles.programDevice]}
            onPress={() => this.programDevice(unit)}>
            <View style={styles.proDeviceContent}>
              <Barcode
                name="barcode-scan"
                size={height * 0.025}
                color="purple"
              />
              <Text style={styles.propDeviceText}>Program Device</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  _renderTopList = (build) => {
    return (
      // build.item.id == buildingData.id
      <TouchableOpacity
        onPress={() => this.showArrayItem(build)}
        style={styles.infoTopViewContainer}>
        <View style={styles.infoTopViewInner}>
          <Build name="office-building" size={width * 0.06} />
          <TextTicker
            duration={5000}
            style={[styles.dataFieldText, {width: width * 0.2}]}>
            {build.item.name}
          </TextTicker>
          {build.item.id == this.state.buildingData.id && (
            <View
              style={{
                position: 'absolute',
                right: width * 0,
                top: height * 0,
                width: width * 0.035,
                height: width * 0.035,
                backgroundColor: '#25AAE1ec',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopRightRadius: width * 0.008,
                borderBottomLeftRadius: width * 0.02,
              }}>
              <Check
                name="check"
                style={{marginLeft: width * 0.005}}
                size={width * 0.02}
                color="#fff"
              />
            </View>
          )}
        </View>
        <Text
          style={{
            paddingHorizontal: 10,
            fontSize: width * 0.04,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {build.item.unit_count} Units
        </Text>
        <TouchableOpacity
          onPress={() => this.buildingEditOpen(build.item)}
          style={{
            flexDirection: 'row',
            // borderTopWidth: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: height * 0.01,
            paddingVertical: height * 0.005,
            backgroundColor: '#25AAE1ec',
            borderBottomLeftRadius: width * 0.01,
            borderBottomRightRadius: width * 0.01,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Edit</Text>
          <Edit name="edit" color="white" size={width * 0.04} />
        </TouchableOpacity>
      </TouchableOpacity>
      // </KeyboardAvoidingVie  w>
    );
  };

  buildingEditOpen = (item) => {
    console.log(item, 'item--------->');
    this.setState({
      editModal: true,
      editBuilding: item.name,
      editBuildDes: item.descriptions,
      editBuildId: item.id,
    });
  };

  editUnit = () => {
    this.setState(
      Object.assign(this.state.editData, {indexUnits: this.state.unitIndex}),
    );
    this.setState(
      Object.assign(this.state.editData, {indexBuild: this.state.buildIndex}),
    );
    this.setState(
      Object.assign(this.state.editData, {atIndex: this.state.pressedIndex}),
    );
    this.setState(
      Object.assign(this.state.editData, {id: this.state.pressedID}),
    );
    this.setState(
      Object.assign(this.state.editData, {editBuild: this.state.typedBuild}),
    );
    this.setState(
      Object.assign(this.state.editData, {editUnit: this.state.typedUnit}),
    );
    this.setState(
      Object.assign(this.state.editData, {editSerial: this.state.typedCode}),
    );
    this.setState(
      Object.assign(this.state.editData, {editMeter: this.state.typedMType}),
    );
    this.context.editUnit(this.state.editData);
    this.setState({
      realData: this.context.propList[this.state.unitIndex].dataTop[
        this.state.buildIndex
      ].list,
    });
  };
  editOnPress2 = () => {
    let arrays = [...this.state.ListA];
    this.setState((prevState) => ({
      ListA: [...prevState.arrayvar, newelement],
    }));
    // this.setState({ ListA: this.state.ListA.map(el => (el.name === 'A-01')) })
    // const index = this.state.ListA.map(el => (el.name === 'A-01' ? { ...el, key: id } : el))
    this.setState({arrays});
    // console.log('Index oF List', index);
  };

  //todo: Unit Click Event +++++++++++++++++++++++
  actionOnPress = (unit) => {
    this.props.navigation.navigate('U_Details', {
      unitId: unit.item.id,
      buildingName: this.state.buildingData.name,
      buildingId: this.state.editBuildId,
    });
    this.setState({showSearch: false, loader: true, loaderBuildings: true});
    console.log(clc.cyan('Selected :', unit.item.id));
  };

  checkValues = (unit) => {
    if (unit.item.code === '') {
      unit.item.checkBarcode = true;
      unit.item.checkProgramDevice = false;
    } else {
      unit.item.checkBarcode = false;
      unit.item.checkProgramDevice = true;
    }
    if (unit.item.type === '') {
      unit.item.checkMeterRead = true;
    } else {
      unit.item.checkMeterRead = false;
    }

    unit.item.barcode = unit.item.checkBarcode
      ? styles.barcodeHide
      : styles.barcodeVisible;
    unit.item.meterRead = unit.item.checkMeterRead
      ? styles.barcodeHide
      : styles.meterReading;
    unit.item.programDevice = unit.item.checkProgramDevice
      ? styles.barcodeHide
      : styles.programDevice;
  };

  //todo: Units List
  typeSwitcher = (arg) => {
    switch (arg) {
      case 'hot water':
        return require('../../../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../../../Images/electric.png');
      case 'gas':
        return require('../../../../../Images/gass.png');
      case 'water':
        return require('../../../../../Images/all-waters.png');
      default:
        break;
    }
  };
  _renderMyList = (unit) => {
    this.checkValues(unit);
    return (
      <View>
        <TouchableOpacity onPress={() => this.actionOnPress(unit)}>
          <View style={[styles.infoViewContainer]}>
            <View style={styles.infoViewInner}>
              <Home
                name="house-user"
                size={width * 0.07}
                style={{
                  marginLeft: width * 0.01,
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  // alignItems: 'center',
                  justifyContent: 'center',
                  width: width * 0.3,
                  overflow: 'hidden',
                  marginLeft: width * 0.01,
                  // backgroundColor:'red'
                }}>
                <TextTicker
                  duration={5000}
                  style={styles.dataFieldText}
                  key={unit}>
                  {unit.item.name}
                </TextTicker>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: width * 0.01,
                  }}>
                  {unit.item?.unit_meter.length ? (
                    unit.item?.unit_meter?.map((item) => (
                      // console.log('item--->meter', item),
                      <Image
                        source={this.typeSwitcher(item.meter_name)}
                        style={{
                          height: width * 0.05,
                          width: width * 0.05,
                        }}
                      />
                    ))
                  ) : (
                    <Text>No meters</Text>
                  )}
                </View>
              </View>
              {/* <View style={[styles.meterReading]}> */}
              {/* <Text style={styles.dataFieldText}>
                  {unit.item?.unit_meter?.length}
                </Text>
                <Text style={styles.dataFieldText}>Meters</Text> */}
              {/* </View> */}
              {/* <Text style={styles.dataFieldText}>{unit.item.code}</Text> */}
              <TouchableOpacity
                style={[styles.programDevice]}
                onPress={() => this.programDevice(unit)}>
                <View style={styles.proDeviceContent}>
                  <Barcode
                    name="barcode-scan"
                    size={height * 0.025}
                    color="purple"
                  />
                  <Text style={styles.propDeviceText}>Program Device</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  clearBuildingModal = () => {
    this.setState({
      isModalBuildVisible: !this.state.isModalBuildVisible,
      buildName: '',
      unitsArray: [],
    });
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        buildingName: '', // update the value of specific key
        units: '',
      },
    }));
  };

  addMultipleUnits = () => {
    if (this.state.unitsArray.length === 0) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          units: 'Empty units', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          units: '', // update the value of specific key
        },
      }));
      var loopData = [];
      var i;
      for (i = 0; i < this.state.unitsArray.length; i++) {
        loopData.push({
          name: this.state.unitsArray[i].name,
        });
      }
      this.setState({unitsArraySend: loopData}, () =>
        this.handleAddMUnitsApi({
          building_id: this.state.editBuildId,
          units: this.state.unitsArraySend,
          descriptions: this.state.editBuildDes,
        }),
      );
    }
  };

  handleAddMUnitsApi = async (data) => {
    this.setState({loader: true, loaderBuildings: true});
    console.log('data--->', data);
    const unitResponse = await this.api.post(
      `/property/equipment/unit/add-multiple-units`,
      data,
    );
    console.log('Check unitResponse buildings--->', unitResponse);
    this.setState({
      isModalMunitVisible: false,
    });
    this.checkData();
  };

  newBuilding = () => {
    console.log('BUILD Name', this.state.buildName);
    if (this.state.buildName === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          buildingName: 'Invalid Building Name', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          buildingName: '', // update the value of specific key
        },
      }));
    }
    if (this.state.unitsArray.length === 0) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          units: 'Empty units', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          units: '', // update the value of specific key
        },
      }));
      var loopData = [];
      var i;
      for (i = 0; i < this.state.unitsArray.length; i++) {
        loopData.push({
          name: this.state.unitsArray[i].name,
        });
      }
      this.setState({unitsArraySend: loopData}, () =>
        this.handleAddbuildingApi({
          name: this.state.buildName,
          property_id: this.props.navigation.state.params.item.item.id,
          units: this.state.unitsArraySend,
          descriptions: this.state.buildDescription,
        }),
      );
      this.setState({isModalBuildVisible: false});
    }
  };
  handleAddbuildingApi = async (data) => {
    this.setState({loader: true, loaderBuildings: true});
    console.log('data--->', data);
    const unitResponse = await this.api.post(
      `/property/equipment/building/add-building`,
      data,
    );
    console.log('Check unitResponse buildings--->', unitResponse);
    this.setState({buildName: '', buildDescription: ''});

    this.checkData();
  };

  _renderUnitList = ({item, index}) => (
    // <View style={styles.addUnitListView}>
    <TextInput
      key={index}
      // label="BILLING COMPANY*"
      value={item.name}
      dense={true}
      onChangeText={(text) => {
        this.addInput(text, index);
      }}
      style={[styles.input, {alignSelf: 'center', fontSize: width * 0.03}]}
      scrollEnabled={false}
      underlineColor="transparent"
      mode={'outlined'}
      theme={{
        colors: {
          text: '#25AAE1ec',
          primary: '#25AAE1ec',
          selectionColor: 'red',
        },
      }}
    />
    // {/* <Text style={{ color: '#25AAE1ec' }}>{item.num}</Text> */}
    // </View>
  );
  _renderMeterTypes = ({item}) => (
    <TouchableOpacity onPress={() => this.showMeter({item})}>
      <View style={styles.meterTypeContainer}>
        {/* <View style={{height: height * .08}}> */}
        <Image
          resizeMode="contain"
          source={item.image}
          style={styles.meterTypeView}
        />
        {/* </View> */}
        <Text
          key={item}
          style={{
            width: width * 0.265,
            fontFamily: Fonts.Montserrat,
            fontSize: height * 0.034,
            color: item.color,
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
  _renderMeterTypeList = ({item}) => (
    <TouchableOpacity
      style={styles.meterListBtn}
      onPress={() => this.showMeter2({item})}>
      <Drop name={item.icon} size={15} color="#3E89BF" />
      <Text key={item} style={{fontSize: 12}}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  meterListSeperater = () => <View style={styles.line} />;
  loaderLoad = () => {
    this.setState({isModalVisible: false});
    this.setState({loader: true});
    setTimeout(() => {
      this.setState({loader: false});
    }, 1000);
  };

  showArrayItem = async (build) => {
    // console.log('What Item We Get', build.item.id)
    this.setState({
      loader: true,
      buildingData: build.item,
      editBuildDes: build.item.descriptions,
      editBuildId: build.item.id,
    });
    const data = {
      building_id: build.item.id,
    };
    const unitResponse = await this.api.post(
      `/property/equipment/unit/all-units`,
      data,
    );
    console.log('Check unitResponse buildings--->', unitResponse);
    // console.log('buildingData--->', this.state.buildingData);
    if (unitResponse?.ok == true) {
      this.setState({realData: unitResponse?.data?.data, loader: false});
      let arry = unitResponse?.data?.data;
      let lastElement = arry[arry.length - 1];
      this.setState({
        lastUnitData: lastElement.name,
        newUnit: lastElement.name,
      });
      // console.log('lastElement--->', this.state.lastUnitData);
    } else {
      alert('Network Issue');
      this.setState({loader: false});
    }
  };

  showMeter = (item) => {
    console.log('Selected 2', item);
    this.setState({pressedText: item.item.name, meterId: item.item.id});
    this.setState({hColor: item.item.color});
    this.setState({isModaladdUVisible: false});
    this.changeLayoutUtilityScr();
    this.setState({noCode: false});
    this.setState({editU: false});
    this.setState({pressedType: item.item.name});
    // this.setState({ uScr: false })
  };
  showMeter2 = (item) => {
    // console.log('Selected', item);
    this.setState({pressedText: item.item.name, meterId: item.item.id});
    this.setState({hColor: item.item.color});
    this.setState({isModaladdUVisible: false});
    this.changeUtilityAndToggleAddU();
    this.setState({uScr: true, meterList: !this.state.meterList});
  };

  showBuild = (unit) => {
    // console.log('Selected 2', unit.item.name)
    // console.log('Selected 2', item.item.name)
    this.setState({buildIndex: unit.index});
    this.setState({newBuild: unit.item.name});
    this.changeLayoutMeter3();
  };
  addMeter = () => {
    this.toggleAddUtility();
  };

  naviagateToEquip = () => {
    // this.toggleModal();
    this.setState({isModalVisible: false});
  };

  handleMetertypeModal = async (index) => {
    const unitResponse = await this.api.get(
      `/property/equipment/unit-of-measure/all`,
    );
    this.setState(
      {measureOfUnit: unitResponse?.data?.data, typeOfMeterIndex: index},
      () => console.log('measureOfUnit Of_______', this.state.measureOfUnit),
    );
    this.setState({
      isModalMeterVisible: true,
    });
  };

  handleSaveMeterTypeBuilder = async () => {
    if (!this.state.meterTypeData.manufacturer) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[0].error = 'Select manufacturer'; // replace e.target.value with whatever you want to change it to
      this.setState({meterTypeInputs: newArr});
      return;
    }
    if (!this.state.meterTypeData.model) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[1].error = 'Select model'; // replace e.target.value with whatever you want to change it to
      this.setState({meterTypeInputs: newArr});
      return;
    }
    if (!this.state.meterTypeData.multiplier) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[2].error = 'This should be greater then one '; // replace e.target.value with whatever you want to change it to
      this.setState({meterTypeInputs: newArr});
      return;
    }
    if (!this.state.meterTypeData.unit_of_measure_id) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[3].error = 'Select measure of unit '; // replace e.target.value with whatever you want to change it to
      this.setState({meterTypeInputs: newArr});
      return;
    } else {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      });
      console.log('measureOfUnit Of_______', this.state.meterTypeData);

      const unitResponse = await this.api.post(
        `/property/equipment/type/add-type`,
        this.state.meterTypeData,
      );
      console.log('addtype response--->', unitResponse);
      if (unitResponse?.ok) {
        // this.setState({ measureOfUnit: unitResponse?.data?.data }, () =>
        // console.log('measureOfUnit Of_______', this.state.measureOfUnit),
        // );
        let newArr = [...this.state.meterListData]; // copying the old datas array
        newArr[this.state.typeOfMeterIndex].meterTypeName =
          // unitResponse?.data?.data?.type?.manufacturer +
          // '-' +
          unitResponse?.data?.data?.type?.model +
          '(x' +
          unitResponse?.data?.data?.type?.multiplier +
          unitResponse?.data?.data?.type?.unit_of_measure +
          ')'; // replace e.target.value with whatever you want to change it to
        newArr[this.state.typeOfMeterIndex].meterType =
          unitResponse?.data?.data?.type?.id;
        this.setState({meterListData: newArr});
        this.setState({
          isModalMeterVisible: false,
        });
        this.setState((prevState) => ({
          ...prevState,
          meterTypeData: {
            // object that we want to update
            ...prevState.meterTypeData, // keep all other key-value pairs
            manufacturer: '',
            model: '',
            multiplier: 1,
            unit_of_measure_id: '', // update the value of specific key
          },
          measureOfUnitName: '',
        }));
        this.state.meterTypeInputs.map((item, index) => {
          let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
          if (index != 2) {
            newArr[index].input = ''; // replace e.target.value with whatever you want to change it to
          } else {
            newArr[index].input = '1';
          }
          this.setState({meterTypeInputs: newArr});
        });
      } else {
        alert('Network error');
      }
    }
  };

  meterTypeClose = () => {
    this.setState({
      isModalMeterVisible: false,
      measureOfUnitName: '',
    });
    this.setState((prevState) => ({
      ...prevState,
      meterTypeData: {
        // object that we want to update
        ...prevState.meterTypeData, // keep all other key-value pairs
        manufacturer: '',
        model: '',
        multiplier: 1,
        unit_of_measure_id: '', // update the value of specific key
      },
    }));
    this.state.meterTypeInputs.map((item, index) => {
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      if (index != 2) {
        newArr[index].input = ''; // replace e.target.value with whatever you want to change it to
      } else {
        newArr[index].input = '1';
      }
      newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
      this.setState({meterTypeInputs: newArr});
    });
  };

  openAndClear = () => {
    this.setState({showSearch: true});
    this.setState({searchList: []});
  };
  openFilter = () => {
    this.context.getBillingCompany();
    this.setState({showFilter: true});
  };

  deleteBuilding = () => {
    this.setState({editModal: false});
    this.context.updateBuilding(false, this.state.editBuildId);
    this.setState({loader: true, loaderBuildings: true});
    this.onFocusFunction();
  };

  updateBuilding = () => {
    this.setState({editModal: false});
    let data = {
      name: this.state.editBuilding,
      descriptions: this.state.editBuildDes,
    };
    this.context.updateBuilding(true, this.state.editBuildId, data);
    this.setState({loader: true, loaderBuildings: true});
    this.onFocusFunction();
  };

  editAlert = () => {
    Alert.alert('Update Building', 'Are you sure you want to Update?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => this.updateBuilding()},
    ]);
  };

  deleteAlert = () => {
    Alert.alert('Delete Building', 'Are you sure you want to Delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => this.deleteBuilding()},
    ]);
  };

  render() {
    const {result, scan, scanResult} = this.state;
    const realData = this.state.realData;
    const realColor = this.state.hColor;
    const {loader, loaderBuildings, meterTypeInputs} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        {/* Building Edit Modal */}
        <UpdateModal
          isVisible={this.state.editModal}
          title="Edit Building"
          doneBtnTitle="Update Building"
          style={{height: height * 0.55}}
          onCancel={() => this.setState({editModal: false})}
          onDone={this.editAlert}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
                <TextInput
                  // label="Name*"
                  value={this.state.editBuilding}
                  dense={true}
                  onChangeText={(text) => {
                    this.setState({editBuilding: text});
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
              <View style={styles.desciptionContainer}>
                <Text style={styles.desciptionHeading}>
                  Building Despcription*
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  // label="BILLING COMPANY*"
                  value={this.state.editBuildDes}
                  dense={true}
                  onChangeText={(text) => {
                    this.setState({editBuildDes: text});
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
              <View
                style={{
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: width * 0.75,
                    alignSelf: 'center',
                    marginVertical: width * 0.05,
                  }}>
                  <Button
                    titleStyle={{textTransform: 'capitalize'}}
                    title={`Delete Building`}
                    buttonStyle={{
                      backgroundColor: '#e24b4b',
                    }}
                    onPress={() => this.deleteAlert()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </UpdateModal>
        {/* Drawer Modal */}
        <Modal
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          isVisible={this.state.isModalVisible}
          swipeDirection="left"
          onSwipeStart={this.toggleModal}
          onBackdropPress={this.toggleModal}
          backdropColor="black"
          style={styles.modalContainer}>
          <View style={styles.drawerMainContainer}>
            <View style={{marginTop: StatusBar.currentHeight}}>
              <Menu
                name="menu"
                size={height * 0.05}
                color="white"
                // style={{right: 90}}
                onPress={this.toggleModal}
                style={{backgroundColor: '#35afe2'}}
              />
            </View>
            <View style={styles.drawerContentContainer}>
              <TouchableOpacity onPress={this.naviagateToDetail}>
                <View style={styles.drawerContent}>
                  <Detail
                    name="account-details-outline"
                    size={height * 0.035}
                    color="#7575ff"
                    style={{marginRight: width * 0.02}}
                  />
                  <Text style={styles.drawerbtn}>Profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToEquip}>
                <View style={styles.drawerContent}>
                  <Equip
                    name="rss"
                    size={height * 0.035}
                    color="#ff9f71"
                    style={{marginRight: width * 0.02}}
                  />
                  <Text style={styles.drawerbtn}>Units</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToChart}>
                <View style={styles.drawerContent}>
                  <Chart
                    name="pie-chart"
                    size={height * 0.035}
                    color="#009349"
                    style={{marginRight: width * 0.02}}
                  />
                  <Text style={styles.drawerbtn}>Charts</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.naviagateToSupport}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: height * 0.015,
                  // backgroundColor: 'pink',
                }}>
                <Detail
                  name="help-circle-outline"
                  size={height * 0.035}
                  color="#35afe2"
                  style={{
                    marginBottom: height * 0.009,
                    marginRight: width * 0.02,
                  }}
                />
                <Text style={styles.drawerbtn}>Support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.menuView}>
              <Back
                size={width * 0.08}
                color="white"
                name="keyboard-backspace"
              />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: height * 0.08,
                }}
                onPress={this.openAndClear}>
                <Search
                  name="search"
                  size={height * 0.04}
                  style={{marginLeft: width * 0.05}}
                  color="white"
                />
                <TextInput
                  disabled={true}
                  underlineColor="transparent"
                  dense={true}
                  placeholderTextColor="white"
                  placeholder="Search"
                  style={styles.search}
                  // onChangeText={(e) => this.context.searchProperties(e)}
                  theme={{
                    colors: {
                      text: 'white',
                      primary: '#25dAE1',
                      selectionColor: 'transparent',
                      background: 'transparent',
                    },
                  }}
                  // onFocus={() =>
                  //   this.setState({showSearch: true})
                  // }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.openFilter}>
                <FilterIcon name="filter-outline" color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Menu
              name="menu"
              size={height * 0.04}
              color="white"
              style={{right: 100}}
              onPress={this.toggleModal}
            />
            <View style={{flexDirection: 'row', right: 15}}>
              <Equip
                name="rss"
                size={height * 0.04}
                color="white"
                style={{top: height * 0.002}}
              />
              <Text style={styles.mainHeadiing}>Units</Text>
            </View>
          </View>
        </View>
        {/* <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}> */}
        <View style={styles.bodyContainer}>
          <View style={styles.mainDataContainer}>
            <View style={styles.mainData}>
              <View
                style={{
                  paddingHorizontal: width * 0.03,
                  // marginVertical: width * .006,
                  justifyContent: 'center',
                  borderRightWidth: width * 0.001,
                  // height: height * 0.13,
                  // backgroundColor:'red'
                }}>
                <View style={{width: width * 0.35}}>
                  <TouchableOpacity
                    style={styles.dropDown}
                    onPress={this.changeLayoutMeter}>
                    <Message name="file" size={height * 0.025} color="purple" />
                    <Text style={styles.dropDownText}>File</Text>
                    <Message
                      name="chevron-down"
                      size={height * 0.02}
                      color="purple"
                      style={{marginLeft: width * 0.02}}
                    />
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.dropDownList,
                      {
                        height: this.state.meter ? height * 0.09 : 0,
                        borderWidth: this.state.meter ? height * 0.001 : 0,
                        marginBottom: this.state.meter ? height * 0.01 : 0,
                      },
                    ]}>
                    <View
                      style={{
                        padding: height * 0.008,
                        justifyContent: 'space-between',
                        height: height * 0.08,
                      }}>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Upload File Pressed')}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.dropDownListText}>
                            Upload File
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Download File Pressed')}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.dropDownListText}>
                            Download File
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: this.state.meter2 ? width * 0.018 : 0,
                    width: width * 0.35,
                  }}>
                  <TouchableOpacity
                    style={styles.dropDown}
                    onPress={this.changeLayoutMeter2}>
                    <Message name="plus" size={height * 0.025} color="purple" />
                    <Text style={styles.dropDownText}>Add</Text>
                    <Message
                      name="chevron-down"
                      size={height * 0.02}
                      color="purple"
                      style={{marginLeft: width * 0.02}}
                    />
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.dropDownList,
                      {
                        height: !this.state.meter2
                          ? height * 0.0
                          : height * 0.18,
                        borderWidth: this.state.meter2 ? height * 0.001 : 0,
                      },
                    ]}>
                    <View
                      style={{
                        padding: height * 0.015,
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        height: height * 0.12,
                      }}>
                      <TouchableOpacity
                        disabled={
                          this.state.dataBuild.length == 0 ? true : false
                        }
                        onPress={this.selectAndCloseAdd}>
                        <View
                          style={{
                            // backgroundColor: 'green',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: width * 0.23,
                          }}>
                          <Home
                            color={
                              this.state.dataBuild.length == 0
                                ? '#817e7e80'
                                : '#000'
                            }
                            name="house-user"
                            size={height * 0.02}
                          />
                          <Text
                            style={[
                              styles.dropDownListText,
                              {
                                color:
                                  this.state.dataBuild.length == 0
                                    ? '#817e7e80'
                                    : '#000',
                              },
                            ]}>
                            Add a Unit
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={
                          this.state.dataBuild.length == 0 ? true : false
                        }
                        onPress={this.selectAndCloseAddMultiple}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: width * 0.265,
                          }}>
                          <Home
                            color={
                              this.state.dataBuild.length == 0
                                ? '#817e7e80'
                                : '#000'
                            }
                            name="house-user"
                            size={height * 0.02}
                          />
                          <Text
                            style={[
                              styles.dropDownListText,
                              {
                                color:
                                  this.state.dataBuild.length == 0
                                    ? '#817e7e80'
                                    : '#000',
                              },
                            ]}>
                            Add Multiple{'\n'}Units
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.selectAndCloseAddBuild}>
                      <View
                        style={{
                          padding: width * 0.03,
                          borderTopWidth: height * 0.001,
                          borderColor: 'gray',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}>
                        <Build name="office-building" size={height * 0.02} />
                        <Text
                          style={{
                            fontSize: 14,
                          }}>
                          Add a Building
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Top Lists */}
              {loaderBuildings ? (
                <View style={{width: width * 0.55, justifyContent: 'center'}}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : this.state.dataBuild.length == 0 ? (
                <View style={{width: width * 0.55, justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      textAlign: 'center',
                    }}>
                    No data add Building
                  </Text>
                </View>
              ) : (
                <FlatList
                  style={{
                    // padding:width * .01,
                    height: width * 0.22,
                  }}
                  // numColumns={1}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.dataBuild}
                  renderItem={this._renderTopList}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
              {/*//todox: Add Unit Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalUnitVisible}
                // isVisible={true}
                style={styles.modal1Container}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.modalInner}>
                    <View
                      style={[
                        styles.boxConatainer,
                        {
                          height:
                            this.state.meterListData.length == 0
                              ? height * 0.44
                              : height * 0.55,
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
                            <Text style={styles.modalHeading}>New Unit</Text>
                            <Pressable
                              onPress={this.changeUtilityAndToggle}
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
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View style={{flex: 1}}>
                            <View style={styles.desciptionContainer}>
                              <Build
                                name={'office-building'}
                                size={height * 0.02}
                                color="#5e5e5e"
                              />
                              <Text style={styles.desciptionHeading}>
                                BUILDING*
                              </Text>
                            </View>
                            <View style={styles.inputContainer}>
                              <TextInput
                                placeholder="Building Name"
                                value={this.state.buildingData.name}
                                dense={true}
                                editable={false}
                                showSoftInputOnFocus={false}
                                onChangeText={(text) => {
                                  this.setState({newBuild: text});
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
                            <View style={styles.desciptionContainer}>
                              <Text style={styles.desciptionHeading}>
                                UNIT*
                              </Text>
                            </View>
                            <View style={[styles.inputContainer]}>
                              <TextInput
                                placeholder="Unit Name"
                                value={this.state.lastUnitData}
                                dense={true}
                                onChangeText={(text) => {
                                  this.setState({lastUnitData: text});
                                }}
                                style={[
                                  styles.input,
                                  {
                                    width: !this.state.meter3
                                      ? width * 0.75
                                      : width * 0.0,
                                  },
                                ]}
                                error={this.state.errorUnits.units}
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
                            <HelperText
                              type="error"
                              visible={this.state.errorUnits.units}>
                              {this.state.errorUnits.units}
                            </HelperText>

                            {/* {this.state.meterList && ( */}
                            {this.state.meterListData &&
                              this.state.meterListData.map(
                                (item, meterIndex) => (
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
                                        <View
                                          style={styles.utilityInScrHeadView}>
                                          <Drop
                                            name={item.icon}
                                            size={width * 0.06}
                                            color="#3E89BF"
                                          />
                                          <Text
                                            style={[
                                              styles.utilityInScrHead,
                                              {
                                                color: realColor,
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
                                            onPress={() =>
                                              this.deleteMeterInNewArray(item)
                                            }>
                                            <Delete
                                              name={'delete-forever'}
                                              size={height * 0.04}
                                              color="#25AAE1ec"
                                            />
                                          </TouchableOpacity>
                                        </View>
                                        <View
                                          style={
                                            styles.meterDesciptionContainer
                                          }>
                                          <Text
                                            style={
                                              styles.meterDesciptionHeading
                                            }>
                                            Device serial number
                                          </Text>
                                        </View>
                                        <View
                                          style={styles.meterInputContainer}>
                                          <TextInput
                                            placeholder="Serial Number"
                                            value={item.deviceSerialNum}
                                            dense={true}
                                            error={item.deviceSerialError}
                                            right={
                                              <TextInput.Icon
                                                name={() => (
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      this.toggleScanner(
                                                        meterIndex,
                                                      )
                                                    }>
                                                    <Scanner
                                                      name="scan"
                                                      size={20}
                                                    />
                                                  </TouchableOpacity>
                                                )}
                                              />
                                            }
                                            onChangeText={(text) =>
                                              this.onChangeMultipleField(
                                                text,
                                                meterIndex,
                                              )
                                            }
                                            style={styles.meterInput}
                                            mode={'outlined'}
                                            theme={{
                                              colors: {
                                                text: '#25AAE1ec',
                                                primary: '#25AAE1ec',
                                                selectionColor: 'red',
                                              },
                                            }}>
                                            {/* <Scanner name="scan" size={20} /> */}
                                          </TextInput>
                                        </View>
                                        {item.deviceSerialError ? (
                                          <HelperText
                                            type="error"
                                            visible={item.deviceSerialError}>
                                            {item.deviceSerialError}
                                          </HelperText>
                                        ) : null}
                                        <View
                                          style={
                                            styles.meterDesciptionContainer
                                          }>
                                          <Text
                                            style={
                                              styles.meterDesciptionHeading
                                            }>
                                            Meter type
                                          </Text>
                                        </View>
                                        <View
                                          // onPress={() =>
                                          //   this.setState({
                                          //     isModalMeterVisible: true,
                                          //   })
                                          // }
                                          style={{
                                            backgroundColor: '#F6F6F6',
                                            alignSelf: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            borderColor: item.meterTypeError
                                              ? 'red'
                                              : 'gray',
                                            width: width * 0.75,
                                            height: height * 0.07,
                                            borderWidth: width * 0.003,
                                            borderRadius: width * 0.01,
                                            justifyContent: 'space-between',
                                            paddingHorizontal: width * 0.03,
                                          }}>
                                          {/* <Text>{item.name}</Text> */}
                                          {this.state.typeOfMeters.length ? (
                                            <MenuT
                                              visible={item.meterTypeMenu}
                                              style={{height: height * 0.12}}
                                              anchor={
                                                this.state.typeOfMeters
                                                  .length ? (
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      this.showTypesOfMeter(
                                                        item,
                                                        meterIndex,
                                                      )
                                                    }
                                                    style={{
                                                      width: width * 0.5,
                                                      flexDirection: 'row',
                                                      justifyContent:
                                                        'flex-start',
                                                      alignItems: 'center',
                                                    }}>
                                                    <TextTicker
                                                      marqueeDelay={1000}
                                                      duration={5000}
                                                      style={{
                                                        fontSize:
                                                          height * 0.018,
                                                        color: '#25AAE1ec',
                                                        textTransform:
                                                          'capitalize',
                                                      }}>
                                                      {item.meterTypeName
                                                        ? item.meterTypeName
                                                        : 'Select'}
                                                    </TextTicker>
                                                  </TouchableOpacity>
                                                ) : (
                                                  <View
                                                    style={{
                                                      marginLeft: width * 0.02,
                                                    }}>
                                                    <DotsLoader />
                                                  </View>
                                                )
                                              }
                                              onRequestClose={() =>
                                                this.hideTypesOfMeter(
                                                  item,
                                                  meterIndex,
                                                )
                                              }>
                                              <ScrollView>
                                                {this.state.typeOfMeters.map(
                                                  (item, index) => (
                                                    <View
                                                      style={{
                                                        flexDirection: 'row',
                                                        justifyContent:
                                                          'center',
                                                        alignItems: 'center',
                                                        paddingLeft:
                                                          width * 0.02,
                                                      }}>
                                                      <Drop
                                                        name={item.icon}
                                                        size={15}
                                                        color="#3E89BF"
                                                      />
                                                      <MenuItem
                                                        style={{
                                                          width: width * 0.7,
                                                        }}
                                                        onPress={() =>
                                                          this.onGetMeterTypeId(
                                                            item,
                                                            meterIndex,
                                                          )
                                                        }>
                                                        <Text
                                                          style={{
                                                            textTransform:
                                                              'capitalize',
                                                          }}>
                                                          {item.manufacturer +
                                                            '-' +
                                                            item.model +
                                                            ' ' +
                                                            '(x' +
                                                            item.multiplier +
                                                            ' ' +
                                                            item.unit_of_measure +
                                                            ')'}
                                                        </Text>
                                                      </MenuItem>
                                                    </View>
                                                  ),
                                                )}
                                              </ScrollView>
                                            </MenuT>
                                          ) : (
                                            <DotsLoader
                                              color="#25AAE1ec"
                                              size={width * 0.02}
                                            />
                                          )}

                                          <TouchableOpacity
                                            onPress={() =>
                                              this.handleMetertypeModal(
                                                meterIndex,
                                              )
                                            }>
                                            <Plus name="plus" size={20} />
                                          </TouchableOpacity>
                                        </View>
                                        {item.meterTypeError ? (
                                          <HelperText
                                            type="error"
                                            visible={item.meterTypeError}>
                                            {item.meterTypeError}
                                          </HelperText>
                                        ) : null}
                                        <View
                                          style={
                                            styles.meterDesciptionContainer
                                          }>
                                          <Text
                                            style={
                                              styles.meterDesciptionHeading
                                            }>
                                            Meter Attached To
                                          </Text>
                                        </View>
                                        <View
                                          style={styles.meterInputContainer}>
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
                                        </View>
                                        {item.showOtherInputs == true ? (
                                          <View>
                                            <View
                                              style={
                                                styles.meterDesciptionContainer
                                              }>
                                              <Text
                                                style={
                                                  styles.meterDesciptionHeading
                                                }>
                                                Meter Serial Number
                                              </Text>
                                            </View>
                                            <View
                                              style={
                                                styles.meterInputContainer
                                              }>
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
                                            </View>
                                            <View
                                              style={
                                                styles.meterDesciptionContainer
                                              }>
                                              <Text
                                                style={
                                                  styles.meterDesciptionHeading
                                                }>
                                                Custom Meter ID
                                              </Text>
                                            </View>
                                            <View
                                              style={
                                                styles.meterInputContainer
                                              }>
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
                                            </View>
                                          </View>
                                        ) : (
                                          console.log('Check Item', item)
                                        )}
                                        <TouchableOpacity
                                          onPress={() =>
                                            this.showMoreInputs(
                                              item,
                                              meterIndex,
                                            )
                                          }
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
                                ),
                              )}

                            {/* // </ScrollView> */}
                            {/* )} */}
                          </View>
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
                              visible={this.state.visible}
                              style={{height: height * 0.2}}
                              anchor={
                                this.state.meterListArray.length ? (
                                  <Pressable
                                    onPress={this.showMenu}
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'flex-start',
                                      alignItems: 'center',
                                    }}
                                    android_ripple={{
                                      color: '#25AAE1ec',
                                      borderless: true,
                                      radius: height * 0.08,
                                    }}>
                                    {/*//todo: Button for meter */}
                                    <Plus
                                      name="plus"
                                      size={25}
                                      color="#25AAE1ec"
                                      // color="#ff0000"
                                    />
                                    <Text
                                      style={{
                                        fontSize: height * 0.018,
                                        color: '#25AAE1ec',
                                      }}>
                                      Meter
                                    </Text>
                                  </Pressable>
                                ) : (
                                  <View style={{marginLeft: width * 0.02}}>
                                    {this.state.gotData ? (
                                      <Text
                                        style={{
                                          fontSize: height * 0.018,
                                          color: '#25AAE1ec',
                                        }}>
                                        No Meters
                                      </Text>
                                    ) : (
                                      <DotsLoader />
                                    )}
                                  </View>
                                )
                              }
                              onRequestClose={this.hideMenu}>
                              <ScrollView>
                                {this.state.meterListArray.map(
                                  (item, index) => (
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // paddingLeft: width * 0.02,
                                      }}>
                                      <Drop
                                        name={item.icon}
                                        size={15}
                                        color="#3E89BF"
                                      />
                                      <MenuItem
                                        textStyle={styles.textCapitalize}
                                        onPress={() =>
                                          this.addMeterInNewArray(item)
                                        }>
                                        {item.name}
                                      </MenuItem>
                                    </View>
                                  ),
                                )}
                              </ScrollView>
                            </MenuT>
                          </View>
                          <View style={styles.addUnitBtnContainer}>
                            <TouchableOpacity
                              onPress={this.changeUtilityAndToggle}>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{color: 'black'}}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.handleAddNewUnit}>
                              <View style={styles.submitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{color: 'white'}}>Add Unit</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
              {/* Add Meter Type Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalMeterVisible}
                // isVisible={true}
                style={styles.modal1Container}>
                {/* <KeyboardAvoidingView behavior="padding"> */}
                <View style={styles.modalInner}>
                  <View
                    style={[
                      styles.boxConatainer,
                      {
                        height: !this.state.meterList
                          ? height * 0.6
                          : height * 0.82,
                      },
                    ]}>
                    <TouchableWithoutFeedback
                      onPress={() => Keyboard.dismiss()}>
                      <View style={[styles.boxInner]}>
                        {/* Box Header */}
                        <View style={styles.boxHeader}>
                          <View style={styles.boxHeaderInner}>
                            <Text style={styles.modalHeading}>
                              Meter Type Builder
                            </Text>
                            <Pressable
                              onPress={this.meterTypeClose}
                              android_ripple={{
                                color: '#000',
                                borderless: true,
                                radius: width * 0.03,
                              }}>
                              <Icon
                                name="cancel"
                                size={height * 0.035}
                                color="#000"
                                maxOpacity={0.5}
                              />
                            </Pressable>
                          </View>
                        </View>
                        {/* //TodoY: Meter Box Body */}
                        <View
                          style={{
                            height: height * 0.4,
                            overflow: 'hidden',
                          }}>
                          {meterTypeInputs.map((item, index) => {
                            return (
                              <View>
                                {index < 2 ? (
                                  <View>
                                    {/* <View style={styles.desciptionContainer}>
                                    <Text style={styles.desciptionHeading}>
                                      {item.name}
                                    </Text>
                                  </View> */}
                                    <SearchableDropdown
                                      onItemSelect={(item, indexy) => {
                                        this.hideSuggestion(index, item.name);
                                        console.log('kuch', indexy);
                                      }}
                                      containerStyle={{padding: width * 0.03}}
                                      itemStyle={{
                                        padding: width * 0.027,
                                        // marginTop: width * 0.01,
                                        backgroundColor: 'rgb(247, 247, 247)',
                                        borderColor: '#bbb',
                                        borderWidth: width * 0.0015,
                                        borderRadius: width * 0.015,
                                      }}
                                      itemTextStyle={{color: '#222'}}
                                      itemsContainerStyle={{
                                        maxHeight: height * 0.135,
                                      }}
                                      items={
                                        index == 0 ? manufacturers : models
                                      }
                                      resetValue={false}
                                      textInputProps={{
                                        placeholder:
                                          index == 0
                                            ? 'Manufacturer*'
                                            : 'Models*',
                                        underlineColorAndroid: 'transparent',
                                        style: {
                                          padding: width * 0.027,
                                          margin: 0,
                                          borderColor: item.error
                                            ? 'red'
                                            : 'black',
                                          borderWidth: width * 0.0019,
                                          borderRadius: width * 0.015,
                                        },
                                        onTextChange: (text) => {
                                          // console.log(text);
                                          this.onChangeTypeBuilder(text, index);
                                        },
                                        value: setTimeout(
                                          () => item.input,
                                          200,
                                        ),
                                        defaultValue: item.input,
                                      }}
                                      listProps={{
                                        nestedScrollEnabled: true,
                                      }}
                                    />
                                    {item.error ? (
                                      <HelperText
                                        type="error"
                                        visible={item.error}>
                                        {item.error}
                                      </HelperText>
                                    ) : null}
                                  </View>
                                ) : null}
                              </View>
                            );
                          })}
                          <View
                            style={{
                              height: height * 0.15,
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                              }}>
                              {meterTypeInputs.map((item, index) => {
                                return (
                                  <View>
                                    {index >= 2 ? (
                                      <View>
                                        <View
                                          style={{
                                            // height: height * 0.04,
                                            width: width * 0.38,
                                          }}>
                                          <Text
                                            style={styles.desciptionHeading}>
                                            {item.name}
                                          </Text>
                                        </View>
                                        <View
                                          style={[
                                            styles.inputContainer,
                                            {
                                              width: !this.state.meter3
                                                ? width * 0.35
                                                : width * 0.0,
                                            },
                                          ]}>
                                          <MenuT
                                            visible={
                                              index == 3 ? item.showList : null
                                            }
                                            anchor={
                                              index == 2 ? (
                                                <View>
                                                  <TextInput
                                                    keyboardType={
                                                      index == 2
                                                        ? 'decimal-pad'
                                                        : 'default'
                                                    }
                                                    value={item.input}
                                                    dense={true}
                                                    onFocus={() =>
                                                      this.showSuggestion(index)
                                                    }
                                                    onChangeText={(text) =>
                                                      this.onChangeTypeBuilder(
                                                        text,
                                                        index,
                                                      )
                                                    }
                                                    style={[
                                                      styles.input,
                                                      {
                                                        height: height * 0.058,
                                                        width: !this.state
                                                          .meter3
                                                          ? width * 0.35
                                                          : width * 0.0,
                                                      },
                                                    ]}
                                                    error={item.error}
                                                    mode={'outlined'}
                                                    theme={{
                                                      colors: {
                                                        text: '#25AAE1ec',
                                                        primary: '#25AAE1ec',
                                                        selectionColor: 'red',
                                                      },
                                                    }}
                                                  />
                                                  {item.error ? (
                                                    <HelperText
                                                      type="error"
                                                      visible={item.error}>
                                                      {item.error}
                                                    </HelperText>
                                                  ) : null}
                                                </View>
                                              ) : index == 3 ? (
                                                <View>
                                                  <TouchableOpacity
                                                    style={{
                                                      backgroundColor:
                                                        '#F6F6F6',
                                                      justifyContent: 'center',
                                                      borderColor: item.error
                                                        ? 'red'
                                                        : 'gray',
                                                      width: width * 0.35,
                                                      height: height * 0.061,
                                                      borderWidth:
                                                        width * 0.003,
                                                      borderRadius:
                                                        width * 0.01,
                                                      paddingHorizontal:
                                                        width * 0.03,
                                                      marginTop: width * 0.014,
                                                    }}
                                                    onPress={() =>
                                                      this.showSuggestion(index)
                                                    }>
                                                    <Text
                                                      style={{
                                                        color: '#25AAE1ec',
                                                        textTransform:
                                                          'capitalize',
                                                      }}>
                                                      {index == 3
                                                        ? this.state
                                                            .measureOfUnitName
                                                        : null}
                                                    </Text>
                                                  </TouchableOpacity>
                                                  {item.error ? (
                                                    <HelperText
                                                      // style={{
                                                      //   backgroundColor: 'red',
                                                      // }}
                                                      type="error"
                                                      visible={item.error}>
                                                      {item.error}
                                                    </HelperText>
                                                  ) : null}
                                                </View>
                                              ) : null
                                            }
                                            onRequestClose={() =>
                                              this.hideSuggestion(index)
                                            }>
                                            {index == 3
                                              ? this.state.measureOfUnit.map(
                                                  (item) => (
                                                    <MenuItem
                                                      textStyle={
                                                        styles.textCapitalize
                                                      }
                                                      onPress={() =>
                                                        this.hideSuggestion(
                                                          index,
                                                          item.id,
                                                          item.name,
                                                        )
                                                      }>
                                                      {item.name}
                                                    </MenuItem>
                                                  ),
                                                )
                                              : null}
                                          </MenuT>
                                        </View>
                                      </View>
                                    ) : null}
                                  </View>
                                );
                              })}
                            </View>
                            <View
                              style={{
                                // height: height * 0.1,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: height * 0.02,
                                  color: 'black',
                                  textTransform: 'capitalize',
                                  fontFamily: Fonts.ComfortaaRegular,
                                }}>
                                {'1 Pulse = ' +
                                  meterTypeInputs[2].input +
                                  (this.state.measureOfUnitName
                                    ? ` ${this.state.measureOfUnitName}`
                                    : ' Select')}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* Box Footer */}
                        <View style={styles.footerBtn}>
                          <View style={styles.addUnitBtnContainer}>
                            <TouchableOpacity onPress={this.meterTypeClose}>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{color: 'black'}}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={this.handleSaveMeterTypeBuilder}>
                              <View style={styles.submitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{color: 'white'}}>Save</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
                {/* </KeyboardAvoidingView> */}
              </Modal>
              <>
                {/* Edit Modal */}
                {/* <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalEditVisible}
                style={styles.modal1Container}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={[styles.modalInner]}>
                    <View
                      style={[styles.boxConatainer, { height: height * 0.6 }]}>
                      <View style={[styles.boxInner]}> */}
                {/* Box Header */}
                {/* <View style={styles.boxHeader}>
                          <View style={styles.boxHeaderInner}>
                            <Icon
                              name={'business'}
                              size={height * 0.05}
                              color="#5e5e5e"
                            />
                            <Text style={styles.modalHeading}>
                              Edit {this.state.typedUnit}
                            </Text>
                            <Pressable
                              onPress={this.toggleModalEdit}
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
                        </View> */}
                {/* Box Body */}
                {/* <ScrollView showsVerticalScrollIndicator={false}>
                          <View style={{ flex: 1 }}>
                            <View style={styles.desciptionContainer}>
                              <Build
                                name={'office-building'}
                                size={height * 0.02}
                                color="#5e5e5e"
                              />
                              <Text style={styles.desciptionHeading}>
                                BUILDING*
                              </Text>
                            </View>
                            <View style={styles.inputContainer}>
                              <TextInput
                                // label="Name*"
                                value={this.state.typedBuild}
                                dense={true}
                                editable={false}
                                onChangeText={(text) => {
                                  this.setState({ typedBuild: text });
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
                            <View style={styles.desciptionContainer}>
                              <Text style={styles.desciptionHeading}>
                                UNIT*
                              </Text>
                            </View>
                            <View style={styles.inputContainer}>
                              <TextInput
                                // label="BILLING COMPANY*"
                                value={this.state.typedUnit}
                                dense={true}
                                onChangeText={(text) => {
                                  this.setState({ typedUnit: text });
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
                            <View
                              style={{
                                alignItems: 'center',
                                overflow: 'hidden',
                              }}>
                              {this.state.noCode ? (
                                <View
                                  style={{
                                    height: this.state.editU ? height * 0.5 : 0,
                                    overflow: 'hidden',
                                    top: height * 0.04,
                                  }}>
                                  <FlatList
                                    data={meterTypes}
                                    renderItem={this._renderMeterTypes}
                                    keyExtractor={(item) => item.id.toString()}
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    height: this.state.editU
                                      ? height * 0.0
                                      : height * 0.4,
                                    overflow: 'hidden',
                                    top: height * 0.005,
                                    width: width * 0.75,
                                  }}>
                                  <View>
                                    <View style={styles.utilityInScrHeadView}>
                                      <Text
                                        style={[
                                          styles.utilityInScrHead,
                                          { color: '#9ACF72' },
                                        ]}>
                                        {this.state.pressedType}
                                      </Text>
                                    </View>
                                    <View
                                      style={styles.meterDesciptionContainer}>
                                      <Text
                                        style={styles.meterDesciptionHeading}>
                                        Transceiver
                                      </Text>
                                    </View>
                                    <View style={styles.meterInputContainer}>
                                      <TextInput
                                        value={this.state.typedCode}
                                        dense={true}
                                        onChangeText={(text) => {
                                          this.setState({ typedCode: text });
                                        }}
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
                                    <View
                                      style={styles.meterDesciptionContainer}>
                                      <Text
                                        style={styles.meterDesciptionHeading}>
                                        Meter type
                                      </Text>
                                    </View>
                                    <View style={styles.meterInputContainer}>
                                      <TextInput
                                        value={this.state.typedMType}
                                        dense={true}
                                        onChangeText={(text) => {
                                          this.setState({ typedMType: text });
                                        }}
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
                                    <View
                                      style={styles.meterDesciptionContainer}>
                                      <Text
                                        style={styles.meterDesciptionHeading}>
                                        Initial Meter Read (IMR)
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
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          </View>
                        </ScrollView> */}
                {/* Box Footer */}
                {/* <View style={styles.footerBtn}>
                          <View style={styles.bottonContainer}>
                            <TouchableOpacity onPress={this.toggleModalEdit}>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{ color: 'black' }}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.editOnPress}>
                              <View style={styles.saveUnitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{ color: 'white' }}>Save Unit</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View> */}
                {/* </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal> */}

                {/* Add Utility */}
                {/* <Modal
                animationIn="bounceInUp"
                animationOut="bounceOutDown"
                // backdropColor='white'
                onBackdropPress={this.toggleAddUtility}
                isVisible={this.state.isModaladdUVisible}>
                <View style={styles.utilityModalView}>
                  <FlatList
                    data={meterList}
                    renderItem={this._renderMeterTypeList}
                    ItemSeparatorComponent={this.meterListSeperater}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              </Modal> */}
              </>
              {/* Add Multiple Unit Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalMunitVisible}
                style={styles.modal1Container}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.modalInner}>
                    <View style={styles.mUnitboxConatainer}>
                      <View style={styles.boxInner}>
                        {/* Add Multiple Unit Modal Header */}
                        <View style={styles.boxHeader}>
                          <View style={styles.boxHeaderInner}>
                            <Icon
                              name={'business'}
                              size={height * 0.05}
                              color="#5e5e5e"
                            />
                            <Text style={styles.modalHeading}>New Units</Text>
                            <Pressable
                              onPress={() =>
                                this.setState({
                                  isModalMunitVisible: !this.state
                                    .isModalMunitVisible,
                                })
                              }
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
                        {/* Modal Body */}
                        <ScrollView style={{flex: 1}}>
                          <View style={styles.desciptionContainer}>
                            <Build
                              name={'office-building'}
                              size={height * 0.02}
                              color="#5e5e5e"
                            />
                            <Text style={styles.desciptionHeading}>
                              BUILDING*
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Building Name"
                              value={this.state.buildingData.name}
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
                            <Text style={styles.desciptionHeading}>
                              Description*
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Building Description"
                              value={this.state.editBuildDes}
                              onChangeText={(text) => {
                                this.setState({editBuildDes: text});
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
                          <View style={styles.desciptionContainer}>
                            <Home
                              name={'house-user'}
                              size={height * 0.02}
                              color="#5e5e5e"
                            />
                            <Text style={styles.desciptionHeading}>
                              # OF UNITS
                            </Text>
                          </View>
                          <View
                            style={{
                              height: height * 0.1,
                              width: width * 0.8,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderBottomWidth: width * 0.001,
                              // paddingHorizontal: width * 0.01,
                              // backgroundColor:'red'
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: width * 0.75,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // backgroundColor:'red'
                              }}>
                              <TextInput
                                // label="BILLING COMPANY*"
                                keyboardType="numeric"
                                error={this.state.error.units}
                                placeholder="# of Units"
                                // dense={true}
                                onChangeText={(text) => {
                                  this.getLoopOfUnits(text);
                                }}
                                style={{
                                  height: height * 0.07,
                                  width: width * 0.35,
                                  fontSize: height * 0.018,
                                }}
                                scrollEnabled={false}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                              />
                              <CheckBox
                                value={this.state.autoIncrement}
                                onValueChange={() =>
                                  this.setState({
                                    autoIncrement: !this.state.autoIncrement,
                                  })
                                }
                              />
                              <Text style={{fontSize: width * 0.035}}>
                                Auto Increment
                              </Text>
                            </View>
                          </View>
                          {this.state.error.units ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.units}>
                              {this.state.error.units}
                            </HelperText>
                          ) : null}
                          <FlatList
                            data={this.state.unitsArray}
                            initialNumToRender={this.state.noOfUnits}
                            renderItem={(item, index) =>
                              this._renderUnitList(item, index)
                            }
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </ScrollView>
                        {/* Box Footer */}
                        <View style={styles.footerBtn}>
                          <View style={styles.bottonContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  isModalMunitVisible: !this.state
                                    .isModalMunitVisible,
                                })
                              }>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{color: 'black'}}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.addMultipleUnits()}>
                              <View style={styles.saveUnitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{color: 'white'}}>Add Units</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
              {/* Add Building Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalBuildVisible}
                // isVisible={true}
                style={styles.modal1Container}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.modalInner}>
                    <View style={styles.mUnitboxConatainer}>
                      <View style={styles.boxInner}>
                        {/* Add Mutiple Unit Modal Header */}
                        <View style={styles.boxHeader}>
                          <View style={styles.boxHeaderInner}>
                            <Icon
                              name={'business'}
                              size={height * 0.05}
                              color="#5e5e5e"
                            />
                            <Text style={styles.modalHeading}>
                              New Building
                            </Text>
                            <Pressable
                              onPress={this.clearBuildingModal}
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
                        {/* Modal Body */}
                        <ScrollView style={{flex: 1}}>
                          {/* <View style={styles.desciptionContainer}>
                            <Build
                              name={'office-building'}
                              size={height * 0.02}
                              color="#5e5e5e"
                            />
                            <Text style={styles.desciptionHeading}>Name*</Text>
                          </View> */}
                          <View style={styles.inputContainer}>
                            <TextInput
                              // label={'Name*'}
                              // left={
                              //   <Build
                              //     name={'office-building'}
                              //     size={height * 0.02}
                              //     color="#5e5e5e"
                              //   />
                              // }
                              placeholder="Building Name"
                              error={this.state.error.buildingName}
                              // dense={true}
                              onChangeText={(text) => {
                                this.setState({buildName: text});
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
                          {this.state.error.buildingName ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.buildingName}>
                              {this.state.error.buildingName}
                            </HelperText>
                          ) : null}
                          {/* <View style={styles.desciptionContainer}>
                            <Text style={styles.desciptionHeading}>
                              Description*
                            </Text>
                          </View> */}
                          <View style={styles.inputContainer}>
                            <TextInput
                              // label="BILLING COMPANY*"
                              placeholder="Building Description"
                              // dense={true}
                              onChangeText={(text) => {
                                this.setState({buildDescription: text});
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
                          <View style={styles.desciptionContainer}>
                            <Home
                              name={'house-user'}
                              size={height * 0.02}
                              color="#5e5e5e"
                            />
                            <Text style={styles.desciptionHeading}>
                              # OF UNITS
                            </Text>
                          </View>
                          <View
                            style={{
                              height: height * 0.1,
                              width: width * 0.8,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderBottomWidth: width * 0.001,
                              // paddingHorizontal: width * 0.01,
                              // backgroundColor:'red'
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: width * 0.75,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // backgroundColor:'red'
                              }}>
                              <TextInput
                                // label="BILLING COMPANY*"
                                keyboardType="numeric"
                                error={this.state.error.units}
                                placeholder="# of Units"
                                // dense={true}
                                onChangeText={(text) => {
                                  this.getLoopOfUnits(text);
                                }}
                                style={{
                                  height: height * 0.07,
                                  width: width * 0.35,
                                  fontSize: height * 0.018,
                                }}
                                scrollEnabled={false}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                              />
                              <CheckBox
                                value={this.state.autoIncrement}
                                onValueChange={() =>
                                  this.setState({
                                    autoIncrement: !this.state.autoIncrement,
                                  })
                                }
                              />
                              <Text style={{fontSize: width * 0.035}}>
                                Auto Increment
                              </Text>
                            </View>
                          </View>
                          {this.state.error.units ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.units}>
                              {this.state.error.units}
                            </HelperText>
                          ) : null}
                          <FlatList
                            data={this.state.unitsArray}
                            initialNumToRender={this.state.noOfUnits}
                            renderItem={(item, index) =>
                              this._renderUnitList(item, index)
                            }
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </ScrollView>
                        {/* Box Footer */}
                        <View style={styles.footerBtn}>
                          <View style={styles.bottonContainer}>
                            <TouchableOpacity onPress={this.clearBuildingModal}>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{color: 'black'}}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.newBuilding()}>
                              <View style={styles.saveUnitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{color: 'white'}}>Add Build</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
              {/* Barcode Scanner */}
              <Modal
                animationIn="bounceInUp"
                animationOut="bounceInDown"
                // backdropColor='black'
                backdropOpacity={5}
                isVisible={this.state.isScannerVisible}>
                {/* <View style={{
                  flex: 1,
                  justifyContent: "space-around",
                  borderRadius: width * .02
                  // height: height * .6,
                  // alignItems: "center",
                }} > */}
                {scan && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-around',
                      borderRadius: width * 0.02,
                      // height: height * .6,
                      // alignItems: "center",
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: height * 0.02,
                      }}>
                      <TouchableOpacity onPress={this.scannerModal}>
                        <Back
                          size={width * 0.08}
                          color="white"
                          name="keyboard-backspace"
                        />
                        {/* <View style={{ backgroundColor: 'white', borderRadius: width * .008, height: height * .05, justifyContent: 'center', width: width * .4 }}>
                        </View> */}
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
                      onBarCodeRead={this.onScanned}
                      captureAudio={false}>
                      <BarcodeMask outerMaskOpacity={0} />
                      {/* <View style={{ height: height * .3, width: width * .6, borderWidth: width * .006, borderColor: 'yellow' }} /> */}
                    </RNCamera>
                  </View>
                )}
              </Modal>
            </View>
            <Filter
              type="Units"
              onReset={this.get_filterVal}
              get_filterVal={this.get_filterVal}
              isVisible={this.state.showFilter}
              close={() => this.setState({showFilter: !this.state.showFilter})}
              buildingName={this.state.buildingData.name}
            />
            {this.state.showSearch ? (
              <Modal
                isVisible={this.state.showSearch}
                style={{
                  elevation: width * 0.005,
                  width: width * 1,
                  height: height * 1,
                  justifyContent: 'flex-start',
                  left: '-5%',
                  top: '-2.5%',
                }}>
                <KeyboardAvoidingView behavior="padding">
                  <View
                    style={{
                      width: width * 1,
                      height: height * 0.08,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      backgroundColor: '#25AAE1ec',
                      // borderRadius: width * 0.1,
                      elevation: width * 0.01,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Search
                        name="search"
                        size={height * 0.04}
                        color="white"
                      />
                      <TextInput
                        underlineColor="transparent"
                        dense={true}
                        placeholderTextColor="white"
                        placeholder="Search"
                        style={styles.search}
                        onChangeText={(e) => this.searchUnits(e)}
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
                    <View
                      style={{
                        width: width * 0.05,
                      }}>
                      {this.state.searchLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => this.setState({showSearch: false})}>
                      <Close name="close" color="white" size={20} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      paddingVertical: height * 0.005,
                    }}>
                    <FlatList
                      data={this.state.searchList}
                      renderItem={this._renderSearchPropList}
                      removeClippedSubviews={false}
                      maxToRenderPerBatch={150}
                      windowSize={100}
                      keyExtractor={(item, index) => index.toString()}
                      showsVerticalScrollIndicator={false}
                      onEndReachedThreshold={width * 0.001}
                      onEndReached={this.context.loadSearchData}
                    />
                  </View>
                </KeyboardAvoidingView>
              </Modal>
            ) : null}
            {loader ? (
              <View style={{width: width * 0.55, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="black" />
              </View>
            ) : this.state.dataBuild.length == 0 ? (
              <View style={{width: width * 0.55, justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: 'center',
                  }}>
                  No data add Building
                </Text>
              </View>
            ) : (
              <FlatList
                ref={(ref) => {
                  listViewRef = ref;
                }}
                showsVerticalScrollIndicator={false}
                style={{marginBottom: height * 0.41}}
                contentContainerStyle={{backgroundColor: '#F5F5F5'}}
                numColumns={1}
                initialNumToRender={realData.length}
                data={realData}
                renderItem={this._renderMyList}
                // renderItem={(item, index) => console.log(item.index)}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
