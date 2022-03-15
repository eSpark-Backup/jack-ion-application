import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../utils/fonts';

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
    flexDirection: 'row',
    borderWidth: height * 0.0027,
    borderColor: '#06012B',
    backgroundColor: '#fff',
    borderRadius: height * 0.05,
    elevation: 2,
    padding: 8,
    alignItems: 'center',
    height: width * 0.12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: width * 0.7,
  },
  buttonContainer: {
    borderWidth: height * 0.0027,
    borderColor: '#06012B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#35AFE2',
    borderRadius: height * 0.05,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    height: width * 0.12,
    width: width * 0.7,
  },
  btnText: {
    fontSize: width * 0.035,
    color: '#fff',
    fontFamily: Fonts.Montserrat,
  },
  input: {
    flex: 1,
    fontSize: width * 0.035,
    fontFamily: Fonts.Montserrat,
    alignSelf: 'center',
    padding: 0,
    margin: 0,
    borderColor: 'transparent',
  },
  errorView: {
    width: width * 0.75,
    height: width * 0.06,
    alignItems: 'flex-start',
    paddingLeft: width * 0.025,
  },
  bottomText: {
    fontSize: height * 0.022,
    fontFamily: Fonts.Montserrat,
    textAlign: 'center',
  },
  logoImg: {
    width: width * 0.3,
    height: height * 0.15,
  },
  titleText: {
    fontSize: height * 0.025,
    fontFamily: Fonts.Montserrat,
  },
  highlightText: {
    fontWeight: 'bold',
    fontSize: height * 0.035,
    color: '#35AFE2',
  },
});

export default styles;
