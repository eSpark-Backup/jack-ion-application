import React, {Component} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';
import DropDown from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import styles from './style';

const {width, height} = Dimensions.get('window');

export default (props) => {
  return (
    <View style={{flex: 1}}>
      <Header
        barStyle="dark-content"
        leftComponent={{
          text: 'Close',
          style: {fontSize: width * 0.05, color: '#000'},
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#18CADC'}}>Filter</Text>
            <Progress.Bar
              progress={0.2}
              borderWidth={1}
              borderColor="#e1e1e1"
              color={0.2 == 1 ? '#1ED257' : '#18CADC'}
              width={width * 0.8}
              height={height * 0.01}
              style={{marginTop: 20}}
            />
            <Text style={{fontSize: width * 0.04}}>
              13 of 13 Properties Remaining
            </Text>
          </View>
        }
        rightComponent={{
          text: 'Reset',
          style: {fontSize: width * 0.05, color: '#5c5c5ccf'},
        }}
        backgroundColor="#fff"
        containerStyle={{borderBottomWidth: width * 0.003, elevation: 1}}
      />
      <View style={styles.currentReadContainer}>
        <View style={styles.filterHeading}>
          <Text style={styles.filterListText}>Portfolio Details</Text>
        </View>
        <View style={styles.filterLists}>
          <Text style={styles.filterListText}>Billing</Text>
          <Text>ION Energy Solutions</Text>
        </View>
      </View>
      <View style={styles.currentReadContainer}>
        <View style={styles.filterHeading}>
          <Text style={styles.filterListText}>Property Details</Text>
        </View>
        <View style={styles.filterLists}>
          <Text style={styles.filterListText}>Install Status</Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: width * 0.04}}>---</Text>
            <DropDown name="caret-down" size={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterLists}>
          <Text style={styles.filterListText}>Address</Text>
          <Text>Enter Address</Text>
        </View>
        <View style={styles.filterLists}>
          <Text style={styles.filterListText}>Distance</Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: width * 0.04}}>---</Text>
            <DropDown name="caret-down" size={15} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.currentReadContainer}>
        <View style={styles.filterHeading}>
          <Text style={styles.filterListText}>Utility Types</Text>
        </View>
        <View style={styles.filterLists}>
          <Text style={styles.filterListText}>Billing</Text>
          <Text>ION Energy Solutions</Text>
        </View>
      </View>
    </View>
  );
};
