import 'react-native-gesture-handler';
// SCREENS
// import { Screens } from '../screens/index';
import Home from '../Home/Index';
import Properties from '../Home/Properties/Index';
// import Home from '../Home';
import {createStackNavigator} from 'react-navigation-stack';
export const RootStack = createStackNavigator(
  {
    Home: Home,
    // Properties: Properties,
    // Filterscreen: Screens.Filterscreen,
    // Categoryscreen: Screens.Categoryscreen,
    // CategoryAdscreen: Screens.CategoryAdscreen,
    // SubjectAdscreen: Screens.SubjectAdscreen,
    // ClassSelectscreen: Screens.ClassSelectscreen,
    // PostAdscreen: Screens.PostAdscreen,
    // PostAdTwoscreen: Screens.PostAdTwoscreen,
    // Profilescreen: Screens.Profilescreen,
    // MyAdscreen: Screens.MyAdscreen,
    // MainAdscreen: Screens.MainAdscreen,
    // FavouriteAdscreen: Screens.FavouriteAdscreen,
    // Notificationscreen: Screens.Notificationscreen,
    // LoginSignup: Screens.LoginSignup,
    // EditProfilescreen: Screens.EditProfilescreen,
    // SearchAdscreen: Screens.SearchAdscreen,
    // OLevelsSubjects: Screens.OLevelsSubjects,
    // ALevelsSubjects: Screens.ALevelsSubjects,
    // O_ALevelAds: Screens.O_ALevelAds,
    // NonAcdAdPostscreen: Screens.NonAcdAdPostscreen,
    // NonAcdAdPostTwoscreen: Screens.NonAcdAdPostTwoscreen,
    // FilterResultscreen: Screens.FilterResultscreen,
    // UserProfileScreen: Screens.UserProfileScreen,
    // Chat: Screens.ChatScreen,
    // ChatRoom: Screens.ChatRoomScreen,
    // Donation: Screens.Donation,
    // DonationTimeline: Screens.DonationTimeline
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    // navigationOptions: {
    //     headerVisible: false,
    //     header: null,
    //     headerForceInset: { top: 'never', bottom: 'never' },
    // },
  },
);
