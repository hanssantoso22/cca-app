import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

export const CreateEventSlice = createSlice({
    name: 'event_schedule',
    initialState: {
        startDate: '',
        endDate: '',
    },
    reducers: {
        changeStartDate (state, action) {
            state.startDate = action.payload
        },
        changeEndDate (state, action) {
            state.endDate = action.payload
        }
    }
})
export const { changeStartDate, changeEndDate } = CreateEventSlice.actions