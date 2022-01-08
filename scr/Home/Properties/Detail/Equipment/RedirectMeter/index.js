import React, {Component, Fragment, version} from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Alert,
  FlatList,
  ToastAndroid,
} from 'react-native';

//Packages
import {Header, Button, Icon} from 'react-native-elements';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Build from 'react-native-vector-icons/FontAwesome5';
import Check from 'react-native-vector-icons/Feather';
import Home from 'react-native-vector-icons/FontAwesome5';
import Base_URL from '../../../../../api/WebServices';
import {create} from 'apisauce';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../../../../components/Loader';
import ContextProp from '../../../Context/propContext';
import {DotsLoader} from 'react-native-indicator';
import TextTicker from 'react-native-text-ticker';
import EditUnit from '../Units/modals/UnitEdit';
import AddBuilding from '../../../../../components/modal/AddBuilding/index';
import {SafeAreaView} from 'react-native-safe-area-context';

// Components
import {Fonts} from '../../../../../utils/fonts';

import styles from './style';
import style from './style';
import CustumStatusBar from '../../../../../components/StatusBar';
const {width, height} = Dimensions.get('window');

export default class RedirectMeter extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isVisible: false,
      flag: true,
      barcodes: [],
      loader: false,
      scan: false,
      scanResult: false,
      result: null,
      animatedValue: new Animated.Value(0),
      springValue: new Animated.Value(0),
      count: 0,
      scanning: false,
      propertyList: [],
      searchOffset: 0,
      success: false,
      limitExceed: false,
      propertyListLoader: false,
      searchLoading: false,
      loadFor: '',
      showMore: '',
      dataBuild: [],
      loaderBuildings: false,
      unitLoader: false,
      buildingData: [],
      unitData: [],
      lastUnitData: '',
      newUnit: 'Unit-1',
      propertyDetails: {},
      propertyId: '',
      propertyName: '',
      buildingId: '',
      buildginName: '',
      buildingDetails: [],
      unitId: '',
      unitName: '',
      finish: true,
      unitModal: false,
      buildModal: false,
      editUnitMenuVisible: false,
      meterTypesList: [],
      meterList: [],
      unitDetails: {},
      meterSerial: '',
      unitModalType: '',
    };
    //Settin up an interval for the counter

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }
  componentDidMount() {
    this.getToken();
    this.setState({
      meterSerial: this.props.navigation.state.params.meterSerial,
    });
  }

  onFocusFunction = () => {
    this.getToken();
    this.setState({
      meterSerial: this.props.navigation.state.params.meterSerial,
    });
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
      this.setState({loader: false});
    }
    const res = await this.api.get('/property/equipment/meter/all-meters');
    this.setState({meterList: res.data?.data}, () =>
      console.log('All Meters', this.state.meterList),
    );
  };
  typeSwitcher = (arg) => {
    switch (arg) {
      case 'hot water':
        return require('../../../../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../../../../Images/electric.png');
      case 'gas':
        return require('../../../../../../Images/gass.png');
      case 'water':
        return require('../../../../../../Images/all-waters.png');
      default:
        break;
    }
  };
  searchProperties = async (e) => {
    this.setState({loadFor: e});
    let data = {
      offset: 0,
      search: e,
    };
    if (e) {
      this.setState({searchLoading: true});
      const response = await this.api.post('/property/all', data);
      console.log('Search property===>', response);
      this.setState({searchOffset: response.data.data.offset});
      console.log('Bool Response', response?.data?.bool);
      if (response?.data?.bool) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({propertyList: response.data.data.properties});
        // console.log('Search property===>', response.data.data.properties);
        this.setState({searchLoading: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({searchLoading: false});
      }
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        propertyList: [],
        propertyId: '',
        loaderBuildings: false,
        dataBuild: [],
        buildingId: '',
        unitData: [],
        unitId: '',
      });
    }
  };
  loadSearchData = async () => {
    this.setState({searchLoading: true});
    let prop = {
      offset: this.state.searchOffset,
      search: this.state.loadFor,
    };
    if (this.state.loadFor) {
      this.setState({searchLoading: true});
      const response = await this.api.post('/property/all', prop);
      console.log('Search more property===>', response?.data);
      if (response?.data?.bool) {
        if (
          this.state.searchOffset != response.data.data.offset &&
          response.data.data.offset > 0
        ) {
          let data = [...this.state.propertyList];
          let data2 = response.data.data.properties;
          data.push(...data2);
          this.setState({propertyList: data});
          this.setState({
            searchLoading: false,
            searchOffset: response.data.data.offset,
          });
        }
        setTimeout(() => {
          console.log('Check Searh Loader', this.state.searchLoading);
          if (this.state.searchLoading) {
            this.setState({searchLoading: false});
          }
        }, 3000);
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({searchLoading: false});
      }
    } else {
      this.setState({propertyList: []});
    }
  };

  checkData = async () => {
    this.setState({loader: true});
    let data = {
      offset: 0,
    };
    const response = await this.api.post('/property/all', data);
    this.setState({
      success: response.data.bool,
      offset: response.data.data.offset,
    });
    if (response?.data?.bool) {
      this.setState({propertyList: response.data.data.properties});
      this.setState({limitExceed: false});
      this.setState({loader: false});
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({loader: false});
    }
  };

  loadMoreData = async () => {
    if (!this.state.limitExceed) {
      this.setState({propertyListLoader: true});
    }
    let data = {
      offset: this.state.offset,
    };
    const response = await this.api.post('/property/all', data);
    // console.log('respone property===>', response.data.data);
    this.setState({
      success: response.data.bool,
    });
    if (response?.data?.bool) {
      console.log('this.state.offset===>', this.state.offset);
      console.log('response.data.data.offset===>', response.data.data.offset);
      if (
        this.state.offset != response.data.data.offset &&
        response.data.data.offset > 0
      ) {
        let data = [...this.state.propList];
        let data2 = response.data.data.properties;
        data.push(...data2);
        this.setState({propList: data});
        // console.log('new array', data);
        this.setState({
          propertyListLoader: false,
          offset: response.data.data.offset,
        });
        this.setState({limitExceed: false});
      } else {
        this.setState({limitExceed: true});
        this.setState({propertyListLoader: false});
      }
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({propertyListLoader: false});
    }
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

  getItemId = async (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      loaderBuildings: true,
      unitData: [],
      unitId: '',
      buildingId: '',
      dataBuild: [],
    });
    this.setState({
      propertyId: item.id,
      propertyName: item.name,
      propertyDetails: item,
    });
    const response = await this.api.post(
      `/property/equipment/building/all-buildings/${item.id}`,
    );
    console.log('Check response buildings--->', response);
    if (response?.ok == true) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      console.log('Check response buildings--->', response?.data);
      this.setState({dataBuild: response?.data?.data});
      this.setState({loaderBuildings: false});
      if (response?.data?.data?.length == 0) {
        this.setState({buildingId: '', unitData: []});
      }
    } else {
      alert('Network Issue');
      this.setState({loaderBuildings: false});
    }
  };

  getBuildingId = async (item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      buildingId: item.id,
      buildginName: item.name,
      buildingDetails: item,
      unitLoader: true,
      unitData: [],
      unitId: '',
    });
    const data = {
      building_id: item.id,
    };
    const unitResponse = await this.api.post(
      `/property/equipment/unit/all-units`,
      data,
    );
    console.log('unitResponse--->', unitResponse?.data?.data);
    if (unitResponse?.ok == true) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({unitData: unitResponse?.data?.data, unitLoader: false});
      let arry = unitResponse?.data?.data;
      let lastElement = arry[arry.length - 1];
      // console.log('lastElement--->', lastElement)
      this.setState({
        lastUnitData: lastElement.name,
        newUnit: lastElement.name,
      });
      // console.log('buildingId--->', this.state.editBuildId);
    } else {
      alert('Network Issue');
      this.setState({unitLoader: false});
    }
  };

  getUnitId = async (item) => {
    this.setState({
      unitModalType: 'meterDirect',
      meterTypesList: item.unit_meter,
    });
    const data = {
      name: item.name,
      id: item.id,
      meterSerial: this.state.meterSerial,
    };
    let arr1 = [...this.state.meterList];
    let arr2 = item.unit_meter;
    const antiIntersection = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
    );
    console.log('antiIntersection--->', antiIntersection);
    if (antiIntersection.length == 0) {
      alert('Meters are full please add new unit or add meter in someone else');
    } else {
      this.setState((prevState) => ({
        ...prevState,
        unitDetails: {
          // object that we want to update
          ...prevState.unitDetails, // keep all other key-value pairs
          unit: data, // update the value of specific key
        },
      }));
      this.setState({unitModal: true});
    }
  };

  handleFinish = async () => {
    const check = this.state.meterSerial.substring(0);
    const data = {
      device_serial_number: check,
    };
    const meterResponse = await this.api.post(
      `/property/equipment/unit/get-meter-info`,
      data,
    );
    if (meterResponse?.data?.bool) {
      this.props.navigation.navigate('MeterDetails', {
        unitId: this.state.unitId,
        buildingName: this.state.buildginName,
        propertyName: this.state.propertyName,
        meterInfo: meterResponse?.data?.data?.meterinfo,
      });
    } else {
      alert('Network Issue');
    }
  };

  handleAddBuilding = () => {
    ToastAndroid.show('Building add successfully', ToastAndroid.SHORT);
    this.setState({buildModal: false});
    this.getItemId(this.state.propertyDetails);
  };
  handleAddUnit = () => {
    // ToastAndroid.show('Building add successfully', ToastAndroid.SHORT);
    const data = {
      name: '',
      id: '',
      meterSerial: this.state.meterSerial,
    };
    this.setState({
      unitModal: true,
      unitModalType: 'addMeterDirect',
      meterTypesList: this.state.meterList,
    });
    this.setState((prevState) => ({
      ...prevState,
      unitDetails: {
        // object that we want to update
        ...prevState.unitDetails, // keep all other key-value pairs
        unit: data, // update the value of specific key
      },
    }));
  };

  handleFinishUnit = (v) => {
    console.log('let check retur', v);
    ToastAndroid.show('Awesome meter add finish it', ToastAndroid.SHORT);
    this.setState({unitModal: false, finish: false});
    this.getItemId(this.state.propertyDetails);
    this.getBuildingId(this.state.buildingDetails);
    this.setState({
      unitId: v?.unit?.id,
      unitName: v?.unit?.name,
    });
    this.handleFinish();
  };
  render() {
    return (
      <>
        <View style={styles.container}>
          {this.state.loader ? <Loader /> : null}
          <Header
            leftComponent={{
              text: 'Close',
              style: {fontSize: width * 0.05, color: '#000'},
              onPress: () => this.props.navigation.goBack(),
            }}
            centerComponent={
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: width * 0.05}}>Add meter directly</Text>
              </View>
            }
            backgroundColor="#fff"
            containerStyle={styles.headerContainer}
          />
          <View style={{height: height * 0.85}}>
            <View
              style={{
                ...styles.boxConatainer,
                height:
                  this.state.propertyList.length != 0
                    ? height * 0.27
                    : height * 0.12,
              }}>
              <View style={styles.boxInner}>
                <View style={styles.propertiesContainer}>
                  <Properties
                    name="home-city-outline"
                    size={width * 0.04}
                    color="#115b72"
                  />
                  <Text style={styles.propertiesText}>Properties</Text>
                </View>
                <View style={{width: '100%'}}>
                  <View style={styles.currentReadContainer}>
                    <View style={styles.inputFilterView}>
                      <TextInput
                        style={{width: width * 0.3, height: height * 0.05}}
                        value={this.state.loadFor}
                        placeholder="Search Here..."
                        onChangeText={(e) =>
                          !this.state.finish ? null : this.searchProperties(e)
                        }
                      />
                      {this.state.searchLoading ? (
                        <ActivityIndicator
                          color="gray"
                          size="small"
                          style={styles.loaderStyle}
                        />
                      ) : null}
                    </View>
                    {this.state.propertyList.length != 0 ? (
                      <View style={styles.filterUtility}>
                        <FlatList
                          style={{width: width * 0.9}}
                          data={this.state.propertyList}
                          showsVerticalScrollIndicator={false}
                          numColumns={1}
                          initialNumToRender={this.state.propertyList.length}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              onPress={() =>
                                !this.state.finish ? null : this.getItemId(item)
                              }>
                              <View style={styles.propertiesListContainer}>
                                <Properties
                                  name="home-city-outline"
                                  size={width * 0.04}
                                  color="#115b72"
                                />
                                <View style={{marginLeft: width * 0.01}}>
                                  <View style={{width: width * 0.6}}>
                                    <TextTicker
                                      style={styles.propText}
                                      repeatSpacer={width * 0.6}
                                      duration={6000}
                                      marqueeDelay={2000}>
                                      {item.name == null
                                        ? 'Untitled'
                                        : item.name}
                                    </TextTicker>
                                  </View>

                                  <View style={{width: width * 0.6}}>
                                    <TextTicker
                                      style={styles.dimTextTicker}
                                      repeatSpacer={width * 0.6}
                                      duration={6000}
                                      marqueeDelay={2000}>
                                      {(item.street == null
                                        ? ''
                                        : item.street + ', ') +
                                        (item.st == null
                                          ? ''
                                          : item.st + ', ') +
                                        (item.city == null
                                          ? ''
                                          : item.city + ', ') +
                                        (item.zipcode == null
                                          ? ''
                                          : item.zipcode)}
                                    </TextTicker>
                                  </View>
                                </View>
                                {item.id == this.state.propertyId && (
                                  <View style={styles.propertyCheckContainer}>
                                    <Check
                                      name="check"
                                      size={width * 0.04}
                                      color="#fff"
                                    />
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                          )}
                          onEndReachedThreshold={width * 0.0001}
                          onEndReached={() => this.loadSearchData()}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.boxConatainer,
                height:
                  this.state.dataBuild.length != 0
                    ? height * 0.2
                    : height * 0.12,
              }}>
              <View style={styles.boxInner}>
                <View style={styles.buildingContainer}>
                  <View style={styles.buildingInnerContainer}>
                    <Build
                      name="building"
                      size={width * 0.04}
                      color="#115b72"
                    />
                    <Text style={styles.buildingText}>Buildings</Text>
                  </View>
                  {this.state.propertyId ? (
                    <TouchableOpacity
                      style={{zIndex: 1}}
                      onPress={() =>
                        this.setState({buildModal: !this.state.buildModal})
                      }>
                      <Icon
                        name="plus-circle"
                        type="feather"
                        size={width * 0.06}
                        color={'#25AAE1ec'}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{width: '100%'}}>
                  <View style={styles.currentReadContainer}>
                    {!this.state.propertyId ? (
                      <View style={styles.buildingDefaultView}>
                        <Text style={styles.buildingPropertySelectText}>
                          Please select property first
                        </Text>
                      </View>
                    ) : this.state.loaderBuildings ? (
                      <View style={styles.buildingLoaderContainer}>
                        <DotsLoader color="gray" />
                      </View>
                    ) : this.state.dataBuild.length != 0 ? (
                      <View style={[styles.filterUtility]}>
                        <FlatList
                          style={{width: width * 0.9}}
                          data={this._customSort(this.state.dataBuild)}
                          showsVerticalScrollIndicator={false}
                          numColumns={1}
                          initialNumToRender={this.state.dataBuild.length}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              onPress={() =>
                                !this.state.finish
                                  ? null
                                  : this.getBuildingId(item)
                              }>
                              <View style={styles.buildingListContainer}>
                                <Build
                                  name="building"
                                  size={width * 0.04}
                                  color="#115b72"
                                />
                                <View style={{marginLeft: width * 0.01}}>
                                  <View style={{width: width * 0.6}}>
                                    <TextTicker
                                      style={styles.propText}
                                      duration={6000}
                                      marqueeDelay={2000}
                                      repeatSpacer={width * 0.6}>
                                      {item.name == null
                                        ? 'Untitled'
                                        : item.name}
                                    </TextTicker>
                                  </View>
                                  <Text style={styles.buildingUnitCountText}>
                                    {item.unit_count} Units
                                  </Text>
                                </View>
                                {item.id == this.state.buildingId && (
                                  <View style={styles.buildingCheckContainer}>
                                    <Check
                                      name="check"
                                      size={width * 0.04}
                                      color="#fff"
                                    />
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    ) : (
                      <View style={styles.emptyBuildingContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text style={styles.emptyBuildingText}>
                            No buildings found add new building
                          </Text>
                          <Build
                            name="hand-point-right"
                            size={width * 0.04}
                            color="black"
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({buildModal: !this.state.buildModal})
                          }>
                          <Icon
                            name="plus-circle"
                            type="feather"
                            size={width * 0.06}
                            color={'#25AAE1ec'}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                ...styles.boxConatainer,
                height:
                  this.state.unitData.length != 0
                    ? height * 0.2
                    : height * 0.12,
              }}>
              <View style={styles.boxInner}>
                <View style={styles.unitsContainer}>
                  <View style={styles.unitsInnerContainer}>
                    <Home
                      name="house-user"
                      size={width * 0.04}
                      color="#115b72"
                    />
                    <Text style={styles.unitsText}>Units</Text>
                  </View>
                  {this.state.buildingId ? (
                    <TouchableOpacity
                      style={{zIndex: 1}}
                      onPress={this.handleAddUnit}>
                      <Icon
                        name="plus-circle"
                        type="feather"
                        size={width * 0.06}
                        color={'#25AAE1ec'}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{width: '100%'}}>
                  <View style={styles.currentReadContainer}>
                    {!this.state.buildingId ? (
                      <View style={styles.unitsDefaultView}>
                        <Text style={styles.unitsBuildingSelectText}>
                          Please select building
                        </Text>
                      </View>
                    ) : this.state.unitLoader ? (
                      <View style={styles.unitsLoaderContainer}>
                        <DotsLoader color="gray" />
                      </View>
                    ) : this.state.unitData.length != 0 ? (
                      <View style={[styles.filterUtility]}>
                        <FlatList
                          style={{width: width * 0.9}}
                          data={this._customSort(this.state.unitData)}
                          showsVerticalScrollIndicator={false}
                          numColumns={1}
                          initialNumToRender={this.state.unitData.length}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              onPress={() =>
                                !this.state.finish ? null : this.getUnitId(item)
                              }>
                              <View style={styles.unitsListContainer}>
                                <Home
                                  name="house-user"
                                  size={width * 0.04}
                                  color="#115b72"
                                />
                                <View style={{marginLeft: width * 0.01}}>
                                  <View style={{width: width * 0.6}}>
                                    <TextTicker
                                      style={styles.propText}
                                      duration={6000}
                                      marqueeDelay={2000}
                                      repeatSpacer={width * 0.6}>
                                      {item.name == null
                                        ? 'Untitled'
                                        : item.name}
                                    </TextTicker>
                                  </View>
                                  <View style={styles.unitsMeterContainer}>
                                    {item?.unit_meter?.length ? (
                                      item?.unit_meter?.map((item) => (
                                        // console.log('item--->meter', item),
                                        <Image
                                          source={this.typeSwitcher(
                                            item.meter_name,
                                          )}
                                          style={styles.unitsMeterImgStyle}
                                        />
                                      ))
                                    ) : (
                                      <Text style={styles.unitsNoMeterText}>
                                        No meters
                                      </Text>
                                    )}
                                  </View>
                                </View>
                                {item.id == this.state.unitId && (
                                  <View style={styles.unitsCheckContainer}>
                                    <Check
                                      name="check"
                                      size={width * 0.04}
                                      color="#fff"
                                    />
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    ) : (
                      <View style={styles.emptyunitsContainer}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.emptyUnitsText}>
                            No units found add new unit
                          </Text>
                          <Build
                            name="hand-point-right"
                            size={width * 0.04}
                            color="black"
                          />
                        </View>
                        <TouchableOpacity onPress={this.handleAddUnit}>
                          <Icon
                            name="plus-circle"
                            type="feather"
                            size={width * 0.06}
                            color={'#25AAE1ec'}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <EditUnit
            flag={this.state.flag}
            enableFlag={() => this.setState({flag: true})}
            disableFlag={() => this.setState({flag: false})}
            modalVisible={this.state.unitModal}
            type={this.state.unitModalType}
            propertyId={this.state.propertyId}
            modalName="Add meter"
            meterMenuVisible={this.state.editUnitMenuVisible}
            showMenu={() => this.setState({editUnitMenuVisible: true})}
            hideMenu={() => this.setState({editUnitMenuVisible: false})}
            closeModal={() => this.setState({unitModal: !this.state.unitModal})}
            reRun={this.handleFinishUnit}
            meterTypes={this.state.meterTypesList}
            buildingName={this.state.buildginName}
            buildingId={this.state.buildingId}
            unitDetails={this.state.unitDetails}
            itemPressHandle={() => this.setState({editUnitMenuVisible: false})}
          />
          <AddBuilding
            modalVisible={this.state.buildModal}
            type="meterDirect"
            modalName="New Building"
            closeModal={() => this.setState({buildModal: false})}
            reRun={this.handleAddBuilding}
            propertyId={this.state.propertyId}
          />
        </View>
      </>
    );
  }
}
