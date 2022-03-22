import React, {Component} from 'react';
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
  TouchableOpacity,
  ScrollView,
  FlatList,
  LayoutAnimation,
  UIManager,
  TextInput,
  Platform,
} from 'react-native';
import Menu from 'react-native-vector-icons/Entypo';
import Camera from 'react-native-vector-icons/EvilIcons';
import Location from 'react-native-vector-icons/EvilIcons';
import Down from 'react-native-vector-icons/AntDesign';
import RightHand from 'react-native-vector-icons/MaterialCommunityIcons';
import Recently from 'react-native-vector-icons/AntDesign';
import Search from 'react-native-vector-icons/EvilIcons';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from 'react-native-vector-icons/MaterialCommunityIcons';
import TabIcon from 'react-native-vector-icons/AntDesign';
import Back from 'react-native-vector-icons/MaterialIcons';
import Home from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';

//Packages
import DropDownItem from 'react-native-drop-down-item';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

// Components
import {Fonts} from '../../utils/fonts';
import styles from './style';
import CustumStatusBar from '../../components/StatusBar';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 12.75;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="home" color={tintColor} size={height * 0.04} />
    ),
  };
  constructor() {
    super();
    this.state = {
      down: false,
      points: 80,
      expanded: false,
      asdf: false,
      lat: 0,
      long: 0,
      markers: [],
      initialPosition: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: 0.0421,
      },
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  getLocation = (e) => {
    console.log('Get Mark Location', e.nativeEvent.coordinate);
    this.setState({
      markers: [
        {
          coordinate: e.nativeEvent.coordinate,
        },
      ],
    });
  };

  moveMarker = (region) => {
    // console.log('Region Ata>>>>>>>>>>>', region);
  };

  _renderMap = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        this.setState({lat: lat, long: long});

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
      },
      (error) => console.log('geo location', error),
      {enableHighAccuracy: false, timeout: 30000, maximumAge: 1000},
    );
  };
  componentDidMount() {
    console.log('What we Get', this.props.navigation);

    this._renderMap();
  }

  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({meter: !this.state.meter, meterDown: !this.state.meterDown});
  };
  changeLayoutNearby = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({nearby: !this.state.nearby, nearDown: !this.state.nearDown});
  };
  render() {
    // this._renderMap();
    let upDownMeter;
    !this.state.meterDown ? (upDownMeter = 'up') : (upDownMeter = 'down');
    let upDownNearby;
    !this.state.nearDown ? (upDownNearby = 'down') : (upDownNearby = 'up');

    return (
      <View style={styles.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}
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
                size={width * 0.08}
                style={{marginLeft: width * 0.05}}
                color="white"
              />
              <TextInput
                placeholderTextColor="white"
                placeholder="Search"
                style={styles.search}
                onChangeText={(e) => this.setState({currentWei: e})}
              />
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Dashboard
              name="view-dashboard-outline"
              size={width * 0.07}
              color="white"
            />
            <Text style={styles.mainHeadiing}>Dashboard</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: width * 1,
                height: height * 0.5,
                backgroundColor: 'white',
                elevation: width * 0.02,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {this.state.markers.length > 0 ? (
                <MapView
                  style={styles.map}
                  // scrollEnabled={false}
                  initialRegion={{
                    latitude: 39.0902,
                    longitude: -102.0,
                    latitudeDelta: 10,
                    longitudeDelta: 30,
                  }}
                  region={{
                    latitude: 39.0902,
                    longitude: -102.0,
                    latitudeDelta: 10,
                    longitudeDelta: 30,
                  }}
                  zoomEnabled={true}
                  provider={PROVIDER_GOOGLE}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  onRegionChange={(e) => this.moveMarker(e)}
                  onPress={(e) => this.getLocation(e)}>
                  <Marker
                    coordinate={this.state.markers[0].coordinate}
                    title={'Your Location'}
                    draggable
                  />
                </MapView>
              ) : null}
            </View>
            <View style={styles.barView}>
              <AnimatedCircularProgress
                size={width * 0.65}
                width={width * 0.11}
                backgroundWidth={width * 0.11}
                fill={this.state.points}
                tintColor="#09BAF2"
                backgroundColor="#3d5875"
                arcSweepAngle={360}
                rotation={0}
                lineCap="butt">
                {(fill) => (
                  <Text style={styles.barText}>
                    Property Status {'\n'} {Math.round((100 * fill) / 100)} %
                  </Text>
                )}
              </AnimatedCircularProgress>
            </View>
            <View style={styles.onlineOfflineView}>
              <View style={styles.onlineView} />
              <Text style={styles.onlineText}>Online</Text>
              <View style={styles.offlineView} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
            {/* <FlatList
              style={{ marginTop: height * .01 }}
              data={this.state.dateList}
              renderItem={this._renderMyList}
            /> */}
            <View>
              <TouchableOpacity
                style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutMeter}>
                <Camera name="camera" size={width * 0.08} />
                <Text style={styles.mainBottonText}>Meter Reader</Text>
                <Down name={upDownMeter} size={width * 0.05} />
              </TouchableOpacity>
              <View
                style={{
                  height: !this.state.meter ? null : 0,
                  overflow: 'hidden',
                }}>
                <View style={styles.insideBottonView}>
                  <TouchableOpacity onPress={() => console.log('hello')}>
                    <LinearGradient
                      colors={['#09BAF2', '#115b72', '#0d3744']}
                      style={styles.meterReaderBotton}
                      start={{x: 0.1, y: 1}}
                      end={{x: 1.5, y: 3}}>
                      <RightHand
                        name={'hand-pointing-right'}
                        size={width * 0.05}
                        color="white"
                        style={styles.rightHandIcon}
                      />
                      <Text style={styles.meterBottonText}>
                        Meter Reader Section
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutNearby}>
                <Location name="location" size={width * 0.08} />
                <Text style={styles.mainBottonText}>Nearby Properties</Text>
                <Down name={upDownNearby} size={width * 0.05} />
              </TouchableOpacity>
              <View
                style={{
                  height: this.state.nearby ? null : 0,
                  overflow: 'hidden',
                }}>
                <View style={styles.insideBottonView}>
                  <Text
                    style={{
                      fontSize: width * 0.04,
                      color: 'black',
                      fontFamily: Fonts.BalooChettan2,
                    }}>
                    No nearby Properties
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutNearby}>
                <Recently
                  name="clockcircleo"
                  size={width * 0.06}
                  style={{left: width * 0.01}}
                />
                <Text style={styles.mainBottonText}>Recently View</Text>
                <Down name={upDownNearby} size={width * 0.05} />
              </TouchableOpacity>
              <View
                style={{
                  height: this.state.nearby ? null : 0,
                  overflow: 'hidden',
                }}>
                <View style={styles.insideBottonView}></View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  paddingTop: width * 0.03,
                  // paddingHorizontal: width * .03,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.06,
                    color: '#2D2A2B',
                    fontFamily: Fonts.BalooChettan2,
                    fontWeight: 'bold',
                  }}>
                  You are
                </Text>
                <Text
                  style={{
                    fontSize: width * 0.08,
                    color: '#2D2A2B',
                    fontFamily: Fonts.BalooChettan2,
                  }}>
                  Currently Servicing
                </Text>
                <View
                  style={{
                    paddingTop: width * 0.1,
                    //  flexDirection:"column",
                    //  justifyContent: "center"
                  }}>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.95,
                      justifyContent: 'space-evenly',
                      // alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: height * 0.015,
                    }}>
                    <View>
                      <Home name="home" size={width * 0.2} />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: width * 0.08,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        10
                      </Text>
                      <Text style={{fontSize: width * 0.06}}>Properties</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.95,
                      justifyContent: 'space-evenly',
                      // alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: height * 0.015,
                    }}>
                    <View>
                      <Home name="home" size={width * 0.2} />
                    </View>
                    <View style={{marginRight: 50}}>
                      <Text
                        style={{
                          fontSize: width * 0.08,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        641
                      </Text>
                      <Text style={{fontSize: width * 0.06}}>Units</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.95,
                      justifyContent: 'space-evenly',
                      // alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: height * 0.015,
                    }}>
                    <View>
                      <Home name="home" size={width * 0.2} />
                    </View>
                    <View style={{marginRight: 20}}>
                      <Text
                        style={{
                          fontSize: width * 0.08,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        473
                      </Text>
                      <Text style={{fontSize: width * 0.06}}>Devices</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
