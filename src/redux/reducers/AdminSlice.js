import { createSlice } from '@reduxjs/toolkit'

export const AdminSlice = createSlice({
    name: 'admin_state',
    initialState: {
        selectedUsers: [],
        selectedUserIds: []
    },
    reducers: {
        editSelectedUsers (state, action) {
            state.selectedUsers = action.payload.selectedUsers
            state.selectedUserIds = action.payload.selectedUserIds
        }
    }
})

export const { editSelectedUsers } = AdminSlice.actions