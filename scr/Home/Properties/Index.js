import React, { Component } from 'react';

import {
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
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button } from 'react-native-paper';
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
import { connect } from 'react-redux';
import { fetchPropetry, loadMoreData } from '../../Store/Action/properties.action';

import TextReuseableComponent from '../../components/Text/index';
import Loader from '../../components/Loader';
import Properties from '../../components/properties';

const { width, height } = Dimensions.get('window');

class Property extends Component {
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
    this.props?.fetchPropetry();
    this.onFocusFunction();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.context.propList) {
        this.setState({ isPullDownShow: true });
        this.hidePullDown();
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
    let data = {
      offset: this.props.offset,
      search: this.context.filterPropName,
      location: this.context.filterLocation,
    };
    this.props.loadMoreData(data)
    // await this.context.loadMoreData();
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
        // this.setState({lat: lat, long: long, iniLat:loadLoader lat, iniLong: long});

        this.setState(
          {
            markers: {
              lat: lat,
              lng: long,
            },
          },
          () => {
            this.context.stopLoader();
            this.setState({ Loading: false });
            this.setState({ isAddPropVisible: true });
          },
        );
      },
      (error) => console.log('geo location', error),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    );
  };

  enableLocation = async () => {
    this.setState({ Loading: true });
    const location = await SystemSetting.isLocationEnabled();
    Geocoder.init('AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s');
    if (!location) {
      this.setState({ Loading: false });
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
      this.setState({ Loading: false });
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
      // this.context.checkData();
      this.props?.fetchPropetry();
      this.setState({ propertyList: this.context.propList });
    } else {
      this.context.stopLoader();
    }
  };

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
      prop.index == this.props.propList.length - 1 &&
      !this.state.stopLoader
    ) {
      this.setState({ stopLoader: true });
    }
    return (
      <View style={styles.propListContainer}>
        <Properties
          prop={prop}
          routerIcon={false}
          warningIcon={false}
          jumpFromSearch={null}
          selectedProp={this.selectedProp}
          currentIndex={this.state.currentIndex}
          jumpToDetail={this.jumpToDetail}
          jumpToEquip={this.jumpToEquip}
          jumpToAlerts={this.jumpToAlerts}
          confirmDelete={this.confirmDelete}
        />
      </View>
    );
  };

  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  onFocusFunction = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("state", state.isInternetReachable)
      this.setState({ noInternet: !state.isInternetReachable });
      if (state.isConnected) {
        this.closeAddProp();
        // this.context.checkData();
        this.setState({ propertyList: this.context.propList });
        this.setState({ loadScreen: true });
      } else {
        this.setState({ loadScreen: true });
      }
      this.context.dontLoad();
    });
    unsubscribe();
  };
  onRefresh = async () => {
    this.setState({ fetching: true });
    await this.sleep(2000);
    this.setState({ fetching: false, isPullDownShow: true });
    // this.context.checkData();
    this.props?.fetchPropetry();
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
      this.setState({ isPullDownShow: false });
    }, 5000);
  };

  render() {
    // console.log('this.props.isLoading', this.props.isLoading);
    if (!this.props.isLoading && this.state.loadScreen) {
      this.setState({ loadScreen: false });
      this.hidePullDown();
    }
    if (!this.context.filterWork && this.state.filterWork) {
      this.setState({ filterWork: false });
    }
    return (
      <>
        <CustumStatusBar />
        <View style={styles.container}>
          {this.state.Loading && <Loader />}
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
                    <TextReuseableComponent title style={{ color: 'white', paddingLeft: width * 0.035 }} value={"Search"} />
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
            <View style={styles.headingInner}>
              <TouchableOpacity
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
              <TextReuseableComponent title style={styles.mainHeadiing} value={"Properties"} />
            </View>
            <Filter
              type="Properties"
              isVisible={this.state.showFilter}
              close={() => this.setState({ showFilter: false })}
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
                      renderItem={(item) => {
                        return <Properties
                          prop={item}
                          routerIcon={true}
                          warningIcon={false}
                          jumpFromSearch={this.jumpFromSearch}
                          selectedProp={null}
                          currentIndex={null}
                          jumpToDetail={this.jumpToDetail}
                          jumpToEquip={this.jumpToEquip}
                          jumpToAlerts={this.jumpToAlerts}
                          confirmDelete={this.confirmDelete}
                        />
                      }}
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
              <TextReuseableComponent title value={"Check Your Internet Connection"} />
            ) : this.props.isLoading ? (
              <ScrollView
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}>
                {this.state.shimmers.map((item) => this.renderShimmers(item))}
              </ScrollView>
            ) : this.props.propList.length < 1 && !this.props.isLoading ? (
              <TextReuseableComponent title value={"No Properties to Show"} />
            ) : (
              <View>
                <View style={[styles.pullDownContainer, { height: this.state.isPullDownShow ? height * .07 : height * 0, }]}>
                  <Icon name="ios-arrow-down-sharp" color="black" size={height * 0.03} />
                  <TextReuseableComponent title style={styles.pullDownText} value={"Pull down to refresh"} />
                </View>
                <FlatList
                  data={this.props.propList}
                  renderItem={this._renderPropList}
                  removeClippedSubviews={false}
                  maxToRenderPerBatch={150}
                  windowSize={100}
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshing}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={() =>
                    this.props.listLoader ? (
                      <ActivityIndicator color="#25dAE1" size="large" />
                    ) : null
                  }
                  onEndReachedThreshold={width * 0.0001}
                  onMomentumScrollEnd={() => this.LoadData()}
                // onEndReached={() => this.LoadData()}
                />
              </View>
            )}
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  propList: state.propertyReducer.propList,
  isLoading: state.propertyReducer.isLoading,
  offset: state.propertyReducer.offset,
  listLoader: state.propertyReducer.listLoader,
  limitExceed: state.propertyReducer.limitExceed

});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    fetchPropetry: () => dispatch(fetchPropetry()),
    loadMoreData: (data) => dispatch(loadMoreData(data)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);
