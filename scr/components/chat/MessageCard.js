import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';

import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const handleDelete = (id) => {
    console.log("mess", id)
    // firestore()
    // .collection("Messages")
    // .doc(id)
    // .delete()
}

const MessageCard = ({ message, mode }) => {
    return (<View style={styles.chatDetailsView}>
        <ScrollView>
            <View style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer}>
                <TextReuseableComponent title value={message} />
            </View>
                <TouchableOpacity onPress={() => handleDelete(message)}>
                    <Feather
                        name={'more-vertical'}
                        size={height * 0.035}
                        style={{ paddingRight: 5 }}
                        color="#999"
                    />
                </TouchableOpacity>
        </ScrollView>
        
    </View>);
}

export default MessageCard;