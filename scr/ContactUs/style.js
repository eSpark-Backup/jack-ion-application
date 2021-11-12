import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../scr/utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    // alignItems:'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderRadius: width * 0.1,
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  search: {
    width: width * 0.7,
    height: height * 0.07,
    borderBottomColor: '#25AAE1ec',
    fontSize: width * 0.05,
    fontFamily: Fonts.Montserrat,
    color: 'white',
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
    fontSize: width * 0.07,
    color: 'white',
  },
  barView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  barText: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: width * 0.04,
    fontFamily: Fonts.Montserrat,
  },
  onlineOfflineView: {
    flexDirection: 'row',
    width: width * 1,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  onlineText: {
    fontSize: width * 0.09,
    color: '#2D2A2B',
    fontFamily: Fonts.Montserrat,
    marginRight: width * 0.03,
    borderBottomWidth: width * 0.002,
    padding: 10,
    paddingHorizontal: width * 0.06,
  },
  mainBotton: {
    flexDirection: 'row',
    height: height * 0.08,
    width: width * 0.95,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    alignSelf: 'center',
    margin: width * 0.02,
    borderRadius: 4,
    elevation: width * 0.003,
    borderWidth: 1,
  },
  mainBottonText: {
    fontSize: width * 0.06,
    color: '#2D2A2B',
    fontFamily: Fonts.BalooChettan2,
  },
  insideBottonView: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: height * .06
  },
  meterReaderBotton: {
    width: width * 0.9,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.01,
    elevation: width * 0.01,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
  },
  rightHandIcon: {
    position: 'absolute',
    left: width * 0.03,
  },
  meterBottonText: {
    fontSize: width * 0.04,
    color: 'white',
    fontFamily: Fonts.BalooChettan2,
  },
  emailText: {
    fontSize: width * 0.05,
    color: 'purple',
  },
});
