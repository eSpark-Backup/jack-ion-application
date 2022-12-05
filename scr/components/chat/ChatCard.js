import React from 'react';
import { View, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import navigationService from '../../../navigationService';
import TextReuseableComponent from '../../components/Text';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const ChatCard = (props) => {
    const { id, name, role_id } = props.data;
    
    return <View key={id} style={styles.allChatsMainContainer}>
        <TouchableOpacity onPress={() => navigationService.navigate("ChatDetails", { item: props.data })}>
            <View style={styles.chatCardContainer}>
                <View style={styles.iconContainer}>
                    <View style={styles.innerContainerIcon}>
                        <TextReuseableComponent heading value={"A"} />
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 15 }} value={name} />
                    </View>
                    <View>
                        <TextReuseableComponent style={{ fontSize: 10 }} value={role_id == 4 ? "Technician" : "Admin"} />
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