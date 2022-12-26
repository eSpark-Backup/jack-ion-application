import { View } from 'moti';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextReuseableComponent from '../../components/Text';
import RecentChats from '../../components/chat/RecentChats';
import AllChats from '../../components/chat/AllChats';
import styles from '../../components/chat/styles';
import Help from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');



const ChatScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("Recent Chats");

    return (
        <View style={{ height: height }}>
            <View style={{
                width: width * 1,
                height: height * 0.07,
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#25AAE1ec',
                    elevation: width * 0.01,
                    flexDirection: 'row',
                }}>
                    <View style={{ display: 'flex', position: 'absolute', left: 20, top: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Support")}>
                            <TextReuseableComponent heading value={"X"} style={{ color: "white" }} />
                        </TouchableOpacity>
                    </View>
                    <Help
                        name="help-circle"
                        size={width * 0.07}
                        color="white"
                        style={{
                            marginRight: width * 0.01,
                        }}
                    />
                    <TextReuseableComponent title style={{
                        fontSize: height * 0.035,
                        color: 'white',
                    }} value={"Support"} />
                </View>
            </View>
            <View style={styles.chatContainer}>
                <View style={styles.chatHeading}>
                    <TextReuseableComponent style={{ fontWeight: "bold" }} heading value={"Chats"} />
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
                        style={activeTab == "Recent Chats" ? styles.tabContainer :
                            styles.activeTabContainer}>
                        <TextReuseableComponent title style={{ color: activeTab == "Recent Chats" ? "#fff" : "#25AAE1ec" }} value={"Recent Chats"} />
                    </TouchableOpacity>
                    {/* {activeTab == "Recent Chats" && <View style={{ height: 4, width: 150, backgroundColor: 'black', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, marginTop: 10 }} />} */}
                </View>
                <View style={styles.activeTabContainerView}>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => setActiveTab("All Chats")}
                        style={activeTab == "All Chats" ? styles.tabContainer :
                            styles.activeTabContainer}>
                        <TextReuseableComponent title style={{ color: activeTab == "All Chats" ? "#fff" : "#25AAE1ec" }} value={"All Chats"} />
                    </TouchableOpacity>
                    {/* {activeTab == "All Chats" && <View style={{ height: 4, width: 150, backgroundColor: 'black', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, marginTop: 10 }} />} */}
                </View>
            </View>
            <View >
                {activeTab == "Recent Chats" && <RecentChats />}
                {activeTab == "All Chats" && <AllChats />}
            </View>
        </View>
    );
}
export default ChatScreen;