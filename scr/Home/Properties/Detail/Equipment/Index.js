import React, {Component, Fragment, version} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  UIManager,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  LogBox,
} from 'react-native';
//Packages
import Menu from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {TextInput, FAB, HelperText, Divider} from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import UpdateModal from '../../../../components/modal/UpdateModal';
import {Icon as Iconx} from 'react-native-elements';
import AddBuilding from '../../../../components/modal/AddBuilding/index';
import Drawer from '../../../../components/modal/Drawer/index';

// Components
import {Fonts} from '../../../../utils/fonts';
import styles from './style';
import ContextProp from '../../Context/propContext';
import Filter from '../../Filter';
import {ActivityIndicator} from 'react-native';
import EditUnit from './Units/modals/UnitEdit';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
import CustumStatusBar from '../../../../components/StatusBar';
import API from '../../../../api/SeviceApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const {width, height} = Dimensions.get('window');
let buildListViewRef;

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      changed: false,
      unitMixesId: '',
      unitCount: null,
      unitActualCount: null,
      flag: true,
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
      addMenuVisible: false,
      currUnitIndex: null,
      userRole: null,
      FileArray: [{name: 'Upload File'}, {name: 'Download File'}],
      AddArray: [
        {name: 'Add a Unit', func: this.selectAndCloseAdd},
        {name: 'Add Multiple', func: this.selectAndCloseAddMultiple},
        {name: 'Add a Building', func: this.selectAndCloseAddBuild},
      ],
      error: {
        buildingName: false,
        units: false,
        editBuilding: '',
      },
      editBuildId: 0,
      unitMeters: [],
      unitDatax: [],
      isEditUnitModalVisible: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  onFocusFunction = () => {
    // this.setState({ loader: true, loaderBuildings: true });
    this.getToken();
    this.setState({isModalVisible: false});
  };

  getToken = async () => {
    this.checkData();
  };
  get_filterVal = async (serial, meterId) => {
    // console.log('Devce serial', serial, meterId);
    this.setState({showFilter: false});
    this.filerUnits(serial, meterId);
  };

  checkData = async () => {
    this.setState({filterWork: false, loader: true, loaderBuildings: true});
    const PropertyID = this.props.navigation.state.params.item.item.id;
    const PropRes = await API.get(`/property/${PropertyID}`);
    this.setState({
      unitCount: PropRes?.data?.data?.property?.unit_count,
      unitActualCount: PropRes?.data?.data?.property.unit_actual_count,
    });
    console.log('PROPID', PropertyID);
    console.log('PROPRES', PropRes?.data?.data?.property);

    const response = await API.post(
      `/property/equipment/building/all-buildings/${PropertyID}`,
    );
    // console.log('Check response buildings--->', response);
    const role = await AsyncStorage.getItem('user_role');
    console.log('ROLE', role);
    this.setState({userRole: role});

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
        const unitResponse = await API.post(
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

      const unitResponse = await API.post(
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
      const unitResponse = await API.post(
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
      const unitResponse = await API.post(
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
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        this.toggleModalUnit();
      }, 450);
      this.setState({addMenuVisible: false});
    }
    if (Platform.OS == 'android') {
      this.toggleModalUnit();
      this.setState({addMenuVisible: false});
    }
    // this.changeLayoutMeter2();
    // this.setState({ gotData: false });
  };
  selectAndCloseAddMultiple = () => {
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        this.toggleModalBuild();
      }, 450);
      this.setState({addMenuVisible: false});
      this.setState({buildingModalType: 'Multiple'});
    }
    if (Platform.OS == 'android') {
      this.toggleModalBuild();
      this.setState({addMenuVisible: false});
      this.setState({buildingModalType: 'Multiple'});
    }
  };
  selectAndCloseAddBuild = () => {
    if (Platform.OS == 'ios') {
      setTimeout(() => {
        this.toggleModalBuild();
      }, 450);
      this.setState({addMenuVisible: false});
      this.setState({buildingModalType: ''});
    }
    if (Platform.OS == 'android') {
      this.toggleModalBuild();
      this.setState({addMenuVisible: false});
      this.setState({buildingModalType: ''});
    }
  };
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter: !this.state.meter, meter2: false});
  };
  changeLayoutMeter2 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({meter2: !this.state.meter2, meter: false});
  };

  buildingEditOpen = (item) => {
    this.setState({
      editModal: true,
      editBuilding: item.name,
      editBuildDes: item.descriptions,
      editBuildId: item.id,
    });
  };

  actionOnPress = (unit) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      currUnitIndex:
        unit.index === this.state.currUnitIndex ? null : unit.index,
    });
  };

  goToDetails = (unit) => {
    this.props.navigation.navigate('U_Details', {
      unitId: unit.item.id,
      buildingName: this.state.buildingData.name,
      buildingId: this.state.editBuildId,
      propertyId: this.props.navigation.state.params.item.item.id,
      propertyLat: this.props.navigation.state.params.item.item.latitude,
      propertyLong: this.props.navigation.state.params.item.item.longitude,
    });
    console.log(
      'Sub me Kch na Kch Mila Ya Nhi',
      this.state.buildingData.name,
      this.state.editBuildId,
      this.props.navigation.state.params.item.item.id,
      this.props.navigation.state.params.item.item.latitude,
      this.props.navigation.state.params.item.item.longitude,
    );
    this.setState({
      currUnitIndex: null,
      showSearch: false,
      loader: true,
      loaderBuildings: true,
    });
  };

  deleteUnit = async (id) => {
    console.log('ID', id);
    this.setState({loader: true});
    const response = await API.post(`/property/equipment/unit/${id}`);
    if (response?.data?.bool) {
      this.setState({currUnitIndex: null});
      alert(response?.data?.message);
      this.checkData();
    } else {
      this.setState({loader: false});
    }
  };

  confirmDelete = (id) => {
    Alert.alert('Delete Meter', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => this.deleteUnit(id)},
    ]);
  };

  typeSwitcher = (arg) => {
    switch (arg.toLowerCase()) {
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

  //! Work in Progress (UX)

  _openEditUnit = async (unitId) => {
    console.log('Unit ID', unitId);
    const res = await API.get(`/property/equipment/unit/${unitId}`);
    console.log('UNIT KI DETAILS>>>>>>>', res.data?.data?.unit);

    this.setState({unitMixesId: res.data?.data?.unit?.unit_mix_id});
    this.setState({
      currUnitIndex: null,
      unitMeters: res.data?.data?.unit?.unit_meter,
      unitDatax: res.data,
    });
    this.toggleModalEditUnit();
  };

  toggleModalEditUnit = () => {
    this.setState({isEditUnitModalVisible: !this.state.isEditUnitModalVisible});
  };

  _renderUnitList = (unit) => {
    // console.log('>><<<<<<<<<', unit);
    return (
      <View
        style={{
          alignItems: 'center',
          marginVertical: height * 0.01,
          width: width * 0.9,
        }}>
        <TouchableOpacity onPress={() => this.actionOnPress(unit)}>
          <View
            style={[
              styles.infoViewContainer,
              {
                borderBottomLeftRadius:
                  unit.index === this.state.currUnitIndex ? 0 : width * 0.01,
                borderBottomRightRadius:
                  unit.index === this.state.currUnitIndex ? 0 : width * 0.01,
                borderBottomWidth:
                  unit.index === this.state.currUnitIndex &&
                  unit?.item?.unit_meter?.length < 1
                    ? 0
                    : 1,
              },
            ]}>
            <View style={styles.infoViewInner}>
              <View style={styles.unitNameContainer}>
                <FontAwesome5
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
                  <View style={{flexDirection: 'row', maxWidth: width * 0.5}}>
                    <View style={styles.unitDetailInnerif}>
                      <Image
                        source={require('../../../../../Images/remote-reader.png')}
                        style={styles.untiDetailImage}
                      />
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        // repeatSpacer={width * 0.17}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.25,
                            fontSize: width * 0.025,
                          },
                        ]}>
                        {`${unit?.item?.unit_meter?.length}${
                          unit?.item?.unit_meter?.length > 1
                            ? ' Devices'
                            : ' Device'
                        }`}
                      </TextTicker>
                    </View>
                  </View>
                ) : (
                  <View style={styles.unitDetailInnerElse}>
                    <MaterialCommunityIcons
                      name="barcode-off"
                      size={width * 0.04}
                      style={styles.unitDetailInnerElseIcon}
                    />
                    <Text style={styles.unitDetailInnerElseText}>
                      Program a Device
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {unit.index === this.state.currUnitIndex && (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {unit?.item?.unit_meter?.length > 0 && (
              <View
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                }}>
                {unit?.item?.unit_meter?.map((item, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      maxWidth: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: width * 0.02,
                    }}>
                    <View style={styles.unitDetailInnerif}>
                      {/* <MaterialCommunityIcons
                          name="barcode-scan"
                          size={width * 0.03}
                          style={{marginRight: width * 0.01}}
                        /> */}
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        // repeatSpacer={width * 0.17}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.2,
                            fontSize: width * 0.025,
                          },
                        ]}>
                        {item?.meter_read?.meter_reading
                          ? item?.meter_read?.meter_reading + ' Gallons'
                          : 0 + ' Gallons'}
                      </TextTicker>
                    </View>
                    <View style={styles.unitDetailInnerif}>
                      <MaterialCommunityIcons
                        name="barcode-scan"
                        size={width * 0.03}
                        style={{marginRight: width * 0.01}}
                      />
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        // repeatSpacer={width * 0.17}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.2,
                            fontSize: width * 0.025,
                          },
                        ]}>
                        {item?.device_serial_number}
                      </TextTicker>
                    </View>

                    <View style={styles.unitDetailInnerif}>
                      {/* <Image
                          source={this.typeSwitcher(item.meter_name)}
                          style={styles.untiDetailImage}
                        /> */}
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        // repeatSpacer={width * 0.17}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.2,
                            fontSize: width * 0.025,
                          },
                        ]}>
                        {item?.time_diff}
                      </TextTicker>
                    </View>
                    <View
                      style={[
                        styles.unitDetailInnerif,
                        {width: width * 0.1, justifyContent: 'center'},
                      ]}>
                      <MaterialIcons
                        name={item.installation_status == 1 ? 'check' : 'close'}
                        color={
                          item.installation_status == 1 ? '#0fc908' : '#f00'
                        }
                        size={width * 0.05}
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
                  </View>
                ))}
              </View>
            )}
            <View
              style={[
                styles.buildingEditBtn,
                {justifyContent: 'space-between', borderWidth: 1},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    margin: width * 0.01,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => this.goToDetails(unit)}>
                  <MaterialCommunityIcons
                    name="view-compact-outline"
                    color="white"
                    size={width * 0.04}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: Fonts.Montserrat,
                      fontSize: width * 0.03,
                    }}>
                    View
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this._openEditUnit(unit?.item?.id)}
                  style={{
                    margin: width * 0.01,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="edit"
                    color="white"
                    size={width * 0.04}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: Fonts.Montserrat,
                      fontSize: width * 0.03,
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => this.confirmDelete(unit?.item?.id)}
                style={{
                  margin: width * 0.01,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  color="white"
                  size={width * 0.04}
                />
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.Montserrat,
                    fontSize: width * 0.03,
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
          <FontAwesome5 name="building" size={width * 0.04} color="#3E4A4F" />
          <TextTicker
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.16}
            style={[styles.dataFieldText, {width: width * 0.165}]}>
            {build.item.name}
          </TextTicker>
          {build.item.id == this.state.buildingData.id && (
            <View style={styles.buildingSelectIcon}>
              <Feather
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
          <MaterialIcons name="edit" color="white" size={width * 0.04} />
        </TouchableOpacity>
      </TouchableOpacity>
      // </KeyboardAvoidingVie>
    );
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
    const unitResponse = await API.post(
      `/property/equipment/unit/all-units`,
      data,
    );
    console.log('UNIT RESPONSE', unitResponse?.data);
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
    const unitResponse = await API.get(`/property/equipment/meter/all-meters`);
    // console.log('Check meter add--->', unitResponse?.data?.data);
    this.setState({getUtilities: unitResponse?.data?.data});
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
    if (cond != null) {
      this.updateBuilding(cond, this.state.editBuildId, data);
      this.setState({editModal: false});
    } else {
      this.setState({editModal: false});
    }
  };

  updateBuilding = async (edit, id, params) => {
    console.log('updateBuilding');

    if (edit) {
      const response = await API.post(
        `/property/equipment/building/update-building/${id}`,
        params,
      );
      console.log('Check Update', response?.data);

      if (response?.data?.bool) {
        this.onFocusFunction();
        alert(response?.data?.message);
      }
    } else {
      const response = await API.post(`/property/equipment/building/${id}`);
      console.log('Check response', response?.data);

      if (response?.data?.bool) {
        this.onFocusFunction();
        alert(response?.data?.message);
      }
    }
  };
  render() {
    const {result, scan, scanResult} = this.state;
    const realData = this.state.realData;
    const realColor = this.state.hColor;
    const {loader, loaderBuildings, meterTypeInputs} = this.state;

    return (
      <>
        <View style={styles.container}>
          {/* <StatusBar hidden backgroundColor="white" barStyle="dark-content" /> */}
          <CustumStatusBar />
          {/* Building Edit Modal */}
          <UpdateModal
            isVisible={this.state.editModal}
            title="Edit Building"
            doneBtnTitle="Update Building"
            style={{height: height * 0.55}}
            reRun={this.handleUpdateBuilding}
            buildingData={{
              buildingId: this.state.editBuildId,
              buildingName: this.state.editBuilding,
              buildingDes: this.state.editBuildDes,
            }}></UpdateModal>
          {/* Drawer Modal */}
          <Drawer
            isVisible={this.state.isModalVisible}
            onCancel={this.toggleModal}
            naviagateToDetail={this.naviagateToDetail}
            naviagateToEquip={this.naviagateToEquip}
            naviagateToChart={this.naviagateToChart}
            naviagateToSupport={this.naviagateToSupport}
          />
          <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.menuView}>
                <MaterialIcons
                  size={width * 0.08}
                  color="white"
                  name="keyboard-backspace"
                />
              </TouchableOpacity>
              <View style={styles.searchView}>
                <View style={styles.searchBtnContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.searchBtn}
                    onPress={
                      this.state.dataBuild == 0
                        ? () =>
                            Alert.alert(
                              'Alert',
                              'No building found add building',
                            )
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
                  <MaterialCommunityIcons
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
                style={{position: 'absolute', left: width * 0.03}}
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
                <Text style={styles.mainHeadiing}>Equipments</Text>
              </View>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.mainDataContainer}>
              <View style={styles.mainData}>
                <View style={styles.dropDownContainer}>
                  {/* <MenuT
                    visible={this.state.fileMenuVisible}
                    anchor={
                      <TouchableOpacity
                        style={styles.dropDown}
                        onPress={() => this.setState({fileMenuVisible: true})}>
                        <Feather
                          name="file"
                          size={height * 0.025}
                          color="#3E4A4F"
                        />
                        <Text style={styles.dropDownText}>File</Text>
                        <Feather
                          name="chevron-down"
                          size={height * 0.02}
                          color="#3E4A4F"
                          style={{marginLeft: width * 0.02}}
                        />
                      </TouchableOpacity>
                    }
                    onRequestClose={() =>
                      this.setState({fileMenuVisible: false})
                    }>
                    {this.state.FileArray.map((item) => (
                      <View>
                        <MenuItem
                          style={styles.dropDownListText}
                          onPress={() =>
                            this.setState({fileMenuVisible: false})
                          }>
                          {item.name}
                        </MenuItem>
                      </View>
                    ))}
                  </MenuT> */}

                  <MenuT
                    visible={this.state.addMenuVisible}
                    anchor={
                      <TouchableOpacity
                        style={[
                          styles.dropDown,
                          {
                            borderColor:
                              this.state.unitActualCount >= this.state.unitCount
                                ? '#817e7e80'
                                : '#3E4A4F',
                          },
                        ]}
                        disabled={
                          this.state.unitActualCount >= this.state.unitCount
                            ? true
                            : false
                        }
                        onPress={() => this.setState({addMenuVisible: true})}>
                        <Feather
                          name="plus"
                          size={height * 0.025}
                          color={
                            this.state.unitActualCount >= this.state.unitCount
                              ? '#817e7e80'
                              : '#3E4A4F'
                          }
                        />
                        <Text
                          style={[
                            styles.dropDownText,
                            {
                              color:
                                this.state.unitActualCount >=
                                this.state.unitCount
                                  ? '#817e7e80'
                                  : '#3E4A4F',
                            },
                          ]}>
                          Add
                        </Text>
                        <Feather
                          name="chevron-down"
                          size={height * 0.02}
                          color={
                            this.state.unitActualCount >= this.state.unitCount
                              ? '#817e7e80'
                              : '#3E4A4F'
                          }
                          style={{marginLeft: width * 0.02}}
                        />
                      </TouchableOpacity>
                    }
                    onRequestClose={() =>
                      this.setState({addMenuVisible: false})
                    }>
                    {this.state.AddArray.map((item, index) => (
                      <MenuItem
                        disabled={
                          this.state.dataBuild.length == 0 && index !== 2
                            ? true
                            : false
                        }
                        onPress={item.func}>
                        <View
                          style={{
                            flexDirection: 'row',
                            padding: width * 0.02,
                          }}>
                          {index < 2 ? (
                            <FontAwesome5
                              color={
                                this.state.dataBuild.length == 0 && index !== 2
                                  ? '#817e7e80'
                                  : '#000'
                              }
                              name="house-user"
                              size={width * 0.04}
                              // color="#3E4A4F"
                              style={{
                                paddingHorizontal:
                                  Platform.OS == 'ios' ? width * 0.025 : null,
                                paddingRight:
                                  Platform.OS == 'android'
                                    ? width * 0.025
                                    : null,
                              }}
                            />
                          ) : (
                            <FontAwesome5
                              name="building"
                              size={width * 0.04}
                              color="#3E4A4F"
                              style={{
                                paddingHorizontal:
                                  Platform.OS == 'ios' ? width * 0.028 : null,
                                paddingRight:
                                  Platform.OS == 'android'
                                    ? width * 0.035
                                    : null,
                                left: Platform.OS == 'android' ? 3 : null,
                              }}
                            />
                          )}
                          <Text
                            style={[
                              styles.dropDownListText,
                              {
                                color:
                                  this.state.dataBuild.length == 0 &&
                                  index !== 2
                                    ? '#817e7e80'
                                    : '#000',
                              },
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      </MenuItem>
                    ))}
                  </MenuT>
                  {!loader &&
                    this.state.unitActualCount >= this.state.unitCount && (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: width * 0.032,
                          color: '#ff0000ff',
                        }}>
                        Unit Count Limit Exceed
                      </Text>
                    )}
                </View>

                {/* Top Lists */}
                {loaderBuildings ? (
                  <View
                    style={{
                      height: width * 0.22,
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <SkeletonPlaceholder>
                      <View
                        style={{
                          width: width * 0.3,
                          height: width * 0.22,
                          borderRadius: width * 0.01,
                          borderWidth: width * 0.001,
                          marginLeft: width * 0.02,
                        }}
                      />
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                      <View
                        style={{
                          width: width * 0.3,
                          height: width * 0.22,
                          borderRadius: width * 0.01,
                          borderWidth: width * 0.001,
                          marginLeft: width * 0.02,
                        }}
                      />
                    </SkeletonPlaceholder>
                  </View>
                ) : this.state.dataBuild.length == 0 ? (
                  <View style={{width: width * 0.55, justifyContent: 'center'}}>
                    <Text style={styles.noDataStyling}>
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
                flag={this.state.flag}
                propertyId={this.props.navigation.state.params.item.item.id}
                propertyLat={
                  this.props.navigation.state.params.item.item.latitude
                }
                propertyLong={
                  this.props.navigation.state.params.item.item.longitude
                }
                enableFlag={() => this.setState({flag: true})}
                disableFlag={() => this.setState({flag: false})}
                modalVisible={this.state.isModalUnitVisible}
                closeModal={() =>
                  this.setState({
                    isModalUnitVisible: !this.state.isModalUnitVisible,
                  })
                }
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
                userRole={this.state.userRole}
              />
              {/*
              //! for edit unit
              */}
              <EditUnit
                flag={this.state.flag}
                propertyId={this.props.navigation.state.params.item.item.id}
                propertyLat={
                  this.props.navigation.state.params.item.item.latitude
                }
                propertyLong={
                  this.props.navigation.state.params.item.item.longitude
                }
                enableFlag={() => this.setState({flag: true})}
                disableFlag={() => this.setState({flag: false})}
                modalVisible={this.state.isEditUnitModalVisible}
                closeModal={() =>
                  this.setState({
                    isEditUnitModalVisible: !this.state.isEditUnitModalVisible,
                  })
                }
                reRun={() => this.checkData()}
                meterTypes={this.state.unitMeters}
                modalName="Edit Unit"
                buildingName={this.state.buildingData.name}
                buildingId={this.state.editBuildId}
                unitDetails={this.state.unitDatax.data}
                unitMixesId={this.state.unitMixesId}
                userRole={this.state.userRole}
                // handleEditUnit={() => {
                //   this.setState({isEditUnitModalVisible: false});
                // }}
              />
              <AddBuilding
                unitCount={this.state.unitCount}
                unitActualCount={this.state.unitActualCount}
                modalVisible={this.state.isModalBuildVisible}
                type={this.state.buildingModalType}
                modalName={
                  this.state.buildingModalType
                    ? 'Add Multiple Units'
                    : 'Add Building'
                }
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
                close={() =>
                  this.setState({showFilter: !this.state.showFilter})
                }
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
                  style={styles.searchModalContainer}>
                  {Platform.OS == 'ios' && (
                    <CustumStatusBar backColor transparent />
                  )}
                  <KeyboardAvoidingView behavior="padding">
                    <View style={styles.searchModalInner}>
                      <Search name="search" size={width * 0.07} color="white" />
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
                      <View style={{position: 'absolute', right: width * 0.1}}>
                        {this.state.searchLoading ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={() => this.setState({showSearch: false})}>
                        <MaterialCommunityIcons
                          name="close"
                          color="white"
                          size={width * 0.055}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.searchDataListContainer}>
                      <FlatList
                        style={{marginBottom: width * 0.2}}
                        data={this.state.searchList}
                        renderItem={this._renderUnitList}
                        removeClippedSubviews={false}
                        maxToRenderPerBatch={150}
                        windowSize={100}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                      />
                    </View>
                  </KeyboardAvoidingView>
                </Modal>
              ) : null}
              {loader ? (
                <View
                  style={{
                    width: width * 1,
                    alignItems: 'center',
                    marginVertical: height * 0.01,
                  }}>
                  <View style={styles.infoViewContainer}>
                    <SkeletonPlaceholder>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: width * 0.01,
                        }}></View>
                    </SkeletonPlaceholder>
                  </View>
                </View>
              ) : this.state.realData.length == 0 ? (
                <View style={{width: width * 0.55, justifyContent: 'center'}}>
                  <Text style={styles.noDataStyling}>No data add Unit</Text>
                </View>
              ) : (
                <View style={{width: width * 1, backgroundColor: '#F5F5F5'}}>
                  <FlatList
                    ref={(ref) => {
                      listViewRef = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: width * 0.29}}
                    contentContainerStyle={{
                      backgroundColor: '#F5F5F5',
                      alignItems: 'center',
                    }}
                    numColumns={1}
                    initialNumToRender={realData.length}
                    data={this._customSort(realData)}
                    renderItem={this._renderUnitList}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }
}
