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
} from 'react-native';

//Packages
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Logout from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SystemSetting from 'react-native-system-setting';
import CustumStatusBar from '../components/StatusBar';

// Components

import style from './style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Drawer from '../components/modal/Drawer';

const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      alertsType: [
        {
          title: 'Equipment Health Alerts',
          icon: 'heart',
          data: [
            {
              title: 'Tamper',
              desc: 'Detect when someone has tampered with your equipment.',
              value: false,
            },
            {
              title: 'Connection',
              desc: 'Detect when equipment goes offline.',
              value: false,
            },
            {
              title: 'Power Loss',
              desc: 'Detect when your equipment is unplugged from power.',
              value: false,
            },
            {
              title: 'Battery',
              desc: 'Detect when batteries start running slow.',
              value: false,
            },
          ],
        },
        {
          title: 'Smart Security Alerts',
          icon: 'shield',
          data: [
            {
              title: 'Temperature',
              desc: 'Detect when the temperature at a meter reaches.',
              value: false,
            },
            {
              title: 'Consumption',
              desc: 'Detect unusual spike in usage such as running toilet.',
              value: false,
            },
            {
              title: 'Water Leak Sensor',
              desc:
                'Detect physical water leaks utilizing the ION Energy Leak Sensor',
              value: 'Coming Soon',
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }

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
                marginLeft: width * 0.22,
              }}>
              <Feather
                name="alert-triangle"
                size={width * 0.07}
                color="white"
                style={{
                  marginRight: width * 0.01,
                }}
              />
              <Text style={style.mainHeadiing}>Alerts</Text>
            </View>
          </View>
        </View>
        {/* <View style={style.headingContainer}>
          <View style={style.headingInner}>
            <Feather
              name="alert-triangle"
              size={height * 0.035}
              style={{paddingRight: 5}}
              color="white"
            />
            <Text style={style.mainHeadiing}>Alerts</Text>
          </View>
        </View> */}
        <ScrollView
          style={{height: height * 1, width: width * 1}}
          showsVerticalScrollIndicator={false}>
          <View style={style.containView}>
            {/* <View style={style.containerReset}>
              <Feather
                name="alert-triangle"
                size={height * 0.035}
                style={{paddingRight: 5}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Alerts</Text>
            </View> */}
            <SectionList
              sections={this.state.alertsType}
              renderItem={({item}) => (
                <View style={style.containerInner}>
                  <View>
                    <Text style={style.mainHeadiingItems}>{item.title}</Text>
                    <Text style={style.sideHeadingItems}>{item.desc}</Text>
                  </View>
                  {item.value == 'Coming Soon' ? (
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
                        value={item.value}
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
          </View>
        </ScrollView>
      </View>
    );
  }
}
