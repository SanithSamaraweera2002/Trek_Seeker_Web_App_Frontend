import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchDashboardStatsPropsInterface } from '../../../interfaces/systemInterface';
import { getDashboardStatsAPIRequest } from '../../../api/dashboard/dashboard';

const initialState: FetchDashboardStatsPropsInterface = {
  getDashboardStatsLoading: false,
  getDashboardStatsData: {},
  getDashboardStatsStatus: 'IDLE',
  getDashboardStatsError: null,
};

export const getDashboardStatsRequest: any = createAsyncThunk('admin/dashboard/get', async (thunkAPI: any) => {
  try {
    const response: any = await getDashboardStatsAPIRequest();
    return response;
  } catch (error: any) {
    if (!error?.response) {
      throw error;
    }
    return thunkAPI.rejectWithValue(error?.response.data);
  }
});

const getDashboardStatsSlice = createSlice({
  name: 'getDestinations',
  initialState,
  reducers: {
    clearFetchDashboardStatsResponse: (state) => {
      state.getDashboardStatsLoading = false;
      state.getDashboardStatsData = {};
      state.getDashboardStatsStatus = 'IDLE';
      state.getDashboardStatsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStatsRequest.pending, (state, action) => {
        state.getDashboardStatsLoading = true;
        state.getDashboardStatsStatus = 'PENDING';
      })
      .addCase(getDashboardStatsRequest.fulfilled, (state, action) => {
        state.getDashboardStatsLoading = false;
        state.getDashboardStatsStatus = 'SUCCESS';
        state.getDashboardStatsData = action.payload;
      })
      .addCase(getDashboardStatsRequest.rejected, (state, action) => {
        state.getDashboardStatsLoading = false;
        state.getDashboardStatsError = action.payload;
        state.getDashboardStatsStatus = 'FAILED';
      });
  },
});

export const { clearFetchDashboardStatsResponse } = getDashboardStatsSlice.actions;

export const getDashboardStatsSelector = (state: RootState) => state.FetchDashboardStats;

export default getDashboardStatsSlice.reducer;
