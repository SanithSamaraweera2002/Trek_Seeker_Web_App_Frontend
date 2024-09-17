import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addUserAPIRequest } from '../../../api/users/users';
import { AddUserInterface, AddUserPropsInterface } from '../../../interfaces/usersInterface';

const initialState: AddUserPropsInterface = {
  addUserLoading: false,
  addUserData: {},
  addUserError: null,
  addUserStatus: 'IDLE',
};

export const addUsersRequest: any = createAsyncThunk(
  'admin/users/add',
  async (user: AddUserInterface, thunkAPI: any) => {
    try {
      const response: any = await addUserAPIRequest(user);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const addUserSlice = createSlice({
  name: 'addUser',
  initialState,
  reducers: {
    clearAddUsersResponse: (state) => {
      state.addUserLoading = false;
      state.addUserData = {};
      state.addUserStatus = 'IDLE';
      state.addUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUsersRequest.pending, (state, action) => {
        state.addUserLoading = true;
        state.addUserStatus = 'PENDING';
      })
      .addCase(addUsersRequest.fulfilled, (state, action) => {
        state.addUserLoading = false;
        state.addUserStatus = 'SUCCESS';
        state.addUserData = action.payload;
      })
      .addCase(addUsersRequest.rejected, (state, action) => {
        state.addUserLoading = false;
        state.addUserError = action.payload;
        state.addUserStatus = 'FAILED';
      });
  },
});

export const { clearAddUsersResponse } = addUserSlice.actions;

export const addUsersSelector = (state: RootState) => state.AddUser;

export default addUserSlice.reducer;
