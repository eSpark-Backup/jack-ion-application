import {StyleSheet, Dimensions} from 'react-native';

//Packages

//Files
const {width, height} = Dimensions.get('screen');

export default styles = StyleSheet.create({
  modalContainer: {
    width: width * 0.7,
    left: width * -0.05,
  },
  drawerMainContainer: {
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  drawerContentContainer: {
    width: width * 0.67,
    flexDirection: 'column',
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
    marginLeft: width * 0.035,
    width: '100%',
  },
  drawerLinks: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    marginLeft: width * 0.065,
    width: '100%',
  },
  selected: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    width: '100%',
    padding: 10,
  },
  propertyTitle: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    paddingTop: height * 0.01,
    borderRadius: 5,
    marginLeft: width * 0.045,
    width: '100%',
    padding: 10,
  },
});
