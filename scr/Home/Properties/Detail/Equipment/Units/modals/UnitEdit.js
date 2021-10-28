import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import Modal from 'react-native-modal';
import Build from 'react-native-vector-icons/MaterialCommunityIcons';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon, IconToggle} from 'react-native-material-ui';
import {TextInput, FAB, HelperText, Divider} from 'react-native-paper';
import {Menu as MenuT, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Fonts} from '../../../../../../utils/fonts';
import Drop from 'react-native-vector-icons/Ionicons';
import Scanner from 'react-native-vector-icons/Ionicons';
import Delete from 'react-native-vector-icons/MaterialIcons';
import {DotsLoader} from 'react-native-indicator';
import TextTicker from 'react-native-text-ticker';
import {create} from 'apisauce';
import Base_URL from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';

const {width, height} = Dimensions.get('window');
const api = create({baseURL: Base_URL});

export default function UnitEdit({
  modalVisible,
  closeModal,
  handleEditUnit,
  meterMenuVisible,
  showMenu,
  hideMenu,
  itemPressHandle,
  buildingName,
  unitDetails,
  meterTypes,
}) {
  const [meterListData, setMeterListData] = useState([]);
  const [typeOfMeters, setTypeOfMeters] = useState([]);
  const [meterListArray, setMeterListArray] = useState([]);

  const getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('It Worked', token);
      api.setHeader('Authorization', 'Bearer ' + token);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    setMeterListArray(meterTypes);
    console.log('XXXXX', meterListArray);
  }, [meterTypes]);

  const addMeterInNewArray = async (value) => {
    hideMenu();
    console.log('value Of selectable meter_______', value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const data = {
      id: value.id,
      deviceSerialNum: '',
      deviceSerialError: '',
      meterType: '',
      meterTypeName: '',
      meterTypeError: '',
      meterAttachedTo: '',
      meterAttachedError: '',
      meterSerialNum: '12357841',
      customMeterId: '6564678',
      name: value.name,
      icon: value.icon,
      meterTypeMenu: false,
    };
    const newArray = [...meterListData];
    newArray.push(data);
    setMeterListData(newArray);

    const newList = meterListArray.filter((item) => item.id !== value.id);
    setMeterListArray(newList);
    const unitResponse = await api.get(`/property/equipment/type/all-types`);
    console.log('Check types add--->', unitResponse.data);
    setTypeOfMeters(unitResponse?.data?.data);
  };

  //!----------->

  const showMoreInputs = (value, index) => {
    // const newList = this.state.meterListData.filter(
    //   (item) => item.showInputs !== value.showInputs,
    // );
    // this.setState({meterListData: newList});

    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].showOtherInputs = !value.showOtherInputs; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // this.setState({showOtherInputs: !this.state.showOtherInputs});
  };

  const handleMetertypeModal = async (index) => {
    const unitResponse = await this.api.get(
      `/property/equipment/unit-of-measure/all`,
    );
    this.setState(
      {measureOfUnit: unitResponse?.data?.data, typeOfMeterIndex: index},
      () => console.log('measureOfUnit Of_______', this.state.measureOfUnit),
    );
    this.setState({
      isModalMeterVisible: true,
    });
  };

  const onGetMeterTypeId = (item, index) => {
    this.setState({typeOfMetersVisible: false});
    let newArr = [...this.state.meterListData]; // copying the old datas array
    newArr[index].meterType = item.id; // replace e.target.value with whatever you want to change it to
    this.setState({meterListData: newArr}, () =>
      console.log('e--->', this.state.meterListData),
    );
  };



