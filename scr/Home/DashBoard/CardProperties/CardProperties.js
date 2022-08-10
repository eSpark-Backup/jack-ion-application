import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {styles} from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPropetry} from '../../../Store/Action/properties.action';
import {FlatList} from 'react-native-gesture-handler';
import API from '../../../api/SeviceApi';

const {height, width} = Dimensions.get('screen');
export const CardProperties = ({navigation}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    getProperties();
  }, [navigation?.isFocused()]);

  const getProperties = async () => {
    setLoading(true);
    const response = await API.get(`/dashboard/recent-list`);
    if (response?.ok) {
      setProperties(response?.data?.data?.properties);
    }
    setLoading(false);
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
            <Text style={styles.mainHeadiing}>Properties</Text>
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
                    title: 'Address',
                    key: 'city',
                  },
                  {title: 'Owner', key: 'owner'},
                  {title: 'Number of Building', key: 'building_count'},
                  {title: 'Number of Alert', key: 'alert_count'},
                  {title: 'Numnber of Unit', key: 'unit_count'},
                  {title: 'Date', key: 'createdAt'},
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
                data={properties || []}
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
                        <Text style={styles?.tableColText}>{item?.city}</Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>{item?.owner}</Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.building_count}
                        </Text>
                      </View>
                      <View style={styles?.tableColContainer}>
                        <Text style={styles?.tableColText}>
                          {item?.alert_count}
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
