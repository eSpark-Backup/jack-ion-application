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
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.035,
    color: 'white',
  },
  toolIcon: {
    padding: width * 0.01,
  },
  toolContainer: {
    height: height * .9,
    width: width * 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolButton: {
    height: height * 0.19,
    width: width * 0.85,
    backgroundColor: 'black',
    elevation: width * 0.04,
    marginVertical: height * 0.04,
    borderColor: '#115b72',
    borderRadius: width * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolImage: {
    height: height * 0.19,
    width: width * 0.85,
    borderRadius: width * 0.03,
    position: 'absolute',
    opacity: 0.6,
  },
  toolName: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.04,
    color: 'white',
    textAlign: 'center',
  },
});
