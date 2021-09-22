import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center',
    justifyContent: 'space-evenly'
  },
  backgroundImageDash:{
    height:height * .22,
    width:width * .8,
    position: 'absolute',
    borderRadius:height * .01,
  },
  backgroundImage:{
    height:height * 1,
    bottom:height * 0.02,
    position: 'absolute',
    width:width * 1,
  },
  mainBotton:{
    justifyContent: 'center',
    alignItems: 'center',
    // height: height * .38,
    // width: width * .92,
    borderRadius: height * .01,
    elevation:width * .05,
    width: width * .8,
    height: height * .22,
    // paddingVertical: width * .05,
    backgroundColor: 'white',    
  },
  bottonContainer:{
    width: width * .8,
    height: height * .22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottonHeading:{
    color: 'white',
    fontSize: height * .045,
    fontFamily: Fonts.MeriendaOneRegular
  },
});