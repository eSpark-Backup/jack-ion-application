import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../../../../../utils/fonts';

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
  },
  currentReadContainer: {
    width: width,
    alignItems: 'center',
    marginVertical: width * 0.05,
    height: height * 0.15,
  },
});
