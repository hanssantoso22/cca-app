import React from 'react';
import RootController from './src/components/drawer/RootController'
import { Provider } from 'react-redux'
import store, { persistor } from './src/redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootController />
      </PersistGate>
    </Provider>
  );
}