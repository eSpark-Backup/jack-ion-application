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
  TouchableOpacity,
} from 'react-native';

//Packages
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logout from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SystemSetting from 'react-native-system-setting';
// import {Checkbox} from 'react-native-paper';
import Checkbox from '@react-native-community/checkbox';

// Components

import style from './style';
import CustumStatusBar from '../components/StatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Drawer from '../components/modal/Drawer';
import API from '../api/SeviceApi';
import Index from '../Home/Index';
import Loader from '../components/Loader';
import Modal from 'react-native-modal';

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
      alertDesc: '',
      alertSettName: '',
      settingModal: false,
      alertSettObj: {},
      alertSettObjInd: {},
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
              detail_desc:
                'A Tamper alert is created when someone tampers with your equipment. In most cases this is triggered if the device is physically opened.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Connection',
              description: 'Detect when equipment goes offline.',
              detail_desc:
                'A Connection alert gets created when a device goes offline. NextCentury offers intelligent alerting and analytics to help identify a network problem quickly. Typically, if a device is offline, there is a good explanation somewhere else on the property. We can help point you in the right direction to quickly overcome any challenges.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Power Loss',
              description:
                'Detect when your equipment is unplugged from power.',
              detail_desc:
                'A Power Loss alert gets created when a device is unplugged from power. This alert applies to wall-powered equipment such as Gateways and Repeaters.Someone may have mistakenly unplugged your equipment, and it simply needs to be plugged back in.',
              user_allowed: false,
            },
            {
              alertCategory: 0,
              title: 'Battery',
              description: 'Detect when batteries start running slow.',
              detail_desc:
                'A Low Battery alert gets created when a battery is getting close to the end of its life. NextCentury equipment has in-field replaceable batteries, and we offer easy-to-use battery replacement kits to make the process as simple as possible.',
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
              detail_desc:
                'A Temperature alert can help you automatically detect when a water meter is close to freezing. With this alert, you can take action to avoid potential damages from a frozen water meter. An alert is also created if the temperate at a device is outside the safe operating range for IONENERGY equipment. (Between -4°F and 131°F).',
              user_allowed: false,
            },
            {
              alertCategory: 1,
              title: 'Consumption',
              description:
                'Detect unusual spike in usage such as running toilet.',
              detail_desc:
                'IONENERGY uses cutting edge artificial intelligence to find unusual patterns in utility consumption. We are proud to provide this alert as a means for detecting sudden changes in trends that may need your attention. Our hardware and cloud-based analytics work hand-in-hand to detect even the smallest trends such as a costly running toilet.',
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
    alertArray.map((itm) => {
      itm.data.map((i, ind) => {
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
    const {alertSettObj, alertSettObjInd} = this.state;
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
        <Modal isVisible={this.state.settingModal}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: height * 0.02,
                marginHorizontal: width * 0.015,
                borderBottomWidth: 1,
              }}>
              <Text style={style.settingModalHead}>
                {alertSettObj.title} Alert Settings
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({settingModal: false});
                }}>
                <MaterialIcons size={width * 0.05} name="close" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: width * 0.02,
                marginVertical: height * 0.01,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text>Currently Turned</Text>
                <Text
                  style={{
                    marginLeft: width * 0.01,
                    color:
                      alertSettObj?.title != undefined &&
                      this.state.alertsType[alertSettObj.alertCategory].data[
                        alertSettObjInd
                      ].user_allowed
                        ? '#25AAE1'
                        : '#aaa',
                  }}>
                  {alertSettObj?.title != undefined &&
                  this.state.alertsType[alertSettObj.alertCategory].data[
                    alertSettObjInd
                  ].user_allowed
                    ? 'ON'
                    : 'OFF'}
                </Text>
              </View>
              <Switch
                trackColor={{false: 'lightgray', true: '#25AAE1'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={
                  alertSettObj?.title != undefined &&
                  this.state.alertsType[alertSettObj.alertCategory].data[
                    alertSettObjInd
                  ].user_allowed
                }
                onValueChange={() =>
                  this.changeAlertStatus(alertSettObj, alertSettObjInd)
                }
              />
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                paddingHorizontal: width * 0.01,
                paddingVertical: height * 0.02,
                marginBottom: height * 0.05,
                marginHorizontal: width * 0.02,
              }}>
              <Text>{alertSettObj.detail_desc}</Text>
            </View>
          </View>
        </Modal>

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
            {this.state.loader && this.state.allAlerts.length < 1 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: height * 0.03}}>Loading Alerts</Text>
              </View>
            ) : this.state.allAlerts.length > 0 ? (
              <View
                style={{
                  width: width * 1,
                  height: height * 0.06,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                  paddingLeft:
                    Platform.OS == 'ios' ? width * 0.035 : width * 0.025,
                }}>
                <View
                  style={{
                    marginRight: Platform.OS == 'ios' ? 10 : 0,
                  }}>
                  <Checkbox
                    value={this.state.allAlertsChecked}
                    onAnimationType="one-stroke"
                    offAnimationType="one-stroke"
                    onValueChange={() => {
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
                </View>
                <TouchableOpacity
                  disabled={!this.state.alertSelected}
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                    borderColor: !this.state.alertSelected ? '#aaa' : null,
                  }}>
                  <Feather
                    name="bell-off"
                    size={height * 0.03}
                    style={{paddingRight: 5}}
                    color={!this.state.alertSelected ? '#aaa' : '#000'}
                  />
                  <Text
                    style={{
                      color: !this.state.alertSelected ? '#aaa' : '#000',
                    }}>
                    Dismiss Selected
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather
                  name="alert-triangle"
                  size={height * 0.035}
                  style={{paddingRight: 5}}
                />
                <Text style={{fontSize: height * 0.03}}>
                  Currnetly No Alerts
                </Text>
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
                    <View
                      style={{
                        marginHorizontal: Platform.OS == 'ios' ? 5 : 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Checkbox
                        value={item.check}
                        onAnimationType="one-stroke"
                        offAnimationType="one-stroke"
                        onValueChange={() => {
                          let alerts = [...this.state.allAlerts];
                          alerts[index].check = !alerts[index].check;
                          const checkValues = (obj) => obj.check === true;
                          this.setState({
                            alertSelected: alerts.some(checkValues),
                          });
                          if (alerts.some(checkValues) == false) {
                            this.setState({allAlertsChecked: false});
                          }
                          this.setState({allAlerts: alerts});
                          // this.setState({
                          //   alertIndex:
                          //     index === this.state.alertIndex ? null : index,
                          // });
                        }}
                      />
                    </View>
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
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            settingModal: true,
                            alertSettObj: item,
                            alertSettObjInd: index,
                          });
                        }}>
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
