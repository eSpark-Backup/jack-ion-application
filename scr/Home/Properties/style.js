import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../utils/fonts';

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
  headingInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  addBotton: {
    height: height * 0.06,
    width: height * 0.06,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: height * 0.2,
    elevation: width * 0.04,
    left: width * 0.02,
    position: 'absolute',
  },
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.04,
    color: 'white',
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

    // borderWidth: height * .005,
  },
  modalInner: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxConatainer: {
    width: width * 0.85,
    height: height * 0.9,
    // justifyContent: "center",
  },
  boxInner: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    // borderColor: '#5F4B2F'
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
  headerHeading: {
    fontFamily: Fonts.Handlee,
    fontSize: width * 0.03,
    color: 'white',
    marginHorizontal: width * 0.05,
  },
  headerbotton: {
    height: height * 0.083,
    width: width * 0.05,
    borderRadius: width * 1,
    backgroundColor: 'white',
    elevation: width * 0.005,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: height * 0.028,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.07,
  },
  bottonText: {
    fontFamily: Fonts.Handlee,
    fontSize: width * 0.015,
    color: 'gray',
  },
  boxBody: {
    flexDirection: 'column',
    width: width * 0.47,
    height: height * 0.2,
    padding: width * 0.006,
  },
  boxBodyInner: {
    padding: width * 0.002,
    paddingLeft: width * 0.04,
    paddingRight: width * 0.04,
    flexDirection: 'row',
    borderTopRightRadius: width * 0.005,
    borderTopLeftRadius: width * 0.025,
    justifyContent: 'space-between',
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

  mainView: {
    alignItems: 'flex-start',
  },
  mainViewCenter: {
    alignItems: 'center',
  },
  dropView: {
    height: height * 0.07,
    // backgroundColor: '#83d0f1',
    width: width * 0.9,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    top: height * -0.01,
    overflow: 'hidden',
  },
  dropViewHide: {
    height: 0.0,
    overflow: 'hidden',
    // backgroundColor: "#83d0f1",
    // width: width * 1,
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row',
    // top: height * -.01
  },
  dataFieldText: {
    fontSize: height * 0.022,
    fontFamily: Fonts.Montserrat,
    marginLeft: width * 0.01,
    textAlign: 'center',
  },
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  filterButton: {
    backgroundColor: 'white',
    padding: width * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
