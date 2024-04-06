import { configureStore } from "@reduxjs/toolkit";
import course from "./slices/courseSlice";
import user from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    course,
    user
  }
})