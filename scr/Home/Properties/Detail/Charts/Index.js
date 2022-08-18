import React, {Component, version} from 'react';

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
  Button,
  Pressable,
  Platform,
} from 'react-native';

//Packages
import Menu from 'react-native-vector-icons/Entypo';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Equip from 'react-native-vector-icons/Feather';
import Chart from 'react-native-vector-icons/Feather';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis,
} from 'victory-native';

// Components
import styles from './style';
import CustumStatusBar from '../../../../components/StatusBar';
import TextReuseableComponent from '../../../../components/Text/index';
const {width, height} = Dimensions.get('window');

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

const dataBar = [
  {quarter: 'MON', earnings: 16500},
  {quarter: 'TUE', earnings: 14250},
  {quarter: 'WED', earnings: 19000},
  {quarter: 'THU', earnings: 1200},
  {quarter: 'FRI', earnings: 10000},
  {quarter: 'SAT', earnings: 11000},
  {quarter: 'SUN', earnings: 12000},
];

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      points: 80,
      animatedValue: new Animated.Value(0),
      clientName: 'Sugar Mamas Bake Shop',
      address: 'Address',
      addressDetail: '11750 Shelbyville Road Lousisville, KY 40243',
      billCompany: 'Billing Company',
      billCompanyDetail: 'ION Energy Solutions',
      managementCompany: 'Management Company',
      managementCompanyDetail: 'Mark Bollinger',
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
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
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Equip', this.props.navigation.state.params);
  };
  naviagateToDetail = () => {
    this.toggleModal();
    this.props.navigation.navigate(
      'Detail',
      this.props.navigation.state.params,
    );
  };
  naviagateToSupport = () => {
    // this.toggleModal();
    this.setState({isModalVisible: false});
    this.props.navigation.navigate('Support');
  };

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}
        <Modal
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          isVisible={this.state.isModalVisible}
          swipeDirection="left"
          onSwipeStart={this.toggleModal}
          onBackdropPress={this.toggleModal}
          backdropColor="black"
          statusBarTranslucent
          style={styles.modalContainer}>
          <CustumStatusBar backColor />
          <View style={{backgroundColor: '#35afe2', height: height * 0.05}} />
          <View style={[styles.drawerMainContainer]}>
            <View>
              <Menu
                name="menu"
                size={height * 0.05}
                color="white"
                onPress={this.toggleModal}
                style={{backgroundColor: '#35afe2'}}
              />
            </View>
            <View style={styles.drawerContentContainer}>
              <TouchableOpacity onPress={this.naviagateToDetail}>
                <View style={styles.drawerContent}>
                  <Detail
                    name="account-details-outline"
                    size={height * 0.035}
                    color="#7575ff"
                    style={{marginRight: width * 0.02}}
                  />
                  <TextReuseableComponent title style={styles.drawerbtn} value={"Profile"} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToEquip}>
                <View style={styles.drawerContent}>
                  <Equip
                    name="rss"
                    size={height * 0.035}
                    color="#ff9f71"
                    style={{marginRight: width * 0.02}}
                  />
                  <TextReuseableComponent title style={styles.drawerbtn} value={"Units"} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.naviagateToChart}>
                <View style={styles.drawerContent}>
                  <Chart
                    name="pie-chart"
                    size={height * 0.035}
                    color="#009349"
                    style={{marginRight: width * 0.02}}
                  />
                  <TextReuseableComponent title style={styles.drawerbtn} value={"Charts"} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{bottom: height * 0.05}}
              onPress={this.naviagateToSupport}>
              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: height * 0.015,
                  marginBottom: height * 0.01,
                }}>
                <Detail
                  name="help-circle-outline"
                  size={height * 0.035}
                  color="#35afe2"
                  style={{
                    marginRight: width * 0.02,
                    bottom: Platform.OS == 'ios' ? 2 : null,
                  }}
                />
                <TextReuseableComponent title style={styles.drawerbtn} value={"Support"} />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <StatusBar hidden backgroundColor="white" barStyle="dark-content" />
        <View style={styles.headerContainer}>
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
        </View>
        <View style={styles.headingContainer}>
          <View style={styles.headingInner}>
            <Menu
              name="menu"
              size={height * 0.04}
              color="white"
              style={{right: 95}}
              onPress={this.toggleModal}
            />
            <View style={{flexDirection: 'row', right: 15}}>
              <Detail
                name="account-details-outline"
                size={height * 0.04}
                color="white"
                style={{top: height * 0.002}}
              />
              <TextReuseableComponent title style={styles.mainHeadiing} value={"Charts"} />
            </View>
          </View>
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.bodyContainer}>
            <View style={styles.mainDataContainer}>
              <View style={styles.contactViewContainer}>
                <TextReuseableComponent title style={styles.dataFieldHeadings} value={"Property Health"} />
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
                      <TextReuseableComponent title style={styles.barText} value={`Transceiver \n ${Math.round((100 * fill) / 100)} %`} />
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
                      <TextReuseableComponent title style={styles.barText} value={`Repeater \n ${Math.round((100 * fill) / 100)} %`} />
                    )}
                  </AnimatedCircularProgress>
                </View>
              </View>
              <View style={styles.contactViewContainer}>
                <TextReuseableComponent title style={styles.dataFieldHeadings} value={"Check in history"} />
              </View>
              <View style={{height: height * 0.45}}>
                <VictoryChart
                  theme={VictoryTheme.material}
                  style={{height: height * 0.1}}>
                  <VictoryBar
                    data={dataBar2.actual}
                    style={{data: {fill: '#AFAFAF', height: height * 0.01}}}
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
                        fill: '#AFAFAF',
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
