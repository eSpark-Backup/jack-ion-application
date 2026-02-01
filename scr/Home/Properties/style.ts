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
  addBotton: {
    height: width * 0.09,
    width: width * 0.09,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.2,
    elevation: width * 0.04,
    left: width * 0.02,
    position: 'absolute',
  },
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: width * 0.06,
    color: 'white',
    marginLeft: width * 0.01,
  },
  headerInner: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuView: {
    width: width * 0.14,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderBottomRightRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    elevation: width * 0.01,
  },
  searchView: {
    marginLeft: width * 0.01,
    marginRight: width * 0.01,
    paddingHorizontal: width * 0.01,
    width: width * 0.7,
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
    width: width * 0.5,
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
    margin: 0,
    flex: 1,
    elevation: width * 0.005,
    // width: width * 1,
    // height: height * 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // left: '-5%',
    // top: '-2.5%',
  },
  searchModalInner: {
    width: width * 0.7,
    height: width * 0.1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#25AAE1',
    elevation: width * 0.01,
    flexDirection: 'row',
    paddingHorizontal: width * 0.01,
    borderRadius: width * 0.1,
    marginTop: width * 0.025,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
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
    borderColor: '#115b72',
    borderWidth: width * 0.001,
    borderRadius: width * 0.008,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    // elevation: width * 0.01,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  propText: {
    textTransform: 'capitalize',
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.025,
    color: '#001522',
    // textShadowOffset: {
    //   width: width * 0.002,
    //   height: height * 0.002,
    // },
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
    // textShadowOffset: {
    //   width: width * 0.002,
    //   height: height * 0.002,
    // },
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
  skeletonMainContainer: {
    width: width * 0.9,
    height: height * 0.09,
    marginVertical: height * 0.01,
    justifyContent: 'center',
  },
  skeletonInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  skeletonIcon: {
    width: height * 0.065,
    height: height * 0.065,
    borderRadius: 4,
  },
  skeletonTitle: {
    width: width * 0.5,
    height: height * 0.03,
    borderRadius: 4,
  },
  skeletonDescription: {
    marginTop: width * 0.03,
    width: width * 0.4,
    height: height * 0.015,
    borderRadius: 4,
  },
  skeletonEquipsContainer: {flexDirection: 'row'},
  skeletonBuilds: {
    width: width * 0.04,
    height: height * 0.045,
    borderRadius: 4,
    marginRight: 4,
  },
  skeletonUnits: {
    width: width * 0.04,
    height: height * 0.045,
    borderRadius: 4,
    marginLeft: 4,
  },

  // Property list styling

  propListContainer:{
    alignItems: 'center',
    marginVertical: height * 0.01,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  animatedView:{
    flexDirection: 'row',
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: width * 0.01,
    backgroundColor: '#25AAE1ec',
    borderBottomLeftRadius: width * 0.01,
    borderBottomRightRadius: width * 0.01,
    borderWidth: width * 0.001,
  },
  animatedViewDetailBtn:{
    margin: width * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
  },
  animatedViewDetailBtnName:{
    color: 'white',
    fontFamily: Fonts.Montserrat,
    fontSize: width * 0.03,
  },
  pullDownContainer:{
    width:width * 0.4,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:'white',
    elevation:height * .005,
    position:'absolute'
  },
  pullDownText:{
    fontFamily: Fonts.Montserrat,
    fontSize: height * .015,
  }

  
});
