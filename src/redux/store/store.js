import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { drawerSlice } from '../reducers/mainSlice'
import { manageCCASlice } from '../reducers/manageCCASlice'
import { CreateEventSlice } from '../reducers/CreateEventSlice'
import { AdminSlice } from '../reducers/AdminSlice'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import AsyncStorage from '@react-native-community/async-storage'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whiteList: ['token','isLoggedIn','isAdmin', 'user'],
    blacklist: ['activeScreen'],
    version: 1,
    stateReconciler: autoMergeLevel1,
}
const store = configureStore({
    reducer: {
        main: persistReducer(persistConfig, drawerSlice.reducer),
        manageCCA: manageCCASlice.reducer,
        createEvent: CreateEventSlice.reducer,
        admin: AdminSlice.reducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
})
export let persistor = persistStore(store)

export const isLoggedIn = state => state.main.isLoggedIn
export const isAdmin = state => state.main.isAdmin
export const activeScreen = state => state.main.activeScreen
export const isModalOpened = state => state.manageCCA.isModalVisible
export const selectedItem = state => state.manageCCA.itemSelected

export default store