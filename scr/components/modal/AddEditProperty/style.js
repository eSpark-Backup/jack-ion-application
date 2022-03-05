import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../../utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  modalInner: {
    flex: 1,
  },
  boxConatainer: {
    width: '100%',
    height: '100%',
  },
  boxInner: {
    flex: 1,
    backgroundColor: 'white',
    elevation: width * 0.02,
    alignItems: 'center',
  },
  boxHeader: {
    width: '90%',
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
    paddingBottom: width * 0.01,
  },
  modalHeading: {
    fontSize: height * 0.028,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    // right: width * 0.07,
  },
  desciptionContainer: {
    flex: 1,
    height: height * 0.05,
    width: '100%',
    borderBottomWidth: width * 0.002,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
    justifyContent: 'space-between',
  },
  desciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    textTransform: 'uppercase',
  },
  bottonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBotton: {
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25AAE1ec',
  },
  inputContainer: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontSize: height * 0.018,
  },
  loactionBtn: {
    width: width * 0.8,
    borderColor: '#25AAE1ec',
    borderWidth: width * 0.003,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: width * 0.005,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.02,
    flexDirection: 'row',
    marginVertical: width * 0.015,
    elevation: width * 0.003,
  },
  loactionBtnText: {
    fontSize: width * 0.03,
    fontFamily: Fonts.Montserrat,
    color: '#3E4A4F',
    marginRight: width * 0.01,
    width: width * 0.65,
  },
});
