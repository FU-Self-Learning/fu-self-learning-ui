import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "../types/authType";



const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});


export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
