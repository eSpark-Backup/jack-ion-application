import React, { Component } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  UIManager,
  Platform,
} from 'react-native';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Feather from 'react-native-vector-icons/Feather';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


// Components
import styles from './style';
import CustumStatusBar from '../../../../components/StatusBar';
import Loader from '../../../../components/Loader';
import API from '../../../../api/SeviceApi';

import TextReuseableComponent from '../../../../components/Text/index';

const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      down: false,
      points: 80,
      expanded: false,
      asdf: false,
      LoaderState: true,
      visible: false,
      notificationData: [],
      shimmers: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    const notificationsRes = await API.post(
      '/property/equipment/meter/notification-show',
    );

    if (notificationsRes?.data?.bool) {
      this.setState({ notificationData: notificationsRes?.data?.data?.notify });
    }

    this.setState({ LoaderState: false });
  }

  notificationFilterApi = async (code) => {
    this.setState({ LoaderState: true });
    if (code) {
      const notificationsRes = await API.post(
        '/property/equipment/meter/notification-show',
        { code: code },
      );

      if (notificationsRes?.data?.bool) {
        this.setState({ notificationData: notificationsRes?.data?.data?.notify });
      }

      this.setState({ LoaderState: false });
    } else {
      const notificationsRes = await API.post(
        '/property/equipment/meter/notification-show',
      );

      if (notificationsRes?.data?.bool) {
        this.setState({ notificationData: notificationsRes?.data?.data?.notify });
      }

      this.setState({ LoaderState: false });
    }
  };

  openMenu = () => {
    this.setState({ visible: true });
  };

  closeMenu = () => {
    this.setState({ visible: false });
  };

  onPressFilterItem = (value) => {
    switch (value) {
      case 'Property':
        this.notificationFilterApi(202);
        break;
      case 'Building':
        this.notificationFilterApi(302);
        break;
      case 'Unit':
        this.notificationFilterApi(402);
        break;
      case 'Meter_type':
        this.notificationFilterApi(201);
        break;
      case 'Manufacturer':
        this.notificationFilterApi(602);
        break;
      case 'Device':
        this.notificationFilterApi(702);
        break;
      case 'Reset':
        this.notificationFilterApi();
        break;
      default:
        break;
    }
    this.closeMenu();
  };

  findWord(word, str) {
    return RegExp('\\b' + word + '\\b').test(str)
  }

  handleNotificationPress = (notification) => {
    console.log(' notificationData', notification)
    if (notification.link) {
      const wordRes = this.findWord("equipment", notification.link);
      const wordChat = this.findWord("userHelp", notification.link);
      const regex = /\d+/g;
      const matches = notification.link.match(regex);  // creates array from matches

      if (wordRes && matches.length) {

        const id = matches[0];
        const newItem = {
          item: {
            item: {
              id
            }
          }
        }

        return this.props.navigation.navigate("Equip", newItem);
      }
      if(wordChat) {
        return this.props.navigation.navigate("Support", { item: notification } );
      }
      const id = matches[0];
      const newItem = {
        item: {
          item: {
            id
          }
        }
      }

      return this.props.navigation.navigate("Detail", newItem);
    }
    return console.log("No data found in notification=", notification);
    // if (notification?.message?.includes('unit')) {
    //   const idFromData = data?.propertyId;
    //   const item = { id: idFromData }
    //   this.props.navigation.navigate("Equip", { item: { item: item } })
    // } else {
    //   const idFromData = data?.propertyId;
    //   const item = { id: idFromData }
    //   this.props.navigation.navigate("Detail", { item: { item: item } })
    // }
    // 
  }

  handleDeleteNotification = async (itemId) => {
    this.setState({ LoaderState: true });
    const deleteNotificationById = await API.post('/dashboard/delete-notification-by-id', { id: [itemId] });

    if (deleteNotificationById.data.bool) {
      const notificationsRes = await API.post(
        '/property/equipment/meter/notification-show',
      );
      if (notificationsRes?.data?.bool) {
        this.setState({ notificationData: notificationsRes?.data?.data?.notify, LoaderState: false });
        alert(deleteNotificationById?.data?.message);
      } else {
        alert(notificationsRes?.data?.message);
        this.setState({ LoaderState: false });
      }
    } else {
      alert(deleteNotificationById.data.message);
      this.setState({ LoaderState: false });
    }
  }

  handleClear = async () => {
    this.setState({ LoaderState: true });
    const arrayOfIds = this.state.notificationData?.map(notification => notification?.id);
    const clearAllNotifications = await API.post('/dashboard/delete-notification-by-id', { id: arrayOfIds });
    if (clearAllNotifications?.data?.bool) {
      const notificationsRes = await API.post(
        '/property/equipment/meter/notification-show',
      );
      if (notificationsRes?.data?.bool) {
        this.setState({ notificationData: notificationsRes?.data?.data?.notify, LoaderState: false });
      } else {
        alert(notificationsRes?.data?.message);
        this.setState({ LoaderState: false });
      }
    } else {
      alert(deleteNotificationById.data.message);
      this.setState({ LoaderState: false });
    }
  }

  renderShimmers = (item) => (
    <View key={item.id} style={styles.skeletonMainContainer}>
      <SkeletonPlaceholder>
        <View style={styles.skeletonInnerContainer}>
          <View style={styles.skeletonIcon} />
          <View>
            <View style={styles.skeletonDescription} />
            <View style={styles.skeletonTitle} />
          </View>
          <View style={styles.skeletonEquipsContainer}>
            <View style={styles.skeletonBuilds} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );

  render() {
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
              <MaterialCommunityIcon
                size={width * 0.08}
                color="white"
                name="keyboard-backspace"
              />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <MaterialCommunityIcon
                name="notifications"
                size={width * 0.07}
                color="white"
                style={{
                  marginRight: width * 0.01,
                }}
              />
              <TextReuseableComponent title style={styles.mainHeadiing} value={"Notifications"} />
              <View style={{ flexDirection: 'row-reverse', flex: 1 }}>
                <Menu
                  visible={this.state.visible}
                  onDismiss={this.closeMenu}
                  onRequestClose={this.closeMenu}
                  anchor={
                    <MaterialIcon
                      onPress={this.openMenu}
                      name="filter"
                      size={width * 0.07}
                      color="white"
                    />
                  }>
                  <MenuItem onPress={() => this.onPressFilterItem('Property')}>
                    {'Property'}
                  </MenuItem>
                  <MenuItem onPress={() => this.onPressFilterItem('Building')}>
                    {'Building'}
                  </MenuItem>
                  <MenuItem onPress={() => this.onPressFilterItem('Unit')}>
                    {'Unit'}
                  </MenuItem>
                  <MenuItem
                    onPress={() => this.onPressFilterItem('Meter_type')}>
                    {'Meter_type'}
                  </MenuItem>
                  <MenuItem
                    onPress={() => this.onPressFilterItem('Manufacturer')}>
                    {'Manufacturer'}
                  </MenuItem>
                  <MenuItem onPress={() => this.onPressFilterItem('Device')}>
                    {'Device'}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={() => this.onPressFilterItem('Reset')}>
                    {'All'}
                  </MenuItem>
                </Menu>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {this.state.LoaderState ? (
            this.state.shimmers.map((item) => this.renderShimmers(item))
          ) : this.state?.notificationData?.length < 1 ? (
            <TextReuseableComponent title style={{
              textAlign: 'center',
              marginTop: height * 0.3,
            }} value={"No Notifications to show"} />
          ) : (
            <>
              <FlatList
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                data={this.state?.notificationData}
                renderItem={({ item }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => this.handleNotificationPress(item)}
                      style={{
                        borderWidth: 1,
                        width: width * 0.9,
                        borderRadius: width * 0.02,
                        backgroundColor: "white",
                        padding: width * 0.01,
                        margin: width * 0.02,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                      }}>
                      <MaterialCommunityIcon
                        name="notifications"
                        size={height * 0.035}
                        color="gray"
                      />
                      <View style={{ width: width * 0.55 }}>
                        <TextReuseableComponent title style={{ fontSize: 10, textTransform: 'capitalize', color: '#25aae1' }} value={item.sender_name} />
                        <TextReuseableComponent title style={{ fontSize: 12 }} value={item.message} />
                        <TextReuseableComponent title style={{ fontSize: 8 }} value={item.time_diff} />
                      </View>
                      <TouchableOpacity style={{ width: width * 0.08 }} onPress={() => this.handleDeleteNotification(item.id)}>
                        <Feather
                          name={'delete'}
                          size={height * 0.025}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </>
                )}
              />
              {this.state?.notificationData?.length && <View style={{ 
                borderRadius: width * 0.02, 
                height: height * 0.05, 
                width: width * 0.2, 
                marginBottom: 20, 
                backgroundColor: '#25aae1', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'absolute', 
                bottom: 0 
                }}>
                <TouchableOpacity onPress={() => this.handleClear()}>
                  <TextReuseableComponent title style={{color: 'white'}} value={"Clear All"} />
                </TouchableOpacity>
              </View>}
            </>
          )}
        </View>
      </View>
    );
  }
}
