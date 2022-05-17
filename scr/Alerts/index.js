import React, {Component, version} from 'react';

import {
  Text,
  View,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
  LogBox,
  Alert,
  Platform,
  Switch,
  SectionList,
  FlatList,
} from 'react-native';

//Packages
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logout from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SystemSetting from 'react-native-system-setting';
import {Checkbox} from 'react-native-paper';

// Components

import style from './style';
import CustumStatusBar from '../components/StatusBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Drawer from '../components/modal/Drawer';
import API from '../api/SeviceApi';
import Index from '../Home/Index';
import Loader from '../components/Loader';

const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      loader: true,
      isModalVisible: false,
      allAlerts: [],
      allAlertsChecked: false,
      alertIndex: null,
      alertSelected: false,
      alertsType: [
        {
          title: 'Equipment Health Alerts',
          icon: 'heart',
          data: [
            {
              alertCategory: 0,
              title: 'Tamper',
              description:
                'Detect when someone has tampered with your equipment.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Connection',
              description: 'Detect when equipment goes offline.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Power Loss',
              description:
                'Detect when your equipment is unplugged from power.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Battery',
              description: 'Detect when batteries start running slow.',
              user_allowed: false,
            },
          ],
        },
        {
          title: 'Smart Security Alerts',
          icon: 'shield',
          data: [
            {
              alertCategory: 1,
              title: 'Temperature',
              description: 'Detect when the temperature at a meter reaches.',
              user_allowed: false,
            },
            {
              alertCategory: 1,
              title: 'Consumption',
              description:
                'Detect unusual spike in usage such as running toilet.',
              user_allowed: false,
            },
            {
              alertCategory: 1,
              title: 'Water Leak Sensor',
              description:
                'Detect physical water leaks utilizing the ION Energy Leak Sensor',
              user_allowed: 'Coming Soon',
            },
          ],
        },
      ],
      alertContacts: [
        {
          title: 'Alerts Contacts',
          icon: 'bell',
          data: [],
        },
      ],
      notifications: [{title: 'Alert Contacts', icon: 'bell'}],
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const propertyData = this.props.navigation.state.params.item.item;
    const allAlertsRes = await API.get(`alert/all/${propertyData?.id}`);
    this.setState({loader: true});
    if (allAlertsRes.data.bool) {
      let allAlerts = allAlertsRes.data.data;
      let alerts = [...allAlerts];
      alerts.map((item, index) => {
        alerts[index].check = false;
      });
      this.setState({allAlerts: alerts});
    }
    const alertsRes = await API.get(`/alert/property/${propertyData?.id}`);
    if (alertsRes.data.bool) {
      const allowedIds = alertsRes.data?.data?.alert_type?.alert_type_id;
      allowedIds.map((item) => {
        const alertArray = [...this.state.alertsType];
        item < 5
          ? (alertArray[0].data[item - 1].user_allowed = true)
          : (alertArray[1].data[item - 5].user_allowed = true);
        this.setState({alertsType: alertArray});
      });
    }
    const alertContactRes = await API.get(`/alert/property/contact/all`);
    if (alertContactRes.data.bool) {
      const contactData = [...this.state.alertContacts];
      contactData[0].data = alertContactRes?.data?.data;
      this.setState({alertContacts: contactData});
    }
    this.setState({loader: false});
    console.log('alertContactRes', alertContactRes?.data?.data);
  }

  changeAlertStatus = async (item, index) => {
    const alertArray = [...this.state.alertsType];
    let currVal = alertArray[item.alertCategory].data[index].user_allowed;
    alertArray[item.alertCategory].data[index].user_allowed = !currVal;
    let IDs = [];
    alertArray.map((item) => {
      item.data.map((i, ind) => {
        if (i.user_allowed == true) {
          console.log('index', ind);
          i.alertCategory < 1 ? IDs.push(ind + 1) : IDs.push(ind + 5);
        }
      });
    });
    const AlertIds = {alert_type_id: IDs};
    const updateAlertStatus = await API.post(
      'alert/property/update/285',
      AlertIds,
    );
    console.log('updateAlertStatus', updateAlertStatus);
    if (updateAlertStatus.data.bool) {
      this.setState({alertsType: alertArray});
    }
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  naviagateToEquip = () => {
    this.toggleModal();
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };

  naviagateToDetail = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'Detail',
      this.props.navigation.state.params,
    );
  };

  naviagateToAlerts = () => {
    this.toggleModal();
  };

  naviagateToSupport = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  render() {
    return (
      <View style={style.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}
        {this.state.loader && <Loader />}
        <Drawer
          isVisible={this.state.isModalVisible}
          onCancel={this.toggleModal}
          naviagateToDetail={this.naviagateToDetail}
          naviagateToEquip={this.naviagateToEquip}
          naviagateToChart={this.naviagateToChart}
          naviagateToAlerts={this.naviagateToAlerts}
          naviagateToSupport={this.naviagateToSupport}
        />
        <View style={style.headingContainer}>
          <View style={[style.headingInner]}>
            <TouchableOpacity
              onPress={this.toggleModal}
              style={{
                width: width * 0.15,
                height: height * 0.06,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons size={width * 0.08} color="white" name="menu" />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: width * 0.12,
              }}>
              <Text style={style.mainHeadiing}>Ion Energy Alerts</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={{height: height * 1, width: width * 1}}
          showsVerticalScrollIndicator={false}>
          <View style={style.containView}>
            <View style={style.containerReset}>
              <Feather
                name="alert-triangle"
                size={height * 0.035}
                style={{paddingRight: 5}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Alerts</Text>
            </View>
            {this.state.allAlerts.length > 0 && (
              <View
                style={{
                  width: width * 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                  paddingLeft: 5,
                }}>
                <Checkbox
                  status={this.state.allAlertsChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    let alerts = [...this.state.allAlerts];
                    alerts.map((item, index) => {
                      alerts[index].check = this.state.allAlertsChecked
                        ? false
                        : true;
                    });
                    const checkValues = (obj) => obj.check === true;
                    this.setState({
                      alertSelected: alerts.some(checkValues),
                    });
                    this.setState({allAlerts: alerts});
                    this.setState({
                      allAlertsChecked: !this.state.allAlertsChecked,
                    });
                  }}
                />
                {this.state.alertSelected && (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                    }}>
                    <Feather
                      name="bell-off"
                      size={height * 0.03}
                      style={{paddingRight: 5}}
                    />
                    <Text style={{}}>Dismiss Selected</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <FlatList
              data={this.state.allAlerts}
              renderItem={({item, index}) => (
                <View
                  style={{
                    ...style.containerInner,
                    paddingHorizontal: 0,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                      status={item.check ? 'checked' : 'unchecked'}
                      onPress={() => {
                        let alerts = [...this.state.allAlerts];
                        alerts[index].check = !alerts[index].check;
                        const checkValues = (obj) => obj.check === true;
                        this.setState({
                          alertSelected: alerts.some(checkValues),
                        });
                        this.setState({allAlerts: alerts});
                        // this.setState({
                        //   alertIndex:
                        //     index === this.state.alertIndex ? null : index,
                        // });
                      }}
                    />
                    <Text
                      style={{
                        ...style.mainHeadiingItems,
                        textTransform: 'capitalize',
                      }}>
                      {item.alert_type.name}
                    </Text>
                  </View>
                  <Text style={{...style.alertsDataText, textAlign: 'center'}}>
                    {item.property + '\n' + item.unit}
                  </Text>
                  <Text
                    style={{
                      ...style.alertsDataText,
                      textAlign: 'center',
                      marginRight: 1,
                    }}>
                    May 08, 2022{'\n'}3 days ago
                  </Text>
                </View>
              )}
            />

            <View style={style.containerReset}>
              <Feather
                name="settings"
                size={height * 0.035}
                style={{paddingRight: 5}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Settings</Text>
            </View>
            <SectionList
              sections={this.state.alertsType}
              renderItem={({item, index}) => (
                <View style={style.containerInner}>
                  <View>
                    <Text style={style.mainHeadiingItems}>{item.title}</Text>
                    <Text style={style.sideHeadingItems}>
                      {item.description}
                    </Text>
                  </View>
                  {item.user_allowed == 'Coming Soon' ? (
                    <Text
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 1,
                        color: '#999',
                        borderColor: '#999',
                        textAlign: 'center',
                      }}>
                      Coming Soon
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: width * 0.25,
                        justifyContent: 'space-around',
                      }}>
                      <Switch
                        trackColor={{false: 'lightgray', true: '#25AAE1'}}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        value={item.user_allowed}
                        onValueChange={() =>
                          this.changeAlertStatus(item, index)
                        }
                      />
                      <TouchableOpacity>
                        <Feather
                          name={'settings'}
                          size={height * 0.035}
                          style={{paddingRight: 5}}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              renderSectionHeader={({section: {title, icon}}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Feather
                    name={icon}
                    size={height * 0.035}
                    style={{paddingRight: 5}}
                    color="#999"
                  />
                  <Text style={style.subHeading}>{title}</Text>
                </View>
              )}
            />
            <View style={style.containerReset}>
              <Feather
                name="settings"
                size={height * 0.035}
                style={{paddingRight: 5}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Notifications</Text>
            </View>
            <SectionList
              sections={this.state.alertContacts}
              renderItem={({item, index}) => (
                <View style={style.containerInner}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather
                      name="user"
                      size={height * 0.04}
                      style={{paddingRight: 5}}
                    />
                    <View>
                      <Text style={style.mainHeadiingItems}>{item.name}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={style.contactOtherInfo}>{item.email}</Text>
                        <Text style={style.contactOtherInfo}>{item.phone}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity>
                    <Feather
                      name={'settings'}
                      size={height * 0.035}
                      style={{paddingRight: 5}}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              )}
              renderSectionHeader={({section: {title, icon}}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Feather
                    name={icon}
                    size={height * 0.035}
                    style={{paddingRight: 5}}
                    color="#999"
                  />
                  <Text style={style.subHeading}>{title}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
