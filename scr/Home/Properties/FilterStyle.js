import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../utils/fonts';

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
    width: '100%',
  },
  modalContainer: {
    // elevation: width * 0.005,
    // borderRadius: width * 0.02,
    // backgroundColor: 'white',
    // maxHeight: height * .7,
    // maxWidth: width * 1,
  },
  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConatainer: {
    width: width * 0.85,
    height: height * 0.35,
  },
  boxInner: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    alignItems: 'center',
    overflow: 'hidden'
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
  },
  modalHeading: {
    fontSize: height * 0.028,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.07,
  },
  filterHeading: {
    justifyContent: 'center',
    padding: height * 0.02,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    marginVertical: height * 0.001,
  },
  filterLists: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: height * 0.02,
    elevation: 1,
    marginVertical: height * 0.001,
  },
  filterListText: {
    color: '#5c5c5ccf',
    fontSize: width * 0.04,
  },
  inputFilterView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 1,
    marginVertical: height * 0.001,
    paddingHorizontal: height * 0.02,
  },
  filterInputs: {
    width: "55%",
    textTransform: 'capitalize',
  },
  filterUtility: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: height * 0.02,
    elevation: 1,
    marginVertical: height * 0.001,
    // position:'absolute',
    // bottom:height * .02
  },
});
