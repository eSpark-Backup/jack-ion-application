import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../../scr/utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#75c3ff',

    },
    headerContainer: {
        width: width * 1,
        height: height * .09,
    },
    backgroundImage: {
        width: width * 1,
        height: height * 1,
        opacity: .8,
        position: 'absolute',
    },
    headerInner: {
        flex: 1,
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
        fontSize: width * .04,
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
        flexDirection: "row",
    },
    settingIcon:{
        padding: width * .01,
      },
    mainHeadiing: {
        fontFamily: Fonts.BalsamiqSansRegular,
        fontSize: height * .035,
        color: 'white',
    },
    containView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:height * .015
      },
    containerInner:{
        height: height * .09,
        width: width * .95,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: width * .03,
        borderRadius:width * .005,
        // elevation:width * .01,
        marginBottom:height * .015,
        elevation: width * .01,

      },
      mainHeadiingItems:{
        fontFamily: Fonts.BalsamiqSansRegular,
        fontSize: height * .028,
        color: '#000000',
      },
      mainHeadiingReset:{
        fontFamily: Fonts.BalsamiqSansRegular,
        fontSize: height * .028,
        color: 'white',
      },
      sideHeadingItems:{
        fontFamily: Fonts.Montserrat,
        fontSize: height * .017,
        color: 'gray',
      },
      containerReset:{
        height: height * .08,
        width: width * 1,
        backgroundColor: '#25AAE1ec',
        marginVertical: height * .01,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        padding: width * .03,
        elevation:width * .01
      },

});