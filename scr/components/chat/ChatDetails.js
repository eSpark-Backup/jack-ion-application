import React, { useState, useEffect, useReducer, useRef } from 'react'
import { View, Dimensions, FlatList, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import styles from './styles';
import MessageCard from './MessageCard';
import API from '../../api/SeviceApi';

import { messagesReducer } from '../../Store/Reducer/messageReducer';
import Back from 'react-native-vector-icons/MaterialIcons';
import _ from "lodash";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/moment';
const { width, height } = Dimensions.get('window');

const ChatDetails = ({ handleChatDetailsClick, selectedChat }) => {
    const [message, setMessage] = useState(false);
    const [error, setError] = useState(false);
    const [messages, dispatchMessages] = useReducer(messagesReducer, []);
    // Set an initializing state whilst Firebase connects
    const userReducer = useSelector((state) => state.userReducer);
    let fetchable = userReducer?.userDataForMessaging;
    const flatList1 = useRef();

    // Handle user state changes
    // Make sure to update the messages when ever the messages in firestore database changes. Forexample when the messages are added or removed.
    // When the user recieves a new message, push a notification to the user and show a message badge according to the number of new messages.
    // The list of Users available for chat should show the new message badge with message counter.

    useEffect(async () => {
        try {
            const allMessagesResponse = await API.post(`/get-all-user-messages`, {
                "reciver_id": selectedChat?.item?.id,
                "sender_id": userReducer?.user?.id
            });
            console.log('user reducer as', fetchable);
            dispatchMessages({ type: 'delete', payload: allMessagesResponse?.data?.data?.messages });
        } catch (error) {
            console.log('not true found', error);
            Alert.alert(error)
        }
    }, [fetchable])

    const renderItem = ({ item }) => {
        const side = item?.user_id == userReducer?.user?.id ? "sent" : "received";
        if (item) {
            return <MessageCard mode={side} data={item} selectedChat={selectedChat} />
        }
    }

    const handleSend = async () => {
        console.log('selected chat ', selectedChat);
        setMessage(false)
        if (selectedChat?.item?.last_message?.last_message) {
            const time = moment().format("hh:mm:ss");
            const newData = {
                time: time,
                chat_room_id: selectedChat?.item?.last_message?.id,
                message,
                reciver_id: selectedChat?.item?.id,
                user_id: userReducer?.user?.id
            }
            console.log('data', newData);
            try {
                const send_message = await API.post(`/send-message`, newData);
                setMessage(false);
                if(send_message?.data?.bool) {
                    const reciever = selectedChat?.item?.id;
                        const sender = userReducer?.user?.id;
                        const allMessagesResponse = await API.post(`/get-all-user-messages`, {
                            "sender_id": sender,
                            "reciver_id": reciever
                        });
                        if(allMessagesResponse?.data?.bool) { 
                            dispatchMessages({ type: 'delete', payload: allMessagesResponse?.data?.data?.messages })
                            console.log('Updated Messages dispatched!') 
                        } else {
                            Alert.alert(allMessagesResponse?.data?.message);
                        }
                }
            } catch (error) {
                console.log('error', error);
            }
        } else {
            try {
                console.log('creating chatroom!');
                const create_chatroom = await API.post(`/craete-room`, {
                    "reciver_id": selectedChat?.item?.id,
                    "sender_id": userReducer?.user?.id
                });
                if(create_chatroom?.data?.bool) {
                    console.log('create chatroom', create_chatroom?.data?.data);
                    const time = moment().format("hh:mm:ss");
                    const newData = {
                        time: time,
                        chat_room_id: create_chatroom?.data?.data?.id,
                        message,
                        reciver_id: selectedChat?.item?.id,
                        user_id: userReducer?.user?.id
                    }
                    const send_message = await API.post(`/send-message`, newData);

                    if(send_message?.data?.bool) {
                        setMessage(false);
                        const reciever = selectedChat?.item?.id;
                        const sender = userReducer?.user?.id;
                        const allMessagesResponse = await API.post(`/get-all-user-messages`, {
                            "sender_id": sender,
                            "reciver_id": reciever
                        });
                        console.log('reciever', reciever);
                        console.log('sender', sender);
                        if(allMessagesResponse?.data?.bool) { 
                            dispatchMessages({ type: 'delete', payload: allMessagesResponse?.data?.data?.messages })
                            console.log('Updated Messages dispatched!')
                        } else {
                            Alert.alert(allMessagesResponse?.data?.message);
                        }
                    } else {
                        Alert.alert("Message sending failed")
                    }
                } else {
                    Alert.alert("Create chat room failed");
                }
            } catch (error) {
                console.log('error creating room', error);
            }
        }
    }

    return (<View className="chat-container" style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", flex: 1 }}>
        <SafeAreaView>
            <View style={{
                width: width * 1,
                height: height * 0.07,
                backgroundColor: '#25AAE1ec',
                elevation: width * 0.01,
            }}>
                <View style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: width * 0.9
                }}>
                    <View>
                        <TouchableOpacity onPress={() => handleChatDetailsClick("Chat")} >
                            <Back
                                size={width * 0.07}
                                color="white"
                                name="keyboard-backspace"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{marginRight: 30}}>
                    <TextReuseableComponent title style={{
                        fontSize: height * 0.025,
                        color: 'white',
                    }} value={selectedChat?.item?.name} />
                    </View>
                    <View>
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flex: 1 }}  >
                <View style={{ height: '100%', }} >
                    <View style={{ padding: 10, flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ref={flatList1}
                            onContentSizeChange={() => flatList1?.current?.scrollToEnd()}
                            data={messages}
                            keyExtractor={(item) => {
                                return item.id
                            }}
                            renderItem={renderItem}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            elevation: 10,
                            padding: 7
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: height * 0.05,
                                borderRadius: height * 0.05,
                                backgroundColor: "#f2f2f2",
                                alignItems: "center",
                                alignSelf: 'center',
                                padding: 10,
                                marginRight: 10,
                                width: width * 0.80
                            }}>
                            <View style={{ width: width * 0.75 }}>
                                <TextInput
                                    style={{
                                        height: height * 0.04,
                                        borderWidth: 0,
                                        backgroundColor: "#f2f2f2"
                                    }} value={message} onChangeText={setMessage} placeholder="Write you message" placeholderTextColor={error ? "red" : null} />
                            </View>
                        </View>
                        <View style={{ height: height * 0.05, justifyContent: "center" }} >
                            <TouchableOpacity onPress={handleSend} disabled={!message}>
                                <MaterialCommunityIcons
                                    value={"Send"}
                                    name={"send"}
                                    size={width * 0.08}
                                    color={!message ? "gray" : "#25AAE1ec"}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </View>);
}

export default ChatDetails;