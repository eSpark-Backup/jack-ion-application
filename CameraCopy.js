import React, { Component } from 'react'
import {
  StyleSheet,
  StatusBar,
  Alert,
  View,
  Slider,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native'

import { RNCamera } from 'react-native-camera'
import BarcodeMask from 'react-native-barcode-mask'

export default class SystemSettingExample extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      // <View style>
      <RNCamera
        ref={ref => {
          this.camera = ref
        }}

        style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}
        type={RNCamera.Constants.Type.back}
        autoFocus='on'
        onBarCodeRead={this.onSuccess}
      // onGoogleVisionBarcodesDetected={this.onSuccess}
      // androidCameraPermissionOptions={{
      //   title: "Open Camera",
      //   message: "Open Open",
      //   buttonPositive: 'OK',
      //   buttonNegative: "Not Ok",
      // }}
      >
        <BarcodeMask />
        {/* <View style={{ height: height * .3, width: width * .6, borderWidth: width * .006, borderColor: 'yellow' }} /> */}
      </RNCamera>
      // </View>
    )
  }

}