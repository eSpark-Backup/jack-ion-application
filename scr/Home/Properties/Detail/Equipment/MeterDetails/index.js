import React, {useState, useEffect, useRef} from 'react';
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
  Alert,
  BackHandler,
} from 'react-native';
import {Header, Button, Icon, Divider} from 'react-native-elements';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';
import {View as MotiView} from 'moti';
import {create} from 'apisauce';
import Base_Url from '../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../../../../components/Loader';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Svg, G} from 'react-native-svg';
import {
  VictoryChart,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
  VictoryBar,
  VictoryLine,
} from 'victory-native';

// Components
import styles from './style';
import clc from 'cli-color';
import TextTicker from 'react-native-text-ticker';
const {width, height} = Dimensions.get('window');

const api = create({
  baseURL: Base_Url,
});

const App = ({navigation}) => {
  const scrollViewRef = useRef();

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
  const [meterListArray, setMeterListArray] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [readDate, setReadDate] = useState([]);
  const [meterUsage, setMeterUsage] = useState([]);
  const [meterReadData, setMeterReadData] = useState([]);
  const [meterUsageData, setMeterUsageData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [loadChartData, setLoadChartData] = useState(false);

  let DataDates = ['Nov 09 10 AM', 'Nov 09 11 AM'];

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const getDataSetOne = () => {
    return [
      {
        x: new Date(2021, months.indexOf(DataDates[0]?.slice(0, 3)), 9),
        y: 5,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 9),
        y: 11,
      },
    ];
  };

  const getDataSetTwo = () => {
    return [
      {
        x: new Date(2021, 10, 9),
        y: 5,
      },
      {
        x: new Date(2021, 10, 9),
        y: 6,
      },
    ];
  };

  const getTickValues = () => {
    return [new Date(2021, 10, 9), new Date(2021, 10, 9)];
  };

  const getStyles = () => {
    const BLUE_COLOR = '#00a3de';
    const RED_COLOR = '#7c270b';

    return {
      parent: {
        background: 'red',
        width: width,
        height: height * 0.4,
        fontFamily: "'Fira Sans', sans-serif",
      },
      title: {
        textAnchor: 'start',
        verticalAnchor: 'end',
        fill: '#000000',
        // fontFamily: 'inherit',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      labelNumber: {
        textAnchor: 'middle',
        fill: '#ffffff',
        // fontFamily: 'inherit',
        fontSize: '14px',
      },

      // INDEPENDENT AXIS
      axisYears: {
        axis: {stroke: 'black', strokeWidth: 1},
        ticks: {
          size: ({tick}) => {
            const tickSize = tick.getFullYear() % 5 === 0 ? 10 : 5;
            return tickSize;
          },
          stroke: 'black',
          strokeWidth: 1,
        },
        tickLabels: {
          fill: 'black',
          // fontFamily: 'inherit',
          fontSize: width * 0.025,
        },
      },

      // DATA SET ONE
      axisOne: {
        axis: {stroke: BLUE_COLOR, strokeWidth: 1},
        ticks: {
          strokeWidth: 0,
        },
        tickLabels: {
          fill: '#5D84B6',
          // fontFamily: 'inherit',
          fontSize: width * 0.025,
        },
      },
      labelOne: {
        fill: BLUE_COLOR,
        // fontFamily: 'inherit',
        fontSize: width * 0.025,
        fontStyle: 'italic',
      },
      lineOne: {
        data: {stroke: '#5D84B6', strokeWidth: 2},
      },
      axisOneCustomLabel: {
        fill: BLUE_COLOR,
        // fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: width * 0.025,
      },

      // DATA SET TWO
      axisTwo: {
        axis: {stroke: RED_COLOR, strokeWidth: 1},
        ticks: {strokeWidth: 0},
        tickLabels: {
          fill: 'gray',
          // fontFamily: 'inherit',
          fontSize: width * 0.025,
        },
      },
      labelTwo: {
        textAnchor: 'end',
        fill: RED_COLOR,
        // fontFamily: 'inherit',
        fontSize: width * 0.025,
        fontStyle: 'italic',
      },
      lineTwo: {
        data: {stroke: 'gray', strokeWidth: 4.5},
      },

      // HORIZONTAL LINE
      lineThree: {
        data: {stroke: '#e95f46', strokeWidth: 2},
      },
    };
  };

  const styled = getStyles();
  const dataSetOne = getDataSetOne();
  const dataSetTwo = getDataSetTwo();
  const tickValues = getTickValues();

  const {buildingName, propertyName, meterInfo} = navigation.state.params; //? Dynamic Ids
  console.log('aya kuch ++', navigation.state.params.unitId);

  const testId = navigation.state.params.unitId;

  useEffect(() => {
    getToken();
  }, [testId]);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Tools');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getUnitDetail = async () => {
    const res = await api.get(`/property/equipment/unit/${testId}`);
    console.log('Kia ha Response Data', res.data?.data?.unit?.unit_meter?.[0]);
    setData(res.data);
    console.log('Kia ha Meter INfo Data', meterInfo);
    setUnitMeter(meterInfo);
    let unitMeterId = res.data?.data?.unit?.unit_meter[0]?.id;
    let unitMeterArr = res.data?.data?.unit?.unit_meter;
    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const todayDate = new Date();
    let data = {
      start_date: `2021-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      end_date: `2021-${todayDate.getMonth() + 1}-${todayDate.getDate()}`,
    };

    setLoadChartData(true);

    const chartRes = await api.post(
      `/property/equipment/meter-reading/chart-meter-all/${unitMeterId}`,
      data,
    );
    console.log('Chart Data', chartRes.data?.data);

    if (unitMeterArr.length > 0 && chartRes.data?.data?.dataset.length > 0) {
      console.log('Chala Function');

      getChartData(chartRes);
    }
    setLoadChartData(false);

    setLoading(false);
  };

  const getChartData = (chartRes) => {
    console.log('CHECK Chala.....');
    let MeterUsage = [];
    let ReadData = [];
    let DataSet = [];
    setDataSet(chartRes.data?.data?.dataset);
    setMeterUsage(chartRes.data?.data?.meterUsage);
    setReadDate(chartRes.data?.data?.label);
    MeterUsage = chartRes.data?.data?.meterUsage;
    ReadData = chartRes.data?.data?.label;
    DataSet = chartRes.data?.data?.dataset;

    let Usage7Days = [];
    let Read7Days = [];
    let TotalUsage = MeterUsage.reduce((a, b) => Number(a) + Number(b), 0);

    for (let i = 0; i < chartRes.data?.data?.dataset?.length; i++) {
      let aa = {};
      let bb = {};
      aa.x = new Date(
        new Date().getFullYear(),
        months.indexOf(ReadData[i]?.slice(0, 3)),
        ReadData[i]?.slice(4, 6),
      );
      aa.y = Number(MeterUsage[i]);
      bb.x = new Date(
        new Date().getFullYear(),
        months.indexOf(ReadData[i]?.slice(0, 3)),
        ReadData[i]?.slice(4, 6),
      );
      bb.y = Number(DataSet[i]);
      Usage7Days.push(aa);
      Read7Days.push(bb);
    }

    console.log('Simple Array', Usage7Days, Read7Days);

    const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let readDates = [];
    let usageDates = [];
    let Datadates = [];
    let stringDates = [];
    let newDate = date;
    for (var i = 1; i <= 7; i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      const stringDate = new Date(
        new Date().getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
      );
      stringDates.push(stringDate.toString());
    }

    for (var i = 1; i <= 7; i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      Datadates.push(
        new Date(
          new Date().getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
        ),
      );
    }

    const stringDate = new Date(
      new Date().getFullYear(),
      months.indexOf(ReadData[0]?.slice(0, 3)),
      ReadData[0]?.slice(4, 6),
    );

    const index = stringDates.indexOf(stringDate.toString());

    for (var i = 1; i <= 7; i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      usageDates.push({
        x: new Date(
          new Date().getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
        ),
        y: 0,
      });
    }

    for (var i = 1; i <= 7; i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      readDates.push({
        x: new Date(
          new Date().getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
        ),
        y: i > index ? Math.max(...DataSet) : Math.max(...DataSet) - TotalUsage,
      });
    }

    var dates = new Set(Usage7Days.map((d) => d.x.toString()));
    var Usage7DaysData = [
      ...Usage7Days,
      ...usageDates.filter((d) => !dates.has(d.x.toString())),
    ];
    var Read7DaysData = [
      ...Read7Days,
      ...readDates.filter((d) => !dates.has(d.x.toString())),
    ];

    console.log(
      'Array After Merge Usage',
      Usage7DaysData.sort(function (a, b) {
        return a.x - b.x;
      }),
      'Array After Merge Read',
      Read7DaysData.sort((a, b) => (a.x > b.x ? 1 : -1)),
    );

    setMeterReadData(Read7DaysData);
    setMeterUsageData(Usage7DaysData);
    setDateData(Datadates);
    // setLoadChartData(false);
  };

  const getMeterTypes = async () => {
    const res = await api.get('/property/equipment/meter/all-meters');
    setMeterListArray(res.data?.data);
    console.log('All Meters', res.data?.data);
  };

  const getToken = async () => {
    setLoading(true);
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      api.setHeader('Authorization', 'Bearer ' + token);
      getUnitDetail();
      getMeterTypes();
    }
  };

  const testChartData = [
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
  ];

  const typeSwitcher = (arg) => {
    switch (arg.toLowerCase()) {
      case 'hot water':
        return require('../../../../../../Images/hot-water.png');
      case 'cold water':
        return require('../../../../../../Images/cold-water.png');
      case 'electricity':
        return require('../../../../../../Images/electric.png');
      case 'gas':
        return require('../../../../../../Images/gass.png');
      case 'water':
        return require('../../../../../../Images/all-waters.png');
      default:
        break;
    }
  };

  useEffect(() => {
    console.log('Kia ha unitMeter', data);

    setMeterInfoData([
      {
        leftText: 'Manufacturer',
        rightText: unitMeter?.device?.manufacturer ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Device',
        rightText: unitMeter?.device?.name ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      // {
      //   leftText: 'Unit of Measure',
      //   rightText: unitMeter?.type?.unit_of_measure ?? 'N/A',
      //   leftIcon: null,
      //   type: 'feather',
      // },
      // {
      //   leftText: 'Multiplier',
      //   rightText: unitMeter?.type?.multiplier ?? 'N/A',
      //   leftIcon: null,
      //   type: 'feather',
      // },
      // {
      //   leftText: 'Size',
      //   rightText: unitMeter?.type?.size ?? 'N/A',
      //   leftIcon: null,
      //   type: 'feather',
      // },
      {
        leftText: 'Meter Serial',
        rightText: unitMeter?.meter_serial_number ?? 'N/A',
        leftIcon: 'barcode-outline',
        leftType: 'ionicon',
        type: 'feather',
      },
      // {
      //   leftText: 'Custom ID',
      //   rightText: unitMeter?.custom_meter_id ?? 'N/A',
      //   leftIcon: null,
      //   type: 'feather',
      // },
      // {
      //   leftText: 'IMR',
      //   rightText: 'N/A',
      //   leftIcon: null,
      //   type: 'feather',
      // },
    ]);
    setMeterTypeData([
      {
        title: 'Hot Water Meter',
        // img: meterSwitcher(),
        data: [
          {
            leftName: 'Type',
            rightName:
              unitMeter?.device?.manufacturer +
              ' (' +
              unitMeter?.device?.name +
              ')',
            rightIcon: 'chevron-down',
            type: 'feather',
          },
        ],
      },
    ]);
    setRemoteReaderData([
      {
        title: unitMeter?.device?.device_type,
        img: require('../../../../../../Images/remote-reader.png'),
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
            rightName:
              unitMeter?.installation_status == 1
                ? 'Attempted and installed'
                : 'Attempted but incomplete',
            type: 'feather',
            text: unitMeter?.time_diff
              ? 'As of ' + unitMeter?.time_diff
              : 'As of 5 hours ago',
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
            rightName: unitMeter?.device?.name ?? 'N/A',
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
            leftIcon: 'building',
            leftName: 'Property',
            rightIcon: null,
            rightName: propertyName ?? 'Autumn Plaza',
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
    if (data.length != 0) {
      setLoading(false);
    }
  }, [unitMeter]);
  const meterSwitcher = () => {
    switch (unitMeter?.meter_name[0].name) {
      case 'hot water':
        return require('../../../../../../Images/meter-hot.png');
      case 'cold water':
        return require('../../../../../../Images/meter-cold-water.png');
      case 'electricity':
        return require('../../../../../../Images/meter-electric.png');
      case 'gas':
        return require('../../../../../../Images/meter-gas.png');
      case 'water':
        return require('../../../../../../Images/meter-all-waters.png');
      default:
        break;
    }
  };

  const typeColor = (arg) => {
    switch (arg.toLowerCase()) {
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

  const confirmDelete = () => {
    Alert.alert('Delete Meter', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteMeter()},
    ]);
  };
  const deleteMeter = async () => {
    const response = await api.delete(
      `/property/equipment/unit/unit-meter/${unitMeter.id}`,
    );
    alert(response?.data?.message);
    navigation.navigate('Tools');
  };

  const iconSize = width * 0.05;

  const renderUnitList = ({item, index}) => {
    return data?.data?.unit?.unit_meter?.length == 0 ? (
      index == 1 ? null : (
        <View style={styles.listOuter}>
          <View style={styles.listContainer}>
            <View style={styles.flexRow}>
              {index == 1 ? (
                <Image
                  source={require('../../../../../../Images/remote-reader.png')}
                  style={styles.imgHeader}
                />
              ) : (
                <Icon
                  name={item.leftIcon}
                  type={item.type}
                  size={iconSize}
                  color={'#000'}
                  style={{marginRight: width * 0.03}}
                />
              )}
              <Text style={styles.listText}>{item.leftName}</Text>
            </View>
            <View style={styles.flexRow}>
              {item.rightName == null ? null : (
                <Text
                  style={[
                    styles.listText,
                    {
                      textTransform: 'capitalize',
                      // color: index == 1 ? typeColor(item.rightName) : '#000',
                    },
                  ]}>
                  {item.rightName}
                </Text>
              )}
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.typeRight}
                  size={iconSize}
                  color="#000"
                  style={styles.centerIcon}
                />
              )}
            </View>
          </View>
          <Divider style={styles.listDivider} />
        </View>
      )
    ) : (
      <View style={styles.listOuter}>
        <View style={styles.listContainer}>
          <View style={styles.flexRow}>
            {index == 1 ? (
              <Image
                source={require('../../../../../../Images/remote-reader.png')}
                style={styles.imgHeader}
              />
            ) : (
              <Icon
                name={item.leftIcon}
                type={item.type}
                size={iconSize}
                color={'#000'}
                style={{marginRight: width * 0.03}}
              />
            )}
            <Text style={styles.listText}>{item.leftName}</Text>
          </View>
          <View style={styles.flexRow}>
            {item.rightName == null ? null : (
              <Text
                style={[
                  styles.listText,
                  {
                    textTransform: 'capitalize',
                    // color: index == 1 ? typeColor(item.rightName) : '#000',
                  },
                ]}>
                {item.rightName}
              </Text>
            )}
            {item.rightIcon == null ? null : (
              <Icon
                name={item.rightIcon}
                type={item.typeRight}
                size={iconSize}
                color="#000"
                style={styles.centerIcon}
              />
            )}
          </View>
        </View>
        <Divider style={styles.listDivider} />
      </View>
    );
  };

  const renderRemoteList = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item.leftName == 'Status' ? false : true}
        onPress={() => {
          openStatusView(), setDangerView(false);
        }}>
        <View style={styles.listOuter}>
          <View style={styles.listContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.listText}>{item.leftName}</Text>
            </View>
            <View style={styles.flexRow}>
              <View style={styles.flexColumn}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <Text
                      style={[
                        styles.listText,
                        {
                          backgroundColor:
                            index == 1
                              ? unitMeter?.installation_status == 1
                                ? '#0fc908'
                                : '#f00'
                              : null,
                          color: index == 1 ? '#fff' : null,
                          borderRadius: 5,
                          padding: 2,
                          fontWeight: 'bold',
                        },
                      ]}>
                      {item.rightName}
                    </Text>
                  )}
                  {item.rightIcon2 == null ? null : (
                    <Icon
                      name={item.rightIcon2}
                      type={item.type}
                      size={iconSize}
                      color={
                        unitMeter?.installation_status == 1 ? '#0fc908' : '#f00'
                      }
                      style={{marginRight: width * 0.01}}
                    />
                  )}
                </View>
                {item.text && (
                  <Text style={[styles.listGreyText, {textAlign: 'right'}]}>
                    {item.text}
                  </Text>
                )}
              </View>
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.type}
                  size={iconSize}
                  color="#000"
                  style={styles.centerIcon}
                />
              )}
            </View>
          </View>
          <Divider style={styles.listDivider} />
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
      <TouchableOpacity
        onPress={() => {
          openView(), setDangerView(false);
        }}>
        <View style={styles.listOuter}>
          <View style={styles.listContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.listText}>{item.leftName}</Text>
            </View>
            <View style={styles.flexRow}>
              <View style={styles.flexColumn}>
                <View
                  style={{flexDirection: 'row-reverse', width: width * 0.6}}>
                  {item.rightName == null ? null : (
                    <TextTicker
                      duration={6000}
                      repeatSpacer={width * 0.6}
                      marqueeDelay={2000}
                      style={[
                        styles.listText,
                        {
                          textAlign: 'right',
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {item.rightName}
                    </TextTicker>
                  )}
                </View>
              </View>
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.type}
                  size={iconSize}
                  color="#000"
                  style={styles.centerIcon}
                />
              )}
            </View>
          </View>
          <Divider style={styles.listDivider} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMeterInfo = ({item}) => {
    return (
      <View style={styles.listInner}>
        <View style={styles.listInnerContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.listInnerText}>{item.leftText}</Text>
            {item.leftIcon == null ? null : (
              <Icon
                name={item.leftIcon}
                type={item.leftType}
                size={iconSize}
                color={'rgb(90,134,183)'}
                style={{marginLeft: width * 0.03, alignSelf: 'center'}}
              />
            )}
          </View>
          <View style={styles.flexRow}>
            <Text style={[styles.listInnerText, {textTransform: 'capitalize'}]}>
              {item.rightText}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStatusInfo = ({item}) => {
    return (
      <View style={styles.listInner}>
        <View style={styles.listInnerContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.listGreyText}>{item.leftText}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text
              style={[
                styles.listInnerText,
                {
                  color: item.bold ? '#000' : '#8c8c8c',
                },
              ]}>
              {item.rightText}
            </Text>
            {item.icon == null ? null : (
              <Icon
                name={item.icon}
                type={item.type}
                size={iconSize}
                color={'#000'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  console.log(clc.red('data', JSON.stringify(data.data)));

  if (loading) {
    return <Loader />;
  } else {
    return (
      <View style={{flex: 1}}>
        <Header
          leftComponent={{
            text: 'Close',
            style: {fontSize: iconSize, color: '#000'},
            onPress: () => navigation.navigate('Tools'),
          }}
          centerComponent={
            <View style={styles.flexRow}>
              <Home
                name="home"
                size={iconSize}
                color="#000"
                style={{alignSelf: 'center', marginRight: width * 0.01}}
              />
              <Text style={{fontSize: iconSize}}>Meter Details</Text>
            </View>
          }
          backgroundColor="#fff"
          containerStyle={styles.headerContainer}
        />
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            if (dangerView) {
              scrollViewRef.current.scrollToEnd({animated: true});
            }
          }}>
          <View style={styles.container}>
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
                <View style={styles.currentReadInnerContainer}>
                  <Text
                    style={{
                      fontSize: width * 0.08,
                      // color: typeColor(unitMeter?.meter_name),
                      color: '#639CC7',
                    }}>
                    {unitMeter?.meter_read?.meter_reading
                      ? unitMeter?.meter_read?.meter_reading
                      : 0}{' '}
                    Gallons
                  </Text>
                  <RightArrow
                    name="chevron-thin-right"
                    size={width * 0.08}
                    // color={typeColor(unitMeter?.meter_name)}
                    color={'#639CC7'}
                    style={{alignSelf: 'center', marginRight: width * 0.01}}
                    onPress={() => setHeadView(!headView)}
                  />
                </View>
                <View style={styles.flexRow}>
                  <Check name="check" size={iconSize} color="#0fc908" />
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
                    // color={typeColor(unitMeter?.meter_name)}
                    color={'#639CC7'}
                    style={{alignSelf: 'center', marginRight: width * 0.01}}
                    onPress={() => setHeadView(!headView)}
                  />
                  <View>
                    <Text style={styles.greyText}>PULSES</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>3,786</Text>
                  </View>
                  <Text style={styles.symbolStyle}>x</Text>
                  <View>
                    <Text style={styles.greyText}>MULTIPLIER</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>1</Text>
                  </View>
                  <Text style={styles.symbolStyle}>+</Text>
                  <View>
                    <Text style={styles.greyText}>IMR</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>21</Text>
                  </View>
                  <Text style={styles.symbolStyle}>=</Text>
                  <View>
                    <Text style={styles.greyText}>CURRENT READ</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>3,807</Text>
                  </View>
                </View>
              </MotiView>
            )}
            <View>
              <Button
                title="Quick Actions"
                titleStyle={{color: '#000'}}
                icon={
                  <Radio
                    name="radio"
                    size={width * 0.06}
                    // color="#fff"
                    color="#000"
                    style={{marginRight: width * 0.025}}
                  />
                }
                buttonStyle={{
                  // backgroundColor: typeColor(unitMeter?.meter_name),
                  backgroundColor: 'transparent',
                }}
                onPress={() => console.log('Quick Actions Press')}
              />
            </View>
            {/*
        //* Unit List
        */}
            <SectionList
              style={styles.sectionStyle}
              contentContainerStyle={styles.sectionContainer}
              sections={unitData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderUnitList}
              renderSectionHeader={({section: {title, icon, type}}) => (
                <>
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionText}>{title}</Text>
                    <Icon
                      name={icon}
                      type={type}
                      size={width * 0.08}
                      style={styles.centerIcon}
                    />
                  </View>
                  <Divider style={styles.sectionTitleDivider} />
                </>
              )}
            />
            {/*
        //* Remote Reader List
        */}
            <SectionList
              style={styles.sectionStyle}
              contentContainerStyle={styles.sectionContainer}
              sections={remoteReaderData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderRemoteList}
              renderSectionHeader={({section: {title, img}}) => (
                <>
                  <View style={styles.sectionTitle}>
                    <Text style={styles.sectionText}>{title}</Text>
                    <Image source={img} style={styles.sectionImgStyle} />
                  </View>
                  <Divider style={styles.sectionTitleDivider} />
                </>
              )}
            />
            {openedStatus ? (
              <FlatList
                style={styles.statusList}
                data={statusInfo}
                keyExtractor={(item, index) => item + index}
                renderItem={renderStatusInfo}
                ItemSeparatorComponent={() => (
                  <Divider style={[styles.listDivider, {marginTop: 0}]} />
                )}
              />
            ) : null}
            {/*
        //* Meter Type List
        */}
            <SectionList
              style={styles.sectionStyle}
              contentContainerStyle={styles.sectionContainer}
              sections={meterTypeData}
              keyExtractor={(item, index) => item + index}
              renderItem={renderMeterType}
              renderSectionHeader={({section: {title, img}}) => (
                <>
                  <View style={styles.sectionTitle}>
                    <Text
                      style={[
                        styles.sectionText,
                        {
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {unitMeter?.device?.name ?? 'N/A'}
                    </Text>
                    <Image
                      source={img}
                      resizeMode="contain"
                      style={styles.meterTypeImg}
                    />
                  </View>
                  <Divider style={styles.sectionTitleDivider} />
                </>
              )}
            />
            {opened ? (
              <FlatList
                style={styles.statusList}
                data={meterInfoData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderMeterInfo}
                ItemSeparatorComponent={() => (
                  <Divider style={[styles.listDivider, {marginTop: 0}]} />
                )}
              />
            ) : null}
            <View>
              <View style={styles.usageTextContainer}>
                <Text style={styles.sectionText}>Usage</Text>
                <Icon
                  name="bar-chart"
                  type="fontisto"
                  size={width * 0.08}
                  style={styles.centerIcon}
                />
              </View>
              <Divider
                style={[
                  styles.sectionTitleDivider,
                  {
                    left: iconSize,
                  },
                ]}
              />
              {/*
              //todo: Add Chart here 
              */}
              <View style={styles.centerIcon}>
                {meterReadData.length > 0 ? (
                  <Svg style={styled.parent}>
                    <G transform={'translate(0, -10)'}>
                      {/* <VictoryChart> */}

                      <VictoryBar
                        // data={dataSetTwo}
                        data={
                          meterUsageData.length > 0
                            ? meterUsageData
                            : dataSetTwo
                        }
                        barWidth={width * 0.1}
                        standalone={false}
                        domainPadding={{
                          x: width * 0.05,
                        }}
                        labels={({datum, index}) => `${datum.y}`}
                        style={{
                          data: {fill: '#DFDFDF'},
                          labels: {
                            fontSize: width * 0.02,
                          },
                        }}
                        labelComponent={<VictoryLabel dy={15} />}
                      />

                      {/* Dependent axis for data set one. */}
                      <VictoryAxis
                        dependentAxis
                        domain={[
                          dataSet?.length > 0 && meterUsage.length > 0
                            ? Math.max(...meterUsage) > 0
                              ? dataSet[0] - Math.max(...meterUsage)
                              : 0
                            : 0,
                          // 11,
                          dataSet?.length > 0
                            ? dataSet[dataSet?.length - 1]
                            : 0,
                        ]}
                        offsetX={50}
                        orientation="left"
                        standalone={false}
                        style={styled.axisOne}
                      />

                      {/* Dataset one */}
                      <VictoryLine
                        data={
                          meterReadData.length > 0 ? meterReadData : dataSetOne
                        }
                        // data={dataSetOne}
                        domainPadding={{x: [width * 0.05, 0], y: [1, 1]}}
                        domain={
                          readDate.length > 0 && meterReadData.length > 0
                            ? {
                                x: [
                                  meterReadData[0]?.x,
                                  meterReadData[meterReadData.length - 1]?.x,
                                ],
                                y: [
                                  meterUsage.length > 0
                                    ? Math.max(...meterUsage) > 0
                                      ? dataSet[0] - Math.max(...meterUsage)
                                      : 0
                                    : 0,
                                  // 16,
                                  dataSet?.length > 0
                                    ? dataSet[dataSet?.length - 1]
                                    : 0,
                                ],
                              }
                            : {
                                x: [
                                  new Date(2021, 10, 13),
                                  new Date(2021, 10, 19),
                                ],
                                y: [
                                  dataSet?.length > 0 ? dataSet[0] : 0,
                                  // 11,

                                  dataSet?.length > 0
                                    ? dataSet[dataSet?.length - 1]
                                    : 0,
                                ],
                              }
                        }
                        interpolation="monotoneX"
                        scale={{x: 'time', y: 'linear'}}
                        standalone={false}
                        style={styled.lineOne}
                      />

                      {/* Dependent axis for data set two. */}
                      <VictoryAxis
                        dependentAxis
                        domain={[
                          Math.max(...meterUsage) < 1 ? -1 : 0,
                          // 6,
                          meterUsage.length > 0 ? Math.max(...meterUsage) : 0,
                        ]}
                        orientation="right"
                        standalone={false}
                        style={styled.axisTwo}
                        // tickFormat={(x) => `${x / 1000000}`}
                      />

                      <VictoryAxis
                        scale="time"
                        standalone={false}
                        style={styled.axisYears}
                        // tickValues={tickValues}
                        tickValues={dateData.length > 0 ? dateData : tickValues}
                        tickFormat={(date) =>
                          months[date.getMonth()] +
                          ' ' +
                          (date.getDate() > 9
                            ? `${date.getDate()}`
                            : `0${date.getDate()}`)
                        }
                        domainPadding={{x: width * 0.05, y: height * 0.5}}
                      />
                      {/* </VictoryChart> */}
                    </G>
                  </Svg>
                ) : (
                  <View
                    style={{
                      height: height * 0.3,
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontSize: width * 0.06}}>
                      {loadChartData
                        ? 'Loading Data...'
                        : 'No Data for this Week'}
                    </Text>
                  </View>
                )}
                {/* <Chart
                  style={styles.chartStyle}
                  data={testChartData}
                  padding={styles.chartPadding}
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
                </Chart> */}
                <View style={styles.legendContainer}>
                  <View style={styles.flexRow}>
                    <View style={styles.meterUsageBox} />
                    <Text>Meter Usage</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <View style={styles.meterReadBox} />
                    <Text>Meter Read</Text>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.usageTextContainer}
                onPress={() => {
                  setDangerView(!dangerView);
                }}>
                <Text style={{fontSize: width * 0.07}}>Danger Zone</Text>
                <Icon
                  name={dangerView ? 'chevron-down' : 'chevron-right'}
                  type="feather"
                  size={width * 0.08}
                  color="#000"
                />
              </TouchableOpacity>
              <Divider style={styles.dangerHeader} />
              {!dangerView ? (
                <View />
              ) : (
                <View style={styles.dangerView}>
                  <Button
                    onPress={confirmDelete}
                    titleStyle={{textTransform: 'capitalize'}}
                    title={`Delete ${unitMeter?.device?.name ?? 'N/A'}`}
                    buttonStyle={styles.dangerBtn}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default App;
