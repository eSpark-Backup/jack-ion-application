import {
  View,
  Switch,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';

import styles from './style';

import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TextReuseableComponent from '../../Text/index';

const {width, height} = Dimensions.get('window');

export default ({isVisible, onClose, ModalHeader, ModalBody, ModalFooter}) => {
  return (
    <KeyboardAvoidingView>
      <Modal isVisible={isVisible} avoidKeyboard>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
          }}>
          <View style={styles.modalHeader}>
            <TextReuseableComponent title style={styles.settingModalHead} value={ModalHeader} />
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons size={width * 0.05} name="close" />
            </TouchableOpacity>
          </View>
          {ModalBody}
          <View style={styles.modalFooter}>{ModalFooter}</View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
