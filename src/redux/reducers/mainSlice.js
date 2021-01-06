import { createSlice } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
    name: 'active_screen',
    initialState: {
        activeScreen: 'HomeScreen',
        isAdmin: false,
        isLoggedIn: false,
    },
    reducers: {
        navigateToPage (state, action) {
            state.activeScreen = action.payload
        },
        login (state, action) {
            state.isLoggedIn = !state.isLoggedIn
        }
    }
})
export const { navigateToPage, login } = drawerSlice.actions