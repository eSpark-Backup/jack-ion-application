import React, {Component, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';
import DropDown from 'react-native-vector-icons/FontAwesome';
import {Icon, IconToggle} from 'react-native-material-ui';
import Base_URL from '../../../scr/api/WebServices';
import Modal from 'react-native-modal';
import {Header} from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen';
import styles from './FilterStyle';
import {RadioButton} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import ContextProp from './Context/propContext';
import {create} from 'apisauce';

const {width, height} = Dimensions.get('window');
let api;

export default class Splash extends Component {
  static contextType = ContextProp;
  constructor() {
    super();
    this.state = {
      showList: false,
      token: '',
      billCompanies: [],
      selectedType: '',
      utilityTypes: [
        {
          id: 1,
          type: 'all-water',
          img: require('../../../Images/all-waters.png'),
        },
        {
          id: 2,
          type: 'cold water',
          img: require('../../../Images/cold-water.png'),
        },
        {
          id: 3,
          type: 'hot water',
          img: require('../../../Images/hot-water.png'),
        },
        {
          id: 4,
          type: 'electric',
          img: require('../../../Images/electric.png'),
        },
        {
          id: 5,
          type: 'gas',
          img: require('../../../Images/gass.png'),
        },
      ],
      biller: '---',
      buildingName: '',
      unitName: '',
      serial: '',
    };
  }
  getUtilityType = (type) => {
    this.setState({selectedType: type});
  };

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      this.setState({token: token});
      api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      this.getBillingCompany();
    }
  };

  getBillingCompany = () => {
    this.context.getBillingCompany();
    this.setState({billCompanies: this.context.propitemList});
    this.setState({showList: true});
  };

  //  [biller, setBiller] = useState(billing[0].name);
  componentDidMount() {
    this.context.getBillingCompany();
    SplashScreen.hide();
  }

  listSelection = (val) => {
    this.setState({biller: val});
  };

  cancelButton = () => {
    this.setState({showList: false});
    this.setState({biller: this.context.biller});
  };

  filter = () => {
    if (this.props.type == 'Properties') {
      let data = {
        offset: 0,
        billing: this.state.biller,
        managment: '',
      };
      this.context.filterData(data);
      this.setState({showList: false});
    } else {
      let data = {
        offset: 0,
        billing: this.state.biller,
        managment: '',
      };
      this.context.filterData(data);
      this.setState({showList: false});
    }
  };

  onFocusFunction = () => {
    this.context.getToken();
    this.props.close();
    this.setState({biller: ''});
  };

  render() {
    const {isVisible, close, type} = this.props;
    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          // avoidKeyboard={true}
          isVisible={isVisible}>
          <View style={styles.modalInner}>
            <View style={styles.boxConatainer}>
              <View style={styles.boxInner}>
                {/* Box Header */}
                <Header
                  barStyle="dark-content"
                  leftComponent={{
                    text: 'Close',
                    style: {fontSize: width * 0.05, color: '#000'},
                    onPress: close,
                  }}
                  centerComponent={
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 20, color: '#18CADC'}}>
                        Filter
                      </Text>
                      {/* <Progress.Bar
                        progress={0.2}
                        borderWidth={1}
                        borderColor="#e1e1e1"
                        color={0.2 == 1 ? '#1ED257' : '#18CADC'}
                        width={width * 0.8}
                        height={height * 0.01}
                        style={{marginTop: 20}}
                      />
                      <Text style={{fontSize: width * 0.03}}>
                        13 of 13 Properties Remaining
                      </Text> */}
                    </View>
                  }
                  rightComponent={{
                    text: 'Reset',
                    style: {fontSize: width * 0.05, color: '#5c5c5ccf'},
                    onPress: () => this.onFocusFunction(),
                  }}
                  backgroundColor="#fff"
                  containerStyle={{
                    borderBottomWidth: width * 0.003,
                    elevation: 1,
                  }}
                />
                <View style={{width: '100%'}}>
                  {type == 'Properties' ? (
                    <View style={styles.currentReadContainer}>
                      <View style={styles.filterHeading}>
                        <Text style={styles.filterListText}>
                          {type == 'Properties'
                            ? 'Portfolio Details'
                            : 'Details'}
                        </Text>
                      </View>
                      <View style={styles.filterLists}>
                        <Text style={styles.filterListText}>Billing</Text>
                        <TouchableOpacity
                          onPress={this.getBillingCompany}
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={{fontSize: width * 0.04}}>
                            {this.context.biller}
                          </Text>
                          <DropDown name="caret-down" size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  <View style={styles.currentReadContainer}>
                    <View style={styles.filterHeading}>
                      <Text style={styles.filterListText}>
                        {type == 'Properties' ? 'Property Details' : 'Details'}
                      </Text>
                    </View>
                    {type == 'Properties' ? (
                      <View style={styles.inputFilterView}>
                        <Text style={styles.filterListText}>Address:</Text>
                        <TextInput style={styles.filterInputs} />
                      </View>
                    ) : (
                      <View>
                        <View style={styles.inputFilterView}>
                          <Text style={styles.filterListText}>Building:</Text>
                          <TextInput
                            style={styles.filterInputs}
                            onChange={(e) => this.setState({buildingName: e})}
                          />
                        </View>
                        <View style={styles.inputFilterView}>
                          <Text style={styles.filterListText}>Unit:</Text>
                          <TextInput
                            style={styles.filterInputs}
                            onChange={(e) => this.setState({unitName: e})}
                          />
                        </View>
                        <View style={styles.inputFilterView}>
                          <Text style={styles.filterListText}>
                            Serial Number:
                          </Text>
                          <TextInput
                            style={styles.filterInputs}
                            onChange={(e) => this.setState({serial: e})}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.currentReadContainer}>
                    <View style={styles.filterHeading}>
                      <Text style={styles.filterListText}>Utility Types</Text>
                    </View>
                    <View style={styles.filterUtility}>
                      <FlatList
                        horizontal
                        data={this.state.utilityTypes}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => this.getUtilityType(item.type)}>
                            <Image
                              source={item.img}
                              resizeMode="contain"
                              style={{
                                height: width * 0.06,
                                width: width * 0.055,
                                marginHorizontal: width * 0.02,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                  <View style={styles.currentReadContainer}>
                    <View style={styles.filterHeading}>
                      <Text style={styles.filterListText}>Done Filteration</Text>
                    </View>
                    <View style={styles.filterUtility}>
                      <TouchableOpacity
                        onPress={() => this.getUtilityType(item.type)}>
                        <Text>Filter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.showList}
          style={{
            elevation: width * 0.005,
            borderRadius: width * 0.02,
            maxHeight: height * 1,
            maxWidth: width * 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: width * 0.5,
              height: height * 0.35,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: width * 0.02,
                elevation: width * 0.02,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: width * 0.02,
                  elevation: width * 0.02,
                  alignItems: 'center',
                  width: width * 0.45,
                  height: height * 0.3,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '20%',
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    paddingLeft: width * 0.05,
                  }}>
                  <Text style={{fontSize: width * 0.04}}>Billing</Text>
                </View>
                <View style={{width: '100%', height: '60%'}}>
                  <ScrollView>
                    {this.state.billCompanies.map((item) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginVertical: height * 0.005,
                        }}>
                        <RadioButton
                          value={item.name}
                          status={
                            this.state.biller === item.name
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => this.listSelection(item.name)}
                        />
                        <Text>{item.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '20%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderTopWidth: 0.5,
                    paddingRight: width * 0.03,
                  }}>
                  <TouchableOpacity onPress={this.cancelButton}>
                    <Text
                      style={{
                        fontSize: width * 0.032,
                        marginHorizontal: 5,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color: '#18CADC',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.filter}>
                    <Text
                      style={{
                        fontSize: width * 0.032,
                        marginHorizontal: 5,
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color: '#18CADC',
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
