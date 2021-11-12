import React from 'react';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';

export default function Loader() {
  return (
    <Modal isVisible={true} statusBarTranslucent>
      <ActivityIndicator size="large" color="#25AAE1" />
    </Modal>
  );
}
