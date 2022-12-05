import { Dimensions, View, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');

const AllChats = () => {
    const [listOfChats, setListOfChats] = useState([]);
    const [messagesForMe, setMessagesForMe] = useState([]);
    const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([]);
    const userReducer = useSelector((state) => state.userReducer);
    const userDataForMessaging = userReducer.userDataForMessaging;

    useEffect(() => {

        firestore()
            .collection('Users')
            .get()
            .then(querySnapshot => {
                const otherThanMe = querySnapshot?.docs?.filter((doc) => doc?.data()?.userId !== userDataForMessaging?.id);
                setListOfAvailableForChat(otherThanMe);
                // if(!isNewUser?.length || querySnapshot?.docs?.length === 0) {
                console.log('setAvailableForChat', userDataForMessaging);
                //   createUser()
                // } else {
                //   console.log('is nott new user')
                //   return null;
                // }
            });

        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(function (snapshot) {
                // dispatchMessages({ type: 'add', payload: snapshot.docs })
                setListOfChats(snapshot.docs);
                console.log('snapshot', snapshot.docs);
                // messageForMe();
            })
        // console.log('snapshott', listOfChats);

        return () => subscriber(); // unsubscribe on unmount
    }, [])


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
                return <ChatCard data={chat} />
            })}
        </View>
    </View>);
}

export default AllChats;