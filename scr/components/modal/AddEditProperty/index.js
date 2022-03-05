import React, {useRef, useState} from 'react';

import {
  Text,
  View,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  UIManager,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  Image,
  LayoutAnimation,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, IconToggle} from 'react-native-material-ui';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, Button, FAB, HelperText} from 'react-native-paper';

//Component
import styles from './style';
import {Fonts} from '../../../utils/fonts';
import Slider from '@react-native-community/slider';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import SystemSetting from 'react-native-system-setting';

export default function AddEditProperty({
  modalVisible,
  closeModal,
  type,
  currAddr,
  currLocate,
}) {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0322;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const circleRef = useRef(null);

  const [isModalAddPropVisible, setIsModalAddPropVisible] = useState(true);
  const [avoidKeyboard, setAvoidKeyboard] = useState(false);
  const [selectLocation, setSelectLocation] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [latDelta, setLatDelta] = useState(LATITUDE_DELTA);
  const [longDelta, setLongDelta] = useState(LONGITUDE_DELTA);
  const [radialDis, setRadialDis] = useState(0.1);
  const [locationBtn, setLocationBtn] = useState('');
  const [markers, setMarkers] = useState(currLocate);
  const [Name, setName] = useState('');
  const [Street, setStreet] = useState('');
  const [City, setCity] = useState('');
  const [State, setState] = useState('');
  const [ZipCode, setZipCode] = useState('');
  const [error, setError] = useState({
    property: '',
    meterId: '',
    utilType: '',
    deviceId: '',
    street: '',
    city: '',
    zipcode: '',
    st: '',
    modelNos: '',
    devIdsArr: '',
  });
  const [dropDownShow, setDropDownShow] = useState([
    {value: true},
    {value: false},
    {value: false},
    {value: false},
    {value: false},
  ]);

  const showMoreFn = (indexx) => {
    // this.setState({
    //   addNewType: false,
    //   showEditManufacturer: false,
    //   showAddManufacturer: false,
    // });
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    dropDownShow.map((item, index) => {
      if (index == indexx) {
        let dropDownVal = [...dropDownShow];
        console.log('el --->', dropDownVal[index]);
        dropDownVal[index].value = true;
        setDropDownShow(dropDownVal);
      } else {
        let dropDownVal = [...dropDownShow];
        console.log('el --->', dropDownVal[index]);
        dropDownVal[index].value = false;
        setDropDownShow(dropDownVal);
      }
    });
  };

  const selectMeterLocation = async () => {
    console.log('Location ka batao', await SystemSetting.isLocationEnabled());
    setSelectLocation(true);
  };

  const catchLocation = (region) => {
    setLat(region?.lat);
    setLong(region?.lng);
  };

  const fetchAddressData = (searchdata) => {
    console.log('SEARCH STR', searchdata);
    const searchStr = ',';
    var searchStrLen = searchStr.length;
    var startIndex = 0,
      index,
      indices = [];

    while ((index = searchdata.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    const Street = searchdata.slice(0, indices[0]);
    const City = searchdata.slice(indices[0] + 2, indices[1]);
    const State = searchdata.slice(indices[1] + 2, indices[1] + 4);
    const ZipCode = searchdata.slice(indices[1] + 5, indices[2]);

    console.log('DATA', indices);
    console.log('Street', Street);
    console.log('City', City);
    console.log('State', State);
    console.log('Zipcode', ZipCode);
    setStreet(Street);
    setCity(City);
    setState(State);
    setZipCode(ZipCode);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      setLat(lat);
      setLong(long);
    });
  };

  const moveMarker = (region, gesture) => {
    if (gesture.isGesture) {
      setLat(region?.latitude);
      setLong(region?.longitude);
      setLatDelta(region?.latitudeDelta);
      setLongDelta(region?.longitudeDelta);
    }
  };

  return (
    <View>
      <KeyboardAvoidingView behavior="height">
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          coverScreen={true}
          statusBarTranslucent={true}
          style={{
            margin: 0,
            // bottom: avoidKeyboard ? width * 0.45 : 0,
          }}
          isVisible={modalVisible}>
          {selectLocation ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  width: width * 0.9,
                  height: width * 1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: width * 0.03,
                }}>
                <View
                  style={{
                    flex: 1,
                    zIndex: 2,
                    position: 'absolute',
                    top: width * 0.16,
                    width: width * 0.72,
                    backgroundColor: 'white',
                  }}>
                  <Text
                    style={{
                      marginTop: width * 0.02,
                      marginLeft: width * 0.03,
                    }}>
                    RADIAL DISTANCE (KM)*
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: width * 0.01,
                    }}>
                    <Slider
                      style={{width: width * 0.55, height: width * 0.08}}
                      minimumValue={0.1}
                      maximumValue={1}
                      thumbTintColor="#25AAE1ec"
                      minimumTrackTintColor="#25AAE1ec"
                      maximumTrackTintColor="#000000"
                      value={Number(radialDis)}
                      onValueChange={(value) =>
                        setRadialDis(value.toString().slice(0, 3))
                      }
                      step={0.1}
                    />
                    <Text>{radialDis} KM</Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    zIndex: 2,
                    position: 'absolute',
                    top: width * 0.04,
                    width: width * 0.72,
                  }}>
                  <GooglePlacesAutocomplete
                    placeholder="Address"
                    query={{
                      key: 'AIzaSyBdXm5lf_NfpStchyRDc3Cl94cNNZMLW2s',
                      language: 'en', // language of the results
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    disableScroll={false}
                    onPress={(data, details) => {
                      catchLocation(details.geometry.location);
                      console.log('DETAILS', details);
                      fetchAddressData(details?.formatted_address);
                      setLocationBtn(details?.formatted_address);
                    }}
                    onFail={(error) => console.error(error)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => getCurrentLocation()}
                  style={{
                    backgroundColor: '#25AAE1ec',
                    zIndex: 1,
                    position: 'absolute',
                    height: width * 0.12,
                    width: width * 0.12,
                    borderRadius: width * 0.3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: width * 0.005,
                    bottom: width * 0.2,
                    right: width * 0.03,
                  }}>
                  <Icon size={width * 0.07} color="#fff" name={'gps-fixed'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectLocation(false);
                    setLocationSelected(true);
                  }}
                  style={{
                    backgroundColor: '#25AAE1ec',
                    zIndex: 1,
                    position: 'absolute',
                    height: width * 0.12,
                    width: width * 0.12,
                    borderRadius: width * 0.3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: width * 0.005,
                    bottom: width * 0.04,
                    right: width * 0.03,
                  }}>
                  <Icon
                    size={width * 0.07}
                    color="#fff"
                    name={'navigate-next'}
                  />
                </TouchableOpacity>

                {markers.length > 0 || currLocate.length > 0 ? (
                  <View
                    style={{
                      // backgroundColor: 'blue',
                      width: width * 0.12,
                      top: width * 0.4,
                      zIndex: 1,
                      position: 'absolute',
                      alignItems: 'center',
                    }}>
                    <Icon
                      size={width * 0.12}
                      color="#f00"
                      name={'location-pin'}
                    />
                  </View>
                ) : null}
                {markers.length > 0 || currLocate.length > 0 ? (
                  <MapView
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'flex-end',
                      alignItems: 'center',

                      width: '100%',
                      height: '100%',
                      borderRadius: width * 0.03,
                    }}
                    region={{
                      latitude: lat,
                      longitude: long,
                      latitudeDelta: latDelta,
                      longitudeDelta: longDelta,
                    }}
                    zoomEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    onRegionChangeComplete={(e, ges) => moveMarker(e, ges)}
                    // onPress={(e) => this.getLocation(e)}
                  >
                    <Circle
                      center={{
                        latitude: lat,
                        longitude: long,
                      }}
                      ref={circleRef}
                      onLayout={() =>
                        circleRef.current.setNativeProps({
                          strokeColor: 'rgba(12,170,225,1)',
                          fillColor: 'rgba(12,170,225,0.3)',
                        })
                      }
                      radius={radialDis * 1000}
                      // fillColor="rgba(12,170,225,0.3)"
                      // strokeColor="rgba(12,170,225,1)"
                    />
                  </MapView>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.modalInner}>
              <View style={styles.boxConatainer}>
                <View style={styles.boxInner}>
                  {/* Box Header */}
                  <View style={styles.boxHeader}>
                    <View style={styles.boxHeaderInner}>
                      <Icon
                        name={'business'}
                        size={height * 0.05}
                        color="#5e5e5e"
                      />
                      <Text style={styles.modalHeading}>
                        {type == 'Add' ? 'New' : 'Edit'} Property
                      </Text>
                      <Pressable
                        onPress={closeModal}
                        // onPress={this.clearInputs}
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
                  <KeyboardAwareScrollView
                    style={{flex: 1, width: '90%', backgroundColor: '#fff'}}
                    contentContainerStyle={{backgroundColor: '#fff'}}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}>
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(0)}>
                        <Text style={styles.desciptionHeading}>
                          Property Name & Address
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[0].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[0].value
                              ? height * 0.09
                              : height * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TextInput
                          placeholder="Enter Property Name*"
                          value={Name}
                          onChangeText={(text) => {
                            setName(text);
                            setError((oldState) => ({
                              ...oldState,
                              property: '',
                            }));
                          }}
                          error={error.property}
                          style={[styles.input, {width: '99%'}]}
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
                      {error.property ? (
                        <HelperText type="error" visible={error.property}>
                          {error.property}
                        </HelperText>
                      ) : null}

                      <View
                        style={[
                          styles.inputContainer,
                          {
                            height: dropDownShow[0].value
                              ? height * 0.09
                              : height * 0.0,
                            overflow: 'hidden',
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={selectMeterLocation}
                          style={styles.loactionBtn}>
                          <Text style={styles.loactionBtnText}>
                            {locationBtn ? locationBtn : currAddr}
                          </Text>
                          <IonicIcon
                            name="location"
                            size={width * 0.05}
                            color="#3E4A4F"
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(1)}>
                        <Text style={[styles.desciptionHeading]}>
                          Utility Type, Manufacturer & Device
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[1].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      {/*
                         //! multi-manufacturer
                        */}
                      {/* <ScrollView
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled>
                      {this.state.loadingStateDev || this.state.loadingState ? (
                        <ActivityIndicator size="large" color={'#25AAE1ec'} />
                      ) : (
                        <>
                          <View
                            style={{
                              // height: height * 0.25,
                              width: '100%',
                              alignSelf: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                              // justifyContent: 'center',
                              zIndex: 2,
                              height: dropDownShow[1].value
                                ? this.state.showAddManufacturer ||
                                  this.state.showEditManufacturer
                                  ? height * 0.5
                                  : this.state.manufacturersArray.length > 0
                                  ? height * 0.25
                                  : height * 0.15
                                : height * 0.0,
                              overflow: 'hidden',
                              // backgroundColor: 'tomato',
                            }}>
                            {!this.state.showAddManufacturer &&
                              !this.state.showEditManufacturer && (
                                <View style={{paddingVertical: 10}}>
                                  {this.state.loadManuList ? (
                                    <ActivityIndicator
                                      size="large"
                                      style={{bottom: 15}}
                                      color={'#25AAE1ec'}
                                    />
                                  ) : (
                                    this.state.manufacturersArray.length >
                                      0 && (
                                      <FlatList
                                        data={this.state.manufacturersArray}
                                        renderItem={this.renderManufacturerList}
                                      />
                                    )
                                  )}

                                  <TouchableOpacity
                                    onPress={() => {
                                      this.openAddManu();
                                    }}
                                    style={{
                                      alignSelf: 'center',
                                      backgroundColor: '#fff',
                                      borderWidth: 2,
                                      borderColor: '#25AAE1ec',
                                      height: width * 0.1,
                                      width: width * 0.8,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    {this.state.addManuLoad ? (
                                      <ActivityIndicator
                                        size="small"
                                        color={'#25AAE1ec'}
                                      />
                                    ) : (
                                      <Text style={{color: '#25AAE1ec'}}>
                                        Add Manufacturer
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              )}
                            {this.state.showAddManufacturer &&
                              this.deviceTypeInfoComponent('add')}
                            {this.state.showEditManufacturer &&
                              this.deviceTypeInfoComponent('edit')}
                          </View>
                          {error.utilType ? (
                            <HelperText
                              type="error"
                              visible={error.utilType}>
                              {error.utilType}
                            </HelperText>
                          ) : null}
                        </>
                      )}
                    </ScrollView> */}
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(2)}>
                        <Text style={styles.desciptionHeading}>
                          owner info & contact person
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[2].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      {/* <View
                      style={[
                        styles.inputContainer,
                        {
                          height: dropDownShow[2].value
                            ? height * 0.09
                            : height * 0.0,
                          overflow: 'hidden',
                        },
                      ]}>
                      <TextInput
                        placeholder="Company Specific ID"
                        style={styles.input}
                        value={this.state.CustomId}
                        onChangeText={(text) => {
                          this.setState({CustomId: text});
                        }}
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

                    <View
                      style={[
                        styles.inputContainer,
                        {
                          height: dropDownShow[2].value
                            ? 'auto'
                            : height * 0.0,

                          overflow: 'hidden',
                        },
                      ]}>
                      <SearchableDropDown
                        onItemSelect={(item) => {
                          this.setState({
                            CustomerName: item.id,
                            ownerName: item.name,
                          });
                        }}
                        containerStyle={{
                          paddingVertical: width * 0.02,
                          width: '99.50%',
                        }}
                        itemStyle={{
                          padding: width * 0.027,
                          backgroundColor: 'rgb(247, 247, 247)',
                          borderColor: '#bbb',
                          borderWidth: width * 0.0015,
                          borderRadius: width * 0.015,
                          zIndex: 99,
                        }}
                        itemTextStyle={{color: '#222'}}
                        itemsContainerStyle={{
                          maxHeight: height * 0.08,
                        }}
                        items={this.state.ownerData}
                        resetValue={false}
                        textInputProps={{
                          placeholder: 'Owner or Developer Name',
                          underlineColorAndroid: 'transparent',
                          style: {
                            padding: width * 0.027,
                            margin: 0,
                            borderRadius: 5,
                            borderColor: 'black',
                            height: width * 0.13,
                            backgroundColor: '#F6F6F6',
                            borderWidth: width * 0.0019,
                            zIndex: 0,
                          },
                          onTextChange: (text) => {
                            this.setState({ownerName: text});
                          },
                          value: setTimeout(() => this.state.ownerName, 200),
                          defaultValue: this.state.ownerName,
                        }}
                        listProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                      
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          height: dropDownShow[2].value
                            ? height * 0.09
                            : height * 0.0,
                          overflow: 'hidden',
                        },
                      ]}>
                      <TextInput
                        placeholder="Title / Job Description"
                        style={styles.input}
                        value={this.state.customerjobDes}
                        onChangeText={(text) => {
                          this.setState({customerjobDes: text});
                        }}
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
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          height: dropDownShow[2].value
                            ? height * 0.09
                            : height * 0.0,
                          overflow: 'hidden',
                        },
                      ]}>
                      <TextInput
                        placeholder="Phone"
                        style={styles.input}
                        value={this.state.customerPhone}
                        onChangeText={(text) => {
                          this.setState({customerPhone: text});
                        }}
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
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          height: dropDownShow[2].value
                            ? height * 0.09
                            : height * 0.0,
                          overflow: 'hidden',
                        },
                      ]}>
                      <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={this.state.customerEmail}
                        onChangeText={(text) => {
                          this.setState({customerEmail: text});
                        }}
                        mode={'outlined'}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                          },
                        }}
                      />
                    </View> */}
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(3)}>
                        <Text style={styles.desciptionHeading}>
                          management company
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[3].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      {/* <View
                      style={{
                        width: '100%',
                        zIndex: 2,
                        alignSelf: 'center',
                        alignItems: 'center',
                        height: dropDownShow[3].value
                          ? height * 0.16
                          : height * 0.0,
                        overflow: 'hidden',
                      }}>
                      {this.state.loadingStateManage ? (
                        <ActivityIndicator size="large" color={'#25AAE1ec'} />
                      ) : this.state.addNewType &&
                        this.state.showAddType == 'Management' ? (
                        <View>
                          <View>
                            <Text
                              style={{
                                fontSize: width * 0.03,
                                color: '#3E4A4F',
                                textTransform: 'capitalize',
                                fontFamily: Fonts.ComfortaaRegular,
                                marginBottom: width * 0.01,
                                fontWeight: 'bold',
                              }}>
                              Add New {this.state.showAddType} Company
                            </Text>
                          </View>
                          <TextInput
                            placeholder={'Type New Management Company Name'}
                            value={this.state.addManagement}
                            style={{
                              width: width * 0.8,
                              justifyContent: 'flex-end',
                              fontSize: width * 0.036,
                            }}
                            mode={'outlined'}
                            theme={{
                              colors: {
                                text: '#25AAE1ec',
                                primary: '#25AAE1ec',
                                selectionColor: 'red',
                              },
                            }}
                            onChangeText={(text) => {
                              this.setState({addManagement: text});
                            }}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.cancelAddType()}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: width * 0.045,
                                  color: '#25AAE1ec',
                                  width: width * 0.16,
                                  textAlign: 'center',
                                }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.doneAddType('Management')}
                              disabled={
                                this.state.addManagement ? false : true
                              }>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: width * 0.045,
                                  color: this.state.addManagement
                                    ? '#25AAE1ec'
                                    : '#d0d0d0',
                                  width: width * 0.16,
                                  textAlign: 'center',
                                }}>
                                Add
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}>
                          <SearchableDropDown
                            onItemSelect={(item) => {
                              this.setState({
                                managementCompany: item.name,
                                managementCompanyId: item.id,
                              });
                            }}
                            containerStyle={{
                              paddingBottom: width * 0.02,
                              width: width * 0.7,
                            }}
                            itemStyle={{
                              padding: width * 0.027,
                              backgroundColor: 'rgb(247, 247, 247)',
                              borderColor: '#bbb',
                              borderWidth: width * 0.0015,
                              borderRadius: width * 0.015,
                              zIndex: 99,
                            }}
                            itemTextStyle={{color: '#222'}}
                            itemsContainerStyle={{
                              maxHeight: height * 0.08,
                            }}
                            items={this.context.manageCompList}
                            resetValue={false}
                            textInputProps={{
                              placeholder: 'Management Company',
                              underlineColorAndroid: 'transparent',
                              style: {
                                padding: width * 0.027,
                                margin: 0,
                                borderTopLeftRadius: width * 0.015,
                                borderBottomLeftRadius: width * 0.015,
                                borderColor: 'black',
                                height: width * 0.13,
                                backgroundColor: '#F6F6F6',
                                borderTopWidth: width * 0.0019,
                                borderLeftWidth: width * 0.0019,
                                borderBottomWidth: width * 0.0019,
                                zIndex: 0,
                              },
                              onTextChange: (text) => {
                                this.setState({managementCompany: text});
                              },
                              value: setTimeout(
                                () => this.state.managementCompany,
                                200,
                              ),
                              defaultValue: this.state.managementCompany,
                            }}
                            listProps={{
                              nestedScrollEnabled: true,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              width: width * 0.1,
                              backgroundColor: '#25AAE199',
                              borderTopRightRadius: width * 0.015,
                              borderBottomRightRadius: width * 0.015,
                              borderTopWidth: width * 0.0019,
                              borderRightWidth: width * 0.0019,
                              borderBottomWidth: width * 0.0019,
                              height: width * 0.13,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => this.showAddNewType('Management')}>
                            <Icon
                              size={width * 0.06}
                              color="#fff"
                              name={'add'}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View> */}
                      <TouchableOpacity
                        style={styles.desciptionContainer}
                        onPress={() => showMoreFn(4)}>
                        <Text style={styles.desciptionHeading}>
                          billing company
                        </Text>
                        <IonicIcon
                          name={
                            dropDownShow[4].value
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={width * 0.05}
                          color="#3E4A4F"
                        />
                      </TouchableOpacity>
                      {/* <View
                      style={{
                        width: '100%',
                        zIndex: 2,
                        alignSelf: 'center',
                        alignItems: 'center',
                        height: dropDownShow[4].value
                          ? height * 0.16
                          : height * 0.0,
                        overflow: 'hidden',
                      }}>
                      {this.state.loadingStateBill ? (
                        <ActivityIndicator size="large" color={'#25AAE1ec'} />
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}>
                          {this.state.addNewType &&
                          this.state.showAddType == 'Billing' ? (
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: width * 0.03,
                                    color: '#3E4A4F',
                                    textTransform: 'capitalize',
                                    fontFamily: Fonts.ComfortaaRegular,
                                    marginBottom: width * 0.01,
                                    fontWeight: 'bold',
                                  }}>
                                  Add New {this.state.showAddType} Company
                                </Text>
                              </View>
                              <TextInput
                                placeholder={'Type New Billing Company Name'}
                                value={this.state.addBilling}
                                style={{
                                  width: width * 0.8,
                                  justifyContent: 'flex-end',
                                  fontSize: width * 0.036,
                                }}
                                mode={'outlined'}
                                theme={{
                                  colors: {
                                    text: '#25AAE1ec',
                                    primary: '#25AAE1ec',
                                    selectionColor: 'red',
                                  },
                                }}
                                onChangeText={(text) => {
                                  this.setState({addBilling: text});
                                }}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.cancelAddType()}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: width * 0.045,
                                      color: '#25AAE1ec',
                                      width: width * 0.16,
                                      textAlign: 'center',
                                    }}>
                                    Cancel
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => this.doneAddType('Billing')}
                                  disabled={
                                    this.state.addBilling ? false : true
                                  }>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: width * 0.045,
                                      color: this.state.addBilling
                                        ? '#25AAE1ec'
                                        : '#d0d0d0',
                                      width: width * 0.16,
                                      textAlign: 'center',
                                    }}>
                                    Add
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                              }}>
                              <SearchableDropDown
                                onItemSelect={(item) => {
                                  this.setState({
                                    BillingCompany: item.name,
                                    BillingCompanyId: item.id,
                                  });
                                  // console.log('kia mila', item);
                                }}
                                containerStyle={{
                                  paddingBottom: width * 0.02,
                                  width: width * 0.7,
                                }}
                                itemStyle={{
                                  padding: width * 0.027,
                                  backgroundColor: 'rgb(247, 247, 247)',
                                  borderColor: '#bbb',
                                  borderWidth: width * 0.0015,
                                  borderRadius: width * 0.015,
                                  zIndex: 99,
                                }}
                                itemTextStyle={{color: '#222'}}
                                itemsContainerStyle={{
                                  maxHeight: height * 0.08,
                                }}
                                items={this.context.propitemList}
                                resetValue={false}
                                textInputProps={{
                                  placeholder: 'Billing Company',
                                  underlineColorAndroid: 'transparent',
                                  style: {
                                    padding: width * 0.027,
                                    margin: 0,
                                    borderTopLeftRadius: width * 0.015,
                                    borderBottomLeftRadius: width * 0.015,
                                    borderColor: 'black',
                                    height: width * 0.13,
                                    backgroundColor: '#F6F6F6',
                                    borderTopWidth: width * 0.0019,
                                    borderLeftWidth: width * 0.0019,
                                    borderBottomWidth: width * 0.0019,
                                    zIndex: 0,
                                  },
                                  onTextChange: (text) => {
                                    this.setState({BillingCompany: text});
                                  },
                                  value: setTimeout(
                                    () => this.state.BillingCompany,
                                    200,
                                  ),

                                  defaultValue: this.state.BillingCompany,
                                }}
                                listProps={{
                                  nestedScrollEnabled: true,
                                }}
                              />
                              <TouchableOpacity
                                style={{
                                  width: width * 0.1,
                                  backgroundColor: '#25AAE199',
                                  borderTopRightRadius: width * 0.015,
                                  borderBottomRightRadius: width * 0.015,
                                  borderTopWidth: width * 0.0019,
                                  borderRightWidth: width * 0.0019,
                                  borderBottomWidth: width * 0.0019,
                                  height: width * 0.13,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                onPress={() => this.showAddNewType('Billing')}>
                                <Icon
                                  size={width * 0.06}
                                  color="#fff"
                                  name={'add'}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View> */}
                    </View>
                  </KeyboardAwareScrollView>
                  {/* Box Header */}
                  <View style={styles.boxHeader}>
                    <View style={styles.bottonContainer}>
                      <FAB
                        onPress={this.addProperty}
                        style={styles.submitBotton}
                        color="white"
                        icon="check"
                        label={'Add property'}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}
