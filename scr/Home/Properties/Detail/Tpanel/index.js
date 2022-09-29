import React, { Component } from 'react';

import {
  View,
  Dimensions,
  ScrollView,
  LogBox,
  Platform,
} from 'react-native';

//Packages
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustumStatusBar from '../../../../components/StatusBar';
import TextReuseableComponent from '../../../../components/Text/index';

// Components
import style from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      tpanelData: [],
      propertyData: {},
      alertsType: [
        {
          title: 'Equipment Health Alerts',
          icon: 'heart',
          data: [
            {
              title: 'Tamper',
              desc: 'Detect when someone has tampered with your equipment.',
              value: false,
            },
            {
              title: 'Connection',
              desc: 'Detect when equipment goes offline.',
              value: false,
            },
            {
              title: 'Power Loss',
              desc: 'Detect when your equipment is unplugged from power.',
              value: false,
            },
            {
              title: 'Battery',
              desc: 'Detect when batteries start running slow.',
              value: false,
            },
          ],
        },
        {
          title: 'Smart Security Alerts',
          icon: 'shield',
          data: [
            {
              title: 'Temperature',
              desc: 'Detect when the temperature at a meter reaches.',
              value: false,
            },
            {
              title: 'Consumption',
              desc: 'Detect unusual spike in usage such as running toilet.',
              value: false,
            },
            {
              title: 'Water Leak Sensor',
              desc:
                'Detect physical water leaks utilizing the ION Energy Leak Sensor',
              value: 'Coming Soon',
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    console.log('PARAMS Data', this.props.navigation.state.params);
    this.setState({
      tpanelData: this.props.navigation.state.params?.tpanelData,
      propertyData: this.props.navigation.state.params?.propertyData,
    });
  }

  goToDetails = (item) => {
    this.props.navigation.navigate('U_Details', {
      unitId: item.id,
      buildingName: item.building,
      buildingId: item.building_id,
      propertyId: this.state.propertyData.id,
      propertyLat: this.state.propertyData.latitude,
      propertyLong: this.state.propertyData.longitude,
    });
    // console.log(
    //   'Sub me Kch na Kch Mila Ya Nhi',
    //   this.state.buildingData.name,
    //   this.state.editBuildId,
    //   this.props.navigation.state.params.item.item.id,
    //   this.props.navigation.state.params.item.item.latitude,
    //   this.props.navigation.state.params.item.item.longitude,
    // );
  };

  render() {
    // console.log('PANEL DATA', this.props.navigation.state.params);
    return (
      <View style={style.container}>
        {Platform.OS == 'ios' && <CustumStatusBar />}

        <View style={style.headingContainer}>
          <View style={[style.headingInner]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                width: width * 0.15,
                height: height * 0.06,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons
                size={width * 0.08}
                color="white"
                name="arrow-back"
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: width * 0.25,
              }}>
              <TextReuseableComponent title style={style.mainHeadiing} value={"Tpanel"} />
            </View>
          </View>
        </View>
        {/* <View style={style.headingContainer}>
          <View style={style.headingInner}>
            <Feather
              name="alert-triangle"
              size={height * 0.035}
              style={{paddingRight: 5}}
              color="white"
            />
            <TextReuseableComponent title style={style.mainHeadiing} value={"Alerts"} />
          </View>
        </View> */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: width * 0.01,
              }}>
              <TextReuseableComponent title style={style.tpanelHeads} value={"Device Serial"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Building"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Unit"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Utility Type"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Manufacturer"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Device"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Attached To"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={'Signal Strength'} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Temperature"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Battery"} />
              <TextReuseableComponent title style={style.tpanelHeads} value={'Meter Usage'} />
              <TextReuseableComponent title style={style.tpanelHeads} value={"Meter Reading"} />
            </View>

            <ScrollView>
              {this.state.tpanelData.map((item) =>
                item.unit_meter.map((i) => (
                  <TouchableOpacity
                    style={style.tpanelValuesContainer}
                    onPress={() => this.goToDetails(item)}>
                    <TextReuseableComponent title style={style.tpanelValues} value={i.device_serial_number} />
                    <TextReuseableComponent title style={style.tpanelValues} value={item.building} />
                    <TextReuseableComponent title style={style.tpanelValues} value={item.name} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.utility_type_name.name} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.manufacturer.name} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.device.name} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.attachedTo_name} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.meter_read?.signal_strength} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.meter_read?.temperature} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.meter_read?.battery} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.meter_read?.meter_usage} />
                    <TextReuseableComponent title style={style.tpanelValues} value={i.meter_read?.meter_reading} />
                  </TouchableOpacity>
                )),
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
