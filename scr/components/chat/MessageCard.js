import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import styles from './styles';

import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const MessageCard = ({ data, mode }) => {
    const userReducer = useSelector((state) => state.userReducer);

    const handleDelete = (data) => {
        const deleteMessage = () => {
            var jobskill_query = firestore().collection('Messages').where('messageId', '==', data?.messageId);
            jobskill_query.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                    console.log('deleted', doc);
                });
            });
          }
        if(data.senderEmail == userReducer.user.email) {
            Alert.alert('Becareful', 'Are you sure to delete Message permanently?', [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: () => deleteMessage(),
                },
              ]);
        } else {
            Alert.alert('Attention', 'You can only delete your own messages!', [
                {text: "Ok"}
              ]);
        }
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
                            size={height * 0.02}
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