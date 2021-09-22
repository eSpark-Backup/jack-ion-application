import React, { Component, version } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    Animated,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Pressable,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Menu from 'react-native-vector-icons/Entypo';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';
import Message from 'react-native-vector-icons/Feather';
import TabIcon from 'react-native-vector-icons/Entypo';
import Back from 'react-native-vector-icons/MaterialIcons';
import Tag from 'react-native-vector-icons/Feather';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, Button, FAB } from 'react-native-paper';


import Modal from 'react-native-modal';

// Components
import { Fonts } from '../../../../utils/fonts';
import styles from './FormStyle';
import { Ellipse } from 'react-native-svg';
const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
    constructor() {
        super();
        this.state = {
            isVisible: false,

        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible })

    }
    render() {
        return (
            <View style={styles.headingInner}>
                <TouchableOpacity style={{
                    width : width * .3,
                    // left: width * .1    ,   
                    // borderWidth: height * .001,
                    // borderColor: "purple",
                    // backgroundColor: 'white',
                    // borderRadius: width * .5,
                }} onPress={this.toggleModal} >
                    <View style={{
                        flexDirection: "row",
                        padding: width * .03,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }} >
                  {/* <Message name="home" size={height * .025} color="purple" /> */}
                        <Text style={{
                            fontSize: 14,
                            color: "purple",
                            // fontFamily: Fonts.WorkSansRegular
                        }}>Add a Unit</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                    isVisible={this.state.isModalVisible}
                    style={styles.modalContainer}>
                    <View style={styles.modalInner}>
                        <View style={styles.boxConatainer}>
                            <View style={styles.boxInner}>
                                {/* Box Header */}
                                <View style={styles.boxHeader}>
                                    <View style={styles.boxHeaderInner}>
                                        <Icon name={'business'} size={height * .05} color='#5e5e5e' />
                                        <Text style={styles.modalHeading}>New Property</Text>
                                        <Pressable
                                            onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })}
                                            android_ripple={{
                                                color: 'black',
                                                borderless: true,
                                                radius: width * .03,
                                            }}
                                        >
                                            <Icon name="cancel" size={height * 0.035} color="black" maxOpacity={.5} />
                                        </Pressable>
                                    </View>
                                </View>
                                {/* Box Body */}
                                <ScrollView style={{ height: height * .6 }} showsVerticalScrollIndicator={false}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.desciptionContainer}>
                                            <Icon name={'location-on'} size={height * .03} color='#5e5e5e' />
                                            <Text style={styles.desciptionHeading}>
                                                PROPERTY INFORMATION
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="Name*"
                                                placeholder="Enter Name"
                                                // value={text}
                                                onChangeText={text => console.log(text)}
                                                style={styles.input}
                                                mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red"
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="Address*"
                                                placeholder="Enter Address"
                                                style={styles.input}
                                                // value={text}
                                                onChangeText={text => console.log(text)}
                                                mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red"
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.desciptionContainer}>
                                            <Icon name={'folder-open'} size={height * .03} color='#5e5e5e' />
                                            <Text style={styles.desciptionHeading}>
                                                PORTFOLIO DETAILS
                                            </Text>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="BILLING COMPANY*"
                                                placeholder="ION Energy Solutions"
                                                value={'ION Energy Solutions'}
                                                // dense={true}
                                                onChangeText={text => console.log(text)}
                                                style={styles.input}
                                                mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red"
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="MANAGEMENT COMPANY*"
                                                placeholder="A1 Equities"
                                                style={styles.input}
                                                value={'A1 Equities'}
                                                onChangeText={text => console.log(text)}
                                                // dense={true}
                                                mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red"
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                label="CUSTOM ID*"
                                                placeholder="Company specific Id"
                                                style={styles.input}
                                                // value={'A1 Equities'}
                                                onChangeText={text => console.log(text)}
                                                // dense={true}
                                                mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red"
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.desciptionContainer}>
                                            <Icon name={'contact-mail'} size={height * .03} color='#5e5e5e' />
                                            <Text style={styles.desciptionHeading}>
                                                CONTACT INFO (OPTIONAL)
                                            </Text>
                                        </View>
                                        <View style={styles.contactInfoContainer}>
                                            <View style={styles.contactInfoInner}>
                                                <Icon name="account-box" size={height * 0.04} color="white" maxOpacity={.5} />
                                            </View>
                                            <TextInput
                                                // label="BILLING COMPANY*"
                                                placeholder="Contact Name"
                                                // value={'ION Energy Solutions'}
                                                onChangeText={text => console.log(text)}
                                                style={styles.contactInput}
                                                // mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red", background: '#F6F6F6',
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.contactInfoContainer}>
                                            <View style={styles.contactInfoInner}>
                                                <Tag name="tag" size={height * 0.04} color="white" maxOpacity={.5} />
                                            </View>
                                            <TextInput
                                                // label="BILLING COMPANY*"
                                                placeholder="Title or Job Description"
                                                // value={'ION Energy Solutions'}
                                                onChangeText={text => console.log(text)}
                                                style={styles.contactInput}
                                                // mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red", background: '#F6F6F6',
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.contactInfoContainer}>
                                            <View style={styles.contactInfoInner}>
                                                <Icon name="local-phone" size={height * 0.04} color="white" maxOpacity={.5} />
                                            </View>
                                            <TextInput
                                                // label="BILLING COMPANY*"
                                                placeholder="Phone"
                                                // value={'ION Energy Solutions'}
                                                onChangeText={text => console.log(text)}
                                                style={styles.contactInput}
                                                // mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red", background: '#F6F6F6',
                                                    }
                                                }}
                                            />
                                        </View>
                                        <View style={styles.contactInfoContainer}>
                                            <View style={styles.contactInfoInner}>
                                                <Icon name="mail-outline" size={height * 0.04} color="white" maxOpacity={.5} />
                                            </View>
                                            <TextInput
                                                // label="BILLING COMPANY*"
                                                placeholder="Email"
                                                // value={'ION Energy Solutions'}
                                                onChangeText={text => console.log(text)}
                                                style={styles.contactInput}
                                                // mode={"outlined"}
                                                theme={{
                                                    colors: {
                                                        text: '#25AAE1ec', primary: '#25AAE1ec', selectionColor: "red", background: '#F6F6F6',
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                                {/* Box Header */}
                                <View style={styles.boxHeader}>
                                    <View style={styles.bottonContainer}>
                                        <FAB
                                            onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })}
                                            style={styles.submitBotton}
                                            color='white'
                                            icon="check"
                                            // loading={false}
                                            label="Submit"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }
}