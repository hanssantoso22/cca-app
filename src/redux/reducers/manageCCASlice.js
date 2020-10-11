import { createSlice } from '@reduxjs/toolkit'

export const manageCCASlice = createSlice({
    name: 'manageCCA',
    initialState: {
        isModalVisible: false,
    },
    reducers: {
        toggleModal (state) {
            state.isModalVisible = !state.isModalVisible
        }
    }
})
export const { toggleModal } = manageCCASlice.actions