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
    height: width * 0.15,
  },
  headerInner: {
    flex: 1,
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
    paddingHorizontal: width * 0.02,
    width: width * 0.8,
    height: width * 0.1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderRadius: width * 0.1,
    elevation: 5,
    flexDirection: 'row',
  },
  searchBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: width * 0.1,
    width: width * 0.6,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: width * 0.06,
    height: width * 0.08,
    width: width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    width: width * 0.8,
    maxHeight: width * 0.1,
    borderBottomColor: '#25AAE1ec',
    paddingRight: width * 0.05,
    fontSize: width * 0.04,
    fontFamily: Fonts.Montserrat,
  },
  headingContainer: {
    width: width * 1,
    height: width * 0.12,
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
    height: width * 0.15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#25AAE1',
    elevation: width * 0.01,
    flexDirection: 'row',
    paddingHorizontal: width * 0.01,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
});
