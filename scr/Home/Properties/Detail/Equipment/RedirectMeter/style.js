import {StyleSheet, Dimensions} from 'react-native';
import { Fonts } from '../../../../../utils/fonts';

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  boxConatainer: {
    width: width * 0.85,
    height: height * 0.4,
    marginTop:width * .03,
  },
  boxInner: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    overflow: 'hidden'
  },
  currentReadContainer: {
    width: '100%',
  },
  inputFilterView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 1,
    marginVertical: height * 0.001,
    paddingHorizontal: height * 0.02,
  },
filterListText: {
    color: '#5c5c5ccf',
    fontSize: width * 0.04,
  },
filterUtility: {
    alignItems: 'center',
    height:height * .16,
    backgroundColor: '#fff',
    padding : width * 0.02,
    elevation: 1,
    marginVertical: width * 0.01,
  },
  propText: {
    textTransform: 'capitalize',
    fontFamily: Fonts.Montserrat,
    fontSize: width * 0.04,
    color: '#001522',
    // textAlign: 'center',
    textShadowOffset: {
      width: width * 0.002,
      height: height * 0.002,
    },
    textShadowRadius: width * 0.005,
    textShadowColor: '#09BAF2',
  },
});
