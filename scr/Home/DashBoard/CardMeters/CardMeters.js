import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {styles} from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import API from '../../../api/SeviceApi';
import CustumStatusBar from '../../../components/StatusBar';
const {height, width} = Dimensions.get('screen');
export const CardMeters = ({navigation}) => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    getMeters();
  }, [navigation?.isFocused()]);

  const getMeters = async () => {
    setLoading(true);
    const response = await API.get(`/dashboard/recent-list`);
    if (response?.ok) {
      setMeters(response?.data?.data?.meters);
    }
    setLoading(false);
  };

  return (
    <View style={styles.main}>
       {Platform.OS == 'ios' && <CustumStatusBar />}
      <View style={styles.headingContainer}>
        <View style={styles.headingInner}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={height * 0.04}
            color="white"
            style={{right: 85}}
            onPress={() => navigation?.goBack()}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', right: 15}}>
            <Text style={styles.mainHeadiing}>Meters</Text>
          </View>
        </View>
      </View>

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
                  {title: 'Device', key: 'name'},
                  {
                    title: 'Manufacturer',
                    key: 'property_name',
                  },
                  {title: 'Device Type', key: 'descriptions'},
                  // {title: 'Date', key: 'created_at'},
                ].map((value, index) => {
                  return (
                    <>
                      <View
                        key={index}
                        style={{
                          width: width / 2.2,
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
                data={meters || []}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.device?.name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.device?.device_type}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.device?.manufacturer}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </ScrollView>
        {loading && <ActivityIndicator size={'large'} color="#000" />}
      </View>
    </View>
  );
};
