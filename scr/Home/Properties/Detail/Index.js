import React from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  UIManager,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

//Packages
import EncryptedStorage from 'react-native-encrypted-storage';
import Menu from 'react-native-vector-icons/Entypo';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Locate from 'react-native-vector-icons/Feather';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Modal from 'react-native-modal';
import Folder from 'react-native-vector-icons/Feather';
import Equip from 'react-native-vector-icons/Feather';
import Chart from 'react-native-vector-icons/Feather';
import Message from 'react-native-vector-icons/Feather';
import Docs from 'react-native-vector-icons/Ionicons';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryAxis,
} from 'victory-native';
import ContextProp from '../Context/propContext';
import {TextInput, FAB, HelperText} from 'react-native-paper';

// Components
import styles from './style';
import style from './style';
import Base_URL from '../../../api/WebServices';
import {create} from 'apisauce';
import CustumStatusBar from '../../../components/StatusBar';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const dataBar2 = {
  actual: [
    null,
    {x: 'MON', y: 11},
    {x: 'TUE', y: 15},
    {x: 'WED', y: 18},
    {x: 'THU', y: 1},
    {x: 'FRI', y: 5},
    {x: 'SAT', y: 2},
    {x: 'SUN', y: 3},
  ],
  planned: [
    null,
    {x: 'MON', y: 12},
    {x: 'TUE', y: 10},
    {x: 'WED', y: 13},
    {x: 'THU', y: 1},
    {x: 'FRI', y: 5},
    {x: 'SAT', y: 2},
    {x: 'SUN', y: 8},
  ],
};

