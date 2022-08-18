import React, {useState, useEffect, useRef} from 'react';
import {
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
import Modal from 'react-native-modal';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';
import {View as MotiView} from 'moti';
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
import API from '../../../../../api/SeviceApi';
import TextReuseableComponent from '../../../../../components/Text/index';

const {width, height} = Dimensions.get('window');

const App = ({navigation}) => {
  const scrollViewRef = useRef();

  const [dangerView, setDangerView] = useState(false);
  const [installStatusView, setInstallStatusView] = useState(false);
  const [headView, setHeadView] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openedStatus, setOpenedStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [unitMeter, setUnitMeter] = useState([]);
  const [reasonsData, setReasonsData] = useState([]);
  const [reasonDataIndex, setReasonDataIndex] = useState(null);
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

  const changeStatus = async () => {
    const UnitData = data?.data?.unit;
    const UnitMeters = UnitData?.unit_meter;
    const MeterIndex = UnitMeters.findIndex((i) => i.id == meterInfo.id);
    let unitData = {...UnitData};

    const defaultUnitData = await API.get(
      `/property/default-meter-device/${UnitData.property.id}`,
    );

    const defaultDis =
      defaultUnitData?.data?.data?.defaultLocation?.radial_dist;

    unitData.unit_meter[MeterIndex].installation_status = '1';
    unitData.unit_meter.map((i, index) => {
      unitData.unit_meter[index].defaultLatitude = UnitData.property.latitude;
      unitData.unit_meter[index].defaultLongitude = UnitData.property.longitude;
    });
    let meters = unitData.unit_meter;

    unitData.meters = meters;
    unitData.defaultRadial_dist = defaultDis * 1000;

    // unitData['meters'] = unitData['unit_meter'];
    delete unitData['unit_meter']; // Delete old key

    console.log('UNIT DATA', unitData);
    const UpdateData = await API.post(
      `/property/equipment/unit/update-unit/${testId}`,
      unitData,
    );
    console.log('UPDATE DATA RES', UpdateData.data);
    if (UpdateData?.data?.bool) {
      setInstallStatusView(false);
      setLoading(true);
      Alert.alert('Success', 'Status Changed Successfully');
      const meterResponse = await API.post(
        `/property/equipment/unit/get-meter-info`,
        {device_serial_number: meterInfo.device_serial_number},
      );
      console.log('meterResponse DATA RES', meterResponse?.data);
      if (meterResponse?.data?.bool) {
        getToken(meterResponse?.data?.data?.meterinfo);
      }
    }
  };

  const getUnitDetail = async (meterData) => {
    const res = await API.get(`/property/equipment/unit/${testId}`);
    console.log('Kia ha Response Data', res.data?.data?.unit?.unit_meter?.[0]);
    setData(res.data);
    let unitMeterId = res.data?.data?.unit?.unit_meter[0]?.id;
    let unitMeterArr = res.data?.data?.unit?.unit_meter;
    console.log('Kia ha Meter INfo Data', meterInfo);
    console.log(
      'Kia ha Meter Index',
      unitMeterArr.findIndex((i) => i.id == meterInfo.id),
    );
    if (meterData) {
      console.log('DATA RECEIVED');
      setUnitMeter(meterData);
      if (meterData.installation_status == 2) {
        setInstallStatusView(true);
      }
    } else {
      console.log('DATA Not RECEIVED');
      setUnitMeter(meterInfo);
      if (meterInfo.installation_status == 2) {
        setInstallStatusView(true);
      }
    }

    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const todayDate = new Date();
    let data = {
      start_date: `2021-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      end_date: `2021-${todayDate.getMonth() + 1}-${todayDate.getDate()}`,
    };

    setLoadChartData(true);

    const chartRes = await API.post(
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
    const res = await API.get('/property/equipment/meter/all-meters');
    setMeterListArray(res.data?.data);
    console.log('All Meters', res.data?.data);
  };

  const getToken = async (data) => {
    setLoading(true);

    getUnitDetail(data);
    getMeterTypes();
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
    let reasonList = [];
    for (let i = 0; i < unitMeter?.reasons?.length; i++) {
      let reasonData = unitMeter?.reasons[i];
      let data = {
        leftName: 'Reason' + ' ' + (i + 1),
        rightName: reasonData.name,
        rightIcon: 'chevron-down',
        type: 'feather',
        data: [
          {
            leftText: 'Description',
            rightText: reasonData.text_reason ?? 'N/A',
            leftIcon: null,
            type: 'feather',
          },
          {
            leftText: 'Picture',
            rightText: reasonData.picture ?? 'N/A',
            leftIcon: null,
            type: 'feather',
          },
        ],
      };

      console.log('Reason Picture', reasonData.picture);
      reasonList.push(data);
    }
    console.log('Reason List', reasonList);

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
    setReasonsData([
      {
        title: 'Reasons',
        // img: meterSwitcher(),
        data: reasonList,
      },
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
        title: unitMeter?.device_serial_number
          ? unitMeter?.device?.device_type
          : 'No Device Programmed',
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
            rightIcon2: unitMeter?.installation_status == 1 ? 'check' : 'x',
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
    const response = await API.post(
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
              <TextReuseableComponent title style={styles.listText} value={item.leftName} />
            </View>
            <View style={styles.flexRow}>
              {item.rightName == null ? null : (
                <TextReuseableComponent title style={[
                  styles.listText,
                  {
                    textTransform: 'capitalize',
                  },
                ]} value={item.rightName} />
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
            <TextReuseableComponent title style={styles.listText} value={item.leftName} />
          </View>
          <View style={styles.flexRow}>
            {item.rightName == null ? null : (
              <TextReuseableComponent title style={[
                styles.listText,
                {
                  textTransform: 'capitalize',
                },
              ]} value={item.rightName} />
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
              <TextReuseableComponent title style={styles.listText} value={item.leftName} />
            </View>
            <View style={styles.flexRow}>
              <View style={styles.flexColumn}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <TextReuseableComponent title style={[
                      styles.listText,
                      {
                        backgroundColor:
                          index == 1
                            ? unitMeter?.installation_status == 1
                              ? '#0fc908'
                              : '#f00'
                            : null,
                        color: index == 1 ? '#fff' : '#000',
                        borderRadius: 5,
                        padding: 2,
                      },
                    ]} value={item.rightName} />
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
                  <TextReuseableComponent title style={[styles.listGreyText, {textAlign: 'right'}]} value={item.text} />
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

  const openReasonData = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setReasonDataIndex(index == reasonDataIndex ? null : index);
  };

  const openStatusView = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenedStatus(!openedStatus);
  };

  const renderReasonData = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            openReasonData(index), setDangerView(false);
          }}>
          <View style={styles.listOuter}>
            <View style={styles.listContainer}>
              <View style={styles.flexRow}>
                <TextReuseableComponent title style={styles.listText} value={item.leftName} />
              </View>
              <View style={styles.flexRow}>
                <View style={styles.flexColoum}>
                  <View
                    style={{flexDirection: 'row-reverse', width: width * 0.6}}>
                    {item.rightName == null ? null : (
                      <TextTicker
                        duration={6000}
                        marqueeDelay={2000}
                        repeatSpacer={width * 0.6}
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
                    size={width * 0.05}
                    color="#000"
                    style={styles.centerIcon}
                  />
                )}
              </View>
            </View>
            <Divider style={styles.listDivider} />
          </View>
        </TouchableOpacity>
        {index == reasonDataIndex && (
          <FlatList
            style={styles.statusList}
            data={item.data}
            keyExtractor={(item, index) => item + index}
            renderItem={renderReasonInfo}
            ItemSeparatorComponent={() => (
              <Divider style={[styles.listDivider, {marginTop: 0}]} />
            )}
          />
        )}
      </View>
    );
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
              <TextReuseableComponent title style={styles.listText} value={item.leftName} />
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

  const renderReasonInfo = ({item}) => {
    return (
      <View style={styles.listInner}>
        <View style={styles.listInnerContainer}>
          <View style={styles.flexRow}>
            <TextReuseableComponent title style={styles.listInnerText} value={item.leftText} />
            {item.leftIcon == null ? null : (
              <Icon
                name={item.leftIcon}
                type={item.leftType}
                size={width * 0.05}
                color={'rgb(90,134,183)'}
                style={styles.leftedIcon}
              />
            )}
          </View>
          <View style={styles.flexRow}>
            {item.leftText == 'Picture' && item.rightText != 'N/A' ? (
              <Image
                style={{
                  width: width * 0.25,
                  height: width * 0.2,
                }}
                source={{
                  uri: item.rightText,
                }}
              />
            ) : (
              <TextReuseableComponent title style={styles.listInnerText} value={item.rightText} />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderMeterInfo = ({item}) => {
    return (
      <View style={styles.listInner}>
        <View style={styles.listInnerContainer}>
          <View style={styles.flexRow}>
            <TextReuseableComponent title style={styles.listInnerText} value={item.leftText} />
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
            <TextReuseableComponent title style={[styles.listInnerText, {textTransform: 'capitalize'}]} value={item.rightText} />
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
            <TextReuseableComponent title style={styles.listGreyText} value={item.leftText} />
          </View>
          <View style={styles.flexRow}>
            <TextReuseableComponent title style={[
                styles.listInnerText,
                {
                  color: item.bold ? '#000' : '#8c8c8c',
                },
              ]} value={item.rightText} />
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
        <Modal isVisible={installStatusView}>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              borderRadius: 10,
              paddingVertical: width * 0.02,
            }}>
            <TextReuseableComponent title style={{fontSize: width * 0.06}} value={"Installation Status"} />
            <TextReuseableComponent title style={{textAlign: 'center', paddingVertical: width * 0.02}} value={"Meter not installed completely would you like to change the status?"} />
            <TouchableOpacity onPress={changeStatus} style={styles.attemptBtn}>
              <TextReuseableComponent title style={styles.attemptText} value={"Attempted and installed"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setInstallStatusView(false)}
              style={{...styles.attemptBtn, backgroundColor: 'red'}}>
              <TextReuseableComponent title style={styles.attemptText} value={"Stay Incomplete"} />
            </TouchableOpacity>
          </View>
        </Modal>
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
              <TextReuseableComponent title style={{fontSize: iconSize}} value={"Meter Details"} />
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
                <TextReuseableComponent title style={{color: '#5c5c5ccf'}} value={"CURRENT READ"} />
                <View style={styles.currentReadInnerContainer}>
                  <TextReuseableComponent title style={{
                      color: '#639CC7',
                    }} value={`${unitMeter?.meter_read?.meter_reading
                      ? unitMeter?.meter_read?.meter_reading
                      : 0} Gallons`} />
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
                  <TextReuseableComponent title style={{color: '#5c5c5ccf'}} value={"As of 5 hours ago"} />
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
                    <TextReuseableComponent title style={styles.greyText} value={"PULSES"} />
                    <TextReuseableComponent title style={[styles.text, {color: '#639CC7'}]} value={"3,786"} />
                  </View>
                  <TextReuseableComponent title style={styles.symbolStyle} value={"x"} />
                  <View>
                    <TextReuseableComponent title style={styles.greyText} value={"MULTIPLIER"} />
                    <TextReuseableComponent title style={[styles.text, {color: '#639CC7'}]} value={"1"} />
                  </View>
                  <TextReuseableComponent title style={styles.symbolStyle} value={"+"} />
                  <View>
                    <TextReuseableComponent title style={styles.greyText} value={"IMR"} />
                    <TextReuseableComponent title style={[styles.text, {color: '#639CC7'}]} value={"21"} />
                  </View>
                  <TextReuseableComponent title style={styles.symbolStyle} value={"="} />
                  <View>
                    <TextReuseableComponent title style={styles.greyText} value={"CURRENT READ"} />
                    <TextReuseableComponent title style={[styles.text, {color: '#639CC7'}]} value={"3,807"} />
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
                    <TextReuseableComponent title style={styles.sectionText} value={title} />
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
                    <TextReuseableComponent title style={styles.sectionText} value={title} />
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
        //* Reasons List
        */}
            {reasonsData[0].data.length > 0 && (
              <SectionList
                style={styles.sectionStyle}
                contentContainerStyle={styles.sectionContainer}
                sections={reasonsData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderReasonData}
                renderSectionHeader={({section: {title, img}}) => (
                  <>
                    <View style={styles.sectionTitle}>
                      <TextReuseableComponent title style={styles.sectionText} value={title} />
                    </View>
                    <Divider style={styles.sectionTitleDivider} />
                  </>
                )}
              />
            )}
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
                    <TextReuseableComponent title style={[
                        styles.sectionText,
                        {
                          textTransform: 'capitalize',
                        },
                      ]} value={unitMeter?.utility_type_name?.name ?? 'N/A'} />
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
                <TextReuseableComponent title style={styles.sectionText} value={"Usage"} />
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
                    <TextReuseableComponent title value={loadChartData
                        ? 'Loading Data...'
                        : 'No Data for this Week'} />
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
                    <TextReuseableComponent title value={"Meter Usage"} />
                  </View>
                  <View style={styles.flexRow}>
                    <View style={styles.meterReadBox} />
                    <TextReuseableComponent title value={"Meter Read"} />
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
                <TextReuseableComponent title value={"Danger Zone"} />
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
