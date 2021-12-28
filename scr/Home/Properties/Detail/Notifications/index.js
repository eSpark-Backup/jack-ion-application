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
import {create} from 'apisauce';
import EncryptedStorage from 'react-native-encrypted-storage';

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
      notificationData: [
        // {
        //   title: 'New Property Added',
        //   content: 'New Property Added with the name of ABC',
        // },
        // {
        //   title: 'New Unit Added',
        //   content: 'New Unit Added in the XYZ Building',
        // },
        // {title: 'New Meter Added', content: 'New Meter Added in the ABC Unit'},
        // {
        //   title: 'XYZ Unit Updated',
        //   content: 'XYZ Unit Updated in the ABC building',
        // },
        // {
        //   title: 'New Building Added',
        //   content: 'New Building Added in the XYZ property',
        // },
      ],
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
    const notificationsRes = await api.get(
      '/property/equipment/meter/notification-show',
    );

    console.log('Notifications Response', notificationsRes?.data?.data?.notify);
    this.setState({notificationData: notificationsRes?.data?.data?.notify});
    this.setState({LoaderState: false});
  }

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
                    <Text>{item.message}</Text>
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
