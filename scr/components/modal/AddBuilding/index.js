import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  CheckBox,
  ScrollView,
  FlatList
} from 'react-native';

//Packages

import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Home from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon, IconToggle } from 'react-native-material-ui';
import { TextInput, Button, FAB, HelperText } from 'react-native-paper';
import { create } from 'apisauce';
import Base_URL from '../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
// Components

import styles from './style';
const { width, height } = Dimensions.get('window');
const api = create({ baseURL: Base_URL });

export default function AddbuildingModal({
  modalVisible,
  closeModal,
  propertyId,
  reRun,
  type,
  modalName
}) {
  const [meterListArray, setMeterListArray] = useState([]);
  const [state, setState] = useState({
    buildName: '',
    buildDescription: '',
    newUnit: 'Unit-0',
    unitsArray: [],
    autoIncrement: true,
  });
  const [error, setError] = useState({
    units: '',
    buildingName: '',
  });
  const getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('It Worked', token);
      api.setHeader('Authorization', 'Bearer ' + token);
    }
  };
  useEffect(() => {
    getLoopOfUnits();
    getToken();
  }, [modalVisible]);

  const getLoopOfUnits = (text) => {
    const n = text == undefined ? 10 : text;
    var int = state.newUnit;
    var str = state.newUnit;
    int = parseInt(int.match(/\d+/)) + 1;
    str = str.replace(/[0-9]/g, '');
    var loopData = [];
    var i;
    for (i = 0; i < n; i++) {
      loopData.push({
        name: str + '' + int,
      }),
        // (value = value + 1);
        int = int + 1;
    }
    setState((oldState) => ({
      ...oldState,
      unitsArray: loopData
    }));
  };

  const addInput = (value, i, vindex) => {
    console.log('vindex--->>', vindex)
    setState((oldState) => ({
      ...oldState,
      newUnit: value
    }));
    if (state.autoIncrement == true) {
      var intValue = value;
      var firstStr = value.split(parseInt(value.match(/\d+/)))[0];
      var lastStr = value.split(parseInt(value.match(/\d+/)))[1];
      var intValue = parseInt(intValue.match(/\d+/));

      let unitsArray = [...state.unitsArray];
      state.unitsArray.map((item, index) => {
        if (index >= i) {
          unitsArray[index] = {
            ...unitsArray[index],
            name: (firstStr != undefined ? firstStr : '') + (isNaN(intValue) ? '' : intValue) + (lastStr != undefined ? lastStr : ''),
          };
          setState((oldState) => ({
            ...oldState,
            unitsArray
          }));
          intValue = intValue + 1;
        }
      });
    } else {
      let unitsArray = [...state.unitsArray];
      unitsArray[i] = { ...unitsArray[i], name: value };
      setState((oldState) => ({
        ...oldState,
        unitsArray
      }));
    }
  };

  const _renderUnitList = ({ item, index }) => (
    <TextInput
      key={index}
      value={item.name}
      dense={true}
      onChangeText={(text, valueIndex) => {
        addInput(text, index, valueIndex);
      }}
      style={[styles.input, { alignSelf: 'center', fontSize: width * 0.03 }]}
      scrollEnabled={false}
      underlineColor="transparent"
      mode={'outlined'}
      theme={{
        colors: {
          text: '#25AAE1ec',
          primary: '#25AAE1ec',
          selectionColor: 'red',
        },
      }}
    />
  );

  const changeUtilityAndToggle = () => {
    setState((oldState) => ({
      ...oldState,
      buildName: '',
      buildDescription: '',
      newUnit: 'Unit-0',
      unitsArray: [],
    }));
    setError((oldState) => ({
      ...oldState,
      buildingName: '', // update the value of specific key
      units: '',
    }));
    closeModal()
  };


  const newBuilding = () => {
    if (state.buildName === '') {
      setError((oldState) => ({
        ...oldState,
        buildingName: 'Invalid Building Name'
      }));
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        buildingName: ''
      }));
    }
    if (state.unitsArray.length === 0) {
      setError((oldState) => ({
        ...oldState,
        units: 'Empty units',
      }));
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        units: '',
      }));
      var loopData = [];
      var i;
      for (i = 0; i < state.unitsArray.length; i++) {
        loopData.push({
          name: state.unitsArray[i].name,
        });
      }
      // console.log('looppdata--->',loopData)

      handleAddbuildingApi({
        name: state.buildName,
        property_id: propertyId,
        units: loopData,
        descriptions: state.buildDescription,
      })
    }
  };

  const handleAddbuildingApi = async (data) => {
    console.log('check data-->', data)
    const unitResponse = await api.post(`/property/equipment/building/add-building`, data);
    console.log('buildResponse--->', unitResponse)
    if (unitResponse?.data?.bool) {
      changeUtilityAndToggle()
      reRun()
    } else {
      alert(unitResponse?.data?.message)
    }
  };

  return (
    <Modal
      animationIn="slideInDown"
      animationOut="slideOutUp"
      hasBackdrop={true}
      backdropColor="black"
      isVisible={modalVisible}
    // isVisible={true}
    >
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.modalInner}>
          <View
            style={[
              styles.boxConatainer,
              {
                height: height * 0.55,
              },
            ]}>
            <View style={styles.boxInner}>
              {/* Box Header */}
              <View style={styles.boxHeader}>
                <View style={styles.boxHeaderInner}>
                  <Icon
                    name={'business'}
                    size={height * 0.05}
                    color="#5e5e5e"
                  />
                  <Text style={styles.modalHeading}>{modalName}</Text>
                  <Pressable
                    onPress={changeUtilityAndToggle}
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
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Building Name"
                    error={error.buildingName}
                    onChangeText={(text) => {
                      setError((oldState) => ({
                        ...oldState,
                        buildingName: ''
                      }));
                      setState((oldState) => ({
                        ...oldState,
                        buildName: text
                      }));
                    }}
                    style={styles.input}
                    mode={'outlined'}
                    theme={{
                      colors: {
                        text: '#25AAE1ec',
                        primary: '#25AAE1ec',
                        selectionColor: 'red',
                      },
                    }}
                  />
                </View>
                {error.buildingName ? (
                  <HelperText
                    type="error"
                    visible={error.buildingName}>
                    {error.buildingName}
                  </HelperText>
                ) : null}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Building Description"
                    onChangeText={(text) => {
                      setState((oldState) => ({
                        ...oldState,
                        buildDescription: text
                      }));
                    }}
                    style={styles.input}
                    mode={'outlined'}
                    theme={{
                      colors: {
                        text: '#25AAE1ec',
                        primary: '#25AAE1ec',
                        selectionColor: 'red',
                      },
                    }}
                  />
                </View>
                <View style={styles.desciptionContainer}>
                  <Home
                    name={'house-user'}
                    size={height * 0.02}
                    color="#5e5e5e"
                  />
                  <Text style={styles.desciptionHeading}>
                    # OF UNITS
                  </Text>
                </View>
                <View
                  style={{
                    width: width * 0.8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width * 0.75,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <TextInput
                      keyboardType="numeric"
                      error={error.units}
                      placeholder="# of Units"
                      onChangeText={(text) => {
                        setError((oldState) => ({
                          ...oldState,
                          units: '',
                        }));
                        getLoopOfUnits(text);
                      }}
                      style={{
                        width: width * 0.35,
                        fontSize: height * 0.018,
                      }}
                      scrollEnabled={false}
                      mode={'outlined'}
                      theme={{
                        colors: {
                          text: '#25AAE1ec',
                          primary: '#25AAE1ec',
                          selectionColor: 'red',
                        },
                      }}
                    />
                    <CheckBox
                      value={state.autoIncrement}
                      onValueChange={() =>
                        setState((oldState) => ({
                          ...oldState,
                          autoIncrement: !state.autoIncrement
                        }))}
                    />
                    <Text style={{ fontSize: width * 0.035 }}>
                      Auto Increment
                    </Text>
                  </View>
                </View>
                {error.units ? (
                  <HelperText
                    type="error"
                    visible={error.units}>
                    {error.units}
                  </HelperText>
                ) : null}
                <FlatList
                  data={state.unitsArray}
                  // initialNumToRender={this.state.noOfUnits}
                  renderItem={(item, index) =>
                    _renderUnitList(item, index)
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
              {/* Box Footer */}
              <View style={styles.footerBtn}>
                <View style={styles.addUnitBtnContainer}>
                  <TouchableOpacity onPress={changeUtilityAndToggle}>
                    <View style={styles.cancelBotton}>
                      <Plus name="close" color="black" size={18} />
                      <Text style={{ color: 'black' }}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={newBuilding}>
                    <View style={styles.submitBotton}>
                      <Plus name="plus" color="white" size={18} />
                      <Text style={{ color: 'white' }}>Add Building</Text>
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
