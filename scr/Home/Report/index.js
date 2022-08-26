import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustumStatusBar from '../../components/StatusBar';
import Drawer from '../../components/modal/Drawer/index';
import TextReuseableComponent from '../../components/Text/index';

import { styles } from './styles';

const { width, height } = Dimensions.get('screen');
export const PropertyReport = ({ navigation }) => {

  const [isModalVisible, setisModalVisible] = useState(false)
  const [alertSelected, setAlertSelected] = useState(false)
  const [detailsSelected, setDetailsSelected] = useState(false)
  const [equipmentsSelected, setEquipmentsSelected] = useState(false)
  const [reportsSelected, setReportsSelected] = useState(false)
  const [supportSelected, setSupportSelected] = useState(false)

  const items = [
    {
      name: 'Consumption Comparison Report',
      description:
        'Building Name, Unit Name, Device Serial Number, Consumption Limit, Actual Consumption, Alert Level, Date',
      icon: (
        <Entypo
          name="bar-graph"
          size={width * 0.065}
          color="#25AAE1ec"
          style={{ marginRight: width * 0.02 }}
        />
      ),
      navigateTo: 'ConsumptionComparison',
    },
    {
      name: 'Usage',
      description:
        'Building, Unit, Device Serial Number, Meter Usage, Meter Reading, Utility Type, Date',
      icon: (
        <MaterialIcons
          name="data-usage"
          size={width * 0.065}
          color="#25AAE1ec"
          style={{ marginRight: width * 0.02 }}
        />
      ),
      navigateTo: 'Usage',
    },
    {
      name: 'Network',
      description:
        'Building, Unit, Device Serial Number, Attached To, Manufacturer, Device, Date',
      icon: (
        <Entypo
          name="network"
          size={width * 0.065}
          color="#25AAE1ec"
          style={{ marginRight: width * 0.02 }}
        />
      ),
      navigateTo: 'Network',
    },
    {
      name: 'Battery',
      description: 'Building, Unit, Device Serial Number, Battery, Date',
      icon: (
        <Feather
          name="battery"
          size={width * 0.065}
          color="#25AAE1ec"
          style={{ marginRight: width * 0.02 }}
        />
      ),
      navigateTo: 'Battery',
    },
    {
      name: 'Temperature',
      description: 'Building, Unit, Device Serial Number, Temperature, Date',
      icon: (
        <FontAwesome5
          name="temperature-low"
          size={width * 0.065}
          color="#25AAE1ec"
          style={{ marginRight: width * 0.02 }}
        />
      ),
      navigateTo: 'Temperature',
    },
  ];

  const toggleModal = () => {
    setisModalVisible(!isModalVisible);
    setReportsSelected(true);
    setDetailsSelected(false);
    setEquipmentsSelected(false);
    setSupportSelected(false);
    setAlertSelected(false);
  };

  const naviagateToEquip = () => {
    toggleModal();
    navigation.navigate('Equip', navigation.state.params);
  };

  const naviagateToDetail = () => {
    toggleModal();
    navigation.navigate(
      'Detail',
      navigation.state.params,
    );
  };

  const navigateToReport = () => {
    toggleModal();
  };

  const naviagateToAlerts = () => {
    toggleModal();
    navigation.navigate(
      'Alerts',
      navigation.state.params,
    );
  };

  const naviagateToSupport = () => {
    setisModalVisible(!isModalVisible);
    navigation.navigate('Support');
  };
  return (
    <View>
      {Platform.OS == 'ios' && <CustumStatusBar />}
      <View style={styles.headingContainer}>
        <View style={[styles.headingInner]}>
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.drawerMenuBtn}>
            <MaterialIcons size={width * 0.08} color="white" name="menu" />
          </TouchableOpacity>
          <View style={styles.mainHeadingContainer}>
            <TextReuseableComponent title style={styles.mainHeadiing} value={"Property Reports"} />
          </View>
        </View>
      </View>

      <Drawer
        isVisible={isModalVisible}
        onCancel={toggleModal}
        naviagateToDetail={naviagateToDetail}
        naviagateToEquip={naviagateToEquip}
        // naviagateToChart={naviagateToChart}
        naviagateToAlerts={naviagateToAlerts}
        naviagateToSupport={naviagateToSupport}
        navigateToReport={navigateToReport}
        detailsSelected={detailsSelected}
        equipmentsSelected={equipmentsSelected}
        alertSelected={alertSelected}
        reportsSelected={reportsSelected}
        supportSelected={supportSelected}
        propertyName={navigation?.state?.params?.item?.item.name}
      />

      <View>
        {items?.map((val, ind) => {
          return (
            <TouchableOpacity key={ind} activeOpacity={.8} onPress={() => navigation?.navigate(val?.navigateTo, { propId: navigation?.state?.params?.item?.item?.id })}
              style={styles.itemContainer}>
              <View style={{ width: "10%" }}>
                {val?.icon}
              </View>
              <View style={{ width: "90%", height: 60 }}>
                <TextReuseableComponent title value={val?.name} />
                <TextReuseableComponent numberOfLines={2} value={val?.description} />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

    </View>
  );
};
