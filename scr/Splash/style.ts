import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../../scr/utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#4f87ff',

        // alignItems:'center',        
    },
    linear:{
        flex:1
    },
    logoContainer: {

        width: width * 1,
        height: height * .7,
    },
    logoInner:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
      },
      bottomContainer:{
        width: width * 1,
        height: height * .2,
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      bottomText:{
        fontSize: width * .03,
        color: 'white',
        fontFamily: Fonts.Montserrat,
      },
    logo: {
        width: '20%',

    },
    activityIndi: {
        position: 'relative',
        bottom: height * .0,
    },
    textHeading: {
        flexDirection: 'row',

    },
    textStyle1: {
        color: 'white',
        fontFamily: Fonts.Handlee,

    }



});