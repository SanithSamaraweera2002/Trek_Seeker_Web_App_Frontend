import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { updateUserAPIRequest } from '../../../api/users/users';
import { UpdateUsersInterface, UpdateUsersPropsInterface } from '../../../interfaces/usersInterface';

const initialState: UpdateUsersPropsInterface = {
  editUsersLoading: false,
  editUsersData: {},
  editUsersError: null,
  editUsersStatus: 'IDLE',
};

export const updateUserRequest: any = createAsyncThunk(
  'admin/users/edit',
  async (user: UpdateUsersInterface, thunkAPI: any) => {
    try {
      const response: any = await updateUserAPIRequest(user);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const editUserSlice = createSlice({
  name: 'editUsers',
  initialState,
  reducers: {
    clearEditUsersResponse: (state) => {
      state.editUsersLoading = false;
      state.editUsersData = {};
      state.editUsersStatus = 'IDLE';
      state.editUsersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserRequest.pending, (state, action) => {
        state.editUsersLoading = true;
        state.editUsersStatus = 'PENDING';
      })
      .addCase(updateUserRequest.fulfilled, (state, action) => {
        state.editUsersLoading = false;
        state.editUsersStatus = 'SUCCESS';
        state.editUsersData = action.payload;
      })
      .addCase(updateUserRequest.rejected, (state, action) => {
        state.editUsersLoading = false;
        state.editUsersError = action.payload;
        state.editUsersStatus = 'FAILED';
      });
  },
});

export const { clearEditUsersResponse } = editUserSlice.actions;

export const editUsersSelector = (state: RootState) => state.EditUser;

export default editUserSlice.reducer;
