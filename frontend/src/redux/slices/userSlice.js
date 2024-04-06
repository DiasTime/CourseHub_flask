import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuth: false,
  name: "",
  email: "",
  acc_type: "",
  password: "",
  savedCourses: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    addToSavedCourses(state, action) {
      state.savedCourses.push(action.payload);
    }
  },
})

export const userSelector = state => state.user

export const { setUser, addToSavedCourses } = userSlice.actions
export default userSlice.reducer;
