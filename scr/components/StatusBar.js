import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const CustumStatusBar = ({backColor, transparent}) => {
  return (
    <View style={styles.container}>
      <MyStatusBar
        backgroundColor={
          backColor ? (transparent ? 'transparent' : '#35afe2') : '#fff'
        }
        barStyle="light-content"
      />
    </View>
  );
};
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? STATUSBAR_HEIGHT : 0;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  statusBar: {
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});
export default CustumStatusBar;
