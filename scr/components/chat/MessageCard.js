import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import styles from './styles';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const MessageCard = ({ data, mode }) => {
    const userReducer = useSelector((state) => state.userReducer);
    const swipRef = useRef()

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
                { text: 'No', style: 'cancel', onPress: () => swipRef.current.close() },
                {
                  text: 'Yes',
                  onPress: () => {
                    deleteMessage();
                    swipRef.current.close();
                },
                },
              ]);
        } else {
            Alert.alert('Attention', 'You can only delete your own messages!', [
                {text: "Ok"}
              ]);
        }
    }

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [1, 0, 0, 20 ],
        });
        return (
            <RectButton style={[styles.leftAction, { justifyContent: "center", alignItems: "center"}]}  >
                <TouchableOpacity onPress={() => handleDelete(data)}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                            width: width * 0.2,
                            textAlign: "center",
                            color: "red"
                        },
                    ]}>
                    Delete
                </Animated.Text>
                </TouchableOpacity>
            </RectButton>
        );
    };



    return (<View style={styles.chatDetailsView}>
        <ScrollView>
        <Swipeable ref={swipRef} renderRightActions={renderLeftActions} enabled={mode == "received" ? false : true} >
            <View style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer} >
                <View style={mode == "received" ? styles.messageRecievedInner : styles.messageSentInner}>
                    <TextReuseableComponent title value={data?.message} />
                </View>
            </View>
            </Swipeable>
        </ScrollView>
    </View>);
}

export default MessageCard;