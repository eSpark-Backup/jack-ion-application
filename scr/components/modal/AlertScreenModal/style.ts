import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../../utils/fonts';

//Packages

//Files

const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: height * 0.02,
    marginHorizontal: width * 0.015,
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderColor: '#e4e4e4',
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  settingModalHead: {
    fontSize: width * 0.05,
    fontFamily: Fonts.BalsamiqSansRegular,
  },
});
