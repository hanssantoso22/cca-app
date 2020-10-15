import { createSlice } from '@reduxjs/toolkit'

export const manageCCASlice = createSlice({
    name: 'manageCCA',
    initialState: {
        isModalVisible: false,
        itemSelected: null,
    },
    reducers: {
        toggleModal (state) {
            state.isModalVisible = !state.isModalVisible
        },
        selectItemInModal (state, action) {
            state.itemSelected = action.payload
        }
    }
})
export const { toggleModal, selectItemInModal } = manageCCASlice.actions