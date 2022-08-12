import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CustumStatusBar from '../../../components/StatusBar';
import {styles} from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import API from '../../../api/SeviceApi';

const {height, width} = Dimensions.get('screen');

export const Network = ({navigation, route}) => {
  const date1 = new Date();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setfromDate] = useState(
    date1.setMonth(date1.getMonth() - 12),
  );
  const [toDate, settoDate] = useState(new Date());
  const [showType, setshowType] = useState('to');
  const [reports, setReport] = useState([]);

  const onChangeDate = (date) => {
    if (showType == 'to') {
      settoDate(date);
    } else {
      setfromDate(date);
    }
    setShow(false);
    setshowType('');
  };

  useEffect(() => {
    getPropertyReport();
  }, [fromDate, toDate]);

  const getPropertyReport = async () => {
    setLoading(true);
    const propId = navigation?.state?.params?.propId;

    const data = {
      property_id: propId,
      from_date: moment(fromDate).format('YYYY-MM-DD'),
      to_date: moment(toDate).format('YYYY-MM-DD'),
    };

    try {
      const result = await API.post(`/reports/usage/${propId}`, data);
      setReport(result?.data?.data?.usage);
      setLoading(false);
    } catch (error) {
      console.log('getPropertyReport error', error);
    }
  };

  return (
    <View style={styles?.mainContainer}>
      {Platform.OS == 'ios' && <CustumStatusBar />}
      <View style={styles.headingContainer}>
        <View style={styles.headingInner}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={height * 0.04}
            color="white"
            style={{right: 15}}
            onPress={() => navigation?.goBack()}
          />
          <View>
            <Text style={styles.mainHeadiing}>
              Consumption Comparison Report
            </Text>
          </View>
          <View />
        </View>
      </View>

      {/* DATE PICKER WORK START */}
      <View>
        <View>
          <DateTimePickerModal
            isVisible={show}
            onCancel={() => {
              setShow(!show);
            }}
            maximumDate={new Date()}
            display={Platform.OS == 'android' ? 'default' : 'inline'}
            value={new Date()}
            mode={'date'}
            is24Hour={true}
            onConfirm={onChangeDate}
          />
        </View>
      </View>

      <View style={styles.date}>
        <TouchableOpacity
          onPress={() => {
            setshowType('from');
            setShow(true);
          }}
          activeOpacity={0.8}
          style={styles.dateSelectorContainer}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="date-range" size={17} color="#8E97A6" />
            <Text style={styles.dateSelectorHeading}>{'From'}</Text>
          </View>
          <Text style={styles.dateText}>
            {fromDate && new Date(fromDate)?.toDateString()}
          </Text>
        </TouchableOpacity>

        <View style={styles.dateDivider} />
        <TouchableOpacity
          onPress={() => {
            setshowType('to');
            setShow(true);
          }}
          activeOpacity={0.8}
          style={styles.dateSelectorContainer}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="date-range" size={17} color="#8E97A6" />
            <Text style={styles.dateSelectorHeading}>{'To'}</Text>
          </View>
          <Text style={styles.dateText}>{toDate?.toDateString()}</Text>
        </TouchableOpacity>
      </View>
      {/* DATE PICKER WORK END */}

      {/* LISTING */}
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 45}}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            persistentScrollbar={true}>
            <View>
              <View style={styles.tableHeader}>
                {[
                  {title: 'Building', key: 'building_name'},
                  {title: 'Unit ', key: 'unit_name'},
                  {title: 'Device Serial No.', key: 'device_serial_number'},
                  {title: 'Attached To', key: 'cmption_limit'},
                  {title: 'Manufacturer', key: 'actual_cmption'},
                  {title: 'Device', key: 'alert_level'},
                  {title: 'Date', key: 'date'},
                ].map((value, index) => {
                  return (
                    <>
                      <View
                        key={index}
                        style={{
                          width: width / 2.3,
                        }}>
                        <Text style={styles.tableHeading}>{value?.title}</Text>
                      </View>
                      <View
                        style={{
                          height: 40,
                          width: 1,
                          backgroundColor: '#CFD4DB',
                          alignSelf: 'center',
                        }}
                      />
                    </>
                  );
                })}
              </View>
              <FlatList
                data={reports || []}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.building_name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.unit_name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.device_serial_number}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.attachedTo_name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.manufacturer?.name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.device?.name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.time_diff}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <>
                    {!loading ? (
                      <View
                        style={{flex: 1, margin: 20, justifyContent: 'center'}}>
                        <Text>Empty</Text>
                      </View>
                    ) : null}
                  </>
                }
              />
            </View>
          </ScrollView>
        </ScrollView>
        {loading && <ActivityIndicator size={'large'} color="#000" />}
      </View>
    </View>
  );
};
