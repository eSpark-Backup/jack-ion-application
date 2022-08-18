import React, {Component, Fragment, version} from 'react';

import {
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';

//Packages

import Modal from 'react-native-modal';
import Build from 'react-native-vector-icons/FontAwesome5';
import Plus from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-elements';
import {Icon, IconToggle} from 'react-native-material-ui';

import TextReuseableComponent from '../../Text/index';

// Components

import styles from './style';
const {width, height} = Dimensions.get('window');

export default class UpdateModal extends Component {
  constructor() {
    super();
    this.state = {
      editBuilding: '',
      editBuildDes: '',
      modalVisible: false,
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
    this.setState({modalVisible: false});
  };

  deleteBuilding = () => {
    this.props.reRun(false);
    this.setState({modalVisible: false});
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
    console.log('CHALA KIYA BSDK');
    this.setState((prevState) => ({
      ...prevState,
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        editBuilding: '', // update the value of specific key
      },
    }));
    this.setState({modalVisible: false});
    this.props.reRun(null);
  };

  render() {
    const {title, style, isVisible, doneBtnTitle, buildingData} = this.props;
    if (isVisible && this.state.modalVisible == false) {
      this.setState({
        editBuilding: buildingData.buildingName,
        editBuildDes: buildingData.buildingDes,
        modalVisible: true,
      });
    }
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
                    <TextReuseableComponent title style={styles.modalHeading} value={title} />
                    <Pressable
                      onPress={this.clearUpdateBuild}
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
                        name={'building'}
                        size={width * 0.04}
                        color="#5e5e5e"
                      />
                      <TextReuseableComponent title style={styles.desciptionHeading} value={"BUILDING*"} />
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
                      <TextReuseableComponent title style={styles.desciptionHeading} value={"Building Despcription*"} />
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
                        <TextReuseableComponent title style={{color: 'black'}} value={"Cancel"} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.editAlert}>
                      <View style={styles.saveUnitBotton}>
                        <Plus name="plus" color="white" size={18} />
                        <TextReuseableComponent title style={{color: 'white'}} value={doneBtnTitle} />
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
