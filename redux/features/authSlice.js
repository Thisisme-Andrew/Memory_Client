import  { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false,
    email: "",
    userID: "",
    isAdmin: false
  },
  reducers: {
    logOut: () => {
      return intialState;
    },
    logIn: (state, action) => {
      return {
        loggedIn: true,
        email: action.payload.email,
        userID: action.payload.userID,
        isAdmin: action.payload.isAdmin
      }
    }
  }
})