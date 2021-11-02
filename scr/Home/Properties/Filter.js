import React, {Component, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
  PermissionsAndroid,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Scanner from 'react-native-vector-icons/Ionicons';
import Back from 'react-native-vector-icons/MaterialIcons';
import DropDown from 'react-native-vector-icons/FontAwesome';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import {DotsLoader} from 'react-native-indicator';
import {Icon, IconToggle} from 'react-native-material-ui';
import Base_URL from '../../../scr/api/WebServices';
import Modal from 'react-native-modal';
import {Header} from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen';
import styles from './FilterStyle';
import {RadioButton} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import ContextProp from './Context/propContext';
import {create} from 'apisauce';

const {width, height} = Dimensions.get('window');
let api;

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      showList: false,
      token: '',
      billCompanies: [],
      selectedType: '',
      searchName: '',
      utilityIndex: null,
      scan: false,
      Types: [
        {
          id: 2,
          type: 'cold water',
          img: require('../../../Images/cold-water.png'),
        },
        {
          id: 3,
          type: 'hot water',
          img: require('../../../Images/hot-water.png'),
        },
        {
          id: 3,
          type: 'hot water',
          img: require('../../../Images/hot-water.png'),
        },
        {
          id: 3,
          type: 'hot water',
          img: require('../../../Images/hot-water.png'),
        },
        {
          id: 3,
          type: 'hot water',
          img: require('../../../Images/hot-water.png'),
        },
      ],
      biller: '',
      changed: false,
      buildingId: '',
      buildingName: '',
      unitName: '',
      serial: '',
    };
  }
  getUtilityType = (type, index) => {
    this.setState({
      selectedType: type,
      utilityIndex: index === this.state.utilityIndex ? null : index,
    });
  };

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      this.setState({token: token});
      api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      this.getBillingCompany();
    }
  };

  getBillingCompany = () => {
    this.context.getBillingCompany();
    this.setState({billCompanies: this.context.propitemList});
    this.setState({showList: true});
  };

  componentDidMount() {
    this.context.getBillingCompany();
    SplashScreen.hide();
  }

  listSelection = (val) => {
    this.setState({biller: val});
  };

  cancelButton = () => {
    this.setState({showList: false});
    this.setState({biller: this.context.biller});
  };

  filter = () => {
    console.log("Utility Index",this.state.utilityIndex)
    if (this.props.type == 'Properties') {
      let data = {
        offset: 0,
        billing: this.state.biller,
        search: this.context.filterPropName,
      };
      this.context.filterData(data);
      this.props.close();
      this.setState({showList: false});
    } else {
      this.props.get_filterVal(
        this.context.filterSerial,
        this.state.utilityIndex != null || undefined ? this.state.utilityIndex + 1 : null,
      );
    }
  };

  onFocusFunction = () => {
    this.context.checkData();
    this.props.close();
    this.setState({biller: ''});
    this.context.updateFilterProperty('');
  };

  resetFilter = () => {
    this.props.onReset('');
    this.context.updateFilterSerial('');
    this.setState({utilityIndex: null});
  };

  toggleScanner = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === true) {
        this.setState({hasAccess: true});
        this.setState({isScannerVisible: true});
        this.setState({scan: true});
        console.log('Access');
      } else {
        this.setState({hasAccess: false});
        Alert.alert(
          "You don't have access for the Camera",
          'Kindly TurnOn Camera Permission from Settings to use Scanner',
        );
        console.log('Denied');
      }
      return granted;
    } catch (err) {
      alert(err);
    }
  };

  onScanned = (e) => {
    const check = e.data.substring(0, 4);
    if (check == 'http') {
      Linking.openURL(e.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      this.context.updateFilterSerial(e.data);
      this.setState({
        result: e,
        scan: false,
        newSerial: e.data,
        isScannerVisible: false,
      });

      setTimeout(() => {
        RNBeep.beep(false);
      }, 500);
    }
  };

  scannerModal = () => {
    this.setState({isScannerVisible: false});
    this.setState({scan: false});
  };

  typeSwitcher = (arg) => {
    switch (arg) {
      case 'hot water':
        return require('../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../Images/electric.png');
      case 'gas':
        return require('../../../Images/gass.png');
      case 'water':
        return require('../../../Images/all-waters.png');
      default:
        break;
    }
  };

  render() {
    const {scan} = this.state;
    const {
      isVisible,
      close,
      type,
      buildingName,
      style,
      utilityTypes,
    } = this.props;
    if (this.props.changed) {
      this.context.updateFilterSerial('');
      this.setState({utilityIndex: null});
      this.props.changeChanged();
    }
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        {/* Barcode Scanner */}
        <Modal
          animationIn="bounceInUp"
          animationOut="bounceInDown"
          // backdropColor='black'
          backdropOpacity={5}
          isVisible={this.state.isScannerVisible}>
          {scan && (
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                borderRadius: width * 0.02,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: height * 0.02,
                }}>
                <TouchableOpacity onPress={this.scannerModal}>
                  <Back
                    size={width * 0.08}
                    color="white"
                    name="keyboard-backspace"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 20,
                    paddingLeft: width * 0.08,
                  }}>
                  Scan Barcode
                </Text>
              </View>
              <RNCamera
                ref={(ref) => {
                  this.camera = ref;
                }}
                style={{flex: 1}}
                type={RNCamera.Constants.Type.back}
                autoFocus="on"
                onBarCodeRead={this.onScanned}
                captureAudio={false}>
                <BarcodeMask outerMaskOpacity={0} />
              </RNCamera>
            </View>
          )}
        </Modal>
        {/*Filter Modal*/}
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          isVisible={isVisible}>
          <View style={styles.modalInner}>
            <View style={{...styles.boxConatainer, style}}>
              <View style={styles.boxInner}>
                {/* Box Header */}
                <Header
                  barStyle="dark-content"
                  leftComponent={{
                    text: 'Close',
                    style: {fontSize: width * 0.05, color: '#000'},
                    onPress: close,
                  }}
                  centerComponent={
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 20, color: '#25aae1'}}>
                        Filter
                      </Text>
                    </View>
                  }
                  rightComponent={{
                    text: 'Reset',
                    style: {fontSize: width * 0.05, color: '#5c5c5ccf'},
                    onPress: () => {
                      type == 'Units'
                        ? this.resetFilter()
                        : this.onFocusFunction();
                    },
                  }}
                  backgroundColor="#fff"
                  containerStyle={{
                    borderBottomWidth: width * 0.003,
                    elevation: 1,
                  }}
                />
                <View style={{width: '100%'}}>
                  {type == 'Properties' ? (
                    <View style={styles.currentReadContainer}>
                      <View style={styles.inputFilterView}>
                        <Text style={styles.filterListText}>Name:</Text>
                        <TextInput
                          style={styles.filterInputs}
                          value={this.context.filterPropName}
                          onChangeText={(e) =>
                            this.context.updateFilterProperty(e)
                          }
                        />
                      </View>
                      <View style={styles.filterLists}>
                        <Text style={styles.filterListText}>Billing</Text>
                        <TouchableOpacity
                          onPress={this.getBillingCompany}
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.04}}>
                            {this.context.biller}
                          </Text>
                          <DropDown name="caret-down" size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  {type == 'Properties' ? null : (
                    <View>
                      <View style={styles.currentReadContainer}>
                        <View style={styles.inputFilterView}>
                          <Text style={styles.filterListText}>Building:</Text>
                          <TextInput
                            style={styles.filterInputs}
                            value={buildingName}
                            editable={false}
                          />
                        </View>
                        <View style={styles.inputFilterView}>
                          <Text style={styles.filterListText}>
                            Serial Number:
                          </Text>
                          <TextInput
                            style={styles.filterInputs}
                            value={this.context.filterSerial}
                            onChangeText={(e) =>
                              this.context.updateFilterSerial(e)
                            }
                          />
                          <TouchableOpacity
                            onPress={() => this.toggleScanner()}>
                            <Scanner name="scan" size={20} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                  {type == 'Units' ? (
                    <View style={styles.currentReadContainer}>
                      <View style={styles.inputFilterView}>
                        <Text style={styles.filterListText}>
                          Utility Types:
                        </Text>
                        {utilityTypes.length ? (
                          <FlatList
                            horizontal
                            style={{marginLeft: width * 0.05}}
                            data={utilityTypes}
                            renderItem={({item, index}) => (
                              <TouchableOpacity
                                style={{
                                  borderRadius: 10,
                                  backgroundColor:
                                    index == this.state.utilityIndex
                                      ? '#efefef'
                                      : null,
                                  padding: width * 0.015,
                                  marginHorizontal: width * 0.02,
                                  marginVertical: height * 0.01,
                                }}
                                onPress={() =>
                                  this.getUtilityType(item.name, index)
                                }>
                                <Image
                                  source={this.typeSwitcher(item.name)}
                                  resizeMode="contain"
                                  style={{
                                    height: width * 0.06,
                                    width: width * 0.055,
                                  }}
                                />
                              </TouchableOpacity>
                            )}
                          />
                        ) : (
                          <View
                            style={{
                              paddingLeft: width * 0.035,
                              marginVertical: width * 0.035,
                            }}>
                            <DotsLoader color="gray" />
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}
                  <View
                    style={{
                      ...styles.currentReadContainer,
                      marginVertical: height * 0.015,
                    }}>
                    <TouchableOpacity
                      style={{
                        ...styles.filterUtility,
                        backgroundColor: '#25aae1',
                      }}
                      onPress={this.filter}>
                      <Text style={{color: '#fff'}}>Filter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.showList}
          style={{
            elevation: width * 0.005,
            borderRadius: width * 0.02,
            maxHeight: height * 1,
            maxWidth: width * 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: width * 0.5,
              height: height * 0.35,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: width * 0.02,
                elevation: width * 0.02,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: width * 0.02,
                  elevation: width * 0.02,
                  alignItems: 'center',
                  width: width * 0.45,
                  height: height * 0.3,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '20%',
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    paddingLeft: width * 0.05,
                  }}>
                  <Text style={{fontSize: width * 0.04}}>Billing</Text>
                </View>
                <View style={{width: '100%', height: '60%'}}>
                  <ScrollView>
                    {this.state.billCompanies.map((item) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: height * 0.005,
                        }}>
                        <RadioButton
                          value={item.name}
                          status={
                            this.state.biller === item.name
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => this.listSelection(item.name)}
                        />
                        <Text>{item.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '20%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderTopWidth: 0.5,
                    paddingRight: width * 0.03,
                  }}>
                  <TouchableOpacity onPress={this.cancelButton}>
                    <Text
                      style={{
                        fontSize: width * 0.032,
                        marginHorizontal: 5,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color: '#18CADC',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({showList: false})}>
                    <Text
                      style={{
                        fontSize: width * 0.032,
                        marginHorizontal: 5,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color: '#18CADC',
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
