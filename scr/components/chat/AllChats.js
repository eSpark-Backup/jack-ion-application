import { Dimensions, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

const { width, height } = Dimensions.get('window');

const AllChats = () => {
    const [listOfChats, setListOfChats] = useState([]);
    const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([{
        id: 1,
        name: "Andy",
        assignedProperty: "ION Energy"
    },
    {
        id: 1,
        name: "Molly",
        assignedProperty: "Test Property"
    },
    {
        id: 1,
        name: "Steieve",
        assignedProperty: "World Trade Center"
    },
    {
        id: 1,
        name: "Gru",
        assignedProperty: "Stanton Oaks Apartments"
    },
    {
        id: 1,
        name: "Eugene Flitzherbert",
        assignedProperty: "ION Energy"
    }]);


    return (<View>
        <View style={{
            borderWidth: 1.5,
            marginVertical: 20,
            width: "90%",
            borderRadius: width * 0.02,
            alignSelf: 'center',
            backgroundColor: 'white'
        }}>
            <TextInput
                placeholder="Find People to chat"
            />
        </View>
        <View style={{ margin: 10}}>
        <TextReuseableComponent value={"List of Available People for Chat."} />
        </View>
        <View>
            {listOfAvailabeForChat?.map((chat) => {
                return <ChatCard data={chat} />
            })}
        </View>
    </View>);
}

export default AllChats;