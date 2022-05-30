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
  TextInput,
  LayoutAnimation,
} from 'react-native';

//Packages
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Checkbox from '@react-native-community/checkbox';
import Text_Input from '../components/TextInput/index';

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
import AlertScreenModal from '../components/modal/AlertScreenModal';

const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      loader: true,
      isModalVisible: false,
      allAlerts: [],
      allAlertsChecked: false,
      testAlert: false,
      alertIndex: null,
      alertSelected: false,
      alertDesc: '',
      alertSettName: '',
      settingModal: false,
      dismissQty: null,
      dismissNote: '',
      dismissModal: false,
      contactModal: false,
      alertIds: [],
      alertSettObj: {},
      alertSettObjInd: {},
      showAdvanceSett: false,
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
    this.setState({loader: true});
    this.fetchAlerts();
    this.fetchAlertSettings();
    const alertContactRes = await API.get(`/alert/property/contact/all`);
    if (alertContactRes.data.bool) {
      const contactData = [...this.state.alertContacts];
      contactData[0].data = alertContactRes?.data?.data;
      this.setState({alertContacts: contactData});
    } else {
      alert(alertContactRes.data.message);
      this.setState({loader: false});
    }
    this.setState({loader: false});
    console.log('alertContactRes', alertContactRes?.data?.data);
  }

  fetchAlerts = async () => {
    const propertyData = this.props.navigation.state.params.item.item;
    const allAlertsRes = await API.get(`alert/all/${propertyData?.id}`);
    if (allAlertsRes.data.bool) {
      let allAlerts = allAlertsRes.data.data;
      let alerts = [...allAlerts];
      alerts.map((item, index) => {
        alerts[index].check = false;
      });
      this.setState({allAlerts: alerts});
    } else {
      this.setState({loader: false});
      alert(allAlertsRes.data.message);
    }
  };

  fetchAlertSettings = async () => {
    const propertyData = this.props.navigation.state.params.item.item;
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
    } else {
      this.setState({loader: false});
      alert(alertsRes.data.message);
    }
  };

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

  dismissAlerts = async () => {
    this.setState({loader: true});
    const propertyId = this.props.navigation.state.params.item.item.id;
    const data = {
      alert_id: this.state.alertIds,
      note: this.state.dismissNote,
      property_id: propertyId,
    };
    console.log('DATA', data);
    const dismissAlert = await API.post('/alert/dismiss/add', data);
    console.log('RESPONSE', dismissAlert.data);
    if (dismissAlert.data.bool) {
      this.setState({dismissModal: false, dismissNote: ''});
      this.fetchAlerts();
    } else {
      this.setState({loader: false});
      alert(dismissAlert.data.message);
    }
    this.setState({loader: false});
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
        <AlertScreenModal
          isVisible={this.state.settingModal}
          onClose={() => {
            this.setState({settingModal: false});
          }}
          ModalHeader={alertSettObj.title + ' Alert Settings'}
          ModalBody={
            <>
              <View style={style.settingsModalBody}>
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
              <View style={style.settinbgModalBodyDesc}>
                <Text>{alertSettObj.detail_desc}</Text>
              </View>
            </>
          }
        />
        <AlertScreenModal
          isVisible={this.state.dismissModal}
          onClose={() => {
            this.setState({dismissModal: false});
          }}
          ModalHeader={'Dismiss Alerts'}
          ModalBody={
            <>
              <View style={style.dismissModalBody}>
                <Text
                  style={{
                    fontSize: height * 0.018,
                  }}>
                  You are about to dismiss {this.state.dismissQty} alert. You
                  may enter some notes below before continuing.
                </Text>
                <View style={{marginTop: height * 0.01}}>
                  <Text style={style.dismissModalNotesHead}>Notes</Text>
                  <TextInput
                    multiline
                    placeholder="Type Something"
                    numberOfLines={3}
                    value={this.state.dismissNote}
                    onChangeText={(e) => this.setState({dismissNote: e})}
                    style={style.dismissModalNotesInput}
                  />
                </View>
              </View>
            </>
          }
          ModalFooter={
            <View style={style.dismissModalFooter}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({dismissModal: false, dismissNote: ''});
                }}
                style={style.dismissModalCancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.dismissAlerts}
                style={style.dismissModalDoneBtn}>
                <Text style={{color: 'white'}}>Dismiss Alerts</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <AlertScreenModal
          isVisible={this.state.contactModal}
          onClose={() => {
            this.setState({contactModal: false});
          }}
          ModalHeader={'Add New Contact'}
          ModalBody={
            <View style={{alignItems: 'center'}}>
              <View style={style.contactInfoContainer}>
                <View style={style.contactInfoInner}>
                  <Feather
                    name="user"
                    size={height * 0.024}
                    color="black"
                    maxOpacity={0.5}
                  />
                </View>
                <Text_Input
                  // value={this.state.listData?.contact_name}
                  placeholder="Contact Name"
                  onChangeText={(text) => console.log(text)}
                  style={style.contactInput}
                />
              </View>
              <View style={style.contactInfoContainer}>
                <View style={style.contactInfoInner}>
                  <Feather
                    name="mail"
                    size={height * 0.024}
                    color="black"
                    maxOpacity={0.5}
                  />
                </View>
                <Text_Input
                  // value={this.state.listData?.contact_email}
                  placeholder="Email"
                  onChangeText={(text) => console.log(text)}
                  style={style.contactInput}
                />
              </View>
              <View style={style.contactInfoContainer}>
                <View style={style.contactInfoInner}>
                  <Feather
                    name="phone"
                    size={height * 0.024}
                    color="black"
                    maxOpacity={0.5}
                  />
                </View>
                <Text_Input
                  // value={this.state.listData?.contact_phone}
                  placeholder="Phone(optional)"
                  onChangeText={(text) => console.log(text)}
                  style={style.contactInput}
                />
              </View>
              <View style={{width: width * 0.85}}>
                <Text style={{fontSize: width * 0.03}}>
                  Note: Phone will only be used for texting time-critical alerts
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                  this.setState({showAdvanceSett: !this.state.showAdvanceSett});
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: width * 0.86,
                }}>
                <Text
                  style={{
                    fontSize: width * 0.03,
                    color: '#25AAE1',
                    fontWeight: 'bold',
                  }}>
                  {this.state.showAdvanceSett ? 'Hide' : 'Show'} Advance
                  Settings
                </Text>
                <Feather
                  name={
                    this.state.showAdvanceSett ? 'chevron-up' : 'chevron-down'
                  }
                  size={height * 0.02}
                  color="#25AAE1"
                  maxOpacity={0.5}
                />
              </TouchableOpacity>
              {this.state.showAdvanceSett && (
                <View>
                  <Text style={{fontSize: width * 0.03}}>
                    Select which alert notifications you would like this contact
                    to receive:
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                      value={this.state.testAlert}
                      onAnimationType="one-stroke"
                      offAnimationType="one-stroke"
                      style={{transform: [{scaleX: 0.6}, {scaleY: 0.6}]}}
                      onValueChange={() =>
                        this.setState({testAlert: !this.state.testAlert})
                      }
                    />
                    <Text>Tamper</Text>
                  </View>
                </View>
              )}
            </View>
          }
          ModalFooter={
            <View style={style.dismissModalFooter}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({contactModal: false});
                }}
                style={style.dismissModalCancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.dismissModalDoneBtn}>
                <Text style={{color: 'white'}}>Save</Text>
              </TouchableOpacity>
            </View>
          }
        />

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
                  onPress={() => {
                    const selectedIds = [];
                    this.state.allAlerts.map((item) => {
                      if (item.check == true) {
                        selectedIds.push(item.id);
                      }
                    });
                    this.setState({
                      dismissQty: selectedIds.length,
                      dismissModal: true,
                      alertIds: selectedIds,
                    });

                    console.log('Selected Ids', selectedIds.length);
                  }}
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
              renderItem={({item, index}) =>
                !item.dismiss && (
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
                            console.log(
                              'Alerts Selected',
                              alerts.some(checkValues),
                            );
                            this.setState({allAlertsChecked: false});
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
                    <Text
                      style={{...style.alertsDataText, textAlign: 'center'}}>
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
                )
              }
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
            <TouchableOpacity
              onPress={() => this.setState({contactModal: true})}
              style={style.newContactBtn}>
              <Feather name="plus" size={height * 0.024} color="#fff" />
              <Text style={{color: 'white', fontSize: height * 0.024}}>
                Add New Contact
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
