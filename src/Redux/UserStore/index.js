import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      state.user = action.payload
    },
    REMOVE_USER: (state) => {
        state.user = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { SET_USER, REMOVE_USER } = userSlice.actions

export default userSlice.reducer