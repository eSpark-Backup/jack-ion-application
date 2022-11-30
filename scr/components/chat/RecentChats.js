import React from 'react';
import { TextInput, View, Dimensions } from 'react-native';
import TextReuseableComponent from '../../components/Text';

const { width, height } = Dimensions.get('window');

const RecentChats = () => {
    return (
    <View style={{ 
        borderWidth: 1.5, 
        marginVertical: 20, 
        width: "90%", 
        borderRadius: width * 0.02, 
        alignSelf: 'center',
        backgroundColor: 'white'
    }}>
        <TextInput
            placeholder="Find Chats"
        />
    </View>
    );
}

export default RecentChats;