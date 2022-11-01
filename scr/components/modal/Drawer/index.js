import React, { Component, Fragment, version } from 'react';

import {
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';

//Packages

import Modal from 'react-native-modal';
import { Menu as MenuT, MenuItem, MenuDivider } from 'react-native-material-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import Chart from 'react-native-vector-icons/Feather';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import CustumStatusBar from '../../StatusBar';
import TextReuseableComponent from '../../Text/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Components

import styles from './style';
const { width, height } = Dimensions.get('window');

export default class DrawerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      listItems: [],
      focus: false,
      addMenuVisible: false,
      toDetails: false,
      toEquipments: false,
      toReports: false,
      toSupport: false,
      toAlerts: false,
      propertyTitle: '',
    };
  }

  render() {
    const {
      isVisible,
      naviagateToDetail,
      naviagateToEquip,
      naviagateToAlerts,
      naviagateToSupport,
      navigateToReport,
      onCancel,
      detailsSelected,
      equipmentsSelected,
      alertSelected,
      reportsSelected,
      supportSelected,
      propertyName,
    } = this.props;
    return (
      <Modal
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        isVisible={isVisible}
        swipeDirection="left"
        onSwipeStart={onCancel}
        onBackdropPress={onCancel}
        backdropColor="black"
        statusBarTranslucent
        style={styles.modalContainer}>
        {Platform.OS ==  "android" && <CustumStatusBar backColor />}
        <View style={styles.drawerMainContainer}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#e3e3e3',
              height: height * 0.25,
              justifyContent: 'center'
            }}>
            <Image
              source={require('../../../../Images/loogo.png')}
              resizeMode="contain"
              style={{ height: height * 0.12}}
            />
          </View>
          <View style={{ height: 1.5, backgroundColor: "#35afe2" }} />
          {propertyName ? (
            <View style={styles.propertyTitle}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={width * 0.08}
                color="#25AAE1ec"
              />
              <TextReuseableComponent
                adjustsFontSizeToFit={true}
                heading
                style={{ marginLeft: 10, fontSize: height * 0.03}}
                value={`${propertyName}`}
              />
            </View>
          ) : null}
          {propertyName ? (
            <View
              style={{
                height: 1.5,
                backgroundColor: '#25AAE1ec',
                marginTop: height * 0.01,
                marginBottom: 10,
              }}
            />
          ) : null}
          <View style={styles.drawerContentContainer}>
            <TouchableOpacity onPress={naviagateToDetail}>
              <View
                style={
                  detailsSelected ? styles.selected : styles.drawerContent
                }>
                <MaterialCommunityIcons
                  name="account-details-outline"
                  size={width * 0.065}
                  color="#35afe2"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title value={'Details'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToEquip}>
              <View
                style={
                  equipmentsSelected ? styles.selected : styles.drawerContent
                }>
                <Feather
                  name="rss"
                  size={width * 0.065}
                  color="#35afe2"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title value={'Equipments'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToAlerts}>
              <View
                style={alertSelected ? styles.selected : styles.drawerContent}>
                <Feather
                  name="alert-triangle"
                  size={width * 0.065}
                  color="#35afe2"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title value={'Alerts'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToReport}>
              <View
                style={
                  reportsSelected ? styles.selected : styles.drawerContent
                }>
                <Entypo
                  name="bar-graph"
                  size={width * 0.065}
                  color="#35afe2"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title value={'Reports'} />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1.5,
              backgroundColor: "#35afe2",
              marginTop: height * 0.05,
              marginBottom: 10,
            }}
          />
          <View style={styles.drawerContentContainer}>
            <TouchableOpacity onPress={naviagateToSupport}>
              <View
                style={styles.supportContent}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={width * 0.065}
                  color="#35afe2"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title value={'Support'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}