import { createSlice } from '@reduxjs/toolkit'
import { Alert } from 'react-native'
import { URL, authenticate } from '../../api/config'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import * as SecureStore from 'expo-secure-store'

export const drawerSlice = createSlice({
    name: 'active_screen',
    initialState: {
        activeScreen: 'HomeScreen',
        isAdmin: false,
        isLoggedIn: false,
        token: '',
        askPushNotification: false,
    },
    reducers: {
        navigateToPage (state, action) {
            state.activeScreen = action.payload
        },
        login (state, action) {
            if (action.payload.admin) {
                state.activeScreen = 'AdminManageUserScreen'
            }
            else {
                state.activeScreen = 'HomeScreen'
            }
            state.isLoggedIn = true
            state.token = action.payload.token
            state.isAdmin = action.payload.admin
        },
        logoutAccount (state,action) {
            state.isLoggedIn = false
            state.isAdmin = false
        },
        changeAskPushNotification (state, action) {
            state.askPushNotification = action.payload
        }
    }
})
//Redux Thunk action creators
export const verifyLogin = (email,password) => async dispatch => {
    try {
        const response = await axios.post(`${URL}/users/login`, {email, password })
        const data = response.data
        dispatch(login({
            token: data.token,
            admin: data.user.role == 'admin'
        }))
    } catch (err) {
        Alert.alert('Login failed!')
        console.log(err)
    }
}
//Similar to verifyLogin, but for Biometrics Registration purpose
export const registerCredentials = (email,password) => async dispatch => {
    try {
        const response = await axios.post(`${URL}/users/login`, {email, password })
        const data = response.data
        await SecureStore.setItemAsync('email',email)
        await SecureStore.setItemAsync('password',password)
        dispatch(login({
            token: data.token,
            admin: data.user.role == 'admin'
        }))
    } catch (err) {
        Alert.alert('Biometrics authentication setup failed')
        console.log(err)
    }
}
export const signUp = (data) => async dispatch => {
    try {
        const res = await axios.post(`${URL}/users/signup`, data)
        const token = res.data.token
        dispatch(login({
            token,
            admin: false,
        }))
        console.log(res)
    } catch (err) {
        Alert.alert('Registration failed!')
    }
}
export const logout = (userToken) => async dispatch => {
    try {
        await AsyncStorage.clear()
        .then ((res) => {
            console.log('Flush successful')
        })
        .catch ((err) => {
            console.log('Flush unsuccessful')
        })
        const token = await axios.get(`${URL}/users/logout`, authenticate(userToken))
        dispatch(logoutAccount())
    } catch (err) {
        console.log('Logout failed!',err.request)
    }
}
export const { navigateToPage, login, logoutAccount, changeAskPushNotification } = drawerSlice.actions