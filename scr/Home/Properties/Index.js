import React, {Component, version} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {TextInput, Button} from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import ContextProp from './Context/propContext';
import clc from 'cli-color';
import CustumStatusBar from '../../components/StatusBar';
import NetInfo from '@react-native-community/netinfo';

// Components
import Add from './Form';
import {Fonts} from '../../utils/fonts';
import styles from './style';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import Filter from './Filter';
import Modal from 'react-native-modal';
import AddEditProperty from '../../components/modal/AddEditProperty';
import SystemSetting from 'react-native-system-setting';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      meter: false,
      isVisible: false,
      isAddPropVisible: false,
      Loading: false,
      loadScreen: false,
      stopLoader: false,
      currentIndex: null,
      propertyList: null,
      showFilter: false,
      showSearch: false,
      filterWork: false,
      noInternet: false,
      locationBtn: '',
      markers: [],
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  onFocusFunction = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log('isInternetReachable?', state.isInternetReachable);

      this.setState({noInternet: !state.isInternetReachable});
      if (state.isConnected) {
        console.log('True chala');
        this.setState({loadScreen: true});
        this.context.checkData();
        this.setState({propertyList: this.context.propList});
      } else {
        console.log('False chala');
        this.setState({loadScreen: true});
      }
    });
    unsubscribe();
  };

  openFilter = () => {
    this.context.getBillingCompany();
    this.setState({showFilter: true});
  };

  jumpToDetail = ({prop, item}) => {
    this.props.navigation.navigate('Detail', {item});
    this.selectedProp(prop);
    this.setState({showSearch: false});
  };
  jumpFromSearch = ({prop, item}) => {
    this.props.navigation.navigate('Detail', {item});
    this.setState({showSearch: false});
  };
  jumpToEquip = ({prop, item}) => {
    this.props.navigation.navigate('Equip', {item});
    this.selectedProp(prop);
  };

  handleLoader = (child) => {
    this.setState({loadScreen: true});
  };
  selectedProp = (prop) => {
    this.setState({
      currentIndex: prop.index === this.state.currentIndex ? null : prop.index,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  LoadData = async () => {
    // console.log('End reached');
    await this.context.loadMoreData();
  };

  cleardata = (prop) => {
    this.jumpToDetail({prop, item: prop});
    this.context.clearData();
  };

  closeAndClear = () => {
    this.setState({showSearch: false});
    this.context.clearSearchList();
  };
  openAndClear = () => {
    this.setState({showSearch: true});
    this.context.clearSearchList();
  };

  turnLocationOn = () => {
    if (Platform.OS == 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else if (Platform.OS == 'android') {
      SystemSetting.switchLocation();
    }
  };

  _renderMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Positon Batao', position);
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        // this.setState({lat: lat, long: long, iniLat: lat, iniLong: long});

        this.setState({
          markers: [
            {
              coordinate: {
                latitude: lat,
                longitude: long,
              },
            },
          ],
        });
        console.log('What we Get', this.state.markers);
        this.setState({isAddPropVisible: true});
      },
      (error) => console.log('geo location', error),
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };

  enableLocation = async () => {
    const location = await SystemSetting.isLocationEnabled();
    console.log('GPS', location);
    // this.getToken();
    Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');
    if (!location) {
      Alert.alert('Enable Loaction', 'Kindly TurnOn Location to Add Meter', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: this.turnLocationOn,
        },
      ]);
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          var lat = parseFloat(position.coords.latitude);
          var long = parseFloat(position.coords.longitude);
          // this.setState({lat: lat, long: long});
          Geocoder.from({
            latitude: lat,
            longitude: long,
          })
            .then((json) => {
              var locationName = json.results[0].formatted_address;
              console.log('LOACTION NAME', locationName);
              // this.fetchAddressData(locationName);
              this.setState({
                locationBtn: locationName,
              });
            })
            .catch((error) => console.warn(error));
        },
        (error) => console.log('geo locations', error),
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
      );
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

      this._renderMap();
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

  openAddProp = () => {
    this.setState({isAddPropVisible: true});
  };

  closeAddProp = () => {
    this.setState({isAddPropVisible: false});
  };

  _renderSearchPropList = (prop) => (
    <TouchableOpacity
      style={styles.propButton}
      onPress={() => this.jumpFromSearch({prop, item: prop})}>
      <MaterialCommunityIcon
        name="home-city-outline"
        size={width * 0.09}
        color="#115b72"
      />
      <View>
        <View style={{width: width * 0.6}}>
          <TextTicker
            style={styles.propText}
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.6}>
            {prop.item.name == null ? 'Untitled' : prop.item.name}
          </TextTicker>
        </View>

        <View style={{width: width * 0.6}}>
          <TextTicker
            style={{color: 'gray'}}
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.6}>
            {(prop.item.street == null ? '' : prop.item.street + ', ') +
              (prop.item.st == null ? '' : prop.item.st + ', ') +
              (prop.item.city == null ? '' : prop.item.city + ', ') +
              (prop.item.zipcode == null ? '' : prop.item.zipcode)}
          </TextTicker>
        </View>
      </View>

      <MaterialCommunityIcon
        name="signal-cellular-outline"
        size={height * 0.04}
        color="#115b72"
      />
    </TouchableOpacity>
  );

  _renderPropList = (prop) => {
    if (
      prop.index == this.context.propList.length - 1 &&
      !this.state.stopLoader
    ) {
      this.setState({stopLoader: true});
      // console.log(clc.green('agayayaaa_____'));
      this.setState({Loading: false});
    }
    return (
      <View
        style={{
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.propButton}
          onPress={() => this.selectedProp(prop)}>
          <MaterialCommunityIcon
            name="home-city-outline"
            size={width * 0.09}
            color="#115b72"
          />
          <View>
            <View style={{width: width * 0.6}}>
              <TextTicker
                style={styles.propText}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.6}>
                {prop.item.name == null ? 'Untitled' : prop.item.name}
              </TextTicker>
            </View>
            <View style={{width: width * 0.6}}>
              <TextTicker
                style={{color: 'gray'}}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.6}>
                {(prop.item.street == null ? '' : prop.item.street + ', ') +
                  (prop.item.st == null ? '' : prop.item.st + ', ') +
                  (prop.item.city == null ? '' : prop.item.city + ', ') +
                  (prop.item.zipcode == null ? '' : prop.item.zipcode)}
              </TextTicker>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.buildUnitCountContainer}>
              <FontAwesome5Icon
                name="building"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={styles.buildUnitCount}>
                {prop.item.building_count}
              </Text>
            </View>
            <View style={styles.buildUnitCountContainer}>
              <FontAwesome5Icon
                name="house-user"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={styles.buildUnitCount}>{prop.item.unit_count}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {prop.index === this.state.currentIndex ? (
          <View style={styles.dropView}>
            <TouchableOpacity
              onPress={() => this.jumpToDetail({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={styles.linearGradient}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text style={styles.gradienttext}>Property Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.jumpToEquip({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={styles.linearGradient}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text style={styles.gradienttext}>Property Units</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    if (!this.context.isLoading && this.state.loadScreen) {
      this.setState({loadScreen: false});
      this.setState({Loading: true});
    }
    if (!this.context.filterWork && this.state.filterWork) {
      this.setState({filterWork: false});
    }
    return (
      <>
        <CustumStatusBar />
        <View style={styles.container}>
          {this.context.isLoading && <Loader />}
          <AddEditProperty
            modalVisible={this.state.isAddPropVisible}
            closeModal={this.closeAddProp}
            currLocate={this.state.markers}
            currAddr={this.state.locationBtn}
            type={'Add'}
          />
          {/* <StatusBar hidden backgroundColor="white" barStyle="dark-content" /> */}
          {/* <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.menuView}>
                <MaterialIcon
                  size={width * 0.08}
                  color="white"
                  name="keyboard-backspace"
                />
              </TouchableOpacity>
              <View style={styles.searchView}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.searchButton}
                  onPress={this.openAndClear}>
                  <EvilIcon
                    name="search"
                    size={height * 0.04}
                    style={{ marginLeft: width * 0.05 }}
                    color="white"
                  />
                  <TextInput
                    disabled={true}
                    underlineColor="transparent"
                    dense={true}
                    placeholderTextColor="white"
                    placeholder="Search"
                    style={styles.search}
                    onChangeText={(e) => this.context.searchProperties(e)}
                    theme={{
                      colors: {
                        text: 'white',
                        primary: '#25dAE1',
                        selectionColor: 'transparent',
                        background: 'transparent',
                      },
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.openFilter}
                  style={styles.filterButton}>
                  <MaterialCommunityIcon
                    name="filter-outline"
                    color={this.state.filterWork ? '#25AAE1ec' : 'black'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View> */}

          <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.menuView}>
                <MaterialIcon
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
                    onPress={this.openAndClear}>
                    <EvilIcon
                      name="search"
                      size={height * 0.04}
                      color="white"
                    />
                    <Text style={{color: 'white'}}>Search</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={this.openFilter}
                  style={styles.filterButton}>
                  <MaterialCommunityIcon
                    name="filter-outline"
                    color={this.state.filterWork ? '#25AAE1ec' : 'black'}
                    size={width * 0.05}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Notifications')}
                style={{
                  width: width * 0.15,
                  height: width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#25AAE1ec',
                  borderBottomLeftRadius: width * 0.1,
                  borderTopLeftRadius: width * 0.1,
                  elevation: width * 0.01,
                }}>
                <MaterialIcon
                  size={width * 0.07}
                  color="white"
                  name="notifications"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headingContainer}>
            <Add loader={this.handleLoader} />
            {/* <View style={styles.headingInner}>
              <TouchableOpacity
                // onPress={this.openAddProp}
                onPress={() => this.enableLocation()}
                style={styles.addBotton}>
                <MaterialIcon
                  name="add"
                  size={width * 0.06}
                  color="black"
                  maxOpacity={0.5}
                />
              </TouchableOpacity>
              <MaterialCommunityIcon
                name="home-city-outline"
                size={width * 0.08}
                color="white"
              />
              <Text style={styles.mainHeadiing}>Properties</Text>
            </View> */}
            <Filter
              type="Properties"
              isVisible={this.state.showFilter}
              close={() => this.setState({showFilter: !this.state.showFilter})}
              filterWork={() => this.setState({filterWork: true})}
            />
            {this.state.showSearch ? (
              <Modal
                statusBarTranslucent={true}
                isVisible={this.state.showSearch}
                style={styles.searchModalContainer}>
                {Platform.OS == 'ios' && (
                  <CustumStatusBar backColor transparent />
                )}
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.searchModalInner}>
                    {/* <View style={styles.searchModalInput}> */}
                    <EvilIcon name="search" size={width * 0.07} color="white" />
                    <TextInput
                      underlineColor="transparent"
                      autoFocus={true}
                      dense={true}
                      placeholderTextColor="white"
                      placeholder="Search"
                      style={styles.search}
                      onChangeText={(e) => this.context.searchProperties(e)}
                      theme={{
                        colors: {
                          text: 'white',
                          primary: '#25dAE1',
                          selectionColor: 'transparent',
                          background: 'transparent',
                        },
                      }}
                    />
                    {/* </View> */}
                    <View style={{position: 'absolute', right: width * 0.1}}>
                      {this.context.searchLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : null}
                    </View>
                    <TouchableOpacity onPress={this.closeAndClear}>
                      <MaterialCommunityIcon
                        name="close"
                        color="white"
                        size={width * 0.055}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchList}>
                    <FlatList
                      style={{marginBottom: width * 0.2}}
                      data={this.context.searchList}
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
          </View>
          <View style={styles.propertyList}>
            {this.context.propList.length < 1 && !this.context.isLoading ? (
              this.state.noInternet ? (
                <Text>Check Your Internet Connection</Text>
              ) : (
                <Text>No Properties to Show</Text>
              )
            ) : (
              <FlatList
                data={this.context.propList}
                renderItem={this._renderPropList}
                removeClippedSubviews={false}
                maxToRenderPerBatch={150}
                windowSize={100}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() =>
                  this.context.listLoader ? (
                    <ActivityIndicator color="#25dAE1" size="large" />
                  ) : null
                }
                onEndReachedThreshold={width * 0.0001}
                onEndReached={() => this.LoadData()}
              />
            )}
          </View>
        </View>
      </>
    );
  }
}
