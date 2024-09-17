import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { forgotPasswordPropsInterface } from '../../../interfaces/logininterface';
import { forgotPasswordAPIRequest } from '../../../api/authorization/auth';

const initialState: forgotPasswordPropsInterface = {
  forgotPasswordLoading: false,
  forgotPasswordInfo: {},
  forgotPasswordError: null,
  forgotPasswordStatus: 'IDLE',
};

export const forgotPasswordRequest: any = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, thunkAPI: any) => {
    try {
      const response: any = await forgotPasswordAPIRequest(email);
      return response?.data;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    clearForgotPasswordResponse: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordStatus = 'IDLE';
      state.forgotPasswordInfo = {};
      state.forgotPasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordRequest.pending, (state, action) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordStatus = 'PENDING';
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordInfo = action.payload;
        state.forgotPasswordStatus = 'SUCCESS';
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
        state.forgotPasswordStatus = 'FAILED';
      });
  },
});

export const { clearForgotPasswordResponse } = forgotPasswordSlice.actions;

export const forgotPasswordSelector = (state: RootState) => state.ForgotPassword;

export default forgotPasswordSlice.reducer;
