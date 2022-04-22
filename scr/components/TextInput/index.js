import {View, Dimensions} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

export default (props) => {
  return (
    <TextInput
      {...props}
      selection
      selectionColor={'#25AAE1ec'}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      style={{
        margin: 0,
        borderRadius: width * 0.015,
        backgroundColor: '#F6F6F6',
        borderWidth: props.hide ? 0 : width * 0.0019,
        height: props.dense ? null : width * 0.13,
        ...props.style,
      }}
      mode={'flat'}
      theme={{
        colors: {
          text: '#25AAE1ec',
          primary: '#25AAE1ec',
          selectionColor: 'red',
        },
      }}
    />
  );
};
