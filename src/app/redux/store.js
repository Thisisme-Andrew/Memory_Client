import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userID: null, // ✅ Explicitly store userID in Redux
    fullName: "",
    email: "",
    password: "",
    registeredUsers: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.userID = action.payload.userID; // ✅ Store userID separately for easy access
    },
    logoutUser: (state) => {
      state.user = null;
      state.userID = null; // ✅ Clear userID on logout
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