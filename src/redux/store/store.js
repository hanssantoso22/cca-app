import { configureStore } from '@reduxjs/toolkit'
import { drawerSlice } from '../reducers/mainSlice'
import { manageCCASlice } from '../reducers/manageCCASlice'

const store = configureStore({
    reducer: {
        main: drawerSlice.reducer,
        manageCCA: manageCCASlice.reducer
    }
})
export const isLoggedIn = state => state.main.isLoggedIn
export const isAdmin = state => state.main.isAdmin
export const activeScreen = state => state.main.activeScreen
export const isModalOpened = state => state.manageCCA.isModalVisible
export const selectedItem = state => state.manageCCA.itemSelected

export default store