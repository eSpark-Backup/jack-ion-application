import React, {Component, version} from 'react';

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
  LayoutAnimation,
  UIManager,
  PermissionsAndroid,
  LogBox,
  Alert,
  Platform,
  Switch,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';
import Settings from 'react-native-vector-icons/Feather';
import Reset from 'react-native-vector-icons/MaterialCommunityIcons';
import Logout from 'react-native-vector-icons/SimpleLineIcons';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import ToggleSwitch from 'toggle-switch-react-native';
import TabIcon from 'react-native-vector-icons/MaterialIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import SystemSetting from 'react-native-system-setting';
import CustumStatusBar from '../components/StatusBar';
import Modal from 'react-native-modal';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

// Components
import {Fonts} from '../utils/fonts';

import styles from './style';
import {Ellipse} from 'react-native-svg';
import style from './style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const {width, height} = Dimensions.get('window');

// const requestStoragePermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
//       {
//         title: "Cool Photo App Camera Permission",
//         message:
//           "Cool Photo App needs access to your camera " +
//           "so you can take awesome pictures.",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the Storage");
//     } else {
//       console.log("Camera permission Storage");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

export default class Splash extends Component {
  static navigationOptions = {
    title: 'Settings',
    tabBarIcon: ({tintColor}) => (
      <TabIcon
        name="settings-applications"
        color={tintColor}
        size={width * 0.05}
      />
    ),
  };
  constructor() {
    super();
    this.state = {
      hasCameraAccess: false,
      hasStorageAccess: false,
      blueOpt: false,
      onOff: '',
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _openAppSetting = async () => {
    await SystemSetting.openAppSystemSettings();
  };
  checkBluetooth = () => {
    SystemSetting.isBluetoothEnabled().then((enable) => {
      this.state.onOff = enable ? 'On' : 'Off';
      // console.log('Current bluetooth is ' + this.state.onOff);
      if (this.state.onOff == 'On') {
        this.setState({blueOpt: true});
      } else {
        this.setState({blueOpt: false});
      }
      this.checkBluetooth();
      // console.log(this.state.blueOpt)
    });

    // SystemSetting.switchBluetooth(() => {
    //   console.log('switch bluetooth successfully');
    // })
  };
  toggleBluetooth = () => {
    SystemSetting.switchBluetooth(() => {
      console.log('switch bluetooth successfully');
    });
  };

  toggleSettings = () => {
    SystemSetting.isLocationEnabled().then((enable) => {
      const state = enable ? 'On' : 'Off';
      console.log('Current location is ' + state);
    });

    SystemSetting.switchLocation(() => {
      console.log('switch location successfully');
    });
  };

  requestCameraPermission = async () => {
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          console.log('kia hai result camera ka', result);
          if (result == RESULTS.GRANTED) {
            this.setState({hasCameraAccess: true});

            Alert.alert(
              "You've access for the Camera",
              'To Change the Permission Open Settings',
              [
                {text: 'Ok', style: 'cancel'},
                {
                  text: 'Open Settings',
                  onPress: () =>
                    openSettings().catch(() =>
                      console.warn('cannot open settings!'),
                    ),
                },
              ],
            );
          } else {
            this.setState({hasCameraAccess: false});
            alert("You don't have access for the Camera");
            // console.log('Denied',)
          }
        })
        .catch((e) => {
          alert(err);
        });
    }
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        console.log('kia hai granted camera ka', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (this.state.hasCameraAccess) {
            this._openAppSetting();
          } else {
            this.setState({hasCameraAccess: true});
          }
          // console.log('Access',)
          // Alert.alert(
          //   "You've access for the Camera",
          //   'To Change the Permission Open Settings',
          //   [
          //     {text: 'Ok', style: 'cancel'},
          //     {
          //       text: 'Open Settings',
          //       onPress: () => this._openAppSetting(),
          //     },
          //   ],
          // );
        } else {
          this.setState({hasCameraAccess: false});
          alert("You don't have access for the Camera");
          // console.log('Denied',)
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({hasStorageAccess: true});
        // console.log('Access',)
        Alert.alert(
          "You've access for the Storage",
          'To Change the Permission Open Settings ',
          [
            {text: 'Ok', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => this._openAppSetting(),
            },
          ],
        );
      } else {
        this.setState({hasStorageAccess: false});
        alert("You don't have access for the Storage");
        // console.log('Denied',)
      }
    } catch (err) {
      alert(err);
    }
  };

  hasCameraPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === true) {
          this.setState({hasCameraAccess: true});
          // console.log('Access',)
        } else {
          this.setState({hasCameraAccess: false});
          // console.log('Denied',)
        }
        return granted;
      } catch (err) {
        alert(err);
      }
    }
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context) on ios',
              );
              this.setState({hasCameraAccess: false});
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable on ios',
              );
              this.setState({hasCameraAccess: false});
              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible on ios',
              );
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted on ios');
              this.setState({hasCameraAccess: true});
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore on ios',
              );
              this.setState({hasCameraAccess: false});
              break;
          }
        })
        .catch((error) => {
          console.log('Error aya hai kuch', error);
        });
    }
  };
  hasStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === true) {
        this.setState({hasStorageAccess: true});
        // console.log('Access',)
      } else {
        this.setState({hasStorageAccess: false});
        // console.log('Denied',)
      }
      return granted;
    } catch (err) {
      alert(err);
    }
  };

  removeToken = async () => {
    try {
      await EncryptedStorage.removeItem('user_token');
      console.log('Success Removed Token');
    } catch (e) {
      console.log('Failed Remove Token', e);
    }
  };

  setLoggedOut = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', '0');
      console.log('Logged out');
    } catch (e) {
      console.log('error at setting logged out', e);
    }
  };

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    this.hasCameraPermission();
    this.checkBluetooth();
    this.hasStoragePermission();
  }
  // _start = () => {
  //   Animated.timing(this.state.fadeValue, {
  //     toValue: 1,
  //     duration: 1000
  //   }).start();
  // };
  toggleModal = () => {
    this.setState({isVisible: !this.state.isVisible});
  };

  render() {
    let {animatedValue} = this.state;
    // this.checkBluetooth();

    return (
      <View style={styles.container}>
        {Platform.OS == 'ios' && <CustumStatusBar backColor />}

        {/* <Image
            source={require('../../Images/profileBack.jpg')}
            style={styles.backgroundImage}
          /> */}
        {/* <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.menuView}>
              <Back
                size={width * 0.08}
                color="white"
                name="keyboard-backspace"
              />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <Search
                name="search"
                size={height * 0.04}
                style={{marginLeft: width * 0.05}}
                color="white"
              />
              <TextInput
                placeholderTextColor="white"
                placeholder="Search"
                style={styles.search}
                onChangeText={(e) => this.setState({currentWei: e})}
              />
            </View>
          </View>
        </View> */}
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Settings
              name="settings"
              size={height * 0.03}
              color="white"
              style={style.settingIcon}
            />
            <Text style={styles.mainHeadiing}>Settings</Text>
          </View>
        </View>
        <ScrollView
          style={{height: height * 1, width: width * 1}}
          showsVerticalScrollIndicator={false}>
          <View style={style.containView}>
            <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>Camera Access</Text>
                <Text style={style.sideHeadingItems}>
                  Scan equipment and take photos
                </Text>
              </View>
              <Switch
                trackColor={{false: 'lightgray', true: '#25AAE1'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.requestCameraPermission}
                value={this.state.hasCameraAccess}
              />
            </View>
            <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>File Storage</Text>
                <Text style={style.sideHeadingItems}>
                  Upload profile and property photos
                </Text>
              </View>
              <Switch
                trackColor={{false: 'lightgray', true: '#25AAE1'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.requestStoragePermission}
                value={this.state.hasStorageAccess}
              />
            </View>
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>Cloud Scanner</Text>
                <Text style={style.sideHeadingItems}>
                  Scan barcode into websites
                </Text>
              </View>
              <ToggleSwitch
                isOn={this.state.hasCameraAccess}
                onColor="#25AAE1"
                offColor="lightgray"
                onToggle={(isOn) => console.log('changed to : ', isOn)}
              />
            </View> */}
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>
                  Barcode Scanner Sounds
                </Text>
                <Text style={style.sideHeadingItems}>
                  Sounds indicating barcode scan
                </Text>
              </View>
              <ToggleSwitch
                isOn={false}
                onColor="#25AAE1"
                offColor="lightgray"
                onToggle={(isOn) => console.log('changed to : ', isOn)}
              />
            </View> */}
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>BLE Radio</Text>
                <Text style={style.sideHeadingItems}>
                  Using to Direct-Connect to equipment
                </Text>
              </View>
              <ToggleSwitch
                isOn={this.state.blueOpt}
                onColor="#25AAE1"
                offColor="lightgray"
                onToggle={this.toggleBluetooth}
              />
            </View> */}
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>
                  BLE Proximity Scanner
                </Text>
                <Text style={style.sideHeadingItems}>
                  Show nearby Direct-Connect equipment
                </Text>
              </View>
              <ToggleSwitch
                isOn={false}
                onColor="#25AAE1"
                offColor="lightgray"
                onToggle={(isOn) => console.log('changed to : ', isOn)}
              />
            </View> */}
            {/* <View style={style.containerReset}>
              <Reset
                name="rotate-3d-variant"
                size={height * 0.035}
                style={{paddingRight: 5}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Reset</Text>
            </View> */}
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>Reset Slides</Text>
                <Text style={style.sideHeadingItems}>
                  Re-enable all demo slides
                </Text>
              </View>
              <Arrow name="keyboard-arrow-right" size={height * 0.04} />
            </View> */}
            {/* <View style={style.containerInner}>
              <View>
                <Text style={style.mainHeadiingItems}>Reset All Settings</Text>
                <Text style={style.sideHeadingItems}>
                  Forgets all saved settings on this device
                </Text>
              </View>
              <Arrow name="keyboard-arrow-right" size={height * 0.04} />
            </View> */}
            <View style={style.containerReset}>
              <Logout
                name="logout"
                size={height * 0.03}
                style={{paddingRight: 10}}
                color="white"
              />
              <Text style={style.mainHeadiingReset}>Logout</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Log Out', 'Are you sure you want to Logout', [
                  {text: 'No', style: 'cancel'},
                  {
                    text: 'Log Out',
                    onPress: () => {
                      this.removeToken();
                      this.setLoggedOut();
                      this.props.navigation.replace('Login');
                    },
                  },
                ]);

                // this.props.navigation.popToTop();
              }}>
              <View style={style.containerInner}>
                <View>
                  <Text style={style.mainHeadiingItems}>Logout App</Text>
                  <Text style={style.sideHeadingItems}>
                    Logs out from the Application
                  </Text>
                </View>
                <Arrow name="keyboard-arrow-right" size={height * 0.04} />
              </View>
            </TouchableOpacity>
            {/* <View
              style={{
                // height: height * 0.09,
                width: '100%',
                backgroundColor: 'white',
                marginVertical: height * 0.01,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 20,
              }}
              activeOpacity={0.8}>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat,
                    fontSize: height * 0.03,
                    color: 'gray',
                  }}>
                  App Version: 1.0.0
                </Text>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}
