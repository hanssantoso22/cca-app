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
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['activeScreen'],
    version: 1,
}
const store = configureStore({
    reducer: {
        main: persistReducer(persistConfig, drawerSlice.reducer),
        manageCCA: manageCCASlice.reducer,
        createEventSlice: CreateEventSlice.reducer,
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