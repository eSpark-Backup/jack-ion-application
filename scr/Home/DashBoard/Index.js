import React, { Component } from 'react';
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
  TextInput
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
import DropDownItem from "react-native-drop-down-item";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation'

// Components
import { Fonts } from '../../utils/fonts';
import styles from './style';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 12.75
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon name="home" color={tintColor} size={height * .04} />
    )
  };
  constructor() {
    super();
    this.state = {
      down: false,
      points: 80,
      expanded: false,
      asdf: false,
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
  _renderMap = () => {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }

      this.setState({ initialPosition: initialRegion })
    },
      (error) => (console.log(error)),
      { enableHighAccuracy: false, timeout: 20000 });
  }
  componentDidMount() {
    console.log('What we Get',this.props.navigation)
  }
  // _renderMyList = ({ item }) => (
  //   <View style={{ flex: 1, }}>
  //     <View style={style.renderListContainer}>
  //       <Text style={style.renderListHeading1}>
  //         {this.state.date}/{this.state.month}/{this.state.year}
  //       </Text>
  //       <Text style={style.renderListHeading2}>
  //         {this.state.hour}:{this.state.minutes}
  //       </Text>
  //       <Text style={style.renderListHeading1}>
  //         {item}
  //       </Text>
  //     </View>
  //   </View>
  // )
  
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ meter: !this.state.meter, meterDown: !this.state.meterDown });
  }
  changeLayoutNearby = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ nearby: !this.state.nearby, nearDown: !this.state.nearDown });
  }
  render() {
    // this._renderMap()
    let upDownMeter;
    !this.state.meterDown ? upDownMeter = 'up' : upDownMeter = 'down'
    let upDownNearby;
    !this.state.nearDown ? upDownNearby = 'down' : upDownNearby = 'up'

    return (
      <View style={styles.container}>
        <StatusBar  hidden backgroundColor="white" barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.menuView}>
              <Back size={width * .08} color='white' name='keyboard-backspace' />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <Search name='search' size={width * .08} style={{ marginLeft: width * .05 }} color='white' />
              <TextInput
                placeholderTextColor='white'
                placeholder='Search'
                style={styles.search}
                onChangeText={e => this.setState({ currentWei: e })}
              />
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Dashboard name="view-dashboard-outline" size={width * .07} color='white' />
            <Text style={styles.mainHeadiing}>
              Dashboard
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
            <View style={{
              width: width * 1,
              height: height * .5,
              backgroundColor: 'white',
              elevation: width * .02,
            }}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 39.0902,
                  longitude: -102.00,
                  latitudeDelta: 10,
                  longitudeDelta: 30,
                }}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
              // showsUserLocation={this.state.showsUserLocation}
              >
                <Marker
                  coordinate={{
                    "latitude": this.state.initialPosition.latitude,
                    "longitude": this.state.initialPosition.longitude
                  }}
                  title={"Your Location"}
                  draggable />
              </MapView>
            </View>
            <View style={styles.barView}>
              <AnimatedCircularProgress
                size={width * .65}
                width={width * .11}
                backgroundWidth={width * .11}
                fill={this.state.points}
                tintColor="#09BAF2"
                backgroundColor="#3d5875"
                arcSweepAngle={360}
                rotation={0}
                lineCap="butt"
              >
                {fill => <Text style={styles.barText}>Property Status {'\n'} {Math.round((100 * fill) / 100)} %</Text>}
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
              <TouchableOpacity style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutMeter}
              >
                <Camera name='camera' size={width * .08} />
                <Text style={styles.mainBottonText}>
                  Meter Reader
                  </Text>
                <Down name={upDownMeter} size={width * .05} />
              </TouchableOpacity>
              <View style={{ height: !this.state.meter ? null : 0, overflow: 'hidden' }}>
                <View style={styles.insideBottonView}>
                  <TouchableOpacity onPress={() => console.log('hello')}>
                    <LinearGradient colors={['#09BAF2', '#115b72', '#0d3744']} style={styles.meterReaderBotton}
                      start={{ x: .1, y: 1 }}
                      end={{ x: 1.5, y: 3 }}>
                      <RightHand name={'hand-pointing-right'} size={width * .05} color='white' style={styles.rightHandIcon} />
                      <Text style={styles.meterBottonText}>
                        Meter Reader Section
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutNearby}              >
                <Location name='location' size={width * .08} />
                <Text style={styles.mainBottonText}>
                  Nearby Properties
                  </Text>
                <Down name={upDownNearby} size={width * .05} />
              </TouchableOpacity>
              <View style={{ height: this.state.nearby ? null : 0, overflow: 'hidden' }}>
                <View style={styles.insideBottonView}>
                  <Text style={{
                    fontSize: width * .04,
                    color: 'black',
                    fontFamily: Fonts.BalooChettan2,
                  }}>
                    No nearby Properties
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutNearby}>
                <Recently name='clockcircleo' size={width * .06} style={{ left: width * .01 }} />
                <Text style={styles.mainBottonText}>
                  Recently View
                  </Text>
                <Down name={upDownNearby} size={width * .05} />
              </TouchableOpacity>
              <View style={{ height: this.state.nearby ? null : 0, overflow: 'hidden' }}>
                <View style={styles.insideBottonView}>
                </View>
              </View>
              <View style={{
                flexDirection: 'column',
                justifyContent: "space-evenly",
                alignItems: 'center',
                paddingTop: width * .03,
                // paddingHorizontal: width * .03,
              }}>
                <Text style={{
                  fontSize: width * .06,
                  color: '#2D2A2B',
                  fontFamily: Fonts.BalooChettan2,
                  fontWeight: "bold"
                }} >
                  You are
                </Text>
                <Text style={{
                  fontSize: width * .08,
                  color: '#2D2A2B',
                  fontFamily: Fonts.BalooChettan2,
                }}>
                  Currently Servicing
                </Text>
                <View style={{
                  paddingTop: width * .10,
                  //  flexDirection:"column",
                  //  justifyContent: "center"
                }} >
                  <View style={{
                    height: height * .09,
                    width: width * .95,
                    justifyContent: 'space-evenly',
                    // alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: height * .015,
                  }}>
                    <View>
                      <Home name='home' size={width * .20} />
                    </View>
                    <View>
                      <Text style={{ fontSize: width * .08, fontWeight: "bold", color: "purple", }}>10</Text>
                      <Text style={{ fontSize: width * .06, }}>Properties</Text>
                    </View>
                  </View>
                  <View style={{
                    height: height * .09,
                    width: width * .95,
                    justifyContent: 'space-evenly',
                    // alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: height * .015,
                  }}>
                    <View>
                      <Home name='home' size={width * .20} />
                    </View>
                    <View style={{ marginRight: 50 }} >
                      <Text style={{ fontSize: width * .08, fontWeight: "bold", color: "purple" }} >641</Text>
                      <Text style={{ fontSize: width * .06 }}>Units</Text>
                    </View>
                  </View>
                  <View style={{
                    height: height * .09,
                    width: width * .95,
                    justifyContent: 'space-evenly',
                    // alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: height * .015,
                  }}>
                    <View>
                      <Home name='home' size={width * .20} />
                    </View>
                    <View style={{ marginRight: 20 }}>
                      <Text style={{ fontSize: width * .08, fontWeight: "bold", color: "purple" }} >473</Text>
                      <Text style={{ fontSize: width * .06 }}>Devices</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View >
    );
  }
}