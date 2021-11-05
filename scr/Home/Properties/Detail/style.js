import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../../utils/fonts';

//Packages

const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    width: width * 1,
    height: height * 0.09,
  },
  headerInner: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuView: {
    width: width * 0.15,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderBottomRightRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    elevation: width * 0.01,
  },
  searchView: {
    marginLeft: width * 0.03,
    width: width * 0.8,
    height: height * 0.06,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderRadius: width * 0.1,
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  search: {
    minWidth: width * 0.6,
    maxHeight: height * 0.055,
    borderBottomColor: '#25AAE1ec',
    fontSize: width * 0.04,
    fontFamily: Fonts.Montserrat,
  },
  headingContainer: {
    width: width * 1,
    height: height * 0.07,
  },
  headingInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.04,
    color: 'white',
  },
  bodyContainer: {
    backgroundColor: '#F5F5F5',
    marginBottom: width * 0.1,
  },
  map: {
    width: width * 1,
    height: height * 0.5,
  },
  clientName: {
    height: height * 0.09,
    width: width * 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: width * 0.01,
    paddingHorizontal: width * 0.02,
  },
  clientNameHeading: {
    fontSize: height * 0.025,
    fontFamily: Fonts.ComfortaaRegular,
  },
  clientDataEdit: {
    backgroundColor: '#25AAE1ec',
    width: width * 0.13,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: width * 0.01,
    borderRadius: width * 0.005,
  },
  editBottonText: {
    fontSize: height * 0.02,
    fontFamily: Fonts.ComfortaaRegular,
    color: 'white',
  },
  mainDataContainer: {
    width: width * 1,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  dataFieldHeadings: {
    fontSize: width * 0.05,
    color: '#25AAE1ec',
    fontFamily: Fonts.Montserrat,
    marginTop: height * 0.01,
    borderColor: 'black',
    borderBottomWidth: width * 0.002,
    textTransform: 'uppercase',
    marginBottom: height * 0.01,
    textAlign: 'center',
    width: width * 0.75,
  },
  infoViewContainer: {
    width: width * 0.9,
    elevation: width * 0.03,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
    borderRadius: width * 0.05,
  },
  infoViewInner: {
    height: height * 0.09,
    width: width * 0.8,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  dataFieldText: {
    fontSize: height * 0.022,
    fontFamily: Fonts.Montserrat,
    width: width * 0.7,
    textAlign: 'center',
  },

  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width * 1,
    marginTop: height * 0.01,
  },
  commentBottonContainer: {
    borderWidth: height * 0.001,
    borderColor: 'purple',
    backgroundColor: 'white',
    borderRadius: width * 0.005,
  },
  commentBottonInner: {
    flexDirection: 'row',
    padding: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBottonText: {
    fontSize: height * 0.025,
    color: 'purple',
    fontFamily: Fonts.WorkSansRegular,
  },
  barViewContainer: {
    width: width * 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  barView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.23,
    width: height * 0.23,
    backgroundColor: 'white',
    borderRadius: width * 0.6,
    marginTop: height * 0.02,
    elevation: height * 0.01,
  },
  barText: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: height * 0.018,
    fontFamily: Fonts.Montserrat,
  },

  // ------------------------------------------------

  sideModalContainer: {
    width: width * 0.6,
    left: width * -0.05,
  },
  drawerMainContainer: {
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  drawerContentContainer: {
    marginTop: height * -0.6,
    width: width * 0.367,
    flexDirection: 'column',
    top: 20,
    left: 5,
    borderTopLeftRadius: width * 0.015,
    borderBottomLeftRadius: width * 0.015,
    padding: height * 0.008,
  },
  drawerContent: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
  },
  drawerbtn: {
    marginBottom: height * 0.01354,
    fontSize: height * 0.025,
    color: 'black',
    fontWeight: 'normal',
  },

  drawerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.015,
  },

  drawerBtnIcon: {marginRight: width * 0.02},

  // ----------------------------------------------------

  // Modal

  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.02,
  },
  boxConatainer: {
    width: width * 0.85,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
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
    width: width * 0.75,
    fontSize: height * 0.018,
  },

  bottonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBotton: {
    width: width * 0.4,
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25AAE1ec',
  },
});
