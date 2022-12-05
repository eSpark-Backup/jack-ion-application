import React from 'react';
import { View, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import navigationService from '../../../navigationService';
import TextReuseableComponent from '../../components/Text';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const ChatCard = (props) => {
    const data = props.data.data();
    const { userName, userId, userEmail, userRole, userRoleId } = data;
    

    return <View key={userId} style={styles.allChatsMainContainer}>
        <TouchableOpacity onPress={() => navigationService.navigate("ChatDetails", { item: data })}>
            <View style={styles.chatCardContainer}>
                <View style={styles.iconContainer}>
                    <View style={styles.innerContainerIcon}>
                        <TextReuseableComponent heading value={"A"} />
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 15 }} value={userName} />
                    </View>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 10 }} value={userRole} />
                    </View>
                </View>
                <View style={styles.timeContainer}>
                    <TextReuseableComponent style={{ fontSize: 18 }} value={"..."} />
                    {/* <TextReuseableComponent style={{ fontSize: 10 }} value={assignedProperty.substring(0, 13)} /> */}
                </View>
            </View>
        </TouchableOpacity>
    </View>
}

export default ChatCard;