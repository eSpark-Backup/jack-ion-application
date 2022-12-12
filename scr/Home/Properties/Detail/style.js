import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { Fonts } from '../../../utils/fonts';

//Packages

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
  skeletonMainContainer: {
    width: width,
    height: height,
    // marginVertical: height * 0.01,
    // justifyContent: 'center',
  },
  skeletonInnerContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  skeletonMapContainer: {
    width: width,
    height: height * 0.5,
    marginBottom: height * 0.02
  },
  skeletonTitleContainer: {
    width: width * 0.9,
    // height: height * 0.06,
    // borderRadius: 4,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  skeletonTitleLeft: {
    width: height * 0.065,
    height: height * 0.065,
  },
  skeletonTitleMiddle: {
    width: height * 0.2,
    height: height * 0.065,
  },
  skeletonTitleRight: {
    width: height * 0.065,
    height: height * 0.065,
  },
  skeletonTpanelContainer: {
    width: width * 0.9,
    height: height * 0.06,
    borderRadius: 25,
    marginBottom: height * 0.02
  },
  skeletonGatewayContainer: {
    marginBottom: height * 0.02,
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    width: width * 1,
    height: width * 0.15,
  },
  headerInner: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuView: {
    width: width * 0.15,
    height: width * 0.1,
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
    height: width * 0.1,
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
    // backgroundColor: 'black',
  },
  headingContainer: {
    width: width * 1,
    height: width * 0.12,
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
    fontSize: width * 0.06,
    color: 'white',
    marginLeft: width * 0.01,
  },
  menuButton: {
    left: width * 0.03,
    position: 'absolute',
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
    borderBottomWidth: width * 0.003,
    textTransform: 'uppercase',
    marginBottom: height * 0.01,
    textAlign: 'center',
    width: width * 0.8,
  },
  unitMixesHeadContainer: {
    width: width * 0.8,
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: width * 0.01,
    backgroundColor: '#25AAE1ec',
    borderRadius: width * 0.01,
    elevation: width * 0.01,
  },
  unitMixesHeads: {
    width: width * 0.14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  unitmixesHeadSmall: {
    width: width * 0.1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  unitMixesValuesContainer: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: height * 0.01,
    paddingVertical: width * 0.005,
    borderWidth: 1,
    borderRadius: 5,
  },
  unitMixesValues: {
    width: width * 0.14,
    textAlign: 'center',
  },
  unitmixesValueSmall: {
    width: width * 0.1,
    textAlign: 'center',
  },
  sumUnitMixes: {
    width: width * 0.8,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#25AAE1ec',
    borderRadius: width * 0.01,
    elevation: width * 0.01,
  },
  sumUnitMixesHead: {
    width: width * 0.25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
  sumUnitMixesValuesView: {
    width: '90%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingVertical: width * 0.02,
  },
  tpanelHeads: {
    width: width * 0.25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  tpanelValuesContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
    paddingVertical: width * 0.005,
    borderWidth: 1,
    borderRadius: 5,
  },
  tpanelValues: {
    width: width * 0.25,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  contactViewContainer: {
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: height * 0.02,
    borderRadius: width * 0.05,
  },
  contactInfoContainer: {
    height: height * 0.09,
    width: width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  contactInfoInner: {
    height: height * 0.074,
    width: width * 0.14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  contactInfoText: {
    marginLeft: 10,
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
    justifyContent: 'space-between'
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
    alignSelf: 'center',
    height: width * 0.66,
    width: width * 0.66,
    marginVertical: width * 0.08,
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
    // marginBottom: height * 0.003,
    // textAlignVertical: 'top',
    fontSize: height * 0.025,
    color: 'black',
    fontWeight: 'normal',
  },

  drawerBottom: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: height * 0.015,
  },

  drawerBtnIcon: { marginRight: width * 0.02 },

  // ----------------------------------------------------

  // Modal

  modalInner: {
    flex: 1,
    // elevation: width * 0.005,
    // borderRadius: width * 0.02,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: height * 0.02,
  },
  boxConatainer: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  boxInner: {
    flex: 1,
    backgroundColor: 'white',
    // borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
  },
  boxHeader: {
    width: '100%',
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
    backgroundColor: '#fff',
    elevation: 5,
  },
  modalHeading: {
    fontSize: height * 0.028,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.07,
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
  inputContainer: {
    height: height * 0.09,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    width: '100%',
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
  onlineOfflineView: {
    flexDirection: 'row',
    width: width * 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  onlineView: {
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: 100,
    backgroundColor: '#3e95c7',
    marginHorizontal: 5
  },
  onlineText: {
    fontSize: width * 0.03,
    color: '#2D2A2B',
    fontFamily: Fonts.Montserrat,
    marginRight: width * 0.03,
  },
  offlineView: {
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: 100,
    backgroundColor: '#ff1414',
    marginHorizontal: 5
  },
  offlineText: {
    fontSize: width * 0.03,
    color: '#2D2A2B',
    fontFamily: Fonts.Montserrat,
  },
  bunchContainer: { width: '95%', backgroundColor: '#cdcdcd', borderColor: 1, padding: 10, marginVertical: 20, borderRadius: 10 },
  rowSpaceBtw: { flexDirection: 'row', justifyContent: 'space-around' },
  rowSpaceEvenly: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 5 },
  bunchAlertContainer: { flexDirection: 'row', backgroundColor: 'yellow', padding: 5, borderRadius: 5, marginVertical: 5 }
});
