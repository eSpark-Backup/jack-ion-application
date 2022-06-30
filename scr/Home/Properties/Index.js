import React, { Component } from 'react';

import {
  Text,
  View,
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
  ScrollView,
  FlatList,
} from 'react-native';

//Packages
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput, Button } from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import ContextProp from './Context/propContext';
import CustumStatusBar from '../../components/StatusBar';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import { Fonts } from '../../utils/fonts';
import styles from './style';
import Filter from './Filter';
import Modal from 'react-native-modal';
import AddEditProperty from '../../components/modal/AddEditProperty';
import SystemSetting from 'react-native-system-setting';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import API from '../../api/SeviceApi';
const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      meter: false,
      isVisible: false,
      isAddPropVisible: false,
      // Loading: false,
      loadScreen: false,
      stopLoader: false,
      currentIndex: null,
      propertyList: null,
      showFilter: false,
      showSearch: false,
      filterWork: false,
      noInternet: false,
      locationBtn: '',
      markers: null,
      refreshing: false,
      isPullDownShow: true,
      shimmers: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
      ],
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    this.onFocusFunction();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.context.propList) {
        this.setState({ isPullDownShow: true });
        this.hidePullDown()
      }
    });
  }



  openFilter = () => {
    this.context.getBillingCompany();
    this.setState({ showFilter: true });
  };

  addToRecent = async (item) => {
    const userDataUnParsed = await AsyncStorage.getItem('users_data');
    const userId = await AsyncStorage.getItem('user_id');
    const userData = JSON.parse(userDataUnParsed);
    let index = userData
      .map((e) => {
        return e.id;
      })
      .indexOf(Number(userId));
    let ids = [...userData[index].recent_properties];
    let found = ids.includes(item.id);
    if (!found) {
      if (ids.length > 9) {
        ids.shift();
      }
      ids.push(item.id);
      const userDataUpdated = [...userData];
      userDataUpdated[index].recent_properties = ids;
      const jsonData = JSON.stringify(userDataUpdated);
      await AsyncStorage.setItem('users_data', jsonData);
    }
  };

  jumpToDetail = async ({ prop, item }) => {
    this.props.navigation.navigate('Detail', { item });
    this.addToRecent(prop.item);
    this.selectedProp(prop);
    this.setState({ showSearch: false });
  };
  jumpFromSearch = ({ prop, item }) => {
    this.props.navigation.navigate('Detail', { item });
    this.setState({ showSearch: false });
  };
  jumpToEquip = ({ prop, item }) => {
    this.props.navigation.navigate('Equip', { item });
    this.addToRecent(prop.item);
    this.selectedProp(prop);
  };
  jumpToAlerts = ({ prop, item }) => {
    this.props.navigation.navigate('Alerts', { item });
    this.addToRecent(prop.item);
    this.selectedProp(prop);
  };

  selectedProp = (prop) => {
    this.setState({
      currentIndex: prop.index === this.state.currentIndex ? null : prop.index,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  LoadData = async () => {
    await this.context.loadMoreData();
  };

  cleardata = (prop) => {
    this.jumpToDetail({ prop, item: prop });
    this.context.clearData();
  };

  closeAndClear = () => {
    this.setState({ showSearch: false });
    this.context.clearSearchList();
  };
  openAndClear = () => {
    this.setState({ showSearch: true });
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
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        // this.setState({lat: lat, long: long, iniLat: lat, iniLong: long});

        this.setState(
          {
            markers: {
              lat: lat,
              lng: long,
            },
          },
          () => {
            this.context.stopLoader();
            this.setState({ isAddPropVisible: true });
          },
        );
      },
      (error) => console.log('geo location', error),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    );
  };

  enableLocation = async () => {
    this.context.loadLoader();
    const location = await SystemSetting.isLocationEnabled();
    Geocoder.init('AIzaSyAVCQa1ZgYSuqHfZLIkhMQ_C6W5L5Wi42A');
    if (!location) {
      this.context.stopLoader();
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
              // this.fetchAddressData(locationName);
              this.setState({
                locationBtn: locationName,
              });
            })
            .catch((error) => console.warn(error));
        },
        (error) => console.log('geo locations', error),
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
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
      this.context.stopLoader();
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
    this.setState({ isAddPropVisible: true });
  };

  closeAddProp = () => {
    this.setState({ isAddPropVisible: false });
  };

  confirmDelete = (id) => {
    Alert.alert('Delete Property', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => this.deleteProperty(id) },
    ]);
  };

  deleteProperty = async (id) => {
    this.context.loadLoader();
    const response = await API.post(`/property/delete/${id}`);
    if (response?.data?.bool) {
      this.setState({ currentIndex: null });
      alert(response?.data?.message);
      this.context.checkData();
      this.setState({ propertyList: this.context.propList });
    } else {
      this.context.stopLoader();
    }
  };

  _renderSearchPropList = (prop) => (
    <TouchableOpacity
      style={styles.propButton}
      onPress={() => this.jumpFromSearch({ prop, item: prop })}>
      <MaterialCommunityIcons
        name="home-city-outline"
        size={width * 0.09}
        color="#115b72"
      />
      <View>
        <View style={{ width: width * 0.6 }}>
          <TextTicker
            style={styles.propText}
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.6}>
            {prop.item.name == null ? 'Untitled' : prop.item.name}
          </TextTicker>
        </View>

        <View style={{ width: width * 0.6 }}>
          <TextTicker
            style={{ color: 'gray' }}
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

      <MaterialCommunityIcons
        name="signal-cellular-outline"
        size={height * 0.04}
        color="#115b72"
      />
    </TouchableOpacity>
  );

  renderShimmers = (item) => (
    <View key={item.id} style={styles.skeletonMainContainer}>
      <SkeletonPlaceholder>
        <View style={styles.skeletonInnerContainer}>
          <View style={styles.skeletonIcon} />
          <View>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonDescription} />
          </View>
          <View style={styles.skeletonEquipsContainer}>
            <View style={styles.skeletonBuilds} />
            <View style={styles.skeletonUnits} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
  _renderPropList = (prop) => {
    if (
      prop.index == this.context.propList.length - 1 &&
      !this.state.stopLoader
    ) {
      this.setState({ stopLoader: true });
    }
    return (
      <View
        style={styles.propListContainer}>
        <TouchableOpacity
          style={{
            ...styles.propButton,
            borderBottomLeftRadius:
              prop.index === this.state.currentIndex ? 0 : width * 0.008,
            borderBottomRightRadius:
              prop.index === this.state.currentIndex ? 0 : width * 0.008,
          }}
          onPress={() => this.selectedProp(prop)}>
          <MaterialCommunityIcons
            name="home-city-outline"
            size={width * 0.09}
            color="#115b72"
          />
          <View>
            <View style={{ width: width * 0.6 }}>
              <TextTicker
                style={styles.propText}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.6}>
                {prop.item.name == null ? 'Untitled' : prop.item.name}
              </TextTicker>
            </View>
            <View style={{ width: width * 0.6 }}>
              <TextTicker
                style={{ color: 'gray' }}
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
          <View style={{ flexDirection: 'row' }}>
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
              <Text style={styles.buildUnitCount}>
                {prop.item.unit_actual_count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {prop.index === this.state.currentIndex ? (
          <View
            style={styles.animatedView}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.animatedViewDetailBtn}
                onPress={() => this.jumpToDetail({ prop, item: prop })}>
                <MaterialCommunityIcons
                  name="view-compact-outline"
                  color="white"
                  size={width * 0.04}
                />
                <Text
                  style={styles.animatedViewDetailBtnName}>
                  Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.jumpToEquip({ prop, item: prop })}
                style={styles.animatedViewDetailBtn}>
                <MaterialIcons name="edit" color="white" size={width * 0.04} />
                <Text
                  style={styles.animatedViewDetailBtnName}>
                  Equipments
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.jumpToAlerts({ prop, item: prop })}
                style={styles.animatedViewDetailBtn}>
                <Feather
                  name="alert-triangle"
                  color="white"
                  size={width * 0.04}
                />
                <Text
                  style={styles.animatedViewDetailBtnName}>
                  Alerts
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => this.confirmDelete(prop?.item?.id)}
              style={styles.animatedViewDetailBtn}>
              <MaterialCommunityIcons
                name="delete-outline"
                color="white"
                size={width * 0.04}
              />
              <Text
                style={styles.animatedViewDetailBtnName}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  onFocusFunction = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({ noInternet: !state.isInternetReachable });
      if (state.isConnected) {
        this.closeAddProp();
        this.context.checkData();
        this.setState({ propertyList: this.context.propList });
        this.setState({ loadScreen: true, });
      } else {
        this.setState({ loadScreen: true });
      }
      this.context.dontLoad();
    });
    unsubscribe();
  };
  onRefresh = async () => {
    this.setState({ fetching: true, });
    await this.sleep(2000);
    this.setState({ fetching: false, isPullDownShow: true });
    this.context.checkData();
    this.setState({ loadScreen: true });
  };
  hidePullDown = () => {
    setTimeout(() => {
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
      this.setState({ isPullDownShow: false })
    }, 5000);
  }

  render() {
    if (!this.context.isLoading && this.state.loadScreen) {
      this.setState({ loadScreen: false });
      this.hidePullDown()
    }
    if (!this.context.filterWork && this.state.filterWork) {
      this.setState({ filterWork: false });
    }
    return (
      <>
        <CustumStatusBar />
        <View style={styles.container}>
          {/* {this.context.isLoading && <Loader />} */}
          <AddEditProperty
            modalVisible={this.state.isAddPropVisible}
            closeModal={this.closeAddProp}
            currLocate={this.state.markers}
            currAddr={this.state.locationBtn}
            addedSuccessfully={this.onFocusFunction}
            type={'Add'}
          />
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
                    <Text style={{ color: 'white', paddingLeft: width * 0.035 }}>
                      Search
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={this.openFilter}
                  style={styles.filterButton}>
                  <MaterialCommunityIcons
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
            {/* <Add loader={this.handleLoader} /> */}
            <View style={styles.headingInner}>
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
              <MaterialCommunityIcons
                name="home-city-outline"
                size={width * 0.08}
                color="white"
              />
              <Text style={styles.mainHeadiing}>Properties</Text>
            </View>
            <Filter
              type="Properties"
              isVisible={this.state.showFilter}
              close={() => this.setState({ showFilter: !this.state.showFilter })}
              filterWork={() => this.setState({ filterWork: true })}
            />
            {this.state.showSearch ? (
              <Modal
                statusBarTranslucent={true}
                animationIn={'flash'}
                isVisible={this.state.showSearch}
                style={styles.searchModalContainer}>
                {Platform.OS == 'ios' && (
                  <CustumStatusBar backColor transparent />
                )}
                <KeyboardAvoidingView
                  style={{ alignItems: 'center' }}
                  behavior="padding">
                  <View style={styles.searchModalInner}>
                    {/* <View style={styles.searchModalInput}> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <EvilIcon
                        name="search"
                        size={width * 0.07}
                        color="white"
                      />
                      <TextInput
                        selectionColor={'#fff'}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        autoFocus={true}
                        dense={true}
                        placeholderTextColor="white"
                        placeholder="Search"
                        mode="flat"
                        style={{
                          ...styles.search,
                          height: width * 0.1,
                        }}
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
                    </View>
                    {/* </View> */}
                    <View style={{ position: 'absolute', right: width * 0.1 }}>
                      {this.context.searchLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : null}
                    </View>
                    <TouchableOpacity onPress={this.closeAndClear}>
                      <MaterialCommunityIcons
                        name="close"
                        color="white"
                        size={width * 0.055}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchList}>
                    <FlatList
                      style={{ marginBottom: width * 0.2 }}
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

            {this.state.noInternet ? (
              <Text>Check Your Internet Connection</Text>
            ) : this.context.isLoading ? (
              <ScrollView
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}>
                {this.state.shimmers.map((item) => this.renderShimmers(item))}
              </ScrollView>
            ) : this.context.propList.length < 1 && !this.context.isLoading ? (
              <Text>No Properties to Show</Text>
            ) : (
              <View>
                <View style={[styles.pullDownContainer, { height: this.state.isPullDownShow ? height * .07 : height * 0, }]}>
                  <Icon name="ios-arrow-down-sharp" color="black" size={height * 0.03} />
                  {/* <MaterialIcons name="edit" color="white" size={width * 0.04} /> */}
                  <Text style={styles.pullDownText}>Pull down to refresh</Text>
                </View>
                <FlatList
                  data={this.context.propList}
                  renderItem={this._renderPropList}
                  removeClippedSubviews={false}
                  maxToRenderPerBatch={150}
                  windowSize={100}
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshing}
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
              </View>
            )}
          </View>
        </View>
      </>
    );
  }
}
