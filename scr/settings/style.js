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
  headerContainer: {
    width: width * 1,
    height: height * 0.09,
  },
  backgroundImage: {
    width: width * 1,
    height: height * 1,
    opacity: 0.8,
    position: 'absolute',
  },
  headerInner: {
    flex: 1,
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
    fontSize: width * 0.04,
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
    borderRadius: width * 0.04,
    marginBottom: height * 0.015,
    elevation: width * 0.01,
  },
  mainHeadiingItems: {
    fontFamily: Fonts.BalsamiqSansRegular,
    color: '#25AAE1ec',
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
    fontSize: width * 0.032,
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
