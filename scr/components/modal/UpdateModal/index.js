import React, {Component, Fragment, version} from 'react';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

//Packages

import Modal from 'react-native-modal';
import Build from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-elements';
import {Icon, IconToggle} from 'react-native-material-ui';

// Components

import styles from './style';
const {width, height} = Dimensions.get('window');

export default class UpdateModal extends Component {
  constructor() {
    super();
    this.state = {
      editBuilding: '',
      editBuildDes: '',
      error: {
        buildingName: false,
        units: false,
        editBuilding: '',
      },
    };
  }

  updateBuilding = () => {
    let data = {
      name: this.state.editBuilding,
      descriptions: this.state.editBuildDes,
    };
    this.props.reRun(true, data);
  };

  deleteBuilding = () => {
    this.props.reRun(false);
  };

  deleteAlert = () => {
    Alert.alert('Delete Building', 'Are you sure you want to Delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => this.deleteBuilding()},
    ]);
  };

  editAlert = () => {
    if (this.state.editBuilding === '') {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          editBuilding: 'Invalid Building Name', // update the value of specific key
        },
      }));
      return;
    } else {
      this.setState((prevState) => ({
        ...prevState,
        error: {
          // object that we want to update
          ...prevState.error, // keep all other key-value pairs
          editBuilding: '', // update the value of specific key
        },
      }));
      Alert.alert('Update Building', 'Are you sure you want to Update?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.updateBuilding()},
      ]);
    }
  };

  clearUpdateBuild = () => {
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        editBuilding: '', // update the value of specific key
      },
    }));
    this.props.reRun(null);
  };

  render() {
    const {
      title,
      style,
      isVisible,
      onCancel,
      children,
      doneBtnTitle,
      onDone,
      onDelete,
      buildingData,
    } = this.props;
    return (
      <Modal
        animationIn="slideInDown"
        animationOut="slideOutUp"
        hasBackdrop={true}
        backdropColor="black"
        isVisible={isVisible}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalInner}>
            <View style={[styles.boxConatainer, style]}>
              <View style={styles.boxInner}>
                {/* Box Header */}
                <View style={styles.boxHeader}>
                  <View style={styles.boxHeaderInner}>
                    <Icon
                      name={'business'}
                      size={height * 0.05}
                      color="#5e5e5e"
                    />
                    <Text style={styles.modalHeading}>{title}</Text>
                    <Pressable
                      onPress={onCancel}
                      android_ripple={{
                        color: 'black',
                        borderless: true,
                        radius: width * 0.03,
                      }}>
                      <Icon
                        name="cancel"
                        size={height * 0.035}
                        color="black"
                        maxOpacity={0.5}
                      />
                    </Pressable>
                  </View>
                </View>
                {/* Box Body */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    <View style={styles.desciptionContainer}>
                      <Build
                        name={'office-building'}
                        size={height * 0.02}
                        color="#5e5e5e"
                      />
                      <Text style={styles.desciptionHeading}>BUILDING*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        // label="Name*"
                        value={this.state.editBuilding}
                        dense={true}
                        error={this.state.error.editBuilding}
                        onChangeText={(text) => {
                          this.setState({editBuilding: text});
                          this.setState((prevState) => ({
                            error: {
                              // object that we want to update
                              ...prevState.error, // keep all other key-value pairs
                              editBuilding: '',
                            },
                          }));
                        }}
                        style={styles.input}
                        mode={'outlined'}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                          },
                        }}
                      />
                    </View>
                    {this.state.error.editBuilding ? (
                      <HelperText
                        type="error"
                        visible={this.state.error.editBuilding}>
                        {this.state.error.editBuilding}
                      </HelperText>
                    ) : null}
                    <View style={styles.desciptionContainer}>
                      <Text style={styles.desciptionHeading}>
                        Building Despcription*
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        value={this.state.editBuildDes}
                        dense={true}
                        onChangeText={(text) => {
                          this.setState({editBuildDes: text});
                        }}
                        style={styles.input}
                        mode={'outlined'}
                        theme={{
                          colors: {
                            text: '#25AAE1ec',
                            primary: '#25AAE1ec',
                            selectionColor: 'red',
                          },
                        }}
                      />
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: width * 0.75,
                          alignSelf: 'center',
                          marginVertical: width * 0.05,
                        }}>
                        <Button
                          titleStyle={{textTransform: 'capitalize'}}
                          title={`Delete Building`}
                          buttonStyle={{
                            backgroundColor: '#e24b4b',
                          }}
                          onPress={this.deleteAlert}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
                {/* {children} */}
                {/* Box Footer */}
                <View style={styles.footerBtn}>
                  <View style={styles.bottonContainer}>
                    <TouchableOpacity onPress={this.clearUpdateBuild}>
                      <View style={styles.cancelBotton}>
                        <Plus name="close" color="black" size={18} />
                        <Text style={{color: 'black'}}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.editAlert}>
                      <View style={styles.saveUnitBotton}>
                        <Plus name="plus" color="white" size={18} />
                        <Text style={{color: 'white'}}>{doneBtnTitle}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
