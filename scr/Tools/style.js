import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../../scr/utils/fonts';

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
        flexDirection: "row"
    },
    mainHeadiing: {
        fontFamily: Fonts.Montserrat,
        fontSize: height * .035,
        color: 'white',
    },
    toolIcon: {
        padding: width * .01,
    },
    toolContainer: {
        height: height * .71,
        width: width * 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolButton: {
        height: height * .19,
        width: width * .85,
        backgroundColor: 'black',
        elevation: width * .04,
        marginVertical: height * .01,
        borderColor: "#115b72",
        borderRadius: width * .03,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolImage: {
        height: height * .19,
        width: width * .85,
        borderRadius: width * .03,
        position: 'absolute',
        opacity: .6
    },
    toolName: {
        fontFamily: Fonts.Montserrat,
        fontSize: height * .04,
        color: 'white',
        textAlign: 'center',
      },

});