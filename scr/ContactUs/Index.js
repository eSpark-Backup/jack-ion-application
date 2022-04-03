import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';

import Help from 'react-native-vector-icons/Feather';
import Phone from 'react-native-vector-icons/Feather';
import Email from 'react-native-vector-icons/Feather';
import TabIcon from 'react-native-vector-icons/MaterialIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import RNBeep from 'react-native-a-beep';

// Components
import {Fonts} from '../utils/fonts';
import styles from './style';
import CustumStatusBar from '../components/StatusBar';

const {width, height} = Dimensions.get('window');
const IC_ARR_DOWN = require('../../Images/down.png');
const IC_ARR_UP = require('../../Images/up.png');

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Support',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="contact-mail" color={tintColor} size={width * 0.05} />
    ),
  };
  constructor() {
    super();
    this.state = {
      down: false,
      points: 80,
      expanded: false,
      asdf: false,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  // _renderMyList = ({ item }) => (
  //   <View style={{ flex: 1, }}>
  //     <View style={style.renderListContainer}>
  //       <Text style={style.renderListHeading1}>
  //         {this.state.date}/{this.state.month}/{this.state.year}
  //       </Text>
  //       <Text style={style.renderListHeading2}>
  //         {this.state.hour}:{this.state.minutes}
  //       </Text>
  //       <Text style={style.renderListHeading1}>
  //         {item}
  //       </Text>
  //     </View>
  //   </View>
  // )
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({meter: !this.state.meter, meterDown: !this.state.meterDown});
  };
  changeLayoutNearby = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({nearby: !this.state.nearby, nearDown: !this.state.nearDown});
  };
  render() {
    let upDownMeter;
    !this.state.meterDown ? (upDownMeter = 'up') : (upDownMeter = 'down');
    let upDownNearby;
    !this.state.nearDown ? (upDownNearby = 'down') : (upDownNearby = 'up');

    return (
      <View style={styles.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}

        <View style={styles.headingContainer}>
          <View style={[styles.headingInner]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                width: width * 0.15,
                height: height * 0.06,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Back
                size={width * 0.08}
                color="white"
                name="keyboard-backspace"
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: width * 0.2,
              }}>
              <Help
                name="help-circle"
                size={width * 0.07}
                color="white"
                style={{
                  marginRight: width * 0.01,
                }}
              />
              <Text style={styles.mainHeadiing}>Support</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          {/* <View style={styles.onlineOfflineView}>
            <View style={styles.onlineView} />
            <Text style={styles.onlineText}>Contact Us</Text>
          </View> */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 40,
              }}>
              <Text style={styles.mainBottonText}>
                Feel free to give us a call
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.insideBottonView, {flexDirection: 'row'}]}
                onPress={() => {
                  Linking.openURL(`tel:844 538 8203`);
                }}>
                <Phone
                  name="phone"
                  size={width * 0.07}
                  style={{
                    marginHorizontal: width * 0.01,
                  }}
                />
                <Text style={{fontSize: width * 0.09, color: 'purple'}}>
                  844-538-8203
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.insideBottonView}>
              <Text
                style={{
                  fontSize: width * 0.05,
                  color: 'black',
                  fontFamily: Fonts.BalooChettan2,
                  paddingTop: 20,
                }}>
                or send us an email
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  Linking.openURL('mailto:jackhowell@ionenergysolutions.com')
                }>
                <Email
                  name="mail"
                  size={width * 0.05}
                  style={{marginHorizontal: width * 0.01}}
                />
                <Text style={styles.emailText}>
                  jackhowell@ionenergysolutions.com
                </Text>
              </TouchableOpacity>
            </View>
            {/* <Button onPress={() => { RNBeep.beep() }} title="Beep Success"></Button>
            <Button onPress={() => { RNBeep.beep(false) }} title="Beep Fail"></Button>
            <Button onPress={() => { RNBeep.PlaySysSound(RNBeep.AndroidSoundIDs.TONE_CDMA_CONFIRM) }} title="Beep Android Custom"></Button>
            <Button onPress={() => { RNBeep.PlaySysSound(45) }} title="Beep Something"></Button>
            <Button onPress={() => { RNBeep.PlaySysSound(RNBeep.iOSSoundIDs.AudioToneError) }} title="Beep iOS Custom"></Button> */}
          </View>
        </View>
      </View>
    );
  }
}
