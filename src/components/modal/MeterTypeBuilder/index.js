import React, { Component, Fragment, version } from 'react';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { Fonts } from '../../../utils/fonts';

//Packages
import Base_URL from '../../../api/WebServices';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Menu as MenuT, MenuItem, MenuDivider } from 'react-native-material-menu';

import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, Button, FAB, HelperText } from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';
import EncryptedStorage from 'react-native-encrypted-storage';
import { create } from 'apisauce';

// Components

import styles from './style';
const { width, height } = Dimensions.get('window');
let manufacturers = [
  {
    id: 1,
    name: 'AMCO',
  },
  {
    id: 2,
    name: 'Badger',
  },
  {
    id: 3,
    name: 'Conservice',
  },
];
const models = [
  {
    id: 1,
    name: 'C4000 Digital Compound (AMCO Bypass)',
  },
  {
    id: 2,
    name: 'Compound RTR',
  },
  {
    id: 3,
    name: 'MJ09 Brass',
  },
];
export default class MeterTypeBuilder extends Component {

  state = {
    meterTypeInputs: [
      {
        name: 'MANUFACTURER*',
        showList: false,
        input: '',
        error: '',
      },
      {
        name: 'MODEL*',
        showList: false,
        input: '',
        error: '',
      },
      // {
      //   name: 'SIZE*',
      //   showList: false,
      //   input: '',
      // },
      {
        name: 'MULTIPLIER*',
        showList: false,
        input: '1',
        error: '',
      },
      {
        name: 'UNIT OF MEASURE*',
        showList: false,
        input: '',
        error: '',
      },
    ],
    // measureOfUnit: [],
    measureOfUnitName: '',
    meterTypeData: {
      manufacturer: '',
      model: '',
      multiplier: 1,
      unit_of_measure_id: '',
    },
    meterListData: [],

  }
  getToken = async () => {

  };
  onChangeTypeBuilder = (e, index) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.value);
    let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
    newArr[index].input = e; // replace e.target.value with whatever you want to change it to
    this.setState({ meterTypeInputs: newArr }, () =>
      console.log('e--->', this.state.meterTypeInputs),
    );
    if (index == 0) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, manufacturer: e },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 1) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, model: e },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 2) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, multiplier: Number(e) },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 3) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, unit_of_measure_id: e },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
  };
  hideSuggestion = (index, val, name) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;
    newArr[index].input = val;
    newArr[index].error = '';
    this.setState({ meterTypeInputs: newArr }, () =>
      console.log('Meter Type', this.state.meterTypeInputs),
    );
    if (index == 0) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, manufacturer: val },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 1) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, model: val },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 2) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, multiplier: val },
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
    if (index == 3) {
      this.setState(
        {
          meterTypeData: { ...this.state.meterTypeData, unit_of_measure_id: val },
          measureOfUnitName: name,
        },
        () => console.log('Meter Type', this.state.meterTypeData),
      );
    }
  };
  showSuggestion = (index) => {
    let newArr = [...this.state.meterTypeInputs];
    newArr[index].showList = !newArr[index].showList;

    this.setState({ meterTypeInputs: newArr });
  };
  handleSaveMeterTypeBuilder = async () => {
    if (!this.state.meterTypeData.manufacturer) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({ meterTypeInputs: newArr });
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[0].error = 'Select manufacturer'; // replace e.target.value with whatever you want to change it to
      this.setState({ meterTypeInputs: newArr });
      return;
    }
    if (!this.state.meterTypeData.model) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({ meterTypeInputs: newArr });
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[1].error = 'Select model'; // replace e.target.value with whatever you want to change it to
      this.setState({ meterTypeInputs: newArr });
      return;
    }
    if (!this.state.meterTypeData.multiplier) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({ meterTypeInputs: newArr });
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[2].error = 'This should be greater then one '; // replace e.target.value with whatever you want to change it to
      this.setState({ meterTypeInputs: newArr });
      return;
    }
    if (!this.state.meterTypeData.unit_of_measure_id) {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({ meterTypeInputs: newArr });
      });
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      newArr[3].error = 'Select measure of unit '; // replace e.target.value with whatever you want to change it to
      this.setState({ meterTypeInputs: newArr });
      return;
    } else {
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
        this.setState({ meterTypeInputs: newArr });
      });
      console.log('measureOfUnit Of_______', this.state.meterTypeData);
      const token = await EncryptedStorage.getItem('user_token');
      if (token != null) {
        // console.log('token aya', token);
        // this.setState({token: token});
        this.api = create({
          baseURL: Base_URL,
          headers: {Authorization: 'Bearer ' + token},
        });
        }
      const unitResponse = await this.api.post(
        `/property/equipment/type/add-type`,
        this.state.meterTypeData,
      );
      console.log('addtype response--->', unitResponse);
      if (unitResponse?.ok) {
      this.setState({ measureOfUnit: unitResponse?.data?.data }, () =>
      console.log('measureOfUnit Of_______', this.state.measureOfUnit),
      );
      this.setState((prevState) => ({
        ...prevState,
        meterTypeData: {
          // object that we want to update
          ...prevState.meterTypeData, // keep all other key-value pairs
          manufacturer: '',
          model: '',
          multiplier: 1,
          unit_of_measure_id: '', // update the value of specific key
        },
        measureOfUnitName: '',
      }),
        () => this.props.meterTypeSelect({ 
          name: 
          unitResponse?.data?.data?.type?.model +
          '(x' +
          unitResponse?.data?.data?.type?.multiplier +
          unitResponse?.data?.data?.type?.unit_of_measure +
          ')',
          id:unitResponse?.data?.data?.type?.id
        }));
      this.state.meterTypeInputs.map((item, index) => {
        let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
        if (index != 2) {
          newArr[index].input = ''; // replace e.target.value with whatever you want to change it to
        } else {
          newArr[index].input = '1';
        }
        this.setState({ meterTypeInputs: newArr });
      });
      } else {
        alert('Network error');
      }
    }
  };

  meterTypeClose = () => {
    // this.setState({
    //   isModalMeterVisible: false,
    //   measureOfUnitName: '',
    // });
    this.setState((prevState) => ({
      ...prevState,
      meterTypeData: {
        // object that we want to update
        ...prevState.meterTypeData, // keep all other key-value pairs
        manufacturer: '',
        model: '',
        multiplier: 1,
        unit_of_measure_id: '', // update the value of specific key
      },
      measureOfUnitName: '',
    }),
    () => this.props.onCancel(false)
    );
    this.state.meterTypeInputs.map((item, index) => {
      let newArr = [...this.state.meterTypeInputs]; // copying the old datas array
      if (index != 2) {
        newArr[index].input = ''; // replace e.target.value with whatever you want to change it to
      } else {
        newArr[index].input = '1';
      }
      newArr[index].error = ''; // replace e.target.value with whatever you want to change it to
      this.setState({ meterTypeInputs: newArr });
    });
  };
  render() {
    const {
      title,
      style,
      isVisible,
      onCancel,
      children,
      doneBtnTitle,
      onDone,
      measureOfUnit
    } = this.props;


    const { meterTypeInputs } = this.state;
    return (

      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        isVisible={isVisible}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalInner}>
            <View style={[styles.boxConatainer, style]}>
              <View style={styles.boxInner}>
                {/* Box Header */}
                <View style={styles.boxHeader}>
                  <View style={styles.boxHeaderInner}>
                    <Icon
                      name={'business'}
                      size={height * 0.05}
                      color="#5e5e5e"
                    />
                    <Text style={styles.modalHeading}>{title}</Text>
                    <Pressable
                      onPress={this.meterTypeClose}
                      android_ripple={{
                        color: 'black',
                        borderless: true,
                        radius: width * 0.03,
                      }}>
                      <Icon
                        name="cancel"
                        size={height * 0.035}
                        color="black"
                        maxOpacity={0.5}
                      />
                    </Pressable>
                  </View>
                </View>
                {/* Box Body */}
                {/* //TodoY: Meter Box Body */}
                <View
                  style={{
                    height: height * 0.4,
                    overflow: 'hidden',
                  }}>
                  {meterTypeInputs.map((item, index) => {
                    return (
                      <View>
                        {index < 2 ? (
                          <View>
                            {/* <View style={styles.desciptionContainer}>
                                    <Text style={styles.desciptionHeading}>
                                      {item.name}
                                    </Text>
                                  </View> */}
                            <SearchableDropdown
                              onItemSelect={(item, indexy) => {
                                this.hideSuggestion(index, item.name);
                                console.log('kuch', indexy);
                              }}
                              containerStyle={{ padding: width * 0.03 }}
                              itemStyle={{
                                padding: width * 0.027,
                                // marginTop: width * 0.01,
                                backgroundColor: 'rgb(247, 247, 247)',
                                borderColor: '#bbb',
                                borderWidth: width * 0.0015,
                                borderRadius: width * 0.015,
                              }}
                              itemTextStyle={{ color: '#222' }}
                              itemsContainerStyle={{
                                maxHeight: height * 0.135,
                              }}
                              items={
                                index == 0 ? manufacturers : models
                              }
                              resetValue={false}
                              textInputProps={{
                                placeholder:
                                  index == 0
                                    ? 'Manufacturer*'
                                    : 'Models*',
                                underlineColorAndroid: 'transparent',
                                style: {
                                  padding: width * 0.027,
                                  margin: 0,
                                  borderColor: item.error
                                    ? '#A3001B'
                                    : 'black',
                                  borderWidth: width * 0.0019,
                                  borderRadius: width * 0.015,
                                },
                                onTextChange: (text) => {
                                  // console.log(text);
                                  this.onChangeTypeBuilder(text, index);
                                },
                                value: setTimeout(
                                  () => item.input,
                                  200,
                                ),
                                defaultValue: item.input,
                              }}
                              listProps={{
                                nestedScrollEnabled: true,
                                // renderItem: ({item, index}) => {
                                //   console.log(index);
                                //   return <Text>{item.name}</Text>;
                                // },
                              }}
                            />
                            {item.error ? (
                              <HelperText
                                type="error"
                                visible={item.error}>
                                {item.error}
                              </HelperText>
                            ) : null}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                  <View
                    style={{
                      height: height * 0.15,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      {meterTypeInputs.map((item, index) => {
                        return (
                          <View>
                            {index >= 2 ? (
                              <View>
                                <View
                                  style={{
                                    // height: height * 0.04,
                                    width: width * 0.38,
                                  }}>
                                  <Text
                                    style={styles.desciptionHeading}>
                                    {item.name}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.inputContainer,
                                    {
                                      width: width * 0.35

                                    },
                                  ]}>
                                  <MenuT
                                    visible={
                                      index == 3 ? item.showList : null
                                    }
                                    anchor={
                                      index == 2 ? (
                                        <View>
                                          <TextInput
                                            keyboardType={
                                              index == 2
                                                ? 'decimal-pad'
                                                : 'default'
                                            }
                                            value={item.input}
                                            dense={true}
                                            onFocus={() =>
                                              this.showSuggestion(index)
                                            }
                                            onChangeText={(text) =>
                                              this.onChangeTypeBuilder(
                                                text,
                                                index,
                                              )
                                            }
                                            style={[styles.input, {
                                              height: height * 0.058,
                                              width: width * 0.35
                                            }]}
                                            error={item.error}
                                            mode={'outlined'}
                                            theme={{
                                              colors: {
                                                text: '#25AAE1ec',
                                                primary: '#25AAE1ec',
                                                selectionColor: 'red',
                                              },
                                            }}
                                          />
                                          {item.error ? (
                                            <HelperText
                                              type="error"
                                              visible={item.error}>
                                              {item.error}
                                            </HelperText>
                                          ) : null}
                                        </View>
                                      ) : index == 3 ? (
                                        <View>
                                          <TouchableOpacity
                                            style={{
                                              backgroundColor:
                                                '#F6F6F6',
                                              justifyContent: 'center',
                                              borderColor: item.error
                                                ? 'red'
                                                : 'gray',
                                              width: width * 0.35,
                                              height: height * 0.061,
                                              borderWidth:
                                                width * 0.003,
                                              borderRadius:
                                                width * 0.01,
                                              paddingHorizontal:
                                                width * 0.03,
                                              marginTop: width * 0.014,
                                            }}
                                            onPress={() =>
                                              this.showSuggestion(index)
                                            }>
                                            <Text
                                              style={{
                                                color: '#25AAE1ec',
                                                textTransform:
                                                  'capitalize',
                                              }}>
                                              {index == 3
                                                ? this.state.measureOfUnitName
                                                : null}
                                            </Text>
                                          </TouchableOpacity>
                                          {item.error ? (
                                            <HelperText
                                              // style={{
                                              //   backgroundColor: 'red',
                                              // }}
                                              type="error"
                                              visible={item.error}>
                                              {item.error}
                                            </HelperText>
                                          ) : null}
                                        </View>
                                      ) : null
                                    }
                                    onRequestClose={() =>
                                      this.hideSuggestion(index)
                                    }>
                                    {index == 3
                                      ? measureOfUnit.map(
                                        (item) => (
                                          <MenuItem
                                            textStyle={
                                              styles.textCapitalize
                                            }
                                            onPress={() =>
                                              this.hideSuggestion(
                                                index,
                                                item.id,
                                                item.name,
                                              )
                                            }>
                                            {item.name}
                                          </MenuItem>
                                        ),
                                      )
                                      : null}
                                  </MenuT>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        // height: height * 0.1,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: height * 0.02,
                          color: 'black',
                          textTransform: 'capitalize',
                          fontFamily: Fonts.ComfortaaRegular,
                        }}>
                        {'1 Pulse = ' +
                          meterTypeInputs[2].input +
                          (this.state.measureOfUnitName
                            ? ` ${this.state.measureOfUnitName}`
                            : ' Select')}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Box Footer */}
                <View style={styles.footerBtn}>
                  <View style={styles.bottonContainer}>
                    <TouchableOpacity onPress={this.meterTypeClose}>
                      <View style={styles.cancelBotton}>
                        <Plus name="close" color="black" size={18} />
                        <Text style={{ color: 'black',fontFamily:Fonts.Montserrat }}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleSaveMeterTypeBuilder}>
                      <View style={styles.saveUnitBotton}>
                        <Plus name="plus" color="white" size={18} />
                        <Text style={{ color: 'white',fontFamily:Fonts.Montserrat }}>{doneBtnTitle}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
