import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';

import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const MessageCard = ({ data, mode }) => {

    const handleDelete = (data) => {
        console.log("mess", data);
        var jobskill_query = firestore().collection('Messages').where('messageId', '==', data?.messageId);
        jobskill_query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
                console.log('deleted', doc);
            });
        });
    }



    return (<View style={styles.chatDetailsView}>
        <ScrollView>
            <View style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer} >
                <View style={mode == "received" ? styles.messageRecievedInner : styles.messageSentInner}>
                    <TextReuseableComponent title value={data?.message} />
                </View>
                <View>
                    <TouchableOpacity onPress={() => handleDelete(data)}>
                        <Feather
                            name={'more-vertical'}
                            size={height * 0.035}
                            style={{ paddingRight: 5 }}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

    </View>);
}

export default MessageCard;