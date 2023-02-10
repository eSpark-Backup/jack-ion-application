import {
  Dimensions,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';
import _ from 'lodash';
import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';
import styles from './styles';

import firestore from '@react-native-firebase/firestore';
import API from '../../api/SeviceApi';

const {width, height} = Dimensions.get('window');

const AllChats = ({handleChatDetailsClick}) => {
  const [listOfAvailabeForChat, setListOfAvailableForChat] = useState([]);
  const [input, setInput] = useState('');
  const userReducer = useSelector((state) => state.userReducer);
  let fetchable = userReducer?.userDataForMessaging;

  useEffect(async () => {
    const response = await API.get(`/get-all-users`);
    if (response?.data?.bool) {
      const handleSearch = () => {
        const res = response.data.data?.filter((chat) => {
          const inputValue = input?.toString()?.toLowerCase();
          const chatName = chat?.name?.toString()?.toLowerCase();
          return chatName?.startsWith(inputValue);
        });
        // console.log('setListOfAvailableForChat', res);
        setListOfAvailableForChat(res);
        return res;
      };
      !input == '' && input
        ? handleSearch()
        : setListOfAvailableForChat(response.data.data);
    } else {
      console.log('error', response?.data?.message);
    }
  }, [input, fetchable]);

  return (
    <View>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.06,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: width * 0.01,
          elevation: 5,
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        <Search
          name="search"
          size={height * 0.04}
          style={{marginLeft: width * 0.05}}
          color="gray"
        />
        <TextInput
          placeholderTextColor="gray"
          placeholder="Search"
          value={input?.toString()}
          style={{
            width: width * 0.7,
            height: height * 0.07,
            borderBottomColor: '#25AAE1ec',
            fontSize: width * 0.04,
            color: 'black',
          }}
          onChangeText={setInput}
        />
      </View>
      <View style={{margin: 10, marginLeft: 20}}>
        <TextReuseableComponent value={'List of Available People for Chat.'} />
      </View>
      <View
        style={{
          width: width * 0.97,
          height: height * 0.6,
          alignSelf: 'center',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {listOfAvailabeForChat
            ?.filter?.((user) => user.id !== userReducer?.user?.id)
            ?.map((chat) => {
              const {id, name, role_id, last_message, unReadMessages} = chat;
              return (
                <View key={id} style={styles.allChatsMainContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleChatDetailsClick('ChatDetails', {item: chat})
                    }>
                    <View style={styles.chatCardContainer}>
                      <View style={styles.iconContainer}>
                        <View style={styles.innerContainerIcon}>
                          <TextReuseableComponent
                            heading
                            value={name?.substring(0, 1).toUpperCase()}
                          />
                        </View>
                      </View>
                      <View style={styles.nameContainer}>
                        <View>
                          <TextReuseableComponent
                            style={{fontSize: 15}}
                            value={name}
                          />
                        </View>
                        <View>
                          <TextReuseableComponent
                            style={{fontSize: 10}}
                            value={
                              typeof last_message == 'string'
                                ? last_message
                                : last_message?.last_message
                                ? last_message?.last_message
                                : "Let's Start a Conversation!"
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.timeContainer}>
                        <TextReuseableComponent
                          style={{fontSize: 10}}
                          value={role_id == 4 ? 'Technician' : 'Admin'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

export default AllChats;
