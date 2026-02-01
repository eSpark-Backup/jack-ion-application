import React, { Component } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking,
    Share,
    LayoutAnimation
} from 'react-native';
// PACKAGES
import { Icon } from 'react-native-elements';
import Iconedd from 'react-native-vector-icons/Feather';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
// import { colors } from '../src/colors/colors';

const { width, height } = Dimensions.get('window');
let unseenMessages = [];
const getMessagesLength = () => {

};
export default class CustomSidebarMenu extends Component {
    constructor() {
        super();
        this.state = {
            drop: true,
            unseenGetMessages: [],
        };
        this.proileImage =
            'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1';
        this.items = [
            {
                navOptionThumb: 'account-circle',
                navOptionName: 'Home',
                screenToNavigate: 'ionMain',
            },
            {
                navOptionThumb: 'local-play',
                navOptionName: 'DashBoard',
                screenToNavigate: 'DashBoard',
            },
            {
                navOptionThumb: 'star',
                navOptionName: 'Properties',
                screenToNavigate: 'Properties',
            },
            // {
            //     navOptionThumb: 'message',
            //     navOptionName: 'Chats',
            //     screenToNavigate: 'ChatRoom',
            //     message: unseenMessages.length,
            // },
            // {
            //     navOptionThumb: 'unarchive',
            //     navOptionName: 'Donation',
            //     screenToNavigate: 'DonationTimeline',
            // },
        ];
        this.property = {
            name: 'Plaza',
            list: [
                {
                    navOptionThumb: 'account-circle',
                    navOptionName: 'Profile',
                    screenToNavigate: 'Detail',
                },
                {
                    navOptionThumb: 'local-play',
                    navOptionName: 'Units',
                    screenToNavigate: 'Equip',
                },
            ]
        };
    }
    componentDidMount() {
        console.log('Check Prop', this.props)
    }

    changeLayoutProperty = () => {
        console.log('asdas',this.props)
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // this.setState({ drop: !this.state.drop })
    }

