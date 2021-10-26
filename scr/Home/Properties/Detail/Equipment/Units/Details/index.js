import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Dimensions,
  SectionList,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  Image,
} from 'react-native';
import {Header, Button, Icon} from 'react-native-elements';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';
import {View as MotiView} from 'moti';
import {create} from 'apisauce';
import Base_Url from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../../../../../components/Loader';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart';

// Components
import styles from './style';
import {Checkbox, Divider} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import clc from 'cli-color';
import TextTicker from 'react-native-text-ticker';
const {width, height} = Dimensions.get('window');

const api = create({
  baseURL: Base_Url,
});

const App = ({navigation}) => {
  const [dangerView, setDangerView] = useState(false);
  const [headView, setHeadView] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openedStatus, setOpenedStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [unitMeter, setUnitMeter] = useState([]);
  const [meterInfoData, setMeterInfoData] = useState([]);
  const [statusInfo, setStatusInfo] = useState([]);
  const [meterTypeData, setMeterTypeData] = useState([]);
  const [remoteReaderData, setRemoteReaderData] = useState([]);
  const [unitData, setUnitData] = useState([]);

  const {unitId, buildingName} = navigation.state.params; //? Dynamic Ids
  console.log('aya kuch ++', navigation.state.params.unitId);

  const testId = navigation.state.params.unitId;

  useEffect(() => {
    getToken();
  }, []);

  const getUnitDetail = async () => {
    const res = await api.get(`/property/equipment/unit/${testId}`);
    // console.log('Kia ha Response Data', res.data);
    setData(res.data);
    setUnitMeter(res.data?.data?.unit?.unit_meter?.[0]);
    setLoading(false);
  };

  const getToken = async () => {
    setLoading(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      // this.setState({token: token});
      api.setHeader('Authorization', 'Bearer ' + token);
      getUnitDetail();
    }
  };

  const arrayOfUnits = data?.data?.unit?.unit_meter;

  const typeSwitcher = (arg) => {
    switch (arg) {
      case 'hot water':
        return require('../../../../../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../../../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../../../../../Images/electric.png');
      case 'gas':
        return require('../../../../../../../Images/gass.png');
      case 'water':
        return require('../../../../../../../Images/all-waters.png');
      default:
        break;
    }
  };

  useEffect(() => {
    setMeterInfoData([
      {
        leftText: 'Manufacturer',
        rightText: unitMeter?.type?.manufacturer ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Model',
        rightText: unitMeter?.type?.model ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Unit of Measure',
        rightText: unitMeter?.type?.unit_of_measure ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Multiplier',
        rightText: unitMeter?.type?.multiplier ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Size',
        rightText: unitMeter?.type?.size ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Meter Serial',
        rightText: unitMeter?.meter_serial_number ?? 'N/A',
        leftIcon: 'barcode-outline',
        leftType: 'ionicon',
        type: 'feather',
      },
      {
        leftText: 'Custom ID',
        rightText: unitMeter?.custom_meter_id ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'IMR',
        rightText: 'N/A',
        leftIcon: null,
        type: 'feather',
      },
    ]);
    setMeterTypeData([
      {
        title: 'Hot Water Meter',
        img: meterSwitcher(),
        data: [
          {
            leftName: 'Type',
            rightName:
              unitMeter?.type?.model +
              ' ' +
              '(x' +
              unitMeter?.type?.multiplier +
              ' ' +
              unitMeter?.type?.unit_of_measure +
              ')',
            rightIcon: 'chevron-down',
            type: 'feather',
          },
        ],
      },
    ]);
    setRemoteReaderData([
      {
        title: 'Transciever',
        img: require('../../../../../../../Images/remote-reader.png'),
        data: [
          {
            leftName: 'Serial Number',
            rightIcon: 'barcode-outline',
            rightName: unitMeter?.device_serial_number ?? 'N/A',
            type: 'ionicon',
            rightIcon2: null,
          },
          {
            leftName: 'Status',
            rightIcon2: 'check',
            rightIcon: 'chevron-down',
            rightName: 'Good',
            type: 'feather',
            text: 'As of 5 hours ago',
          },
        ],
      },
    ]);
    setStatusInfo([
      {
        leftText: 'Pulses',
        rightText: '3,761',
        icon: null,
        bold: false,
      },
      {
        leftText: 'Meter Port',
        rightText: 'Port 1',
        icon: 'chevron-down',
        bold: true,
        type: 'feather',
      },
      {
        leftText: 'Signal Type',
        rightText: 'Pulse',
        icon: 'chevron-down',
        bold: true,
        type: 'feather',
      },
      {
        leftText: 'Temperature',
        rightText: '59 F',
        icon: null,
        bold: false,
      },
      {
        leftText: 'Battery',
        rightText: 'Approx.7 Years',
        icon: null,
        bold: false,
      },
    ]);
    setUnitData([
      {
        title: 'Unit',
        icon: 'home',
        type: 'ionicon',
        data: [
          {
            leftIcon: 'home',
            leftName: 'Name',
            rightIcon: null,
            rightName: data?.data?.unit?.name ?? 'N/A',
            type: 'feather',
            typeRight: 'feather',
          },
          {
            leftIcon: null,
            leftName: 'Utility Type',
            rightIcon: null,
            rightName: unitMeter.meter_name,
            type: 'ionicon',
            typeRight: 'feather',
          },
          {
            leftIcon: 'building',
            leftName: 'Building',
            rightIcon: null,
            rightName: buildingName ?? 'Bluegrass MHP',
            type: 'font-awesome-5',
            typeRight: 'feather',
          },
          {
            leftIcon: 'ios-clipboard-outline',
            leftName: 'Notes',
            rightIcon: 'chevron-right',
            rightName: null,
            type: 'ionicon',
            typeRight: 'feather',
          },
        ],
      },
    ]);
    // console.log('Kia ha unitMeter', meterInfoData);
    if (data.length != 0) {
      setLoading(false);
    }
  }, [unitMeter]);
  const meterSwitcher = () => {
    switch (unitMeter?.meter_name) {
      case 'hot water':
        return require('../../../../../../../Images/meter-hot.png');
      case 'cold water':
        return require('../../../../../../../Images/meter-cold-water.png');
      case 'electricity':
        return require('../../../../../../../Images/meter-electric.png');
      case 'gas':
        return require('../../../../../../../Images/meter-gas.png');
      case 'water':
        return require('../../../../../../../Images/meter-all-waters.png');
      default:
        break;
    }
  };
  const handleMeterSelect = (data) => {
    // console.log('Kia ha unitMeter', data);
    if (data.id != unitMeter.id) {
      setLoading(true);
      setUnitMeter(data);
    }
  };
  const typeColor = (arg) => {
    switch (arg) {
      case 'hot water':
        return '#B14E3B';
      case 'cold water':
        return '#639CC7';
      case 'electricity':
        return '#CBBF30';
      case 'gas':
        return '#92C052';
      case 'water':
        return '#639CC7';
      default:
        break;
    }
  };

  const renderUnitList = ({item, index}) => {
    return (
      <View style={{paddingVertical: width * 0.02}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            {index == 1 ? (
              <Image
                source={typeSwitcher(item.rightName)}
                style={{
                  height: width * 0.06,
                  width: width * 0.055,
                  marginRight: width * 0.025,
                }}
              />
            ) : (
              <Icon
                name={item.leftIcon}
                type={item.type}
                size={width * 0.05}
                color={'#000'}
                style={{marginRight: width * 0.03}}
              />
            )}
            <Text style={{fontSize: width * 0.04}}>{item.leftName}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {item.rightName == null ? null : (
              <Text
                style={{
                  textTransform: 'capitalize',
                  color: index == 1 ? typeColor(item.rightName) : '#000',
                  fontSize: width * 0.04,
                }}>
                {item.rightName}
              </Text>
            )}
            {item.rightIcon == null ? null : (
              <Icon
                name={item.rightIcon}
                type={item.typeRight}
                size={width * 0.05}
                color="#000"
                style={{alignSelf: 'center'}}
              />
            )}
          </View>
        </View>
        {/* {index == 0 ? (
          <Divider
            style={{
              marginTop: height * 0.02,
              width: width,
              alignSelf: 'flex-start',
              right: width * 0.07,
              borderWidth: 0.2,
              flexDirection: 'row',
            }}
          />
        ) : ( */}
        <Divider
          style={{
            marginTop: height * 0.02,
            borderWidth: 0.2,
            width: width * 0.9,
            // right: width * 0.1,
            flexDirection: 'row',
          }}
        />
        {/* )} */}
      </View>
    );
  };

  const renderRemoteList = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item.leftName == 'Status' ? false : true}
        onPress={() => openStatusView()}>
        <View style={{paddingVertical: width * 0.02}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: width * 0.04}}>{item.leftName}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <Text style={{textAlign: 'right', fontSize: width * 0.04}}>
                      {item.rightName}
                    </Text>
                  )}
                  {item.rightIcon2 == null ? null : (
                    <Icon
                      name={item.rightIcon2}
                      type={item.type}
                      size={width * 0.05}
                      color="#0fc908"
                      style={{marginRight: width * 0.01}}
                    />
                  )}
                </View>
                {item.text && (
                  <Text style={{color: '#5c5c5ccf', fontSize: width * 0.04}}>
                    {item.text}
                  </Text>
                )}
              </View>
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.type}
                  size={width * 0.05}
                  color="#000"
                  style={{alignSelf: 'center'}}
                />
              )}
            </View>
          </View>
          <Divider
            style={{
              marginTop: height * 0.02,
              borderWidth: 0.2,
              width: width * 0.9,
              // right: width * 0.1,
              flexDirection: 'row',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const openView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpened(!opened);
  };

  const openStatusView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenedStatus(!openedStatus);
  };

  const renderMeterType = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => openView()}>
        <View style={{paddingVertical: width * 0.02}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: width * 0.04}}>{item.leftName}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{flexDirection: 'row-reverse', width: width * 0.6}}>
                  {item.rightName == null ? null : (
                    <TextTicker
                      duration={6000}
                      marqueeDelay={2000}
                      style={{
                        textAlign: 'right',
                        fontSize: width * 0.04,
                        textTransform: 'capitalize',
                      }}>
                      {item.rightName}
                    </TextTicker>
                  )}
                </View>
              </View>
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.type}
                  size={width * 0.05}
                  color="#000"
                  style={{alignSelf: 'center'}}
                />
              )}
            </View>
          </View>
          <Divider
            style={{
              marginTop: height * 0.02,
              borderWidth: 0.2,
              width: width * 0.9,
              // right: width * 0.1,
              flexDirection: 'row',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMeterInfo = ({item}) => {
    return (
      <View style={{backgroundColor: '#605c5c24'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: width * 0.04,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: width * 0.035}}>{item.leftText}</Text>
            {item.leftIcon == null ? null : (
              <Icon
                name={item.leftIcon}
                type={item.leftType}
                size={width * 0.05}
                color={'rgb(90,134,183)'}
                style={{marginLeft: width * 0.03, alignSelf: 'center'}}
              />
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{fontSize: width * 0.035, textTransform: 'capitalize'}}>
              {item.rightText}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStatusInfo = ({item}) => {
    return (
      <View style={{backgroundColor: '#605c5c24'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: width * 0.04,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: width * 0.035,
                color: '#8c8c8c',
              }}>
              {item.leftText}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: width * 0.035,
                color: item.bold ? '#000' : '#8c8c8c',
              }}>
              {item.rightText}
            </Text>
            {item.icon == null ? null : (
              <Icon
                name={item.icon}
                type={item.type}
                size={width * 0.05}
                color={'#000'}
                // style={{marginLeft: width * 0.03, alignSelf: 'center'}}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  console.log(clc.red('data', data));

  if (loading) {
    return <Loader />;
  } else {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <Header
              leftComponent={{
                text: 'Close',
                style: {fontSize: width * 0.05, color: '#000'},
                onPress: () => navigation.goBack(),
              }}
              centerComponent={
                <View style={{flexDirection: 'row'}}>
                  <Home
                    name="home"
                    size={width * 0.05}
                    color="#000"
                    style={{alignSelf: 'center', marginRight: width * 0.01}}
                  />
                  <Text style={{fontSize: width * 0.05}}>Units Details</Text>
                </View>
              }
              rightComponent={{
                text: 'Save',
                style: {fontSize: width * 0.05, color: '#5c5c5ccf'},
              }}
              backgroundColor="#fff"
              containerStyle={{borderBottomWidth: width * 0.003, elevation: 1}}
            />
            {!headView && (
              <MotiView
                from={{
                  opacity: 0,
                  translateX: -500,
                }}
                animate={{
                  opacity: 1,
                  translateX: 0,
                }}
                style={styles.currentReadContainer}>
                <Text style={{color: '#5c5c5ccf'}}>CURRENT READ</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width,
                    marginVertical: width * 0.01,
                    paddingHorizontal: width * 0.04,
                  }}>
                  <Text
                    style={{fontSize: width * 0.08, color: typeColor(unitMeter?.meter_name)}}>
                    3,782 Gallons
                  </Text>
                  <RightArrow
                    name="chevron-thin-right"
                    size={width * 0.08}
                    color={typeColor(unitMeter?.meter_name)}
                    style={{alignSelf: 'center', marginRight: width * 0.01}}
                    onPress={() => setHeadView(!headView)}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Check name="check" size={width * 0.05} color="#0fc908" />
                  <Text style={{color: '#5c5c5ccf'}}>As of 5 hours ago</Text>
                </View>
              </MotiView>
            )}
            {headView && (
              <MotiView
                from={{
                  opacity: 0,
                  translateX: 500,
                }}
                animate={{
                  opacity: 1,
                  translateX: 0,
                }}
                style={[
                  styles.currentReadContainer,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <RightArrow
                    name="chevron-thin-left"
                    size={width * 0.08}
                    color={typeColor(unitMeter?.meter_name)}
                    style={{alignSelf: 'center', marginRight: width * 0.01}}
                    onPress={() => setHeadView(!headView)}
                  />
                  <View>
                    <Text style={{color: '#5c5c5ccf', fontSize: width * 0.03}}>
                      PULSES
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: width * 0.03}}>
                      3,786
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginHorizontal: width * 0.02,
                      color: '#5c5c5ccf',
                    }}>
                    x
                  </Text>
                  <View>
                    <Text style={{color: '#5c5c5ccf', fontSize: width * 0.03}}>
                      MULTIPLIER
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: width * 0.03}}>
                      1
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginHorizontal: width * 0.02,
                      color: '#5c5c5ccf',
                    }}>
                    +
                  </Text>
                  <View>
                    <Text style={{color: '#5c5c5ccf', fontSize: width * 0.03}}>
                      IMR
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: width * 0.03}}>
                      21
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginHorizontal: width * 0.02,
                      color: '#5c5c5ccf',
                    }}>
                    =
                  </Text>
                  <View>
                    <Text style={{color: '#5c5c5ccf', fontSize: width * 0.03}}>
                      CURRENT READ
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: width * 0.03}}>
                      3,807
                    </Text>
                  </View>
                </View>
              </MotiView>
            )}
            <View>
              <Button
                title="Quick Actions"
                icon={
                  <Radio
                    name="radio"
                    size={width * 0.06}
                    color="#fff"
                    style={{marginRight: width * 0.025}}
                  />
                }
                buttonStyle={{backgroundColor: typeColor(unitMeter?.meter_name)}}
                onPress={() => console.log('Quick Actions Press')}
              />
            </View>
            {/*
        //* Unit List
        */}
            <SectionList
              style={{marginTop: height * 0.07}}
              contentContainerStyle={{
                width: width,
                paddingHorizontal: width * 0.05,
              }}
              sections={unitData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderUnitList}
              renderSectionHeader={({section: {title, icon, type}}) => (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: width * 0.065}}>{title}</Text>
                    {/* <View
                    style={{
                      width: height * 0.05,
                      height: height * 0.05,
                      backgroundColor: 'blue',
                      alignSelf: 'flex-end',
                    }}
                  /> */}
                    <Icon
                      name={icon}
                      type={type}
                      size={width * 0.08}
                      style={{alignSelf: 'center'}}
                    />
                  </View>
                  <Divider
                    style={{
                      marginBottom: height * 0.02,
                      marginTop: height * 0.01,
                      width: width * 0.9,
                      borderWidth: 0.8,
                    }}
                  />
                </>
              )}
            />
            {/*
        //* Remote Reader List
        */}
            <SectionList
              style={{marginTop: height * 0.07}}
              contentContainerStyle={{
                width: width,
                paddingHorizontal: width * 0.05,
              }}
              sections={remoteReaderData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderRemoteList}
              renderSectionHeader={({section: {title, img}}) => (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: width * 0.065}}>{title}</Text>
                    <Image
                      source={img}
                      style={{
                        height: height * 0.08,
                        width: height * 0.08,
                      }}
                    />
                  </View>
                  <Divider
                    style={{
                      marginBottom: height * 0.02,
                      marginTop: height * 0.01,
                      width: width * 0.9,
                      borderWidth: 0.8,
                    }}
                  />
                </>
              )}
            />
            {openedStatus ? (
              <FlatList
                style={{width: width * 0.9, bottom: width * 0.02}}
                data={statusInfo}
                keyExtractor={(item, index) => item + index}
                renderItem={renderStatusInfo}
                ItemSeparatorComponent={() => (
                  <Divider
                    style={{
                      width: width * 0.9,
                      borderWidth: 0.2,
                      // right: width * 0.05,
                      borderColor: '#8a8a8a6e',
                      backgroundColor: '#5c5c5ccf',
                      flexDirection: 'row',
                    }}
                  />
                )}
              />
            ) : null}
            {/*
        //* Meter Type List
        */}
            <SectionList
              style={{marginTop: height * 0.07}}
              contentContainerStyle={{
                width: width,
                paddingHorizontal: width * 0.05,
              }}
              sections={meterTypeData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderMeterType}
              renderSectionHeader={({section: {title, img}}) => (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: width * 0.065,
                        textTransform: 'capitalize',
                      }}>
                      {unitMeter?.meter_name + ' Meter'}
                    </Text>
                    {/* <View
                    style={{
                      width: height * 0.05,
                      height: height * 0.05,
                      backgroundColor: 'red',
                      alignSelf: 'flex-end',
                    }}
                  /> */}
                    <Image
                      source={img}
                      resizeMode='contain'
                      style={{
                        // backgroundColor: 'red',
                        height: height * 0.09,
                        width: height * 0.09,
                      }}
                    />
                  </View>
                  <Divider
                    style={{
                      marginBottom: height * 0.02,
                      marginTop: height * 0.01,
                      width: width * 0.9,
                      borderWidth: 0.8,
                    }}
                  />
                </>
              )}
            />
            {opened ? (
              <FlatList
                style={{width: width * 0.9, bottom: width * 0.02}}
                data={meterInfoData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderMeterInfo}
                ItemSeparatorComponent={() => (
                  <Divider
                    style={{
                      width: width * 0.9,
                      borderWidth: 0.2,
                      // right: width * 0.05,
                      borderColor: '#8a8a8a6e',
                      backgroundColor: '#5c5c5ccf',
                      flexDirection: 'row',
                    }}
                  />
                )}
              />
            ) : null}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height * 0.07,
                  width: width,
                  justifyContent: 'space-between',
                  paddingHorizontal: width * 0.05,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: width * 0.065}}>Usage</Text>
                {/* <View
                style={{
                  width: height * 0.05,
                  height: height * 0.05,
                  backgroundColor: 'red',
                  alignSelf: 'flex-end',
                }}
              /> */}
                <Icon
                  name="bar-chart"
                  type="fontisto"
                  size={width * 0.08}
                  style={{alignSelf: 'center'}}
                />
              </View>
              <Divider
                style={{
                  marginBottom: height * 0.02,
                  marginTop: height * 0.01,
                  width: width * 0.9,
                  borderWidth: 0.8,
                  left: width * 0.05,
                }}
              />
              {/*
              //todo: Add Chart here 
              */}
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Chart
                  style={{
                    height: height * 0.3,
                    width: width * 0.9,
                  }}
                  data={[
                    {x: -2, y: 15},
                    {x: -1, y: 10},
                    {x: 0, y: 12},
                    {x: 1, y: 7},
                    {x: 2, y: 6},
                    {x: 3, y: 8},
                    {x: 4, y: 10},
                    {x: 5, y: 8},
                    {x: 6, y: 12},
                    {x: 7, y: 14},
                    {x: 8, y: 12},
                    {x: 9, y: 13.5},
                    {x: 10, y: 18},
                  ]}
                  padding={{left: 40, bottom: 20, right: 20, top: 20}}
                  xDomain={{min: -2, max: 10}}
                  yDomain={{min: 0, max: 20}}>
                  <VerticalAxis
                    tickCount={11}
                    theme={{labels: {formatter: (v) => v.toFixed(2)}}}
                  />
                  <HorizontalAxis tickCount={5} />
                  <Area
                    theme={{
                      gradient: {
                        from: {color: '#5D84B6'},
                        to: {color: '#DFDFDF', opacity: 0.4},
                      },
                    }}
                  />
                  <Line
                    theme={{
                      stroke: {color: '#5D84B6', width: 5},
                      scatter: {default: {width: 4, height: 4, rx: 2}},
                    }}
                  />
                </Chart>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        backgroundColor: '#DFDFDF',
                        width: width * 0.03,
                        height: width * 0.03,
                        alignSelf: 'center',
                        marginHorizontal: width * 0.02,
                      }}
                    />
                    <Text>Meter Usage</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        backgroundColor: '#5D84B6',
                        width: width * 0.03,
                        height: width * 0.03,
                        alignSelf: 'center',
                        marginHorizontal: width * 0.02,
                      }}
                    />
                    <Text>Meter Read</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: height * 0.07,
                  width: width,
                  justifyContent: 'space-between',
                  paddingHorizontal: width * 0.05,
                }}>
                <Text style={{fontSize: width * 0.07}}>Danger Zone</Text>
                <Icon
                  name={dangerView ? 'chevron-down' : 'chevron-right'}
                  type="feather"
                  size={width * 0.08}
                  color="#000"
                  onPress={() => setDangerView(!dangerView)}
                />
              </View>
              <Divider
                style={{
                  marginVertical: height * 0.02,
                  width: width * 0.9,
                  borderWidth: 0.8,
                  left: width * 0.05,
                }}
              />
              {!dangerView ? (
                <View />
              ) : (
                <View
                  style={{
                    flexDirection: 'column',
                    width: width * 0.9,
                    alignSelf: 'center',
                    marginBottom: width * 0.05,
                  }}>
                  <Button
                    titleStyle={{textTransform: 'capitalize'}}
                    title={`Delete ${unitMeter?.meter_name} Meter`}
                    buttonStyle={{
                      backgroundColor: '#e24b4b',
                      marginBottom: height * 0.03,
                    }}
                  />
                  <Button
                    titleStyle={{textTransform: 'capitalize'}}
                    title={'Delete ' + data?.data?.unit?.name ?? 'N/A'}
                    buttonStyle={{backgroundColor: '#e24b4b'}}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            width: width,
            height: height * 0.1,
            backgroundColor: '#fff',
            elevation: width * 0.07,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {arrayOfUnits &&
            arrayOfUnits.map((item, index) => (
              <TouchableOpacity
                style={{
                  width: width * 0.15,
                  height: width * 0.13,
                  backgroundColor: 'white',
                  marginHorizontal: width * 0.025,
                  elevation: width * 0.01,
                  borderWidth: width * 0.005,
                  borderColor: typeColor(item.meter_name),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleMeterSelect(item)}>
                {item.id == unitMeter.id && (
                  <View style={{
                    position: 'absolute', 
                    right:width * 0,
                    top:height * 0,
                    width:width * .035,
                    height:width * .035,
                    backgroundColor:typeColor(item.meter_name),
                    alignItems:'center',
                    justifyContent:'center',
                    borderBottomLeftRadius:width * .02
                    }}>
                    <Check name="check" style={{marginLeft:width * .005}} size={width * 0.02} color="#fff" />
                    {/* <Checkbox
                    status={true ? 'checked' : 'unchecked'}
                    // onPress={() => {
                      //   setChecked(!checked);
                      // }}
                    /> */}
                  </View>
                )}
                <Image
                  source={typeSwitcher(item.meter_name)}
                  style={{
                    height: width * 0.06,
                    width: width * 0.055,
                  }}
                />
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  }
};

export default App;
