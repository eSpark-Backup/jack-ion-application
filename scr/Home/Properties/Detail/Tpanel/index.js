import React, {Component} from 'react';

import {
  Text,
  View,
  Dimensions,
  ScrollView,
  LogBox,
  Platform,
} from 'react-native';

//Packages
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustumStatusBar from '../../../../components/StatusBar';

// Components
import style from './style';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      tpanelData: [],
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
    this.setState({tpanelData: this.props.navigation.state.params});
  }

  render() {
    console.log('PANEL DATA', this.props.navigation.state.params);
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
              <Text style={style.mainHeadiing}>Tpanel</Text>
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
            <Text style={style.mainHeadiing}>Alerts</Text>
          </View>
        </View> */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{paddingHorizontal: 5, paddingTop: 5}}>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: width * 0.01,
              }}>
              <Text style={style.tpanelHeads}>Device Serial</Text>
              <Text style={style.tpanelHeads}>Building</Text>
              <Text style={style.tpanelHeads}>Unit</Text>
              <Text style={style.tpanelHeads}>Utility Type</Text>
              <Text style={style.tpanelHeads}>Manufacturer</Text>
              <Text style={style.tpanelHeads}>Device</Text>
              <Text style={style.tpanelHeads}>Attached To</Text>
              <Text style={style.tpanelHeads}>Signal Strength</Text>
              <Text style={style.tpanelHeads}>Temperature</Text>
              <Text style={style.tpanelHeads}>Battery</Text>
              <Text style={style.tpanelHeads}>Meter Usage</Text>
              <Text style={style.tpanelHeads}>Meter Reading</Text>
            </View>
            <ScrollView>
              {this.state.tpanelData.map(
                (item) =>
                  item.unit_meter.length > 0 && (
                    <TouchableOpacity style={style.tpanelValuesContainer}>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.device_serial_number)}
                      </Text>
                      <Text style={style.tpanelValues}>{item.building}</Text>
                      <Text style={style.tpanelValues}>{item.name}</Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.utility_type_name.name)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.manufacturer.name)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.device.name)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.attachedTo_name)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map(
                          (i) => i.meter_read.signal_strength,
                        )}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.meter_read.temperature)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.meter_read.battery)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.meter_read.meter_usage)}
                      </Text>
                      <Text style={style.tpanelValues}>
                        {item.unit_meter.map((i) => i.meter_read.meter_reading)}
                      </Text>
                    </TouchableOpacity>
                  ),
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
