import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import User from 'react-native-vector-icons/FontAwesome';
import Key from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import {Input} from 'react-native-elements';
import {Fonts} from '../utils/fonts';
import {create} from 'apisauce';
import {Formik} from 'formik';
import Base_URL from '../api/WebServices';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const {width, height} = Dimensions.get('window');

const clc = require('cli-color');

const api = create({baseURL: Base_URL});

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: '',
      errName: '',
      errPass: '',
      isLoading: false,
    };
  }

  //todo: For testing enter email: bednar.douglas@example.net
  //todo: For testing enter password: password

  setLoggedIn = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', '1');
    } catch (e) {
      console.log('error aya at setting', e);
    }
  };

  storeToken = async (token) => {
    try {
      await EncryptedStorage.setItem('user_token', token);
      await AsyncStorage.setItem('token', token);
      console.log('Stored Token Success', clc.xterm(216)(token));
    } catch (e) {
      console.log('Store Token Failed', e);
    }
  };

  _checkCredentials = async (email, password) => {
    this.setState({isLoading: true});
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    console.log('yaa', response); //? this has token
    console.log(response.ok);
    if (!response.ok) {
      this.setState({
        errName: '*Incorrect Username or Password',
        errPass: '*Incorrect Username or Password',
        isLoading: false,
      });
    } else if (response?.ok) {
      this.storeToken(response.data.data.token); //todo: Token Saved this point
      this.props.navigation.navigate('Home');
      this.setState({
        errName: '',
        errPass: '',
        isLoading: false,
      });
      this.setLoggedIn();
    } else {
      this.setState({
        errName: '',
        errPass: '',
        isLoading: false,
      });
    }
  };

  render() {
    return (
      <>
        <KeyboardAvoidingView style={styles.container}>
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
          <View style={{marginBottom: height * 0.05}}>
            <Text
              style={{
                fontSize: height * 0.025,
                fontFamily: Fonts.Montserrat,
              }}>
              Sign In into
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: height * 0.035,
                  color: '#35AFE2',
                }}>
                {' '}
                ION
              </Text>
            </Text>
          </View>
          <Formik
            initialValues={{
              email: 'esparktest@gmail.com',
              password: '12345678',
            }}
            onSubmit={(values) => {
              console.log(values);
              this._checkCredentials(values.email, values.password);
              values.email = '';
              values.password = '';
            }}
            validationSchema={validationSchema}>
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
              values,
            }) => (
              <>
                <View style={styles.textInputContainer}>
                  <Input
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter Email"
                    placeholderTextColor="#5B5B61"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('email')}
                    onChange={() => this.setState({errName: '', errPass: ''})}
                    onBlur={() => setFieldTouched('email')}
                    leftIcon={
                      <User
                        name="user"
                        color="#06012B"
                        size={height * 0.029}
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
                  />
                </View>
                <View
                  style={{
                    width: width,
                    marginBottom: height * 0.02,
                    // marginLeft: width * 0.15,
                    // justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'blue',
                  }}>
                  {touched.email ? (
                    <Text style={{color: 'red'}}>
                      {errors.email || this.state.errName}
                    </Text>
                  ) : (
                    <View style={{height: height * 0.02}} />
                  )}
                </View>
                <View style={[styles.textInputContainer]}>
                  <Input
                    value={values.password}
                    secureTextEntry
                    placeholder="Enter Password"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('password')}
                    onChange={() => this.setState({errPass: '', errName: ''})}
                    onBlur={() => setFieldTouched('password')}
                    placeholderTextColor="#5B5B61"
                    leftIcon={
                      <Key
                        name="key"
                        color="#06012B"
                        size={height * 0.029}
                        style={{marginBottom: height * 0.005}}
                      />
                    }
                    style={{
                      fontSize: height * 0.02,
                      fontFamily: Fonts.Montserrat,
                      marginBottom: height * 0.005,
                      borderColor: 'transparent',
                    }}
                    inputContainerStyle={{
                      borderColor: 'transparent',
                    }}
                  />
                </View>
                <View
                  style={{
                    width: width,
                    marginBottom: height * 0.05,
                    alignItems: 'center',
                    // marginLeft: width * 0.15,
                  }}>
                  {touched.password ? (
                    <Text style={{color: 'red'}}>
                      {errors.password || this.state.errPass}
                    </Text>
                  ) : (
                    <View style={{height: height * 0.02}} />
                  )}
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit}>
                  <View style={styles.buttonContainer}>
                    {this.state.isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text
                        style={{
                          fontSize: height * 0.022,
                          color: '#fff',
                          fontFamily: Fonts.Montserrat,
                        }}>
                        Login
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{marginLeft: width * 0.35, marginTop: height * 0.01}}>
            <TouchableOpacity
              disabled
              onPress={() => Alert.alert('In Progress')}>
              <Text
                style={{
                  fontSize: height * 0.02,
                  fontFamily: Fonts.Montserrat,
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: height * 0.05}}>
            <TouchableOpacity
              disabled
              onPress={() => {
                this.props.navigation.navigate('SignUp');
                setTimeout(() => {
                  this.setState({errName: '', errPass: ''});
                }, 100);
              }}>
              <View style={{width: width * 0.75, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: height * 0.022,
                    fontFamily: Fonts.Montserrat,
                    textAlign: 'center',
                  }}>
                  Not a Member Yet? Contact Administrator
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <StatusBar
            backgroundColor="#155AAA"
            barStyle="default"
            hidden={false}
            showHideTransition={'fade'}
          />
        </KeyboardAvoidingView>
      </>
    );
  }
}
