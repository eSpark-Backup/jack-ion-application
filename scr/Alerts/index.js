import React, {Component, version} from 'react';

import {
  Text,
  View,
  Dimensions,
  ScrollView,
  LogBox,
  Platform,
  Switch,
  SectionList,
  FlatList,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  useWindowDimensions,
} from 'react-native';

//Packages
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Checkbox from '@react-native-community/checkbox';
import Text_Input from '../components/TextInput/index';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// Components
import style from './style';
import CustumStatusBar from '../components/StatusBar';
import Drawer from '../components/modal/Drawer';
import API from '../api/SeviceApi';
import Loader from '../components/Loader';
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
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      shimmers: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
      notifications: [{title: 'Alert Contacts', icon: 'bell'}],
      alertsType: [
        {
          title: 'Equipment Health Alerts',
          icon: 'heart',
          data: [],
        },
        {
          title: 'Smart Security Alerts',
          icon: 'shield',
          data: [],
        },
      ],
      alertContacts: [
        {
          title: 'Alerts Contacts',
          icon: 'bell',
          data: [],
        },
      ],
      activeTab: 'alert',
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    this.setState({loader: true});
    this.fetchAlerts();
    this.fetchAlertsTypes();
    // this.fetchAlertSettings();
    const alertContactRes = await API.get(`/alert/property/contact/all`);
    if (alertContactRes.data.bool) {
      const contactData = [...this.state.alertContacts];
      contactData[0].data = alertContactRes?.data?.data;
      this.setState({alertContacts: contactData});
    } else {
      alert(alertContactRes.data.message);
      this.setState({loader: false});
    }
    console.log('alertContactRes', alertContactRes?.data?.data);
  }

  fetchAlerts = async () => {
    const propertyData = this.props.navigation.state.params.item.item;
    const allAlertsRes = await API.get(`/alert/all/${propertyData?.id}`);
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

  changeContactAlerts = (index, ind) => {
    let updateArr = [...this.state.alertsType];
    const prevData = updateArr[index].data[ind].contact_alerts;
    updateArr[index].data[ind].contact_alerts = !prevData;
    this.setState({alertsType: updateArr});
  };

  fetchAlertsTypes = async () => {
    const allAlertTypes = await API.get('/alert/type/all');
    if (allAlertTypes.data.bool) {
      let APIAlerts = allAlertTypes.data.data;
      let typeOfAlerts = [...this.state.alertsType];
      APIAlerts.map((item) => (item.user_allowed = false));
      APIAlerts.map((item) => (item.contact_alerts = true));
      typeOfAlerts[0].data = [];
      typeOfAlerts[1].data = [];
      APIAlerts.map((item) =>
        item.parent == 1
          ? typeOfAlerts[0].data.push(item)
          : typeOfAlerts[1].data.push(item),
      );
      this.setState({alertsType: typeOfAlerts});
      this.fetchAlertSettings();
    } else {
      this.setState({loader: false});
      alert(allAlertTypes.data.message);
    }
  };

  fetchAlertSettings = async () => {
    const propertyData = this.props.navigation.state.params.item.item;
    const alertsRes = await API.get(`/alert/property/${propertyData?.id}`);
    console.log('Alert Results', alertsRes.data.data);
    if (alertsRes.data.bool) {
      const allowedIds = alertsRes.data?.data?.alert_type?.alert_type_id;
      allowedIds.map((item) => {
        const alertArray = [...this.state.alertsType];
        item < 5
          ? (alertArray[0].data[item - 1].user_allowed = true)
          : (alertArray[1].data[item - 5].user_allowed = true);
        this.setState({alertsType: alertArray});
      });
      this.setState({loader: false});
    } else {
      this.setState({loader: false});
      alert(alertsRes.data.message);
    }
  };

  changeAlertStatus = async (item, index) => {
    this.setState({loader: true});
    const propertyData = this.props.navigation.state.params.item.item;
    const alertArray = [...this.state.alertsType];
    const arrInd = item.parent == 1 ? 0 : 1;
    let currVal = alertArray[arrInd].data[index].user_allowed;
    alertArray[arrInd].data[index].user_allowed = !currVal;
    let IDs = [];
    alertArray.map((itm) => {
      itm.data.map((i, ind) => {
        if (i.user_allowed == true) {
          i.parent < 2 ? IDs.push(ind + 1) : IDs.push(ind + 5);
        }
      });
    });
    const AlertIds = {alert_type_id: IDs};
    const updateAlertStatus = await API.post(
      `alert/property/update/${propertyData?.id}`,
      AlertIds,
    );
    console.log('UPDATE API DATA', updateAlertStatus.data.data);
    if (updateAlertStatus.data.bool) {
      this.fetchAlertSettings();
      this.setState({loader: false});
    }
  };

  addContact = async () => {
    const propertyData = this.props.navigation.state.params.item.item;
    const alertArray = [...this.state.alertsType];
    let IDs = [];
    alertArray.map((itm) => {
      itm.data.map((i, ind) => {
        if (i.contact_alerts == true) {
          i.parent < 2 ? IDs.push(ind + 1) : IDs.push(ind + 5);
        }
      });
    });
    this.setState({loader: true});
    let contactData = {
      name: this.state.contactName,
      email: this.state.contactEmail,
      phone: this.state.contactPhone,
      property_id: propertyData?.id,
      alert_type: IDs,
    };
    const contactInfo = await API.post(
      '/alert/property/contact/add',
      contactData,
    );
    if (contactInfo.data.bool) {
      this.setState({loader: false});
      alertArray[0].data.map((item) => (item.contact_alerts = true));
      alertArray[1].data.map((item) => (item.contact_alerts = true));
      this.setState({alertsType: alertArray, contactModal: false});
    } else {
      this.setState({loader: false});
      alert(contactInfo.data.message);
    }
  };

  cancelContact = () => {
    this.setState({contactModal: false});
    const alertArray = [...this.state.alertsType];
    alertArray[0].data.map((item) => (item.contact_alerts = true));
    alertArray[1].data.map((item) => (item.contact_alerts = true));
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

  navigateToReport = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'PropertyReport',
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

  checkAlert = () => {
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
  };

  checkAllAlert = () => {
    let alerts = [...this.state.allAlerts];
    alerts.map((item, index) => {
      alerts[index].check = this.state.allAlertsChecked ? false : true;
    });
    const checkValues = (obj) => obj.check === true;
    this.setState({
      alertSelected: alerts.some(checkValues),
    });
    this.setState({allAlerts: alerts});
    this.setState({
      allAlertsChecked: !this.state.allAlertsChecked,
    });
  };

  dismissAlerts = async () => {
    this.setState({loader: true});
    const propertyId = this.props.navigation.state.params.item.item.id;
    const data = {
      alert_id: this.state.alertIds,
      note: this.state.dismissNote,
      property_id: propertyId,
    };
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

  renderAlert = () => {
    const {
      alertSettObj,
      alertSettObjInd,
      contactName,
      contactEmail,
      isModalVisible,
      alertsType,
      allAlerts,
      allAlertsChecked,
      alertSelected,
      showAdvanceSett,
      loader,
    } = this.state;

    return (
      <View>
        <>
          {loader && allAlerts.length < 1 ? (
            <View style={style.viewAlignment}>
              <Text style={style.loadingText}>Loading Alerts</Text>
            </View>
          ) : allAlerts.length > 0 ? (
            <View style={style.selectAllBtnContainer}>
              <View style={style.allAlertsCheckBoxContainer}>
                <Checkbox
                  value={allAlertsChecked}
                  onAnimationType="one-stroke"
                  offAnimationType="one-stroke"
                  onValueChange={this.checkAllAlert}
                />
              </View>
              <TouchableOpacity
                onPress={this.checkAlert}
                disabled={!alertSelected}
                style={{
                  ...style.dismissBtn,
                  borderColor: !alertSelected ? '#aaa' : null,
                }}>
                <Feather
                  name="bell-off"
                  size={height * 0.03}
                  style={{paddingRight: 5}}
                  color={!alertSelected ? '#aaa' : '#000'}
                />
                <Text
                  style={{
                    color: !alertSelected ? '#aaa' : '#000',
                  }}>
                  Dismiss Selected
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={style.viewAlignment}>
              <Feather
                name="alert-triangle"
                size={height * 0.035}
                style={{paddingRight: 5}}
              />
              <Text style={{fontSize: height * 0.03}}>Currnetly No Alerts</Text>
            </View>
          )}
          <FlatList
            data={allAlerts}
            renderItem={({item, index}) =>
              !item.dismiss && (
                <View
                  style={{
                    ...style.containerInner,
                    paddingHorizontal: 0,
                  }}>
                  <View style={style.alertsContentContainer}>
                    <View style={style.alertsCheckBoxContainer}>
                      <Checkbox
                        value={item.check}
                        onAnimationType="one-stroke"
                        offAnimationType="one-stroke"
                        onValueChange={() => {
                          let alerts = [...allAlerts];
                          alerts[index].check = !alerts[index].check;
                          const checkValues = (obj) => obj.check === true;
                          this.setState({
                            alertSelected: alerts.some(checkValues),
                          });
                          this.setState({allAlertsChecked: false});
                          this.setState({allAlerts: alerts});
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
                  <Text style={style.alertsDataText}>
                    {item.property + '\n' + item.unit}
                  </Text>
                  <Text
                    style={{
                      ...style.alertsDataText,
                      marginRight: 1,
                    }}>
                    May 08, 2022{'\n'}3 days ago
                  </Text>
                </View>
              )
            }
          />
        </>
      </View>
    );
  };

  renderSetting = () => {
    const {
      alertSettObj,
      alertSettObjInd,
      contactName,
      contactEmail,
      isModalVisible,
      alertsType,
      allAlerts,
      allAlertsChecked,
      alertSelected,
      showAdvanceSett,
      loader,
    } = this.state;

    return (
      <View>
        <>
          <SectionList
            sections={alertsType}
            renderItem={({item, index}) => (
              <View style={style.containerInner}>
                <View>
                  <Text style={style.mainHeadiingItems}>{item.name}</Text>
                  <Text style={style.sideHeadingItems}>{item.description}</Text>
                </View>
                {item.status == 2 ? (
                  <Text style={style.settingsComingSoon}>Coming Soon</Text>
                ) : (
                  <View style={style.settingsContentContainer}>
                    <Switch
                      trackColor={{false: 'lightgray', true: '#25AAE1'}}
                      thumbColor={'#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      value={item.user_allowed}
                      onValueChange={() => this.changeAlertStatus(item, index)}
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
              <View style={style.subHeadContainer}>
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
        </>
      </View>
    );
  };

  renderNotification = () => {
    const {
      alertSettObj,
      alertSettObjInd,
      contactName,
      contactEmail,
      isModalVisible,
      alertsType,
      allAlerts,
      allAlertsChecked,
      alertSelected,
      showAdvanceSett,
      loader,
    } = this.state;

    return (
      <View>
        <>
          <SectionList
            sections={this.state.alertContacts}
            renderItem={({item}) => (
              <View style={style.containerInner}>
                <View style={style.viewAlignment}>
                  <Feather
                    name="user"
                    size={height * 0.04}
                    style={{paddingRight: 5}}
                  />
                  <View>
                    <Text style={style.mainHeadiingItems}>{item.name}</Text>
                    <View style={style.viewAlignment}>
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
              <View style={style.subHeadContainer}>
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
            <Text style={style.newContactBtnText}>Add New Contact</Text>
          </TouchableOpacity>
        </>
      </View>
    );
  };

  render() {
    const {
      alertSettObj,
      alertSettObjInd,
      contactName,
      contactEmail,
      isModalVisible,
      alertsType,
      allAlerts,
      allAlertsChecked,
      alertSelected,
      showAdvanceSett,
      loader,
      activeTab,
    } = this.state;
    return (
      <View style={style.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}
        {loader && <Loader />}
        <Drawer
          isVisible={isModalVisible}
          onCancel={this.toggleModal}
          naviagateToDetail={this.naviagateToDetail}
          naviagateToEquip={this.naviagateToEquip}
          naviagateToChart={this.naviagateToChart}
          naviagateToAlerts={this.naviagateToAlerts}
          naviagateToSupport={this.naviagateToSupport}
          navigateToReport={this.navigateToReport}
        />
        <View style={style.headingContainer}>
          <View style={[style.headingInner]}>
            <TouchableOpacity
              onPress={this.toggleModal}
              style={style.drawerMenuBtn}>
              <MaterialIcons size={width * 0.08} color="white" name="menu" />
            </TouchableOpacity>
            <View style={style.mainHeadingContainer}>
              <Text style={style.mainHeadiing}>Ion Energy Alerts</Text>
            </View>
          </View>
        </View>
        <AlertScreenModal
          isVisible={this.state.settingModal}
          onClose={() => {
            this.setState({settingModal: false});
          }}
          ModalHeader={alertSettObj.name + ' Alert Settings'}
          ModalBody={
            <>
              <View style={style.settingsModalBody}>
                <View style={{flexDirection: 'row'}}>
                  <Text>Currently Turned</Text>
                  <Text
                    style={{
                      marginLeft: width * 0.01,
                      color:
                        alertSettObj?.name != undefined &&
                        this.state.alertsType[alertSettObj.parent - 1].data[
                          alertSettObjInd
                        ].user_allowed
                          ? '#25AAE1'
                          : '#aaa',
                    }}>
                    {alertSettObj?.name != undefined &&
                    alertsType[alertSettObj.parent - 1].data[alertSettObjInd]
                      .user_allowed
                      ? 'ON'
                      : 'OFF'}
                  </Text>
                </View>
                <Switch
                  trackColor={{false: 'lightgray', true: '#25AAE1'}}
                  thumbColor={'#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  value={
                    alertSettObj?.name != undefined &&
                    alertsType[alertSettObj.parent - 1].data[alertSettObjInd]
                      .user_allowed
                  }
                  onValueChange={() =>
                    this.changeAlertStatus(alertSettObj, alertSettObjInd)
                  }
                />
              </View>
              <View style={style.settinbgModalBodyDesc}>
                <Text>{alertSettObj.detail}</Text>
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
                  placeholder="Contact Name"
                  style={style.contactInput}
                  onChangeText={(text) => this.setState({contactName: text})}
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
                  placeholder="Email"
                  style={style.contactInput}
                  onChangeText={(text) => this.setState({contactEmail: text})}
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
                  placeholder="Phone(optional)"
                  style={style.contactInput}
                  onChangeText={(text) => this.setState({contactPhone: text})}
                />
              </View>
              <View style={style.noteContainer}>
                <Text style={style.messageText}>
                  Note: Phone will only be used for texting time-critical alerts
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                  this.setState({showAdvanceSett: !showAdvanceSett});
                }}
                style={style.advanceBtn}>
                <Text style={style.advanceBtnText}>
                  {showAdvanceSett ? 'Hide' : 'Show'} Advance Settings
                </Text>
                <Feather
                  name={showAdvanceSett ? 'chevron-up' : 'chevron-down'}
                  size={height * 0.02}
                  color="#25AAE1"
                  maxOpacity={0.5}
                />
              </TouchableOpacity>
              {showAdvanceSett && (
                <View>
                  <Text style={style.messageText}>
                    Select which alert notifications you would like this contact
                    to receive:
                  </Text>
                  <View style={style.contactAlertTypeContainer}>
                    <View style={style.contactAlertTypeInner}>
                      <View style={style.contactAlertHeadContainer}>
                        <Feather
                          name={'heart'}
                          size={height * 0.02}
                          color="#999"
                          maxOpacity={0.5}
                        />
                        <Text style={style.contactAlertTypeHeadText}>
                          Equipment Health
                        </Text>
                      </View>
                      {alertsType.map(
                        (item, index) =>
                          index == 0 &&
                          item.data.map((i, ind) => (
                            <View style={style.viewAlignment}>
                              <View
                                style={style.contactAlertTypeCheckBoxContainer}>
                                <Checkbox
                                  value={i.contact_alerts}
                                  onAnimationType="one-stroke"
                                  offAnimationType="one-stroke"
                                  tintColors={{true: '#25AAE1'}}
                                  style={style.contactAlertTypeCheckBox}
                                  onValueChange={() =>
                                    this.changeContactAlerts(index, ind)
                                  }
                                />
                              </View>
                              <Text style={style.contactAlertTypeContent}>
                                {i.name}
                              </Text>
                            </View>
                          )),
                      )}
                    </View>
                    <View style={style.contactAlertTypeInner}>
                      <View style={style.contactAlertHeadContainer}>
                        <Feather
                          name={'shield'}
                          size={height * 0.02}
                          color="#999"
                          maxOpacity={0.5}
                        />
                        <Text style={style.contactAlertTypeHeadText}>
                          Smart Security
                        </Text>
                      </View>
                      {alertsType.map(
                        (item, index) =>
                          index == 1 &&
                          item.data.map((i, ind) => (
                            <View style={style.viewAlignment}>
                              <View
                                style={style.contactAlertTypeCheckBoxContainer}>
                                <Checkbox
                                  disabled={ind > 1 ? true : false}
                                  value={ind > 1 ? false : i.contact_alerts}
                                  onAnimationType="one-stroke"
                                  offAnimationType="one-stroke"
                                  tintColors={{true: '#25AAE1'}}
                                  style={style.contactAlertTypeCheckBox}
                                  onValueChange={() =>
                                    this.changeContactAlerts(index, ind)
                                  }
                                />
                              </View>
                              <Text
                                style={{
                                  ...style.contactAlertTypeContent,
                                  color: ind > 1 && '#999',
                                }}>
                                {i.name}
                              </Text>
                            </View>
                          )),
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          }
          ModalFooter={
            <View style={style.dismissModalFooter}>
              <TouchableOpacity
                onPress={this.cancelContact}
                style={style.dismissModalCancelBtn}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.addContact}
                disabled={!contactName || (!contactEmail && true)}
                style={{
                  ...style.dismissModalDoneBtn,
                  backgroundColor:
                    contactName && contactEmail ? '#25AAE1' : '#999',
                }}>
                <Text style={{color: 'white'}}>Save</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            width: width,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'alert'})}
            activeOpacity={0.9}>
            <View style={style.tabContainer}>
              <Feather
                name="alert-triangle"
                size={20}
                style={{paddingRight: 5}}
                color={activeTab == 'alert' ? '#000' : '#fff'}
              />
              <Text
                style={{
                  color: activeTab == 'alert' ? '#000' : '#fff',
                  fontSize: 16,
                }}>
                Alerts
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'setting'})}
            activeOpacity={0.9}>
            <View style={style.tabContainer}>
              <Feather
                name="settings"
                size={20}
                style={{paddingRight: 5}}
                color={activeTab == 'setting' ? '#000' : '#fff'}
              />
              <Text
                style={{
                  color: activeTab == 'setting' ? '#000' : '#fff',
                  fontSize: 16,
                }}>
                Settings
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'notification'})}
            activeOpacity={0.9}>
            <View style={style.tabContainer}>
              <Feather
                name="settings"
                size={20}
                style={{paddingRight: 5}}
                color={activeTab == 'notification' ? '#000' : '#fff'}
              />
              <Text
                style={{
                  color: activeTab == 'notification' ? '#000' : '#fff',
                  fontSize: 16,
                }}>
                Notifications
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={style.container}
          showsVerticalScrollIndicator={false}>
          <View style={style.containView}>
            {activeTab == 'alert' && this.renderAlert()}
            {activeTab == 'setting' && this.renderSetting()}
            {activeTab == 'notification' && this.renderNotification()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
