import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from './styles';

const MessageCard = ({ message, mode }) => {
    return (<View style={styles.chatDetailsView}>
        {/* <TextReuseableComponent value={"Chat details screen"} /> */}
        <ScrollView>
            <View style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer}>
                <TextReuseableComponent title value={message} />
            </View>
            {/* <View style={styles.messageSentContainer}>

                <TextReuseableComponent title value={messageSent} />
            </View> */}
        </ScrollView>
    </View>);
}

export default MessageCard;