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
  Animated,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Pressable,
} from 'react-native';

//Packages

import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
import Modal from 'react-native-modal';

// Components
import {Fonts} from '../../utils/fonts';
import styles from './FormStyle';
import ContextProp from './Context/propContext';
import {create} from 'apisauce';
import {call} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

const baseURL = 'http://localhost:8000';

const api = create({baseURL});

export default class Splash extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isVisible: false,
      Name: '',
      Street: '',
      State: '',
      City: '',
      ZipCode: '',
      BillComp: 'ION',
      ManageComp: '',
      CustomId: '',
      ContactName: '',
      ContactTitle: '',
      ContactPhone: '',
      ContactEmail: '',
      city: '',
      st: '',
      street: '',
      zipCode: '',
      loadScreen: false,
      open: false,
      BillingCompany: 'BILLING COMPANY*',
      BillingCompanyId: '',
      info: {
        propName: '',
        propStreet: '',
        propState: '',
        propCity: '',
        propZipCode: '',
        propBillComp: '',
        propManageComp: '',
        propCustomId: '',
        propCustomId: '',
        propContactName: '',
        propContactTitle: '',
        proContactPhone: '',
        proContactEmail: '',
      },
      error: {
        property: '',
        billingId: '',
        propertyId: '',
        street: '',
        city: '',
        zipcode: '',
        st: '',
      },
      value: '',
      items: [
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'},
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.setValue = this.setValue.bind(this);
  }
  toggleModalAddProp = () => {
    this.setState({isModalAddPropVisible: !this.state.isModalAddPropVisible});
  };

  clearInputs = () => {
    this.toggleModalAddProp();
    this.setState({Name: ''});
    this.setState({Street: ''});
    this.setState({State: ''});
    this.setState({City: ''});
    this.setState({ZipCode: ''});
    this.setState({BillComp: ''});
    this.setState({ManageComp: ''});
    this.setState({CustomId: ''});
    this.setState({ContactName: ''});
    this.setState({ContactTitle: ''});
    this.setState({ContactPhone: ''});
    this.setState({ContactEmail: ''});
    this.setState({BillingCompanyId: '', BillingCompany: 'BILLING COMPANY'});
    this.setState({error: ''});
  };

  addProperty = () => {
    console.log('kiya Mila', this.state.Name);
    if (!this.state.Name) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: 'Invalid Property', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: '', // update the value of specific key
        },
      }));
    }
    if (!this.state.Street) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: 'Invalid Street', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: '', // update the value of specific key
        },
      }));
    }
    if (!this.state.BillingCompanyId) {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: 'Select Billing Company', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: '', // update the value of specific key
        },
      }));
    }
    if (this.state.CustomId === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          propertyId: 'Invalid custom id', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          ...prevState.error, // keep all other key-value pairs
          propertyId: '', // update the value of specific key
        },
      }));
      console.log('Before', this.state.info.propName);
      // const info = { ...this.state.info, propName: 'Good HAI' }
      this.setState(
        Object.assign(this.state.info, {
          propName: this.state.Name,
          propStreet: this.state.Street,
          propState: this.state.State,
          propCity: this.state.City,
          propZipCode: this.state.ZipCode,
          propBillCompId: this.state.BillingCompanyId,
          propManageComp: this.state.ManageComp,
          propCustomId: this.state.CustomId,
          propBillComp: this.state.BillingCompany,
          propContactName: this.state.ContactName,
          propContactTitle: this.state.ContactTitle,
          propContactPhone: this.state.ContactPhone,
          propContactEmail: this.state.ContactEmail,
        }),
        () => this.props.loader(true),
      );
      this.context.addProp(this.state.info);
      this.clearInputs();
    }
  };

  setValue(callback) {
    this.setState((state) => ({
      value: callback(state),
    }));
    setTimeout(() => {
      console.log('--->value', this.state.value);
    }, 1000);
  }

  handleOpenDropDown = () => {
    this.context.getBillingCompany();
    this.setState({open: !this.state.open});
  };

  handleDropDownData = (value) => {
    this.setState({BillingCompany: value.name, BillingCompanyId: value.id});
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
      <View style={styles.headingInner}>
        {this.state.loadScreen ? <Loader /> : null}
        <Pressable
          onPress={() => this.setState({isModalAddPropVisible: true})}
          style={styles.addBotton}
          android_ripple={{
            color: 'black',
            borderless: true,
            radius: width * 0.05,
          }}>
          <Icon
            name="add"
            size={height * 0.035}
            color="black"
            maxOpacity={0.5}
          />
        </Pressable>
        <Properties
          name="home-city-outline"
          size={height * 0.035}
          color="white"
        />
        <Text style={styles.mainHeadiing}>Properties</Text>
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          isVisible={this.state.isModalAddPropVisible}>
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
                    <Text style={styles.modalHeading}>New Property</Text>
                    <Pressable
                      onPress={this.clearInputs}
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
                  style={{height: height * 0.6}}
                  showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    <View style={styles.desciptionContainer}>
                      <Icon
                        name={'location-on'}
                        size={height * 0.03}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>
                        PROPERTY INFORMATION
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholder="Enter Property Name*"
                        onChangeText={(text) => {
                          this.setState({Name: text});
                          this.setState((prevState) => ({
                            error: {
                              // object that we want to update
                              ...prevState.error, // keep all other key-value pairs
                              property: '',
                            },
                          }));
                        }}
                        error={this.state.error.property}
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
                        placeholder="Enter Street*"
                        error={this.state.error.street}
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({Street: text});
                          this.setState((prevState) => ({
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
                        error={this.state.error.st}
                        placeholder="Enter State"
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({State: text});
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
                          justifyContent: 'space-evenly',
                        },
                      ]}>
                      <TextInput
                        error={this.state.error.city}
                        placeholder="Enter City"
                        style={[styles.input, {width: width * 0.36}]}
                        onChangeText={(text) => {
                          this.setState({City: text});
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
                        error={this.state.error.zipcode}
                        placeholder="Enter Zipcode"
                        style={[styles.input, {width: width * 0.36}]}
                        onChangeText={(text) => {
                          this.setState({ZipCode: text});
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
                      <Icon
                        name={'folder-open'}
                        size={height * 0.03}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>
                        PORTFOLIO DETAILS
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TouchableOpacity
                        onPress={this.handleOpenDropDown}
                        style={{
                          ...styles.billingCompanyBtn,
                          borderColor: this.state.error.billingId
                            ? '#A3001B'
                            : 'gray',
                        }}>
                        <Text>{this.state.BillingCompany}</Text>
                      </TouchableOpacity>
                      <Modal
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        isVisible={this.state.open}
                        style={styles.billingModalContainer}>
                        <View style={styles.billingModalInner}>
                          <View style={styles.billingModalHeader}>
                            <Text style={styles.billingModalHeading}>
                              Billing Companies
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
                          {this.context.propitemList &&
                            this.context.propitemList.map((data) => (
                              <TouchableOpacity
                                onPress={() => this.handleDropDownData(data)}
                                style={styles.billingCompanies}>
                                <Text>{data.name}</Text>
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
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="CUSTOM ID*"
                        placeholder="Company specific Id"
                        error={this.state.error.propertyId}
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({CustomId: text});
                          this.setState((prevState) => ({
                            error: {
                              // object that we want to update
                              ...prevState.error, // keep all other key-value pairs
                              propertyId: '',
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
                    {this.state.error.propertyId ? (
                      <HelperText
                        type="error"
                        visible={this.state.error.propertyId}>
                        {this.state.error.propertyId}
                      </HelperText>
                    ) : null}
                  </View>
                </ScrollView>
                {/* Box Header */}
                <View style={styles.boxHeader}>
                  <View style={styles.bottonContainer}>
                    <FAB
                      onPress={this.addProperty}
                      style={styles.submitBotton}
                      color="white"
                      icon="check"
                      label="Add property"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
