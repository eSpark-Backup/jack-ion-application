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
  // TextInput,
  Animated,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  // Button,
  Pressable,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Locate from 'react-native-vector-icons/Feather';
import Globe from 'react-native-vector-icons/Feather';
import Build from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import Folder from 'react-native-vector-icons/Feather';
import Tag from 'react-native-vector-icons/Feather';
import Equip from 'react-native-vector-icons/Feather';
import Chart from 'react-native-vector-icons/Feather';
import Message from 'react-native-vector-icons/Feather';
import Docs from 'react-native-vector-icons/Ionicons';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis,
} from 'victory-native';
import ContextProp from '../Context/propContext';
import { TextInput, Button, FAB } from 'react-native-paper';

// Components
import { Fonts } from '../../../utils/fonts';
import Drawer from 'react-native-drawer';
import styles from './style';
import style from './style';
import Base_URL from '../../../api/WebServices';
import { create } from 'apisauce';
const { width, height } = Dimensions.get('window');
const api = create({
  baseURL: Base_URL,
  headers: { 'Authorization' : 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjU1NTAxZjE0MjQ5MWVkYjQ4NGFkYWY2Y2FlMGFlOTY4NjM2OTFkMzhkM2QyY2JhODQ4NjFiODAwM2YzYjY0MzQ4MTUyNGMzMWRmZjkxZjFjIiwiaWF0IjoxNjMzNzk3NzQ5LCJuYmYiOjE2MzM3OTc3NDksImV4cCI6MTY2NTMzMzc0OSwic3ViIjoiMTkiLCJzY29wZXMiOltdfQ.nphSUM-ORtJTpdpl-lGY5dQsuS5r7SggPCTjOXu7B3rtqGyjqCn9FULyE_-oOahmgLXb7JMoh8awNKpGrp6Y_jegWeWe1iOJaoke2FRTEscFzsxTKDbFiFOnIn6rbfHP9UP5O2HHHuh-27Ej0-Vlkx5Z6fAB1x49G_eSr3gcwoNeFVybBElD_aiBZkSziOa7vdjGWfcOejhJgcLIYsC8vO2YJxjisubaeyCHkmRarfIXXHDWXoKDIpx6tERCKiqAHA1P6HFaF7UULUI8YYnxCjBlb29ZGtORn3scwglLeAYgUqQMMORGb9fmcGfp_npWcvLO61SZs-39TepSmNQNcq3TegIJ3J-7lYl1_FoYsI3XlzQe9H9naV5ivjL_7jZsYkr1t9HiEh-Z4qpTDZAl2B5rcbpEMJ_JBkK37QwYf0NIQQSrELj0CWq5QaBoqsxQG7Ys06Oi6N5sk8oQ1skJOGRzd4E7PGGPUHUSA6dQEVx9v7-xBvnOjqd0Z9yqwQsJx40hmXMne01JyIzWwOt6pm3vQEG_0YYBKW2sCnDw-CsVHQUIkIhiVuhcX-pXpaYds7eQmlRU5CE-mdRAhmmHxerFAvST1BzQS-rHBhoAL5Td_mz2TtXa70Gpg5rL98yNzX_0pIWCFMexPlmicZec2narA6OV35pDbRjnv4e0eMw'  },
});
const dataBar2 = {
  actual: [
    null,
    { x: 'MON', y: 11 },
    { x: 'TUE', y: 15 },
    { x: 'WED', y: 18 },
    { x: 'THU', y: 1 },
    { x: 'FRI', y: 5 },
    { x: 'SAT', y: 2 },
    { x: 'SUN', y: 3 },
  ],
  planned: [
    null,
    { x: 'MON', y: 12 },
    { x: 'TUE', y: 10 },
    { x: 'WED', y: 13 },
    { x: 'THU', y: 1 },
    { x: 'FRI', y: 5 },
    { x: 'SAT', y: 2 },
    { x: 'SUN', y: 8 },
  ],
};

const dataBar = [
  { quarter: 'MON', earnings: 16500 },
  { quarter: 'TUE', earnings: 14250 },
  { quarter: 'WED', earnings: 19000 },
  { quarter: 'THU', earnings: 1200 },
  { quarter: 'FRI', earnings: 10000 },
  { quarter: 'SAT', earnings: 11000 },
  { quarter: 'SUN', earnings: 12000 },
];

export default class Splash extends React.Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      points: 80,
      editName: '',
      animatedValue: new Animated.Value(0),
      clientName: '',
      address: '',
      addressDetail: '',
      billCompany: '',
      billCompanyDetail: '',
      managementCompany: 'Management Company',
      customId: '',
      managementCompanyDetail: 'Mark Bollinger',
      customIdDetail: '012021',
      Name: '',
      city: '',
      zipcode: '',
      Address: '',
      BillComp: '',
      ManageComp: '',
      CustomId: '',
      listData: {},
      getData: {},
      index: '',
      data: {
        atIndex: null,
        id: '',
        editName: '',
        editAddress: '',
        editBillComp: '',
        editManageComp: '',
        editCustomId: '',
      },
      error: {
        property: false,
        property_id: false,
        street: false,
        city: false,
        zipcode: false,
      },
      // editName: '',
      // editAddress: '',
      // editBillComp: '',
      // editManageComp: '',
      // editCustomId: '',
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    // const some_array = [...this.context.propList]
    // this.setState({ profileList: some_array[0] })
    console.log(
      'What we get in Listdata',
      this.props.navigation.state.params.item.item,
    );

    console.log('Kiya Mila', this.props.navigation.state.params.item.index);

    this.setState({
      info: this.props.navigation.state.params.item,
      listData: this.props.navigation.state.params.item.item,
    });
    console.log(this.props.navigation);
    // this.setState({ index: this.state.info?.isIndex })
  }

  getBack = () => {
    this.props.navigation.goBack()
    this.context.checkData()
  }

  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  toggleModalEditProp = () => {
    this.setState({
      Name: this.state.listData.name,
      Address: this.state.listData.address,
      BillComp: this.state.listData.billComp,
      ManageComp: this.state.listData.managementComp,
      CustomId: this.state.listData.customId,
    });
    this.setState({
      isModalAdEditPropVisible: !this.state.isModalAdEditPropVisible,
    });
  };
  editThis = () => {
    this.setState(
      Object.assign(this.state.data, { atIndex: this.state.info?.isIndex }),
    );
    this.setState(Object.assign(this.state.data, { id: this.state.info?.id }));
    this.setState(Object.assign(this.state.data, { editName: this.state.Name }));
    this.setState(
      Object.assign(this.state.data, { editAddress: this.state.Address }),
    );
    this.setState(
      Object.assign(this.state.data, { editBillComp: this.state.BillComp }),
    );
    this.setState(
      Object.assign(this.state.data, { editManageComp: this.state.ManageComp }),
    );
    this.setState(
      Object.assign(this.state.data, { editCustomId: this.state.CustomId }),
    );
    this.context.editProperty(this.state.data);
  };
  editProp = () => {
    if (this.state?.listData?.property === '') {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          property: true       // update the value of specific key
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          property: false       // update the value of specific key
        }
      }));
    }
    if (this.state?.listData?.property_id === '') {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          property_id: true       // update the value of specific key
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          property_id: false       // update the value of specific key
        }
      }));
    }
    if (this.state?.listData?.street === '') {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          street: true       // update the value of specific key
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          street: false       // update the value of specific key
        }
      }));
    }
    if (this.state?.listData?.city === '') {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          city: true       // update the value of specific key
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          city: false       // update the value of specific key
        }
      }));
    }
    if (this.state?.listData?.zipcode === '') {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          zipcode: true       // update the value of specific key
        }
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: {                   // object that we want to update
          ...prevState.error,    // keep all other key-value pairs
          zipcode: false       // update the value of specific key
        }
      }));
      this.toggleModalEditProp();
      const data = {
        property_id: this.state.listData.property_id,
        zipcode: this.state.listData.zipcode,
        property: this.state.listData.property,
        street: this.state.listData.street,
        city: this.state.listData.city,
      }
      this.context.editProperty(data);

      api.patch(`/property/update/${this.state?.listData?.id}`,data).then(res => {
        console.log(res.data);
      })
      this.props.navigation.navigate('ionMain');
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
  naviagateToEquip = () => {
    // this.toggleModal();
    this.setState({ isModalVisible: false });
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };
  naviagateToDetail = () => {
    // this.toggleModal();
    this.setState({ isModalVisible: false });
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
    // this.toggleModal();
    this.setState({ isModalVisible: false });
    this.props.navigation.navigate('Support');
  };

  render() {
    // console.log('What we get in Listdata',this.context.propList);
    return (
      <View style={styles.container}>
        <Modal
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          isVisible={this.state.isModalVisible}
          swipeDirection="left"
          onSwipeStart={this.toggleModal}
          onBackdropPress={this.toggleModal}
          backdropColor="black"
          style={styles.sideModalContainer}>
          <View style={styles.drawerMainContainer}>
            <View style={{ marginTop: StatusBar.currentHeight }}>
              <Menu
                name="menu"
                size={height * 0.05}
                color="white"
                // style={{right: 90}}
                onPress={this.toggleModal}
                style={{ backgroundColor: '#35afe2' }}
              />
            </View>
            <View style={styles.drawerContentContainer}>
              <TouchableOpacity onPress={this.naviagateToDetail}>
                <View style={styles.drawerContent}>
                  <Detail
                    name="account-details-outline"
                    size={height * 0.035}
                    color="#7575ff"
                    style={{ marginRight: width * 0.02 }}
                  />
                  <Text style={styles.drawerbtn}>Profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToEquip}>
                <View style={styles.drawerContent}>
                  <Equip
                    name="rss"
                    size={height * 0.035}
                    color="#ff9f71"
                    style={{ marginRight: width * 0.02 }}
                  />
                  <Text style={styles.drawerbtn}>Units</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToChart}>
                <View style={styles.drawerContent}>
                  <Chart
                    name="pie-chart"
                    size={height * 0.035}
                    color="#009349"
                    style={{ marginRight: width * 0.02 }}
                  />
                  <Text style={styles.drawerbtn}>Charts</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.naviagateToSupport}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: height * 0.015,
                }}>
                <Detail
                  name="help-circle-outline"
                  size={height * 0.035}
                  color="#35afe2"
                  style={{
                    marginBottom: height * 0.009,
                    marginRight: width * 0.02,
                  }}
                />
                <Text style={styles.drawerbtn}>Support</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
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
                style={{ marginLeft: width * 0.05 }}
                color="white"
              />
              <TextInput
                dense={true}
                underlineColor="transparent"
                placeholderTextColor="white"
                placeholder="Search"
                style={styles.search}
                onChangeText={(e) => this.setState({ currentWei: e })}
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
              style={{ right: 90 }}
              onPress={this.toggleModal}
            />
            <View style={{ flexDirection: 'row', right: 15 }}>
              <Detail
                name="account-details-outline"
                size={height * 0.05}
                color="white"
                style={{ top: height * 0.002 }}
              />
              <Text style={styles.mainHeadiing}>Profile</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.bodyContainer}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              initialRegion={this.state.initialRegion}
              zoomEnabled={true}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 38.2462342,
                longitude: -85.5375814,
                latitudeDelta: 0.00034,
                longitudeDelta: 0.0004,
              }}>
              {/* <Marker
                coordinate={{
                  "latitude": 38.2462342,
                  "longitude": -85.5375814,
                }}
                title={"Your Location"}
                draggable /> */}
            </MapView>
            <View style={styles.clientName}>
              <Build name="md-business-outline" size={width * 0.08} />
              <Text style={styles.clientNameHeading}>
                {this.state.listData.property == null
                  ? 'Untitled'
                  : this.state.listData.property}
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
              // avoidKeyboard={true}
              isVisible={this.state.isModalAdEditPropVisible}
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
                        <Text style={styles.modalHeading}>Edit Property</Text>
                        <Pressable
                          onPress={this.toggleModalEditProp}
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
                            label="Property Name*"
                            value={this.state?.listData?.property}
                            placeholder={this.state?.listData?.property}
                            error={this.state.error.property}
                            // placeholder="Enter Name"
                            onChangeText={(text) => {
                              this.setState(prevState => ({
                                ...prevState,
                                listData: {                   // object that we want to update
                                  ...prevState.listData,    // keep all other key-value pairs
                                  property: text       // update the value of specific key
                                }
                              }));

                            }}

                            // onChangeText={(text) => { this.editThis(text) }}
                            onBlur={this.editThis}
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
                            // placeholder={this.state.info?.address}
                            label="Property ID*"
                            error={this.state.error.property_id}
                            value={this.state?.listData?.property_id}
                            placeholder={this.state?.listData?.property_id}
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState(prevState => ({
                                ...prevState,
                                listData: {                   // object that we want to update
                                  ...prevState.listData,    // keep all other key-value pairs
                                  property_id: text       // update the value of specific key
                                }
                              }));
                            }}
                            // onChangeText={text => { this.editThis(text) }}
                            onBlur={this.editThis}
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
                            value={this.state?.listData?.street}
                            placeholder={this.state?.listData?.street}
                            error={this.state.error.street}
                            label="Street*"
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState(prevState => ({
                                ...prevState,
                                listData: {                   // object that we want to update
                                  ...prevState.listData,    // keep all other key-value pairs
                                  street: text       // update the value of specific key
                                }
                              }));
                            }}
                            // onChangeText={text => { this.editThis(text) }}
                            onBlur={this.editThis}
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
                        <View style={[styles.inputContainer, { flexDirection: 'row', justifyContent: 'space-around' }]}>
                          <TextInput
                            value={this.state?.listData?.city}
                            error={this.state.error.city}
                            placeholder={this.state?.listData?.city}
                            label="City*"
                            style={[styles.input, { width: width * 0.36 }]}
                            onChangeText={(text) => {
                              this.setState(prevState => ({
                                ...prevState,
                                listData: {                   // object that we want to update
                                  ...prevState.listData,    // keep all other key-value pairs
                                  city: text       // update the value of specific key
                                }
                              }));
                            }}
                            // onChangeText={text => { this.editThis(text) }}
                            onBlur={this.editThis}
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
                            placeholder={this.state?.listData?.zipcode}
                            label="ZipCode*"
                            style={[styles.input, { width: width * 0.36 }]}
                            onChangeText={(text) => {
                              this.setState(prevState => ({
                                ...prevState,
                                listData: {                   // object that we want to update
                                  ...prevState.listData,    // keep all other key-value pairs
                                  zipcode: text       // update the value of specific key
                                }
                              }));
                            }}
                            // onChangeText={text => { this.editThis(text) }}
                            onBlur={this.editThis}
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
                        {/* <View style={styles.inputContainer}>
                          <TextInput
                            label="BILLING COMPANY*"
                            // placeholder="Like ION Energy Solutions, etc"
                            value={this.state.BillComp}
                            // dense={true}
                            onChangeText={(text) => {
                              this.setState({BillComp: text});
                            }}
                            onBlur={this.editThis}
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
                        </View> */}
                        <View style={styles.inputContainer}>
                          <TextInput

                            value={this.state.ManageComp}
                            label="MANAGEMENT COMPANY*"
                            placeholder="Company Name"
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState({ ManageComp: text });
                            }}
                            onBlur={this.editThis}
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
                        {/* <View style={styles.inputContainer}>
                          <TextInput
                            label="CUSTOM ID*"
                            value={this.state.CustomId}
                            placeholder="Company specific Id"
                            style={styles.input}
                            onChangeText={(text) => {
                              this.setState({CustomId: text});
                            }}
                            onBlur={this.editThis}
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
                        </View> */}
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
                          // loading={false}
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
                <Text style={styles.dataFieldHeadings}>
                  ADDRESS
                </Text>
                <View style={styles.infoViewInner}>
                  <Locate name="map-pin" size={width * 0.06} />
                  <Text style={styles.dataFieldText}>
                    {this.state.listData.street == null
                      ? '--'
                      : `${this.state.listData.street} \n ${this.state.listData.city}, ${this.state.listData.st} ${this.state.listData.zipcode}`}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.infoViewContainer}>
                <Text style={styles.dataFieldHeadings}>
                  {this.state.billCompany}
                </Text>
                <View style={styles.infoViewInner}>
                  <Globe name="globe" size={width * 0.06} />
                  <Text style={styles.dataFieldText}>
                    {this.state.listData.billComp}
                  </Text>
                </View>
              </View>
              <View style={styles.infoViewContainer}>
                <Text style={styles.dataFieldHeadings}>
                  {this.state.managementCompany}
                </Text>
                <View style={styles.infoViewInner}>
                  <Folder name="folder" size={width * 0.06} />
                  <Text style={styles.dataFieldText}>
                    {this.state.listData.managementComp}
                  </Text>
                </View>
              </View> */}
              <View style={styles.infoViewContainer}>
                <Text style={styles.dataFieldHeadings}>
                  CUSTOM ID
                </Text>
                <View style={styles.infoViewInner}>
                  <Folder name="folder" size={width * 0.06} />
                  <Text style={styles.dataFieldText}>
                    {this.state.listData.property_id == null
                      ? '--'
                      : this.state.listData.property_id}
                  </Text>
                </View>
              </View>
              <View style={styles.infoViewContainer}>
                <Text style={styles.dataFieldHeadings}>Office Contact #</Text>
                <View style={styles.infoViewInner}>
                  <Globe name="phone" size={width * 0.06} />
                  <Text style={styles.dataFieldText}>
                    {this.state.listData.office_contact_number == null
                      ? '--'
                      : this.state.listData.office_contact_number}
                  </Text>
                </View>
              </View>
              <View style={styles.contactViewContainer}>
                <Text style={styles.dataFieldHeadings}>Contact Info</Text>
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
                    value={this.state.listData.contact}
                    placeholder="Contact Name"
                    onChangeText={(text) => console.log(text)}
                    style={styles.contactInput}
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
                    value={this.state.listData.contact_email}
                    placeholder="Email"
                    onChangeText={(text) => console.log(text)}
                    style={styles.contactInput}
                  />
                </View>
              </View>
              <View style={styles.contactViewContainer}>
                <Text style={styles.dataFieldHeadings}>Manager Info</Text>
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
                    value={this.state.listData.Contact}
                    placeholder="Contact Name"
                    onChangeText={(text) => console.log(text)}
                    style={styles.contactInput}
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
                    value={this.state.listData.Contact_Email}
                    placeholder="Email"
                    onChangeText={(text) => console.log(text)}
                    style={styles.contactInput}
                  />
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
                      style={{ color: 'purple', top: 2 }}
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
              <View style={{ height: height * 0.45 }}>
                <VictoryChart
                  style={{ height: height * 0.1 }}
                  domainPadding={{ x: 20 }}
                  animate={{ duration: 500 }}>
                  <VictoryBar
                    data={dataBar2.actual}
                    style={{ data: { fill: 'tomato', height: height * 0.01 } }}
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
                  {/* <VictoryBar data={dataBar2.planned} style={{ data: { fill: 'orange' } }} /> */}
                  {/* <VictoryBar data={dataBar} x='quater' y='earnings' /> */}
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
    );
  }
}
