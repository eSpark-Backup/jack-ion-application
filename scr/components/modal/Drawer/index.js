import React, {Component, Fragment, version} from 'react';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';

//Packages

import Modal from 'react-native-modal';
import Menu from 'react-native-vector-icons/Entypo';
import Detail from 'react-native-vector-icons/MaterialCommunityIcons';
import Equip from 'react-native-vector-icons/Feather';
import Chart from 'react-native-vector-icons/Feather';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';

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
        style={styles.modalContainer}>
        <View style={styles.drawerMainContainer}>
          <View style={{marginTop: StatusBar.currentHeight}}>
            <Menu
              name="menu"
              size={height * 0.05}
              color="white"
              // style={{right: 90}}
              onPress={onCancel}
              style={{backgroundColor: '#35afe2'}}
            />
          </View>
          <View style={styles.drawerContentContainer}>
            <TouchableOpacity onPress={naviagateToDetail}>
              <View style={styles.drawerContent}>
                <Detail
                  name="account-details-outline"
                  size={height * 0.035}
                  color="#7575ff"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToEquip}>
              <View style={styles.drawerContent}>
                <Equip
                  name="rss"
                  size={height * 0.035}
                  color="#ff9f71"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Units</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={naviagateToChart}>
              <View style={styles.drawerContent}>
                <Chart
                  name="pie-chart"
                  size={height * 0.035}
                  color="#009349"
                  style={{marginRight: width * 0.02}}
                />
                <Text style={styles.drawerbtn}>Charts</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={naviagateToSupport}>
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
    );
  }
}
