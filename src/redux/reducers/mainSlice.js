import { createSlice } from '@reduxjs/toolkit'
import { URL } from '../../api/config'
import axios from 'axios'
import customAxios from '../../api/config'
import store from '../store/store'

export const drawerSlice = createSlice({
    name: 'active_screen',
    initialState: {
        activeScreen: 'HomeScreen',
        isAdmin: false,
        isLoggedIn: false,
        token: '',
    },
    reducers: {
        navigateToPage (state, action) {
            state.activeScreen = action.payload
        },
        login (state, action) {
            if (action.payload.admin) {
                state.activeScreen = 'AdminManageUserScreen'
            }
            state.isLoggedIn = true
            state.token = action.payload.token
            state.isAdmin = action.payload.admin

        },
        logoutAccount (state,action) {
            state.isLoggedIn = false
            state.isAdmin = false
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
        console.log('Login error:',err,'Email: ',email)
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
    } catch (err) {

    }
}
export const logout = () => async dispatch => {
    try {
        const token = await customAxios.get('/users/logout')
        dispatch(logoutAccount())
        console.log('Logout successful!')
    } catch (err) {
        console.log('Logout failed!',err)
        console.log(store.getState().main.token)
    }
}
export const { navigateToPage, login, logoutAccount } = drawerSlice.actions