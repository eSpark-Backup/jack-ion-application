import React from 'react';
import { TextInput, View, Dimensions } from 'react-native';
import Search from 'react-native-vector-icons/EvilIcons';

const { width, height } = Dimensions.get('window');

const RecentChats = () => {
    return (
        <View style={{
            // marginLeft: width * 0.03,
            width: width * 0.9,
            height: height * 0.06,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: width * 0.01,
            elevation: 5,
            flexDirection: 'row',
            alignSelf: 'center',
        }}>
            <Search
                name="search"
                size={height * 0.04}
                style={{ marginLeft: width * 0.05 }}
                color="gray"
            />
            <TextInput
                placeholderTextColor="gray"
                placeholder="Search"
                style={{
                    width: width * 0.7,
                    height: height * 0.07,
                    borderBottomColor: '#25AAE1ec',
                    fontSize: width * 0.04,
                    color: 'white',
                }}
                onChangeText={(e) => console.log('clicked', e)}
            />
        </View>
    );
}

export default RecentChats;