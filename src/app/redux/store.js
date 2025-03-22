import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Currently logged-in user
    fullName: "", // ✅ Added fullName
    email: "",
    password: "",
    registeredUsers: [], // Store signed-up users
  },
  reducers: {
    setFullName: (state, action) => {
      state.fullName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    registerUser: (state, action) => {
      state.registeredUsers.push(action.payload); // Add new user to list
    },
    logout: (state) => {
      state.user = null;
      state.fullName = "";
      state.email = "";
      state.password = "";
    },
  },
});

export const { setFullName, setEmail, setPassword, setUser, registerUser, logout } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;