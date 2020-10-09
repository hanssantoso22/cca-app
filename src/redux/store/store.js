import { configureStore } from '@reduxjs/toolkit'
import { drawerSlice } from '../reducers/slice'

const store = configureStore({
    reducer: drawerSlice.reducer
})

export default store