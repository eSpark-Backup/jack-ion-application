import React, { useState, useEffect, useContext, useReducer } from 'react'
import { View, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import navigationService from '../../../navigationService';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import MessageCard from './MessageCard';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { UserContext } from '../../context/MainContext';
import { messagesReducer } from '../../Store/Reducer/messageReducer';
import firebaseService from '../../services/index';
const { width, height } = Dimensions.get('window');

const ChatDetails = () => {
    const [message, setMessage] = useState("");
    // const [messages, setMessages] = useState([]);
    const [messages, dispatchMessages] = useReducer(messagesReducer, [])
    const [isLoading, setIsLoading] = useState(false);
    const uid = useContext(UserContext);
    const [user, setUser] = useState();
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const userReducer = useSelector((state) => state.userReducer);
    const userUidForMessaging = userReducer.userUidForMessaging;
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

        const subscriber = firestore()
            .collection("Messages")
            .orderBy("created_at", "desc")
            .onSnapshot(function (snapshot) {
                dispatchMessages({ type: 'add', payload: snapshot.docs })
                console.log('snapshot', snapshot.docs);
            })

        return () => subscriber(); // unsubscribe on unmount
    }, [])



    // useEffect(() => {
    //     firestore()
    //         .collection('Messages')
    //         .orderBy('created_at', 'desc')
    //         .get()
    //         .then(querySnapshot => {
    //             // console.log('Total Messages: ', querySnapshot);
    //             // console.log('userName reducer', userName);
    //             // setMessages(querySnapshot?.docs)
    //             dispatchMessages({ type: 'add', payload: querySnapshot?.docs })
    //             console.log('userEmail ',  userEmail);
    //             // querySnapshot.forEach(documentSnapshot => {
    //             //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //             // });
    //         });




    //     // function onResult(QuerySnapshot) {
    //     //     console.log('Got Messages collection result.', QuerySnapshot);
    //     // }

    //     // function onError(error) {
    //     //     console.error(error);
    //     // }

    //     // const subscribe = firestore().collection('Messages').onSnapshot(onResult, onError);

    //     // return () => subscribe();
    //     // console.log("messages", messages);
    //     // console.log("userUidForMessaging", userUidForMessaging);
    // },
    //     [message]
    // )

    const handleCrossClick = () => {
        // console.log('handle cross click', navigationService);
        navigationService.navigate("Chat")
    }

    const handleSend = () => {
        setIsLoading(true)
        firestore()
            .collection('Messages')
            .add({ message, userUidForMessaging, created_at: new Date(), sender: userName, reciepient: "Andy", senderEmail: userData?.email })
            .then(() => {
                console.log('Message added!');
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
                            keyExtractor={function (item) {
                                return item.id
                            }}
                            renderItem={function ({ item }) {
                                // console.log('item', item);
                                const data = item.data();
                                const side = data.senderEmail == userEmail ? 'sent' : 'received';
                                // console.log('data.senderEmail', data.senderEmail);
                                // console.log('userEmail', userEmail);
                                return (
                                    <UserContext.Provider value={user}>
                                        <MessageCard mode={side} message={data.message} />
                                    </UserContext.Provider>
                                )
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