import React, { useState, useEffect, useContext, useReducer } from 'react'
import { View, Dimensions, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import navigationService from '../../../navigationService';
import styles from './styles';
import MessageCard from './MessageCard';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { UserContext } from '../../context/MainContext';
import { messagesReducer } from '../../Store/Reducer/messageReducer';
import API from '../../api/SeviceApi';
const { width, height } = Dimensions.get('window');

const ChatDetails = ({ navigation }) => {
    const [message, setMessage] = useState("");
    const [messagesForMe, setMessagesForMe] = useState([]);
    const [listOfReciepients, setListOfReciepients] = useState([]);

    const [messages, dispatchMessages] = useReducer(messagesReducer, [])
    const [isLoading, setIsLoading] = useState(false);
    const uid = useContext(UserContext);
    const [user, setUser] = useState();
    const [selectedUser, setSelectedUser] = useState();
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const userReducer = useSelector((state) => state.userReducer);
    const userDataForMessaging = userReducer.userDataForMessaging;
    const userName = useSelector((state) => state.userReducer.user.name);
    const userEmail = useSelector((state) => state.userReducer.user.email);
    const userData = useSelector((state) => state.userReducer.user);
    // const userEmail = useSelector((state) => state.userReducer.user.email)
    const mock = [
        { id: 1, message: 'Hello', mode: 'sent', },
        { id: 2, message: 'Hi!', mode: 'received' },
        { id: 3, message: 'Hello', mode: 'sent' },
        { id: 4, message: 'Hi!', mode: 'received' },
        { id: 5, message: 'Hello', mode: 'sent' },
        { id: 6, message: 'Hi!', mode: 'received' },
        { id: 7, message: 'Hello', mode: 'sent' },
        { id: 8, message: 'Hi!', mode: 'received' },
        { id: 9, message: 'Hello', mode: 'sent' },
        { id: 10, message: 'Hi!', mode: 'received' },
        { id: 11, message: 'Hello', mode: 'sent' },
        { id: 12, message: 'Hi!', mode: 'received' },
    ]

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return () => subscriber(); // unsubscribe on unmount
    }, []);

    useEffect(() => {
        setSelectedUser(navigation.state.params.item)
        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(function (snapshot) {
                dispatchMessages({ type: 'add', payload: snapshot.docs })
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])

    const handleCrossClick = () => {
        navigationService.navigate("Chat")
    }

    const handleSend = () => {
        setIsLoading(true)
        const data = {
            message,
            created_at: new Date(),
            senderName: userDataForMessaging?.name,
            senderEmail: userDataForMessaging?.email,
            senderRole: userDataForMessaging?.role,
            senderRoleId: userDataForMessaging.role_id,
            senderId: userDataForMessaging?.id,
            reciepientId: navigation.state.params.item?.id,
            reciepientName: navigation.state.params.item?.name,
            reciepientEmail: navigation.state.params.item?.email,
        }
        firestore()
            .collection('Messages')
            .add(data)
            .then(() => {
                console.log('Message added!', data);
                setIsLoading(false)
                setMessage("");
            });

    }



    if (initializing) return null;

    if (!user) {
        return (
            <View>
                <TextReuseableComponent value={"User not Logged in."} />
            </View>
        );
    }

    return (<View style={styles.chatDetailsContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button onPress={handleCrossClick}>X</Button>
        </View>
        <View>
            <TextReuseableComponent heading style={{ textAlign: "center", color: 'blue'}} value={selectedUser?.name} />
        </View>
        <View style={styles.chatDetailsView}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ height: height * 0.745 }}
            >
                <SafeAreaView>
                    <View>
                        <FlatList
                            inverted
                            data={messages}
                            ListEmptyComponent={() => {
                                return <View>
                                    <TextReuseableComponent value={"Start a Conversation!"} />
                                </View>
                            }}
                            keyExtractor={function (item) {
                                return item.id
                            }}
                            renderItem={function ({ item }) {
                                const data = item.data();
                                const loggedInUserEmail = userEmail;
                                const clickedUserEmail = selectedUser.email;
                                const reciepientEmail = data?.reciepientEmail;
                                const senderEmail = data?.senderEmail;
                                if (senderEmail == clickedUserEmail || reciepientEmail == clickedUserEmail || clickedUserEmail == loggedInUserEmail) {

                                    const side = senderEmail == userEmail ? 'sent' : 'received';
                                    return (
                                        <UserContext.Provider value={user}>
                                            <MessageCard mode={side} message={data.message} />
                                        </UserContext.Provider>
                                    )
                                }
                            }}
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
        <View style={styles.chatDetailsInput}>
            <View style={styles.chatInputContainer}>
                <TextInput style={styles.chatInput} value={message} onChangeText={setMessage} placeholder="Write you message" />
            </View>
            <View>
                <Button onPress={handleSend} disabled={isLoading}>Send</Button>
            </View>
        </View>
    </View>);
}

export default ChatDetails;