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
  ActivityIndicator,
  TouchableWithoutFeedback,
  // TextInput,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Build from 'react-native-vector-icons/Ionicons';
import {TextInput, Button} from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import ContextProp from './Context/propContext';
import clc from 'cli-color';

// Components
import {Fonts} from '../../utils/fonts';
import Add from './Form';

import styles from './style';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import Filter from './Filter';
import Modal from 'react-native-modal';
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
      showFilter: false,
      showSearch: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
  }

  onFocusFunction = () => {
    this.setState({loadScreen: true});
    this.context.checkData();
    this.setState({propertyList: this.context.propList});
  };

  openFilter = () => {
    this.context.getBillingCompany();
    this.setState({showFilter: true});
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
    this.setState({showSearch: false});
  };
  jumpFromSearch = ({prop, item}) => {
    this.props.navigation.navigate('Detail', {item});
    this.setState({showSearch: false});
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

  LoadData = async () => {
    // console.log('End reached');
    await this.context.loadMoreData();
  };

  cleardata = (prop) => {
    this.jumpToDetail({prop, item: prop});
    this.context.clearData();
  };

  closeAndClear = () => {
    this.setState({showSearch: false});
    this.context.clearSearchList();
  };
  openAndClear = () => {
    this.setState({showSearch: true});
    this.context.clearSearchList();
  };

  _renderSearchPropList = (prop) => (
    <TouchableOpacity
      style={styles.propButton}
      onPress={() => this.jumpFromSearch({prop, item: prop})}>
      <Build
        name="md-business-outline"
        size={width * 0.09}
        color="#115b72"
        style={styles.logoShadowStyle}
      />
      <View>
        <View style={{width: width * 0.6}}>
          <TextTicker
            style={styles.propText}
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.6}>
            {prop.item.name == null ? 'Untitled' : prop.item.name}
          </TextTicker>
        </View>

        <View style={{width: width * 0.6}}>
          <TextTicker
            style={{color: 'gray'}}
            duration={6000}
            marqueeDelay={2000}
            repeatSpacer={width * 0.6}>
            {(prop.item.street == null ? '' : prop.item.street + ', ') +
              (prop.item.st == null ? '' : prop.item.st + ', ') +
              (prop.item.city == null ? '' : prop.item.city + ', ') +
              (prop.item.zipcode == null ? '' : prop.item.zipcode)}
          </TextTicker>
        </View>
      </View>

      <Signal
        name="signal-cellular-outline"
        size={height * 0.04}
        color="#115b72"
        style={styles.logoShadowStyle}
      />
    </TouchableOpacity>

    // <TouchableOpacity
    //   style={styles.propButton}
    //   onPress={() => this.jumpFromSearch({prop, item: prop})}>
    //   <Build
    //     name="md-business-outline"
    //     size={height * 0.04}
    //     color="#115b72"
    //     style={styles.logoShadowStyle}
    //   />
    //   <View style={{width: width * 0.6}}>
    //     <Text style={styles.propText}>
    //       {prop.item.name == null ? 'Untitled' : prop.item.name}
    //     </Text>
    //   </View>
    //   <Signal
    //     name="signal-cellular-outline"
    //     size={height * 0.04}
    //     color="#115b72"
    //     style={styles.logoShadowStyle}
    //   />
    // </TouchableOpacity>
  );

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
          // backgroundColor:'red'
        }}>
        <TouchableOpacity
          style={styles.propButton}
          onPress={() => this.selectedProp(prop)}>
          <Build
            name="md-business-outline"
            size={width * 0.09}
            color="#115b72"
            style={styles.logoShadowStyle}
          />
          <View>
            <View style={{width: width * 0.6}}>
              <TextTicker
                style={styles.propText}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.6}>
                {prop.item.name == null ? 'Untitled' : prop.item.name}
              </TextTicker>
            </View>

            <View style={{width: width * 0.6}}>
              <TextTicker
                style={{color: 'gray'}}
                duration={6000}
                marqueeDelay={2000}
                repeatSpacer={width * 0.6}>
                {(prop.item.street == null ? '' : prop.item.street + ', ') +
                  (prop.item.st == null ? '' : prop.item.st + ', ') +
                  (prop.item.city == null ? '' : prop.item.city + ', ') +
                  (prop.item.zipcode == null ? '' : prop.item.zipcode)}
              </TextTicker>
            </View>
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
            <TouchableOpacity
              onPress={() => this.jumpToDetail({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={{
                  width: width * 0.5,
                  height: height * 0.15,
                  // paddingHorizontal: width * 0.02,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: width * 0.003,
                }}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text
                  style={{
                    fontFamily: Fonts.Handlee,
                    fontSize: width * 0.055,
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
                  width: width * 0.5,
                  height: height * 0.15,
                  // paddingHorizontal: width * 0.02,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: width * 0.003,
                }}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text
                  style={{
                    fontFamily: Fonts.Handlee,
                    fontSize: width * 0.055,
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
    // console.log('Component is re-rendered');
    if (!this.context.isLoading && this.state.loadScreen) {
      // console.log('Condition Success');
      this.setState({loadScreen: false});
      this.setState({Loading: true});
    }

    return (
      <View style={styles.container}>
        {this.context.isLoading ? <Loader /> : null}
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
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: height * 0.08,
                }}
                onPress={this.openAndClear}>
                <Search
                  name="search"
                  size={height * 0.04}
                  style={{marginLeft: width * 0.05}}
                  color="white"
                />
                <TextInput
                  disabled={true}
                  underlineColor="transparent"
                  dense={true}
                  placeholderTextColor="white"
                  placeholder="Search"
                  style={styles.search}
                  onChangeText={(e) => this.context.searchProperties(e)}
                  theme={{
                    colors: {
                      text: 'white',
                      primary: '#25dAE1',
                      selectionColor: 'transparent',
                      background: 'transparent',
                    },
                  }}
                  // onFocus={() =>
                  //   this.setState({showSearch: true})
                  // }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.openFilter}
                style={styles.filterButton}>
                <FilterIcon name="filter-outline" color="#25AAE1ec" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.headingContainer}>
          <Add loader={this.handleLoader} />
          <Filter
            type="Properties"
            isVisible={this.state.showFilter}
            close={() => this.setState({showFilter: !this.state.showFilter})}
          />
          {this.state.showSearch ? (
            <Modal
              isVisible={this.state.showSearch}
              style={{
                elevation: width * 0.005,
                width: width * 1,
                height: height * 1,
                justifyContent: 'flex-start',
                left: '-5%',
                top: '-2.5%',
                // maxHeight: height * 1,
                // maxWidth: width * 1,
              }}>
              <View
                style={{
                  width: width * 1,
                  height: height * 0.08,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  backgroundColor: '#25AAE1ec',
                  // borderRadius: width * 0.1,
                  elevation: width * 0.01,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Search name="search" size={height * 0.04} color="white" />
                  <TextInput
                    underlineColor="transparent"
                    autoFocus={true}
                    dense={true}
                    placeholderTextColor="white"
                    placeholder="Search"
                    style={styles.search}
                    onChangeText={(e) => this.context.searchProperties(e)}
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
                <View
                  style={{
                    width: width * 0.05,
                  }}>
                  {this.context.searchLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : null}
                </View>
                <TouchableOpacity onPress={this.closeAndClear}>
                  <Close name="close" color="white" size={20} />
                </TouchableOpacity>
              </View>
              <View
                style={{alignItems: 'center', paddingVertical: height * 0.005}}>
                <FlatList
                  data={this.context.searchList}
                  renderItem={this._renderSearchPropList}
                  removeClippedSubviews={false}
                  maxToRenderPerBatch={150}
                  windowSize={100}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={width * 0.001}
                  onEndReached={this.context.loadSearchData}
                />
              </View>
            </Modal>
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            // height: height * 0.6,
            width: width * 1,
          }}>
          <FlatList
            data={this.context.propList}
            renderItem={this._renderPropList}
            removeClippedSubviews={false}
            maxToRenderPerBatch={150}
            windowSize={100}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() =>
              this.context.listLoader ? (
                <ActivityIndicator color="#25dAE1" size="large" />
              ) : null
            }
            onEndReachedThreshold={width * 0.0001}
            onEndReached={() => this.LoadData()}
          />
        </View>
      </View>
    );
  }
}
