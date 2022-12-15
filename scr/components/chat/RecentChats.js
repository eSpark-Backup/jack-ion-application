import { Dimensions, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';


import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import firestore from '@react-native-firebase/firestore';
import API from '../../api/SeviceApi';


const { width, height } = Dimensions.get('window');

const RecentChats = () => {
    const [listOfRecentUsers, setListOfRecentUsers] = useState([]);
    const [searchInput, setSearchInput] = useState(null);

    const userReducer = useSelector((state) => state.userReducer);

    useEffect(() => {
        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(async (snapshot) => {
                const filteredMessages = snapshot.docs?.filter((msg) => {
                    return msg.data()?.senderEmail === userReducer?.user?.email || msg.data()?.reciepientEmail === userReducer?.user?.email;
                });
                fetchAllUsers(filteredMessages);
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])

    console.log('search input', searchInput);

    const fetchAllUsers = async (filteredMessages) => {
        const response = await API.get(`/get-all-users`);
        if (response?.data?.bool) {
            const recentChats = filteredMessages?.filter((chat) => {
                const now = new Date().getTime();
                const chatTime = new Date(chat?.data()?.created_at?.toDate()).getTime();
                const diff = now - chatTime;
                const diffInHours = diff / 1000 / 60 / 60;
                return diffInHours < 24;
            });

            const newArray = response.data.data?.filter((technician) => {
                const theUser = recentChats?.filter((item) => item.data().reciepientEmail == technician.email || item.data().senderEmail == technician.email);
                return theUser.length > 0 ? technician : null;
            });
            setListOfRecentUsers(newArray);
        } else {
            console.log("response, ERROR")
        }
    }

    return (
        <View>

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
                        value={searchInput}
                        style={{
                            width: width * 0.7,
                            height: height * 0.07,
                            borderBottomColor: '#25AAE1ec',
                            fontSize: width * 0.04,
                            color: 'black',
                        }}
                        onChangeText={setSearchInput}
                    />
                </View>
                <View style={{ margin: 10 }}>
                    <TextReuseableComponent value={"List of Users you chated with in the last 24 hours."} />
                </View>
                <View style={{ height: height * 0.54 }}>
                    <ScrollView>

                        {listOfRecentUsers?.filter((user) => user.id !== userReducer?.user?.id)?.map((chat) => {
                            return <>
                                <ChatCard data={chat} />
                            </>
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

export default RecentChats;