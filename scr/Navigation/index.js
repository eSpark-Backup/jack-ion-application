import { Dimensions, TouchableOpacity, View } from 'react-native';
// PACKAGES
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { MainContext } from '../context/MainContext'    

// FILES
import Footer from '../../scr/Drawer'
import CustomSidebarMenu from './drawer';
import { RootStack } from './rootStack';
// import {Screens} from '../screens/index';

const AppStack = createDrawerNavigator(
    {
        Footer,
        RootStack,
    },
    {
        //For the Custom sidebar menu we have to provide our CustomSidebarMenu
        contentComponent: CustomSidebarMenu,
        //Sidebar width
        drawerWidth: Dimensions.get('window').width - 90,
        drawerType: 'front',
    },
);

export default createAppContainer(
    createSwitchNavigator(
        {
            App: AppStack,
            //   Auth: AuthStack,
        },
        {
            initialRouteName: 'App',
        },
    )
);

