import React, { Component } from 'react';
import {
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import { Fonts } from '../utils/fonts';
import styles from './style';
import CustumStatusBar from '../components/StatusBar';
import TextReuseableComponent from '../../scr/components/Text/index';

const { width, height } = Dimensions.get('window');
const IC_ARR_DOWN = require('../../Images/down.png');
const IC_ARR_UP = require('../../Images/up.png');

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Support',
    tabBarIcon: ({ tintColor }) => (
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
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ meter: !this.state.meter, meterDown: !this.state.meterDown });
  };
  changeLayoutNearby = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ nearby: !this.state.nearby, nearDown: !this.state.nearDown });
  };

  handleChatClick = () => {
     this.props.navigation.navigate("Chat");
  }
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
              <TextReuseableComponent title style={styles.mainHeadiing} value={"Support"} />
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 40,
              }}>
              <TextReuseableComponent title style={styles.mainBottonText} value={"Feel free to give us a call"} />
            </View>
            <View>
              <TouchableOpacity
                style={[styles.insideBottonView, { flexDirection: 'row' }]}
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
                <TextReuseableComponent title style={{ fontSize: width * 0.09, }} value={"844-538-8203"} />
              </TouchableOpacity>
            </View>
            <View style={styles.insideBottonView}>
              <TextReuseableComponent title style={{
                fontSize: width * 0.05,
                color: 'black',
                fontFamily: Fonts.BalooChettan2,
                paddingTop: 20,
              }} value={"or send us an email"} />
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
                  style={{ marginHorizontal: width * 0.01 }}
                />
                <TextReuseableComponent title style={styles.emailText} value={"jackhowell@ionenergysolutions.com"} />
              </TouchableOpacity>
              <View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.chatModule}>
          <TouchableOpacity onPress={() => this.handleChatClick()}>
            <MaterialCommunityIcons
              name="chat-outline"
              size={width * 0.15}
              color="#25AAE1ec"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
