import React, { Component, Fragment, version } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TextInput,
  Animated,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Alert,
  FlatList
} from 'react-native';

//Packages
import { Header, Button, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Build from 'react-native-vector-icons/FontAwesome5';
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Tool from 'react-native-vector-icons/Entypo';
import Unit from 'react-native-vector-icons/Ionicons';
import Cast from 'react-native-vector-icons/Feather';
import Home from 'react-native-vector-icons/FontAwesome5';
import Scan from 'react-native-vector-icons/Ionicons';
import Test from 'react-native-vector-icons/Entypo';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import Base_URL from '../../../../../api/WebServices';
import { create } from 'apisauce';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../../../../components/Loader';
import ContextProp from '../../../Context/propContext';
import TextTicker from 'react-native-text-ticker';

import Modal from 'react-native-modal';

// Components
import { Fonts } from '../../../../../utils/fonts';

import styles from './style';
import style from './style';
const { width, height } = Dimensions.get('window');

export default class RedirectMeter extends Component {
  // static navigationOptions = {
  //   title: 'Tools',
  //   tabBarIcon: ({tintColor}) => (
  //     <TabIcon name="toolbox" color={tintColor} size={height * 0.033} />
  //   ),
  // };
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isVisible: false,
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
      showMore: ''
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

  onFocusFunction = () => {
    this.getToken()
  };

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({ token: token });
      this.api = create({
        baseURL: Base_URL,
        headers: { Authorization: 'Bearer ' + token },
      });
      this.setState({ loader: false });
    }
  };

  searchProperties = async (e) => {
    this.setState({ loadFor: e });
    let data = {
      offset: 0,
      search: e,
    };
    if (e) {
      this.setState({ searchLoading: true });
      const response = await this.api.post('/property/all', data);
      console.log('Search property===>', response);
      this.setState({ searchOffset: response.data.data.offset });
      if (response?.data?.bool) {
        this.setState({ propertyList: response.data.data.properties });
        // console.log('Search property===>', response.data.data.properties);
        this.setState({ searchLoading: false });
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({ searchLoading: false });
      }
    } else {
      this.setState({ propertyList: [] });
    }
  };
  loadSearchData = async () => {
    this.setState({ searchLoading: true });
    let prop = {
      offset: this.state.searchOffset,
      search: this.state.loadFor,
    };
    if (this.state.loadFor) {
      this.setState({ searchLoading: true });
      const response = await this.api.post('/property/all', prop);
      console.log('Search more property===>', response);
      if (response?.data?.bool) {
        if (
          this.state.searchOffset != response.data.data.offset &&
          response.data.data.offset > 0
        ) {
          let data = [...this.state.propertyList];
          let data2 = response.data.data.properties;
          data.push(...data2);
          this.setState({ propertyList: data });
          this.setState({
            searchLoading: false,
            searchOffset: response.data.data.offset,
          });
        }
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({ searchLoading: false });
      }
    } else {
      this.setState({ propertyList: [] });
    }
  };

  checkData = async () => {
    this.setState({ loader: true });
    let data = {
      offset: 0,
    };
    const response = await this.api.post('/property/all', data);
    this.setState({
      success: response.data.bool,
      offset: response.data.data.offset,
    });
    if (response?.data?.bool) {
      this.setState({ propertyList: response.data.data.properties });
      this.setState({ limitExceed: false });
      this.setState({ loader: false });
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({ loader: false });
    }
  };

  loadMoreData = async () => {
    if (!this.state.limitExceed) {
      this.setState({ propertyListLoader: true });
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
        this.setState({ propList: data });
        // console.log('new array', data);
        this.setState({ propertyListLoader: false, offset: response.data.data.offset });
        this.setState({ limitExceed: false });
      } else {
        this.setState({ limitExceed: true });
        this.setState({ propertyListLoader: false });
      }
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({ propertyListLoader: false });
    }
  };

  getItemId = async (id) => {
    console.log('prpertyese if--->', id)

  }


  render() {
    return (
      <View style={styles.container}>
        {this.state.loader ? <Loader /> : null}
        <Header
          leftComponent={{
            text: 'Close',
            style: { fontSize: width * 0.05, color: '#000' },
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: width * 0.05 }}>Add meter directly</Text>
            </View>
          }
          backgroundColor="#fff"
          containerStyle={{ borderBottomWidth: width * 0.003, elevation: 1 }}
        />
        <View
          style={{
            ...styles.boxConatainer,
            height: this.state.propertyList.length != 0 ? height * 0.3 : height * 0.12,
          }}>
          <View style={styles.boxInner}>
            <View
              style={{
                width: '100%',
                height: '20%',
                borderBottomWidth: 0.5,
                paddingLeft: width * 0.02,
                paddingVertical: width * .04,
                alignItems: 'center',
                flexDirection: 'row'
              }}>
              <Properties
                name="home-city-outline"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={{ fontSize: width * 0.04, fontFamily: Fonts.Montserrat, marginLeft: width * .02 }}>Properties</Text>
            </View>
            <View style={{ width: '100%' }}>
              <View style={styles.currentReadContainer}>
                <View style={styles.inputFilterView}>
                  <Text style={styles.filterListText}>Search:</Text>
                  <TextInput
                    style={{ width: width * 0.3 }}
                    value={this.state.loadFor}
                    onChangeText={(e) => this.searchProperties(e)}
                  />
                  {this.state.searchLoading ?
                    <ActivityIndicator color="gray" size="small" style={{ position: 'absolute', right: width * .03 }} />
                    : null}
                </View>
                {this.state.propertyList.length != 0 ? (
                  <View style={styles.filterUtility}>
                    <FlatList
                      style={{ width: width * .8, }}
                      data={this.state.propertyList}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => this.getItemId(item.id)}
                        >
                          <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: width * .002,
                            paddingVertical: width * 0.02,
                            // backgroundColor: 'gray'
                          }}>
                            <Properties
                              name="home-city-outline"
                              size={width * 0.04}
                              color="#115b72"
                            />
                            <View style={{ marginLeft: width * .01 }}>
                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={styles.propText}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {item.name == null ? 'Untitled' : item.name}
                                </TextTicker>
                              </View>

                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={{ color: 'gray', fontSize: width * .03 }}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {(item.street == null ? '' : item.street + ', ') +
                                    (item.st == null ? '' : item.st + ', ') +
                                    (item.city == null ? '' : item.city + ', ') +
                                    (item.zipcode == null ? '' : item.zipcode)}
                                </TextTicker>
                              </View>
                            </View>
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
            height: this.state.propertyList.length != 0 ? height * 0.3 : height * 0.12,
          }}>
          <View style={styles.boxInner}>
            <View
              style={{
                width: '100%',
                height: '20%',
                borderBottomWidth: 0.5,
                paddingLeft: width * 0.02,
                paddingVertical: width * .04,
                alignItems: 'center',
                flexDirection: 'row'
              }}>
              <Build
                name="building"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={{ fontSize: width * 0.04, fontFamily: Fonts.Montserrat, marginLeft: width * .02 }}>Buildings</Text>
            </View>
            <View style={{ width: '100%' }}>
              <View style={styles.currentReadContainer}>
                {this.state.propertyList.length != 0 ? (
                  <View style={styles.filterUtility}>
                    <FlatList
                      style={{ width: width * .8, }}
                      data={this.state.propertyList}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => this.getItemId(item.id)}
                        >
                          <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: width * .002,
                            paddingVertical: width * 0.02,
                            // backgroundColor: 'gray'
                          }}>
                            <Build
                              name="building"
                              size={width * 0.04}
                              color="#115b72"
                            />
                            <View style={{ marginLeft: width * .01 }}>
                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={styles.propText}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {item.name == null ? 'Untitled' : item.name}
                                </TextTicker>
                              </View>

                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={{ color: 'gray', fontSize: width * .03 }}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {(item.street == null ? '' : item.street + ', ') +
                                    (item.st == null ? '' : item.st + ', ') +
                                    (item.city == null ? '' : item.city + ', ') +
                                    (item.zipcode == null ? '' : item.zipcode)}
                                </TextTicker>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      onEndReachedThreshold={width * 0.0001}
                      onEndReached={() => this.loadSearchData()}
                    />
                  </View>
                ) :
                  <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: height * .07
                  }}>
                    <View style={{
                      flexDirection: 'row',
                    }}>
                      <Text style={{
                        marginHorizontal: width * .03,
                        fontSize: width * .03,
                        fontFamily: Fonts.Montserrat
                      }}>
                        No building found add new building
                      </Text>
                      <Build
                        name="hand-point-right"
                        size={width * 0.04}
                        color="black"
                      />
                    </View>

                  </View>
                }
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            ...styles.boxConatainer,
            height: this.state.propertyList.length != 0 ? height * 0.3 : height * 0.12,
          }}>
          <View style={styles.boxInner}>
            <View
              style={{
                width: '100%',
                height: '20%',
                borderBottomWidth: 0.5,
                paddingLeft: width * 0.02,
                paddingVertical: width * .04,
                alignItems: 'center',
                flexDirection: 'row'
              }}>
              <Home
                name="house-user"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={{ fontSize: width * 0.04, fontFamily: Fonts.Montserrat, marginLeft: width * .02 }}>Properties</Text>
            </View>
            <View style={{ width: '100%' }}>
              <View style={styles.currentReadContainer}>
                {this.state.propertyList.length != 0 ? (
                  <View style={styles.filterUtility}>
                    <FlatList
                      style={{ width: width * .8, }}
                      data={this.state.propertyList}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => this.getItemId(item.id)}
                        >
                          <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: width * .002,
                            paddingVertical: width * 0.02,
                            // backgroundColor: 'gray'
                          }}>
                            <Home
                              name="house-user"
                              size={width * 0.04}
                              color="#115b72"
                            />
                            <View style={{ marginLeft: width * .01 }}>
                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={styles.propText}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {item.name == null ? 'Untitled' : item.name}
                                </TextTicker>
                              </View>

                              <View style={{ width: width * 0.6 }}>
                                <TextTicker
                                  style={{ color: 'gray', fontSize: width * .03 }}
                                  duration={6000}
                                  marqueeDelay={2000}>
                                  {(item.street == null ? '' : item.street + ', ') +
                                    (item.st == null ? '' : item.st + ', ') +
                                    (item.city == null ? '' : item.city + ', ') +
                                    (item.zipcode == null ? '' : item.zipcode)}
                                </TextTicker>
                              </View>
                            </View>
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
      </View>
    );
  }
}
