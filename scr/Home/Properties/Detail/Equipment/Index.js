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
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Home from 'react-native-vector-icons/FontAwesome5';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
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
import Fire from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import Compact from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
import {DotsLoader} from 'react-native-indicator';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import Base_URL from '../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import {create} from 'apisauce';

// Components
import {Fonts} from '../../../../utils/fonts';
import File from './Form';
import styles from './style';
import style from './style';
import ContextProp from '../../Context/propContext';
// import { FlatList } from 'react-native-gesture-handler';
import {color} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
import {SafeAreaView} from 'react-navigation';
const {width, height} = Dimensions.get('window');
let listViewRef;

const meterTypes = [
  {
    id: 1,
    name: 'Generic',
    image: require('../../../../../Images/Water-Meter.png'),
    color: '#3E89BF',
  },
  {
    id: 2,
    name: 'IMS',
    image: require('../../../../../Images/Gas-Meter2.png'),
    color: '#9ACF72',
  },
  {
    id: 3,
    name: 'MasterTek',
    image: require('../../../../../Images/Electric-Meter2.png'),
    color: '#E7D931',
  },
];

const manufacturers = [
  {
    id: 1,
    name: 'AMCO',
    // image: require('../../../../../Images/Water-Meter.png'),
    // color: '#3E89BF',
  },
  {
    id: 2,
    name: 'Badger',
    // image: require('../../../../../Images/Gas-Meter2.png'),
    // color: '#9ACF72',
  },
  {
    id: 3,
    name: 'Conservice',
    // image: require('../../../../../Images/Electric-Meter2.png'),
    // color: '#E7D931',
  },
];
const models = [
  {
    id: 1,
    name: 'C4000 Digital Compound (AMCO Bypass)',
    // image: require('../../../../../Images/Water-Meter.png'),
    // color: '#3E89BF',
  },
  {
    id: 2,
    name: 'Compound RTR',
    // image: require('../../../../../Images/Gas-Meter2.png'),
    // color: '#9ACF72',
  },
  {
    id: 3,
    name: 'MJ09 Brass',
    // image: require('../../../../../Images/Electric-Meter2.png'),
    // color: '#E7D931',
  },
];
const meterList = [
  {
    id: 1,
    name: 'All Water',
    icon: 'water-outline',
  },
  {
    id: 2,
    name: 'Cold Water',
    icon: 'water-outline',
  },
  {
    id: 3,
    name: 'Hot Water',
    icon: 'water-outline',
  },
  {
    id: 4,
    name: 'Commercial Water',
    icon: 'water-outline',
  },
  {
    id: 5,
    name: 'Gas',
    icon: 'water-outline',
  },
  {
    id: 6,
    name: 'Electric',
    icon: 'water-outline',
  },
  {
    id: 7,
    name: 'Run Time',
    icon: 'water-outline',
  },
  {
    id: 8,
    name: 'Thermal Usage',
    icon: 'water-outline',
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
      loader: false,
      scanIndex: null,
      meterListData: [],
      meterListArray: [
        // {
        //   id: 1,
        //   name: 'All Water',
        //   icon: 'water-outline',
        // },
        // {
        //   id: 2,
        //   name: 'Cold Water',
        //   icon: 'water-outline',
        // },
        // {
        //   id: 3,
        //   name: 'Hot Water',
        //   icon: 'water-outline',
        // },
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
      newUnit: 'Unit-',
      newUnitAdd: '',
      meterList: false,
      showOtherInputs: false,
      newSerial: '',
      newMeter: '',
      buildName: '',
      loaderBuildings: false,
      visible: false,
      unitsArray: [],
      unitsArraySend: [],
      buildingData: [],
      lastUnitData: '',
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
      dataActivityTop: [
        {
          id: 1,
          name: 'A',
          // length: ListA.length,
        },
        {
          id: 2,
          name: 'B',
          // length: ListB.length,
        },
        {
          id: 3,
          name: 'C',
          // length: ListC.length,
        },
        {
          id: 4,
          name: 'D',
        },
        {
          id: 5,
          name: 'E',
        },
        {
          id: 6,
          name: 'F',
        },
        {
          id: 7,
          name: 'G',
        },
        {
          id: 8,
          name: 'H',
        },
        {
          id: 9,
          name: 'I',
        },
        {
          id: 10,
          name: 'J',
        },
        {
          id: 11,
          name: 'K',
        },
        {
          id: 12,
          name: 'L',
        },
        {
          id: 13,
          name: 'M',
        },
        {
          id: 14,
          name: 'N',
        },
        {
          id: 15,
          name: 'O',
        },
      ],
      dataActivity: [
        {
          id: 1,
          name: 'Unit-101',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 2,
          name: 'Unit-102',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 3,
          name: 'Unit-103',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 4,
          name: 'Unit-104',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 5,
          name: 'Unit-105',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 6,
          name: 'Unit-106',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 7,
          name: 'Unit-107',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 8,
          name: 'Unit-108',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 9,
          name: 'Unit-109',
          build: '',
          code: '',
          type: '',
        },
        {
          id: 10,
          name: 'Unit-110',
          build: '',
          code: '',
          type: '',
        },
      ],
      realData: [],
      ListA: [
        {
          id: 1,
          build: 'A',
          name: 'A-01',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 2,
          build: 'A',
          name: 'A-02',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 3,
          build: 'A',
          name: 'A-03',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 4,
          build: 'A',
          name: 'A-04',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 5,
          build: 'A',
          name: 'A-05',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 6,
          build: 'A',
          name: 'A-06',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 7,
          build: 'A',
          name: 'A-07',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 8,
          build: 'A',
          name: 'A-08',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 9,
          build: 'A',
          name: 'A-09',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 10,
          build: 'A',
          name: 'A-10',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 11,
          build: 'A',
          name: 'A-11',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 12,
          build: 'A',
          name: 'A-12',
          code: 'AA00EFE1',
          type: 'Cubic Feet',
        },
      ],
      ListB: [
        {
          id: 1,
          build: 'B',
          name: 'B-01',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 2,
          build: 'B',
          name: 'B-02',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 3,
          build: 'B',
          name: 'B-03',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 4,
          build: 'B',
          name: 'B-04',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 5,
          build: 'B',
          name: 'B-05',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 6,
          build: 'B',
          name: 'B-06',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 7,
          build: 'B',
          name: 'B-07',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 8,
          build: 'B',
          name: 'B-08',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 9,
          build: 'B',
          name: 'B-09',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 10,
          build: 'B',
          name: 'B-10',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 11,
          build: 'B',
          name: 'B-11',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 12,
          build: 'B',
          name: 'B-12',
          code: 'BA00EFE1',
          type: 'Cubic Feet',
        },
      ],
      ListC: [
        {
          id: 1,
          build: 'C',
          name: 'C-01',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 2,
          build: 'C',
          name: 'C-02',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 3,
          build: 'C',
          name: 'C-03',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 4,
          build: 'C',
          name: 'C-04',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 5,
          build: 'C',
          name: 'C-05',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 6,
          build: 'C',
          name: 'C-06',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 7,
          build: 'C',
          name: 'C-07',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 8,
          build: 'C',
          name: 'C-08',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 9,
          build: 'C',
          name: 'C-09',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 10,
          build: 'C',
          name: 'C-10',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 11,
          build: 'C',
          name: 'C-11',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
        {
          id: 12,
          build: 'C',
          name: 'C-12',
          code: 'CA00EFE1',
          type: 'Cubic Feet',
        },
      ],
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
    this.getToken();
    console.log('Equip--->', this.props.navigation.state.params.item.item.id);
    this.setState({isModalVisible: false});
  }

  showSuggestion = (index) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;

    this.setState({meterTypeInputs: newArr});
  };

  hideSuggestion = (index, val, name) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;
    newArr[index].input = val;
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
  checkData = async () => {
    const response = await this.api.get(
      `/property/equipment/building/all-buildings/${this.props.navigation.state.params.item.item.id}`,
    );
    console.log('Check response buildings--->', response);
    if (response?.ok == true) {
      this.setState({dataBuild: response?.data?.data});
      this.setState({loaderBuildings: false});
      if (response?.data?.data?.length != 0) {
        this.setState({buildingData: response?.data?.data[0]});
        const data = {
          building_id: response?.data?.data[0].id,
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
          // console.log('lastElement--->', lastElement)
          this.setState({lastUnitData: lastElement.name});
          // console.log('lastUnitData--->', this.state.lastUnitData)
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

  getLoopOfUnits = (text) => {
    console.log('text-->', text);
    const n = text == undefined ? 10 : text;
    var value = this.state.unitIndex - 1;
    var loopData = [];
    var i;
    for (i = 0; i < n; i++) {
      loopData.push({
        name: this.state.newUnit,
        num: value + 1,
      }),
        (value = value + 1);
    }
    this.setState({unitsArray: loopData}, () =>
      console.log('array--->', this.state.unitsArray),
    );
  };

  addInput = (value, i) => {
    console.log(value, 'value-->');
    console.log('Index-->', i);
    this.setState({newUnit: value});
    if (this.state.autoIncrement == true) {
      let unitsArray = [...this.state.unitsArray];
      this.state.unitsArray.map((item, index) => {
        if (index >= i) {
          unitsArray[index] = {...unitsArray[index], name: value};
          this.setState({unitsArray}, () =>
            console.log('onchane===>', this.state.unitsArray),
          );
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

  scanAgain = () => {
    this.setState({
      scan: true,
      scanResult: false,
    });
  };

  hideMenu = () => {
    this.setState({visible: false});
  };

  showMenu = () => {
    this.setState({visible: true});
  };
  showTypesOfMeter = (item,index) => {
    // this.setState({typeOfMetersVisible: true});
    // let newArr = [...this.state.meterListData]; // copying the old datas array
    // newArr[index].meterType = item; // replace e.target.value with whatever you want to change it to
    // this.setState({ meterListData: newArr }
    //   ,
    //   () => console.log('e--->', this.state.meterListData));
  };
  hideTypesOfMeter = () => {
    this.setState({typeOfMetersVisible: false});
  };
  onGetMeterTypeId = (item,index) => {
    this.setState({typeOfMetersVisible: false})
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].meterType = item.id; // replace e.target.value with whatever you want to change it to
    this.setState({ meterListData: newArr }
      ,
      () => console.log('e--->', this.state.meterListData));
  }

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
    if (!this.state.isModalUnitVisible) {
      const unitResponse = await this.api.get(
        `/property/equipment/meter/all-meters`,
      );
      console.log('Check meter add--->', unitResponse);
      this.setState({meterListArray: unitResponse?.data?.data});
    }
  };
  selectAndCloseAddMultiple = () => {
    this.toggleModalMunit();
    this.changeLayoutMeter2();
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
    this.setState({newUnit: ''});
    this.setState({newSerial: ''});
    this.setState({newMeter: ''});
    this.setState({newMeter: '', meterListData: []});
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
    this.actionOnPress(unit);
  };
  deleteUnit = (unit) => {
    // console.log('What We Get', unit)
    this.actionOnPress(unit);
    Alert.alert('Dangerous Act', 'Would You Want To Delete This Unit', [
      {
        text: 'No',
        style: 'cancel',
        // onPress: () => ,
      },
      {
        text: 'Yes',
        onPress: () => this.leftedUnits(unit),
      },
    ]);
  };
  leftedUnits = (unit) => {
    // console.log('Pressed', unit.index)
    // console.log('Pressed', this.context.propList[0].dataTop[this.state.buildIndex].list)
    this.context.propList[0].dataTop[this.state.buildIndex].list.splice(
      unit.index,
      1,
    );
    // this.state.realData.splice(unit.index, 1)
    // console.log('Pressed', unit.index)
    // if (unit.item.build == 'A') {
    //   this.state.ListA.splice(unit.index, 1)
    //   return this.setState({ ListA: this.state.ListA })
    // } else if (unit.item.build == 'B') {
    //   this.state.ListB.splice(unit.index, 1)
    //   return this.setState({ ListB: this.state.ListB })
    // } else if (unit.item.build == 'C') {
    //   this.state.ListC.splice(unit.index, 1)
    //   return this.setState({ ListC: this.state.ListC })
    // }
    // console.log('List', this.context.propList[0].dataTop[this.state.buildIndex].list)
    // let ListA = this.state.ListA
    // ListA.splice(unit.index, 1);
    return this.setState({
      realData: this.context.propList[0].dataTop[this.state.buildIndex].list,
    });
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
      (item) => item.meterType.length == 0,
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
        // if (data.meterType.length == 0) {
        //   console.log('meterType',index)
        //   let newArr = [...this.state.meterListData];
        //   newArr[index].meterTypeError = "Select meter type required";
        //   this.setState({ meterListData: newArr });
        //   return;
        // } else {
        //   console.log('meterType else',index)
        //   let newArr = [...this.state.meterListData];
        //   newArr[index].meterTypeError = "";
        //   this.setState({ meterListData: newArr });
        // }
      });
    } else {
      this.state.meterListData.map((data, index) => {
        let newArr = [...this.state.meterListData];
        newArr[index].deviceSerialError = '';
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
      // var i;
      // for (i = 0; i < n; i++) {
      //   loopData.push({
      //     name: this.state.newUnit,
      //     num: value + 1,
      //   }),
      //     (value = value + 1);
      // }
      // this.setState({ unitsArray: loopData }, () =>
      //   console.log('array--->', this.state.unitsArray),
      // );

      const data = {
        name: this.state.lastUnitData,
        building_id: this.state.buildingData.id,
        meters: [loopData],
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
    this.setState({meterListData: newArray}, () =>
      console.log('Check types add--->', this.state.meterListData),
    );
    const newList = this.state.meterListArray.filter(
      (item) => item.id !== value.id,
    );
    this.setState({meterListArray: newList});
    const unitResponse = await this.api.get(
      `/property/equipment/type/all-types`,
    );

    this.setState({typeOfMeters: unitResponse?.data?.data}, () =>
      console.log('Meter Type Of_______', this.state.typeOfMeters),
    );
  };

  deleteMeterInNewArray = (value) => {
    const newList = this.state.meterListData.filter(
      (item) => item.id !== value.id,
    );
    this.setState({meterListData: newList});

    console.log('Delete API', value);

    const data = {
      id: value.id,
      name: value.name,
      icon: value.icon,
    };
    const newArray = [...this.state.meterListArray];
    newArray.push(data);
    this.setState({meterListArray: newArray});
  };

  showMoreInputs = (value, index) => {
    // const newList = this.state.meterListData.filter(
    //   (item) => item.showInputs !== value.showInputs,
    // );
    // this.setState({meterListData: newList});

    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].showOtherInputs = !value.showOtherInputs; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // this.setState({showOtherInputs: !this.state.showOtherInputs});
  };

  onChangeMultipleField = (e, index) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.value);
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].deviceSerialNum = e; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
  };
  onChangeTypeBuilder = (e, index) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.value);
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
    // this.setState({typeOfMetersVisible: true});
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
    // this.setState({typeOfMetersVisible: false})
    // console.log('check itne',item)
    // console.log('check index',index)
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].meterTypeName =
      item.manufacturer +
      '-' +
      item.model +
      '(x' +
      item.multiplier +
      item.unit_of_measure +
      ')'; // replace e.target.value with whatever you want to change it to
    newArr[index].meterType = item.id; // replace e.target.value with whatever you want to change it to
    // console.log(newArr[index],'mter types') // replace e.target.value with whatever you want to change it to
    newArr[index].meterTypeMenu = false; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr});
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

    // this.setState({
    //   result: e,
    //   newSerial: e.data,
    //   scan: false,
    //   // scanResult: true,
    //   isScannerVisible: false,
    // })
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
  addMeterInNewArray = async (value) => {
    this.setState({visible: false});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const data = {
      id: value.id,
      deviceSerialNum: '',
      deviceSerialError: '',
      meterType: [],
      meterTypeError: '',
      meterAttachedTo: '',
      meterAttachedError: '',
      meterSerialNum: '',
      customMeterId: '',
      name: value.name,
      icon: value.icon,
      meterTypeMenu:false
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
    this.setState({meterListArray: newArray});
  };
  onChangeMultipleField = (e, index) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.value);
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].deviceSerialNum = e; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
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

    // this.setState({
    //   result: e,
    //   newSerial: e.data,
    //   scan: false,
    //   // scanResult: true,
    //   isScannerVisible: false,
    // })
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

  _renderTopList = (build) => (
    <TouchableOpacity onPress={() => this.showArrayItem(build)}>
      <View style={styles.infoTopViewContainer}>
        <View style={styles.infoTopViewInner}>
          <Build name="office-building" size={width * 0.06} />
          <Text style={styles.dataFieldText}>{build.item.name}</Text>
        </View>
        <Text style={{paddingHorizontal: 10}}>
          {build.item.unit_count} Units
        </Text>
      </View>
    </TouchableOpacity>
  );
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
    // this.showArrayItem(build)

    // const some_array = [...this.state.realData]
    // some_array[this.state.pressedIndex] = {
    //   id: this.state.pressedID,
    //   build: this.state.typedBuild,
    //   name: this.state.typedUnit,
    //   code: this.state.typedCode,
    //   type: this.state.typedMType,
    // }
    // if (this.state.typedBuild === 'A') {
    //   this.setState({ ListA: some_array })
    // } else if (this.state.typedBuild === 'B') {
    //   this.setState({ ListB: some_array })
    // } else if (this.state.typedBuild === 'C') {
    //   this.setState({ ListC: some_array })
    // }
    // this.setState({ realData: some_array })
  };
  editOnPress2 = () => {
    let arrays = [...this.state.ListA];
    this.setState((prevState) => ({
      ListA: [...prevState.arrayvar, newelement],
    }));
    // this.setState({ ListA: this.state.ListA.map(el => (el.name === 'A-01')) })
    // const index = this.state.ListA.map(el => (el.name === 'A-01' ? { ...el, key: id } : el))
    this.setState({arrays});
    console.log('Index oF List', index);
  };
  actionOnPress = (unit) => {
    console.log('Selected :', unit);

    // console.log("Pressed :", index)
    // if (item?.pressItem == item.id) {
    //   alert("wppdfl")
    // }
    // const index = this.state.realData.findIndex(
    //   item => unit.item.id === item.id
    // );
    // this.state.realData[index] = unit.item;
    switch (unit.item.type) {
      case 'Cubic Feet':
        this.setState({pressedType: 'Gas'});
        break;
      case 'Gallons':
        this.setState({pressedType: 'All Water'});
        break;

      default:
        break;
    }
    // if (unit.item.type == 'Cubic Feet') {
    //   this.setState({ pressedType: 'Gas' })
    //   this.setState({ pressedMeterType: 'G4 (X1 Cubic Feet)' })
    // }

    unit.item.isSelected = !unit.item.isSelected;
    this.state.typedUnit = this.state.pressedUnit = unit.item.name;
    this.state.typedBuild = this.state.pressedBuild = unit.item.build;
    this.state.typedCode = this.state.pressedCode = unit.item.code;
    this.state.typedMType = this.state.pressedMeterType = unit.item.type;
    this.state.pressedIndex = unit.index;
    this.state.pressedID = unit.item.id;
    unit.item.isSelectedClass = unit.item.isSelected
      ? styles.isSelectedUnit
      : styles.infoViewContainer;
    unit.item.isSelectedView = unit.item.isSelected
      ? styles.isSelected
      : styles.unitListInfo;
    if (unit.item.code === '') {
      this.setState({noCode: true});
      this.setState({editU: true});
    } else {
      this.setState({noCode: false});
      this.setState({editU: false});
    }

    if (unit.item.isSelected === true) {
      this.changeAnimation();
    } else if (unit.item.isSelected === false) {
      this.changeAnimation();
    }
    // console.log('second', this.state.pressedID)
    if (unit.index == this.state.realData.length - 1) {
      setTimeout(() => {
        listViewRef.scrollToEnd({animated: true});
      }, 1000);
    }
    // console.log('Unit Name', this.state.pressedType)
    this.setState({realData: this.state.realData});
    console.log('Code', this.state.realData.length - 1);
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

  _renderMyList = (unit) => {
    this.checkValues(unit);
    // console.log(unit.item.code)
    return (
      <View>
        <TouchableOpacity onPress={() => this.actionOnPress(unit)}>
          <View style={[styles.infoViewContainer]}>
            <View style={styles.infoViewInner}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: width * 0.2,
                  overflow: 'hidden',
                }}>
                <Home name="house-user" size={18} />
                <Text style={styles.dataFieldText} key={unit}>
                  {unit.item.name}
                </Text>
              </View>
              <View style={[styles.meterReading]}>
                {/* <View style={{ flexDirection: 'row' }}> */}
                <Barcode name="barcode-scan" size={height * 0.025} />
                <Text style={styles.dataFieldText}>
                  {/* <Fire name="burn" color="#7EC353" size={22} /> */}
                  97295
                </Text>
                {/* <Text style={styles.dataFieldText}>{unit.item.type}</Text> */}
                {/* </View> */}
                {/* <Text style={styles.dataFieldText} >Cubic Feet</Text> */}
              </View>
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
        {/* <View style={[styles.unitListInfo]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: height * 0.02,
            }}>
            <View
              style={{
                alignItems: 'center',
                borderRightWidth: width * 0.002,
                paddingHorizontal: width * 0.02,
              }}>
              <Fire name="fire" color="firebrick" size={22} />
              <Text style={styles.dataFieldText}>97295{'\n'}Cubic Feet</Text>
            </View>
            <View
              style={{ alignItems: 'center', paddingHorizontal: width * 0.02 }}>
              <Fire name="fire" color="firebrick" size={22} />
              <Text style={styles.dataFieldText}>97295{'\n'}Cubic Feet</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                borderLeftWidth: width * 0.002,
                paddingHorizontal: width * 0.02,
              }}>
              <Fire name="fire" color="firebrick" size={22} />
              <Text style={styles.dataFieldText}>97295{'\n'}Cubic Feet</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'purple',
              height: height * 0.045,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: width * 0.02,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: width * 0.32,
              }}>
              <TouchableOpacity style={{ flexDirection: 'row' }}>
                <Compact name="view-compact-outline" size={18} color="white" />
                <Text style={styles.detailEndText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => this.editAndToggleEdit(unit)}>
                <Icon name="edit" size={18} color="white" />
                <Text style={styles.detailEndText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => this.deleteUnit(unit)}>
              <Trash name="trash" size={18} color="white" />
              <Text style={styles.detailEndText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    );
  };
  checkInput = (item) => {
    console.log('check on press', item);
    // this.addInput(text)
    console.log(text);
  };

  clearBuildingModal = () => {
    this.setState({
      isModalBuildVisible: !this.state.isModalBuildVisible,
      buildName: '',
      unitsArray: [],
    });
  };

  newBuilding = () => {
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
          name: this.state.unitsArray[i].name + this.state.unitsArray[i].num,
        });
      }
      this.setState({unitsArraySend: loopData}, () =>
        this.handleAddbuildingApi({
          name: this.state.buildName,
          property_id: this.props.navigation.state.params.item.item.id,
          units: this.state.unitsArraySend,
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

    this.checkData();
  };

  _renderUnitList = ({item, index}) => (
    <View style={styles.addUnitListView}>
      <TextInput
        key={index}
        // label="BILLING COMPANY*"
        value={item.name}
        dense={true}
        onChangeText={(text) => {
          this.addInput(text, index);
        }}
        style={styles.addUnitListInput}
        scrollEnabled={false}
        underlineColor="transparent"
        mode={'flat'}
        theme={{
          colors: {
            text: '#25AAE1ec',
            primary: '#25AAE1ec',
            selectionColor: 'red',
          },
        }}
      />
      <Text style={{color: '#25AAE1ec'}}>{item.num}</Text>
    </View>
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
  _renderBuildList = (unit) => (
    <TouchableOpacity
      style={styles.meterListBtn}
      onPress={() => this.showBuild(unit)}>
      <Text
        key={unit}
        style={{
          fontSize: 12,
          color: this.state.meter3 ? 'black' : 'transparent',
        }}>
        {unit.item.name}
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
    this.setState({loader: true, buildingData: build.item});
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
      this.setState({lastUnitData: lastElement.name});
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
  // showInfo = () => {
  //   if (this._renderUnitList(item) === 1) {
  //     // this.setState({ itemName: itemname })
  //     // console.log(this.state.itemName)
  //     return item.name
  //   }
  // }

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
      newArr[0].error = 'Select or type manufacturer'; // replace e.target.value with whatever you want to change it to
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
      newArr[1].error = 'Select or type model'; // replace e.target.value with whatever you want to change it to
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
      newArr[3].error = 'Select or measure of unit '; // replace e.target.value with whatever you want to change it to
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
          unitResponse?.data?.data?.type?.manufacturer +
          '-' +
          unitResponse?.data?.data?.type?.model +
          '(x' +
          unitResponse?.data?.data?.type?.multiplier +
          unitResponse?.data?.data?.type?.unit_of_measure +
          ')'; // replace e.target.value with whatever you want to change it to
        this.setState({meterListData: newArr});
        this.setState({
          isModalMeterVisible: false,
        });
      } else {
        alert('Network error');
      }
    }
  };

  meterTypeClose = () => {
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
    }));
    this.state.meterTypeInputs.map((item, index) => {
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      if (index != 2) {
        newArr[index].input = ''; // replace e.target.value with whatever you want to change it to
        this.setState({meterTypeInputs: newArr});
      }
    });
  };
  render() {
    const {result, scan, scanResult} = this.state;
    const realData = this.state.realData;
    const realColor = this.state.hColor;
    const {loader, loaderBuildings, meterTypeInputs} = this.state;
    return (
      <View style={styles.container}>
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
        <StatusBar backgroundColor="white" barStyle="dark-content" />
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
              <Search
                name="search"
                size={height * 0.04}
                style={{marginLeft: width * 0.05}}
                color="white"
              />
              <TextInput
                underlineColor="transparent"
                dense={true}
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
                  justifyContent: 'space-around',
                  borderRightWidth: width * 0.001,
                }}>
                <View style={{width: width * 0.35}}>
                  <TouchableOpacity
                    style={styles.dropDown}
                    onPress={this.changeLayoutMeter}>
                      <Message
                        name="file"
                        size={height * 0.025}
                        color="purple"
                      />
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
                      <Message
                        name="plus"
                        size={height * 0.025}
                        color="purple"
                      />
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
                      <TouchableOpacity onPress={this.selectAndCloseAdd}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: width * 0.23,
                          }}>
                          <Home name="house-user" size={height * 0.02} />
                          <Text style={styles.dropDownListText}>
                            Add a Unit
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.selectAndCloseAddMultiple}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: width * 0.265,
                          }}>
                          <Home name="house-user" size={height * 0.02} />
                          <Text style={styles.dropDownListText}>
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
                  // contentContainerStyle={{ margin: 4, }}
                  // style={{borderLeftWidth: width * .02, borderColor: 'black',}}
                  // numColumns={1}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.dataBuild}
                  renderItem={this._renderTopList}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
              {/* Add Unit Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalUnitVisible}
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
                              : height * 0.6,
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
                                // label="Name*"
                                // placeholder="A"
                                value={this.state.buildingData.name}
                                dense={true}
                                // onFocus={this.changeLayoutMeter3}
                                // onBlur={this.changeLayoutMeter3}
                                showSoftInputOnFocus={false}
                                // onChangeText={(text) => {
                                //   this.setState({ newBuild: text });
                                // }}
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
                                                  <Pressable
                                                    onPress={() =>
                                                      this.showTypesOfMeter(
                                                        item,
                                                        meterIndex,
                                                      )
                                                    }
                                                    style={{
                                                      flexDirection: 'row',
                                                      justifyContent:
                                                        'flex-start',
                                                      alignItems: 'center',
                                                    }}
                                                    android_ripple={{
                                                      color: '#25AAE1ec',
                                                      borderless: true,
                                                      radius: height * 0.08,
                                                    }}>
                                                    <Text
                                                      style={{
                                                        fontSize:
                                                          height * 0.018,
                                                        color: '#25AAE1ec',
                                                      }}>
                                                      {item.meterTypeName
                                                        ? item.meterTypeName
                                                        : 'Select'}
                                                    </Text>
                                                  </Pressable>
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
                                                        onPress={() =>
                                                          this.onGetMeterTypeId(
                                                            item,
                                                            meterIndex,
                                                          )
                                                        }>
                                                        {item.manufacturer +
                                                          '-' +
                                                          item.model +
                                                          '(x' +
                                                          item.multiplier +
                                                          item.unit_of_measure +
                                                          ')'}
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
                                    <DotsLoader />
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
                                        paddingLeft: width * 0.02,
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
                            Meter Type Builder
                          </Text>
                          <Pressable
                            onPress={this.meterTypeClose}
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
                      <View style={{flex: 1}}>
                        {meterTypeInputs.map((item, index) => {
                          return (
                            <View>
                              {index < 2 ? (
                                <View>
                                  <View style={styles.desciptionContainer}>
                                    <Text style={styles.desciptionHeading}>
                                      {item.name}
                                    </Text>
                                  </View>
                                  <View style={styles.inputContainer}>
                                    <MenuT
                                      visible={index < 2 ? item.showList : null}
                                      style={{height: height * 0.2}}
                                      anchor={
                                        <View>
                                          <TextInput
                                            value={item.input}
                                            dense={true}
                                            onFocus={() =>
                                              this.showSuggestion(index)
                                            }
                                            showSoftInputOnFocus={
                                              index < 2 ? false : true
                                            }
                                            error={item.error}
                                            style={styles.input}
                                            mode={'outlined'}
                                            onChangeText={(text) =>
                                              this.onChangeTypeBuilder(
                                                text,
                                                index,
                                              )
                                            }
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
                                      }
                                      onRequestClose={() =>
                                        this.hideSuggestion(index)
                                      }>
                                      {/* {manufacturers.map((item) => (
                                        <MenuItem
                                          onPress={() =>
                                            this.hideSuggestion(
                                              index,
                                              item.name,
                                            )
                                          }>
                                          {item.name}
                                        </MenuItem>
                                      ))} */}
                                      <ScrollView>
                                        {(() => {
                                          switch (index) {
                                            case 0:
                                              return manufacturers.map(
                                                (item) => (
                                                  <MenuItem
                                                    onPress={() =>
                                                      this.hideSuggestion(
                                                        index,
                                                        item.name,
                                                      )
                                                    }>
                                                    {item.name}
                                                  </MenuItem>
                                                ),
                                              );
                                            case 1:
                                              return models.map((item) => (
                                                <MenuItem
                                                  onPress={() =>
                                                    this.hideSuggestion(
                                                      index,
                                                      item.name,
                                                    )
                                                  }>
                                                  {item.name}
                                                </MenuItem>
                                              ));

                                            default:
                                              return null;
                                          }
                                        })()}
                                      </ScrollView>
                                    </MenuT>
                                  </View>
                                </View>
                              ) : null}
                            </View>
                          );
                        })}
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
                                      <Text style={styles.desciptionHeading}>
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
                                                    width: !this.state.meter3
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
                                                  backgroundColor: '#F6F6F6',
                                                  justifyContent: 'center',
                                                  borderColor: item.error
                                                    ? 'red'
                                                    : 'gray',
                                                  width: width * 0.35,
                                                  height: height * 0.052,
                                                  borderWidth: width * 0.003,
                                                  borderRadius: width * 0.01,
                                                  paddingHorizontal:
                                                    width * 0.03,
                                                  marginTop: width * 0.01,
                                                }}
                                                onPress={() =>
                                                  this.showSuggestion(index)
                                                }>
                                                <Text
                                                  style={{
                                                    color: '#25AAE1ec',
                                                    textTransform: 'capitalize',
                                                  }}>
                                                  {index == 3
                                                    ? this.state
                                                        .measureOfUnitName
                                                    : null}
                                                </Text>
                                              </TouchableOpacity>
                                              {item.error ? (
                                                <HelperText
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
                            height: height * 0.1,
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
                        {/* <HelperText
                          type="error"
                          visible={this.state.errorUnits.units}>
                          {this.state.errorUnits.units}
                        </HelperText> */}
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
                  </View>
                </View>
                {/* </KeyboardAvoidingView> */}
              </Modal>
              {/* Edit Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalEditVisible}
                style={styles.modal1Container}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={[styles.modalInner]}>
                    <View
                      style={[styles.boxConatainer, {height: height * 0.82}]}>
                      <View style={[styles.boxInner]}>
                        {/* Box Header */}
                        <View style={styles.boxHeader}>
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
                        </View>
                        {/* Box Body */}
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
                              // label="Name*"
                              value={this.state.typedBuild}
                              dense={true}
                              editable={false}
                              onChangeText={(text) => {
                                this.setState({typedBuild: text});
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
                            <Text style={styles.desciptionHeading}>UNIT*</Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              // label="BILLING COMPANY*"
                              value={this.state.typedUnit}
                              dense={true}
                              onChangeText={(text) => {
                                this.setState({typedUnit: text});
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
                            style={{alignItems: 'center', overflow: 'hidden'}}>
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
                                        {color: '#9ACF72'},
                                      ]}>
                                      {this.state.pressedType}
                                    </Text>
                                  </View>
                                  <View style={styles.meterDesciptionContainer}>
                                    <Text style={styles.meterDesciptionHeading}>
                                      Transceiver
                                    </Text>
                                  </View>
                                  <View style={styles.meterInputContainer}>
                                    <TextInput
                                      value={this.state.typedCode}
                                      dense={true}
                                      onChangeText={(text) => {
                                        this.setState({typedCode: text});
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
                                  <View style={styles.meterDesciptionContainer}>
                                    <Text style={styles.meterDesciptionHeading}>
                                      Meter type
                                    </Text>
                                  </View>
                                  <View style={styles.meterInputContainer}>
                                    <TextInput
                                      value={this.state.typedMType}
                                      dense={true}
                                      onChangeText={(text) => {
                                        this.setState({typedMType: text});
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
                                  <View style={styles.meterDesciptionContainer}>
                                    <Text style={styles.meterDesciptionHeading}>
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
                        {/* </ScrollView> */}
                        {/* Box Footer */}
                        <View style={styles.footerBtn}>
                          <View style={styles.bottonContainer}>
                            <TouchableOpacity onPress={this.toggleModalEdit}>
                              <View style={styles.cancelBotton}>
                                <Plus name="close" color="black" size={18} />
                                <Text style={{color: 'black'}}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.editOnPress}>
                              <View style={styles.saveUnitBotton}>
                                <Plus name="plus" color="white" size={18} />
                                <Text style={{color: 'white'}}>Save Unit</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
              {/* Add Utility */}
              <Modal
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
              </Modal>
              {/* Add Mutiple Unit Modal */}
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
                        {/* Add Mutiple Unit Modal Header */}
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
                        <View style={{flex: 1}}>
                          <View style={styles.desciptionContainer}>
                            <Build
                              name={'office-building'}
                              size={height * 0.02}
                              color="#5e5e5e"
                            />
                            <Text style={styles.desciptionHeading}>Name*</Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              // label="Name*"
                              placeholder="A"
                              // dense={true}
                              onChangeText={(text) => console.log(text)}
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
                              // label="BILLING COMPANY*"
                              placeholder="Unit Description"
                              // dense={true}
                              onChangeText={(text) => {
                                this.setState({newUnit: text});
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
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              borderBottomWidth: width * 0.001,
                            }}>
                            <TextInput
                              // label="BILLING COMPANY*"
                              placeholder="Unit Name"
                              // dense={true}
                              onChangeText={(text) => console.log(text)}
                              style={{
                                height: height * 0.07,
                                width: width * 0.47,
                                fontSize: height * 0.018,
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
                            <Text>Auto Increment</Text>
                          </View>
                          <FlatList
                            data={this.state.dataActivity}
                            renderItem={this._renderUnitList}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        </View>
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
                              onPress={() =>
                                this.setState({
                                  isModalMunitVisible: !this.state
                                    .isModalMunitVisible,
                                })
                              }>
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
              {/* Add Building Modal */}
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                hasBackdrop={true}
                backdropColor="black"
                isVisible={this.state.isModalBuildVisible}
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
                              label={'Name*'}
                              left={
                                <Build
                                  name={'office-building'}
                                  size={height * 0.02}
                                  color="#5e5e5e"
                                />
                              }
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
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              borderBottomWidth: width * 0.001,
                            }}>
                            <TextInput
                              // label="BILLING COMPANY*"
                              error={this.state.error.units}
                              placeholder="# of Units"
                              // dense={true}
                              onChangeText={(text) => {
                                this.getLoopOfUnits(text);
                              }}
                              style={{
                                // height: height * .07,
                                width: width * 0.4,
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
                            <Text>Auto Increment</Text>
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
                      captureAudio={false}
                      // onGoogleVisionBarcodesDetected={this.onSuccess}
                      // androidCameraPermissionOptions={{
                      //   title: "Open Camera",
                      //   message: "Open Open",
                      //   buttonPositive: 'OK',
                      //   buttonNegative: "Not Ok",
                      // }}
                    >
                      <BarcodeMask outerMaskOpacity={0} />
                      {/* <View style={{ height: height * .3, width: width * .6, borderWidth: width * .006, borderColor: 'yellow' }} /> */}
                    </RNCamera>
                  </View>
                )}
                {/* {scanResult &&
                    <Fragment>
                      <Text style={{ color: 'white', textAlign: "center", fontSize: width * .08 }} >Result.!</Text>
                      <View style={{ height: height * .4, backgroundColor: 'white', justifyContent: 'center', alignItems: "center", }}>
                        <Text>Type:{result.type}</Text>
                        <Text>Result:{result.data}</Text>
                        <Text numberOfLines={1}>Raw Data:{result.rawData}</Text>
                      </View>
                    </Fragment>
                  } */}
                {/* <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: height * .02 }}> */}
                {/* {scanResult &&
                      <View>
                        <TouchableOpacity onPress={this.scanAgain}>
                          <View style={{ backgroundColor: '#25AAE1', borderRadius: width * .008, height: height * .05, width: width * .4, justifyContent: 'center' }}>
                            <Text style={{ textAlign: "center", color: 'white', fontWeight: 'bold' }} >Scan Again</Text>
                          </View>
                        </TouchableOpacity>
                        <Text style={{ textAlign: "center", color: "white" }}>OR</Text>
                      </View>
                    } */}
                {/* <TouchableOpacity onPress={this.scannerModal}>
                    <View style={{ backgroundColor: 'white', borderRadius: width * .008, height: height * .05, justifyContent: 'center', width: width * .4 }}>
                      <Text style={{ textAlign: "center", color: '#25AAE1', fontWeight: 'bold' }} >Switch Off Scanner</Text>
                    </View>
                  </TouchableOpacity>
                </View> */}
                {/* </View> */}
              </Modal>
            </View>
            {/* Unit List */}
            {/* <ActivityIndicator size='large' color='black' style={{ height: this.state.loader ?  height * .5 : height * .0, overflow: 'hidden' }} />
            <FlatList
              ref={(ref) => {
                listViewRef = ref;
              }}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: height * .42, height: this.state.loader ? height * 0 : height * 1 }}
              contentContainerStyle={{ backgroundColor: '#F5F5F5', }}
              numColumns={1}
              initialNumToRender={realData.length}
              data={realData}
              renderItem={this._renderMyList}
              // renderItem={(item, index) => console.log(item.index)}
              keyExtractor={item => item.id.toString()}
            /> */}
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
                style={{marginBottom: height * 0.42}}
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
      </View>
    );
  }
}