import { StyleSheet, Dimensions } from "react-native"
import { Fonts } from '../../utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    headingInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25AAE1ec',
        elevation: width * .01,
        flexDirection: "row"
    },
    addBotton: {
        height: height * .06,
        width: height * .06,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: height * .2,
        elevation: width * .04,
        left: width * .02,
        position: 'absolute'
    },
    mainHeadiing: {
        fontFamily: Fonts.Montserrat,
        fontSize: height * .04,
        color: 'white',
    },



    // Modal
    modalContainer: {
        elevation: width * .005,
        borderRadius: width * .02,
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
        width: width * .85,
        height: height * .9,
        // justifyContent: "center",
    },
    boxInner: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: width * .02,
        elevation: width * .02,
        alignItems: 'center',
        // borderColor: '#5F4B2F'
    },
    boxHeader: {
        width: width * .75,
        height: height * .1
    },
    boxHeaderInner: {
        flex: 1,
        // backgroundColor: 'white',
        // borderBottomWidth:height * .005,
        // borderColor:'#5F4B2F',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth:width * .001,

    },
    modalHeading: {
        fontSize: height * .028,
        color: "black",
        fontFamily: Fonts.ComfortaaRegular,
        right:width * .07
    },
    desciptionContainer:{
        height: height * .05,
        width: width * .7,
        borderBottomWidth: width * .002,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: height * .01
    },
    desciptionHeading:{
        fontSize: height * .015,
        color: "black",
        fontFamily: Fonts.ComfortaaRegular,
    },
    inputContainer:{
        height: height * .09,
        width: width * .8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{ 
        // height: height * .07, 
        width: width * .75, 
        fontSize: height * .018, 
    },
    contactInfoContainer:{
        height: height * .09,
        width: width * .8,
        // borderBottomWidth: width * .002,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactInfoInner:{
        height: height * .074,
        width: width * .14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25AAE1ec',
        left: width * .025,
        position: 'absolute',
        borderTopLeftRadius: width * .01,
        borderBottomLeftRadius: width * .01,
    },
    contactInput:{
        height: height * .07,
        width: width * .61,
        fontSize: height * .018,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        position: 'absolute',
        left: width * .165,
    },
    bottonContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBotton:{
        width: width * .4,
        height: height * .06,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#25AAE1ec'
    },



});