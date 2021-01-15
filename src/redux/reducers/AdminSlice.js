import { createSlice } from '@reduxjs/toolkit'

export const AdminSlice = createSlice({
    name: 'admin_state',
    initialState: {
        selectedUsers: []
    },
    reducers: {
        editSelectedUsers (state, action) {
            state.selectedUsers = action.payload.selectedUsers
        }
    }
})

export const { editSelectedUsers } = AdminSlice.actions