import { createSlice } from '@reduxjs/toolkit'

export const AdminSlice = createSlice({
    name: 'admin_state',
    initialState: {
        selectedUsers: [],
        selectedUserIds: [],
        selectedExcos: [],
        selectedExcoIds: [],
        selectedMaincomms: [],
        selectedMaincommIds: [],
    },
    reducers: {
        editSelectedUsers (state, action) {
            state.selectedUsers = action.payload.selectedUsers
            state.selectedUserIds = action.payload.selectedUserIds
        },
        editExcos (state, action) {
            state.selectedExcos = action.payload.selectedExcos
            state.selectedExcoIds = action.payload.selectedExcoIds
        },
        editMaincomms (state, action) {
            state.selectedMaincomms = action.payload.selectedMaincomms
            state.selectedMaincommIds = action.payload.selectedMaincommIds
        }
    }
})

export const { editSelectedUsers, editExcos, editMaincomms } = AdminSlice.actions