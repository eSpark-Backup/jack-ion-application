import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Dimensions,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import User from 'react-native-vector-icons/FontAwesome';
import Key from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import { Input } from 'react-native-elements';
import { Fonts } from '../utils/fonts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextReuseableComponent from '../components/Text/index';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pass: '',
      errName: '',
      errPass: '',
      newPassScreen: false,
      verifyOtpScreen: false,
      sendCodeScreen: false,
      showPassword1: false,
      showPassword2: false,
      isLoading: false,
      verifyPass1: '',
      verifyPass2: ''
    };
  }

  _checkCredentials = () => {
    if (this.state.email === '') {
      this.setState({
        errName: '*This Field cannot be empty',
        errPass: '*This Field cannot be empty',
      });
      setTimeout(() => this.setState({ name: "", pass: "", errName: "", errPass: "" }), 1000)
    } else {

      this.setState({
        name: '',
        pass: '',
        errName: '',
        errPass: '',
        otp: '',
        newPassScreen: false,
        verifyOtpScreen: true
      });
    }
  };

  handleSubmit = () => {
    if (this.state.verifyPass1 === '' || this.state.verifyPass2 === '') {
      this.setState({
        errPass: '*This Field cannot be empty',
      });
      setTimeout(() => this.setState({
        errPass: ''
      }), 1000)
    } else {
      this.setState({
        isLoading: true,
        verifyPass1: '',
        verifyPass2: ''
      });
      setTimeout(() => this.setState({
        isLoading: false,
      }), 3000)
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps={'handled'}
      // scrollEnabled={true}
      >
        <View style={{
          flex: 1,
          height: height * .8,
          alignItems: "center",
          justifyContent: 'center'
        }} >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../Images/loogo.png')}
            resizeMode="contain"
            style={{
              width: width * 0.3,
              height: height * 0.15,
            }}
          />
        </View>
        {!this.state.verifyOtpScreen && !this.state.newPassScreen && <>
          <TextReuseableComponent value={"Enter your Email to receive OTP"} />
          <View style={[styles.textInputContainer, { marginTop: 20 }]}>
            <Input
              keyboardType="email-address"
              placeholder="Enter your Email"
              onChangeText={(text) => this.setState({ email: text })}
              containerStyle={{ marginBottom: height * 0.09 }}
              leftIcon={
                <User
                  name="user"
                  color="#06012B"
                  size={width * 0.05}
                  style={{ marginBottom: height * 0.005 }}
                />
              }
              inputContainerStyle={{
                borderColor: 'transparent',
              }}
              style={{
                fontSize: height * 0.018,
                fontFamily: Fonts.Montserrat,
                marginBottom: height * 0.005,
                borderColor: 'transparent',

              }}
              value={this.state.email}
            />
          </View>
          <View style={{ marginBottom: height * 0.02, marginRight: width * 0.24 }}>
            <TextReuseableComponent title style={{ color: '#A3001B' }} value={this.state.errName} />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this._checkCredentials();
            }}>
            <View style={styles.buttonContainer}>
              <TextReuseableComponent title style={{
                color: '#fff',
              }} value={"Send Code"} />
            </View>
          </TouchableOpacity></>}
        {this.state.newPassScreen && <>
          <TextReuseableComponent heading style={{ marginBottom: 20 }} value={"Create a New Password!"} />
          <View style={styles.textInputContainer}>
            <Input
              secureTextEntry={!this.state.showPassword1}
              placeholder="Enter New Password"
              onChangeText={(text) => this.setState({ verifyPass1: text })}
              containerStyle={{ marginBottom: height * 0.2 }}
              style={{
                fontSize: height * 0.02,
                fontFamily: Fonts.Montserrat,
                marginBottom: height * 0.005,
                borderColor: 'transparent',
              }}
              leftIcon={
                <Key
                  name="key"
                  color="#06012B"
                  size={width * 0.04}
                  style={{ marginBottom: height * 0.005 }}
                />
              }
              inputContainerStyle={{
                borderColor: 'transparent',
              }}
              rightIcon={
                <FontAwesome5
                  onPress={() => this.setState({ showPassword1: !this.state.showPassword1 })}
                  name={`${this.state.showPassword1 ? 'eye-slash' : 'eye'}`}
                  color="#06012B"
                  size={width * 0.04}
                  style={{ padding: 5, marginBottom: height * 0.005 }}
                />
              }
              value={this.state.verifyPass1}
            />

          </View>
          <View style={{ marginBottom: height * 0.02, marginRight: width * 0.24 }}>
            {/* <TextReuseableComponent title style={{ color: '#A3001B' }} value={this.state.errPass} /> */}
          </View>
          <View style={styles.textInputContainer}>
            <Input
              secureTextEntry={!this.state.showPassword2}
              placeholder="Re-type Password"
              onChangeText={(text) => this.setState({ verifyPass2: text })}
              containerStyle={{ marginBottom: height * 0.09 }}
              leftIcon={
                <Key
                  name="key"
                  color="#06012B"
                  size={width * 0.04}
                  style={{ marginBottom: height * 0.005 }}
                />
              }
              style={{
                fontSize: height * 0.02,
                fontFamily: Fonts.Montserrat,
                marginBottom: height * 0.005,
                borderColor: 'transparent',
              }}
              inputContainerStyle={{ borderColor: 'transparent' }}
              rightIcon={
                <FontAwesome5
                  onPress={() => this.setState({ showPassword2: !this.state.showPassword2 })}
                  name={`${this.state.showPassword2 ? 'eye-slash' : 'eye'}`}
                  color="#06012B"
                  size={width * 0.04}
                  style={{ padding: 5, marginBottom: height * 0.005 }}
                />
              }
              value={this.state.verifyPass2}
            />
          </View>
          <View style={{ marginBottom: height * 0.05, marginRight: width * 0.24 }}>
            <TextReuseableComponent title style={{ color: '#A3001B' }} value={this.state.errPass} />
          </View>
          <TouchableOpacity
            disabled={this.state.isLoading}
            activeOpacity={0.8}
            onPress={() => {
              this.handleSubmit();
            }}>
            <View style={styles.buttonContainer}>
              {this.state.isLoading ? <ActivityIndicator color="white" size="small" /> : <TextReuseableComponent title style={{
                color: '#fff',
              }} value={"Create Password"} />}
            </View>
          </TouchableOpacity>
        </>}
        {this.state.verifyOtpScreen && <>
          <TextReuseableComponent title value={"Verify your One Time Password!"} />
          <View style={[styles.textInputContainer, { marginTop: 40 }]}>
            <Input
              keyboardType="email-address"
              placeholder="Enter your OTP"
              onChangeText={(text) => this.setState({ otp: text })}
              containerStyle={{ marginBottom: height * 0.09 }}
              leftIcon={
                <User
                  name="user"
                  color="#06012B"
                  size={width * 0.05}
                  style={{ marginBottom: height * 0.005 }}
                />
              }
              inputContainerStyle={{
                borderColor: 'transparent',
              }}
              style={{
                fontSize: height * 0.02,
                fontFamily: Fonts.Montserrat,
                marginBottom: height * 0.005,
                borderColor: 'transparent',
              }}
              value={this.state.otp}
            />
          </View>
          <View style={{ marginBottom: height * 0.02, marginRight: width * 0.24 }}>
            <TextReuseableComponent title style={{ color: '#A3001B' }} value={this.state.errName} />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (this.state.otp === '') {
                this.setState({
                  errName: '*This Field cannot be empty',
                })
                setTimeout(() => this.setState({
                  name: '',
                  pass: '',
                  errName: '',
                  errPass: '',
                  otp: ''
                }), 1000)
              } else {
                this.setState({
                  name: '',
                  pass: '',
                  errName: '',
                  errPass: '',
                  otp: '',
                  newPassScreen: true,
                  verifyOtpScreen: false
                });
              }
            }}>
            <View style={styles.buttonContainer}>
              <TextReuseableComponent title style={{
                color: '#fff',
              }} value={"Verify Code"} />
            </View>
          </TouchableOpacity></>}
        <View style={{ marginTop: height * 0.05 }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Login'),
                setTimeout(() => {
                  this.setState({ errName: '', errPass: '' });
                }, 100);
            }}>
            <TextReuseableComponent title value={"Already have an account? Login!"} />
          </TouchableOpacity>
        </View>
        </View>
        {/* <StatusBar hidden
          backgroundColor="#155AAA"
          barStyle="default"
          showHideTransition={'fade'}
        /> */}
      </KeyboardAwareScrollView>
    );
  }
}
