import { Dimensions, View, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';


import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import firestore from '@react-native-firebase/firestore';
import API from '../../api/SeviceApi';

const { width, height } = Dimensions.get('window');

const AllChats = () => {
    const scrollViewRef = useRef();
    const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([]);
    const userReducer = useSelector((state) => state.userReducer);

    useEffect(() => {
        fetchAllUsers();
    }, [])

    const fetchAllUsers = async () => {
        const response = await API.get(`/get-all-users`);
        if (response?.data?.bool) {
            setListOfAvailableForChat(response.data.data)
        } else {
            console.log("response, ERROR")
        }
    }

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
            <View  style={{height: height * 0.54 }}>
                <ScrollView>

                {listOfAvailabeForChat?.filter((user) => user.id !== userReducer?.user?.id)?.map((chat) => {
                    return <>
                        <ChatCard data={chat} />
                    </>
                })}
                </ScrollView>
            </View>
        </ScrollView>
    </View>);
}

export default AllChats;