import React from 'react';
import { Button, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer'
import Detail from "./Detail/Index";
import Equip from "./Detail/Equipment/Index";
import Charts from "./Properties/Detail/Charts/Index";
import Properties from "./Properties/Properties";


// const Drawer = createDrawerNavigator();

// export default function App() {
//     return (
//         <NavigationContainer>
//             <Drawer.Navigator initialRouteName='Equip'>
//                 <Drawer.Screen name="Detail" component={Detail} />
//                 <Drawer.Screen name="Equip" component={Equip} />
//             </Drawer.Navigator>
//         </NavigationContainer>
//     );
// }

const MainDrawerNavigator = DrawerNavigator({
    Detail: { screen: Detail },
    Equip: { screen: Equip }
  }, {
    initialRouteName: 'Equip',
    headerMode: 'screen'
  })

export default createAppContainer(MyDrawerNavigator);