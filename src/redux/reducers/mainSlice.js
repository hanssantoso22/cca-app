import { createSlice } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
    name: 'active_screen',
    initialState: {
        activeScreen: 'HomeScreen',
        isAdmin: true,
        isLoggedIn: true,
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