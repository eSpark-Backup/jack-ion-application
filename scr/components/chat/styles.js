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
  allChatsMainContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    // width: "90%"
  },  
  activeTabContainerView: {
    alignItems: 'center',
    width: '50%',
  },
  tabContainer: {
    backgroundColor: '#25AAE1ec',
    padding: 10,
    borderRadius: 6
  },
  activeTabContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
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
    marginVertical: 1,
  },
  iconContainer: {
    width: "15%",
  },
  innerContainerIcon: {
    height: 46,
    width: 46,
    borderRadius: 49,
    alignSelf: 'flex-start',
    alignItems: "center",
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  nameContainer: {
    width: "50%",
    height: '100%',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  timeContainer: {
    width: "30%",
    height: '100%',
    alignItems: "flex-end",
  },
  chatDetailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    height: height * 0.7
  },
  chatDetailsView: {
    padding: 5,
  },
  messageReceivedContainer: {
    backgroundColor: "gray",
    width: width * 0.4,
    borderRadius: height * 0.06,
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
    alignItems: 'center',
    backgroundColor: '#bfbfbf',
    alignSelf: 'center',
  },
  chatInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    // alignSelf: 'center',
    width: "80%",
    height: height * 0.01
  },
  chatInput: {
    height: height * 0.06,
    
  },
  
});
