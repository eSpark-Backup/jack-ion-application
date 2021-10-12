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

// Components
import { Fonts } from '../../utils/fonts';
import styles from './FormStyle';
import { Ellipse } from 'react-native-svg';
import ContextProp from './Context/propContext';
import { create } from 'apisauce';
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
      Address: '',
      BillComp: 'ION',
      ManageComp: '',
      CustomId: '007',
      contact: '',
      contactEmail: '',
      loadScreen: false,
      info: {
        propName: '',
        propAddress: '',
        propBillComp: '',
        propManageComp: '',
        propCustomId: '',
      },
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
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
    this.setState({ Name: '' });
    this.setState({ Address: '' });
    this.setState({ BillComp: '' });
    this.setState({ ManageComp: '' });
    this.setState({ CustomId: '' });
  };

  // addProperty = () => {
  //   var raw = JSON.stringify({
  //     property: 'Added Property',
  //     street: 'Grove Street',
  //     developer: 'Wirad',
  //     managerName: 'Sarim',
  //     contact: '03232323201',
  //     contactEmail: 'contracter@contact.com',
  //   });

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       property: 'Added New Property',
  //       street: 'Street',
  //       developer: '----',
  //       managerName: '----',
  //       contact: '03232323201',
  //       contactEmail: 'contracter@contact.com',
  //     }),
  //     redirect: 'follow',
  //   };

  //   fetch('http://192.168.18.71:8000/createProperty', requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log('error', error));
  // };
  handleLoader = () => {
    this.setState({ loadScreen: true });
  }

  addProperty = () => {
    console.log('kiya Mila', this.state.Name);

    if (
      (this.state.Name == '' || this.state.Address == '' || this.state.CustomId == ''
        // this.state.BillComp == '' ||
        // this.state.ManageComp == '' ||
      )
    ) {
      alert('Kindly Fill All Required.');
    }
    //  else if (this.state.info.propName == undefined || this.state.info.propAddress == undefined,
    //     this.state.info.propBillComp == undefined || this.state.info.propManageComp == undefined || this.state.info.propCustomId == undefined) {
    //     alert('Kindly Fill All Required.');
    // }
    else {
      console.log('Before', this.state.info.propName);
      // const info = { ...this.state.info, propName: 'Good HAI' }
      this.setState(
        Object.assign(this.state.info, { propName: this.state.Name }),
      );
      this.setState(
        Object.assign(this.state.info, { propAddress: this.state.Address }),
      );
      this.setState(
        Object.assign(this.state.info, { propBillComp: this.state.BillComp }),
      );
      this.setState(
        Object.assign(this.state.info, { propManageComp: this.state.ManageComp }),
      );
      this.setState(
        Object.assign(this.state.info, { propContact: this.state.contact }),
      );
      this.setState(
        Object.assign(this.state.info, { propCustomId: this.state.CustomId }),
      );
      this.setState(
        Object.assign(this.state.info, {
          propContactEmail: this.state.contactEmail,
        }),
        () => this.props.loader(true)
      );
      console.log('After', this.state.info.propName);
      this.context.addProp(this.state.info);
      this.clearInputs();

    }
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
                        placeholder="Enter Name"
                        // value={text}
                        // onChangeText={(text) => { this.setState({ info: { propName: text } }) }}
                        onChangeText={(text) => {
                          this.setState({ Name: text });
                        }}
                        // onChangeText={(text) => this.change(text)}
                        style={styles.input}
                        // value={this.state.info.Name}
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
                        placeholder="Enter Address"
                        style={styles.input}
                        // value={text}
                        onChangeText={(text) => {
                          this.setState({ Address: text });
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
                      <TextInput
                        label="BILLING COMPANY*"
                        placeholder="Like ION Energy Solutions, etc"
                        // value={'ION Energy Solutions'}
                        // dense={true}
                        onChangeText={(text) => {
                          this.setState({ BillComp: text });
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
                        onChangeText={(text) => this.setState({ contact: text })}
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
                        onChangeText={(text) => console.log(text)}
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
                        onChangeText={(text) => console.log(text)}
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
                          this.setState({ contactEmail: text })
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
