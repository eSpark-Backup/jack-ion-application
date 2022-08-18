import React, {useEffect, useState} from 'react';
import {View, Dimensions, ScrollView, ActivityIndicator, Platform} from 'react-native';
import {styles} from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import API from '../../../api/SeviceApi';
import CustumStatusBar from '../../../components/StatusBar';
import TextReuseableComponent from '../../../components/Text/index';

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
            <TextReuseableComponent title style={styles.mainHeadiing} value={"Buildings"} />
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
                    title: 'Property Name',
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
                        <TextReuseableComponent title style={styles.tableHeading} value={value?.title} />
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
                        <TextReuseableComponent title style={styles?.tableColText} value={item?.name} />
                      </View>
                      <View style={styles?.tableColContainer}>
                        <TextReuseableComponent title style={styles?.tableColText} value={item?.property_name} />
                      </View>
                      <View style={styles?.tableColContainer}>
                        <TextReuseableComponent title style={styles?.tableColText} value={item?.descriptions} />
                      </View>
                      <View style={styles?.tableColContainer}>
                        <TextReuseableComponent title style={styles?.tableColText} value={item?.unit_count} />
                      </View>
                      <View style={styles?.tableColContainer}>
                        <TextReuseableComponent title style={styles?.tableColText} value={item?.created_at} />
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
