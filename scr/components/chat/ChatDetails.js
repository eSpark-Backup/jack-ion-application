import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import TextInput from '../TextInput';
import TextReuseableComponent from '../../components/Text/index';
import navigationService from '../../../navigationService';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import MessageCard from './MessageCard';

import { Alert } from 'react-native'


import { UserContext } from '../../context/MainContext';
import firebaseService from '../../services/index';
const { width, height } = Dimensions.get('window');

const ChatDetails = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const uid = useContext(UserContext);
    const [user, setUser] = useState(null)


    useEffect(() => {
        console.log('firebase service', firebaseService);
        firebaseService.signIn()
            .then(({ user, error }) => {
                if (error) {
                    console.log('error: ' + error);
                    Alert.alert('Something went wrong')
                    return
                }
                console.log('user: ' + user);
                setUser(user)
            })

    },
        []
    )

    const handleCrossClick = () => {
        // console.log('handle cross click', navigationService);
        navigationService.navigate("Chat")
    }

    const handleSend = useCallback(
        function () {
            setIsLoading(true)
            firebaseService
                .createMessage({ message, user })
                .then(function () {
                    setIsLoading(false)
                    setMessage('')
                })
        },
        [message]
    )

    const mock = [
        { id: 1, message: 'Hello', mode: 'sent' },
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
                            data={mock}
                            keyExtractor={function (item) {
                                return item.id
                            }}
                            renderItem={function ({ item }) {
                                return (
                                    <UserContext.Provider value={user}>
                                        <MessageCard mode={item.mode} message={item.message} />
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
                <TextInput style={styles.chatInput} />
            </View>
            <View>
                <Button onPress={handleSend}>Send</Button>
            </View>
        </View>
    </View>);
}

export default ChatDetails;