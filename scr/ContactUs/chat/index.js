import { View } from 'moti';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextReuseableComponent from '../../components/Text';
import RecentChats from '../../components/chat/RecentChats';
import AllChats from '../../components/chat/AllChats';
import styles from '../../components/chat/styles';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("Recent Chats");

    return (
        <View style={{ height: height }}>
            <View style={styles.chatContainer}>
                <View style={styles.chatHeading}>
                    <TextReuseableComponent heading value={"Chats"} />
                </View>
                <View style={styles.crossHeading}>
                    <TouchableOpacity onPress={() => navigation.navigate("Support")}>
                        <TextReuseableComponent heading value={"X"} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 20
            }}>
                <View style={styles.activeTabContainerView}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => setActiveTab("Recent Chats")}
                        style={activeTab == "Recent Chats" ? styles.activeTabContainer : styles.tabContainer}>
                        <TextReuseableComponent title style={{ color: activeTab == "Recent Chats" ? "#25AAE1ec" : "#fff" }} value={"Recent Chats"} />
                    </TouchableOpacity>
                    {/* {activeTab == "Recent Chats" && <View style={{ height: 4, width: 150, backgroundColor: 'black', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, marginTop: 10 }} />} */}
                </View>
                <View style={styles.activeTabContainerView}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => setActiveTab("All Chats")}
                        style={activeTab == "All Chats" ? styles.activeTabContainer : styles.tabContainer}>
                        <TextReuseableComponent title style={{ color: activeTab == "All Chats" ? "#25AAE1ec" : "#fff" }} value={"All Chats"} />
                    </TouchableOpacity>
                    {/* {activeTab == "All Chats" && <View style={{ height: 4, width: 150, backgroundColor: 'black', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, marginTop: 10 }} />} */}
                </View>
            </View>
            <View>
                {activeTab == "Recent Chats" && <RecentChats />}
                {activeTab == "All Chats" && <AllChats />}
            </View>
        </View>
    );
}
export default ChatScreen;