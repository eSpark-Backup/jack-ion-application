import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, ScrollView, ActivityIndicator} from 'react-native';
import {styles} from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import API from '../../../api/SeviceApi';
const {height, width} = Dimensions.get('screen');
export const CardBuildings = ({navigation}) => {
  const [buildings, setBuilding] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    getBuildings();
  }, [navigation?.isFocused()]);

  const getBuildings = async () => {
    setLoading(true)
    const response = await API.get(`/dashboard/recent-list`);
    if (response?.ok) {
      setBuilding(response?.data?.data?.buildings);
    }
    setLoading(false)
  };

  return (
    <View style={styles.main}>
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
            <Text style={styles.mainHeadiing}>Buildings</Text>
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
                  {title: 'Name', key: 'name'},
                  {
                    title: 'Propert Name',
                    key: 'property_name',
                  },
                  {title: 'Description', key: 'descriptions'},
                  {title: 'Number of Unit', key: 'unit_count'},
                  {title: 'Date', key: 'created_at'},
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
                data={buildings || []}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>{item?.name}</Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.property_name}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.descriptions}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.unit_count}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.created_at}
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
