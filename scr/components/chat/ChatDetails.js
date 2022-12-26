import React, { useState, useEffect, useReducer, useRef } from 'react'
import { View, Dimensions, FlatList, SafeAreaView, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import styles from './styles';
import MessageCard from './MessageCard';

import firestore from '@react-native-firebase/firestore';

import { messagesReducer } from '../../Store/Reducer/messageReducer';
import Back from 'react-native-vector-icons/MaterialIcons';
import _ from "lodash";
const { width, height } = Dimensions.get('window');

const ChatDetails = ({ navigation }) => {
    const scrollViewRef = useRef();
    const [message, setMessage] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [messages, dispatchMessages] = useReducer(messagesReducer, []);
    const [selectedUser, setSelectedUser] = useState();
    // Set an initializing state whilst Firebase connects
    const userReducer = useSelector((state) => state.userReducer);

    // Handle user state changes
    // Make sure to update the messages when ever the messages in firestore database changes. Forexample when the messages are added or removed.
    // When the user recieves a new message, push a notification to the user and show a message badge according to the number of new messages.
    // The list of Users available for chat should show the new message badge with message counter.

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            },
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        setSelectedUser(navigation.state.params.item)
        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(function (snapshot) {
                const filteredMessages = snapshot?.docs?.filter((msg) => {
                    return msg.data()?.senderEmail === userReducer?.user?.email || msg.data()?.reciepientEmail === userReducer?.user?.email;
                })
                const isEqual = _.isEqual(filteredMessages, messages);
                if (!isEqual) {
                    dispatchMessages({ type: 'delete', payload: filteredMessages })
                }
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])

    const renderItem = ({ item }) => {
        const data = item.data();
        const clickedUserEmail = selectedUser.email;
        const reciepientEmail = data?.reciepientEmail;
        const senderEmail = data?.senderEmail;

        if (clickedUserEmail == senderEmail || clickedUserEmail == reciepientEmail) {
            const side = senderEmail == userReducer?.user?.email ? 'sent' : 'received';

            var jobskill_query = firestore().collection('Messages').where('messageId', '==', data?.messageId);
            jobskill_query.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (side == "received" && !doc.data().seen) {
                        console.log('Seen updated!');
                        return doc.ref.update({ seen: true });
                    } else {
                        return null
                    }
                });
            });
            return (
                <MessageCard mode={side} data={data} />
            )
        } else {
            return null;
        }
    }


    const handleSend = () => {
        setMessage(false)
        const data = {
            message,
            messageId: _.uniqueId(userReducer?.user?.id),
            created_at: new Date(),
            senderName: userReducer?.user?.name,
            senderEmail: userReducer?.user?.email,
            senderRole: userReducer?.user?.role,
            senderRoleId: userReducer?.user.role_id,
            senderId: userReducer?.user?.id,
            reciepientId: navigation.state.params.item?.id,
            reciepientName: navigation.state.params.item?.name,
            reciepientEmail: navigation.state.params.item?.email,
            seen: false,
        }
        firestore()
            .collection('Messages')
            .add(data)
            .then(() => {
                console.log('Message added!', data);
                setMessage(false);
            });
    }

    return (
        <View style={styles.chatDetailsContainer}>
            <View style={[styles.headingContainer, { height: isKeyboardVisible ? "10%" : "7%" }]}>
                <View style={[styles.headingInner]}>
                    <View>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                height: height * 0.06,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: "row"
                            }}>
                            <Back
                                size={width * 0.07}
                                color="white"
                                name="keyboard-backspace"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: 'flex', justifyContent: "center" }}>
                        <TextReuseableComponent title style={{ color: "white" }} value={selectedUser?.name} />
                    </View>
                    <View style={{ display: "flex", justifyContent: "flex-end" }}>
                        <TextReuseableComponent value={"..."} />
                    </View>
                </View>
            </View>
            <View style={styles.chatDetailsView}>
                <SafeAreaView >
                    <View style={{ height: isKeyboardVisible ? "84%" : "90%" }} >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            inverted
                            data={messages}
                            keyExtractor={(item) => {
                                return item.id
                            }}
                            renderItem={renderItem}
                        />
                    </View>
                    <View style={styles.chatDetailsInput}>
                        <View style={styles.chatInputContainer}>
                            <TextInput style={styles.chatInput} value={message} onChangeText={setMessage} placeholder="Write you message" />
                        </View>
                        <View style={{ backgroundColor: "#a6e9ff", marginLeft: 10, borderRadius: 10 }}>
                            <Button onPress={handleSend} disabled={!message}>Send</Button>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>);
}

export default ChatDetails;