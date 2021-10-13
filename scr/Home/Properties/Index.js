import React, {Component, version} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Build from 'react-native-vector-icons/Ionicons';
import {TextInput, Button} from 'react-native-paper';
import ContextProp from './Context/propContext';
import clc from 'cli-color';

// Components
import {Fonts} from '../../utils/fonts';
import Add from './Form';

import styles from './style';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import {NavigationEvents} from 'react-navigation';
const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      isSelected: true,
      meter: false,
      isVisible: false,
      animatedValue: new Animated.Value(0),
      Loading: false,
      loadScreen: false,
      stopLoader: false,
      currentIndex: null,
      propertyList: null,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
    this.setState({loadScreen: true});
  }

  onFocusFunction = () => {
    this.setState({loadScreen: true});
    this.context.getToken();
    this.setState({propertyList: this.context.propList});
  };

  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };
  changeAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  changeLayoutMeter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      meter: !this.state.meter,
      meterDown: !this.state.meterDown,
      animatedValue: new Animated.Value(0),
    });
    setTimeout(() => {
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 10);
  };
  jumpToDetail = ({prop, item}) => {
    this.props.navigation.navigate('Detail', {item});
    this.selectedProp(prop);
  };
  jumpToEquip = ({prop, item}) => {
    this.props.navigation.navigate('Equip', {item});
    this.selectedProp(prop);
  };
  jumpToSettings = (prop) => {
    this.props.navigation.navigate('Setting');
    this.selectedProp(prop);
  };
  handleLoader = (child) => {
    this.setState({loadScreen: true});
  };
  selectedProp = (prop) => {
    // this.context.profileWeGet(prop.index)

    this.setState({
      currentIndex: prop.index === this.state.currentIndex ? null : prop.index,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  LoadData = () => {
    console.log('End reached');
    this.context.loadMoreData();
  };

  cleardata = (prop) => {
    this.jumpToDetail({prop, item: prop});
    this.context.clearData();
  };

  _renderPropList = (prop) => {
    if (
      prop.index == this.context.propList.length - 1 &&
      !this.state.stopLoader
    ) {
      this.setState({stopLoader: true});
      console.log(clc.green('agayayaaa_____'));
      this.setState({Loading: false});
    }
    // console.log('prop---->',prop)
    return (
      <View
        style={{
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.propButton}
          onPress={() => this.selectedProp(prop)}>
          <Build
            name="md-business-outline"
            size={height * 0.04}
            color="#115b72"
            style={styles.logoShadowStyle}
          />
          <View style={{width: width * 0.6}}>
            <Text style={styles.propText}>
              {prop.item.name == null ? 'Untitled' : prop.item.name}
            </Text>
          </View>
          <Signal
            name="signal-cellular-outline"
            size={height * 0.04}
            color="#115b72"
            style={styles.logoShadowStyle}
          />
        </TouchableOpacity>
        {prop.index === this.state.currentIndex ? (
          <View style={styles.dropView}>
            <TouchableOpacity onPress={() => this.cleardata(prop)}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={{
                  height: height * 0.15,
                  paddingHorizontal: width * 0.02,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: width * 0.003,
                }}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text
                  style={{
                    fontFamily: Fonts.Handlee,
                    fontSize: height * 0.03,
                    color: 'white',
                  }}>
                  Property Profile
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.jumpToEquip({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={{
                  height: height * 0.15,
                  paddingHorizontal: width * 0.02,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: width * 0.003,
                }}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text
                  style={{
                    fontFamily: Fonts.Handlee,
                    fontSize: height * 0.03,
                    color: 'white',
                  }}>
                  Property Units
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    console.log('Component is re-rendered');
    if (!this.context.isLoading && this.state.loadScreen) {
      console.log('Condition Success');
      this.setState({loadScreen: false});
      this.setState({Loading: true});
    }

    return (
      <View style={styles.container}>
        {this.context.isLoading || this.state.loadScreen ? <Loader /> : null}
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.menuView}>
              <Back
                size={width * 0.08}
                color="white"
                name="keyboard-backspace"
              />
            </TouchableOpacity>
            <View style={styles.searchView}>
              <Search
                name="search"
                size={height * 0.04}
                style={{marginLeft: width * 0.05}}
                color="white"
              />
              <TextInput
                underlineColor="transparent"
                dense={true}
                placeholderTextColor="white"
                placeholder="Search"
                style={styles.search}
                onChangeText={(e) => this.setState({currentWei: e})}
                theme={{
                  colors: {
                    text: 'white',
                    primary: '#25dAE1',
                    selectionColor: 'transparent',
                    background: 'transparent',
                  },
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <Add loader={this.handleLoader} />
        </View>
        <View
          style={{
            flex: 1,
            // height: height * 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: height * 0.005,
          }}>
          <FlatList
            data={this.context.propList}
            renderItem={this._renderPropList}
            removeClippedSubviews={false}
            maxToRenderPerBatch={150}
            windowSize={100}
            keyExtractor={(item) => item.propertyid}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={() =>
            //   this.state.Loading ? (
            //     <ActivityIndicator color="#25dAE1" size="large" />
            //   ) : null
            // }
            onEndReachedThreshold={10}
            // onEndReached={this.LoadData}
          />
        </View>
      </View>
    );
  }
}
