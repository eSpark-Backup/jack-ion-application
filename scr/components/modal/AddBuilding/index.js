import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Keyboard,
  LogBox,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
//Packages

import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import Home from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';
// Components

import styles from './style';
import API from '../../../api/SeviceApi';
import {useDispatch} from 'react-redux';
import {fetchPropetry} from '../../../Store/Action/properties.action';
import TextReuseableComponent from '../../Text/index';
const {width, height} = Dimensions.get('window');

export default function AddbuildingModal({
  modalVisible,
  closeModal,
  propertyId,
  reRun,
  type,
  modalName,
  lastUnitName,
  buildData,
  unitCount,
  unitActualCount,
  unitMixeId,
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
    getLoopOfUnits();
  };
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      newUnit: lastUnitName == undefined ? 'Unit-0' : lastUnitName,
      buildName:
        type == 'Multiple'
          ? buildData.buildingName == undefined
            ? ''
            : buildData.buildingName
          : '',
      buildDescription:
        type == 'Multiple'
          ? buildData.buildDes == undefined
            ? ''
            : buildData.buildDes
          : '',
    }));
    getToken();
  }, [modalVisible]);
  // useEffect(() => {
  // }, [state.newUnit]);

  console.log('unitMixeId', unitMixeId);

  const getLoopOfUnits = (text) => {
    const n = text == undefined ? 10 : text;
    var initialValue = lastUnitName == undefined ? state.newUnit : lastUnitName;
    var intValue = initialValue;
    var firstStr = initialValue.split(parseInt(initialValue.match(/\d+/)))[0];
    var lastStr = initialValue.split(parseInt(initialValue.match(/\d+/)))[1];
    var intValue = parseInt(intValue.match(/\d+/)) + 1;
    var loopData = [];
    var i;
    for (i = 0; i < n; i++) {
      loopData.push({
        name:
          (firstStr != undefined ? firstStr : '') +
          (isNaN(intValue) ? '' : intValue) +
          (lastStr != undefined ? lastStr : ''),
      }),
        // (value = value + 1);
        (intValue = intValue + 1);
    }
    setState((oldState) => ({
      ...oldState,
      unitsArray: loopData,
    }));
  };

  const addInput = (value, i) => {
    setState((oldState) => ({
      ...oldState,
      newUnit: value,
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
            name:
              (firstStr != undefined ? firstStr : '') +
              (isNaN(intValue) ? '' : intValue) +
              (lastStr != undefined ? lastStr : ''),
          };
          setState((oldState) => ({
            ...oldState,
            unitsArray,
          }));
          intValue = intValue + 1;
        }
      });
    } else {
      let unitsArray = [...state.unitsArray];
      unitsArray[i] = {...unitsArray[i], name: value};
      setState((oldState) => ({
        ...oldState,
        unitsArray,
      }));
    }
  };

  const _renderUnitList = ({item, index}) => (
    <TextInput
      key={index}
      value={item.name}
      dense={true}
      onChangeText={(text) => {
        addInput(text, index);
      }}
      onSubmitEditing={() => {
        Keyboard.dismiss();
      }}
      style={[styles.input, {alignSelf: 'center', fontSize: width * 0.03}]}
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
    closeModal();
  };

  const newBuilding = () => {
    const unitsTotal = state.unitsArray.length + unitActualCount;

    if (state.buildName === '') {
      setError((oldState) => ({
        ...oldState,
        buildingName: 'Invalid Building Name',
      }));
      Toast.show('Invalid Building Name', Toast.SHORT);
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        buildingName: '',
      }));
    }
    if (state.unitsArray.length === 0) {
      setError((oldState) => ({
        ...oldState,
        units: 'Empty units',
      }));
      Toast.show('Empty Units', Toast.SHORT);
      return;
    } else {
      setError((oldState) => ({
        ...oldState,
        units: '',
      }));
    }
    if (unitsTotal > unitCount) {
      Toast.show(`Unit add limit is ${unitCount}`, Toast.SHORT);
      return;
    } else {
      var loopData = [];
      var i;
      for (i = 0; i < state.unitsArray.length; i++) {
        loopData.push({
          name: state.unitsArray[i].name,
          unit_mix_id: unitMixeId,
        });
      }
      console.log('loopdata', loopData);
      if (type == 'Multiple') {
        handleAddbuildingApi({
          building_id: buildData.buildId,
          units: loopData,
          descriptions: state.buildDescription,
        });
      } else {
        handleAddbuildingApi({
          name: state.buildName,
          property_id: propertyId,
          units: loopData,
          descriptions: state.buildDescription,
        });
      }
    }
  };

  const handleAddbuildingApi = async (data) => {
    if (type == 'Multiple') {
      const unitResponse = await API.post(
        `/property/equipment/unit/add-multiple-units`,
        data,
      );
      dispatch(fetchPropetry());
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        reRun();
      } else {
        alert(unitResponse?.data?.message);
      }
    } else {
      const unitResponse = await API.post(
        `/property/equipment/building/add-building`,
        data,
      );
      dispatch(fetchPropetry());
      if (unitResponse?.data?.bool) {
        changeUtilityAndToggle();
        reRun();
      } else {
        alert(unitResponse?.data?.message);
      }
    }
  };

  return (
    <Modal
      animationIn="slideInDown"
      animationOut="slideOutUp"
      hasBackdrop={true}
      backdropColor="black"
      isVisible={modalVisible}>
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
                  <TextReuseableComponent
                    title
                    style={styles.modalHeading}
                    value={modalName}
                  />
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
              <ScrollView style={{flex: 1}}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Building Name"
                    value={state.buildName}
                    disabled={type == 'Multiple' ? true : false}
                    error={error.buildingName}
                    onChangeText={(text) => {
                      setError((oldState) => ({
                        ...oldState,
                        buildingName: '',
                      }));
                      setState((oldState) => ({
                        ...oldState,
                        buildName: text,
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
                  <HelperText type="error" visible={error.buildingName}>
                    {error.buildingName}
                  </HelperText>
                ) : null}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Building Description"
                    value={state.buildDescription}
                    onChangeText={(text) => {
                      setState((oldState) => ({
                        ...oldState,
                        buildDescription: text,
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
                  <TextReuseableComponent
                    title
                    style={styles.desciptionHeading}
                    value={'# OF UNITS'}
                  />
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
                          autoIncrement: !state.autoIncrement,
                        }))
                      }
                      onCheckColor="#25AAE1ec"
                      onTintColor="#25AAE1ec"
                    />
                    <TextReuseableComponent title value={'Auto Increment'} />
                  </View>
                </View>
                {error.units ? (
                  <HelperText type="error" visible={error.units}>
                    {error.units}
                  </HelperText>
                ) : null}
                <FlatList
                  data={state.unitsArray}
                  // initialNumToRender={this.state.noOfUnits}
                  renderItem={(item, index) => _renderUnitList(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
              {/* Box Footer */}
              <View style={styles.footerBtn}>
                <View style={styles.addUnitBtnContainer}>
                  <TouchableOpacity onPress={changeUtilityAndToggle}>
                    <View style={styles.cancelBotton}>
                      <Plus name="close" color="black" size={18} />
                      <TextReuseableComponent title value={'Cancel'} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={newBuilding}>
                    <View style={styles.submitBotton}>
                      <Plus name="plus" color="white" size={18} />
                      <TextReuseableComponent
                        title
                        style={{color: 'white'}}
                        value={`${type == 'Multiple' ? 'Add' : 'Add Building'}`}
                      />
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
