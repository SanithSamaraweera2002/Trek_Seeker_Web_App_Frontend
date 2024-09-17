import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getUsersAPIRequest } from '../../../api/users/users';
import { FetchUsersInterface, FetchUsersPropsInterface } from '../../../interfaces/usersInterface';

const initialState: FetchUsersPropsInterface = {
  getUsersLoading: false,
  getUsersData: { data: [], total: 0, page: 0, totalPages: 0 },
  getUsersStatus: 'IDLE',
  getUsersError: null,
};

export const getUsersRequest: any = createAsyncThunk(
  'users/get/all',
  async (searchParams: FetchUsersInterface, thunkAPI: any) => {
    try {
      const response: any = await getUsersAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getUsersSlice = createSlice({
  name: 'getUsers',
  initialState,
  reducers: {
    clearFetchUsersResponse: (state) => {
      state.getUsersLoading = false;
      state.getUsersData = { data: [], total: 0, page: 0, totalPages: 0 };
      state.getUsersStatus = 'IDLE';
      state.getUsersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersRequest.pending, (state, action) => {
        state.getUsersLoading = true;
        state.getUsersStatus = 'PENDING';
      })
      .addCase(getUsersRequest.fulfilled, (state, action) => {
        state.getUsersLoading = false;
        state.getUsersStatus = 'SUCCESS';
        state.getUsersData = action.payload;
      })
      .addCase(getUsersRequest.rejected, (state, action) => {
        state.getUsersLoading = false;
        state.getUsersError = action.payload;
        state.getUsersStatus = 'FAILED';
      });
  },
});

export const { clearFetchUsersResponse } = getUsersSlice.actions;

export const getUsersSelector = (state: RootState) => state.FetchUsers;

export default getUsersSlice.reducer;
