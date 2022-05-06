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
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import API from '../api/SeviceApi';

const {width, height} = Dimensions.get('window');

const clc = require('cli-color');

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

  //todo: For testing enter email: superadmin@email.com
  //todo: For testing enter password: admin123$

  setLoggedIn = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', '1');
    } catch (e) {
      console.log('error aya at setting', e);
    }
  };

  storeToken = async (token, userRole, userId) => {
    try {
      await EncryptedStorage.setItem('user_token', token);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user_role', userRole);
      await AsyncStorage.setItem('user_id', userId.toString());
      console.log('Stored Token Success', clc.xterm(216)(token));
    } catch (e) {
      console.log('Store Token Failed', e);
    }
  };
  storeUserData = async (userdata, userId) => {
    const userData = await AsyncStorage.getItem('users_data');
    const gotUserData = JSON.parse(userData);
    let userDataUpdated = [];
    try {
      let index = -1;
      if (gotUserData != null) {
        index = gotUserData
          .map((e) => {
            return e.id;
          })
          .indexOf(userId);
        userDataUpdated = [...gotUserData];
      }
      console.log('INDEX', index);

      console.log('userDataUpdated', userDataUpdated);

      let data = {
        id: userdata.id,
        recent_properties:
          index > -1 ? gotUserData[index].recent_properties : [],
      };

      index > -1 ? (userDataUpdated[index] = data) : userDataUpdated.push(data);
      const jsonData = JSON.stringify(userDataUpdated);
      await AsyncStorage.setItem('users_data', jsonData);
    } catch (e) {
      console.log('Store Data Failed', e);
    }
  };

  _checkCredentials = async (email, password) => {
    this.setState({isLoading: true});
    const response = await API.post('/auth/login', {
      email,
      password,
    });
    if (!response.ok) {
      alert(response?.data?.message);
      this.setState({
        isLoading: false,
      });
    } else if (response?.ok) {
      this.storeUserData(response.data.data.user, response.data.data.user.id); //todo: Token Saved at this point
      this.storeToken(
        response.data.data.token,
        response.data.data.user.role_id,
        response.data.data.user.id,
      ); //todo: Token Saved at this point
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
              style={styles.logoImg}
            />
          </View>
          <View style={{marginBottom: height * 0.05}}>
            <Text style={styles.titleText}>
              Sign In into
              <Text style={styles.highlightText}> ION</Text>
            </Text>
          </View>
          <Formik
            initialValues={{
              // email: 'superadmin@email.com',
              // password: 'admin123$',
              email: 'test2@gmail.com',
              password: '}}UYLWG$q^YXe5#]',
            }}
            onSubmit={(values) => {
              console.log(values);
              NetInfo.fetch().then((state) => {
                console.log('Is connected?', state.isConnected);
                if (state.isConnected) {
                  this._checkCredentials(values.email, values.password);
                  values.email = '';
                  values.password = '';
                } else {
                  alert('Check Your Internet Connection');
                }
              });
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
                  <User
                    name="user"
                    color="#06012B"
                    size={width * 0.035}
                    style={{padding: 5}}
                  />
                  <TextInput
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter Email"
                    placeholderTextColor="#5B5B61"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('email')}
                    onChange={() => this.setState({errName: '', errPass: ''})}
                    onBlur={() => setFieldTouched('email')}
                    style={styles.input}
                  />
                </View>
                <View style={styles.errorView}>
                  {touched.email && (
                    <Text style={{color: '#A3001B'}}>
                      {errors.email || this.state.errName}
                    </Text>
                  )}
                </View>
                <View style={styles.textInputContainer}>
                  <Key
                    name="key"
                    color="#06012B"
                    size={width * 0.035}
                    style={{padding: 5}}
                  />
                  <TextInput
                    value={values.password}
                    secureTextEntry
                    placeholder="Enter Password"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('password')}
                    onChange={() => this.setState({errPass: '', errName: ''})}
                    onBlur={() => setFieldTouched('password')}
                    placeholderTextColor="#5B5B61"
                    style={styles.input}
                  />
                </View>
                <View style={styles.errorView}>
                  {touched.password && (
                    <Text
                      style={{
                        color: '#A3001B',
                      }}>
                      {errors.password || this.state.errPass}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{marginTop: width * 0.05}}
                  activeOpacity={0.8}
                  onPress={handleSubmit}>
                  <View style={styles.buttonContainer}>
                    {this.state.isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.btnText}>Login</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{marginLeft: width * 0.35, marginTop: height * 0.01}}>
            {/* <TouchableOpacity
              disabled
              onPress={() => Alert.alert('In Progress')}>
              <Text
                style={{
                  fontSize: height * 0.02,
                  fontFamily: Fonts.Montserrat,
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity> */}
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
                <Text style={styles.bottomText}>
                  Not a Member Yet? Contact Administrator
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <StatusBar
            hidden
            backgroundColor="#155AAA"
            barStyle="default"
            showHideTransition={'fade'}
          />
        </KeyboardAvoidingView>
      </>
    );
  }
}
