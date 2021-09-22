import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../../utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',

    // alignItems:'center',        
  },
  headerContainer: {
    width: width * 1,
    height: height * .09,
  },
  headerInner: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuView: {
    width: width * .15,
    height: height * .06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderBottomRightRadius: width * .1,
    borderTopRightRadius: width * .1,
    elevation: width * .01,
  },
  searchView: {
    marginLeft: width * .03,
    width: width * .8,
    height: height * .06,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    borderRadius: width * .1,
    elevation: width * .01,
    flexDirection: 'row'
  },
  search: {
    width: width * .7,
    height: height * .07,
    borderBottomColor: '#25AAE1ec',
    fontSize: width * .05,
    fontFamily: Fonts.Montserrat,
    color: 'white',
  },
  headingContainer: {
    width: width * 1,
    height: height * .07,
  },
  headingInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25AAE1ec',
    elevation: width * .01,
    flexDirection: "row"
  },
  mainHeadiing: {
    fontFamily: Fonts.Montserrat,
    fontSize: width * .07,
    color: 'white',

  },
  map: {
    width: width * 1,
    height: height * .5,

  },
  barView: {
    height: height * .36,
    width: height * .36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: height * .02,
    backgroundColor: 'white',
    borderRadius: width * .6,
    elevation: height * .01,
  },
  barText: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: width * .04,
    fontFamily: Fonts.Montserrat,
  },
  onlineOfflineView: {
    flexDirection: 'row',
    width: width * 1,
    height: height * .05,
    justifyContent: 'center',
    alignItems: 'center'
  },
  onlineView: {
    width: width * .035,
    height: height * .02,
    borderRadius: width * 1,
    backgroundColor: '#09BAF2'
  },
  onlineText: {
    fontSize: width * .03,
    color: '#2D2A2B',
    fontFamily: Fonts.Montserrat,
    marginRight: width * .03
  },
  offlineView: {
    width: width * .035,
    height: height * .02,
    borderRadius: width * 1,
    backgroundColor: '#3d5875'
  },
  offlineText: {
    fontSize: width * .03,
    color: '#2D2A2B',
    fontFamily: Fonts.Montserrat,
  },
  mainBotton: {
    flexDirection: 'row',
    height: height * .08,
    width: width * .95,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * .03,
    alignSelf: 'center',
    margin: width * .02,
    borderRadius: 4,
    elevation: width * .003,
    borderWidth: 1
  },
  mainBottonText: {
    fontSize: width * .06,
    color: '#2D2A2B',
    fontFamily: Fonts.BalooChettan2,
  },
  insideBottonView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * .06
  },
  meterReaderBotton: {
    width: width * .9,
    height: height * .05,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * .01,
    elevation: width * .01,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row'
  },
  rightHandIcon: {
    position: 'absolute',
    left: width * .03
  },
  meterBottonText: {
    fontSize: width * .04,
    color: 'white',
    fontFamily: Fonts.BalooChettan2,
  },

});