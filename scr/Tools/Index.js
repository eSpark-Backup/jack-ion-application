import React, {Component, Fragment, version} from 'react';

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
  Platform,
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
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import Base_URL from '../api/WebServices';
import {create} from 'apisauce';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../components/Loader';
import {withNavigation} from 'react-navigation';
import {PERMISSIONS, check, RESULTS} from 'react-native-permissions';

import Modal from 'react-native-modal';

// Components
import {Fonts} from '../utils/fonts';

import styles from './style';
import {Ellipse} from 'react-native-svg';
import {ceil, set} from 'react-native-reanimated';
import style from '../Home/style';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustumStatusBar from '../components/StatusBar';
import Toast from 'react-native-simple-toast';
const {width, height} = Dimensions.get('window');

class Tools extends Component {
  static navigationOptions = {
    title: 'Tools',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="toolbox" color={tintColor} size={height * 0.033} />
    ),
  };

  constructor() {
    super();
    this.state = {
      isVisible: false,
      barcodes: [],
      loader: false,
      scan: false,
      scanResult: false,
      result: null,
      animatedValue: new Animated.Value(0),
      springValue: new Animated.Value(0),
      count: 0,
      scanning: false,
    };
    //Settin up an interval for the counter

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
    }
  };

  onSuccess = async (e) => {
    // console.log('meter info ---->', e);
    this.setState({scan: false});
    this.setState({scanning: true});
    const check = e.data.substring(0);
    const data = {
      device_serial_number: check,
    };
    const meterResponse = await this.api.post(
      `/property/equipment/unit/get-meter-info`,
      data,
    );
    // console.log('Get Unit Id', meterResponse);
    const unitId = meterResponse?.data?.data?.meterinfo?.unit_id;
    if (meterResponse?.data?.bool) {
      this.setState({loader: true});
      const unitResponse = await this.api.get(
        `/property/equipment/unit/${unitId}`,
      );
      console.log(
        'Get Building Id',
        unitResponse?.data?.data?.unit?.building_id,
      );
      const buildingId = unitResponse?.data?.data?.unit?.building_id;
      const buildingResponse = await this.api.get(
        `/property/equipment/building/${buildingId}`,
      );

      // console.log('Get Building Name', buildingResponse);
      let buildingName = buildingResponse?.data?.data?.building?.name;
      let propertyName = buildingResponse?.data?.data?.building?.property_name;
      // this.toggleModal();

      this.setState({loader: false, isVisible: !this.state.isVisible}, () =>
        this.props.navigation.navigate('MeterDetails', {
          unitId: unitId,
          buildingName: buildingName,
          propertyName,
          meterInfo: meterResponse?.data?.data?.meterinfo,
        }),
      );
    } else {
      // this.toggleModal();
      this.setState({loader: false, isVisible: !this.state.isVisible}, () =>
        this.props.navigation.navigate('RedirectMeter', {meterSerial: e?.data}),
      );
    }

    // console.log('Barcode Values', response);

    // console.log('scanned' + check);
    this.setState({barcodes: e});
    // console.log('Barcodes' + this.state.barcodes);
    // this.setState({
    //   result: e,
    //   scan: false,
    //   scanResult: true,
    // });
    // if (check == 'http') {
    //   Linking.openURL(e.data).catch((err) =>
    //     console.error('An error occured', err),
    //   );
    // } else {
    //   this.setState({
    //     result: e,
    //     scan: false,
    //     scanResult: true,
    //   });
    // }
  };
  scanAgain = () => {
    this.setState({
      scan: true,
      scanResult: false,
    });
  };

  componentDidMount() {
    // console.log('What we Get tools',this.props.navigation.navigate('MeterDetails'))
    this.subs = [
      this.props.navigation.addListener(
        'didFocus',
        () =>
          Animated.spring(this.state.springValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }).start(),
        this.getToken(),
      ),
      this.props.navigation.addListener('willBlur', () =>
        this.setState({springValue: new Animated.Value(0)}),
      ),
    ];
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {});
  }

  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  hasCameraPermission = async () => {};
  toggleModal = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === true) {
          this.setState({hasAccess: true, scanning: false});
          this.setState({isVisible: !this.state.isVisible});
          this.setState({scan: true});
          this.setState({scanResult: false});
          console.log('Access');
        } else {
          this.setState({hasAccess: false});
          this.props.navigation.navigate('Settings');
          // Alert.alert(
          //   "You don't have access for the Camera",
          //   'Kindly TurnOn Camera Permission to Access Camera',
          // );
          console.log('Denied');
        }
        return granted;
      } catch (err) {
        alert(err);
      }
    }
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          if (result == RESULTS.GRANTED) {
            this.setState({hasAccess: true, scanning: false});
            this.setState({isVisible: !this.state.isVisible});
            this.setState({scan: true});
            this.setState({scanResult: false});
            console.log('Access');
          }
          if (result == RESULTS.DENIED) {
            this.setState({hasAccess: false});
            this.props.navigation.navigate('Settings');
            Alert.alert(
              "You don't have access for the Camera",
              'Kindly TurnOn Camera Permission to Access Camera',
            );
            console.log('Denied');
          }
          if (result == RESULTS.BLOCKED) {
            this.props.navigation.navigate('Settings');
            Alert.alert(
              "You don't have access for the Camera",
              'Kindly TurnOn Camera Permission to Access Camera',
            );
            console.log('Denied');
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      meter: !this.state.meter,
      meterDown: !this.state.meterDown,
      animatedValue: new Animated.Value(0),
    });
    setTimeout(() => {
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 10);
    // Animated.timing(this.state.animatedValue, {
    //   toValue: 1,
    //   duration: 1000,
    //   useNativeDriver: true
    // }).start();
  };
  render() {
    let {animatedValue, springValue} = this.state;
    const {result, scan, scanResult} = this.state;
    return (
      <View style={{flex: 1}}>
        <CustumStatusBar />
        {/* <StatusBar backgroundColor="#fff" /> */}
        <View style={[styles.container]}>
          {this.state.loader ? <Loader /> : null}
          <Modal
            animationIn="bounceInUp"
            animationOut="bounceInDown"
            // backdropColor='black'
            backdropOpacity={5}
            statusBarTranslucent
            isVisible={this.state.isVisible}>
            {scan ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                  borderRadius: width * 0.02,
                  marginTop: Platform.OS == 'ios' ? height * 0.03 : null,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: width * 0.08,
                  }}>
                  Scan Barcode
                </Text>
                <RNCamera
                  ref={(ref) => {
                    this.camera = ref;
                  }}
                  style={{flex: 1}}
                  type={RNCamera.Constants.Type.back}
                  autoFocus="on"
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
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: height * 0.02,
                  }}>
                  <TouchableOpacity onPress={this.toggleModal}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: width * 0.008,
                        height: height * 0.05,
                        justifyContent: 'center',
                        width: width * 0.4,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#25AAE1',
                          fontWeight: 'bold',
                        }}>
                        Switch Off Scanner
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderRadius: width * 0.02,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: width * 0.06,
                  }}>
                  Getting Meter Info...
                </Text>
              </View>
            )}
          </Modal>
          <StatusBar backgroundColor="white" barStyle="default" hidden />
          {/* <View style={styles.headingContainer}>
            <View style={styles.headingInner}>
              <Tool
                name="tools"
                size={height * 0.03}
                color="white"
                style={styles.toolIcon}
              />
              <Text style={styles.mainHeadiing}>Tools</Text>
            </View>
          </View> */}
          <View style={styles.toolContainer}>
            {/* <Animated.View
              style={{
                transform: [{scale: springValue}],
              }}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => Toast.show('Work in Progess')}>
                <Image
                  source={require('../../Images/profileBack.jpg')}
                  style={styles.toolImage}
                />
                <Cast name="cast" size={height * 0.06} color="white" />
                <View>
                  <Text style={styles.toolName}>Direct Connect</Text>
                </View>
              </TouchableOpacity>
            </Animated.View> */}
            <Animated.View
              style={{
                transform: [{scale: springValue}],
              }}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={this.toggleModal}>
                <Image
                  source={require('../../Images/profileBack.jpg')}
                  style={styles.toolImage}
                />
                <Scan name="barcode-sharp" size={height * 0.06} color="white" />
                <View>
                  <Text style={styles.toolName}>Barcode Scanner</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            {/* <Animated.View
              style={{
                transform: [{scale: springValue}],
              }}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => Toast.show('Work in Progess')}>
                <Image
                  source={require('../../Images/profileBack.jpg')}
                  style={styles.toolImage}
                />
                <Test name="signal" size={height * 0.06} color="white" />
                <View>
                  <Text style={styles.toolName}>Test Connect</Text>
                </View>
              </TouchableOpacity>
            </Animated.View> */}
          </View>
        </View>
      </View>
    );
  }
}
export default Tools;
