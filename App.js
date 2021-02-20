import React, { useState, useEffect } from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'
import { PURPLE } from './src/components/common/styles'
import AppLogo from './src/assets/common/logo.png'
import * as SplashScreen from 'expo-splash-screen'
import RootController from './src/components/drawer/RootController'
import { Provider } from 'react-redux'
import store, { persistor } from './src/redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'

SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error
export default function App() {
  const [isAppReady, setIsAppReady] = useState(false)
  const styles = StyleSheet.create({
    splashContainer: {
      backgroundColor: PURPLE[5],
      alignItems: 'center',
      alignContent: 'center'
    },
    appLogo: {
      width: 150,
      height: 150
    }
  })
  useEffect(() => {
    async function loadApp () {
      try {
        setTimeout (async () => {
          await SplashScreen.hideAsync();
          setIsAppReady(true)
        }, 5000)
      } catch (error) {
        console.log(error)
      }
    }
    loadApp()
  }, [])
  return (isAppReady &&
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootController />
      </PersistGate>
    </Provider>
  );
}