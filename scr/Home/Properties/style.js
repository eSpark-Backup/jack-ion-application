import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../utils/fonts';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    color: 'white',
    minWidth: width * 0.56,
    maxHeight: height * 0.08,
    borderBottomColor: '#25AAE1ec',
    fontSize: width * 0.04,
    fontFamily: Fonts.Montserrat,
  },
  headingContainer: {
    width: width * 1,
    height: height * 0.09,
  },
  linearGradient: {
    width: width * 0.5,
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: width * 0.003,
  },
  gradienttext: {
    fontFamily: Fonts.Handlee,
    fontSize: width * 0.055,
    color: 'white',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
  },
  searchModalContainer: {
    elevation: width * 0.005,
    width: width * 1,
    height: height * 1,
    justifyContent: 'flex-start',
    left: '-5%',
    top: '-2.5%',
  },
  searchModalInner: {
    width: width * 1,
    height: height * 0.08,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  searchModalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchModalButtons: {
    width: width * 0.05,
  },
  searchList: {
    alignItems: 'center',
    paddingVertical: height * 0.005,
  },
  propertyList: {
    flex: 1,
    width: width * 1,
  },

  // Modal
  modalContainer: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    maxHeight: height * 1,
    maxWidth: width * 1,
  },
  modalInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  propButton: {
    height: height * 0.09,
    width: width * 0.9,
    backgroundColor: 'white',
    elevation: width * 0.01,
    marginVertical: height * 0.01,
    borderColor: '#115b72',
    borderWidth: width * 0.001,
    borderRadius: width * 0.008,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  propText: {
    textTransform: 'capitalize',
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.025,
    color: '#001522',
    textShadowOffset: {
      width: width * 0.002,
      height: height * 0.002,
    },
    textShadowRadius: width * 0.005,
    textShadowColor: '#09BAF2',
  },
  buildUnitCountContainer: {
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  buildUnitCount: {
    fontFamily: Fonts.Montserrat,
    fontSize: width * 0.035,
    color: '#001522',
    textShadowOffset: {
      width: width * 0.002,
      height: height * 0.002,
    },
    textShadowRadius: width * 0.005,
    textShadowColor: '#09BAF2',
  },
  dropView: {
    height: height * 0.07,
    width: width * 0.9,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    top: height * -0.01,
    overflow: 'hidden',
  },
  filterButton: {
    backgroundColor: 'white',
    padding: width * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
