import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginPageInterface, LoginPagePropsInterface } from '../../../interfaces/logininterface';
import { loginAPIRequest } from '../../../api/authorization/auth';
import { RootState } from '../../store';

const initialState: LoginPagePropsInterface = {
  LoginLoading: false,
  LoginUserInfo: {},
  LoginError: null,
  LoginStatus: 'IDLE',
};

export const loginUserRequest: any = createAsyncThunk(
  'users/login',
  async (userCredentials: LoginPageInterface, thunkAPI: any) => {
    try {
      const response: any = await loginAPIRequest(userCredentials);
      return response?.data;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearLoginResponse: (state) => {
      state.LoginLoading = false;
      state.LoginStatus = 'IDLE';
      state.LoginUserInfo = {};
      state.LoginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserRequest.pending, (state, action) => {
        state.LoginLoading = true;
        state.LoginStatus = 'PENDING';
      })
      .addCase(loginUserRequest.fulfilled, (state, action) => {
        state.LoginLoading = false;
        state.LoginUserInfo = action.payload;
        state.LoginStatus = 'SUCCESS';
      })
      .addCase(loginUserRequest.rejected, (state, action) => {
        state.LoginLoading = false;
        state.LoginError = action.payload;
        state.LoginStatus = 'FAILED';
      });
  },
});

export const { clearLoginResponse } = loginSlice.actions;

export const loginSelector = (state: RootState) => state.login;

export default loginSlice.reducer;
