import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: height * 0.04,
  },
  textInputContainer: {
    borderWidth: height * 0.0027,
    borderColor: '#06012B',
    width: width * 0.75,
    height: width * 0.12,
    backgroundColor: '#fff',
    borderRadius: height * 0.05,
    elevation: height * 0.002,
  },
  buttonContainer: {
    borderWidth: height * 0.0027,
    borderColor: '#06012B',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.75,
    height: width * 0.12,
    backgroundColor: '#35AFE2',
    borderRadius: height * 0.05,
    elevation: height * 0.009,
  },
});

export default styles;
