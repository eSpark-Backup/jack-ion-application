import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Scanner from 'react-native-vector-icons/Ionicons';
import Back from 'react-native-vector-icons/MaterialIcons';
import DropDown from 'react-native-vector-icons/FontAwesome';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RNBeep from 'react-native-a-beep';
import {DotsLoader} from 'react-native-indicator';
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
    if (this.props.type == 'Properties') {
      let data = {
        offset: 0,
        billing: this.state.biller,
        search: this.context.filterPropName,
      };
      this.context.filterData(data);
      this.props.close();
      this.props.filterWork();
      this.setState({showList: false});
    } else {
      this.props.filterWork(true);
      this.props.get_filterVal(
        this.context.filterSerial,
        this.state.utilityIndex != null || undefined
          ? this.state.utilityIndex + 1
          : null,
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
    this.props.filterWork(false);
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

  onOkay = () => {
    this.context.updateBiller(this.state.biller);
    this.setState({showList: false});
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
        <StatusBar hidden barStyle="dark-content" />
        {/* Barcode Scanner */}
        <Modal
          animationIn="bounceInUp"
          animationOut="bounceInDown"
          backdropOpacity={5}
          isVisible={this.state.isScannerVisible}>
          {scan && (
            <View style={styles.scannerContainer}>
              <View style={styles.scannerHeader}>
                <TouchableOpacity onPress={this.scannerModal}>
                  <Back
                    size={width * 0.08}
                    color="white"
                    name="keyboard-backspace"
                  />
                </TouchableOpacity>
                <Text style={styles.scannerHeading}>Scan Barcode</Text>
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
            <View
              style={[
                {...styles.boxConatainer, style},
                {height: type == 'Units' ? height * 0.42 : height * 0.35},
              ]}>
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
                    <View style={styles.headerCenter}>
                      <Text style={styles.headerCenterText}>Filter</Text>
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
                  containerStyle={styles.filterHeader}
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
                          style={styles.billingButton}>
                          <Text style={styles.filterListText}>
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
                            style={styles.utilityList}
                            data={utilityTypes}
                            renderItem={({item, index}) => (
                              <TouchableOpacity
                                style={{
                                  ...styles.UtilityTypeBtn,
                                  backgroundColor:
                                    index == this.state.utilityIndex
                                      ? '#efefef'
                                      : null,
                                }}
                                onPress={() =>
                                  this.getUtilityType(item.name, index)
                                }>
                                <Image
                                  source={this.typeSwitcher(item.name)}
                                  resizeMode="contain"
                                  style={styles.UtilityTypeImg}
                                />
                              </TouchableOpacity>
                            )}
                          />
                        ) : (
                          <View style={styles.utilityDots}>
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
        <Modal isVisible={this.state.showList}>
          <View style={styles.billingModalInner}>
            <View style={{...styles.boxConatainer, width: width * 0.6}}>
              <View style={styles.boxInner}>
                <View style={styles.billingModalHeader}>
                  <Text style={{fontSize: width * 0.04}}>Billing</Text>
                </View>
                <View style={styles.companyList}>
                  <ScrollView>
                    {this.state.billCompanies.map((item) => (
                      <View style={styles.billingCompnay}>
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

                <View style={styles.billingModalBottom}>
                  <TouchableOpacity onPress={this.cancelButton}>
                    <Text style={styles.billingModalBtns}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onOkay}>
                    <Text style={styles.billingModalBtns}>Ok</Text>
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
