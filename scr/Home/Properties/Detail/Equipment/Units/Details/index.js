import React, {Component} from 'react';

import {Text, View, Dimensions, SectionList} from 'react-native';
import {Header, Button} from 'react-native-elements';
import Home from 'react-native-vector-icons/Feather';
import Check from 'react-native-vector-icons/Feather';
import Radio from 'react-native-vector-icons/Feather';
import RightArrow from 'react-native-vector-icons/Entypo';

// Components
import styles from './style';
import style from '../../style';
const {width, height} = Dimensions.get('window');

const unitData = [
  {
    title: 'Unit',
    data: [
      {
        leftIcon: 'home',
        leftName: 'Name',
        rightIcon: null,
        rightName: 'Unit 1',
      },
      {
        leftIcon: 'drops',
        leftName: 'Utility Type',
        rightIcon: 'chevron-down',
        rightName: 'All Water',
      },
      {
        leftIcon: 'building',
        leftName: 'Building',
        rightIcon: 'chevron-down',
        rightName: 'Bluegrass MHP',
      },
      {
        leftIcon: 'board',
        leftName: 'Notes',
        rightIcon: 'chevron-right',
        rightName: null,
      },
    ],
  },
];

const App = ({navigation}) => {
  const renderUnitList = () => {};

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          text: 'Close',
          style: {fontSize: width * 0.05, color: '#000'},
          onPress: () => navigation.goBack(),
        }}
        centerComponent={
          <View style={{flexDirection: 'row'}}>
            <Home
              name="home"
              size={20}
              color="#000"
              style={{alignSelf: 'center', marginRight: width * 0.01}}
            />
            <Text style={{fontSize: 20}}>Units Details</Text>
          </View>
        }
        rightComponent={{
          text: 'Save',
          style: {fontSize: width * 0.05, color: '#5c5c5ccf'},
        }}
        backgroundColor="#fff"
        containerStyle={{borderBottomWidth: width * 0.003, elevation: 1}}
      />
      <View style={styles.currentReadContainer}>
        <Text style={{color: '#5c5c5ccf'}}>CURRENT READ</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width,
            marginVertical: width * 0.01,
            paddingHorizontal: width * 0.04,
          }}>
          <Text style={{fontSize: width * 0.08, color: 'rgb(90,134,183)'}}>
            3,782 Gallons
          </Text>
          <RightArrow
            name="chevron-thin-right"
            size={width * 0.08}
            color="rgb(90,134,183)"
            style={{alignSelf: 'center', marginRight: width * 0.01}}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Check name="check" size={width * 0.05} color="#0fc908" />
          <Text style={{color: '#5c5c5ccf'}}>As of 5 hours ago</Text>
        </View>
      </View>
      <View>
        <Button
          title="Quick Actions"
          icon={
            <Radio
              name="radio"
              size={width * 0.06}
              color="#fff"
              style={{marginRight: width * 0.025}}
            />
          }
          buttonStyle={{backgroundColor: 'rgb(90,134,183)'}}
          onPress={() => console.log('Quick Actions Press')}
        />
      </View>
      {/* <SectionList
        sections={unitData}
        keyExtractor={(item, index) => item + index}
        renderItem={renderUnitList}
        renderSectionHeader={({section: {title}}) => (
          <Text>{title}</Text>
        )}></SectionList> */}
    </View>
  );
};

export default App;
