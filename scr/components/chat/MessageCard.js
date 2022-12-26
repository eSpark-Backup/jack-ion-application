import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import styles from './styles';
import _ from "lodash";

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        if (data.senderEmail == userReducer.user.email) {
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
                { text: "Ok" }
            ]);
        }
    }

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [1, 0, 0, 20],
        });
        return (
            <RectButton style={[styles.leftAction, { justifyContent: "center", alignItems: "center" }]}  >
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

    const formatAMPM = (date) => {
        var getTodayDate = date?.getDate();
        var getTodayMonth = date?.getMonth() + 1;
        var getTodayFullYear = date?.getFullYear();
        
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        var getCurrentDateTime = getTodayDate + '-' + getTodayMonth + '-' + getTodayFullYear + ' ' + strTime;
        return getCurrentDateTime;
    }

    return (<View >
        <ScrollView showsVerticalScrollIndicator={false}>
            <Swipeable ref={swipRef} renderRightActions={renderLeftActions} enabled={mode == "received" ? false : true} >
                <View style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer} >
                    <View style={mode == "received" ? styles.messageRecievedInner : styles.messageSentInner}>
                        {mode == "received" ? <TextReuseableComponent style={{ color: "gray", marginBottom: 5 }} value={data.senderName} /> : null}
                        <TextReuseableComponent style={{ fontSize: height * 0.02, marginBottom: 10, alignSelf: mode == "received" ? "flex-start" : "flex-end" }} value={data?.message} />
                        <View style={{ display: "flex", flexDirection: "row", alignSelf: mode == "received" ? "flex-start" : "flex-end" }}>
                            <TextReuseableComponent style={{ color: "gray", fontSize: 10, alignSelf: mode == "received" ? "flex-start" : "flex-end", marginRight: 10 }} value={formatAMPM(new Date(data?.created_at?.toDate()))} />
                            {mode == "sent" && <MaterialCommunityIcons
                                style={{ alignSelf: mode == "received" ? "flex-start" : "flex-end" }} value={data?.seen ? "Seen" : "Delievered"}
                                name={data?.seen ? "check-all" : "check"}
                                size={width * 0.04}
                                color={data?.seen ? "blue" : "gray"}
                            />}
                        </View>
                    </View>
                </View>
            </Swipeable>
        </ScrollView>
    </View>);
}

export default MessageCard;