import React, {Component, version} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Platform,
} from 'react-native';

//Packages
import LinearGradient from 'react-native-linear-gradient';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Properties from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/EvilIcons';
import Back from 'react-native-vector-icons/MaterialIcons';
import Build from 'react-native-vector-icons/FontAwesome5';
import Home from 'react-native-vector-icons/FontAwesome5';
import {TextInput, Button} from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import ContextProp from './Context/propContext';
import clc from 'cli-color';
import CustumStatusBar from '../../components/StatusBar';

// Components
import Add from './Form';

import styles from './style';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import Filter from './Filter';
import Modal from 'react-native-modal';
const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      meter: false,
      isVisible: false,
      Loading: false,
      loadScreen: false,
      stopLoader: false,
      currentIndex: null,
      propertyList: null,
      showFilter: false,
      showSearch: false,
      filterWork: false,
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

  handleLoader = (child) => {
    this.setState({loadScreen: true});
  };
  selectedProp = (prop) => {
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
      <Properties
        name="home-city-outline"
        size={width * 0.09}
        color="#115b72"
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
      />
    </TouchableOpacity>
  );

  _renderPropList = (prop) => {
    if (
      prop.index == this.context.propList.length - 1 &&
      !this.state.stopLoader
    ) {
      this.setState({stopLoader: true});
      // console.log(clc.green('agayayaaa_____'));
      this.setState({Loading: false});
    }
    return (
      <View
        style={{
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.propButton}
          onPress={() => this.selectedProp(prop)}>
          <Properties
            name="home-city-outline"
            size={width * 0.09}
            color="#115b72"
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
          <View style={{flexDirection: 'row'}}>
            <View style={styles.buildUnitCountContainer}>
              <Build name="building" size={width * 0.04} color="#115b72" />
              <Text style={styles.buildUnitCount}>
                {prop.item.building_count}
              </Text>
            </View>
            <View style={styles.buildUnitCountContainer}>
              <Home name="house-user" size={width * 0.04} color="#115b72" />
              <Text style={styles.buildUnitCount}>{prop.item.unit_count}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {prop.index === this.state.currentIndex ? (
          <View style={styles.dropView}>
            <TouchableOpacity
              onPress={() => this.jumpToDetail({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={styles.linearGradient}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text style={styles.gradienttext}>Property Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.jumpToEquip({prop, item: prop})}>
              <LinearGradient
                colors={['#09BAF2', '#115b72', '#0d3744']}
                style={styles.linearGradient}
                start={{x: 0.1, y: 1}}
                end={{x: 1.5, y: 3}}>
                <Text style={styles.gradienttext}>Property Units</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    if (!this.context.isLoading && this.state.loadScreen) {
      this.setState({loadScreen: false});
      this.setState({Loading: true});
    }
    if (!this.context.filterWork && this.state.filterWork) {
      this.setState({filterWork: false});
    }
    return (
      <>
        <CustumStatusBar />
        <View style={styles.container}>
          {this.context.isLoading ? <Loader /> : null}
          {/* <StatusBar hidden backgroundColor="white" barStyle="dark-content" /> */}
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
                  style={styles.searchButton}
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
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.openFilter}
                  style={styles.filterButton}>
                  <FilterIcon
                    name="filter-outline"
                    color={this.state.filterWork ? '#25AAE1ec' : 'black'}
                    size={20}
                  />
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
              filterWork={() => this.setState({filterWork: true})}
            />
            {this.state.showSearch ? (
              <Modal
                isVisible={this.state.showSearch}
                style={styles.searchModalContainer}>
                {Platform.OS == 'ios' && (
                  <CustumStatusBar backColor transparent />
                )}
                <View style={styles.searchModalInner}>
                  <View style={styles.searchModalInput}>
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
                  <View style={styles.searchModalButtons}>
                    {this.context.searchLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={this.closeAndClear}>
                    <Close name="close" color="white" size={20} />
                  </TouchableOpacity>
                </View>
                <View style={styles.searchList}>
                  <FlatList
                    style={{marginBottom: width * 0.2}}
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
          <View style={styles.propertyList}>
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
      </>
    );
  }
}
