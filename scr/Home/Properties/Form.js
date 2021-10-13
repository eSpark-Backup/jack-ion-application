import React, { Component, version } from 'react';

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
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';
import TabIcon from 'react-native-vector-icons/Entypo';
import Back from 'react-native-vector-icons/MaterialIcons';
import Loader from '../../components/Loader';
import Tag from 'react-native-vector-icons/Feather';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, Button, FAB } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

// Components
import { Fonts } from '../../utils/fonts';
import styles from './FormStyle';
import { Ellipse } from 'react-native-svg';
import ContextProp from './Context/propContext';
import { create } from 'apisauce';
import { call } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

const baseURL = 'http://localhost:8000';

const api = create({ baseURL });

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
      BillingCompany: 'BILLING COMPANY',
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
        property: false,
        billingId: false,
        propertyId: false,
        street: false,
        city: false,
        zipcode: false,
        st: false,
      },
      value: '',
      items: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
      ],
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.setValue = this.setValue.bind(this);
  }
  toggleModalAddProp = () => {
    this.setState({ isModalAddPropVisible: !this.state.isModalAddPropVisible });
  };
  change = (e) => {
    console.log('LELE', e);

    var info = { ...this.state.info };
    info.propName = e;

    console.log('111', info);
    this.setState({ info });
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
  };

  handleLoader = () => {
    this.setState({ loadScreen: true });
  };

  addProperty = () => {
    console.log('kiya Mila', this.state.Name);

    // if (
    //   (this.state.Name == '' || this.state.Address == '' || this.state.CustomId == ''
    //     // this.state.BillComp == '' ||
    //     // this.state.ManageComp == '' ||
    //   )
    // ) {
    //   alert('Kindly Fill All Required.');
    // }

    if (this.state.Name === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          property: true, // update the value of specific key
        },
      }));
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
    if (this.state.Street === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          street: true, // update the value of specific key
        },
      }));
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
    }
    if (this.state.BillingCompanyId === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          billingId: true, // update the value of specific key
        },
      }));
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
    if (this.state.CustomId === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          propertyId: true, // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          propertyId: false, // update the value of specific key
        },
      }));
      //  else if (this.state.info.propName == undefined || this.state.info.propAddress == undefined,
      //     this.state.info.propBillComp == undefined || this.state.info.propManageComp == undefined || this.state.info.propCustomId == undefined) {
      //     alert('Kindly Fill All Required.');
      // }
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

  setItems(callback) {
    // this.setState(state => ({
    //   items: callback(state.items)
    // }));
    console.log('--->item', callback);
  }
  handleOpenDropDown = () => {
    this.context.getBillingCompany();
    this.setState({ open: !this.state.open });
  };
  handleDropDownData = (value) => {
    this.setState({ BillingCompany: value.name, BillingCompanyId: value.id });
    this.setState({ open: !this.state.open });
  };
  render() {
    return (
      <View style={styles.headingInner}>
        {this.state.loadScreen ? <Loader /> : null}
        <Pressable
          onPress={() => this.setState({ isModalAddPropVisible: true })}
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
        <Properties name="laptop-house" size={height * 0.035} color="white" />
        <Text style={styles.mainHeadiing}>Properties</Text>
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          // avoidKeyboard={true}
          isVisible={this.state.isModalAddPropVisible}
          style={styles.modalContainer}>
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
                  style={{ height: height * 0.6 }}
                  showsVerticalScrollIndicator={false}>
                  <View style={{ flex: 1 }}>
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
                        // value={text}
                        // onChangeText={(text) => { this.setState({ info: { propName: text } }) }}
                        onChangeText={(text) => {
                          this.setState({ Name: text });
                        }}
                        error={this.state.error.property}
                        // onChangeText={(text) => this.change(text)}
                        // value={this.state.info.Name}
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
                    <View style={styles.inputContainer}>
                      {/* <View
                        style={{
                          flex: 1,
                          padding: 10,
                          // paddingTop: Constants.statusBarHeight + 10,
                          backgroundColor: '#ecf0f1',
                        }}>
                        <GooglePlacesAutocomplete
                          placeholder="Address
                        "
                          query={{
                            key: 'AIzaSyDPO63dIpxQVdsZPynkYi0Ee8FxW_mwti8',
                            language: 'en', // language of the results
                          }}
                          onPress={(data, details = null) => console.log(data)}
                          onFail={(error) => console.error(error)}
                        />
                      </View> */}
                      <TextInput
                        // label="Address*"
                        placeholder="Enter Street*"
                        error={this.state.error.street}
                        style={styles.input}
                        // value={text}
                        onChangeText={(text) => {
                          this.setState({Street: text});
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
                        // value={this.state?.listData?.st}
                        error={this.state.error.st}
                        placeholder="Enter State"
                        style={styles.input}
                        onChangeText={(text) => {
                          this.setState({State: text});
                        }}
                        // onChangeText={text => { this.editThis(text) }}
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
                        // value={this.state?.listData?.city}
                        error={this.state.error.city}
                        placeholder="Enter City"
                        style={[styles.input, { width: width * 0.36 }]}
                        onChangeText={(text) => {
                          this.setState({ City: text });
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
                        // value={this.state?.listData?.zipcode}
                        error={this.state.error.zipcode}
                        placeholder="Enter Zipcode"
                        style={[styles.input, { width: width * 0.36 }]}
                        onChangeText={(text) => {
                          this.setState({ ZipCode: text });
                        }}
                        // onChangeText={text => { this.editThis(text) }}
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
                          backgroundColor: '#F6F6F6',
                          alignSelf: 'center',
                          borderColor: this.state.error.billingId
                            ? 'red'
                            : 'gray',
                          width: '95%',
                          height: '90%',
                          borderWidth: width * 0.003,
                          borderRadius: width * 0.01,
                          justifyContent: 'center',
                          paddingHorizontal: width * 0.03,
                        }}>
                        <Text>{this.state.BillingCompany}</Text>
                      </TouchableOpacity>
                      <Modal
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        isVisible={this.state.open}
                        style={{
                          height: height * 0.4,
                        }}>
                        {this.context.propitemList &&
                          this.context.propitemList.map((data) => (
                            <TouchableOpacity
                              onPress={() => this.handleDropDownData(data)}
                              style={{
                                backgroundColor: '#F6F6F6',
                                alignSelf: 'center',
                                borderColor: 'gray',
                                width: '85%',
                                height: height * 0.09,
                                borderWidth: width * 0.003,
                                borderRadius: width * 0.01,
                                justifyContent: 'center',
                                paddingHorizontal: width * 0.03,
                              }}>
                              <Text>{data.name}</Text>
                            </TouchableOpacity>
                          ))}
                      </Modal>
                      {/* <DropDownPicker
                        open={this.state.open}
                        value={this.state.value}
                        items={this.context.propitemList}
                        setOpen={() => this.setState({ open: !this.state.open })}
                        setValue={this.setValue}
                        setItems={this.setItems}
                        style={{
                          backgroundColor: "#F6F6F6",
                          alignSelf: "center",
                          borderColor: "gray"
                        }}
                        placeholder="BILLING COMPANY*"
                        containerStyle={{
                          width: "95%",
                        }}
                        onPress={this.handleOpenDropDown}
                      /> */}
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        label="MANAGEMENT COMPANY*"
                        placeholder="Company Name"
                        style={styles.input}
                        // value={'A1 Equities'}
                        onChangeText={(text) => {
                          this.setState({ ManageComp: text });
                        }}
                        // dense={true}
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
                        label="CUSTOM ID*"
                        placeholder="Company specific Id"
                        error={this.state.error.propertyId}
                        style={styles.input}
                        // value={'A1 Equities'}
                        onChangeText={(text) => {
                          this.setState({ CustomId: text });
                        }}
                        // dense={true}
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
                        name={'contact-mail'}
                        size={height * 0.03}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>
                        CONTACT INFO (OPTIONAL)
                      </Text>
                    </View>
                    <View style={styles.contactInfoContainer}>
                      <View style={styles.contactInfoInner}>
                        <Icon
                          name="account-box"
                          size={height * 0.04}
                          color="white"
                          maxOpacity={0.5}
                        />
                      </View>
                      <TextInput
                        placeholder="Contact Name"
                        onChangeText={(text) =>
                          this.setState({ContactName: text})
                        }
                        style={styles.contactInput}
                        // mode={"outlined"}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                            background: '#ffffffaa',
                          },
                        }}
                      />
                    </View>
                    <View style={styles.contactInfoContainer}>
                      <View style={styles.contactInfoInner}>
                        <Tag
                          name="tag"
                          size={height * 0.04}
                          color="white"
                          maxOpacity={0.5}
                        />
                      </View>
                      <TextInput
                        placeholder="Title or Job Description"
                        onChangeText={(text) =>
                          this.setState({ContactTitle: text})
                        }
                        style={styles.contactInput}
                        // mode={"outlined"}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                            background: '#ffffffaa',
                          },
                        }}
                      />
                    </View>
                    <View style={styles.contactInfoContainer}>
                      <View style={styles.contactInfoInner}>
                        <Icon
                          name="local-phone"
                          size={height * 0.04}
                          color="white"
                          maxOpacity={0.5}
                        />
                      </View>
                      <TextInput
                        placeholder="Phone"
                        keyboardType="number-pad"
                        onChangeText={(text) =>
                          this.setState({ContactPhone: text})
                        }
                        style={styles.contactInput}
                        // mode={"outlined"}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                            background: '#ffffffaa',
                          },
                        }}
                      />
                    </View>
                    <View style={styles.contactInfoContainer}>
                      <View style={styles.contactInfoInner}>
                        <Icon
                          name="mail-outline"
                          size={height * 0.04}
                          color="white"
                          maxOpacity={0.5}
                        />
                      </View>
                      <TextInput
                        placeholder="Email"
                        onChangeText={(text) =>
                          this.setState({ContactEmail: text})
                        }
                        style={styles.contactInput}
                        // mode={"outlined"}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                            background: '#ffffffaa',
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
                      onPress={this.addProperty}
                      style={styles.submitBotton}
                      color="white"
                      icon="check"
                      // loading={false}
                      label="Submit"
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