    onShare() {
        Share.share({
            message:
                'Download the TiktakBook from Google Play Store ' +
                'https://play.google.com/store/apps/details?id=com.tiktakbook',
        });
    }
    render() {

        // if (thumbnail && thumbnail.startsWith('http')) {
        //   isThumbnail = true;
        // }
        return (
            <View style={styles.sideMenuContainer}>
                <ScrollView>
                    {/*Top Large Image */}
                    <View
                        style={{
                            width: wp('100%'),
                            height: hp('15%'),
                            backgroundColor: "red",
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: hp('3%'),
                            marginTop: hp('0%'),
                            borderBottomEndRadius: 10,
                            borderBottomStartRadius: 10,
                        }}>
                        <LinearGradient
                            colors={['#BC8EFF', "#25AAE1ec"]}
                            start={{ x: 0.2, y: 0.2 }}
                            end={{ x: 0.6, y: 0.1 }}
                            style={styles.linearGradientStyle}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: Dimensions.get('window').width - 100,
                                }}
                            // onPress={() => this.props.navigation.navigate('Profilescreen')}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        width: wp('60%'),
                                        alignSelf: 'center',
                                        marginLeft: wp('5%'),
                                    }}>
                                    <Image
                                        source={{
                                            uri: this.proileImage,
                                        }}
                                        style={styles.sideMenuProfileIcon}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            width: wp('55%'),
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            marginTop: hp('3%'),
                                            //backgroundColor:"red",
                                            marginLeft: wp('0%'),
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: hp('2%'),
                                                fontFamily: 'LexendDeca-Regular',
                                                color: 'white',
                                                marginLeft: wp('12%'),
                                            }}>
                                            {"name"}
                                        </Text>
                                        <Iconedd
                                            name="chevrons-right"
                                            color="white"
                                            size={hp('4%')}
                                            style={{ marginLeft: wp('7%') }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    {/*Divider between Top Image and Sidebar Option*/}
                    {/*Setting up Navigation Options from option array using loop*/}
                    <View style={{ width: '100%', marginTop: wp('0%') }}>
                        {this.items.map((item, key) => (
                            <View
                                //control for whole navigation drawer container
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: hp('8%'),
                                    backgroundColor:
                                        global.currentScreenIndex === key
                                            ? "blue"
                                            : "#25AAE1ec",
                                }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: hp('5%'),
                                        width: '100%',
                                        borderBottomColor: 'gray',
                                        borderBottomWidth: 0,
                                        backgroundColor:
                                            global.currentScreenIndex === key
                                                ? 'white'
                                                : "#25AAE1ec",
                                    }}
                                    onPress={console.log(this.props)}
                                    // onPress={() => {
                                    //     global.currentScreenIndex = key;
                                    //     this.props.navigation.navigate(item.screenToNavigate, this.props.navigation.state.params);
                                    // }}
                                    >
                                    <View style={{ marginRight: 10, marginLeft: 20 }}>
                                        <Icon
                                            //Control all icons for styling
                                            name={item.navOptionThumb}
                                            size={hp('3%')}
                                            color={"white"}
                                            style={{
                                                backgroundColor:
                                                    global.currentScreenIndex === key
                                                        ? '#25AAE1ec'
                                                        : '#25AAE1ec',
                                            }}
                                        />
                                    </View>
                                    <Text
                                        //control all text of navigation drawer
                                        style={{
                                            fontSize: hp('2%'),
                                            width: wp('40%'),
                                            height: hp('3%'),
                                            fontFamily: 'LexendDeca-Regular',
                                            color:
                                                global.currentScreenIndex === key
                                                    ? '#25AAE1ec'
                                                    : 'white',
                                        }}>
                                        {item.navOptionName}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={{

                                flexDirection: 'row',
                                alignItems: 'center',
                                height: hp('5%'),
                                width: '100%',
                                marginVertical: hp('1.2%'),
                                borderBottomColor: 'gray',
                                borderBottomWidth: 0,
                            }}
                            // onPress={console.log(this.props)}
                            onPress={() => this.changeLayoutProperty()}
                            >
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Text
                                    //control all text of navigation drawer
                                    style={{
                                        fontSize: hp('2%'),
                                        width: wp('40%'),
                                        height: hp('3%'),
                                        fontFamily: 'LexendDeca-Regular',
                                        color: 'white',
                                    }}>
                                    {this.property.name}
                                </Text>
                            </View>
                            <View>
                                {this.state.drop ? (<Iconedd name='chevron-down' color="white" size={hp('3%')} />
                                ) : (<Iconedd name='chevron-right' color="white" size={hp('3%')} />)}
                            </View>

                        </TouchableOpacity>
                        {/* <View style={{ width: '100%', marginTop: wp('0%') }}> */}

                        {this.property.list.map((item, key) => (
                            //control for whole navigation drawer container
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: this.state.drop ? hp('8%') : hp('0%'),
                                    overflow: 'hidden',
                                    backgroundColor:
                                        global.currentScreenIndex === key
                                            ? "blue"
                                            : "#25AAE1ec",
                                }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: hp('5%'),
                                        width: '100%',
                                        borderBottomColor: 'gray',
                                        borderBottomWidth: 0,
                                        backgroundColor:
                                            global.currentScreenIndex === key
                                                ? 'white'
                                                : "#25AAE1ec",
                                    }}
                                    onPress={() => {
                                        global.currentScreenIndex = key;
                                        this.props.navigation.navigate(item.screenToNavigate, this.props.navigation.state.params);
                                    }}>
                                    <View style={{ marginRight: 10, marginLeft: 20 }}>
                                        <Icon
                                            //Control all icons for styling
                                            name={item.navOptionThumb}
                                            size={hp('3%')}
                                            color={"white"}
                                            style={{
                                                backgroundColor:
                                                    global.currentScreenIndex === key
                                                        ? '#25AAE1ec'
                                                        : '#25AAE1ec',
                                            }}
                                        />
                                    </View>
                                    <Text
                                        //control all text of navigation drawer
                                        style={{
                                            fontSize: hp('2%'),
                                            width: wp('40%'),
                                            height: hp('3%'),
                                            fontFamily: 'LexendDeca-Regular',
                                            color:
                                                global.currentScreenIndex === key
                                                    ? '#25AAE1ec'
                                                    : 'white',
                                        }}>
                                        {item.navOptionName}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/* <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: hp('5%'),
                                width: '100%',
                                marginVertical: hp('1.2%'),
                                borderBottomColor: 'gray',
                                borderBottomWidth: 0,
                            }}
                            onPress={() => {
                                Linking.openURL(
                                    'https://www.youtube.com/channel/UCu3sHM1pb2skASn9FRlgzRA',
                                );
                            }}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Icon
                                    //Control all icons for styling
                                    name={'devices-other'}
                                    size={hp('3%')}
                                    color={"white"}
                                />
                            </View>
                            <Text
                                //control all text of navigation drawer
                                style={{
                                    fontSize: hp('2%'),
                                    width: wp('40%'),
                                    height: hp('3%'),
                                    fontFamily: 'LexendDeca-Regular',
                                    color: 'white',
                                }}>
                                Deap Learning
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                    <View
                        style={{
                            width: wp('100%'),
                            height: hp('10%'),
                            borderTopWidth: 1,
                            borderTopColor: "white",
                            marginTop: hp('5%'),
                            flexDirection: 'row',
                        }}></View>
                    <View
                        style={{
                            alignSelf: 'center',
                            marginRight: width * 0.22,
                            flexDirection: 'row',
                            width: wp('40%'),
                            //backgroundColor:"red",
                            justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                            style={{
                                width: wp('16%'),
                                height: hp('8%'),
                                justifyContent: 'center',
                                backgroundColor: "white",
                                alignItems: 'center',
                                alignContent: 'center',
                                borderRadius: 50,
                            }}
                            onPress={() => this.props.navigation.navigate('Settings')}>
                            <Iconedd
                                color="#25AAE1ec"
                                name="settings"
                                size={hp('3%')}
                                style={{ alignSelf: 'center', alignItems: 'center' }}></Iconedd>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: wp('16%'),
                                height: hp('8%'),
                                justifyContent: 'center',
                                backgroundColor: "white",
                                alignItems: 'center',
                                alignContent: 'center',
                                borderRadius: 50,
                            }}
                            onPress={() => this.props.navigation.navigate('Support')}>
                            <Icon
                                color="#25AAE1ec"
                                name="share"
                                style={{ alignSelf: 'center', alignItems: 'center' }}></Icon>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: "#25AAE1ec",
        alignItems: 'center',
        paddingTop: 0,
    },
    sideMenuProfileIcon: {
        width: wp('20%'),
        height: hp('10%'),
        marginTop: hp('2%'),
        borderRadius: 150 / 2,
        backgroundColor: 'transparent',
    },
    linearGradientStyle: {
        width: wp('100%'),
        height: hp('26%'),
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },
});















