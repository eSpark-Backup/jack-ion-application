import {StyleSheet, Dimensions} from 'react-native';

//Packages

//Files
const {width, height} = Dimensions.get('window');

export default styles = StyleSheet.create({
  modalContainer: {
    width: width * 0.7,
    left: width * -0.05,
  },
  drawerMainContainer: {
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  drawerContentContainer: {
    marginTop: height * -0.5,
    width: width * 0.45,
    flexDirection: 'column',
    top: 20,
    left: 5,
    borderTopLeftRadius: width * 0.015,
    borderBottomLeftRadius: width * 0.015,
    padding: height * 0.008,
  },
  drawerContent: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
  },
  drawerbtn: {
    fontSize: width * 0.06,
    color: 'black',
    fontWeight: 'normal',
  },
});
