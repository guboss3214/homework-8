import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginRequest, registerRequest } from "../../api/userActions";
import type { IUserData } from "../../interfaces/userData";

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
};

export const loginUser = createAsyncThunk('/api/auth/login', async (data: IUserData) => {
    const res = await loginRequest(data);
    return res.data;
})

export const registerUser = createAsyncThunk('/users/register', async (data: IUserData) => {
    const res = await registerRequest(data);
    return res.data;
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ access_token: string }>) => {
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.access_token);
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;