import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import RootController from './src/components/drawer/RootController'
import { Provider } from 'react-redux'
import store from './src/redux/store/store'

export default function App() {
  return (
    <Provider store={store}>
      <RootController />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
});
