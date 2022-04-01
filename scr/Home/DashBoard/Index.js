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
  FlatList,
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
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
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
import TextTicker from 'react-native-text-ticker';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      currentIndex: null,
      points: 80,
      expanded: false,
      asdf: false,
      lat: 0,
      long: 0,
      markers: [],
      loadData: false,
      totalProperties: 0,
      propertiesThisWeek: 0,
      propertiesPercent: 0,
      totalBuildings: 0,
      buildingsThisWeek: 0,
      buildingsPercent: 0,
      totalMeters: 0,
      metersThisWeek: 0,
      metersPercent: 0,
      totalUnits: 0,
      totalDevices: 0,
      onlineProps: 0,
      offlineProps: 0,
      recentProps: false,
      recentProperties: [],
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

  async componentDidMount() {
    console.log('What we Get', this.props.navigation);
    this.setState({loadData: true});
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_Url,
        headers: {Authorization: 'Bearer ' + token},
      });

      const recentPropIds = await AsyncStorage.getItem('@recent_Props');
      const parsedIds = recentPropIds != null ? JSON.parse(recentPropIds) : [];

      let data = {
        ids: parsedIds,
      };

      const RVPRes = await this.api.post(
        `/dashboard/recent-view-properties`,
        data,
      );

      if (RVPRes) {
        this.setState({
          recentProperties: RVPRes?.data?.data,
        });
      }

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
          propertiesThisWeek:
            cardRes?.data?.data?.property?.current_week_properties,
          propertiesPercent: cardRes?.data?.data?.property?.percentage_growth,
          totalBuildings: cardRes?.data?.data?.building?.total_buildings,
          buildingsThisWeek:
            cardRes?.data?.data?.building?.current_week_buildings,
          buildingsPercent: cardRes?.data?.data?.building?.percentage_growth,
          totalMeters: cardRes?.data?.data?.meter?.total_Meters,
          metersThisWeek: cardRes?.data?.data?.meter?.current_week_Meters,
          metersPercent: cardRes?.data?.data?.meter?.percentage_growth,
          totalUnits: cardRes?.data?.data?.units?.total_units,
          totalDevices: cardRes?.data?.data?.devices?.total_devices,
          markers: cardRes?.data?.data?.property_locations,
          loadData: false,
        });
      } else {
        this.setState({
          loadData: false,
        });
      }
    }
  }

  selectedProp = (prop) => {
    this.setState({
      currentIndex: prop.index === this.state.currentIndex ? null : prop.index,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  jumpToDetail = ({prop, item}) => {
    this.props.navigation.navigate('Detail', {item});
    this.selectedProp(prop);
    this.setState({showSearch: false});
  };

  jumpToEquip = ({prop, item}) => {
    this.props.navigation.navigate('Equip', {item});
    this.selectedProp(prop);
  };

  _renderProperties = (prop) => {
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
              <Text style={styles.buildUnitCount}>
                {prop.item.unit_actual_count}
              </Text>
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

  changeLayoutRecent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({recentProps: !this.state.recentProps});
  };
  render() {
    const {
      onlineProps,
      offlineProps,
      totalProperties,
      propertiesPercent,
      propertiesThisWeek,
      totalBuildings,
      buildingsThisWeek,
      buildingsPercent,
      totalMeters,
      metersThisWeek,
      metersPercent,
      totalUnits,
      totalDevices,
      recentProperties,
      loadData,
    } = this.state;
    let upDownMeter;
    !this.state.meterDown ? (upDownMeter = 'up') : (upDownMeter = 'down');
    let upDownNearby;
    !this.state.recentProps ? (upDownNearby = 'down') : (upDownNearby = 'up');
    return (
      <View style={styles.container}>
        {loadData && <Loader />}
        {Platform.OS == 'ios' && <CustumStatusBar />}
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
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: -2000,
                }}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                // showsUserLocation={true}
                // showsMyLocationButton={true}
              >
                {this.state.markers.length > 0 &&
                  this.state.markers.map((marker) => (
                    <Marker
                      coordinate={{
                        latitude: marker?.position?.lat,
                        longitude: marker?.position?.lng,
                      }}
                      title={'Property Location'}
                      draggable
                    />
                  ))}
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
                  height: this.state.recentProps ? 'auto' : 0,
                  overflow: 'hidden',
                }}>
                <View style={styles.insideBottonView}>
                  {recentProperties.length < 1 ? (
                    <Text
                      style={{
                        fontSize: width * 0.04,
                        color: 'black',
                        fontFamily: Fonts.BalooChettan2,
                      }}>
                      No Recent Properties
                    </Text>
                  ) : (
                    <FlatList
                      style={{marginTop: height * 0.01}}
                      data={recentProperties}
                      renderItem={this._renderProperties}
                    />
                  )}
                </View>
              </View>

              <View style={styles.mainDataContainer}>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Property</Text>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Total:
                    </Text>
                    <Text style={[styles.dataFieldText]}>
                      {totalProperties}
                    </Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      This Week:
                    </Text>
                    <Text style={[styles.dataFieldText]}>
                      {propertiesThisWeek}
                    </Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Percentage:
                    </Text>
                    <Text style={[styles.dataFieldText]}>
                      {propertiesPercent}%
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Buildings</Text>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Total:
                    </Text>
                    <Text style={[styles.dataFieldText]}>{totalBuildings}</Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      This Week:
                    </Text>
                    <Text style={[styles.dataFieldText]}>
                      {buildingsThisWeek}
                    </Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Percentage:
                    </Text>
                    <Text style={[styles.dataFieldText]}>
                      {buildingsPercent}%
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>Meters</Text>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Total:
                    </Text>
                    <Text style={[styles.dataFieldText]}>{totalMeters}</Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      This Week:
                    </Text>
                    <Text style={[styles.dataFieldText]}>{metersThisWeek}</Text>
                  </View>
                  <View style={styles.infoViewInner}>
                    <Text
                      style={[
                        styles.dataFieldText,
                        {
                          textAlign: 'left',
                        },
                      ]}>
                      Percentage:
                    </Text>
                    <Text style={[styles.dataFieldText]}>{metersPercent}%</Text>
                  </View>
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
                        {totalProperties}
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
                        {totalUnits}
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
                        {totalDevices}
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
