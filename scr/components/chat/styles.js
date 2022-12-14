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
    justifyContent: 'center',
    display: 'flex'
  },
  chatHeading: {
  },
  crossHeading: {
    display: 'flex',
    alignItems: 'flex-start'
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
  headingContainer: {
    width: width * 1,
    height: height * 0.07,
    backgroundColor: "#25AAE1ec",
    // elevation: width * 0.05
  },
  headingInner: {
    flex: 1,
    alignItems: 'center',
    elevation: width * 0.01,
    flexDirection: 'row',
  },
  mainHeadiing: {
    fontFamily: Fonts.BalsamiqSansRegular,
    // fontSize: width * 0.065,
    color: 'white',
    textAlign: 'center',
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
    backgroundColor: "white"
  },
  messageReceivedContainer: {
    display: "flex",
    marginVertical: 8,
    display: "flex",
    flexDirection: "row",
  },
  messageSentContainer: {
    alignSelf: 'flex-end',
    marginVertical: 6,
    display: "flex",
    flexDirection: "row"
  },
  messageRecievedInner: {
    backgroundColor: "#cccecf",
    borderRadius: height * 0.02,
    padding: 15,
    width: width * 0.4,
  },
  messageSentInner: {
    backgroundColor: "#a6e9ff",
    borderRadius: height * 0.02,
    padding: 15,
    width: width * 0.4,
  },
  chatDetailsInput: {
    width: width * 1,
    // height: height * 0.09,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.01,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    // backgroundColor: 'white',
    alignSelf: 'center',
    // backgroundColor: "#fff",
    elevation: width * 0.01,
  },
  chatInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    width: "80%",
    height: height * 0.01,
    // backgroundColor: "white"
  },
  chatInput: {
    height: height * 0.05,
    // borderRadius: width * 0.1
  },
  
});
