import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../../utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxInner: {
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
  },
  modalHeading: {
    fontSize: width * 0.048,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.02,
  },
  desciptionContainer: {
    height: height * 0.035,
    width: width * 0.7,
    alignSelf: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  desciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: Fonts.ComfortaaRegular,
  },
  inputContainer: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: width * 0.75,
    fontSize: width * 0.03,
  },
  footerBtn: {
    width: width * 0.8,
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    borderTopWidth: width * 0.001,
    backgroundColor: 'white',
  },
  bottonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // margin: width * .02,
  },
  cancelBotton: {
    width: width * 0.205,
    height: height * 0.05,
    margin: width * 0.01,
    padding: width * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E2E2E2',
    borderRadius: width * 0.02,
    elevation: width * 0.01,
  },
  saveUnitBotton: {
    // width: width * 0.25,
    height: height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: width * 0.01,
    padding: width * 0.015,
    borderRadius: width * 0.02,
    backgroundColor: '#25AAE1',
    elevation: width * 0.01,
  },
});
