import {StyleSheet, Dimensions} from 'react-native';
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
  settingIcon: {
    padding: width * 0.01,
  },
  mainHeadiing: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: width * 0.065,
    color: 'white',
  },
  containView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.015,
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
  mainHeadiingItems: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: height * 0.028,
    color: '#000000',
  },
  mainHeadiingReset: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: height * 0.028,
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
    fontSize: height * 0.018,
    color: 'gray',
  },
  alertsDataText: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.018,
    color: 'gray',
  },
  containerReset: {
    height: height * 0.08,
    width: width * 1,
    backgroundColor: '#25AAE1ec',
    marginVertical: height * 0.01,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: width * 0.03,
    elevation: width * 0.01,
  },
});
