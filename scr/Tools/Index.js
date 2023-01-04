import React, {Component, Fragment, version} from 'react';

import {
  AppRegistry,
  StyleSheet,
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
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import Loader from '../components/Loader';
import {PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import Back from 'react-native-vector-icons/MaterialIcons';
import Tool from 'react-native-vector-icons/Entypo';
import Cast from 'react-native-vector-icons/Feather';
import Scan from 'react-native-vector-icons/Ionicons';
import Test from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';

import {withNavigation} from 'react-navigation';

// Components
import {Fonts} from '../utils/fonts';

import {Ellipse} from 'react-native-svg';
import {ceil, set} from 'react-native-reanimated';

import Toast from 'react-native-simple-toast';

import Modal from 'react-native-modal';

import styles from './style';
import style from '../Home/style';
import CustumStatusBar from '../components/StatusBar';
import API from '../api/SeviceApi';
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

  onSuccess = async (e) => {
    this.setState({scan: false});
    this.setState({scanning: true});
    const check = e.data.substring(0);
    const data = {
      device_serial_number: check,
    };
    const meterResponse = await API.post(
      `/property/equipment/unit/get-meter-info`,
      data,
    );
    const unitId = meterResponse?.data?.data?.meterinfo?.unit_id;
    if (meterResponse?.data?.bool) {
      this.setState({loader: true});
      const unitResponse = await API.get(`/property/equipment/unit/${unitId}`);
      console.log(
        'Get Building Id',
        unitResponse?.data?.data?.unit?.building_id,
      );
      const buildingId = unitResponse?.data?.data?.unit?.building_id;
      const buildingResponse = await API.get(
        `/property/equipment/building/${buildingId}`,
      );

      let buildingName = buildingResponse?.data?.data?.building?.name;
      let propertyName = buildingResponse?.data?.data?.building?.property_name;

      this.setState({loader: false, isVisible: !this.state.isVisible}, () =>
        this.props.navigation.navigate('MeterDetails', {
          unitId: unitId,
          buildingName: buildingName,
          propertyName,
          meterInfo: meterResponse?.data?.data?.meterinfo,
        }),
      );
    } else {
      this.setState({loader: false, isVisible: !this.state.isVisible}, () =>
        this.props.navigation.navigate('RedirectMeter', {meterSerial: e?.data}),
      );
    }
    this.setState({barcodes: e});
  };
  scanAgain = () => {
    this.setState({
      scan: true,
      scanResult: false,
    });
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () =>
        Animated.spring(this.state.springValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start(),
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
          Alert.alert(
            "You don't have access for the Camera",
            'Kindly TurnOn Camera Permission to Access Camera',
          );
          this.props.navigation.navigate('Settings');
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
  };
  render() {
    let {animatedValue, springValue} = this.state;
    const {result, scan, scanResult} = this.state;
    return (
      <View style={{flex: 1}}>
        <CustumStatusBar />
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <TabIcon name="toolbox" color="white" size={height * 0.03} style={style.settingIcon} />
            <TextReuseableComponent title style={styles.mainHeadiing} value={"Tools"} />
          </View>
        </View>
        <View style={[styles.container]}>
          {this.state.loader ? <Loader /> : null}
          <Modal
            animationIn="bounceInUp"
            animationOut="bounceInDown"
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
                <TextReuseableComponent title style={{
                    color: 'white',
                    textAlign: 'center',
                  }} value={"Scan Barcode"} />
                <RNCamera
                  ref={(ref) => {
                    this.camera = ref;
                  }}
                  style={{flex: 1}}
                  type={RNCamera.Constants.Type.back}
                  autoFocus="on"
                  onBarCodeRead={this.onSuccess}
                  captureAudio={false}
                >
                  <BarcodeMask outerMaskOpacity={0} />
                  
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
                      <TextReuseableComponent title style={{
                          textAlign: 'center',
                          color: '#25AAE1',
                        }} value={"Switch Off Scanner"} />
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
                <TextReuseableComponent title style={{
                    color: 'white',
                    textAlign: 'center',
                  }} value={"Getting Meter Info..."} />
              </View>
            )}
          </Modal>
          <StatusBar backgroundColor="white" barStyle="default" hidden />
          <View style={styles.toolContainer}>
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
                  <TextReuseableComponent title style={styles.toolName} value={"Barcode Scanner"} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }
}
export default Tools;
