import React, { Component, Fragment, version } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TextInput,
  Animated,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Tool from 'react-native-vector-icons/Entypo';
import Cast from 'react-native-vector-icons/Feather';
import Scan from 'react-native-vector-icons/Ionicons';
import Test from 'react-native-vector-icons/Entypo';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';


import Modal from 'react-native-modal';

// Components
import { Fonts } from '../utils/fonts';

import styles from './style';
import { Ellipse } from 'react-native-svg';
import { ceil, set } from 'react-native-reanimated';
import style from '../Home/style';
const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Tools',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon name="toolbox" color={tintColor} size={height * .033} />
    )
  };
  constructor() {
    super();
    this.state = {
      isVisible: false,
      barcodes: [],
      scan: false,
      scanResult: false,
      result: null,
      animatedValue: new Animated.Value(0),
      springValue: new Animated.Value(0),
      count: 0
    };
    //Settin up an interval for the counter

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  onSuccess = (e) => {
    const check = e.data.substring(0, 4);
    console.log('scanned' + check)
    this.setState({ barcodes: e })
    console.log('Barcodes' + this.state.barcodes)
    this.setState({
      result: e,
      scan: false,
      scanResult: true,
    })
    if (check == 'http') {
      Linking
        .openURL(e.data)
        .catch(err => console.error('An error occured', err))
    } else {
      this.setState({
        result: e,
        scan: false,
        scanResult: true,
      })
    }
  };
  scanAgain = () => {
    this.setState({
      scan: true,
      scanResult: false,
    })
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => Animated.spring(
        this.state.springValue,
        {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        }
      ).start()
      ),
      this.props.navigation.addListener("willBlur", () => this.setState({ springValue: new Animated.Value(0) }))
    ];
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

    });
  }

  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000
    }).start();
  };
  hasCameraPermission = async () => {
  };
  toggleModal = async () => {

    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA,
      )
      if (granted === true) {
        this.setState({ hasAccess: true })
        this.setState({ isVisible: !this.state.isVisible })
        this.setState({ scanResult: false })
        this.setState({ scan: true })
        console.log('Access',)
      } else {
        this.setState({ hasAccess: false })
        Alert.alert("You don't have access for the Camera",
          'Kindly TurnOn Camera Permission from Settings to use Scanner',

        );
        console.log('Denied',)
      }
      return granted
    }
    catch (err) {
      alert(err)
    }

  }
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ meter: !this.state.meter, meterDown: !this.state.meterDown, animatedValue: new Animated.Value(0) });
    setTimeout(() => {
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    }, 10);
    // Animated.timing(this.state.animatedValue, {
    //   toValue: 1,
    //   duration: 1000,
    //   useNativeDriver: true
    // }).start();
  }
  render() {
    let { animatedValue, springValue } = this.state;
    const { result, scan, scanResult } = this.state;
    return (

      <View style={styles.container}>
        <Modal
          animationIn='bounceInUp'
          animationOut='bounceInDown'
          // backdropColor='black'
          backdropOpacity={5}
          isVisible={this.state.isVisible}
        >
          <View style={{
            flex: 1,
            justifyContent: "space-around",
            borderRadius: width * .02
            // height: height * .6,
            // alignItems: "center",
          }} >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: width * .08 }}>Hello Scanner</Text>
            {scan &&
              <RNCamera
                ref={ref => {
                  this.camera = ref
                }}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                autoFocus='on'
                onBarCodeRead={this.onSuccess}
                captureAudio={false}
              // onGoogleVisionBarcodesDetected={this.onSuccess}
              // androidCameraPermissionOptions={{
              //   title: "Open Camera",
              //   message: "Open Open",
              //   buttonPositive: 'OK',
              //   buttonNegative: "Not Ok",
              // }}
              >
                <BarcodeMask outerMaskOpacity={0} />
                {/* <View style={{ height: height * .3, width: width * .6, borderWidth: width * .006, borderColor: 'yellow' }} /> */}
              </RNCamera>
            }
            {scanResult &&
              <Fragment>
                <Text style={{ color: 'white', textAlign: "center", fontSize: width * .08 }} >Result.!</Text>
                <View style={{ height: height * .4, backgroundColor: 'white', justifyContent: 'center', alignItems: "center", }}>
                  <Text>Type:{result.type}</Text>
                  <Text>Result:{result.data}</Text>
                  <Text numberOfLines={1}>Raw Data:{result.rawData}</Text>
                </View>
              </Fragment>
            }
            <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: height * .02 }}>
              {scanResult &&
                <View>
                  <TouchableOpacity onPress={this.scanAgain}>
                    <View style={{ backgroundColor: '#25AAE1', borderRadius: width * .008, height: height * .05, width: width * .4, justifyContent: 'center' }}>
                      <Text style={{ textAlign: "center", color: 'white', fontWeight: 'bold' }} >Scan Again</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={{ textAlign: "center", color: "white" }}>OR</Text>
                </View>
              }
              <TouchableOpacity onPress={this.toggleModal}>
                <View style={{ backgroundColor: 'white', borderRadius: width * .008, height: height * .05, justifyContent: 'center', width: width * .4 }}>
                  <Text style={{ textAlign: "center", color: '#25AAE1', fontWeight: 'bold' }} >Switch Off Scanner</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <StatusBar backgroundColor="white" barStyle="default" />
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.menuView}>
              <Back size={width * .08} color='white' name='keyboard-backspace' />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <Search name='search' size={height * .04} style={{ marginLeft: width * .05 }} color='white' />
              <TextInput
                placeholderTextColor='white'
                placeholder='Search'
                style={styles.search}
                onChangeText={e => this.setState({ currentWei: e })}
              />
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Tool name="tools" size={height * .03} color='white' style={styles.toolIcon} />
            <Text style={styles.mainHeadiing}>
              Tools
            </Text>
          </View>
        </View>
        <View style={styles.toolContainer}>
          <Animated.View
            style={{
              transform: [{ scale: springValue }]
            }}
          >
            <TouchableOpacity style={styles.toolButton}
              onPress={() => console.log('helo')}
            >
              <Image
                source={require('../../Images/profileBack.jpg')}
                style={styles.toolImage}
              />
              <Cast name="cast" size={height * .06} color='white' />
              <View>
                <Text style={styles.toolName}>
                  Direct Connect
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ scale: springValue }]
            }}
          >
            <TouchableOpacity style={styles.toolButton}
              onPress={this.toggleModal}
            >
              <Image
                source={require('../../Images/profileBack.jpg')}
                style={styles.toolImage}
              />
              <Scan name="barcode-sharp" size={height * .06} color='white' />
              <View>
                <Text style={styles.toolName}>
                  Barcode Scanner
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ scale: springValue }]
            }}
          >
            <TouchableOpacity style={styles.toolButton}
              onPress={() => console.log('helo')}
            >
              <Image
                source={require('../../Images/profileBack.jpg')}
                style={styles.toolImage}
              />
              <Test name="signal" size={height * .06} color='white' />
              <View>
                <Text style={styles.toolName}>
                  Test Connect
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View >
    );
  }
}