//!-------->

  console.log('got Meters', typeOfMeters); // ye jb hoga jb select hoga meter type
  console.log('got unit details', unitDetails);
  return (
    <View>
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        isVisible={modalVisible}
        // isVisible={true}
        style={styles.modal1Container}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalInner}>
            <View
              style={[
                styles.boxConatainer,
                {
                  height:
                    meterListData.length == 0 ? height * 0.44 : height * 0.55,
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
                    <Text style={styles.modalHeading}>Edit Unit</Text>
                    <Pressable
                      onPress={closeModal}
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
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    <View style={styles.desciptionContainer}>
                      <Build
                        name={'office-building'}
                        size={height * 0.02}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>BUILDING*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      {/* //todo: This is Drop down picker */}
                      <TextInput
                        placeholder="Building Name"
                        value={buildingName}
                        dense={true}
                        editable={false}
                        // onFocus={this.changeLayoutMeter3}
                        // onBlur={this.changeLayoutMeter3}
                        showSoftInputOnFocus={false}
                        // onChangeText={(text) => {
                        //   this.setState({newBuild: text});
                        // }}
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
                      <Text style={styles.desciptionHeading}>UNIT*</Text>
                    </View>
                    <View style={[styles.inputContainer]}>
                      <TextInput
                        placeholder="Unit Name"
                        value={unitDetails.unit.name}
                        dense={true}
                        // onChangeText={(text) => {
                        //   this.setState({lastUnitData: text});
                        // }}
                        style={[
                          styles.input,
                          // {
                          //   width: !this.state.meter3
                          //     ? width * 0.75
                          //     : width * 0.0,
                          // },
                        ]}
                        // error={this.state.errorUnits.units}
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
                    {/* <HelperText
                      type="error"
                      visible={this.state.errorUnits.units}
                      >
                      {this.state.errorUnits.units}
                    </HelperText> */}
                  </View>
                  {meterListData &&
                    meterListData.map((item, meterIndex) => (
                      <View
                        style={{
                          alignItems: 'center',
                          overflow: 'hidden',
                          marginBottom: height * 0.02,
                        }}>
                        <View
                          style={{
                            // top: height * 0.005,
                            width: width * 0.75,
                          }}>
                          <View>
                            <View style={styles.utilityInScrHeadView}>
                              <Drop
                                name={item.icon}
                                size={width * 0.06}
                                color="#3E89BF"
                              />
                              <Text
                                style={[
                                  styles.utilityInScrHead,
                                  {
                                    color: '#000',
                                    textTransform: 'capitalize',
                                  },
                                ]}>
                                {item.name}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                }}
                                // onPress={() =>
                                //   this.deleteMeterInNewArray(item)
                                // }
                              >
                                <Delete
                                  name={'delete-forever'}
                                  size={height * 0.04}
                                  color="#25AAE1ec"
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.meterDesciptionContainer}>
                              <Text style={styles.meterDesciptionHeading}>
                                Device serial number
                              </Text>
                            </View>
                            <View style={styles.meterInputContainer}>
                              <TextInput
                                placeholder="Serial Number"
                                value={item.deviceSerialNum}
                                dense={true}
                                error={item.deviceSerialError}
                                right={
                                  <TextInput.Icon
                                    name={() => (
                                      <TouchableOpacity
                                      // onPress={() =>
                                      //   this.toggleScanner(
                                      //     meterIndex,
                                      //   )
                                      // }
                                      >
                                        <Scanner name="scan" size={20} />
                                      </TouchableOpacity>
                                    )}
                                  />
                                }
                                // onChangeText={(text) =>
                                //   this.onChangeMultipleField(
                                //     text,
                                //     meterIndex,
                                //   )
                                // }
                                style={styles.meterInput}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}></TextInput>
                            </View>
                            {item.deviceSerialError ? (
                              <HelperText
                                type="error"
                                visible={item.deviceSerialError}>
                                {item.deviceSerialError}
                              </HelperText>
                            ) : null}
                            <View style={styles.meterDesciptionContainer}>
                              <Text style={styles.meterDesciptionHeading}>
                                Meter type
                              </Text>
                            </View>
                            <View
                              style={{
                                backgroundColor: '#F6F6F6',
                                alignSelf: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                borderColor: item.meterTypeError
                                  ? 'red'
                                  : 'gray',
                                width: width * 0.75,
                                height: height * 0.07,
                                borderWidth: width * 0.003,
                                borderRadius: width * 0.01,
                                justifyContent: 'space-between',
                                paddingHorizontal: width * 0.03,
                              }}>
                              {/* <Text>{item.name}</Text> */}
                              {typeOfMeters.length ? (
                                <MenuT
                                  visible={item.meterTypeMenu}
                                  style={{height: height * 0.12}}
                                  anchor={
                                    typeOfMeters.length ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.showTypesOfMeter(
                                            item,
                                            meterIndex,
                                          )
                                        }
                                        style={{
                                          width: width * 0.5,
                                          flexDirection: 'row',
                                          justifyContent: 'flex-start',
                                          alignItems: 'center',
                                        }}>
                                        <TextTicker
                                          marqueeDelay={1000}
                                          duration={5000}
                                          style={{
                                            fontSize: height * 0.018,
                                            color: '#25AAE1ec',
                                            textTransform: 'capitalize',
                                          }}>
                                          {item.meterTypeName
                                            ? item.meterTypeName
                                            : 'Select'}
                                        </TextTicker>
                                      </TouchableOpacity>
                                    ) : (
                                      <View
                                        style={{
                                          marginLeft: width * 0.02,
                                        }}>
                                        <DotsLoader />
                                      </View>
                                    )
                                  }
                                  onRequestClose={() =>
                                    this.hideTypesOfMeter(item, meterIndex)
                                  }>
                                  <ScrollView>
                                    {typeOfMeters.map((item, index) => (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          paddingLeft: width * 0.02,
                                        }}>
                                        <Drop
                                          name={item.icon}
                                          size={15}
                                          color="#3E89BF"
                                        />
                                        <MenuItem
                                          style={{
                                            width: width * 0.7,
                                          }}
                                          onPress={() =>
                                            this.onGetMeterTypeId(
                                              item,
                                              meterIndex,
                                            )
                                          }>
                                          <Text
                                            style={{
                                              textTransform: 'capitalize',
                                            }}>
                                            {item.manufacturer +
                                              '-' +
                                              item.model +
                                              ' ' +
                                              '(x' +
                                              item.multiplier +
                                              ' ' +
                                              item.unit_of_measure +
                                              ')'}
                                          </Text>
                                        </MenuItem>
                                      </View>
                                    ))}
                                  </ScrollView>
                                </MenuT>
                              ) : (
                                <DotsLoader
                                  color="#25AAE1ec"
                                  size={width * 0.02}
                                />
                              )}

                              <TouchableOpacity
                                onPress={() =>
                                  this.handleMetertypeModal(meterIndex)
                                }>
                                <Plus name="plus" size={20} />
                              </TouchableOpacity>
                            </View>
                            {item.meterTypeError ? (
                              <HelperText
                                type="error"
                                visible={item.meterTypeError}>
                                {item.meterTypeError}
                              </HelperText>
                            ) : null}
                            <View style={styles.meterDesciptionContainer}>
                              <Text style={styles.meterDesciptionHeading}>
                                Meter Attached To
                              </Text>
                            </View>
                            <View style={styles.meterInputContainer}>
                              <TextInput
                                placeholder=""
                                dense={true}
                                keyboardType="numeric"
                                style={styles.meterInput}
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
                            {item.showOtherInputs == true ? (
                              <View>
                                <View style={styles.meterDesciptionContainer}>
                                  <Text style={styles.meterDesciptionHeading}>
                                    Meter Serial Number
                                  </Text>
                                </View>
                                <View style={styles.meterInputContainer}>
                                  <TextInput
                                    placeholder=""
                                    dense={true}
                                    keyboardType="numeric"
                                    style={styles.meterInput}
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
                                <View style={styles.meterDesciptionContainer}>
                                  <Text style={styles.meterDesciptionHeading}>
                                    Custom Meter ID
                                  </Text>
                                </View>
                                <View style={styles.meterInputContainer}>
                                  <TextInput
                                    placeholder=""
                                    dense={true}
                                    keyboardType="numeric"
                                    style={styles.meterInput}
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
                              </View>
                            ) : (
                              console.log('Check Item', item)
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                this.showMoreInputs(item, meterIndex)
                              }
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                              }}>
                              {/*//todo: Button for meter */}
                              <Text
                                style={{
                                  fontSize: height * 0.018,
                                  color: '#25AAE1ec',
                                }}>
                                {item.showOtherInputs
                                  ? 'Show Less'
                                  : 'Show More'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                </ScrollView>
                {/* Box Footer */}
                <View style={styles.footerBtn}>
                  <View
                    style={{
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MenuT
                      visible={meterMenuVisible}
                      anchor={
                        meterListArray.length ? (
                          <Pressable
                            onPress={showMenu}
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                            android_ripple={{
                              color: '#25AAE1ec',
                              borderless: true,
                              radius: height * 0.08,
                            }}>
                            {/*//todo: Button for meter */}
                            <Plus name="plus" size={25} color="#25AAE1ec" />
                            <Text
                              style={{
                                fontSize: height * 0.018,
                                color: '#25AAE1ec',
                              }}>
                              Meter
                            </Text>
                          </Pressable>
                        ) : (
                          <View style={{marginLeft: width * 0.02}}>
                            <Text
                              style={{
                                fontSize: height * 0.018,
                                color: '#25AAE1ec',
                              }}>
                              No Meters
                            </Text>
                          </View>
                        )
                      }
                      onRequestClose={hideMenu}>
                      <ScrollView>
                        {meterListArray.map((item, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // paddingLeft: width * 0.02,
                            }}>
                            <Drop name={item.icon} size={15} color="#3E89BF" />
                            <MenuItem
                              textStyle={styles.textCapitalize}
                              onPress={() => addMeterInNewArray(item)}>
                              {item.name}
                            </MenuItem>
                          </View>
                        ))}
                      </ScrollView>
                    </MenuT>
                  </View>
                  <View style={styles.addUnitBtnContainer}>
                    <TouchableOpacity onPress={closeModal}>
                      <View style={styles.cancelBotton}>
                        <Plus name="close" color="black" size={18} />
                        <Text style={{color: 'black'}}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditUnit}>
                      <View style={styles.submitBotton}>
                        <Plus name="pencil-plus" color="white" size={18} />
                        <Text style={{color: 'white'}}>Edit Unit</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal1Container: {
    // zIndex: 0,
  },
  modalInner: {
    elevation: width * 0.005,
    borderRadius: width * 0.02,
    backgroundColor: 'white',
    padding: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: width * .85,
    // height: height * .5,
  },
  boxInner: {
    // flex: 1,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    elevation: width * 0.02,
    // alignItems: 'center',
  },
  boxHeader: {
    width: width * 0.75,
    height: height * 0.1,
  },
  boxHeaderInner: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: width * 0.001,
  },
  modalHeading: {
    fontSize: width * 0.048,
    color: 'black',
    fontFamily: Fonts.ComfortaaRegular,
    right: width * 0.02,
  },
  desciptionContainer: {
    height: height * 0.035,
    width: width * 0.7,
    alignSelf: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    // backgroundColor: 'red',
    // marginBottom: height * .01
  },
  inputContainer: {
    // height: height * .09,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "yellow"
  },
  desciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: Fonts.ComfortaaRegular,
  },
  utilityInScrHeadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: width * 0.001,
  },
  utilityInScrHead: {
    fontFamily: Fonts.Montserrat,
    fontSize: height * 0.034,
    textAlign: 'center',
  },
  meterDesciptionContainer: {
    height: height * 0.042,
    width: width * 0.7,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    // flexDirection: 'row',
    // alignSelf: 'center',
    // alignItems: 'flex-end',
    // marginBottom: height * .01
  },
  meterDesciptionHeading: {
    fontSize: height * 0.015,
    color: 'black',
    textTransform: 'uppercase',
    fontFamily: Fonts.ComfortaaRegular,
  },
  meterInputContainer: {
    // height: height * .09,
    width: width * 0.8,
    justifyContent: 'center',
  },
  meterInput: {
    // height: height * .07,
    width: width * 0.75,
    justifyContent: 'flex-end',
    fontSize: height * 0.018,
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  addUnitBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // width: width * .48,
    // margin: width * .02,
  },
  cancelBotton: {
    width: width * 0.205,
    height: height * 0.05,
    margin: width * 0.01,
    padding: width * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E2E2E2',
    borderRadius: width * 0.02,
    elevation: width * 0.01,
  },
  submitBotton: {
    width: width * 0.235,
    height: height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: width * 0.01,
    padding: width * 0.015,
    borderRadius: width * 0.02,
    backgroundColor: '#25AAE1',
    elevation: width * 0.01,
  },
  footerBtn: {
    width: width * 0.8,
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    borderTopWidth: width * 0.001,
    backgroundColor: 'white',
  },
  input: {
    height: height * 0.07,
    width: width * 0.75,
    fontSize: height * 0.018,
  },
});
