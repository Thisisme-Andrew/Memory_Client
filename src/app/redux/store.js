import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userID: null, 
    fullName: "",
    email: "",
    password: "",
    registeredUsers: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.userID = action.payload.userID;
    },
    logoutUser: (state) => {
      state.user = null;
      state.userID = null; 
      state.fullName = "";
      state.email = "";
      state.password = "";
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;