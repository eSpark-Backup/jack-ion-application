import React, { useState, useEffect, useReducer } from 'react'
import { View, Dimensions, FlatList, SafeAreaView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import styles from './styles';
import MessageCard from './MessageCard';

import firestore from '@react-native-firebase/firestore';

import { messagesReducer } from '../../Store/Reducer/messageReducer';
import Back from 'react-native-vector-icons/MaterialIcons';
import _ from "lodash";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');

const ChatDetails = ({ handleChatDetailsClick, selectedChat }) => {
    const [message, setMessage] = useState(false);
    const [error, setError] = useState(false);
    const [messages, dispatchMessages] = useReducer(messagesReducer, []);
    // Set an initializing state whilst Firebase connects
    const userReducer = useSelector((state) => state.userReducer);

    // Handle user state changes
    // Make sure to update the messages when ever the messages in firestore database changes. Forexample when the messages are added or removed.
    // When the user recieves a new message, push a notification to the user and show a message badge according to the number of new messages.
    // The list of Users available for chat should show the new message badge with message counter.

    useEffect(() => {
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
        const clickedUserEmail = selectedChat?.item?.email;
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
        if(message) {
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
            reciepientId: selectedChat.item?.id,
            reciepientName: selectedChat.item?.name,
            reciepientEmail: selectedChat.item?.email,
            seen: false,
        }
        firestore()
            .collection('Messages')
            .add(data)
            .then(() => {
                console.log('Message added!', data);
                setMessage(false);
            });
        }else {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 1000)
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
                    <TextReuseableComponent title style={{
                        fontSize: height * 0.025,
                        color: 'white',
                    }} value={selectedChat?.item?.name} />
                    <View>
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView  style={{ flex: 1 }}  >
                <View style={{ height: '100%', }} >
                    <View style={{ padding: 10, flex: 1 }}>
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
                                    }} value={message} onChangeText={setMessage} placeholder="Write you message" placeholderTextColor={ error ? "red" : null} />
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


{/* <View style={styles.chatDetailsContainer}>
             <View style={[styles.headingContainer, { height: isKeyboardVisible ? "10%" : "7%" }]}>
                <View style={[styles.headingInner]}>
                    <View>
                        <TouchableOpacity
                            onPress={() => selectedChat.goBack()}
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
                        <TextReuseableComponent title style={{ color: "white" }} value={selectedChat?.item??.name} />
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
        </View> */}