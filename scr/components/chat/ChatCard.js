import React from 'react';
import { View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import navigationService from '../../../navigationService';
import TextReuseableComponent from '../../components/Text';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const ChatCard = (props) => {
    const { id, name, role_id, last_message, unReadMessages } = props.data;
    const handleChatDetailsClick = props.handleChatDetailsClick;

    return <View key={id} style={styles.allChatsMainContainer}>
        <TouchableOpacity onPress={() => handleChatDetailsClick("ChatDetails", { item: props.data })}>
            <View style={styles.chatCardContainer}>
                <View style={styles.iconContainer}>
                    <View style={styles.innerContainerIcon}>
                        <TextReuseableComponent heading value={name.substring(0, 1).toUpperCase()} />
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 15 }} value={name} />
                    </View>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 10 }} value={typeof last_message == "string" ? last_message : "Let's Start Conversation!"} />
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    {unReadMessages > 0 && <View
                        style={{
                            backgroundColor: "#25AAE1ec",
                            width: 17,
                            height: 17,
                            borderRadius: 17,
                            display: 'flex',
                            alignItems: "center",
                        }}
                    >
                        <TextReuseableComponent value={unReadMessages} />
                    </View>
                    }
                    <TextReuseableComponent style={{ fontSize: 10 }} value={role_id == 4 ? "Technician" : "Admin"} />
                </View>
            </View>
        </TouchableOpacity>
    </View>

}

export default ChatCard;