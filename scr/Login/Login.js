import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './style';
import API from '../api/SeviceApi';
import { connect } from 'react-redux';
import { userLogin } from '../Store/Action/user.action';
import TextReuseableComponent from '../components/Text/index';

const { width, height } = Dimensions.get('window');

const clc = require('cli-color');

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: '',
      errName: '',
      errPass: '',
      isLoading: false,
      showPassword: false
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
      // console.log('INDEX', index);

      // console.log('userDataUpdated', userDataUpdated);

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
    this.setState({ isLoading: true });
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
      this.props.login({...response?.data?.data?.user, token: response?.data?.data?.token})
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
      <KeyboardAwareScrollView style={styles.container}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={true}>
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
              style={styles.logoImg}
            />
          </View>
          <View style={{ marginBottom: height * 0.05 }}>
          <Text style={styles.titleText}>
              Sign In into
              <Text style={styles.highlightText}> ION</Text>
            </Text>
          </View>
          <Formik
            initialValues={{
              email: 'test2@gmail.com',
              password: '}}UYLWG$q^YXe5#]',
            }}
            onSubmit={(values) => {
              // console.log(values);
              NetInfo.fetch().then((state) => {
                // console.log('Is connected?', state.isConnected);
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
                  <FontAwesome
                    name="user"
                    color="#06012B"
                    size={width * 0.035}
                    style={{ padding: 5 }}
                  />
                  <TextInput
                    value={values.email}
                    keyboardType="email-address"
                    placeholder="Enter Email"
                    placeholderTextColor="#5B5B61"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('email')}
                    onChange={() => this.setState({ errName: '', errPass: '' })}
                    onBlur={() => setFieldTouched('email')}
                    style={styles.input}
                  />
                </View>
                <View style={styles.errorView}>
                  {touched.email && (
                    <TextReuseableComponent title style={{ color: '#A3001B' }} value={errors.email || this.state.errName} />
                  )}
                </View>
                <View style={styles.textInputContainer}>
                  <FontAwesome5
                    name="key"
                    color="#06012B"
                    size={width * 0.035}
                    style={{ padding: 5 }}
                  />
                  <TextInput
                    value={values.password}
                    secureTextEntry={this.state.showPassword ? false : true }
                    placeholder="Enter Password"
                    underlineColorAndroid="transparent"
                    onChangeText={handleChange('password')}
                    onChange={() => this.setState({ errPass: '', errName: '' })}
                    onBlur={() => setFieldTouched('password')}
                    placeholderTextColor="#5B5B61"
                    style={styles.input}
                  />
                  <FontAwesome5
                    onPress={() => this.setState({ showPassword: !this.state.showPassword })}
                    name={`${this.state.showPassword ? 'eye-slash' : 'eye'}`}
                    color="#06012B"
                    size={width * 0.035}
                    style={{ padding: 5 }}
                  />
                </View>
                <View style={styles.errorView}>
                  {touched.password && (
                    <TextReuseableComponent title style={{
                      color: '#A3001B',
                    }} value={errors.password || this.state.errPass} />
                  )}
                </View>
                <TouchableOpacity
                  style={{ marginTop: width * 0.05 }}
                  activeOpacity={0.8}
                  onPress={handleSubmit}>
                  <View style={styles.buttonContainer}>
                    {this.state.isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <TextReuseableComponent title style={styles.btnText} value={"Login"} />
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={{ marginTop: height * 0.05 }}>
            <TouchableOpacity
              disabled
              onPress={() => {
                this.props.navigation.navigate('SignUp');
                setTimeout(() => {
                  this.setState({ errName: '', errPass: '' });
                }, 100);
              }}>
              <View style={{ width: width * 0.75, alignItems: 'center' }}>
                <TextReuseableComponent title style={styles.bottomText} value={"Not a Member Yet? Contact Administrator"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* <StatusBar
          hidden
          backgroundColor="#155AAA"
          barStyle="default"
          showHideTransition={'fade'}
        /> */}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    login: (user) => dispatch(userLogin(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
