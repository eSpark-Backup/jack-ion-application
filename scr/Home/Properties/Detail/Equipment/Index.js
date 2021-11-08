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
import Build from 'react-native-vector-icons/FontAwesome5';
import Ionic from 'react-native-vector-icons/Ionicons';
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
import Equipment from 'react-native-vector-icons/FontAwesome';
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
import {Header, Button, Icon as Iconx} from 'react-native-elements';
import AddBuilding from '../../../../components/modal/AddBuilding/index';
import Drawer from '../../../../components/modal/Drawer/index';

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
import EditUnit from './Units/modals/UnitEdit';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
// import {SafeAreaView} from 'react-navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import clc from 'cli-color';
import Index from '../../../Index';
const {width, height} = Dimensions.get('window');
let listViewRef;
let buildListViewRef;

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      changed: false,
      meterId: 0,
      loader: true,
      getUtilities: [],
      searchList: [],
      isModalVisible: false,
      isModalUnitVisible: false,
      newUnit: 'Unit-1',
      loaderBuildings: true,
      buildingData: [],
      lastUnitData: '',
      unitData: {unit: ''},
      editModal: false,
      buildingModalType: '',
      editBuilding: '',
      editBuildDes: '',
      showSearch: false,
      showFilter: false,
      filterWork: false,
      dataBuild: [],
      realData: [],
      fileMenuVisible: false,
      FileArray: [{name: 'Upload File'}, {name: 'Download File'}],
      error: {
        buildingName: false,
        units: false,
        editBuilding: '',
      },
      editBuildId: 0,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
    this.getToken();
  }

  onFocusFunction = () => {
    this.setState({loader: true, loaderBuildings: true});
    this.getToken();
    this.setState({isModalVisible: false});
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
  get_filterVal = async (serial, meterId) => {
    // console.log('Devce serial', serial, meterId);
    this.setState({showFilter: false});
    this.filerUnits(serial, meterId);
  };

  checkData = async () => {
    this.setState({filterWork: false, loader: true, loaderBuildings: true});
    const response = await this.api.post(
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
        // console.log('Building Id', response?.data?.data[0].id);
        const data = {
          building_id: response?.data?.data[0].id,
        };
        const unitResponse = await this.api.post(
          `/property/equipment/unit/all-units`,
          data,
        );

        if (unitResponse?.ok == true) {
          this.setState({realData: unitResponse?.data?.data, loader: false});
          let arry = unitResponse?.data?.data;
          let lastElement = arry[arry.length - 1];

          console.log('lastElement--->', lastElement);
          this.setState({
            lastUnitData:
              lastElement?.name == undefined ? 'Unit-0' : lastElement?.name,
            newUnit:
              lastElement?.name == undefined ? 'Unit-0' : lastElement?.name,
          });
          this.setState((prevState) => ({
            ...prevState,
            unitData: {
              // object that we want to update
              ...prevState.unitData, // keep all other key-value pairs
              unit: {name: lastElement?.name}, // update the value of specific key
            },
          }));
          console.log('buildingId--->', this.state.editBuildId);
        } else {
          alert('Network Issue');
          this.setState({loader: false});
        }
      } else {
        console.log('False chala', response?.data?.data?.length);
        // if (response?.data?.data?.length == 0) {
        this.setState({
          realData: [],
          lastUnitData: 'Unit-0',
          newUnit: 'Unit-0',
        });
        // }
        this.setState({loader: false});
      }
    } else {
      alert('Network Issue');
      this.setState({loaderBuildings: false});
    }
  };

  filerUnits = async (serial, id) => {
    console.log('Get filert', serial);
    let data = {
      building_id: this.state.editBuildId,
      device_serial_number: serial,
      meter_id: id,
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
    console.log('Get filert', e);
    let data = {
      building_id: this.state.editBuildId,
      search: e,
    };

    if (e) {
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

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  toggleModalUnit = () => {
    this.setState({isModalUnitVisible: !this.state.isModalUnitVisible});
  };
  toggleModalBuild = () => {
    this.setState({isModalBuildVisible: !this.state.isModalBuildVisible});
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

  selectAndCloseAdd = async () => {
    this.toggleModalUnit();
    this.changeLayoutMeter2();
    // this.setState({ gotData: false });
  };
  selectAndCloseAddMultiple = () => {
    this.toggleModalBuild();
    this.setState({buildingModalType: 'Multyple'});
  };
  selectAndCloseAddBuild = () => {
    this.toggleModalBuild();
    this.setState({buildingModalType: ''});
  };
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter: !this.state.meter, meter2: false});
  };
  changeLayoutMeter2 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter2: !this.state.meter2, meter: false});
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
              justifyContent: 'center',
              width: width * 0.3,
              overflow: 'hidden',
              marginLeft: width * 0.01,
            }}>
            <TextTicker
              duration={6000}
              marqueeDelay={2000}
              repeatSpacer={width * 0.3}
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
        </View>
      </View>
    </TouchableOpacity>
  );

  buildingEditOpen = (item) => {
    this.setState({
      editModal: true,
      editBuilding: item.name,
      editBuildDes: item.descriptions,
      editBuildId: item.id,
    });
  };

  actionOnPress = (unit) => {
    this.props.navigation.navigate('U_Details', {
      unitId: unit.item.id,
      buildingName: this.state.buildingData.name,
      buildingId: this.state.editBuildId,
    });
    this.setState({showSearch: false, loader: true, loaderBuildings: true});
  };
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
  _renderUnitList = (unit) => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.actionOnPress(unit)}>
          <View style={[styles.infoViewContainer]}>
            <View style={styles.infoViewInner}>
              <View style={styles.unitNameContainer}>
                <Home
                  name="house-user"
                  size={width * 0.07}
                  color="#3E4A4F"
                  style={{marginRight: width * 0.01}}
                />
                <TextTicker
                  duration={6000}
                  marqueeDelay={2000}
                  repeatSpacer={width * 0.7}
                  style={styles.dataFieldText}
                  key={unit}>
                  {unit.item.name}
                </TextTicker>
              </View>
              <View style={styles.unitDetailContainer}>
                {unit?.item?.unit_meter?.length ? (
                  unit?.item?.unit_meter?.map((item, index) => (
                    <>
                      <View style={styles.unitDetailInnerif}>
                        <Image
                          source={this.typeSwitcher(item.meter_name)}
                          style={styles.untiDetailImage}
                        />
                        <TextTicker
                          duration={10000}
                          marqueeDelay={2000}
                          repeatSpacer={width * 0.17}
                          style={[
                            styles.dataFieldText,
                            {width: width * 0.17, fontSize: width * 0.02},
                          ]}>
                          {item?.device_serial_number}
                        </TextTicker>
                        <Barcode
                          name="barcode"
                          size={width * 0.03}
                          style={{marginHorizontal: width * 0.005}}
                        />
                      </View>
                      <View
                        style={[
                          styles.unitDetailSeprater,
                          {
                            borderBottomWidth:
                              index == 0 && unit?.item?.unit_meter?.length > 1
                                ? width * 0.004
                                : 0,
                          },
                        ]}
                      />
                    </>
                  ))
                ) : (
                  <View style={styles.unitDetailInnerElse}>
                    <Text style={styles.unitDetailInnerElseText}>
                      No meters
                    </Text>
                    <Barcode
                      name="barcode-off"
                      size={width * 0.03}
                      style={styles.unitDetailInnerElseIcon}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderBuildingList = (build) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.showArrayItem(build);
          buildListViewRef.scrollToIndex({index: build.index});
        }}
        style={[styles.infoTopViewContainer]}>
        <View style={[styles.infoTopViewInner]}>
          <Build name="building" size={width * 0.04} color="#3E4A4F" />
          <TextTicker
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.16}
            style={[styles.dataFieldText, {width: width * 0.165}]}>
            {build.item.name}
          </TextTicker>
          {build.item.id == this.state.buildingData.id && (
            <View style={styles.buildingSelectIcon}>
              <Check
                name="check"
                style={{marginLeft: width * 0.005}}
                size={width * 0.02}
                color="#fff"
              />
            </View>
          )}
        </View>
        <Text style={styles.buildingUnitName}>
          {build.item.unit_count} Units
        </Text>
        <TouchableOpacity
          onPress={() => this.buildingEditOpen(build.item)}
          style={styles.buildingEditBtn}>
          <Text
            style={{
              color: 'white',
              fontFamily: Fonts.Montserrat,
              fontSize: width * 0.03,
            }}>
            Edit
          </Text>
          <Edit name="edit" color="white" size={width * 0.04} />
        </TouchableOpacity>
      </TouchableOpacity>
      // </KeyboardAvoidingVie>
    );
  };

  clearUpdateBuild = () => {
    this.setState({
      editModal: false,
    });
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        editBuilding: '', // update the value of specific key
      },
    }));
  };
  showArrayItem = async (build) => {
    this.setState({
      loader: true,
      buildingData: build.item,
      editBuildDes: build.item.descriptions,
      editBuildId: build.item.id,
      changed: true,
      filterWork: false,
    });
    const data = {
      building_id: build.item.id,
    };
    const unitResponse = await this.api.post(
      `/property/equipment/unit/all-units`,
      data,
    );
    if (unitResponse?.ok == true) {
      this.setState({realData: unitResponse?.data?.data, loader: false});
      let arry = unitResponse?.data?.data;
      let lastElement = arry[arry.length - 1];
      this.setState({
        lastUnitData:
          lastElement?.name == undefined
            ? this.state.newUnit
            : lastElement?.name,
        newUnit:
          lastElement?.name == undefined
            ? this.state.newUnit
            : lastElement?.name,
      });
      this.setState((prevState) => ({
        ...prevState,
        unitData: {
          // object that we want to update
          ...prevState.unitData, // keep all other key-value pairs
          unit: {name: lastElement?.name}, // update the value of specific key
        },
      }));
    } else {
      alert('Network Issue');
      this.setState({loader: false});
    }
  };

  changedFalse = () => {
    this.setState({changed: false});
  };

  naviagateToEquip = () => {
    this.setState({isModalVisible: false});
  };

  openAndClear = () => {
    this.setState({showSearch: true});
    this.setState({searchList: []});
  };

  openFilter = async () => {
    this.context.getBillingCompany();
    this.setState({showFilter: true});
    const unitResponse = await this.api.get(
      `/property/equipment/meter/all-meters`,
    );
    console.log('Check meter add--->', unitResponse?.data?.data);
    this.setState({getUtilities: unitResponse?.data?.data});
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
    if (this.state.editBuilding === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          editBuilding: 'Invalid Building Name', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          editBuilding: '', // update the value of specific key
        },
      }));
      Alert.alert('Update Building', 'Are you sure you want to Update?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.updateBuilding()},
      ]);
    }
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

  _customSort(data, order) {
    function isNumber(v) {
      return (+v).toString() === v;
    }
    var sort = {
        asc: function (a, b) {
          var i = 0,
            l = Math.min(a.value.length, b.value.length);

          while (i < l && a.value[i] === b.value[i]) {
            i++;
          }
          if (i === l) {
            return a.value.length - b.value.length;
          }
          if (isNumber(a.value[i]) && isNumber(b.value[i])) {
            return a.value[i] - b.value[i];
          }
          return a.value[i].localeCompare(b.value[i]);
        },
        desc: function (a, b) {
          return sort.asc(b, a);
        },
      },
      mapped = data.map(function ({name}, i) {
        var string = name.replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .'),
          string = name.replace(/\s/g, ''),
          regex = /(\d+)|([^0-9.]+)/g,
          m,
          parts = [];
        while ((m = regex.exec(string)) !== null) {
          parts.push(m[0]);
        }
        return {index: i, value: parts, o: name, string: string};
      });
    mapped.sort(sort[order] || sort.asc);
    return mapped.map(function (el) {
      return data[el.index];
    });
  }
  handleAddBuilding = () => {
    this.setState({isModalBuildVisible: false});
    this.checkData();
  };
  handleUpdateBuilding = (cond, data) => {
    this.setState({editModal: false});
    this.context.updateBuilding(cond, this.state.editBuildId, data);
    this.checkData();
  };
  render() {
    const {result, scan, scanResult} = this.state;
    const realData = this.state.realData;
    const realColor = this.state.hColor;
    const {loader, loaderBuildings, meterTypeInputs} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden backgroundColor="white" barStyle="dark-content" />

        {/* Building Edit Modal */}
        <UpdateModal
          isVisible={this.state.editModal}
          title="Edit Building"
          doneBtnTitle="Update Building"
          style={{height: height * 0.55}}
          // onCancel={this.clearUpdateBuild}
          // onDone={this.editAlert}
          // onDelete={this.deleteAlert}
          reRun={this.handleUpdateBuilding}
          buildingData={{
            buildingId: this.state.editBuildId,
            buildingName: this.state.editBuilding,
            buildingDes: this.state.editBuildDes,
          }}>
          {/* <ScrollView showsVerticalScrollIndicator={false}>
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
                  error={this.state.error.editBuilding}
                  onChangeText={(text) => {
                    this.setState({editBuilding: text});
                    this.setState((prevState) => ({
                      error: {
                        // object that we want to update
                        ...prevState.error, // keep all other key-value pairs
                        editBuilding: '',
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
              {this.state.error.editBuilding ? (
                <HelperText
                  type="error"
                  visible={this.state.error.editBuilding}>
                  {this.state.error.editBuilding}
                </HelperText>
              ) : null}
              <View style={styles.desciptionContainer}>
                <Text style={styles.desciptionHeading}>
                  Building Despcription*
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
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
          </ScrollView> */}
        </UpdateModal>
        {/* Drawer Modal */}
        <Drawer
          isVisible={this.state.isModalVisible}
          onCancel={this.toggleModal}
          naviagateToDetail={this.naviagateToDetail}
          naviagateToEquip={this.naviagateToEquip}
          naviagateToChart={this.naviagateToChart}
          naviagateToSupport={this.naviagateToSupport}
        />
        {/* <Modal
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
        </Modal> */}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: width * 0.1,
                    width: width * 0.6,
                  }}
                  onPress={
                    this.state.dataBuild == 0
                      ? () =>
                          Alert.alert('Alert', 'No building found add building')
                      : this.openAndClear
                  }>
                  <Search name="search" size={height * 0.04} color="white" />
                  <Text style={{color: 'white'}}>Search</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={
                  this.state.dataBuild == 0
                    ? () =>
                        Alert.alert('Alert', 'No building found add building')
                    : this.openFilter
                }
                style={styles.filterButton}>
                <FilterIcon
                  name="filter-outline"
                  color={this.state.filterWork ? '#25AAE1ec' : 'black'}
                  size={width * 0.05}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Menu
              name="menu"
              size={width * 0.08}
              color="white"
              style={{position: 'absolute', left: width * 0.02}}
              onPress={this.toggleModal}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionic
                name="md-business-outline"
                size={width * 0.06}
                color="white"
              />
              <Text style={styles.mainHeadiing}>Equiments</Text>
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
                  justifyContent: 'center',
                  borderRightWidth: width * 0.001,
                }}>
                <MenuT
                  visible={this.state.fileMenuVisible}
                  anchor={
                    <TouchableOpacity
                      style={styles.dropDown}
                      onPress={() => this.setState({fileMenuVisible: true})}>
                      <Message
                        name="file"
                        size={height * 0.025}
                        color="#3E4A4F"
                      />
                      <Text style={styles.dropDownText}>File</Text>
                      <Message
                        name="chevron-down"
                        size={height * 0.02}
                        color="#3E4A4F"
                        style={{marginLeft: width * 0.02}}
                      />
                    </TouchableOpacity>
                  }>
                  {this.state.FileArray.map((item) => (
                    <View>
                      <MenuItem
                        style={styles.dropDownListText}
                        onPress={() => this.setState({fileMenuVisible: false})}>
                        {item.name}
                      </MenuItem>
                    </View>
                  ))}
                </MenuT>
                {/* <View style={{ width: width * 0.35 }}>
                  <TouchableOpacity
                    style={styles.dropDown}
                    onPress={this.changeLayoutMeter}>
                    <Message name="file" size={height * 0.025} color="#3E4A4F" />
                    <Text style={styles.dropDownText}>File</Text>
                    <Message
                      name="chevron-down"
                      size={height * 0.02}
                      color="#3E4A4F"
                      style={{ marginLeft: width * 0.02 }}
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
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.dropDownListText}>
                            Upload File
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => Alert.alert('Download File Pressed')}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.dropDownListText}>
                            Download File
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}
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
                      color="#3E4A4F"
                    />
                    <Text style={styles.dropDownText}>Add</Text>
                    <Message
                      name="chevron-down"
                      size={height * 0.02}
                      color="#3E4A4F"
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
                            color="#3E4A4F"
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
                            color="#3E4A4F"
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
                        <Build
                          name="building"
                          size={width * 0.04}
                          color="#3E4A4F"
                        />
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
                      fontFamily: Fonts.Montserrat,
                      color: '#3E4A4F',
                    }}>
                    No data add Building
                  </Text>
                </View>
              ) : (
                <FlatList
                  ref={(ref) => {
                    buildListViewRef = ref;
                  }}
                  style={{height: width * 0.22}}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.dataBuild}
                  renderItem={this._renderBuildingList}
                  keyExtractor={(item) => item.id.toString()}
                />
              )}
            </View>
            <EditUnit
              modalVisible={this.state.isModalUnitVisible}
              closeModal={() => this.setState({isModalUnitVisible: false})}
              reRun={() => this.checkData()}
              meterTypes={[]}
              modalName="Add Unit"
              type={'add'}
              buildingName={this.state.buildingData.name}
              buildingId={this.state.editBuildId}
              unitDetails={this.state.unitData}
              doneBtnTitle="Add Unit"
              doneIcon={
                <Iconx name="plus" type="feather" size={18} color="#fff" />
              }
              handleEditUnit={() => {
                this.setState({isModalUnitVisible: false});
              }}
              unitsArray={this.state.realData}
            />
            <AddBuilding
              modalVisible={this.state.isModalBuildVisible}
              type={this.state.buildingModalType}
              modalName="New Building"
              closeModal={() => this.setState({isModalBuildVisible: false})}
              reRun={this.handleAddBuilding}
              propertyId={this.props.navigation.state.params.item.item.id}
              lastUnitName={this.state.newUnit}
              buildData={{
                buildingName: this.state.buildingData.name,
                buildDes: this.state.editBuildDes,
                buildId: this.state.editBuildId,
              }}
            />
            <Filter
              type="Units"
              onReset={this.get_filterVal}
              utilityTypes={this.state.getUtilities}
              get_filterVal={this.get_filterVal}
              changeChanged={this.changedFalse}
              isVisible={this.state.showFilter}
              close={() => this.setState({showFilter: !this.state.showFilter})}
              buildingName={this.state.buildingData.name}
              buildiingId={this.state.editBuildId}
              changed={this.state.changed}
              filterWork={(e) =>
                this.setState(
                  {filterWork: e},
                  console.log(e, 'filterWork:false'),
                )
              }
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
                        autoFocus={true}
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
            ) : this.state.realData.length == 0 ? (
              <View style={{width: width * 0.55, justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: 'center',
                    fontFamily: Fonts.Montserrat,
                    color: '#3E4A4F',
                  }}>
                  No data add Unit
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
                data={this._customSort(realData)}
                renderItem={this._renderUnitList}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
