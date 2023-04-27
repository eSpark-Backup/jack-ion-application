import React, {Component, Fragment, version} from 'react';

import {
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
  PermissionsAndroid,
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
import {Icon as Iconx} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

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
import UpdateModal from '../../../../components/modal/UpdateModal';
import Drawer from '../../../../components/modal/Drawer/index';
import AddBuilding from '../../../../components/modal/AddBuilding/index';
import {connect} from 'react-redux';
import {fetchPropetry} from '../../../../Store/Action/properties.action';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

import TextReuseableComponent from '../../../../components/Text/index';
import {customSort} from '../../../../utils/helperFunction';
import systemSetting from 'react-native-system-setting';
import {openSettings, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Linking} from 'react-native';

const {width, height} = Dimensions.get('window');
let buildListViewRef;
let listViewRef;
class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      changed: false,
      unitMixesId: '',
      unitMixes: [],
      unitCount: null,
      unitActualCount: null,
      flag: true,
      meterId: 0,
      loader: true,
      getUtilities: [],
      searchList: [],
      isModalVisible: false,
      isModalUnitVisible: false,
      isModalBuildVisible: false,
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
      detailsSelected: false,
      equipmentsSelected: false,
      reportsSelected: false,
      alertSelected: false,
      supportSelected: false,
      dataBuild: [],
      realData: [],
      fileMenuVisible: false,
      addMenuVisible: false,
      currUnitIndex: null,
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
      activeTab: 'units',
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
      gateway: false,
      loading: false,
      serialNumber: '',
      isVisible: false,
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

  componentDidUpdate(prevProps) {
    if (
      this.props.navigation.state.params.item.item !==
      prevProps.navigation.state.params.item.item
    ) {
      this.checkData();
    }
  }

  onFocusFunction = () => {
    this.checkData();
    this.setState({isModalVisible: false});
  };

  get_filterVal = async (serial, meterId) => {
    this.setState({showFilter: false});
    this.filerUnits(serial, meterId);
  };

  renderShimmers = (item) => (
    <SkeletonPlaceholder>
      <View key={item.id} style={styles.skeletonContainer}>
        <View style={styles.skeletonInnerContainer}>
          <View style={styles.skeletonNameAndIcon}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonName} />
          </View>
          <View style={styles.skeletonDevice} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );

  checkData = async () => {
    this.setState({filterWork: false});
    const PropertyID = this.props.navigation.state.params.item.item.id;
    const PropertyDATA = this.props.navigation.state.params.item.item;

    const unitMixes = PropertyDATA.unit_mixes.map((item) => {
      const {select_option: name, ...rest} = item;
      return {name, ...rest};
    });

    this.setState({
      unitCount: PropertyDATA.unit_count,
      unitActualCount: PropertyDATA.unit_actual_count,
      gateway: PropertyDATA.gateway,
      unitMixes: unitMixes,
    });
    console.log('Property ID', PropertyID);
    const response = await API.post(
      `/property/equipment/building/all-buildings/${PropertyID}`,
    );

    this.setState({loaderBuildings: false});
    console.log('building response', response.data);

    if (response?.ok == true) {
      this.setState({dataBuild: response?.data?.data});
      if (response?.data?.data?.length != 0) {
        this.setState({
          buildingData: response?.data?.data[0],
          editBuildDes: response?.data?.data[0].descriptions,
          editBuildId: response?.data?.data[0].id,
          realData: response?.data?.data[0].units,
          loader: false,
        });

        let arry = response?.data?.data[0].units;
        let lastElement = arry[arry.length - 1];

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
      } else {
        this.setState({
          realData: [],
          lastUnitData: 'Unit-0',
          newUnit: 'Unit-0',
        });
        this.setState({loader: false});
      }
    } else {
      alert('Network Issue');
      this.setState({loaderBuildings: false});
    }
  };

  attachGateway = async () => {
    if (!this?.state?.serialNumber) {
      alert('Serial number is required!');
      return;
    }
    this.setState({loading: true});
    const data = {
      serial_number: this.state.serialNumber,
      property_id: this?.props?.navigation?.state?.params?.item?.item?.id,
    };
    const result = await API.post('/gateway/attach-gateway', data);
    if (result?.ok) {
      if (result?.data?.bool) {
        this.checkData();
      } else {
        alert(result?.data?.message);
      }
    } else {
      alert(result?.data?.message);
    }
    this.setState({loading: false});
  };

  filerUnits = async (serial, id) => {
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
      if (unitResponse?.data?.bool) {
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
      if (unitResponse?.data?.bool) {
        this.setState({realData: unitResponse?.data?.data, loader: false});
        this.setState({loader: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({loader: false});
      }
    }
  };

  searchUnits = async (e) => {
    this.setState({loadFor: e});
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
      if (unitResponse?.data?.bool) {
        this.setState({searchList: unitResponse.data.data});
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
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      equipmentsSelected: true,
      detailsSelected: false,
      alertSelected: false,
      reportsSelected: false,
      supportSelected: false,
    });
  };

  toggleModalUnit = () => {
    this.setState({isModalUnitVisible: !this.state.isModalUnitVisible});
  };
  toggleModalBuild = () => {
    this.setState({isModalBuildVisible: !this.state.isModalBuildVisible});
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
  naviagateToAlerts = () => {
    this.setState({
      isModalVisible: false,
      detailsSelected: false,
      equipmentsSelected: false,
    });
    this.toggleModal();
    this.props.navigation.navigate(
      'Alerts',
      this.props.navigation.state.params,
    );
  };
  naviagateToSupport = () => {
    this.setState({
      isModalVisible: false,
      detailsSelected: false,
      equipmentsSelected: false,
    });
    this.props.navigation.navigate('Support');
  };

  navigateToReport = () => {
    this.toggleModal();
    this.setState({
      isModalVisible: false,
      detailsSelected: false,
      equipmentsSelected: false,
    });
    this.props.navigation.navigate(
      'PropertyReport',
      this.props.navigation.state.params,
    );
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
    if (this.state.showSearch) {
      this.setState({showSearch: false});
      this.props.navigation.navigate('U_Details', {
        unitId: unit.item.id,
        buildingName: this.state.buildingData.name,
        buildingId: this.state.editBuildId,
        propertyName: this.props.navigation.state.params.item.item.name,
        propertyId: this.props.navigation.state.params.item.item.id,
        propertyLat: this.props.navigation.state.params.item.item.latitude,
        propertyLong: this.props.navigation.state.params.item.item.longitude,
      });
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        currUnitIndex:
          unit.index === this.state.currUnitIndex ? null : unit.index,
      });
    }
  };

  goToDetails = (unit) => {
    console.log(
      'this.props.navigation.state.params',
      this.props.navigation.state.params,
    );
    this.props.navigation.navigate('U_Details', {
      unitId: unit.item.id,
      buildingName: this.state.buildingData.name,
      buildingId: this.state.editBuildId,
      propertyName: this.props.navigation.state.params.item.item.name,
      propertyId: this.props.navigation.state.params.item.item.id,
      propertyLat: this.props.navigation.state.params.item.item.latitude,
      propertyLong: this.props.navigation.state.params.item.item.longitude,
      unitMixes: this.state.unitMixes,
    });

    this.setState({
      currUnitIndex: null,
      showSearch: false,
      loader: true,
      loaderBuildings: true,
    });
  };

  getUpdatePropertyData = async () => {
    this.setState({loader: true, loaderBuildings: true});
    const PropertyID = this.props.navigation.state.params.item.item.id;
    const propertydata = await API.get(`/property/${PropertyID}`);
    const PropertyDATA = propertydata?.data?.data?.property;

    this.setState({
      unitCount: PropertyDATA.unit_count,
      unitActualCount: PropertyDATA.unit_actual_count,
      gateway: PropertyDATA.gateway,
    });

    const response = await API.post(
      `/property/equipment/building/all-buildings/${PropertyID}`,
    );

    this.setState({loaderBuildings: false});
    console.log('building response', response.data);

    if (response?.ok == true) {
      this.setState({dataBuild: response?.data?.data});
      if (response?.data?.data?.length != 0) {
        this.setState({
          buildingData: response?.data?.data[0],
          editBuildDes: response?.data?.data[0].descriptions,
          editBuildId: response?.data?.data[0].id,
          realData: response?.data?.data[0].units,
          loader: false,
        });

        let arry = response?.data?.data[0].units;
        let lastElement = arry[arry.length - 1];

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
      } else {
        this.setState({
          realData: [],
          lastUnitData: 'Unit-0',
          newUnit: 'Unit-0',
        });
        this.setState({loader: false});
      }
    } else {
      alert('Network Issue');
      this.setState({loaderBuildings: false});
    }

    this.props.fetchPropetry();
  };

  deleteUnit = async (id) => {
    const response = await API.post(`/property/equipment/unit/${id}`);
    if (response?.data?.bool) {
      this.setState({currUnitIndex: null});
      alert(response?.data?.message);
      this.getUpdatePropertyData();
    } else {
      this.setState({loader: false});
    }
  };

  confirmDelete = (id) => {
    Alert.alert('Delete Unit', 'Are you sure you want to Delete?', [
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

  _openEditUnit = async (unitId) => {
    const res = await API.get(`/property/equipment/unit/${unitId}`);

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

  turnLocationOn = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS == 'android') {
      systemSetting.switchLocation();
    }
  };

  enableLocation = async (unitId) => {
    const location = await systemSetting.isLocationEnabled();
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
              this._openEditUnit(unitId);
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
            this._openEditUnit(unitId);
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
        } catch (err) {
          alert(err);
        }
      }
    }
  };

  _renderUnitList = (unit) => {
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
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth:
                  unit.index === this.state.currUnitIndex &&
                  unit?.item?.unit_meter?.length < 1
                    ? 0
                    : 1,
                borderBottomLeftRadius:
                  unit.index === this.state.currUnitIndex ? 0 : width * 0.01,
                borderBottomRightRadius:
                  unit.index === this.state.currUnitIndex ? 0 : width * 0.01,
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
                  <View style={{flexDirection: 'row'}}>
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
                    {unit?.item?.unit_meter?.length ? (
                      <View style={styles.deviceInstalledIndicator}>
                        <Feather
                          name="check"
                          size={width * 0.035}
                          color="green"
                        />
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Unit Item', unit?.item?.unit_mix);
                      if (unit?.item?.unit_mix == null) {
                        Toast.show(
                          'Attached Unit Mix before adding meter',
                          Toast.SHORT,
                        );
                      } else {
                        this.enableLocation(unit?.item?.id);
                      }
                    }}
                    style={styles.unitDetailInnerElse}>
                    <MaterialCommunityIcons
                      name="barcode-off"
                      size={width * 0.04}
                      style={styles.unitDetailInnerElseIcon}
                    />
                    <TextReuseableComponent
                      title
                      style={styles.unitDetailInnerElseText}
                      value={'Program a Device'}
                    />
                  </TouchableOpacity>
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
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        // repeatSpacer={width * 0.17}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.25,
                            color: '#25AAE1ec',
                            fontSize: width * 0.04,
                          },
                        ]}>
                        {item?.meter_read?.meter_reading
                          ? item?.meter_read?.meter_reading + ' Gallons'
                          : 0 + ' Gallons'}
                      </TextTicker>
                      <TextTicker
                        duration={10000}
                        marqueeDelay={2000}
                        style={[
                          styles.dataFieldText,
                          {
                            minWidth: width * 0.15,
                            maxWidth: width * 0.3,
                            fontSize: width * 0.02,
                          },
                        ]}>
                        {item?.meter_read?.time_diff
                          ? item?.meter_read?.time_diff
                          : 'Waiting For First Check In'}
                      </TextTicker>
                    </View>
                    <View
                      style={[
                        styles.unitDetailInnerif,
                        {
                          width: width * 0.5,
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TextTicker
                          duration={10000}
                          marqueeDelay={2000}
                          style={[
                            styles.dataFieldText,
                            {
                              minWidth: width * 0.05,
                              maxWidth: width * 0.2,
                              fontSize: width * 0.025,
                              marginRight: width * 0.005,
                            },
                          ]}>
                          {item?.meter_read?.battery
                            ? item?.meter_read?.battery
                            : 'No Record'}
                        </TextTicker>
                        <Ionic
                          name="battery-dead"
                          size={width * 0.045}
                          color="black"
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TextTicker
                          duration={10000}
                          marqueeDelay={2000}
                          // repeatSpacer={width * 0.17}
                          style={[
                            styles.dataFieldText,
                            {
                              minWidth: width * 0.05,
                              maxWidth: width * 0.2,
                              fontSize: width * 0.025,
                              marginRight: width * 0.005,
                            },
                          ]}>
                          {item?.meter_read?.temperature
                            ? item?.meter_read?.temperature
                            : 'No Record'}
                        </TextTicker>
                        <Ionic
                          name="thermometer-outline"
                          size={width * 0.045}
                          color="black"
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.unitDetailSeprater,
                        {
                          borderBottomWidth:
                            index < unit?.item?.unit_meter?.length - 1 &&
                            unit?.item?.unit_meter?.length > 1
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
                  <TextReuseableComponent
                    title
                    style={{
                      color: 'white',
                    }}
                    value={'View'}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
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
                  <TextReuseableComponent title style={{
                    color: 'white',
                  }} value={"Edit"} />
                </TouchableOpacity> */}
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
                <TextReuseableComponent
                  title
                  style={{
                    color: 'white',
                  }}
                  value={'Delete'}
                />
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
        <TextReuseableComponent
          title
          style={styles.buildingUnitName}
          value={`${build.item.unit_count} Units`}
        />
        <TouchableOpacity
          onPress={() => this.buildingEditOpen(build.item)}
          style={styles.buildingEditBtn}>
          <TextReuseableComponent
            title
            style={{
              color: 'white',
            }}
            value={'Edit'}
          />
          <MaterialIcons name="edit" color="white" size={width * 0.04} />
        </TouchableOpacity>
      </TouchableOpacity>
      // </KeyboardAvoidingVie>
    );
  };

  showArrayItem = async (build) => {
    console.log('build', build.item.units);
    this.setState({
      loader: true,
      buildingData: build.item,
      editBuildDes: build.item.descriptions,
      editBuildId: build.item.id,
      changed: true,
      filterWork: false,
    });

    this.setState({realData: build.item.units, loader: false});

    let arry = build.item.units;
    let lastElement = arry[arry.length - 1];
    this.setState({
      lastUnitData:
        lastElement?.name == undefined ? this.state.newUnit : lastElement?.name,
      newUnit:
        lastElement?.name == undefined ? this.state.newUnit : lastElement?.name,
    });
    this.setState((prevState) => ({
      ...prevState,
      unitData: {
        // object that we want to update
        ...prevState.unitData, // keep all other key-value pairs
        unit: {name: lastElement?.name}, // update the value of specific key
      },
    }));

    // const data = {
    //   building_id: build.item.id,
    // };
    // const unitResponse = await API.post(
    //   `/property/equipment/unit/all-units`,
    //   data,
    // );
    // if (unitResponse?.ok == true) {
    //   this.setState({realData: unitResponse?.data?.data, loader: false});
    //   let arry = unitResponse?.data?.data;
    //   let lastElement = arry[arry.length - 1];
    //   this.setState({
    //     lastUnitData:
    //       lastElement?.name == undefined
    //         ? this.state.newUnit
    //         : lastElement?.name,
    //     newUnit:
    //       lastElement?.name == undefined
    //         ? this.state.newUnit
    //         : lastElement?.name,
    //   });
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     unitData: {
    //       // object that we want to update
    //       ...prevState.unitData, // keep all other key-value pairs
    //       unit: {name: lastElement?.name}, // update the value of specific key
    //     },
    //   }));
    // } else {
    //   alert('Network Issue');
    //   this.setState({loader: false});
    // }
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
    this.setState({getUtilities: unitResponse?.data?.data});
  };

  handleAddBuilding = () => {
    this.setState({isModalBuildVisible: false});
    this.getUpdatePropertyData();
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
    if (edit) {
      const response = await API.post(
        `/property/equipment/building/update-building/${id}`,
        params,
      );

      if (response?.data?.bool) {
        this.getUpdatePropertyData();
        this.setState({isModalVisible: false});
        alert(response?.data?.message);
      }
    } else {
      const response = await API.post(`/property/equipment/building/${id}`);

      if (response?.data?.bool) {
        this.getUpdatePropertyData();
        this.setState({isModalVisible: false});
        alert(response?.data?.message);
      }
    }
  };
  render() {
    const {result, scan, scanResult} = this.state;
    const realData = this.state.realData;
    const realColor = this.state.hColor;
    const {
      loader,
      loaderBuildings,
      meterTypeInputs,
      gateway,
      activeTab,
    } = this.state;
    return (
      <>
        <View style={styles.container}>
          <CustumStatusBar />

          <Modal
            animationIn="bounceInUp"
            animationOut="bounceInDown"
            backdropOpacity={5}
            statusBarTranslucent
            isVisible={this.state.isVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                borderRadius: width * 0.02,
                marginTop: Platform.OS == 'ios' ? height * 0.03 : null,
              }}>
              <TextReuseableComponent
                title
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}
                value={'Scan Barcode'}
              />
              <RNCamera
                ref={(ref) => {
                  this.camera = ref;
                }}
                style={{flex: 1}}
                type={RNCamera.Constants.Type.back}
                autoFocus="on"
                onBarCodeRead={(e) => {
                  this.setState({serialNumber: e?.data, isVisible: false});
                }}
                captureAudio={false}>
                <BarcodeMask outerMaskOpacity={0} />
              </RNCamera>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: height * 0.02,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isVisible: !this.state?.isVisible,
                    });
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: width * 0.008,
                      height: height * 0.05,
                      justifyContent: 'center',
                      width: width * 0.4,
                    }}>
                    <TextReuseableComponent
                      title
                      style={{
                        textAlign: 'center',
                        color: '#25AAE1',
                      }}
                      value={'Switch Off Scanner'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
            detailsSelected={this.state.detailsSelected}
            equipmentsSelected={this.state.equipmentsSelected}
            reportsSelected={this.state.reportsSelected}
            alertSelected={this.state.alertSelected}
            supportSelected={this.state.supportSelected}
            naviagateToEquip={this.naviagateToEquip}
            naviagateToAlerts={this.naviagateToAlerts}
            naviagateToSupport={this.naviagateToSupport}
            navigateToReport={this.navigateToReport}
            propertyName={
              this.props?.navigation?.state?.params?.item?.item?.name
            }
          />
          <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Properties')}
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
                    <TextReuseableComponent
                      title
                      style={{color: 'white'}}
                      value={'Search'}
                    />
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
              <View style={styles.headerIconContainer}>
                <Ionic
                  name="md-business-outline"
                  size={width * 0.06}
                  color="white"
                />
                <TextReuseableComponent
                  title
                  style={styles.mainHeadiing}
                  value={'Equipments'}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.setState({activeTab: 'units'})}
              style={
                activeTab == 'units'
                  ? styles.activeTabContainer
                  : styles.tabContainer
              }>
              <TextReuseableComponent
                title
                style={{color: activeTab == 'units' ? '#25AAE1ec' : '#fff'}}
                value={'Units'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.setState({activeTab: 'network'})}
              style={
                activeTab == 'network'
                  ? styles.activeTabContainer
                  : styles.tabContainer
              }>
              <TextReuseableComponent
                title
                style={{color: activeTab == 'network' ? '#25AAE1ec' : '#fff'}}
                value={'Network'}
              />
            </TouchableOpacity>
          </View>
          {this.state.activeTab == 'units' ? (
            <View style={styles.bodyContainer}>
              <View style={styles.mainDataContainer}>
                <View style={styles.mainData}>
                  <View style={styles.dropDownContainer}>
                    <MenuT
                      visible={this.state.addMenuVisible}
                      anchor={
                        <TouchableOpacity
                          style={[
                            styles.dropDown,
                            {
                              borderColor:
                                this.state.unitActualCount >=
                                this.state.unitCount
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
                          <TextReuseableComponent
                            title
                            style={[
                              styles.dropDownText,
                              {
                                color:
                                  this.state.unitActualCount >=
                                  this.state.unitCount
                                    ? '#817e7e80'
                                    : '#3E4A4F',
                              },
                            ]}
                            value={'Add'}
                          />
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
                                  this.state.dataBuild.length == 0 &&
                                  index !== 2
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
                            <TextReuseableComponent
                              title
                              style={[
                                styles.dropDownListText,
                                {
                                  color:
                                    this.state.dataBuild.length == 0 &&
                                    index !== 2
                                      ? '#817e7e80'
                                      : '#000',
                                },
                              ]}
                              value={item.name}
                            />
                          </View>
                        </MenuItem>
                      ))}
                    </MenuT>
                    {!loader &&
                      this.state.unitActualCount >= this.state.unitCount && (
                        <TextReuseableComponent
                          title
                          style={{
                            textAlign: 'center',
                            color: '#ff0000ff',
                          }}
                          value={'Unit Count Limit Exceed'}
                        />
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
                    <View
                      style={{width: width * 0.55, justifyContent: 'center'}}>
                      <TextReuseableComponent
                        title
                        style={styles.noDataStyling}
                        value={'No data add Building'}
                      />
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
                {this.state?.buildingData?.name && (
                  <View style={styles.buildingBadge}>
                    <View>
                      <FontAwesome5
                        name="building"
                        size={width * 0.04}
                        color="white"
                      />
                    </View>
                    <View>
                      <TextReuseableComponent
                        title
                        style={{color: 'white', marginLeft: width * 0.02}}
                        value={`${
                          this.state?.buildingData?.name
                            ? this.state?.buildingData?.name
                            : ''
                        }`}
                      />
                    </View>
                  </View>
                )}

                {this.state.isModalUnitVisible && (
                  <EditUnit
                    flag={this.state.flag}
                    propertyId={
                      this.props?.navigation?.state?.params?.item?.item?.id
                    }
                    propertyLat={
                      this.props.navigation.state.params?.item?.item?.latitude
                    }
                    propertyLong={
                      this.props.navigation.state.params?.item?.item?.longitude
                    }
                    enableFlag={() => this.setState({flag: true})}
                    disableFlag={() => this.setState({flag: false})}
                    modalVisible={this.state.isModalUnitVisible}
                    closeModal={() =>
                      this.setState({
                        isModalUnitVisible: !this.state.isModalUnitVisible,
                      })
                    }
                    reRun={() => this.getUpdatePropertyData()}
                    meterTypes={[]}
                    modalName="Add Unit"
                    type={'add'}
                    buildingName={this.state.buildingData.name}
                    buildingId={this.state.editBuildId}
                    unitDetails={this.state.unitData}
                    doneBtnTitle="Add Unit"
                    doneIcon={
                      <Iconx
                        name="plus"
                        type="feather"
                        size={18}
                        color="#fff"
                      />
                    }
                    handleEditUnit={() => {
                      this.setState({isModalUnitVisible: false});
                    }}
                    unitMixes={this.state.unitMixes}
                    unitsArray={this.state.realData}
                  />
                )}
                {/*
               //! for edit unit
               */}
                {this.state.isEditUnitModalVisible && (
                  <EditUnit
                    flag={this.state.flag}
                    propertyId={
                      this.props?.navigation?.state?.params?.item?.item?.id
                    }
                    propertyLat={
                      this.props.navigation?.state?.params?.item?.item?.latitude
                    }
                    propertyLong={
                      this.props.navigation.state.params?.item?.item?.longitude
                    }
                    enableFlag={() => this.setState({flag: true})}
                    disableFlag={() => this.setState({flag: false})}
                    modalVisible={this.state.isEditUnitModalVisible}
                    closeModal={() =>
                      this.setState({
                        isEditUnitModalVisible: !this.state
                          .isEditUnitModalVisible,
                      })
                    }
                    reRun={() => this.checkData()}
                    meterTypes={this.state.unitMeters}
                    // modalName="Edit Unit"
                    buildingName={this.state.buildingData.name}
                    buildingId={this.state.editBuildId}
                    unitDetails={this.state.unitDatax.data}
                    // unitMixesId={this.state.unitMixesId}
                    addMeterUnitMix={this.state.unitDatax.data}
                    addMeterUnitMixId={this.state.unitMixesId}
                    unitMixes={this.state.unitMixes}
                    addNewMeter={true}
                    fromPAD={true}
                    navigation={this.props.navigation}
                    navigateTo={{
                      unitId: '',
                      buildingName: this.state.buildingData.name,
                      buildingId: this.state.editBuildId,
                      propertyId: this.props.navigation.state.params.item.item
                        .id,
                      propertyLat: this.props.navigation.state.params.item.item
                        .latitude,
                      propertyLong: this.props.navigation.state.params.item.item
                        .longitude,
                    }}
                  />
                )}
                {this.state.isModalBuildVisible && (
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
                    closeModal={() =>
                      this.setState({isModalBuildVisible: false})
                    }
                    reRun={this.handleAddBuilding}
                    propertyId={
                      this.props?.navigation?.state?.params?.item?.item?.id
                    }
                    lastUnitName={this.state.newUnit}
                    unitMixeId={
                      this.props.navigation.state.params.item?.item
                        ?.unit_mixes[0]?.id
                    }
                    buildData={{
                      buildingName: this.state.buildingData.name,
                      buildDes: this.state.editBuildDes,
                      buildId: this.state.editBuildId,
                    }}
                  />
                )}
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
                  filterWork={(e) => this.setState({filterWork: e})}
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
                        <Search
                          name="search"
                          size={width * 0.07}
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
                        <View
                          style={{position: 'absolute', right: width * 0.1}}>
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
                    }}>
                    {this.state.shimmers.map((item) =>
                      this.renderShimmers(item),
                    )}
                  </View>
                ) : this.state.realData.length == 0 ? (
                  <View style={{width: width * 0.55, justifyContent: 'center'}}>
                    <TextReuseableComponent
                      title
                      style={styles.noDataStyling}
                      value={'No data add Unit'}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      width: width * 1,
                      backgroundColor: '#f5f5f5',
                    }}>
                    <FlatList
                      ref={(ref) => {
                        listViewRef = ref;
                      }}
                      showsVerticalScrollIndicator={false}
                      // style={{marginBottom: width * 0.35}}
                      contentContainerStyle={{
                        backgroundColor: '#F5F5F5',
                        alignItems: 'center',
                      }}
                      numColumns={1}
                      initialNumToRender={realData.length}
                      data={customSort(realData, null)}
                      renderItem={this._renderUnitList}
                      keyExtractor={(item) => item.id.toString()}
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.bodyContainer}>
              {!loader ? (
                <>
                  {!gateway ? (
                    <View style={styles.addGatewayContainer}>
                      <View style={{marginVertical: 20}}>
                        <TextReuseableComponent
                          title
                          style={{color: '#bdbdbd'}}
                          value={'Program a Gateway'}
                        />
                      </View>
                      <View>
                        <View style={styles.textInputContainer}>
                          <MaterialCommunityIcons
                            onPress={() => {
                              this.setState({
                                isVisible: !this.state?.isVisible,
                              });
                            }}
                            name="barcode-scan"
                            color="#06012B"
                            size={width * 0.035}
                            style={{padding: 5}}
                          />
                          <TextInput
                            value={this.state.serialNumber}
                            keyboardType="default"
                            placeholder="Enter Serial Number"
                            placeholderTextColor="#5B5B61"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) =>
                              this.setState({serialNumber: text})
                            }
                            style={styles.input}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{marginTop: width * 0.05}}
                        activeOpacity={0.8}
                        onPress={() => this.attachGateway()}>
                        <View style={styles.buttonContainer}>
                          {this.state.loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <TextReuseableComponent
                              title
                              style={styles.btnText}
                              value={'Attach'}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TextReuseableComponent
                        title
                        style={[styles.mainHeadiing, {color: '#000'}]}
                        value={'Network Information'}
                      />
                      <TextReuseableComponent
                        title
                        style={[styles.mainHeadiing, {color: '#000'}]}
                        value={gateway?.serial_number}
                      />
                      <TextReuseableComponent
                        title
                        style={[styles.mainHeadiing, {color: '#000'}]}
                        value={'Synced'}
                      />
                      <View
                        style={{
                          marginVertical: 15,
                          flexDirection: 'row',
                          width: '50%',
                          justifyContent: 'space-around',
                        }}>
                        <MaterialCommunityIcons
                          name="ethernet"
                          size={45}
                          color={
                            gateway?.eth?.connection ? '#25AAE1ec' : '#000'
                          }
                        />
                        <MaterialCommunityIcons
                          name="signal-cellular-outline"
                          size={45}
                          color={
                            gateway?.cellular?.connection ? '#25AAE1ec' : '#000'
                          }
                        />
                        <MaterialCommunityIcons
                          name="wifi"
                          size={45}
                          color={
                            gateway?.wifi?.connection ? '#25AAE1ec' : '#000'
                          }
                        />
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size={'large'} color="#25AAE1ec" />
                </View>
              )}
            </View>
          )}
        </View>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    fetchPropetry: () => dispatch(fetchPropetry()),
  };
};

export default connect(null, mapDispatchToProps)(Splash);
