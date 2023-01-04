import { Dimensions, View, TextInput, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';

import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import API from '../../api/SeviceApi';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const RecentChats = ({ handleChatDetailsClick, active }) => {
    const [listOfRecentUsers, setListOfRecentUsers] = useState([]);
    const [searchInput, setSearchInput] = useState(null);
    const [swipeInd, setSwipeInd] = useState(null);
    const [firstRend, setFirstRend] = useState(false);

    const userReducer = useSelector((state) => state.userReducer);
    let fetchable = userReducer?.userDataForMessaging;

    const swipRef = useRef();
    const swipRef1 = useRef();
    const swipRef2 = useRef();

    useEffect(async () => {
        fetchAllUsers();
    }, [searchInput, fetchable])

    const handleDelete = () => {
        // console.log('listOfRecentUsers[swipeInd].last_message?.id', listOfRecentUsers[swipeInd].last_message?.id);
        const deleteMessage = async () => {
            const deleteChat = await API.post("/delete-chat", { id: listOfRecentUsers[swipeInd].last_message?.id });
            if (deleteChat?.data?.bool) {
                console.log('message deleted', deleteChat?.data?.data);
            } else {
                console.log('message not deleted', deleteChat?.data?.message);
                Alert.alert("Deletion failed!");
            }

        }
        Alert.alert('Becareful', 'Are you sure to delete Message permanently?', [
            { text: 'No', style: 'cancel', onPress: () => swipRef.current.close() },
            {
                text: 'Yes',
                onPress: () => {
                    deleteMessage();
                    swipRef1.current.close();
                },
            },
        ]);
    }

    useEffect(() => {
        if (active) {
            setTimeout(() => {
                swipRef1?.current?.openRight();
                setTimeout(() => {
                    swipRef1?.current?.close();
                }, 500);
            }, 100);
        }else{
            setSwipeInd(null)
            setFirstRend(false)
            swipRef?.current?.close();
            swipRef1?.current?.close();
            swipRef2?.current?.close();
        }
    }, [active])

    const fetchAllUsers = async () => {
        // console.log('listOfRecentUsers', listOfRecentUsers);
        try {
            const response = await API.get(`/get-all-users`);
            if (response?.data?.bool) {
                const handleSearch = () => {
                    const res = filteredUsers?.filter((chat) => chat?.name.toLowerCase().startsWith(searchInput.toLowerCase()));
                    setListOfRecentUsers(res);
                    return res;
                }
                const filteredUsers = response.data?.data?.filter((user) => (user.last_message?.reciver == userReducer?.user?.id && user?.last_message?.last_message !== null) || (user.last_message?.sender == userReducer?.user?.id && user?.last_message?.last_message !== null));
                !searchInput == "" && searchInput ? handleSearch() : setListOfRecentUsers(filteredUsers);
            } else {
                Alert.alert("List Fetching failed!")
            }
        } catch (error) {
            console.log('result', error);
        }
    }

    const renderLeftActions = (progress, dragX, index) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [1, 0, 0, 20],
        });
        return (
            <RectButton style={[styles.leftAction, { justifyContent: "center", alignItems: "center" }]}  >
                <TouchableOpacity onPress={() => handleDelete()}>
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

    return (

        <View style={{ display: active ? 'flex' : 'none' }} >
            <View style={{
                width: width * 0.9,
                height: height * 0.06,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: width * 0.01,
                // elevation: 5,
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
            <View style={{ margin: 10, marginLeft: 20 }}>
                <TextReuseableComponent value={listOfRecentUsers.length > 0 ? "List of Users you recently chatted with." : "You have not chatted with anyone yet. Select All Chats to start a Conversation."} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{ width: width * 0.97, alignSelf: "center" }}>
                    {listOfRecentUsers?.map((chat, index) => {
                        // console.log('index', index, swipeInd, active)
                        return <Swipeable key={chat.id}
                            // ref={index == swipeInd ? swipRef : swipRef1}
                            ref={index == swipeInd ? swipRef : active && swipeInd == null && index == 0 ? swipRef1 : swipRef2}
                            // ref={index == 0 ? swipRef1 : null}
                            renderRightActions={(progress, dragX) => renderLeftActions(progress, dragX, index)}
                            onSwipeableRightOpen={() => {
                                console.log('open');
                                if (firstRend) {
                                    setSwipeInd(index)
                                    swipRef1?.current?.close();
                                    swipRef2?.current?.close();
                                } else {
                                    setFirstRend(true)
                                }

                            }}
                        >
                            <ChatCard key={chat.id} animate={active} index={index} data={chat} handleChatDetailsClick={handleChatDetailsClick} />
                        </Swipeable>
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

export default RecentChats;