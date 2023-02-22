import React, {Component} from 'react';
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
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import User from 'react-native-vector-icons/FontAwesome';
import Key from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import {Input} from 'react-native-elements';
import {Fonts} from '../utils/fonts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextReuseableComponent from '../components/Text/index';
import {ActivityIndicator} from 'react-native';
import {Text} from 'react-native';
import API from '../api/SeviceApi';

const {width, height} = Dimensions.get('window');

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pass: '',
      errName: '',
      errPass: '',
      otp: '',
      newPassScreen: false,
      verifyOtpScreen: false,
      sendCodeScreen: false,
      showPassword1: false,
      showPassword2: false,
      isLoading: false,
      verifyPass1: '',
      verifyPass2: '',
    };
  }

  _checkCredentials = async () => {
    if (this.state.email === '') {
      this.setState({
        errName: '*This Field cannot be empty',
        errPass: '*This Field cannot be empty',
      });
      setTimeout(
        () => this.setState({name: '', pass: '', errName: '', errPass: ''}),
        1000,
      );
    } else {
      this.setState({isLoading: true});
      const email = this.state.email;
      const generateCode = await API.post('/auth/generate-code-email', {email});
      console.log('generated', generateCode?.data);

      if (generateCode?.data?.bool) {
        this.setState({
          isLoading: false,
          verifyOtpScreen: true,
        });
      } else {
        this.setState({
          email: '',
          errName: generateCode?.data?.message,
        });
        setTimeout(() => {
          this.setState({
            errName: '',
            isLoading: false,
          });
        }, 3000);
      }
    }
  };

  handleSubmit = async () => {
    if (this.state.verifyPass1 === '' || this.state.verifyPass2 === '') {
      this.setState({
        errPass: '*This Field cannot be empty',
      });
      setTimeout(
        () =>
          this.setState({
            errPass: '',
          }),
        1000,
      );
    } else {
      this.setState({isLoading: true});
      const verifyPass1 = this.state.verifyPass1;
      const verifyPass2 = this.state.verifyPass2;
      const email = this.state.email;
      const createPassword = await API.post('/auth/change-forget-password', {
        email: email,
        newPassword: verifyPass1,
        confirmPassword: verifyPass2,
      });

      if (createPassword?.data?.bool) {
        this.setState({
          name: '',
          email: '',
          pass: '',
          errName: '',
          errPass: '',
          otp: '',
          newPassScreen: true,
          verifyOtpScreen: false,
          sendCodeScreen: false,
          showPassword1: false,
          showPassword2: false,
          isLoading: false,
          verifyPass1: '',
          verifyPass2: '',
        });
        Toast.show('Password changed successfully!', Toast.SHORT);
        this.props.navigation.navigate('Login');
        this.setState({newPassScreen: false});
      } else {
        this.setState({
          verifyPass1: '',
          verifyPass2: '',
          errPass: 'Password was not created!',
          isLoading: false,
        });
        setTimeout(() => {
          this.setState({
            errPass: '',
          });
        }, 3000);
      }
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={true}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
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
          {!this.state.verifyOtpScreen && !this.state.newPassScreen && (
            <>
              <TextReuseableComponent
                title
                value={'Enter your Email to receive OTP'}
              />
              <View style={[styles.textInputContainer, {marginTop: 40}]}>
                <Input
                  keyboardType="email-address"
                  placeholder="Enter your Email"
                  onChangeText={(text) => this.setState({email: text})}
                  containerStyle={{marginBottom: height * 0.09}}
                  leftIcon={
                    <User
                      name="user"
                      color="#06012B"
                      size={width * 0.05}
                      style={{marginBottom: height * 0.005}}
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
              <View
                style={{
                  marginBottom: height * 0.02,
                  marginRight: width * 0.24,
                }}>
                <TextReuseableComponent
                  style={{color: '#A3001B'}}
                  value={this.state.errName}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this._checkCredentials();
                }}>
                <View style={styles.buttonContainer}>
                  {this.state.isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <TextReuseableComponent
                      title
                      style={{
                        color: '#fff',
                      }}
                      value={'Send Code'}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
          {this.state.newPassScreen && (
            <>
              <TextReuseableComponent
                heading
                style={{marginBottom: 30}}
                value={'Create a New Password!'}
              />
              <View style={styles.textInputContainer}>
                <Input
                  secureTextEntry={!this.state.showPassword1}
                  placeholder="Enter New Password"
                  onChangeText={(text) => this.setState({verifyPass1: text})}
                  containerStyle={{marginBottom: height * 0.2}}
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
                      style={{marginBottom: height * 0.005}}
                    />
                  }
                  inputContainerStyle={{
                    borderColor: 'transparent',
                  }}
                  rightIcon={
                    <FontAwesome5
                      onPress={() =>
                        this.setState({
                          showPassword1: !this.state.showPassword1,
                        })
                      }
                      name={`${this.state.showPassword1 ? 'eye-slash' : 'eye'}`}
                      color="#06012B"
                      size={width * 0.04}
                      style={{padding: 5, marginBottom: height * 0.005}}
                    />
                  }
                  value={this.state.verifyPass1}
                />
              </View>
              <View
                style={{
                  marginBottom: height * 0.02,
                  marginRight: width * 0.24,
                }}>
                {/* <TextReuseableComponent title style={{ color: '#A3001B' }} value={this.state.errPass} /> */}
              </View>
              <View style={styles.textInputContainer}>
                <Input
                  secureTextEntry={!this.state.showPassword2}
                  placeholder="Re-type Password"
                  onChangeText={(text) => this.setState({verifyPass2: text})}
                  containerStyle={{marginBottom: height * 0.09}}
                  leftIcon={
                    <Key
                      name="key"
                      color="#06012B"
                      size={width * 0.04}
                      style={{marginBottom: height * 0.005}}
                    />
                  }
                  style={{
                    fontSize: height * 0.02,
                    fontFamily: Fonts.Montserrat,
                    marginBottom: height * 0.005,
                    borderColor: 'transparent',
                  }}
                  inputContainerStyle={{borderColor: 'transparent'}}
                  rightIcon={
                    <FontAwesome5
                      onPress={() =>
                        this.setState({
                          showPassword2: !this.state.showPassword2,
                        })
                      }
                      name={`${this.state.showPassword2 ? 'eye-slash' : 'eye'}`}
                      color="#06012B"
                      size={width * 0.04}
                      style={{padding: 5, marginBottom: height * 0.005}}
                    />
                  }
                  value={this.state.verifyPass2}
                />
              </View>
              <View
                style={{
                  marginBottom: height * 0.015,
                  marginRight: width * 0.24,
                }}>
                <TextReuseableComponent
                  title
                  style={{color: '#A3001B'}}
                  value={this.state.errPass}
                />
              </View>
              <TouchableOpacity
                disabled={this.state.isLoading}
                activeOpacity={0.8}
                onPress={() => {
                  this.handleSubmit();
                }}>
                <View style={styles.buttonContainer}>
                  {this.state.isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <TextReuseableComponent
                      title
                      style={{
                        color: '#fff',
                      }}
                      value={'Create Password'}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
          {this.state.verifyOtpScreen && (
            <>
              <TextReuseableComponent
                title
                value={'Verify your One Time Password!'}
              />
              <View style={[styles.textInputContainer, {marginTop: 40}]}>
                <Input
                  keyboardType="email-address"
                  placeholder="Enter your OTP"
                  onChangeText={(text) => this.setState({otp: text})}
                  containerStyle={{marginBottom: height * 0.09}}
                  leftIcon={
                    <User
                      name="user"
                      color="#06012B"
                      size={width * 0.05}
                      style={{marginBottom: height * 0.005}}
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
              <View
                style={{
                  marginBottom: height * 0.02,
                  marginRight: width * 0.24,
                }}>
                <TextReuseableComponent
                  title
                  style={{color: '#A3001B'}}
                  value={this.state.errName}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  if (this.state.otp === '') {
                    this.setState({
                      errName: '*This Field cannot be empty',
                    });
                    setTimeout(
                      () =>
                        this.setState({
                          name: '',
                          pass: '',
                          errName: '',
                          errPass: '',
                          otp: '',
                        }),
                      1000,
                    );
                  } else {
                    this.setState({isLoading: true});
                    const otp = this.state.otp;
                    const email = this.state.email;
                    const verifyCode = await API.post('/auth/check-otp', {
                      email: email,
                      otp: otp,
                    });
                    console.log('verifyCode', verifyCode?.data);

                    if (verifyCode?.data?.bool) {
                      this.setState({
                        name: '',
                        pass: '',
                        errName: '',
                        errPass: '',
                        otp: '',
                        newPassScreen: true,
                        verifyOtpScreen: false,
                        sendCodeScreen: false,
                        showPassword1: false,
                        showPassword2: false,
                        isLoading: false,
                        verifyPass1: '',
                        verifyPass2: '',
                      });
                    } else {
                      this.setState({
                        otp: '',
                        errName: 'OTP did not match!',
                        isLoading: false,
                      });
                      setTimeout(() => {
                        this.setState({
                          errName: '',
                        });
                      }, 3000);
                    }
                  }
                }}>
                <View style={styles.buttonContainer}>
                  {this.state.isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <TextReuseableComponent
                      title
                      style={{
                        color: '#fff',
                      }}
                      value={'Verify Code'}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
          {this.state.verifyOtpScreen && this.state.sendCodeScreen && (
            <View style={{marginTop: height * 0.05}}>
              <Text>
                Already have an account?
                <Text
                  onPress={() => {
                    this.props.navigation.navigate('Login'),
                      setTimeout(() => {
                        this.setState({
                          name: '',
                          email: '',
                          pass: '',
                          errName: '',
                          errPass: '',
                          otp: '',
                          newPassScreen: true,
                          verifyOtpScreen: false,
                          sendCodeScreen: false,
                          showPassword1: false,
                          showPassword2: false,
                          isLoading: false,
                          verifyPass1: '',
                          verifyPass2: '',
                        });
                      }, 100);
                  }}
                  style={styles.highlightText}>
                  Login!
                </Text>
              </Text>
            </View>
          )}
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