export default class Splash extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      points: 80,
      listData: {},
      BillingCompany: 'BILLING COMPANY',
      BillingCompanyId: null,
      managementCompany: 'MANAGEMENT COMPANY',
      managementCompanyId: '',
      customId: 0,
      companies: false,
      companiesLoader: false,
      error: {
        property: '',
        property_id: '',
        street: '',
        city: '',
        zipcode: '',
      },
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const propertyData = this.props.navigation.state.params.item.item;
    this.setState({
      listData: propertyData,
    });
    this.setState({
      BillingCompany: propertyData?.billing_company,
      BillingCompanyId: propertyData?.billing_company_id,
      managementCompany: propertyData?.management_company,
      managementCompanyId: propertyData?.management_company_id,
      customId: propertyData.property_id.toString(),
    });

    console.log(
      'LIST DATA >>>>>',
      this.props.navigation.state.params.item.item,
    );
  }

  getBack = () => {
    this.props.navigation.goBack();
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  toggleModalEditProp = () => {
    this.setState({
      isModalAdEditPropVisible: !this.state.isModalAdEditPropVisible,
    });
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        property: '',
        property_id: '',
        street: '', // update the value of specific key
      },
    }));
  };

  onCancel = () => {
    this.setState({
      listData: this.props.navigation.state.params.item.item,
      isModalAdEditPropVisible: !this.state.isModalAdEditPropVisible,
    });
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        property: '',
        property_id: '',
        billingId: false,
        street: '', // update the value of specific key
      },
    }));
  };

  editProp = async () => {
    if (this.state?.listData?.name === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: 'Invalid Property', // update the value of specific key
        },
      }));
      ToastAndroid.show('Invalid Property', ToastAndroid.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: false, // update the value of specific key
        },
      }));
    }
    // if (this.state?.listData?.property_id === '') {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       property_id: 'Invalid Custom ID', // update the value of specific key
    //     },
    //   }));
    //   ToastAndroid.show('Invalid Property', ToastAndroid.SHORT);

    //   return;
    // } else {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     error: {
    //       // object that we want to update
    //       ...prevState.error, // keep all other key-value pairs
    //       property_id: false, // update the value of specific key
    //     },
    //   }));
    // }
    if (this.state.BillingCompanyId == null) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: 'Please select Billing ID', // update the value of specific key
        },
      }));
      ToastAndroid.show('Please Select Billing Company', ToastAndroid.SHORT);
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: false, // update the value of specific key
        },
      }));
    }
    if (this.state?.listData?.street === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: 'Invalid Street Name', // update the value of specific key
        },
      }));
      ToastAndroid.show('Invalid Street', ToastAndroid.SHORT);

      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: false, // update the value of specific key
        },
      }));
      const data = {
        property_id: this.state.customId,
        zipcode: this.state.listData.zipcode,
        name: this.state.listData.name,
        street: this.state.listData.street,
        city: this.state.listData.city,
        billing_company_id: this.state.BillingCompanyId,
        management_company: this.state.managementCompanyId,
      };

      const token = await EncryptedStorage.getItem('user_token');

      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });

      const response = await this.api.patch(
        `/property/update/${this.state?.listData?.id}`,
        data,
      );
      console.log(response?.data);
      if (response?.data?.bool) {
        this.toggleModalEditProp();
      } else {
        Alert.alert('Error', response?.data?.message);
      }
    }
  };

  naviagateToEquip = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };

  naviagateToDetail = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate(
      'Detail',
      this.props.navigation.state.params,
    );
  };

  naviagateToChart = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'Charts',
      this.props.navigation.state.params,
    );
  };

  naviagateToSupport = () => {
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  handleOpenDropDown = (value) => {
    this.setState({companiesLoader: true});
    this.context.getBillingCompany();
    this.context.getManagementCompany();
    this.setState({open: !this.state.open, companies: value});
    if (this.context.manageCompList.length > 0) {
      this.setState({companiesLoader: false});
    }
  };

  handleDropDownData = (value) => {
    if (this.state.companies) {
      this.setState({BillingCompany: value.name, BillingCompanyId: value.id});
    } else {
      this.setState({
        managementCompany: value.manager_name,
        managementCompanyId: value.id,
      });
    }
    this.setState({open: !this.state.open});
    this.setState((prevState) => ({
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        billingId: '',
      },
    }));
  };

  handleCloseDropDown = () => {
    this.setState({BillingCompany: 'BILLING COMPANY'});
    this.setState({open: false});
  };

  render() {
    return (
      <>
        {Platform.OS == 'ios' && <CustumStatusBar />}
        <View style={styles.container}>
          <Modal
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            isVisible={this.state.isModalVisible}
            swipeDirection="left"
            onSwipeStart={() => this.toggleModal()}
            onBackdropPress={() => this.toggleModal()}
            backdropColor="black"
            statusBarTranslucent
            style={styles.sideModalContainer}>
            <CustumStatusBar backColor />
            <View style={{backgroundColor: '#35afe2', height: height * 0.05}} />
            <View style={styles.drawerMainContainer}>
              <View>
                <Menu
                  name="menu"
                  size={height * 0.05}
                  color="white"
                  onPress={() => this.toggleModal()}
                  style={{backgroundColor: '#35afe2'}}
                />
              </View>
              <View style={styles.drawerContentContainer}>
                <TouchableOpacity onPress={() => this.naviagateToDetail()}>
                  <View style={styles.drawerContent}>
                    <Detail
                      name="account-details-outline"
                      size={height * 0.035}
                      color="#7575ff"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Profile</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.naviagateToEquip()}>
                  <View style={styles.drawerContent}>
                    <Equip
                      name="rss"
                      size={height * 0.035}
                      color="#ff9f71"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Units</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.naviagateToChart()}>
                  <View style={styles.drawerContent}>
                    <Chart
                      name="pie-chart"
                      size={height * 0.035}
                      color="#009349"
                      style={styles.drawerBtnIcon}
                    />
                    <Text style={styles.drawerbtn}>Charts</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{bottom: height * 0.05}}
                onPress={this.naviagateToSupport}>
                <View
                  style={[
                    styles.drawerBottom,
                    {
                      flexDirection: 'row',
                      // alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: height * 0.015,
                      marginBottom: height * 0.01,
                    },
                  ]}>
                  <Detail
                    name="help-circle-outline"
                    size={height * 0.035}
                    color="#35afe2"
                    style={{
                      ...styles.drawerBtnIcon,
                      bottom: Platform.OS == 'ios' ? 2 : null,
                    }}
                  />
                  <Text style={styles.drawerbtn}>Support</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          <StatusBar hidden backgroundColor="white" barStyle="dark-content" />
          <View style={styles.headerContainer}>
            <View style={styles.headerInner}>
              <TouchableOpacity
                onPress={() => this.getBack()}
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
                  style={{marginLeft: width * 0.015}}
                  color="white"
                />
                <TextInput
                  dense={true}
                  underlineColor="transparent"
                  placeholderTextColor="white"
                  placeholder="Search"
                  style={styles.search}
                  onChangeText={(e) => this.setState({currentWei: e})}
                  theme={{
                    colors: {
                      text: 'white',
                      primary: '#25dAE1',
                      selectionColor: 'transparent',
                      background: 'transparent',
                    },
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.headingContainer}>
            <View style={styles.headingInner}>
              <Menu
                name="menu"
                size={height * 0.04}
                color="white"
                style={{right: 90}}
                onPress={this.toggleModal}
              />
              <View style={{flexDirection: 'row', right: 15}}>
                <Detail
                  name="account-details-outline"
                  size={height * 0.05}
                  color="white"
                  style={{top: height * 0.002}}
                />
                <Text style={styles.mainHeadiing}>Profile</Text>
              </View>
            </View>
          </View>
          <ScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            <View style={styles.bodyContainer}>
              <MapView
                style={styles.map}
                scrollEnabled={false}
                initialRegion={this.state.initialRegion}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: parseFloat(this.state.listData?.latitude),
                  longitude: parseFloat(this.state.listData?.longitude),
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(this.state.listData?.latitude),
                    longitude: parseFloat(this.state.listData?.longitude),
                  }}
                  title={'Your Location'}
                  draggable
                />
              </MapView>
              <View style={styles.clientName}>
                <Properties name="home-city-outline" size={width * 0.08} />
                <Text style={styles.clientNameHeading}>
                  {this.state.listData.name == null
                    ? 'Untitled'
                    : this.state.listData.name}
                </Text>
                <Pressable
                  style={styles.clientDataEdit}
                  onPress={() => this.toggleModalEditProp()}
                  android_ripple={{
                    color: 'white',
                    radius: width * 0.1,
                  }}>
                  <Text style={styles.editBottonText}>Edit</Text>
                </Pressable>
              </View>
              <Modal
                animationIn="slideInDown"
                animationOut="slideOutUp"
                style={{
                  margin: 0,
                }}
                isVisible={this.state.isModalAdEditPropVisible}>
                <View style={styles.modalInner}>
                  <View style={styles.boxConatainer}>
                    <View style={styles.boxInner}>
                      {/* Box Header */}
                      <View style={styles.boxHeader}>
                        <View style={styles.boxHeaderInner}>
                          <Icon
                            name={'business'}
                            size={height * 0.05}
                            color="#5e5e5e"
                          />
                          <Text style={styles.modalHeading}>Edit Property</Text>
                          <Pressable
                            onPress={this.onCancel}
                            android_ripple={{
                              color: 'black',
                              borderless: true,
                              radius: width * 0.03,
                            }}>
                            <Icon
                              name="cancel"
                              size={height * 0.035}
                              color="black"
                              maxOpacity={0.5}
                            />
                          </Pressable>
                        </View>
                      </View>
                      {/* Box Body */}
                      <ScrollView
                        style={{width: '90%'}}
                        showsVerticalScrollIndicator={false}>
                        <View style={{flex: 1}}>
                          <View style={styles.desciptionContainer}>
                            <Text style={styles.desciptionHeading}>
                              property information
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              label="Property Name*"
                              value={this.state?.listData?.name}
                              error={this.state.error.property}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    name: text, // update the value of specific key
                                  },
                                  error: {
                                    // object that we want to update
                                    ...prevState.error, // keep all other key-value pairs
                                    property: '',
                                  },
                                }));
                              }}
                              style={styles.input}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          {this.state.error.property ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.property}>
                              {this.state.error.property}
                            </HelperText>
                          ) : null}
                          <View style={styles.inputContainer}>
                            <TextInput
                              value={this.state?.listData?.street}
                              error={this.state.error.street}
                              label="Street*"
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    street: text, // update the value of specific key
                                  },
                                  error: {
                                    // object that we want to update
                                    ...prevState.error, // keep all other key-value pairs
                                    street: '',
                                  },
                                }));
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          {this.state.error.street ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.street}>
                              {this.state.error.street}
                            </HelperText>
                          ) : null}
                          <View style={styles.inputContainer}>
                            <TextInput
                              value={this.state?.listData?.city}
                              error={this.state.error.city}
                              label="City"
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    city: text, // update the value of specific key
                                  },
                                }));
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              },
                            ]}>
                            <TextInput
                              value={this.state?.listData?.st}
                              error={this.state.error.st}
                              label="St"
                              style={[styles.input, {width: width * 0.36}]}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    st: text, // update the value of specific key
                                  },
                                }));
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />

                            <TextInput
                              value={this.state?.listData?.zipcode}
                              error={this.state.error.zipcode}
                              label="ZipCode"
                              style={[styles.input, {width: width * 0.36}]}
                              onChangeText={(text) => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    zipcode: text, // update the value of specific key
                                  },
                                }));
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              label="Custom ID*"
                              error={this.state.error.property_id}
                              value={this.state.customId}
                              style={styles.input}
                              onChangeText={(text) => {
                                this.setState({customId: text});
                                this.setState((prevState) => ({
                                  ...prevState,
                                  listData: {
                                    // object that we want to update
                                    ...prevState.listData, // keep all other key-value pairs
                                    property_id: text, // update the value of specific key
                                  },
                                  error: {
                                    // object that we want to update
                                    ...prevState.error, // keep all other key-value pairs
                                    property_id: '',
                                  },
                                }));
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>

                          <View style={styles.desciptionContainer}>
                            <Text style={styles.desciptionHeading}>
                              management company*
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TouchableOpacity
                              onPress={() => this.handleOpenDropDown(false)}
                              style={{
                                ...styles.billingCompanyBtn,
                                borderColor: this.state.error.billingId
                                  ? '#A3001B'
                                  : 'gray',
                              }}>
                              <Text>
                                {this.state.managementCompany == null
                                  ? 'Select Company'
                                  : this.state.managementCompany}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.desciptionContainer}>
                            <Text style={styles.desciptionHeading}>
                              billing company*
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TouchableOpacity
                              onPress={() => this.handleOpenDropDown(true)}
                              style={{
                                ...styles.billingCompanyBtn,
                                borderColor: this.state.error.billingId
                                  ? '#A3001B'
                                  : 'gray',
                              }}>
                              <Text>
                                {this.state.BillingCompany == null
                                  ? 'Select Company'
                                  : this.state.BillingCompany}
                              </Text>
                            </TouchableOpacity>
                            <Modal
                              animationIn="fadeIn"
                              animationOut="fadeOut"
                              isVisible={this.state.open}
                              style={styles.billingModalContainer}>
                              <View style={styles.billingModalInner}>
                                <View style={styles.billingModalHeader}>
                                  <Text style={styles.billingModalHeading}>
                                    {this.state.companies
                                      ? 'Billing Companies'
                                      : 'Managemnet Companies'}
                                  </Text>
                                  <Pressable
                                    onPress={this.handleCloseDropDown}
                                    android_ripple={{
                                      color: 'black',
                                      borderless: true,
                                      radius: width * 0.03,
                                    }}>
                                    <Icon
                                      name="cancel"
                                      size={height * 0.035}
                                      color="black"
                                      maxOpacity={0.5}
                                    />
                                  </Pressable>
                                </View>
                                {this.context.propitemList < 0 && (
                                  <ActivityIndicator
                                    color={'#25AAE1ec'}
                                    size={'large'}
                                  />
                                )}
                                {this.context.propitemList &&
                                  this.state.companies &&
                                  this.context.propitemList.map((data) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.handleDropDownData(data)
                                      }
                                      style={styles.billingCompanies}>
                                      <Text>{data.name}</Text>
                                    </TouchableOpacity>
                                  ))}
                                {this.context.manageCompList &&
                                  !this.state.companies &&
                                  this.context.manageCompList.map((data) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.handleDropDownData(data)
                                      }
                                      style={styles.billingCompanies}>
                                      <Text>{data.manager_name}</Text>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            </Modal>
                          </View>
                          {this.state.error.billingId ? (
                            <HelperText
                              type="error"
                              visible={this.state.error.billingId}>
                              {this.state.error.billingId}
                            </HelperText>
                          ) : null}
                          <View style={styles.desciptionContainer}>
                            <Text style={styles.desciptionHeading}>
                              Contact Info
                            </Text>
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Customer Name"
                              style={styles.input}
                              value={this.state.listData?.contact_name}
                              onChangeText={(text) => {
                                this.setState({CustomerName: text});
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Title / Job Description"
                              style={styles.input}
                              value={this.state.listData?.contact_title}
                              onChangeText={(text) => {
                                this.setState({customerjobDes: text});
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Phone"
                              style={styles.input}
                              value={this.state.listData?.contact_phone}
                              onChangeText={(text) => {
                                this.setState({customerPhone: text});
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Email"
                              style={styles.input}
                              value={this.state.listData?.contact_email}
                              onChangeText={(text) => {
                                this.setState({customerEmail: text});
                              }}
                              mode={'outlined'}
                              theme={{
                                colors: {
                                  text: '#25AAE1ec',
                                  primary: '#25AAE1ec',
                                  selectionColor: 'red',
                                },
                              }}
                            />
                          </View>
                        </View>
                      </ScrollView>
                      {/* Box Header */}
                      <View style={styles.boxHeader}>
                        <View style={styles.bottonContainer}>
                          <FAB
                            onPress={this.editProp}
                            style={styles.submitBotton}
                            color="white"
                            icon="check"
                            label="Update"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={styles.mainDataContainer}>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>ADDRESS</Text>
                  <View style={styles.infoViewInner}>
                    <Locate name="map-pin" size={width * 0.06} />
                    <Text style={[styles.dataFieldText, {overflow: 'scroll'}]}>
                      {`${
                        this.state.listData.street == null
                          ? ''
                          : this.state.listData.street
                      } \n ${
                        this.state.listData.city == null
                          ? ''
                          : this.state.listData.city + ','
                      } ${
                        this.state.listData.st == null
                          ? ''
                          : this.state.listData.st
                      } ${
                        this.state.listData.zipcode == null
                          ? ''
                          : this.state.listData.zipcode
                      }`}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoViewContainer}>
                  <Text style={styles.dataFieldHeadings}>CUSTOM ID</Text>
                  <View style={styles.infoViewInner}>
                    <Folder name="folder" size={width * 0.06} />
                    <Text style={styles.dataFieldText}>
                      {this.state.listData.property_id == null
                        ? '--'
                        : this.state.listData.property_id}
                    </Text>
                  </View>
                </View>
                <View style={style.footerContainer}>
                  <TouchableOpacity style={style.commentBottonContainer}>
                    <View style={style.commentBottonInner}>
                      <Message
                        name="message-circle"
                        size={height * 0.03}
                        color="purple"
                      />
                      <Text style={style.commentBottonText}>Comments(0)</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={style.commentBottonContainer}>
                    <View style={style.commentBottonInner}>
                      <Docs
                        name="document-text-outline"
                        size={height * 0.03}
                        style={{color: 'purple', top: 2}}
                      />
                      <Text style={style.commentBottonText}>Docs(0)</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.barViewContainer}>
                  <View style={styles.barView}>
                    <AnimatedCircularProgress
                      size={height * 0.2}
                      width={height * 0.035}
                      backgroundWidth={height * 0.035}
                      fill={this.state.points}
                      tintColor="#09BAF2"
                      backgroundColor="#3d5875"
                      arcSweepAngle={360}
                      rotation={0}
                      lineCap="butt">
                      {(fill) => (
                        <Text style={styles.barText}>
                          Transceiver {'\n'} {Math.round((100 * fill) / 100)} %
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                  <View style={styles.barView}>
                    <AnimatedCircularProgress
                      size={height * 0.2}
                      width={height * 0.035}
                      backgroundWidth={height * 0.035}
                      fill={this.state.points}
                      tintColor="#09BAF2"
                      backgroundColor="#3d5875"
                      arcSweepAngle={360}
                      rotation={0}
                      lineCap="butt">
                      {(fill) => (
                        <Text style={styles.barText}>
                          Repeater {'\n'} {Math.round((100 * fill) / 100)} %
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                </View>
                <View style={{height: height * 0.45}}>
                  <VictoryChart
                    style={{height: height * 0.1}}
                    domainPadding={{x: 20}}
                    animate={{duration: 500}}>
                    <VictoryBar
                      data={dataBar2.actual}
                      style={{data: {fill: 'tomato', height: height * 0.01}}}
                      // labels={({ datum }) => datum.y}
                      animate={{
                        // duration: 2000,
                        onLoad: {
                          duration: 1500,
                          before: () => ({
                            _y: 1,
                            // _x: 1,
                            fill: 'yellow',
                            label: 'BYE',
                          }),
                          after: () => ({
                            _y: 15,
                            _x: 1,
                            fill: 'yellow',
                            // label: "HI"
                          }),
                        },
                      }}
                    />
                    <VictoryAxis />
                  </VictoryChart>
                  <VictoryLegend
                    x={Dimensions.get('screen').width / 2 - 70}
                    orientation="horizontal"
                    data={[
                      {
                        name: 'Check In History',
                        symbol: {
                          fill: 'tomato',
                        },
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}
