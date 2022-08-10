import { StyleSheet, Dimensions } from 'react-native'
import { Fonts } from '../../../utils/fonts'

const { width, height } = Dimensions.get('screen')
export const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    headingContainer: {
        width: width * 1,
        height: height * 0.07,
      },
      headingInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25AAE1ec',
        elevation: width * 0.01,
        flexDirection: 'row',
      },
      mainHeadiing: {
        fontFamily: Fonts.Montserrat,
        fontSize: width * 0.07,
        color: 'white',
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