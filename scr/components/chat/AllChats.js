import { Dimensions, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import firestore from '@react-native-firebase/firestore';
import API from '../../api/SeviceApi';

const { width, height } = Dimensions.get('window');

const AllChats = () => {
    const [listOfChats, setListOfChats] = useState([]);
    const [messagesForMe, setMessagesForMe] = useState([]);
    const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([]);
    const userReducer = useSelector((state) => state.userReducer);
    const userDataForMessaging = userReducer.userDataForMessaging;

    useEffect(() => {

        fetchAllUsers();

        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(function (snapshot) {
                setListOfChats(snapshot.docs);
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])

    const fetchAllUsers = async () => {
        const response = await API.get(`/get-all-users`);
        if (response?.data?.bool) {
            console.log('response.data.data', response.data.data)
            setListOfAvailableForChat(response.data.data)
        } else {
            console.log("response, ERROR")
        }
    }

    return (<View>
        <View style={{
            borderWidth: 1.5,
            marginVertical: 20,
            width: "90%",
            borderRadius: width * 0.02,
            alignSelf: 'center',
            backgroundColor: 'white'
        }}>
            <TextInput
                placeholder="Find People to chat"
            />
        </View>
        <View style={{ margin: 10 }}>
            <TextReuseableComponent value={"List of Available People for Chat."} />
        </View>
        <View>
            {listOfAvailabeForChat?.map((chat) => {
                return <View>
                    <ScrollView>
                        <ChatCard data={chat} />
                    </ScrollView>
                </View>
            })}
        </View>
    </View>);
}

export default AllChats;