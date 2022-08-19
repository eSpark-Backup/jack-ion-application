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
import Menu from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import Chart from 'react-native-vector-icons/Feather';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import CustumStatusBar from '../../StatusBar';
import TextReuseableComponent from '../../Text/index';

// Components

import styles from './style';
const { width, height } = Dimensions.get('window');

export default class DrawerModal extends Component {
  render() {
    const {
      title,
      style,
      isVisible,
      naviagateToDetail,
      naviagateToEquip,
      naviagateToAlerts,
      naviagateToChart,
      naviagateToSupport,
      navigateToReport,
      onCancel,
      children,
      doneBtnTitle,
      onDone,
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
        <CustumStatusBar backColor />
        <View style={{ backgroundColor: '#fff', height: height * 0.05 }} />
        <View style={styles.drawerMainContainer}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../../../Images/loogo.png')}
              resizeMode="contain"
              style={{ height: height * 0.15 }}
            />
          </View>
          <View style={styles.drawerContentContainer}>
            <TouchableOpacity onPress={naviagateToDetail}>
              <View style={styles.drawerContent}>
                <MaterialCommunityIcons
                  name="account-details-outline"
                  size={width * 0.065}
                  color="#7575ff"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent heading value={'Details'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToEquip}>
              <View style={styles.drawerContent}>
                <Feather
                  name="rss"
                  size={width * 0.065}
                  color="#ff9f71"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent heading value={'Equipments'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToAlerts}>
              <View style={styles.drawerContent}>
                <Feather
                  name="alert-triangle"
                  size={width * 0.065}
                  color="#f00"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent heading value={'Alerts'} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToReport}>
              <View style={styles.drawerContent}>
                <Entypo
                  name="bar-graph"
                  size={width * 0.065}
                  color="#f00"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent heading value={'Reports'} />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={naviagateToChart}>
              <View style={styles.drawerContent}>
                <Chart
                  name="pie-chart"
                  size={height * 0.035}
                  color="#009349"
                  style={{ marginRight: width * 0.02 }}
                />
                <TextReuseableComponent title={'Component'}  />
              </View>
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity
            style={{ bottom: height * 0.05 }}
            onPress={naviagateToSupport}>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: height * 0.015,
                marginBottom: height * 0.01,
              }}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={height * 0.035}
                color="#35afe2"
                style={{
                  marginRight: width * 0.02,
                  bottom: Platform.OS == 'ios' ? 2 : null,
                }}
              />
              <TextReuseableComponent heading value={'Support'} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
