import React, { Component } from 'react';
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
  Alert,
} from 'react-native';


//Packages
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { VictoryArea, VictoryAxis, VictoryPie } from 'victory-native';

// Components
import { Fonts } from '../../utils/fonts';
import styles from './style';
import CustumStatusBar from '../../components/StatusBar';
import TextTicker from 'react-native-text-ticker';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../api/SeviceApi';
import Svg, { G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 70.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <AntDesign name="home" color={tintColor} size={height * 0.04} />
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
      onlineStatic: 0,
      offlineProps: 0,
      offlineStatic: 0,
      recentProps: false,
      recentProperties: [],
      newProperties: [],
      totProperties: [],
      initialPosition: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: 0.0421,
      },
      userCurrentIndex: null,
      userCurrentData: [],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount() {
    // console.log('What we Get', this.props.navigation);
    this.setState({ loadData: true });
    const userDataUnParsed = await AsyncStorage.getItem('users_data');
    const userId = await AsyncStorage.getItem('user_id');
    const userData = JSON.parse(userDataUnParsed);
    console.log('USERDATA', userData);
    let index = userData
      .map((e) => {
        return e.id;
      })
      .indexOf(Number(userId));
    this.setState({ userCurrentIndex: index, userCurrentData: userData });
    let data = {
      ids: userData[index].recent_properties,
    };

    const RVPRes = await API.post(`/dashboard/recent-view-properties`, data);

    if (RVPRes.data?.bool) {
      this.setState({
        recentProperties: RVPRes?.data?.data,
      });
    }
    const PortfolioRes = await API.get(`/dashboard/portfolio-chart`);

    console.log('ProtfolioRes New', PortfolioRes?.data?.data?.new);
    console.log('ProtfolioRes New', PortfolioRes?.data?.data?.total);
    if (PortfolioRes.data?.bool) {
      this.setState({
        newProperties: PortfolioRes?.data?.data?.new,
        totProperties: PortfolioRes?.data?.data?.total,
      });
    }

    const cardRes = await API.get(`/dashboard/cards`);
    console.log("cardRes", cardRes)
    if (cardRes?.data?.bool) {
      this.setState({
        onlineProps: cardRes?.data?.data?.property_status[0],
        onlineStatic: cardRes?.data?.data?.property_status[0],
        offlineProps: cardRes?.data?.data?.property_status[1],
        offlineStatic: cardRes?.data?.data?.property_status[1],
        totalProperties: cardRes?.data?.data?.property?.total,
        propertiesThisWeek: cardRes?.data?.data?.property?.current_week,
        propertiesPercent: cardRes?.data?.data?.property?.percentage_growth,
        totalBuildings: cardRes?.data?.data?.building?.total,
        buildingsThisWeek: cardRes?.data?.data?.building?.current_week,
        buildingsPercent: cardRes?.data?.data?.building?.percentage_growth,
        totalMeters: cardRes?.data?.data?.meter?.total,
        metersThisWeek: cardRes?.data?.data?.meter?.current_week,
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

  selectedProp = (prop) => {
    this.setState({
      currentIndex: prop.index === this.state.currentIndex ? null : prop.index,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  jumpToDetail = ({ prop, item }) => {
    this.props.navigation.navigate('Detail', { item });
    this.selectedProp(prop);
    this.setState({ showSearch: false });
  };

  jumpToEquip = ({ prop, item }) => {
    this.props.navigation.navigate('Equip', { item });
    this.selectedProp(prop);
  };

  jumpToAlerts = ({ prop, item }) => {
    this.props.navigation.navigate('Alerts', { item });
    this.selectedProp(prop);
  };

  confirmDelete = (id, index) => {
    Alert.alert('Delete Property', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => this.deleteProperty(id, index) },
    ]);
  };

  deleteProperty = async (id, index) => {
    console.log('ID', id);
    const response = await API.post(`/property/delete/${id}`);
    console.log('response', response.data?.bool);
    if (response?.data?.bool) {
      console.log('Chala FUnction');
      const userDataUpdated = [...this.state.userCurrentData];
      let ids = [...this.state.userCurrentData[index].recent_properties];
      ids.splice(index, 1);
      console.log('IDS', ids);
      userDataUpdated[this.state.userCurrentIndex].recent_properties = ids;
      const jsonData = JSON.stringify(userDataUpdated);
      await AsyncStorage.setItem('users_data', jsonData);
      this.setState({ currentIndex: null });
      alert(response?.data?.message);
      this.context.checkData();
      this.setState({ propertyList: this.context.propList });
    }
  };

  _renderProperties = (prop) => {
    console.log("PROPS", prop?.item?.gateway)
    return (
      <View
        style={{
          alignItems: 'center',
          marginVertical: height * 0.01,
        }}>
        <TouchableOpacity
          style={styles.propButton}
          onPress={() => this.selectedProp(prop)}>
          <MaterialCommunityIcons
            name="home-city-outline"
            size={width * 0.09}
            color="#115b72"
          />
          <View>
            <View style={{ width: width * 0.5 }}>
              <TextTicker
                style={styles.propText}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.5}>
                {prop.item.name == null ? 'Untitled' : prop.item.name}
              </TextTicker>
            </View>
            <View style={{ width: width * 0.5 }}>
              <TextTicker
                style={{ color: 'gray' }}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.5}>
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
            <View style={styles.buildUnitCountContainer}>
              <MaterialIcons
                name="warning"
                size={width * 0.04}
                color="#115b72"
              />
              <Text style={styles.buildUnitCount}>
                {prop.item.alert_count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {prop.index === this.state.currentIndex ? (
          <View
            style={{
              flexDirection: 'row',
              width: width * 0.9,
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: width * 0.01,
              backgroundColor: '#25AAE1ec',
              borderBottomLeftRadius: width * 0.01,
              borderBottomRightRadius: width * 0.01,
              borderWidth: width * 0.001,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  margin: width * 0.01,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => this.jumpToDetail({ prop, item: prop })}>
                <MaterialCommunityIcons
                  name="view-compact-outline"
                  color="white"
                  size={width * 0.04}
                />
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.Montserrat,
                    fontSize: width * 0.03,
                  }}>
                  Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.jumpToEquip({ prop, item: prop })}
                style={{
                  margin: width * 0.01,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="edit" color="white" size={width * 0.04} />
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.Montserrat,
                    fontSize: width * 0.03,
                  }}>
                  Equipments
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.jumpToAlerts({ prop, item: prop })}
                style={{
                  margin: width * 0.01,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Feather
                  name="alert-triangle"
                  color="white"
                  size={width * 0.04}
                />
                <Text
                  style={{
                    color: 'white',
                    fontFamily: Fonts.Montserrat,
                    fontSize: width * 0.03,
                  }}>
                  Alerts
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => this.confirmDelete(prop?.item?.id, prop.index)}
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
              <Text
                style={{
                  color: 'white',
                  fontFamily: Fonts.Montserrat,
                  fontSize: width * 0.03,
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  changeLayoutRecent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ recentProps: !this.state.recentProps });
  };
  render() {
    const {
      onlineProps,
      onlineStatic,
      offlineProps,
      offlineStatic,
      totalProperties,
      totProperties,
      newProperties,
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
            <MaterialCommunityIcons
              name="arrow-left"
              size={height * 0.04}
              color="white"
              style={{ right: 85 }}
              onPress={() => this.props.navigation.goBack()}
            />
            <View
              style={{ flexDirection: 'row', alignItems: 'center', right: 15 }}>
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={width * 0.07}
                color="white"
              />
              <Text style={styles.mainHeadiing}>Dashboard</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
                  longitudeDelta: LONGITUDE_DELTA,
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
                <AntDesign
                  name="clockcircleo"
                  size={width * 0.06}
                  style={{ left: width * 0.005 }}
                />
                <Text style={styles.mainBottonText}>
                  Recently Viewed Properties
                </Text>
                <AntDesign name={upDownNearby} size={width * 0.035} />
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
                      style={{ marginTop: height * 0.01 }}
                      data={recentProperties}
                      renderItem={this._renderProperties}
                    />
                  )}
                </View>
              </View>

              <View style={styles.mainDataContainer}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CardProperties')} style={styles.infoViewContainer}>
                  <View style={styles.infoViewLogo}>
                    <MaterialCommunityIcons
                      name="home-city-outline"
                      size={width * 0.06}
                      color="#eee"
                    />
                  </View>
                  <View style={styles.infoUpperView}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: width * 0.04 }}>Property</Text>
                      <Text
                        style={{ fontSize: width * 0.06, fontWeight: 'bold' }}>
                        {totalProperties}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.infoLowerView}>
                    <Text style={{ fontSize: width * 0.04 }}>
                      {propertiesPercent}% | {propertiesThisWeek} This Week
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CardBuildings')} style={styles.infoViewContainer}>
                  <View
                    style={{
                      ...styles.infoViewLogo,
                      backgroundColor: '#4ba64f',
                    }}>
                    <Ionicon
                      name="md-business-outline"
                      size={width * 0.06}
                      color="#eee"
                    />
                  </View>
                  <View style={styles.infoUpperView}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: width * 0.04 }}>Buildings</Text>
                      <Text
                        style={{ fontSize: width * 0.06, fontWeight: 'bold' }}>
                        {totalBuildings}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.infoLowerView}>
                    <Text style={{ fontSize: width * 0.04 }}>
                      {buildingsPercent}% | {buildingsThisWeek} This Week
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CardMeters')} style={styles.infoViewContainer}>
                  <View
                    style={{
                      ...styles.infoViewLogo,
                      backgroundColor: '#227ce9',
                    }}>
                    <MaterialIcons
                      name="person"
                      color="#eee"
                      size={width * 0.06}
                    />
                  </View>
                  <View style={styles.infoUpperView}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: width * 0.04 }}>Meters</Text>
                      <Text
                        style={{ fontSize: width * 0.06, fontWeight: 'bold' }}>
                        {totalMeters}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.infoLowerView}>
                    <Text style={{ fontSize: width * 0.04 }}>
                      {metersPercent}% | {metersThisWeek} This Week
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ width: width * 1, alignItems: 'center' }}>
                <Text style={{ fontSize: width * 0.05 }}>Property Status</Text>
              </View>
              <View style={styles.barView}>
                <Text style={{ position: 'absolute' }}>Property Status</Text>
                <VictoryPie
                  width={width * 0.75}
                  height={width * 0.75}
                  innerRadius={width * 0.35}
                  labelRadius={width * 0.28}
                  labels={({ datum }) => Math.round(datum._x)}
                  padAngle={1}
                  animate={{ duration: 400 }}
                  data={[
                    { x: onlineProps, y: onlineProps },
                    { x: offlineProps, y: offlineProps },
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
                <TouchableOpacity
                  style={{ flexDirection: 'row', padding: width * 0.01 }}
                  onPress={() => {
                    this.setState({
                      onlineProps: onlineProps > 0 ? 0 : onlineStatic,
                    });
                  }}>
                  <View style={styles.onlineView} />
                  <Text style={styles.onlineText}>Online</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', padding: width * 0.01 }}
                  onPress={() =>
                    this.setState({
                      offlineProps: offlineProps > 0 ? 0 : offlineStatic,
                    })
                  }>
                  <View style={styles.offlineView} />
                  <Text style={styles.offlineText}>Not Installed</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.portfolioHeading}>
                <Text style={{ fontSize: width * 0.05 }}>Portfolio Growth</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                {newProperties.length > 0 && (
                  <Svg
                    style={{
                      background: 'red',
                      width: width,
                      height: width * 0.75,
                      fontFamily: "'Fira Sans', sans-serif",
                    }}>
                    <G>
                      <VictoryAxis
                        dependentAxis
                        domain={[0, newProperties[0]]}
                        offsetX={50}
                        orientation="left"
                        standalone={false}
                        style={{
                          axis: { strokeWidth: 1 },
                        }}
                      />
                      <View style={{ position: 'absolute' }}>
                        <VictoryArea
                          interpolation="natural"
                          data={totProperties}
                          style={{ data: { fill: '#DCDCDC' } }}
                        />
                      </View>
                      <View style={{ position: 'absolute' }}>
                        <VictoryArea
                          interpolation="catmullRom"
                          data={newProperties}
                          style={{ data: { fill: '#175CA199' } }}
                        />
                      </View>
                      <VictoryAxis
                        dependentAxis
                        domain={[0, totProperties[1]]}
                        orientation="right"
                        standalone={false}
                        style={{
                          axis: { strokeWidth: 1 },
                        }}
                      />
                      <VictoryAxis
                        standalone={false}
                        style={{
                          axis: { stroke: 'black', strokeWidth: 1 },
                          tickLabels: {
                            fill: 'transparent',
                          },
                        }}
                      />
                    </G>
                  </Svg>
                )}
              </View>
              <View
                style={{
                  ...styles.onlineOfflineView,
                  marginVertical: height * 0.05,
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.onlineView} />
                  <Text style={styles.onlineText}>New Properties</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.offlineView} />
                  <Text style={styles.offlineText}>Total Properties</Text>
                </View>
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
                  Currently Serving
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
                    <View style={{ width: width * 0.15 }}>
                      <MaterialCommunityIcons
                        name="home-city-outline"
                        size={width * 0.15}
                      />
                    </View>
                    <View style={{ width: width * 0.28 }}>
                      <Text
                        style={{
                          fontSize: width * 0.06,
                          fontWeight: 'bold',
                          color: '#175CA1',
                        }}>
                        {totalProperties}
                      </Text>
                      <Text style={{ fontSize: width * 0.05 }}>Properties</Text>
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
                    <View style={{ width: width * 0.15 }}>
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
                          color: '#175CA1',
                        }}>
                        {totalUnits}
                      </Text>
                      <Text style={{ fontSize: width * 0.05 }}>Units</Text>
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
                    <View style={{ width: width * 0.15 }}>
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
                          color: '#175CA1',
                        }}>
                        {totalDevices}
                      </Text>
                      <Text style={{ fontSize: width * 0.05 }}>Devices</Text>
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
