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
  ToastAndroid,
} from 'react-native';
import {Header, Button, Icon} from 'react-native-elements';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';
import {View as MotiView} from 'moti';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Loader from '../../../../../../components/Loader';
import {Svg, G} from 'react-native-svg';
import {Icon as Iconx} from 'react-native-elements';

import {
  VictoryChart,
  VictoryLegend,
  VictoryAxis,
  VictoryLabel,
  VictoryBar,
  VictoryLine,
} from 'victory-native';
import {Fonts} from '../../../../../../utils/fonts';
import TextReuseableComponent from '../../../../../../components/Text/index';

import EditUnit from '../modals/UnitEdit';
// Components
import styles from './style';
import {Checkbox, Divider} from 'react-native-paper';
import {color} from 'react-native-reanimated';
import clc from 'cli-color';
import TextTicker from 'react-native-text-ticker';
import style from './style';
import API from '../../../../../../api/SeviceApi';
const {width, height} = Dimensions.get('window');

export const MyToolTip = (value, position) => {
  return (
    <View style={{height: 50, width: 50, backgroundColor: 'pink'}}>
      <TextReuseableComponent title value={value.y} />
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
  const [addMeterModalVisible, setAddMeterModalVisible] = useState(false);
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
  const [selectedMeterForEdit, setSelectedMeterForEdit] = useState(null);

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
    propertyName,
    propertyId,
    propertyLat,
    propertyLong,
  } = navigation.state.params; //? Dynamic Ids

  const testId = navigation.state.params.unitId;

  useEffect(() => {
    getToken();
  }, []);

  const getUnitDetail = async () => {
    const res = await API.get(`/property/equipment/unit/${testId}`);
    console.log('unit mixes', res.data?.data?.unit);
    if (res.data?.bool) {
      setData(res.data);
      setUnitMeter(res.data?.data?.unit?.unit_meter?.[0]);
    }
    let unitMeterId = res.data?.data?.unit?.unit_meter[0]?.id;
    let unitMeterArr = res.data?.data?.unit?.unit_meter;

    let alertData = {
      id: res.data?.data?.unit?.unit_meter?.[0]?.id,
      pid: propertyId,
    };

    const alertRes = await API.post(`/alert/recent`, alertData);
    if (alertRes?.data?.bool) {
      const unitAlertData = alertRes.data?.data?.alert;
      setStatusInfo([
        {
          leftText: 'Type',
          rightText: unitAlertData?.alert_type?.name,
          icon: null,
          bold: false,
        },
        {
          leftText: 'Opened',
          rightText:
            unitAlertData?.created_at + '  ' + unitAlertData?.time_diff,
          icon: null,
          bold: true,
          type: 'feather',
        },
      ]);
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

    if (unitMeterArr?.length > 0 && chartRes.data?.data?.dataset?.length > 0) {
      // gettingChartdata.current = true;
      getChartData(chartRes);
    }
    setLoadChartData(false);

    setLoading(false);
  };

  const getChartData = (chartRes) => {
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
    Usage7DaysData.sort((a, b) => a.x - b.x);
    Read7DaysData.sort((a, b) => (a.x > b.x ? 1 : -1));

    setMeterReadData(Read7DaysData);
    setMeterUsageData(Usage7DaysData);
    setDateData(Datadates);
  };

  const getMeterTypes = async () => {
    const res = await API.get('/property/equipment/meter/all-meters');
    setMeterListArray(res.data?.data);
  };

  const getToken = async () => {
    getUnitDetail();
    getMeterTypes();
  };

  const iconSize = width * 0.08;
  const arrayOfMeter = data?.data?.unit?.unit_meter;

  const typeSwitcher = (arg) => {
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

      reasonList.push(data);
    }

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
      {
        leftText: 'Device Serial',
        rightText: unitMeter?.device_serial_number ?? 'N/A',
        leftIcon: 'barcode-outline',
        leftType: 'ionicon',
        type: 'feather',
      },
    ]);
    setReasonsData([
      {
        title: 'Meters',
        data: arrayOfMeter,
      },
    ]);
    setMeterTypeData([
      {
        title: 'Hot Water Meter',
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
          {
            leftName: 'Recent Alert',
            rightIcon: 'chevron-down',
            type: 'feather',
            rightIcon2: null,
          },
        ],
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
            leftIcon: 'building',
            leftName: 'Property Name',
            rightIcon: null,
            rightName: propertyName ?? 'Bluegrass MHP',
            type: 'font-awesome-5',
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
          // {
          //   leftIcon: 'ios-clipboard-outline',
          //   leftName: 'Notes',
          //   rightIcon: null,
          //   rightName: data?.data?.unit?.notes ?? 'N/A',
          //   type: 'ionicon',
          //   typeRight: 'feather',
          // },
        ],
      },
    ]);
    if (data?.length != 0) {
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
    if (data.id != unitMeter?.id) {
      setUnitMeter(data);
      setUnitMeterName('data.meter_name[0].name');
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

      const chartRes = await API.post(
        `/property/equipment/meter-reading/chart-meter-all/${data.id}`,
        date,
      );

      if (
        data?.meter_read?.meter_reading > 0 &&
        chartRes.data?.data?.dataset.length > 0
      ) {
        setDataSet(chartRes.data?.data?.dataset);
        getChartData(chartRes);
      } else {
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
  };

  const meterTypes = () => {
    let arr1 = [...meterListArray];
    let arr2 = [...arrayOfMeter];
    const antiIntersection = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.meter_id),
    );

    setEditMeterTypes(antiIntersection);
  };
  const confirmUnitDelete = () => {
    Alert.alert('Delete Unit', 'Are you sure you want to Delete this Unit?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteUnit()},
    ]);
  };
  const deleteUnit = async () => {
    const response = await API.post(`/property/equipment/unit/${testId}`);
    alert(response?.data?.message);
    navigation.goBack();
  };
  const confirmDelete = (id) => {
    Alert.alert('Delete Meter', 'Are you sure you want to Delete?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => deleteMeter(id)},
    ]);
  };

  const deleteMeter = async (id) => {
    setDangerView(!dangerView);
    const response = await API.post(
      `/property/equipment/unit/unit-meter/${id}`,
    );
    getToken();
    alert(response?.data?.message);
  };

  const renderUnitList = ({item, index}) => {
    return data?.data?.unit?.unit_meter?.length == 0 ? (
      <View style={styles.listOuter}>
        <View style={styles.listContainer}>
          <View style={styles.flexRow}>
            <Icon
              name={item.leftIcon}
              type={item.type}
              size={width * 0.05}
              color={'#000'}
              style={{marginRight: width * 0.03}}
            />
            <TextReuseableComponent
              title
              style={styles.listText}
              value={item.leftName}
            />
          </View>
          <View style={styles.flexRow}>
            {item.rightName == null ? null : (
              <TextReuseableComponent
                title
                style={[
                  styles.listText,
                  {
                    color: '#000',
                  },
                ]}
                value={item.rightName}
              />
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
    ) : (
      <View style={styles.listOuter}>
        <View style={styles.listContainer}>
          <View style={styles.flexRow}>
            <Icon
              name={item.leftIcon}
              type={item.type}
              size={width * 0.05}
              color={'#000'}
              style={{marginRight: width * 0.03}}
            />
            <TextReuseableComponent
              title
              style={styles.listText}
              value={item.leftName}
            />
          </View>
          <View style={styles.flexRow}>
            {item.rightName == null ? null : (
              <TextReuseableComponent
                title
                style={[
                  styles.listText,
                  {
                    color: '#000',
                  },
                ]}
                value={item.rightName}
              />
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
    return unitMeter?.device_serial_number ? (
      <TouchableOpacity
        disabled={item.leftName == 'Recent Alert' ? false : true}
        onPress={() => {
          openStatusView(), setDangerView(false);
        }}>
        <View style={styles.listOuter}>
          <View style={styles.listContainer}>
            <View style={styles.flexRow}>
              <TextReuseableComponent
                title
                style={styles.listText}
                value={item.leftName}
              />
            </View>
            <View style={styles.flexRow}>
              <View style={styles.flexColoum}>
                <View style={{flexDirection: 'row-reverse'}}>
                  {item.rightName == null ? null : (
                    <TextReuseableComponent
                      title
                      style={[
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
                      ]}
                      value={item.rightName}
                    />
                  )}
                  {item.rightIcon2 == null ? null : (
                    <Icon
                      name={item.rightIcon2}
                      type={item.type}
                      size={width * 0.05}
                      color={
                        unitMeter?.installation_status == 1 ? '#0fc908' : '#f00'
                      }
                      style={{marginRight: width * 0.01}}
                    />
                  )}
                </View>
                {item.text ? (
                  <TextReuseableComponent
                    title
                    style={[styles.listGreyText, {textAlign: 'right'}]}
                    value={item.text}
                  />
                ) : null}
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
    ) : (
      <View />
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
                <TextReuseableComponent
                  title
                  style={styles.listText}
                  value={item.leftName}
                />
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
        {index == reasonDataIndex ? (
          <FlatList
            style={styles.statusList}
            data={item.data}
            keyExtractor={(item, index) => item + index}
            renderItem={renderReasonInfo}
            ItemSeparatorComponent={() => (
              <Divider style={[styles.listDivider, {marginTop: 0}]} />
            )}
          />
        ) : null}
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
              <TextReuseableComponent
                title
                style={styles.listText}
                value={item.leftName}
              />
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
            <TextReuseableComponent
              title
              style={styles.listInnerText}
              value={item.leftText}
            />
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
              <TextReuseableComponent
                title
                style={styles.listInnerText}
                value={item.rightText}
              />
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
            <TextReuseableComponent
              title
              style={styles.listInnerText}
              value={item.leftText}
            />
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
            <TextReuseableComponent
              title
              style={styles.listInnerText}
              value={item.rightText}
            />
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
            <TextReuseableComponent
              title
              style={styles.listGreyText}
              value={item.leftText}
            />
          </View>
          <View style={styles.flexRow}>
            <TextReuseableComponent
              title
              style={[
                styles.listInnerText,
                {
                  color: item.bold ? '#000' : '#8c8c8c',
                  textTransform: 'capitalize',
                },
              ]}
              value={item.rightText}
            />
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

  const handleMeterAdd = () => {
    setAddMeterModalVisible(!addMeterModalVisible);
  };

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
          closeModal={() => setEditUnitModalVisible(!editUnitModalVisible)}
          reRun={() => getToken()}
          meterTypes={arrayOfMeter}
          modalName="Edit Unit"
          unitMixesId={data.data?.unit?.unit_mix_id}
          buildingName={buildingName}
          buildingId={buildingId}
          unitDetails={data.data}
        />
        <Header
          leftComponent={{
            text: 'Close',
            style: {fontSize: width * 0.05, color: '#000'},
            onPress: () => navigation.goBack(),
          }}
          centerComponent={
            <View style={styles.flexRow}>
              <TextReuseableComponent heading value={'Unit Details'} />
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
          <EditUnit
            flag={flag}
            propertyId={propertyId}
            propertyLat={propertyLat}
            propertyLong={propertyLong}
            enableFlag={() => setFlag(true)}
            disableFlag={() => setFlag(false)}
            modalVisible={addMeterModalVisible}
            closeModal={() => setAddMeterModalVisible(!addMeterModalVisible)}
            reRun={() => getToken()}
            meterTypes={arrayOfMeter}
            buildingName={buildingName}
            buildingId={buildingId}
            unitDetails={data.data}
            addMeterUnitMix={data?.data?.unit?.unit_mix}
            addMeterUnitMixId={data?.data?.unit?.unit_mix_id}
            addNewMeter={addMeterModalVisible}
            handleEditUnit={() => {
              setAddMeterModalVisible(!addMeterModalVisible);
            }}
          />
          <SectionList
            style={{marginTop: height * 0.02}}
            contentContainerStyle={styles.sectionContainer}
            sections={unitData}
            keyExtractor={(item, index) => item + index}
            renderItem={renderUnitList}
            renderSectionHeader={({section: {title, icon, type}}) => (
              <>
                <View style={styles.sectionTitle}>
                  <TextReuseableComponent
                    title
                    style={styles.sectionText}
                    value={title}
                  />
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
            <TextReuseableComponent
              subHeading
              style={styles.emptyMeterText}
              value={'No meter in this unit.\nAdd meter with edit option'}
            />
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
            <TouchableOpacity onPress={() => handleMeterAdd()}>
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
          meterTypes={arrayOfMeter}
          modalName="Edit Unit"
          runLoading={() => setLoading(true)}
          runLoadingFailed={() => setLoading(false)}
          buildingName={buildingName}
          buildingId={buildingId}
          unitDetails={data.data}
          unitMixesId={data.data?.unit?.unit_mix_id}
          itemPressHandle={() => {
            setEditUnitMenuVisible(false);
          }}
          handleEditUnit={() => {
            ToastAndroid.show('Unit edit successfully', ToastAndroid.SHORT);
            setEditUnitModalVisible(false);
          }}
          selectedMeterForEdit={selectedMeterForEdit}
        />
        <EditUnit
          flag={flag}
          propertyId={propertyId}
          propertyLat={propertyLat}
          propertyLong={propertyLong}
          enableFlag={() => setFlag(true)}
          disableFlag={() => setFlag(false)}
          modalVisible={addMeterModalVisible}
          closeModal={() => setAddMeterModalVisible(!addMeterModalVisible)}
          reRun={() => getToken()}
          meterTypes={arrayOfMeter}
          buildingName={buildingName}
          buildingId={buildingId}
          unitDetails={data.data}
          addMeterUnitMix={data?.data?.unit?.unit_mix}
          addMeterUnitMixId={data?.data?.unit?.unit_mix_id}
          addNewMeter={addMeterModalVisible}
          handleEditUnit={() => {
            setAddMeterModalVisible(!addMeterModalVisible);
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
              <TextReuseableComponent heading value={'Unit Details'} />
            </View>
          }
          rightComponent={{
            text: 'Edit',
            style: styles.headerText,
            onPress: () => {
              setSelectedMeterForEdit({item: null, index: null});
              openEditModal();
            },
          }}
          backgroundColor="#fff"
          containerStyle={styles.headerContainerStyle}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            if (dangerView) {
              scrollViewRef.current.scrollToEnd({animated: true});
            }
          }}>
          <View style={styles.container}>
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
                    <TextReuseableComponent heading value={title} />
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

            {/* Usage and Danger zone was here. */}
            <SectionList
              style={styles.sectionStyle}
              contentContainerStyle={styles.sectionContainer}
              sections={reasonsData}
              keyExtractor={(item, index) => item + index}
              renderItem={({item, index}) => {
                // console.log('item:', item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      LayoutAnimation.configureNext({
                        duration: 300,
                        create: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                          property: LayoutAnimation.Properties.opacity,
                        },
                        update: {
                          type: LayoutAnimation.Types.easeInEaseOut,
                        },
                      }),
                        setSelectedMeterForEdit({item, index});
                      openEditModal();
                    }}
                    style={styles.meterContainer}>
                    <TextReuseableComponent
                      title
                      style={styles.meterDesciptionHeading}
                      value={'Meter-' + (index + 1)}
                    />
                    <TouchableOpacity
                      onPress={() => confirmDelete(item?.id)}
                      style={{
                        zIndex: 1,
                        backgroundColor: '#fff',
                      }}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={width * 0.07}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              renderSectionHeader={({section: {title, img}}) => (
                <>
                  <View style={styles.sectionTitle}>
                    <TextReuseableComponent heading value={'Meters'} />
                    <TouchableOpacity
                      onPress={() => handleMeterAdd()}
                      style={{width: width * 0.085}}>
                      <TextReuseableComponent heading value={'+'} />
                    </TouchableOpacity>
                  </View>
                  <Divider style={styles.sectionTitleDivider} />
                </>
              )}
            />
          </View>
        </ScrollView>
        {/* <View style={styles.footerStyle}>

          {openedStatus ? (
              <FlatList
                style={styles.statusList}
                data={statusInfo}
                keyExtractor={(item, index) => item + index}
                renderItem={renderStatusInfo}
                ItemSeparatorComponent={() => (
                  <Divider style={[styles.listDivider, { marginTop: 0 }]} />
                )}
              />
            ) : null} 

        </View> */}
      </View>
    );
  }
};

export default App;
