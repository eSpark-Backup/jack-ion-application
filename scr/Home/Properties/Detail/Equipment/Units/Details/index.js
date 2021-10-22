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

// Components
import styles from './style';
import {Divider} from 'react-native-paper';
import {color} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

const api = create({
  baseURL: Base_Url,
});

const App = ({navigation}) => {
  const [dangerView, setDangerView] = useState(false);
  const [headView, setHeadView] = useState(false);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const {unitId, buildingName} = navigation.state.params; //? Dynamic Ids
  console.log('aya kuch ++', navigation.state.params);

  const testId = '105';

  useEffect(() => {
    getToken();
  }, []);

  const getUnitDetail = async () => {
    const res = await api.get(`/property/equipment/unit/${testId}`);
    console.log('Kia ha Response Data', res.data);
    setData(res.data);
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

  const unitData = [
    {
      title: 'Unit',
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
          leftIcon: 'md-water-outline',
          leftName: 'Utility Type',
          rightIcon: 'chevron-down',
          rightName: 'All Water',
          type: 'ionicon',
          typeRight: 'feather',
        },
        {
          leftIcon: 'building',
          leftName: 'Building',
          rightIcon: 'chevron-down',
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
  ];

  const unit_meter = data?.data?.unit?.['unit-meter']?.[0];

  const remoteReaderData = [
    {
      title: 'Remote Reader',
      data: [
        {
          leftName: 'Serial Number',
          rightIcon: 'barcode-outline',
          rightName: unit_meter?.device_serial_number ?? 'N/A',
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
  ];

  const meterTypeData = [
    {
      title: 'All Water Meter',
      data: [
        {
          leftName: 'Type',
          rightName: 'PD19 Poly (x1 Gallons)',
          rightIcon: 'chevron-down',
          type: 'feather',
        },
      ],
    },
  ];

  const meterInfoData = [
    {
      leftText: 'Manufacturer',
      rightText: unit_meter?.type.manufacturer ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Model',
      rightText: unit_meter?.type.model ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Unit of Measure',
      rightText: unit_meter?.type.unit_of_measure ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Multiplier',
      rightText: unit_meter?.type.multiplier ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Size',
      rightText: unit_meter?.type.size ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Meter Serial',
      rightText: unit_meter?.meter_serial_number ?? 'N/A',
      leftIcon: 'barcode-outline',
      leftType: 'ionicon',
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'Custom ID',
      rightText: unit_meter?.custom_meter_id ?? 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
    {
      leftText: 'IMR',
      rightText: 'N/A',
      leftIcon: null,
      rightIcon: 'chevron-down',
      type: 'feather',
    },
  ];

  const renderUnitList = ({item, index}) => {
    return (
      <View style={{paddingVertical: width * 0.02}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name={item.leftIcon}
              type={item.type}
              size={width * 0.05}
              color={index == 1 ? 'rgb(90,134,183)' : '#000'}
              style={{alignSelf: 'center', marginRight: width * 0.03}}
            />
            <Text style={{fontSize: width * 0.03}}>{item.leftName}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {item.rightName == null ? null : (
              <Text
                style={{
                  color: index == 1 ? 'rgb(90,134,183)' : '#000',
                  fontSize: width * 0.03,
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
        {index == 0 ? (
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
        ) : (
          <Divider
            style={{
              marginTop: height * 0.02,
              borderWidth: 0.2,
              width: width * 0.9,
              right: width * 0.1,
              flexDirection: 'row',
            }}
            inset
          />
        )}
      </View>
    );
  };

  const renderRemoteList = ({item, index}) => {
    return (
      <View style={{paddingVertical: width * 0.02}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: width * 0.03}}>{item.leftName}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row-reverse'}}>
                {item.rightName == null ? null : (
                  <Text style={{textAlign: 'right', fontSize: width * 0.03}}>
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
              <Text style={{color: '#5c5c5ccf', fontSize: width * 0.03}}>
                {item.text}
              </Text>
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
            right: width * 0.1,
            flexDirection: 'row',
          }}
          inset
        />
      </View>
    );
  };

  const openView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpened(!opened);
  };

  const renderMeterType = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => openView()}>
        <View style={{paddingVertical: width * 0.02}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: width * 0.03}}>{item.leftName}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <Text
                      style={{
                        textAlign: 'right',
                        fontSize: width * 0.03,
                      }}>
                      {item.rightName}
                    </Text>
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
              right: width * 0.1,
              flexDirection: 'row',
            }}
            inset
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
            <Text style={{fontSize: width * 0.025}}>{item.leftText}</Text>
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
            <Text style={{fontSize: width * 0.025}}>{item.rightText}</Text>
            <Icon
              name={item.rightIcon}
              type={item.type}
              size={width * 0.05}
              color="#000"
              style={{alignSelf: 'center'}}
            />
          </View>
        </View>
      </View>
    );
  };

  console.log('data', data);
  return (
    <ScrollView>
      {loading ? (
        <Loader />
      ) : (
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
                  style={{fontSize: width * 0.08, color: 'rgb(90,134,183)'}}>
                  3,782 Gallons
                </Text>
                <RightArrow
                  name="chevron-thin-right"
                  size={width * 0.08}
                  color="rgb(90,134,183)"
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
                  color="rgb(90,134,183)"
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
                  style={{marginHorizontal: width * 0.02, color: '#5c5c5ccf'}}>
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
                  style={{marginHorizontal: width * 0.02, color: '#5c5c5ccf'}}>
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
                  style={{marginHorizontal: width * 0.02, color: '#5c5c5ccf'}}>
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
              buttonStyle={{backgroundColor: 'rgb(90,134,183)'}}
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
            renderSectionHeader={({section: {title}}) => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: width * 0.07}}>{title}</Text>
                  <View
                    style={{
                      width: height * 0.05,
                      height: height * 0.05,
                      backgroundColor: 'blue',
                      alignSelf: 'flex-end',
                    }}
                  />
                </View>
                <Divider
                  style={{
                    marginVertical: height * 0.02,
                    width: width,
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
            renderSectionHeader={({section: {title}}) => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: width * 0.07}}>{title}</Text>
                  <View
                    style={{
                      width: height * 0.05,
                      height: height * 0.05,
                      backgroundColor: 'red',
                      alignSelf: 'flex-end',
                    }}
                  />
                </View>
                <Divider
                  style={{
                    marginVertical: height * 0.02,
                    width: width,
                    borderWidth: 0.8,
                  }}
                />
              </>
            )}
          />
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
            renderSectionHeader={({section: {title}}) => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: width * 0.07}}>{title}</Text>
                  <View
                    style={{
                      width: height * 0.05,
                      height: height * 0.05,
                      backgroundColor: 'red',
                      alignSelf: 'flex-end',
                    }}
                  />
                </View>
                <Divider
                  style={{
                    marginVertical: height * 0.02,
                    width: width,
                    borderWidth: 0.8,
                  }}
                />
              </>
            )}
          />
          {opened ? (
            <FlatList
              style={{width: width, bottom: width * 0.02}}
              data={meterInfoData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderMeterInfo}
              ItemSeparatorComponent={() => (
                <Divider
                  style={{
                    width: width * 0.9,
                    borderWidth: 0.2,
                    right: width * 0.05,
                    borderColor: '#8a8a8a6e',
                    backgroundColor: '#5c5c5ccf',
                    flexDirection: 'row',
                  }}
                  inset
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
              }}>
              <Text style={{fontSize: width * 0.07}}>Usage</Text>
              <View
                style={{
                  width: height * 0.05,
                  height: height * 0.05,
                  backgroundColor: 'red',
                  alignSelf: 'flex-end',
                }}
              />
            </View>
            <Divider
              style={{
                marginVertical: height * 0.02,
                width: width,
                borderWidth: 0.8,
                left: width * 0.05,
              }}
            />
            <View
              style={{
                width: width * 0.9,
                height: height * 0.3,
                backgroundColor: 'green',
                alignSelf: 'center',
              }}
            />
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
                width: width,
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
                  width: width * 0.95,
                  alignSelf: 'center',
                  marginBottom: width * 0.05,
                }}>
                <Button
                  title="Delete Water Meter"
                  buttonStyle={{
                    backgroundColor: '#e24b4b',
                    marginBottom: height * 0.03,
                  }}
                />
                <Button
                  title="Delete Unit 101"
                  buttonStyle={{backgroundColor: '#e24b4b'}}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default App;
