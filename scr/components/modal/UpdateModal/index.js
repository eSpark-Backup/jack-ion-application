import React, {Component, Fragment, version} from 'react';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';

//Packages

import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';

// Components

import styles from './style';
const {width, height} = Dimensions.get('window');

export default class MeterTypeBuilder extends Component {
  render() {
    const {
      title,
      style,
      isVisible,
      onCancel,
      children,
      doneBtnTitle,
      onDone,
    } = this.props;
    return (
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        isVisible={isVisible}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalInner}>
            <View style={[styles.boxConatainer, style]}>
              <View style={styles.boxInner}>
                {/* Box Header */}
                <View style={styles.boxHeader}>
                  <View style={styles.boxHeaderInner}>
                    <Icon
                      name={'business'}
                      size={height * 0.05}
                      color="#5e5e5e"
                    />
                    <Text style={styles.modalHeading}>{title}</Text>
                    <Pressable
                      onPress={onCancel}
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
                {children}
                {/* Box Footer */}
                <View style={styles.footerBtn}>
                  <View style={styles.bottonContainer}>
                    <TouchableOpacity onPress={onCancel}>
                      <View style={styles.cancelBotton}>
                        <Plus name="close" color="black" size={18} />
                        <Text style={{color: 'black'}}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDone}>
                      <View style={styles.saveUnitBotton}>
                        <Plus name="plus" color="white" size={18} />
                        <Text style={{color: 'white'}}>{doneBtnTitle}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
