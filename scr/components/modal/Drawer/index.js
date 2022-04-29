import React, {Component, Fragment, version} from 'react';

import {
  Text,
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
import Chart from 'react-native-vector-icons/Feather';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import CustumStatusBar from '../../StatusBar';

// Components

import styles from './style';
const {width, height} = Dimensions.get('window');

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
        <View style={{backgroundColor: '#fff', height: height * 0.05}} />
        <View style={styles.drawerMainContainer}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../../Images/loogo.png')}
              resizeMode="contain"
              style={{height: width * 0.28}}
            />
          </View>
          <View style={styles.drawerContentContainer}>
            <TouchableOpacity onPress={naviagateToDetail}>
              <View style={styles.drawerContent}>
                <MaterialCommunityIcons
                  name="account-details-outline"
                  size={width * 0.065}
                  color="#7575ff"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Details</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToEquip}>
              <View style={styles.drawerContent}>
                <Feather
                  name="rss"
                  size={width * 0.065}
                  color="#ff9f71"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Equipments</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToAlerts}>
              <View style={styles.drawerContent}>
                <Feather
                  name="alert-triangle"
                  size={width * 0.065}
                  color="#f00"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Alerts</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={naviagateToChart}>
              <View style={styles.drawerContent}>
                <Chart
                  name="pie-chart"
                  size={height * 0.035}
                  color="#009349"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Charts</Text>
              </View>
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity
            style={{bottom: height * 0.05}}
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
              <Text style={[styles.drawerbtn]}>Support</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
