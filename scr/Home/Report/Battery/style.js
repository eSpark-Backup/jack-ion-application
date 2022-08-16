import { Dimensions, StyleSheet } from "react-native";
import { Fonts } from "../../../utils/fonts";

const { height, width} = Dimensions.get('screen')


export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headingContainer: {
        width: width * 1,
        height: height * 0.07,
      },
      headingInner: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#25AAE1ec',
        elevation: width * 0.01,
        flexDirection: 'row',      
        justifyContent: 'space-around',
        paddingHorizontal: 15
      },
      mainHeadiing: {
        fontFamily: Fonts.Montserrat,
        fontSize: width * 0.04,
        color: 'white',
      },
      date: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        alignItems: 'center'
        // height: '8%'
      },
      dateDivider: {width: 1, height: 19, backgroundColor: '#C4C4C4'},
      dateSelectorContainer: {
        flexDirection: 'row',
        width: '45%',
        justifyContent: 'space-around',
      },
      dateSelectorHeading: {
        color: '#8E97A6',
        // fontFamily: 'Lexend-Regular',
        fontSize: 11,
        marginHorizontal: 5
        },
    dateText: {
        color: '#8E97A6',
        // fontFamily: 'Lexend-Regular',
        fontSize: 11,
      },
      tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(196, 196, 196, 0.2);'
      },
      tableHeading: {
        color: '#525A67',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 15,
        fontSize: 14,
      },
      tableColText: {
        color: '#525A67',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 5,
        fontSize: 14,
        textAlign: 'center'
      },
      tableColContainer: {  
        width: width / 2.2, 
        borderBottomWidth: 1,
        borderBottomColor: '#cdcdcd'
    }
})