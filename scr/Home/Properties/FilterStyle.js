import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Fonts} from '../../utils/fonts';

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },

  currentReadContainer: {
    width: '100%',
  },
  filterHeader: {
    borderBottomWidth: width * 0.003,
    elevation: 1,
  },
  billingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  utilityList: {
    marginLeft: width * 0.05,
  },

  UtilityTypeBtn: {
    borderRadius: 10,
    padding: width * 0.015,
    marginHorizontal: width * 0.02,
    marginVertical: height * 0.01,
  },

  UtilityTypeImg: {
    height: width * 0.06,
    width: width * 0.055,
  },

  utilityDots: {
    paddingLeft: width * 0.035,
    marginVertical: width * 0.035,
  },
  billingModalInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  billingModalHeader: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    paddingLeft: width * 0.05,
  },

  billingModalBtns: {
    fontSize: width * 0.032,
    marginHorizontal: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#18CADC',
  },
  billingModalBottom: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 0.5,
    paddingRight: width * 0.03,
  },

  companyList: {
    width: '100%',
    height: '60%',
  },

  billingCompnay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.005,
  },

  headerCenter: {
    alignItems: 'center',
  },
  headerCenterText: {
    fontSize: 20,
    color: '#25aae1',
  },

  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // boxConatainer: {
  //   width: width * 0.85,
  //   height: height * 0.38,
  // },
  boxInner: {
    // flex: 1,
    width: width * 0.8,
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    overflow: 'hidden',
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
  filterHeading: {
    justifyContent: 'center',
    padding: height * 0.02,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginVertical: height * 0.001,
  },
  filterLists: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: height * 0.02,
    elevation: 1,
    marginVertical: height * 0.001,
  },
  filterListText: {
    color: '#5c5c5ccf',
    fontSize: width * 0.04,
    paddingRight: 8,
  },
  inputFilterView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS == 'ios' ? height * 0.06 : null,
    backgroundColor: '#fff',
    elevation: 1,
    marginVertical: height * 0.001,
    paddingHorizontal: height * 0.02,
  },
  filterInputs: {
    width: '55%',
    textTransform: 'capitalize',
  },
  filterUtility: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: height * 0.02,
    elevation: 1,
    marginVertical: height * 0.001,
    marginHorizontal: width * 0.1,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'space-around',
    borderRadius: width * 0.02,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  scannerHeading: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: width * 0.08,
  },
});
