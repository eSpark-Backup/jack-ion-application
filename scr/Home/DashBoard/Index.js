import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import Menu from 'react-native-vector-icons/Entypo';
import Camera from 'react-native-vector-icons/EvilIcons';
import Location from 'react-native-vector-icons/EvilIcons';
import Down from 'react-native-vector-icons/AntDesign';
import RightHand from 'react-native-vector-icons/MaterialCommunityIcons';
import Recently from 'react-native-vector-icons/AntDesign';
import Dashboard from 'react-native-vector-icons/MaterialCommunityIcons';
import TabIcon from 'react-native-vector-icons/AntDesign';
import Home from 'react-native-vector-icons/Feather';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {create} from 'apisauce';
import Base_Url from '../../api/WebServices';
import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
  VictoryPie,
} from 'victory-native';

//Packages
import * as Progress from 'react-native-progress';
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
import {yellow} from 'cli-color';
import Svg from 'react-native-svg';

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
      totalProperties: 0,
      totalUnits: 0,
      totalDevices: 0,
      onlineProps: 0,
      offlineProps: 0,
      recentProps: false,
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

  async componentDidMount() {
    console.log('What we Get', this.props.navigation);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_Url,
        headers: {Authorization: 'Bearer ' + token},
      });

      const chartRes = await this.api.get(`/dashboard/property-status-chart`);
      if (chartRes?.data?.bool) {
        this.setState({
          onlineProps: chartRes?.data?.data?.property_status[0],
          offlineProps: chartRes?.data?.data?.property_status[1],
        });
      }

      const cardRes = await this.api.get(`/dashboard/cards`);
      if (cardRes?.data?.bool) {
        this.setState({
          totalProperties: cardRes?.data?.data?.property?.total_properties,
          totalUnits: cardRes?.data?.data?.units?.total_units,
          totalDevices: cardRes?.data?.data?.devices?.total_devices,
        });
      }
    }
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
  changeLayoutRecent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({recentProps: !this.state.recentProps});
  };
  render() {
    const {onlineProps, offlineProps} = this.state;
    // this._renderMap();
    let upDownMeter;
    !this.state.meterDown ? (upDownMeter = 'up') : (upDownMeter = 'down');
    let upDownNearby;
    !this.state.recentProps ? (upDownNearby = 'down') : (upDownNearby = 'up');
    return (
      <View style={styles.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}
        {/* <View style={styles.headerContainer}>
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
        </View> */}
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <MaterialCommunityIcon
              name="arrow-left"
              size={height * 0.04}
              color="white"
              style={{right: 75}}
              onPress={() => this.props.navigation.goBack()}
            />
            <View style={{flexDirection: 'row', right: 15}}>
              <Dashboard
                name="view-dashboard-outline"
                size={width * 0.07}
                color="white"
              />
              <Text style={styles.mainHeadiing}>Dashboard</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: width * 1,
                height: height * 0.5,
                backgroundColor: 'white',
                // elevation: width * 0.02,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MapView
                style={styles.map}
                // scrollEnabled={false}
                initialRegion={{
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
                {/* <Marker
                    coordinate={this.state.markers[0].coordinate}
                    title={'Your Location'}
                    draggable
                  /> */}
              </MapView>
            </View>

            <View>
              <TouchableOpacity
                style={styles.mainBotton}
                activeOpacity={0.8}
                onPress={this.changeLayoutRecent}>
                <Recently
                  name="clockcircleo"
                  size={width * 0.06}
                  style={{left: width * 0.01}}
                />
                <Text style={styles.mainBottonText}>
                  Recently Viewed Properties
                </Text>
                <Down name={upDownNearby} size={width * 0.05} />
              </TouchableOpacity>
              <View
                style={{
                  height: this.state.recentProps ? null : 0,
                  overflow: 'hidden',
                }}>
                <View style={styles.insideBottonView}>
                  {/* <Text
                    style={{
                      fontSize: width * 0.04,
                      color: 'black',
                      fontFamily: Fonts.BalooChettan2,
                    }}>
                    No Recent Properties
                  </Text> */}
                  {/* <FlatList
                    style={{marginTop: height * 0.01}}
                    data={this.state.dateList}
                    renderItem={this._renderMyList}
                  /> */}
                </View>
              </View>

              <View style={styles.mainDataContainer}>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Property</Text>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Total:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      27
                    </Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      This Week:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      2
                    </Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      Percentage:
                    </Text>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {width: width * 0.4, textAlign: 'left'},
                      ]}>
                      8%
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Buildings</Text>
                  <View style={styles.infoViewInner}></View>
                </View>
              </View>

              <View style={{width: width * 1, alignItems: 'center'}}>
                <Text style={{fontSize: width * 0.05}}>Property Status</Text>
              </View>
              <View style={styles.barView}>
                <VictoryPie
                  width={width * 0.75}
                  height={width * 0.75}
                  innerRadius={width * 0.35}
                  labelRadius={width * 0.28}
                  data={[
                    {x: onlineProps, y: onlineProps},
                    {x: offlineProps, y: offlineProps},
                  ]}
                  colorScale={['#175CA1', '#DCDCDC']}
                  style={{
                    labels: {
                      fill: 'white',
                      fontWeight: 'bold',
                      alignItems: 'center',
                    },
                  }}
                />
              </View>
              <View style={styles.onlineOfflineView}>
                <View style={styles.onlineView} />
                <Text style={styles.onlineText}>Online</Text>
                <View style={styles.offlineView} />
                <Text style={styles.offlineText}>Not Installed</Text>
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
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: height * 0.015,
                    }}>
                    <View style={{width: width * 0.15}}>
                      <MaterialCommunityIcon
                        name="home-city-outline"
                        size={width * 0.15}
                      />
                    </View>
                    <View style={{width: width * 0.28}}>
                      <Text
                        style={{
                          fontSize: width * 0.06,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        {this.state.totalProperties}
                      </Text>
                      <Text style={{fontSize: width * 0.05}}>Properties</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: height * 0.015,
                    }}>
                    <View style={{width: width * 0.15}}>
                      <Ionicon name="md-business-outline" size={width * 0.15} />
                    </View>
                    <View
                      style={{
                        width: width * 0.28,
                      }}>
                      <Text
                        style={{
                          fontSize: width * 0.06,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        {this.state.totalUnits}
                      </Text>
                      <Text style={{fontSize: width * 0.05}}>Units</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: height * 0.09,
                      width: width * 0.5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginVertical: height * 0.015,
                    }}>
                    <View style={{width: width * 0.15}}>
                      <FeatherIcon name="cast" size={width * 0.15} />
                    </View>
                    <View
                      style={{
                        width: width * 0.28,
                      }}>
                      <Text
                        style={{
                          fontSize: width * 0.06,
                          fontWeight: 'bold',
                          color: 'purple',
                        }}>
                        {this.state.totalDevices}
                      </Text>
                      <Text style={{fontSize: width * 0.05}}>Devices</Text>
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
