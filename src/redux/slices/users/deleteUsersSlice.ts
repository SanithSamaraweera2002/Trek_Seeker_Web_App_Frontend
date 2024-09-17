import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { deleteUserAPIRequest } from '../../../api/users/users';
import { FetchUserByIdInterface, DeleteUserPropsInterface } from '../../../interfaces/usersInterface';

const initialState: DeleteUserPropsInterface = {
  deleteUserLoading: false,
  deleteUserData: {},
  deleteUserStatus: 'IDLE',
  deleteUserError: null,
};

export const deleteUserRequest: any = createAsyncThunk(
  'admin/user/delete',
  async (searchParams: FetchUserByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await deleteUserAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const deleteUserSlice = createSlice({
  name: 'deleteUsers',
  initialState,
  reducers: {
    clearDeleteUsersResponse: (state) => {
      state.deleteUserLoading = false;
      state.deleteUserData = {};
      state.deleteUserStatus = 'IDLE';
      state.deleteUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserRequest.pending, (state, action) => {
        state.deleteUserLoading = true;
        state.deleteUserStatus = 'PENDING';
      })
      .addCase(deleteUserRequest.fulfilled, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserStatus = 'SUCCESS';
        state.deleteUserData = action.payload;
      })
      .addCase(deleteUserRequest.rejected, (state, action) => {
        state.deleteUserLoading = false;
        state.deleteUserError = action.payload;
        state.deleteUserStatus = 'FAILED';
      });
  },
});

export const { clearDeleteUsersResponse } = deleteUserSlice.actions;

export const deleteUsersSelector = (state: RootState) => state.DeleteUser;

export default deleteUserSlice.reducer;
