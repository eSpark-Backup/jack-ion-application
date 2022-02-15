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
  ToastAndroid,
} from 'react-native';
import {Header, Button, Icon} from 'react-native-elements';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';
import {View as MotiView} from 'moti';
import {create} from 'apisauce';
import {SafeAreaView} from 'react-native-safe-area-context';
import Base_Url from '../../../../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loader from '../../../../../../components/Loader';
import {Svg, G} from 'react-native-svg';

import {
  VictoryChart,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
  VictoryBar,
  VictoryLine,
} from 'victory-native';
import {Fonts} from '../../../../../../utils/fonts';

import EditUnit from '../modals/UnitEdit';
// Components
import styles from './style';
import {Checkbox, Divider} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import clc from 'cli-color';
import TextTicker from 'react-native-text-ticker';
import style from './style';
const {width, height} = Dimensions.get('window');

const api = create({
  baseURL: Base_Url,
});

export const MyToolTip = (value, position) => {
  return (
    <View style={{height: 50, width: 50, backgroundColor: 'pink'}}>
      <Text>{value.y}</Text>
    </View>
  );
};

const App = ({navigation}) => {
  const scrollViewRef = useRef();
  const gettingChartdata = useRef(false);

  const [dangerView, setDangerView] = useState(false);
  const [headView, setHeadView] = useState(false);
  const [opened, setOpened] = useState(false);
  const [openedStatus, setOpenedStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [unitMeter, setUnitMeter] = useState({});
  const [unitMeterName, setUnitMeterName] = useState('');
  const [reasonsData, setReasonsData] = useState([]);
  const [reasonDataIndex, setReasonDataIndex] = useState(null);
  const [meterInfoData, setMeterInfoData] = useState([]);
  const [statusInfo, setStatusInfo] = useState([]);
  const [meterTypeData, setMeterTypeData] = useState([]);
  const [remoteReaderData, setRemoteReaderData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [editUnitModalVisible, setEditUnitModalVisible] = useState(false);
  const [editUnitMenuVisible, setEditUnitMenuVisible] = useState(false);
  const [meterListArray, setMeterListArray] = useState([]);
  const [editMeterTypes, setEditMeterTypes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [readDate, setReadDate] = useState([]);
  const [meterUsage, setMeterUsage] = useState([]);
  const [meterReadData, setMeterReadData] = useState([]);
  const [meterUsageData, setMeterUsageData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [loadChartData, setLoadChartData] = useState(false);

  let DataDates = ['Nov 09 09 PM', 'Nov 09 10 PM'];

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

  const [flag, setFlag] = useState(true);

  const getDataSetOne = () => {
    return [
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 13),
        y: 11,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 14),
        y: 11,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 15),
        y: 15,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 16),
        y: 15,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 17),
        y: 15,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 18),
        y: 15,
      },
      {
        x: new Date(2021, months.indexOf(DataDates[1]?.slice(0, 3)), 19),
        y: 15,
      },
    ];
  };

  const getDataSetTwo = () => {
    return [
      {
        x: new Date(2021, 10, 13),
        y: 0,
      },
      {
        x: new Date(2021, 10, 14),
        y: 0,
      },
      {
        x: new Date(2021, 10, 15),
        y: 4,
      },
      {
        x: new Date(2021, 10, 16),
        y: 0,
      },
      {
        x: new Date(2021, 10, 17),
        y: 0,
      },
      {
        x: new Date(2021, 10, 18),
        y: 0,
      },
      {
        x: new Date(2021, 10, 19),
        y: 0,
      },
    ];
  };

  const getTickValues = () => {
    return [
      new Date(2021, 10, 13),
      new Date(2021, 10, 14),
      new Date(2021, 10, 15),
      new Date(2021, 10, 16),
      new Date(2021, 10, 17),
      new Date(2021, 10, 18),
      new Date(2021, 10, 19),
    ];
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

  const {
    unitId,
    buildingName,
    buildingId,
    propertyId,
    propertyLat,
    propertyLong,
  } = navigation.state.params; //? Dynamic Ids
  // console.log('aya kuch ++', navigation.state.params.unitId);

  const testId = navigation.state.params.unitId;

  useEffect(() => {
    getToken();
  }, []);

  const getUnitDetail = async () => {
    const res = await api.get(`/property/equipment/unit/${testId}`);
    console.log('UNIT KI DETAILS>>>>>>>', res.data?.data?.unit);
    if (res.data?.bool) {
      setUnitMeterName(res.data?.data?.unit?.unit_meter[0]?.meter_name[0].name);
      setData(res.data);
      setUnitMeter(res.data?.data?.unit?.unit_meter?.[0]);
      // console.log(
      //   'GET Meter Name',
      //   res.data?.data?.unit?.unit_meter[0]?.meter_name[0].name,
      // );
    }
    // let unitData = res.data?.data?.unit?.unit_meter?.[0];
    let unitMeterId = res.data?.data?.unit?.unit_meter[0]?.id;
    let unitMeterArr = res.data?.data?.unit?.unit_meter;

    // setUnitData([
    //   {
    //     title: 'Unit',
    //     icon: 'home',
    //     type: 'ionicon',
    //     data: [
    //       {
    //         leftIcon: 'home',
    //         leftName: 'Name',
    //         rightIcon: null,
    //         rightName: res.data?.data?.unit?.name ?? 'N/A',
    //         type: 'feather',
    //         typeRight: 'feather',
    //       },
    //       {
    //         leftIcon: null,
    //         leftName: 'Utility Type',
    //         rightIcon: null,
    //         rightName: unitMeter?.meter_name[0]?.name,
    //         type: 'ionicon',
    //         typeRight: 'feather',
    //       },
    //       {
    //         leftIcon: 'building',
    //         leftName: 'Building',
    //         rightIcon: null,
    //         rightName: buildingName ?? 'Bluegrass MHP',
    //         type: 'font-awesome-5',
    //         typeRight: 'feather',
    //       },
    //       {
    //         leftIcon: 'ios-clipboard-outline',
    //         leftName: 'Notes',
    //         rightIcon: 'chevron-right',
    //         rightName: null,
    //         type: 'ionicon',
    //         typeRight: 'feather',
    //       },
    //     ],
    //   },
    // ]);

    const startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const todayDate = new Date();
    let data = {
      start_date: `2021-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      end_date: `2021-${todayDate.getMonth() + 1}-${todayDate.getDate()}`,
    };

    setLoadChartData(true);

    // console.log('Body Object', data);

    const chartRes = await api.post(
      `/property/equipment/meter-reading/chart-meter-all/${unitMeterId}`,
      data,
    );

    console.log('Chart Data', chartRes?.data?.data);

    if (unitMeterArr.length > 0 && chartRes.data?.data?.dataset.length > 0) {
      console.log('Chala Function');

      // gettingChartdata.current = true;
      getChartData(chartRes);
    }
    setLoadChartData(false);

    setLoading(false);
  };

  console.log('Getting Data..................??????????', propertyId);

  const getChartData = (chartRes) => {
    console.log('Check Chala.....');
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
    // console.log('Dataset Array', Math.max(...DataSet));
    // console.log('Total Usage', TotalUsage);
    // console.log('Merge Result', Math.max(...DataSet) - TotalUsage);

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

    console.log('String Date', index);

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
    // console.log('Dates__________', usageDates);

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
    Usage7DaysData.sort((a, b) => a.x - b.x);
    Read7DaysData.sort((a, b) => (a.x > b.x ? 1 : -1));
    // console.log(
    //   'Array After Merge Usage',
    //   Usage7DaysData.sort(function (a, b) {
    //     return a.x - b.x;
    //   }),
    //   'Array After Merge Read',
    //   Read7DaysData.sort((a, b) => (a.x > b.x ? 1 : -1)),
    // );

    setMeterReadData(Read7DaysData);
    setMeterUsageData(Usage7DaysData);
    setDateData(Datadates);
    // setLoadChartData(false);
    console.log(
      'Chart Data Received',
      Read7DaysData,
      Usage7DaysData,
      Datadates,
    );
  };

  // console.log('Meter Read Data', getDataSetOne());
  // console.log('Chart Data Received', meterReadData, meterUsageData, dateData);

  // const getChartData = () => {

  // }

  const getMeterTypes = async () => {
    const res = await api.get('/property/equipment/meter/all-meters');
    setMeterListArray(res.data?.data);
    // console.log('All Meters', res.data?.data);
  };

  const getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      // this.setState({token: token});
      api.setHeader('Authorization', 'Bearer ' + token);
      getUnitDetail();
      getMeterTypes();
    }
  };

  const iconSize = width * 0.08;
  const arrayOfUnits = data?.data?.unit?.unit_meter;

  const typeSwitcher = (arg) => {
    console.log('METER NAME', arg);
    switch (arg) {
      case 'hot water':
        return require('../../../../../../../Images/hot-water.png');
      case 'Cold Water':
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
    // console.log('Kia ha unitMeter', data);
    let reasonList = [];
    for (let i = 0; i < unitMeter?.reasons?.length; i++) {
      let reasonData = unitMeter?.reasons[i];
      let data = {
        leftName: 'Reason' + ' ' + reasonData.options_reason_id,
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
        rightText: unitMeter?.model_no?.device?.manufacturer ?? 'N/A',
        leftIcon: null,
        type: 'feather',
      },
      {
        leftText: 'Device',
        rightText: unitMeter?.model_no?.device?.name ?? 'N/A',
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
        rightText: unitMeter?.device_serial_number ?? 'N/A',
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
              unitMeter?.model_no?.device?.manufacturer +
              ' (' +
              unitMeter?.model_no?.device?.name +
              ')',
            rightIcon: 'chevron-down',
            type: 'feather',
          },
        ],
      },
    ]);
    setRemoteReaderData([
      {
        title: unitMeter?.model_no?.device?.device_type,
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
    console.log('unitMeterName ', unitMeterName);
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
            rightName: unitMeterName,
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
    setStatusInfo([
      {
        leftText: 'Pulses',
        rightText: unitMeter?.meter_read?.meter_reading
          ? unitMeter?.meter_read?.meter_reading
          : 0,
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

    if (data.length != 0) {
      setLoading(false);
    }
  }, [unitMeter, data]);

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

  const handleMeterSelect = async (data) => {
    // console.log('Kia ha unitMeter', data);
    if (data.id != unitMeter?.id) {
      setUnitMeter(data);
      setUnitMeterName(data.meter_name[0].name);
      setLoading(true);
      setDataSet([]);
      setMeterUsage([]);
      setReadDate([]);
      setMeterReadData([]);
      setMeterUsageData([]);
      setDateData([]);
      setLoadChartData(true);

      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const todayDate = new Date();

      let date = {
        start_date: `2021-${startDate.getMonth() + 1}-${startDate.getDate()}`,
        end_date: `2021-${todayDate.getMonth() + 1}-${todayDate.getDate()}`,
      };

      const chartRes = await api.post(
        `/property/equipment/meter-reading/chart-meter-all/${data.id}`,
        date,
      );

      if (
        data?.meter_read?.meter_reading > 0 &&
        chartRes.data?.data?.dataset.length > 0
      ) {
        // console.log('Function Chala Kia');

        // console.log('Date', date);

        // console.log('Chart Data', chartRes.data?.data?.dataset[0]);
        setDataSet(chartRes.data?.data?.dataset);
        getChartData(chartRes);
      } else {
        console.log('Loading False');
        setLoadChartData(false);
      }
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

  const openEditModal = () => {
    meterTypes();
    setEditUnitModalVisible(true);
    console.log(clc.cyan('chala'));
  };

  const meterTypes = () => {
    let arr1 = [...meterListArray];
    let arr2 = [...arrayOfUnits];
    const antiIntersection = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
    );

    // console.log('please', antiIntersection);
    setEditMeterTypes(antiIntersection);
  };
  const confirmUnitDelete = () => {
    Alert.alert('Delete Unit', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteUnit()},
    ]);
  };
  const deleteUnit = async () => {
    const response = await api.delete(`/property/equipment/unit/${testId}`);
    alert(response?.data?.message);
    navigation.goBack();
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
    setDangerView(!dangerView);
    const response = await api.delete(
      `/property/equipment/unit/unit-meter/${unitMeter.id}`,
    );
    getToken();
    // console.log('Check response', response?.data);
    alert(response?.data?.message);
  };

  const renderUnitList = ({item, index}) => {
    return data?.data?.unit?.unit_meter?.length == 0 ? (
      index == 1 ? null : (
        <View style={styles.listOuter}>
          <View style={styles.listContainer}>
            <View style={styles.flexRow}>
              {index == 1 ? (
                <Image
                  source={require('../../../../../../../Images/remote-reader.png')}
                  style={styles.imgHeader}
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
              <Text style={styles.listText}>{item.leftName}</Text>
            </View>
            <View style={styles.flexRow}>
              {item.rightName == null ? null : (
                <Text
                  style={[
                    styles.listText,
                    {
                      textTransform: 'capitalize',
                      color: index == 1 ? typeColor(item.rightName) : '#000',
                    },
                  ]}>
                  {item.rightName}
                </Text>
              )}
              {item.rightIcon == null ? null : (
                <Icon
                  name={item.rightIcon}
                  type={item.typeRight}
                  size={width * 0.05}
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
                source={require('../../../../../../../Images/remote-reader.png')}
                style={styles.imgHeader}
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
            <Text style={styles.listText}>{item.leftName}</Text>
          </View>
          <View style={styles.flexRow}>
            {item.rightName == null ? null : (
              <Text
                style={[
                  styles.listText,
                  {
                    textTransform: 'capitalize',
                    color: index == 1 ? typeColor(item.rightName) : '#000',
                  },
                ]}>
                {item.rightName}
              </Text>
            )}
            {item.rightIcon == null ? null : (
              <Icon
                name={item.rightIcon}
                type={item.typeRight}
                size={width * 0.05}
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
              <View style={styles.flexColoum}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <Text style={styles.listText}>{item.rightName}</Text>
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
                  <Text style={styles.listGreyText}>{item.text}</Text>
                )}
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
    );
  };

  const openView = (index) => {
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
                <Text style={styles.listText}>{item.leftName}</Text>
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
              <Text style={styles.listText}>{item.leftName}</Text>
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
    );
  };

  const renderReasonInfo = ({item}) => {
    return (
      <View style={styles.listInner}>
        <View style={styles.listInnerContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.listInnerText}>{item.leftText}</Text>
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
              <Text
                style={[styles.listInnerText, {textTransform: 'capitalize'}]}>
                {item.rightText}
              </Text>
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
            <Text style={styles.listInnerText}>{item.leftText}</Text>
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
                size={width * 0.05}
                color={'#000'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  // console.log(clc.red('data', JSON.stringify(data.data)));
  if (loading) {
    return <Loader />;
  } else if (data?.data?.unit?.unit_meter?.length == 0) {
    return (
      <View style={{flex: 1}}>
        <EditUnit
          flag={flag}
          propertyId={propertyId}
          propertyLat={propertyLat}
          propertyLong={propertyLong}
          enableFlag={() => setFlag(true)}
          disableFlag={() => setFlag(false)}
          modalVisible={editUnitModalVisible}
          meterMenuVisible={editUnitMenuVisible}
          // showMenu={() => setEditUnitMenuVisible(true)}
          // hideMenu={() => setEditUnitMenuVisible(false)}
          closeModal={() => setEditUnitModalVisible(!editUnitModalVisible)}
          // openModal={() => setEditUnitModalVisible(true)}
          reRun={() => getToken()}
          meterTypes={arrayOfUnits}
          modalName="Edit Unit"
          buildingName={buildingName}
          buildingId={buildingId}
          unitDetails={data.data}
          // itemPressHandle={() => {
          //   setEditUnitMenuVisible(false);
          // }}
          // handleEditUnit={() => {
          //   ToastAndroid.show('Unit edit successfully', ToastAndroid.SHORT);
          //   setEditUnitModalVisible(false);
          // }}
        />
        <Header
          leftComponent={{
            text: 'Close',
            style: {fontSize: width * 0.05, color: '#000'},
            onPress: () => navigation.goBack(),
          }}
          centerComponent={
            <View style={styles.flexRow}>
              <Home
                name="home"
                size={width * 0.05}
                color="#000"
                style={styles.leftedIcon}
              />
              <Text style={{fontSize: width * 0.05}}>Units Details</Text>
            </View>
          }
          rightComponent={{
            text: 'Edit',
            style: styles.headerText,
            onPress: () => {
              openEditModal();
            },
          }}
          backgroundColor="#fff"
          containerStyle={styles.headerContainerStyle}
        />
        <View style={{flex: 1}}>
          <SectionList
            style={{marginTop: height * 0.02}}
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
                    size={iconSize}
                    style={styles.centerIcon}
                  />
                </View>
                <Divider style={styles.sectionTitleDivider} />
              </>
            )}
          />
          <View>
            <Text style={styles.emptyMeterText}>
              {'No meter in this unit.\nAdd meter with edit option'}
            </Text>
            <View style={styles.metersImgContainer}>
              <Image
                source={require('../../../../../../../Images/meter-hot.png')}
                resizeMode="contain"
                style={style.noDataMeterImg}
              />
              <Image
                source={require('../../../../../../../Images/meter-electric.png')}
                resizeMode="contain"
                style={style.noDataMeterImg}
              />
              <Image
                source={require('../../../../../../../Images/meter-cold-water.png')}
                resizeMode="contain"
                style={style.noDataMeterImg}
              />
            </View>
          </View>
          <View style={styles.addMeterButtonContainer}>
            <TouchableOpacity onPress={openEditModal}>
              <Icon
                name="plus-circle"
                type="feather"
                size={width * 0.15}
                color={'#25AAE1ec'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.dangerView}>
            <Button
              onPress={confirmUnitDelete}
              titleStyle={{textTransform: 'capitalize'}}
              title={'Delete ' + data?.data?.unit?.name ?? 'N/A'}
              buttonStyle={{backgroundColor: '#e24b4b'}}
            />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <EditUnit
          flag={flag}
          propertyId={propertyId}
          propertyLat={propertyLat}
          propertyLong={propertyLong}
          enableFlag={() => setFlag(true)}
          disableFlag={() => setFlag(false)}
          modalVisible={editUnitModalVisible}
          meterMenuVisible={editUnitMenuVisible}
          showMenu={() => setEditUnitMenuVisible(true)}
          hideMenu={() => setEditUnitMenuVisible(false)}
          closeModal={() => setEditUnitModalVisible(!editUnitModalVisible)}
          reRun={() => getToken()}
          meterTypes={arrayOfUnits}
          modalName="Edit Unit"
          runLoading={() => setLoading(true)}
          runLoadingFailed={() => setLoading(false)}
          buildingName={buildingName}
          buildingId={buildingId}
          unitDetails={data.data}
          itemPressHandle={() => {
            setEditUnitMenuVisible(false);
          }}
          handleEditUnit={() => {
            ToastAndroid.show('Unit edit successfully', ToastAndroid.SHORT);
            setEditUnitModalVisible(false);
          }}
        />
        <Header
          leftComponent={{
            text: 'Close',
            style: {fontSize: width * 0.05, color: '#000'},
            onPress: () => navigation.goBack(),
          }}
          centerComponent={
            <View style={styles.flexRow}>
              <Home
                name="home"
                size={width * 0.05}
                color="#000"
                style={styles.rightedIcon}
              />
              <Text style={{fontSize: width * 0.05}}>Units Details</Text>
            </View>
          }
          rightComponent={{
            text: 'Edit',
            style: styles.headerText,
            onPress: () => {
              openEditModal();
            },
          }}
          backgroundColor="#fff"
          containerStyle={styles.headerContainerStyle}
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
                      fontSize: iconSize,
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
                    size={iconSize}
                    // color={typeColor(unitMeter?.meter_name)}
                    color={'#639CC7'}
                    style={styles.rightedIcon}
                    onPress={() => setHeadView(!headView)}
                  />
                </View>
                <View style={styles.flexRow}>
                  <Check name="check" size={width * 0.05} color="#0fc908" />
                  <Text style={{color: '#5c5c5ccf'}}>
                    {unitMeter?.time_diff
                      ? 'As of ' + unitMeter?.time_diff
                      : 'As of 5 hours ago'}
                  </Text>
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
                    size={iconSize}
                    // color={typeColor(unitMeter?.meter_name)}
                    color={'#639CC7'}
                    style={styles.rightedIcon}
                    onPress={() => setHeadView(!headView)}
                  />
                  <View>
                    <Text style={styles.greyText}>PULSES</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>
                      {unitMeter?.meter_read?.meter_reading
                        ? unitMeter?.meter_read?.meter_reading
                        : 0}
                    </Text>
                  </View>
                  <Text style={styles.symbolStyle}>x</Text>
                  <View>
                    <Text style={styles.greyText}>MULTIPLIER</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>1</Text>
                  </View>
                  <Text style={styles.symbolStyle}>+</Text>
                  <View>
                    <Text style={styles.greyText}>IMR</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>
                      {unitMeter?.initial_meter_reading
                        ? unitMeter?.initial_meter_reading
                        : 0}
                    </Text>
                  </View>
                  <Text style={styles.symbolStyle}>=</Text>
                  <View>
                    <Text style={styles.greyText}>CURRENT READ</Text>
                    <Text style={[styles.text, {color: '#639CC7'}]}>
                      {unitMeter?.meter_read?.meter_reading
                        ? unitMeter?.meter_read?.meter_reading +
                          unitMeter?.initial_meter_reading
                        : 0}
                    </Text>
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
                    color="#fff"
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
                      size={iconSize}
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
                    <Text
                      style={[
                        styles.sectionText,
                        {textTransform: 'capitalize'},
                      ]}>
                      {title}
                    </Text>
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
                      <Text
                        style={[
                          styles.sectionText,
                          {
                            textTransform: 'capitalize',
                          },
                        ]}>
                        {title}
                      </Text>
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
                    <Text
                      style={[
                        styles.sectionText,
                        {
                          textTransform: 'capitalize',
                        },
                      ]}>
                      {unitMeter?.meter_name[0].name + ' Meter'}
                    </Text>
                    <Image
                      source={img}
                      resizeMode="contain"
                      style={styles.sectionImgStyle}
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
                  size={iconSize}
                  style={styles.centerIcon}
                />
              </View>
              <Divider
                style={[
                  styles.sectionTitleDivider,
                  {
                    left: width * 0.05,
                  },
                ]}
              />
              {/*
              //todo: Add Chart here 
              */}
              <View style={{alignItems: 'center'}}>
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
                    style={{height: height * 0.3, justifyContent: 'center'}}>
                    <Text style={{fontSize: width * 0.06}}>
                      {loadChartData
                        ? 'Loading Data...'
                        : 'No Data for this Week'}
                    </Text>
                  </View>
                )}

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
              <View style={styles.usageTextContainer}>
                <Text style={{fontSize: width * 0.07}}>Danger Zone</Text>
                <Icon
                  name={dangerView ? 'chevron-down' : 'chevron-right'}
                  type="feather"
                  size={iconSize}
                  color="#000"
                  onPress={() => {
                    setDangerView(!dangerView);
                  }}
                />
              </View>
              <Divider style={styles.dangerHeader} />
              {!dangerView ? (
                <View />
              ) : (
                <View style={styles.dangerView}>
                  <Button
                    onPress={confirmDelete}
                    titleStyle={{textTransform: 'capitalize'}}
                    title={`Delete ${unitMeter?.meter_name[0].name} Meter`}
                    buttonStyle={styles.dangerBtn}
                  />
                  <Button
                    onPress={confirmUnitDelete}
                    titleStyle={{textTransform: 'capitalize'}}
                    title={'Delete ' + data?.data?.unit?.name ?? 'N/A'}
                    buttonStyle={styles.dangerBtn}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerStyle}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {arrayOfUnits &&
              arrayOfUnits.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.meterStyle,
                    {
                      // borderColor: typeColor(item.meter_name),
                      borderColor: '#639CC7',
                    },
                  ]}
                  onPress={() => {
                    handleMeterSelect(item);
                    setDangerView(false);
                  }}>
                  {item.id == unitMeter?.id && (
                    <View
                      style={[styles.meterInner, {backgroundColor: '#639CC7'}]}>
                      <Check
                        name="check"
                        style={{marginLeft: width * 0.005}}
                        size={width * 0.02}
                        color="#fff"
                      />
                    </View>
                  )}
                  {/* <Image
                    source={typeSwitcher(item.meter_name)}
                    style={styles.meterImg}
                  /> */}
                  <Text
                    style={[
                      styles.emptyMeterText,
                      {
                        flex: 1,
                        fontSize: width * 0.026,
                        fontWeight: 'bold',
                        height: width * 0.15,
                        width: width * 0.14,
                        alignSelf: 'center',
                        textAlignVertical: 'center',
                      },
                    ]}>
                    {item.meter_name[0].name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default App;
