import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import styles from './styles';
import _ from "lodash";

import moment from 'moment/moment';

const { width, height } = Dimensions.get('window');

const MessageCard = ({ data, mode, selectedChat }) => {

    return (<View >
        <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={mode == "received" ? styles.messageReceivedContainer : styles.messageSentContainer}
            >
                <View
                    style={mode == "received" ? styles.messageRecievedInner : styles.messageSentInner}
                >
                    {mode == "received" ? <TextReuseableComponent style={{ color: "gray", marginBottom: 5 }} value={selectedChat?.item?.name} /> : null}
                    <TextReuseableComponent
                        style={{ fontSize: height * 0.02, marginBottom: 10, alignSelf: mode == "received" ? "flex-start" : "flex-end" }}
                        value={data?.message}
                    />
                    <View
                        style={{ display: "flex", flexDirection: "row", alignSelf: mode == "received" ? "flex-start" : "flex-end" }}
                    >
                        <TextReuseableComponent
                            style={{
                                color: "gray",
                                fontSize: 10, alignSelf: mode == "received" ? "flex-start" : "flex-end",
                                marginRight: 10
                            }}
                            value={data?.created_at ? moment(data?.created_at).utc().format("MM/DD/YY hh:mm:ss") : null}
                        />
                        {/* {mode == "sent" && <MaterialCommunityIcons
                                style={{ alignSelf: mode == "received" ? "flex-start" : "flex-end" }} value={data?.seen ? "Seen" : "Delievered"}
                                name={data?.seen ? "check-all" : "check"}
                                size={width * 0.04}
                                color={data?.seen ? "blue" : "gray"}
                            />} */}
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>);
}

export default MessageCard;