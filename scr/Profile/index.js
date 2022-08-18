import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, Alert, Platform} from 'react-native';
import TabIcon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {styles} from './styles';
import Back from 'react-native-vector-icons/MaterialIcons';
import Logout from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Avatar } from 'react-native-elements';
import CustumStatusBar from '../components/StatusBar';

const {width, height} = Dimensions.get('screen');
export const Profile = ({navigation}) => {
  const user = useSelector((state) => state?.userReducer?.user);


  const removeToken = async () => {
    try {
      await EncryptedStorage.removeItem('user_token');
      console.log('Success Removed Token');
    } catch (e) {
      console.log('Failed Remove Token', e);
    }
  };

  const setLoggedOut = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', '0');
      console.log('Logged out');
    } catch (e) {
      console.log('error at setting logged out', e);
    }
  };

  const onLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to Logout', [
          {text: 'No', style: 'cancel'},
          {
            text: 'Log Out',
            onPress: () => {
              removeToken();
              setLoggedOut();
              navigation.replace('Login');
            },
          },
        ]);
  }
  return (
    <>
      {Platform.OS == "ios" && <CustumStatusBar />}
      <View style={styles.headingContainer}>
        <View style={[styles.headingInner]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: width * 0.15,
              height: height * 0.06,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Back size={width * 0.08} color="white" name="keyboard-backspace" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            //   marginLeft: width * 0.2,
            }}>
            <Text style={styles.mainHeadiing}>Profile</Text>
          </View>
          <TouchableOpacity 
            onPress={onLogout}
            style={{
              width: width * 0.15,
              height: height * 0.06,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Logout
                name="logout"
                size={height * 0.03}
                style={{paddingRight: 10}}
                color="white"
              />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={styles.avatarContainer}>
         <Avatar
            size={width*0.4}
            rounded
            title={user?.name?.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}
            containerStyle={{ backgroundColor: '#25AAE1' }}
        />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text>Name:</Text>
            <Text>{user.name || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text>Email:</Text>
            <Text>{user.email || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text>Role:</Text>
            <Text>{user.role || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text>Address:</Text>
            <Text>{user.address || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text>Country:</Text>
            <Text>{user.country || '-'}</Text>
          </View>
          <View style={[styles.detailItem, {borderBottomColor: "#fff"}]}>
            <Text>City:</Text>
            <Text>{user.city || '-'}</Text>
          </View>
        </View>
        
      </View>
    </>
  );
};

Profile.navigationOptions = (screenProps) => ({
  title: 'Profile',
  tabBarIcon: ({tintColor}) => (
    <TabIcon name="user" color={tintColor} size={width * 0.05} />
  ),
});
