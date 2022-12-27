import { Dimensions, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';
import _ from "lodash";
import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import firestore from '@react-native-firebase/firestore';
import API from '../../api/SeviceApi';

const { width, height } = Dimensions.get('window');

const AllChats = ({ handleChatDetailsClick }) => {
    const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([]);
    const userReducer = useSelector((state) => state.userReducer);

    useEffect(() => {
        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(async (snapshot) => {
                const response = await API.get(`/get-all-users`);
                if (response?.data?.bool) {
                    setListOfAvailableForChat(response.data.data);
                    const filteredMessages = snapshot?.docs?.filter((msg) => {
                        return msg.data()?.senderEmail === userReducer?.user.email || msg.data()?.reciepientEmail === userReducer?.user.email;
                    })
                    const isEqual = _.isEqual(filteredMessages, userReducer?.userDataForMessaging);
                    if (!isEqual) {
                        const newListOfTechnicians = response.data.data?.map((tech) => {
                            const unSeen = filteredMessages?.filter((msg) => !msg.data()?.seen);
                            const lastMessage = filteredMessages?.filter((msg) => {
                                return msg?.data()?.senderEmail == tech?.email || msg?.data()?.reciepientEmail == tech?.email;
                            });
                            return {
                                ...tech,
                                unReadMessages: unSeen?.filter((msg) => {
                                    return !msg?.data()?.seen && msg?.data()?.senderEmail == tech?.email
                                })?.length ?? 0,
                                last_message: lastMessage ? lastMessage?.[0]?.data()?.message : "Lets Start a Conversation"
                            }
                        })
                        setListOfAvailableForChat(newListOfTechnicians)
                    }
                } else {
                    console.log("response, ERROR")
                }
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])

    return (<View>
        <ScrollView >
            <View style={{
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
            <View style={{ margin: 10 }}>
                <TextReuseableComponent value={"List of Available People for Chat."} />
            </View>
            <View>
                <ScrollView>

                    {listOfAvailabeForChat?.filter((user) => user.id !== userReducer?.user?.id)?.map((chat) => {
                        return <ChatCard key={chat.id} data={chat} handleChatDetailsClick={handleChatDetailsClick} />
                    })}
                </ScrollView>
            </View>
        </ScrollView>
    </View>);
}

export default AllChats;