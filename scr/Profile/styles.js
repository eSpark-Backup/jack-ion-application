import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../utils/fonts';
const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  detailsContainer: {
    elevation: width * 0.01,
    backgroundColor: '#fff',
    padding: width * 0.03,
    width: width * 0.9,
    marginVertical: height * 0.03,
    // borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.8,
    borderColor: '#cdcdcd',
    padding: height * 0.01,
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
    justifyContent: 'space-between',
  },
  mainHeadiing: {
    fontFamily: Fonts.BalsamiqSansRegular,
    fontSize: width * 0.065,
    color: 'white',
    textAlign: 'center',
  },
  avatarContainer: {
    backgroundColor: '#fff',
    elevation: width * 0.01,
    borderRadius: width * 0.2,
    // height: width * 0.4,
    // width: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
