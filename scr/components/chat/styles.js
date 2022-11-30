import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '../../../scr/utils/fonts';

//Packages

//Files
const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
  chatContainer: {
    // backgroundColor: 'gray',
    height: height * 0.07,
    top: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatHeading: {
  },
  crossHeading: {
  },
  tabContainerView: {

  },
  activeTabContainerView: {
    alignItems: 'center',
    width: '50%',
  },
  tabContainer: {
    // width: '50%',
    backgroundColor: '#25AAE1ec',
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 130,
    borderRadius: 6
  },
  activeTabContainer: {
    // width: 130,
    backgroundColor: '#fff',
    padding: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: 6,
    // backgroundColor: 'blue'
    // elevation: width * 0.005,
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  chatCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.08,
    alignItems: "center",
    padding: 10,
    // backgroundColor: 'blue'
  },
  iconContainer: {
    width: "15%",
  },
  innerContainerIcon: {
    // borderWidth: 1,
    height: 46,
    width: 46,
    borderRadius: 49,
    alignSelf: 'flex-start',
    alignItems: "center",
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  nameContainer: {
    width: "60%",
    justifyContent: 'center',

  },
  timeContainer: {
    width: "20%",
    alignItems: "flex-end",
    justifyContent: 'center',

  },
  chatDetailsContainer: {
    flex: 1,
    // backgroundColor: 'blue'
    // flexDirection: 'column',
    justifyContent: 'flex-start',
    // height: height * 0.5,
    // padding: 10
  },
  chatDetailsView: {
    padding: 5,
    // position: 'absolute'
    // backgroundColor: 'gray',

    // height: '80%'    
  },
  messageReceivedContainer: {
    backgroundColor: "gray",
    // height: height * 0.06,
    width: width * 0.4,
    borderRadius: height * 0.06,
    // borderTopRightRadius: 10,
    // borderBottomRightRadius: 10,
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
    padding: 10,
    marginVertical: 8
  },
  messageSentContainer: {
    backgroundColor: "#25AAE1ec",
    // height: 20,
    width: width * 0.4,
    borderRadius: height * 0.06,
    padding: 15,
    // justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginVertical: 6
  },
  chatDetailsInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    // backgroundColor: 'gray'
  },
  chatInputContainer: {
    width: "80%",
    height: height * 0.1
  },
  chatInput: {
    backgroundColor: '#f1f0eb',
  }
});
