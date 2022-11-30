import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import navigationService from '../../../navigationService';
import styles from './styles';

const ChatCard = () => {

    return <View style={styles.allChatsMainContainer}>
        <TouchableOpacity onPress={() => navigationService.navigate("ChatDetails")}>
            <View style={styles.chatCardContainer}>
                <View style={styles.iconContainer}>
                    <View style={styles.innerContainerIcon}>
                        <TextReuseableComponent heading value={"A"} />
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View>
                        <TextReuseableComponent heading value={"Andy"} />
                    </View>
                    <View>
                        <TextReuseableComponent value={"Hello from the other side"} />
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <View style={{ top: 0 }}>
                        <TextReuseableComponent heading value={"..."} />
                    </View>
                    <View style={{ marginTop: 7 }}>
                        <TextReuseableComponent value={"17:36:00"} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    </View>
}

export default ChatCard;