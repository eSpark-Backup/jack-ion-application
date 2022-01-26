import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  UIManager,
  Platform,
} from 'react-native';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {create} from 'apisauce';
import EncryptedStorage from 'react-native-encrypted-storage';
// import {Menu, Divider} from 'react-native-paper';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

// Components
import {Fonts} from '../../../../utils/fonts';
import Base_URL from '../../../../api/WebServices';
import styles from './style';
import CustumStatusBar from '../../../../components/StatusBar';
import Loader from '../../../../components/Loader';

const api = create({baseURL: Base_URL});
const {width, height} = Dimensions.get('window');

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
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      api.setHeader('Authorization', 'Bearer ' + token);
    }
    const notificationsRes = await api.post(
      '/property/equipment/meter/notification-show',
    );

    console.log('Notifications Response', notificationsRes?.data);
    if (notificationsRes?.data?.bool) {
      this.setState({notificationData: notificationsRes?.data?.data?.notify});
    }

    this.setState({LoaderState: false});
  }

  notificationFilterApi = async (code) => {
    this.setState({LoaderState: true});
    if (code) {
      const token = await EncryptedStorage.getItem('user_token');
      if (token != null) {
        // console.log('token aya', token);
        api.setHeader('Authorization', 'Bearer ' + token);
      }
      const notificationsRes = await api.post(
        '/property/equipment/meter/notification-show',
        {code: code},
      );

      console.log('Notifications Response', notificationsRes?.data);
      if (notificationsRes?.data?.bool) {
        this.setState({notificationData: notificationsRes?.data?.data?.notify});
      }

      this.setState({LoaderState: false});
    } else {
      const token = await EncryptedStorage.getItem('user_token');
      if (token != null) {
        // console.log('token aya', token);
        api.setHeader('Authorization', 'Bearer ' + token);
      }
      const notificationsRes = await api.post(
        '/property/equipment/meter/notification-show',
      );

      console.log('Notifications Response', notificationsRes?.data);
      if (notificationsRes?.data?.bool) {
        this.setState({notificationData: notificationsRes?.data?.data?.notify});
      }

      this.setState({LoaderState: false});
    }
  };

  openMenu = () => {
    this.setState({visible: true});
  };

  closeMenu = () => {
    this.setState({visible: false});
  };

  onPressFilterItem = (value) => {
    switch (value) {
      case 'Property':
        console.log('Property');
        this.notificationFilterApi(202);
        break;
      case 'Building':
        console.log('Building');
        this.notificationFilterApi(302);
        break;
      case 'Unit':
        console.log('Unit');
        this.notificationFilterApi(402);
        break;
      case 'Meter_type':
        console.log('Meter_type');
        this.notificationFilterApi(201);
        break;
      case 'Manufacturer':
        console.log('Manufacturer');
        this.notificationFilterApi(602);
        break;
      case 'Device':
        console.log('Device');
        this.notificationFilterApi(702);
        break;
      case 'Reset':
        console.log('Reset');
        this.notificationFilterApi();
        break;
      default:
        console.log('Unknown');
        break;
    }
    this.closeMenu();
  };

  render() {
    let upDownMeter;
    !this.state.meterDown ? (upDownMeter = 'up') : (upDownMeter = 'down');
    let upDownNearby;
    !this.state.nearDown ? (upDownNearby = 'down') : (upDownNearby = 'up');
    console.log('LoaderState');

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
              <Text style={styles.mainHeadiing}>Notifications</Text>
              <View style={{flexDirection: 'row-reverse', flex: 1}}>
                <Menu
                  visible={this.state.visible}
                  onDismiss={this.closeMenu}
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

        <View style={{flex: 1, alignItems: 'center'}}>
          {this.state.LoaderState ? (
            <Loader />
          ) : this.state.notificationData.length < 1 ? (
            <Text
              style={{
                textAlign: 'center',
                marginTop: height * 0.3,
                fontSize: width * 0.05,
              }}>
              No Notifications to show
            </Text>
          ) : (
            <FlatList
              style={{flex: 1}}
              data={this.state.notificationData}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    width: width * 0.95,
                    borderRadius: 10,
                    padding: width * 0.02,
                    margin: width * 0.02,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcon
                    name="notifications"
                    size={width * 0.07}
                    color="black"
                    style={{
                      marginRight: width * 0.01,
                    }}
                  />
                  <View>
                    <Text
                      style={{fontWeight: 'bold', textTransform: 'capitalize'}}>
                      {item.sender_name}
                    </Text>
                    <Text style={{width: width * 0.8}}>{item.message}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    );
  }
}
