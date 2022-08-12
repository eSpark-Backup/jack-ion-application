import { Dimensions, StyleSheet } from "react-native";
import { Fonts } from "../../utils/fonts";


const { height, width } = Dimensions.get('screen')
export const styles = StyleSheet.create({
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
      },
      drawerMenuBtn: {
        width: width * 0.15,
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
      },
      mainHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: width * 0.12,
      },
      mainHeadiing: {
        fontFamily: Fonts.BalsamiqSansRegular,
        fontSize: width * 0.065,
        color: 'white',
      },
      itemContainer: {width: width, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 10, padding: 10, backgroundColor: '#ececec', borderColor: '#cdcdcd', borderWidth:1}
})