import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Fonts} from '../../scr/utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#75c3ff',
  },
  headingContainer: {
    width: width * 1,
    height: height * 0.07,
  },
  headingInner: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  drawerMenuBtn: {
    width: width * 0.15,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIcon: {
    padding: width * 0.01,
  },
  mainHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.12,
  },
  mainHeadiing: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: width * 0.065,
    color: 'white',
  },
  loadingText: {fontSize: height * 0.03},
  containView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.015,
  },
  containerInner: {
    width: width * 0.95,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.015,
    borderRadius: width * 0.005,
    // elevation:width * .01,
    marginBottom: height * 0.015,
    elevation: width * 0.01,
  },
  alertsContentContainer: {flexDirection: 'row', alignItems: 'center'},
  allAlertsCheckBoxContainer: {
    marginRight: Platform.OS == 'ios' ? 10 : 0,
  },
  alertsCheckBoxContainer: {
    marginHorizontal: Platform.OS == 'ios' ? 5 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeadiingItems: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: height * 0.026,
    color: '#000000',
    textTransform: 'capitalize',
  },
  mainHeadiingReset: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: Platform.OS == "ios" ? (height * 0.020) : height * 0.028,
    color: 'white',
  },
  subHeading: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: height * 0.028,
    color: '#999',
  },
  sideHeadingItems: {
    width: width * 0.67,
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.014,
    color: 'gray',
  },
  contactOtherInfo: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.014,
    color: 'gray',
    paddingHorizontal: 2,
  },
  alertsDataText: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.014,
    color: 'gray',
    textAlign: 'center',
  },
  containerReset: {
    height: height * 0.08,
    // width: width/3,
    backgroundColor: '#25AAE1ec',
    marginVertical: height * 0.01,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: width * 0.03,
    elevation: width * 0.01,
  },
  tabContainer: {
    flexDirection: 'row',
    width: width/3, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#25AAE1ec', 
    padding: 10
  },

  selectAllBtnContainer: {
    width: width * 1,
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: Platform.OS == 'ios' ? width * 0.035 : width * 0.025,
  },

  dismissBtn: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },

  settingsModalBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    marginVertical: height * 0.01,
  },
  settinbgModalBodyDesc: {
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.02,
  },

  settingsComingSoon: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 1,
    color: '#999',
    borderColor: '#999',
    textAlign: 'center',
  },
  settingsContentContainer: {
    flexDirection: 'row',
    width: width * 0.25,
    justifyContent: 'space-around',
  },

  subHeadContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dismissModalBody: {
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  dismissModalNotesHead: {
    fontWeight: '100',
    color: '#bbb',
    textTransform: 'uppercase',
    fontSize: height * 0.016,
  },
  dismissModalNotesInput: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderRadius: 5,
  },
  dismissModalFooter: {flexDirection: 'row', justifyContent: 'flex-end'},
  dismissModalCancelBtn: {
    borderWidth: 1,
    borderRadius: 5,
    padding: height * 0.01,
    marginHorizontal: height * 0.01,
  },
  dismissModalDoneBtn: {
    borderRadius: 5,
    backgroundColor: '#25AAE1',
    padding: height * 0.01,
    marginHorizontal: height * 0.01,
  },
  newContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#25AAE1',
    padding: height * 0.01,
    marginHorizontal: height * 0.01,
  },
  newContactBtnText: {color: 'white', fontSize: height * 0.024},
  contactInfoContainer: {
    width: width * 0.85,
    // height: width * 0.095,
    marginVertical: height * 0.01,
    // paddingVertical: height * 0.001,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#cfcfcf',
  },
  contactInfoInner: {
    height: width * 0.09,
    width: width * 0.12,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderColor: '#cfcfcf',
    // left: width * 0.03,
    // position: 'absolute',
    borderTopLeftRadius: width * 0.01,
    borderBottomLeftRadius: width * 0.01,
  },
  contactInput: {
    height: width * 0.085,
    width: width * 0.7,
    fontSize: height * 0.02,
    borderWidth: 0,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderRightWidth: 1,
    // borderTopLeftRadius: 0,
    // borderBottomLeftRadius: 0,
    // borderLeftWidth: 0,
    // position: 'absolute',
    // left: width * 0.17,
    backgroundColor: 'white',
  },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.86,
    marginVertical: height * 0.02,
  },
  advanceBtnText: {
    fontSize: width * 0.03,
    color: '#25AAE1',
    fontWeight: 'bold',
  },
  contactAlertTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: height * 0.02,
  },
  contactAlertTypeInner: {
    alignItems: 'flex-start',
  },
  contactAlertHeadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  contactAlertTypeHeadText: {color: '#999'},

  contactAlertTypeCheckBoxContainer: {
    width: width * 0.05,
    height: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01,
  },
  contactAlertTypeCheckBox: {
    transform: [{scaleX: width * 0.0018}, {scaleY: width * 0.0018}],
  },
  contactAlertTypeContent: {
    fontSize: width * 0.035,
    fontFamily: Fonts.BalsamiqSansRegular,
    textTransform: 'capitalize',
  },
  noteContainer: {width: width * 0.85},
  messageText: {
    fontSize: width * 0.03,
  },
  viewAlignment: {flexDirection: 'row', alignItems: 'center'},
});
