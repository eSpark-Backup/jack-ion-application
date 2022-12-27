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
  },
  activeTabContainerView: {
    alignItems: 'center',
    width: '50%',
  },
  tabContainer: {
    backgroundColor: '#25AAE1ec',
    padding: 10,
    borderRadius: 6,
    width: width * 0.4,
    display: "flex",
    alignItems: "center"
  },
  activeTabContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    width: width * 0.4,
    display: "flex",
    alignItems: "center"
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
    // height: "8%",
    backgroundColor: "#25AAE1ec",
    // elevation: width * 0.05
  },
  headingInner: {
    flex: 1,
    alignItems: 'center',
    elevation: width * 0.01,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: "space-between",
    padding: 10,
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
    height: height * 0.9
  },
  chatDetailsView: {
    padding: 5,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    // height: height * 0.9
  },
  messageReceivedContainer: {
    display: "flex",
    flexDirection: 'row',
    marginVertical: 8,
    borderRadius: 10,
    // width: width * 0.4,
    // borderWidth: 1,
    // backgroundColor: "#f5f5f5"
    // flexDirection: "row", 
    // backgroundColor: "red",
    // width: width * 0.4,
    // height: height * 0.1
  },
  messageSentContainer: {
    backgroundColor: "white",
    alignSelf: 'flex-end',
    marginVertical: 6,
    display: "flex",
    flexDirection: 'row-reverse',
    borderRadius: 10,
    // borderWidth: 1,
    // backgroundColor: "#f5f5f5"
    // flexDirection: "row",
    // width: width * 0.4
  },
  // messageSenderContainer: {
  //   backgroundColor: "white",
  //   display: "flex",
  //   flexDirection: "row",
  //   // alignItems: "center",
  //   // justifyContent: "flex-end",
  //   // marginRight: 10,
  //   marginBottom: 5,
  //   // width: width * 0.37,
  //   padding: 5
  // },
  // messageRecieverContainer: {
  //   display: "flex",
  //   flexDirection: "row",
  //   // alignItems: "center",
  //   // backgroundColor: 'red',
  //   // justifyContent: "flex-start",
  //   // marginBottom: 5,
  //   padding: 5
  // },
  messageRecievedInner: {
    backgroundColor: "white",
    borderRadius: height * 0.01,
    padding: 15,
    maxWidth: width * 0.7,
  },
  
  messageSentInner: {
    backgroundColor: "#a6e9ff",
    borderRadius: height * 0.01,
    padding: 15,
    maxWidth: width * 0.7,
    display: 'flex',
    flexDirection: "column",
  },
  chatDetailsInput: {
    width: width * 1,
    height: height * 0.07,
    flexDirection: 'row',
    justifyContent: 'center',
    // padding: width * 0.01,
    // position: 'absolute',
    // bottom: 0,
    alignItems: 'center',
    // backgroundColor: 'red',
    alignSelf: 'center',
    // backgroundColor: "#fff",
    // elevation: width * 0.01,
    borderRadius: height * 0.09,

  },
  chatInputContainer: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignSelf: 'center',
    width: width * 0.7,
    // height: height * 0.01,
    // backgroundColor: "red"
  },
  chatInput: {
    height: height * 0.05,
    borderWidth: 0,
    color: "black"
    // borderRadius: width * 0.1
  },

});
