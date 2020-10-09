import { createSlice } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
    name: 'active_screen',
    initialState: {
        activeScreen: 'HomeScreen'
    },
    reducers: {
        navigateToPage (state, action) {
            state.activeScreen = action.payload
        }
    }
})
export const { navigateToPage } = drawerSlice.actions
export const activeScreen = state => state.activeScreen