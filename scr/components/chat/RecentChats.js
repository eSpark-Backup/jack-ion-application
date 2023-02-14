import {
  Dimensions,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import Search from 'react-native-vector-icons/EvilIcons';

import ChatCard from './ChatCard';
import TextReuseableComponent from '../../components/Text';

import API from '../../api/SeviceApi';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

const RecentChats = ({handleChatDetailsClick, active}) => {
  const [listOfRecentUsers, setListOfRecentUsers] = useState([]);
  const [searchInput, setSearchInput] = useState(null);
  const [swipeInd, setSwipeInd] = useState(null);
  const [firstRend, setFirstRend] = useState(false);

  const userReducer = useSelector((state) => state.userReducer);
  let fetchable = userReducer?.userDataForMessaging;

  const swipRef = useRef();
  const swipRef1 = useRef();
  const swipRef2 = useRef();

  useEffect(async () => {
    fetchAllUsers();
  }, [searchInput, fetchable]);

  const handleDelete = () => {
    const deleteMessage = async () => {
      const chatRoomId = listOfRecentUsers[swipeInd]?.last_message?.id;
      console.log('swipeInd ', swipeInd);
      console.log('chatroom ', chatRoomId);
      const deleteChat = await API.post('/delete-chat', {
        roomChatId: chatRoomId,
      });
      if (deleteChat?.data?.bool) {
        console.log('message deleted', deleteChat?.data?.data);
        fetchAllUsers();
      } else {
        console.log('message not deleted', deleteChat?.data?.message);
        Alert.alert('Deletion failed!');
      }
    };
    Alert.alert('Becareful', 'Are you sure to delete Message permanently?', [
      {text: 'No', style: 'cancel', onPress: () => swipRef?.current?.close()},
      {
        text: 'Yes',
        onPress: () => {
          swipRef?.current?.close();
          deleteMessage();
        },
      },
    ]);
  };

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        swipRef1?.current?.openRight();
        setTimeout(() => {
          swipRef1?.current?.close();
        }, 400);
      }, 100);
    } else {
      setSwipeInd(null);
      setFirstRend(false);
      swipRef?.current?.close();
      swipRef1?.current?.close();
      swipRef2?.current?.close();
    }
  }, [active]);
  console.log('swipeInd', swipeInd);
  const fetchAllUsers = async () => {
    try {
      const response = await API.get(`/get-all-users`);
      if (response?.data?.bool) {
        const handleSearch = () => {
          const res = filteredUsers?.filter((chat) =>
            chat?.name.toLowerCase().startsWith(searchInput.toLowerCase()),
          );
          setListOfRecentUsers(res);
          return res;
        };
        const filteredUsers = response.data?.data?.filter(
          (user) =>
            (user.last_message?.reciver == userReducer?.user?.id &&
              user?.last_message?.last_message !== null) ||
            (user.last_message?.sender == userReducer?.user?.id &&
              user?.last_message?.last_message !== null),
        );
        const reallyRecentUsers = filteredUsers?.sort(
          (a, b) =>
            new Date(b.last_message?.updated_at) -
            new Date(a.last_message?.updated_at),
        );
        // console.log('userReducer?.user?.id', reallyRecentUsers);
        !searchInput == '' && searchInput
          ? handleSearch()
          : setListOfRecentUsers(reallyRecentUsers);
      } else {
        Alert.alert('List Fetching failed!');
      }
    } catch (error) {
      console.log('result', error);
    }
  };

  const renderLeftActions = (progress, dragX, index) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [1, 0, 0, 20],
    });
    return (
      <RectButton
        style={[
          styles.leftAction,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <TouchableOpacity onPress={() => handleDelete()}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{translateX: trans}],
                width: width * 0.2,
                textAlign: 'center',
                color: 'red',
              },
            ]}>
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </RectButton>
    );
  };

  return (
    <View style={{display: active ? 'flex' : 'none'}}>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.06,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: width * 0.01,
          // elevation: 5,
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
          value={searchInput}
          style={{
            width: width * 0.7,
            height: height * 0.07,
            borderBottomColor: '#25AAE1ec',
            fontSize: width * 0.04,
            color: 'black',
          }}
          onChangeText={setSearchInput}
        />
      </View>
      <View style={{margin: 10, marginLeft: 20}}>
        <TextReuseableComponent
          value={
            listOfRecentUsers.length > 0
              ? 'List of Users you recently chatted with.'
              : 'You have not chatted with anyone yet. Select All Chats to start a Conversation.'
          }
        />
      </View>
      <View
        style={{
          width: width * 0.97,
          height: height * 0.6,
          alignSelf: 'center',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {listOfRecentUsers?.map((chat, index) => {
            return (
              <Swipeable
                key={chat.id}
                ref={
                  index == swipeInd
                    ? swipRef
                    : active && swipeInd == null && index == 0
                    ? swipRef1
                    : swipRef2
                }
                renderRightActions={(progress, dragX) =>
                  renderLeftActions(progress, dragX, index)
                }
                onSwipeableRightOpen={() => {
                  console.log('open');
                  setSwipeInd(index);
                  if (firstRend) {
                    swipRef1?.current?.close();
                    swipRef2?.current?.close();
                  } else {
                    setFirstRend(true);
                  }
                }}>
                <ChatCard
                  key={chat.id}
                  animate={active}
                  index={index}
                  data={chat}
                  handleChatDetailsClick={handleChatDetailsClick}
                />
              </Swipeable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default RecentChats;
