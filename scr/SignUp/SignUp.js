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
} from 'react-native';
import User from 'react-native-vector-icons/FontAwesome';
import Key from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import {Input} from 'react-native-elements';
import {Fonts} from '../utils/fonts';

const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: '',
      errName: '',
      errPass: '',
    };
  }

  _checkCredentials = () => {
    if (this.state.name === '' || this.state.pass === '') {
      this.setState({
        errName: '*This Field cannot be empty',
        errPass: '*This Field cannot be empty',
      });
    } else {
      this.props.navigation.navigate('Home');
      this.setState({
        errName: '',
        errPass: '',
      });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../Images/loogo.png')}
            resizeMode="contain"
            style={{
              //   backgroundColor: 'pink',
              width: width * 0.3,
              height: height * 0.15,
            }}
          />
        </View>
        <View style={{marginBottom: height * 0.05}}>
          <Text
            style={{
              fontSize: height * 0.025,
              // color: '#fff',
              fontFamily: Fonts.Montserrat,
            }}>
            Sign Up into{' '}
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: height * 0.035,
                color: '#35AFE2',
              }}>
              ION
            </Text>
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <Input
            keyboardType="email-address"
            placeholder="Username or Email"
            placeholderTextColor="#5B5B61"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({name: text})}
            containerStyle={{marginBottom: height * 0.09}}
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
        <View style={{marginBottom: height * 0.02, marginRight: width * 0.24}}>
          <Text style={{color: '#A3001B'}}>{this.state.errName}</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Input
            secureTextEntry
            placeholder="Enter Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="#5B5B61"
            onChangeText={(text) => this.setState({pass: text})}
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
                size={height * 0.029}
                style={{marginBottom: height * 0.005}}
              />
            }
            inputContainerStyle={{
              borderColor: 'transparent',
            }}
          />
        </View>
        <View style={{marginBottom: height * 0.02, marginRight: width * 0.24}}>
          <Text style={{color: '#A3001B'}}>{this.state.errPass}</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Input
            secureTextEntry
            placeholder="Re-type Password"
            underlineColorAndroid="transparent"
            placeholderTextColor="#5B5B61"
            onChangeText={(text) => this.setState({pass: text})}
            containerStyle={{marginBottom: height * 0.09}}
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
            inputContainerStyle={{borderColor: 'transparent'}}
          />
        </View>
        <View style={{marginBottom: height * 0.05, marginRight: width * 0.24}}>
          <Text style={{color: '#A3001B'}}>{this.state.errPass}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this._checkCredentials();
          }}>
          <View style={styles.buttonContainer}>
            <Text
              style={{
                fontSize: height * 0.022,
                color: '#fff',
                fontFamily: Fonts.Montserrat,
              }}>
              Sign Up
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{marginTop: height * 0.05}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Login'),
                setTimeout(() => {
                  this.setState({errName: '', errPass: ''});
                }, 100);
            }}>
            <Text
              style={{
                fontSize: height * 0.022,
                // color: '#fff',
                fontFamily: Fonts.Montserrat,
              }}>
              Already have an account? Login!
            </Text>
          </TouchableOpacity>
        </View>
        <StatusBar hidden
          backgroundColor="#155AAA"
          barStyle="default"
          showHideTransition={'fade'}
        />
      </KeyboardAvoidingView>
    );
  }
}
