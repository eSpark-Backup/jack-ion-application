import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  headingInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  addBotton: {
    height: height * 0.06,
    width: height * 0.06,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: height * 0.2,
    elevation: width * 0.04,
    left: width * 0.02,
    position: 'absolute',
  },
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.04,
    color: 'white',
    marginLeft: 10
  },

  // Modal
  modalContainer: {
    // elevation: width * .005,
    // borderRadius: width * .02,
    // backgroundColor: 'white',
    // maxHeight: height * 1,
    // maxWidth: width * 1,
    // borderWidth: height * .005,
  },
  modalInner: {
    // flex: 1,
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.85,
    height: height * 0.6,
    // justifyContent: "center",
  },
  boxInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    // borderColor: '#5F4B2F'
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    // backgroundColor: 'white',
    // borderBottomWidth:height * .005,
    // borderColor:'#5F4B2F',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
  },
  modalHeading: {
    fontSize: height * 0.028,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.07,
  },
  desciptionContainer: {
    height: height * 0.05,
    width: width * 0.7,
    borderBottomWidth: width * 0.002,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  desciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
  },
  inputContainer: {
    height: height * 0.09,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    // height: height * .07,
    width: width * 0.75,
    fontSize: height * 0.018,
  },
  contactInfoContainer: {
    height: height * 0.09,
    width: width * 0.8,
    // borderBottomWidth: width * .002,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfoInner: {
    height: height * 0.074,
    width: width * 0.14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    left: width * 0.025,
    position: 'absolute',
    borderTopLeftRadius: width * 0.01,
    borderBottomLeftRadius: width * 0.01,
  },
  contactInput: {
    height: height * 0.07,
    width: width * 0.61,
    fontSize: height * 0.018,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    position: 'absolute',
    left: width * 0.165,
  },
  bottonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBotton: {
    // width: width * .4,
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25AAE1ec',
  },
  billingCompanyBtn: {
    backgroundColor: '#F6F6F6',
    alignSelf: 'center',
    width: '95%',
    height: '90%',
    borderWidth: width * 0.003,
    borderRadius: width * 0.01,
    justifyContent: 'center',
    paddingHorizontal: width * 0.03,
  },
  billingModalContainer: {
    height: height * 0.4,
  },
  billingModalInner: {
    padding: width * 0.05,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
  },
  billingModalHeader: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  billingModalHeading: {
    color: 'black',
    fontSize: height * 0.028,
    fontFamily: Fonts.ComfortaaRegular,
  },
  billingCompanies: {
    backgroundColor: '#F6F6F6',
    alignSelf: 'center',
    borderColor: 'gray',
    width: '85%',
    height: height * 0.09,
    borderWidth: width * 0.003,
    borderRadius: width * 0.01,
    justifyContent: 'center',
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.005,
  },
});
