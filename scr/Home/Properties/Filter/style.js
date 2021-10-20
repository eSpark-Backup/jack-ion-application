import {StyleSheet, Dimensions} from 'react-native';

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
  },
  filterHeading: {
    justifyContent: 'center',
    padding: height * 0.02,
    borderWidth: 0.5,
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
});
