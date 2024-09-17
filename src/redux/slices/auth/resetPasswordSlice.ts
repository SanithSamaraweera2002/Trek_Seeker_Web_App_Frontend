import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { resetPasswordInterface, resetPasswordPropsInterface } from '../../../interfaces/logininterface';
import { resetPasswordAPIRequest } from '../../../api/authorization/auth';

const initialState: resetPasswordPropsInterface = {
  resetPasswordLoading: false,
  resetPasswordInfo: {},
  resetPasswordError: null,
  resetPasswordStatus: 'IDLE',
};

export const resetPasswordRequest: any = createAsyncThunk(
  'auth/resetPassword',
  async (resetData: resetPasswordInterface, thunkAPI: any) => {
    try {
      const response: any = await resetPasswordAPIRequest(resetData);
      return response?.data;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    clearResetPasswordResponse: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordStatus = 'IDLE';
      state.resetPasswordInfo = {};
      state.resetPasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordRequest.pending, (state, action) => {
        state.resetPasswordLoading = true;
        state.resetPasswordStatus = 'PENDING';
      })
      .addCase(resetPasswordRequest.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordInfo = action.payload;
        state.resetPasswordStatus = 'SUCCESS';
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
        state.resetPasswordStatus = 'FAILED';
      });
  },
});

export const { clearResetPasswordResponse } = resetPasswordSlice.actions;

export const resetPasswordSelector = (state: RootState) => state.ResetPassword;

export default resetPasswordSlice.reducer;
