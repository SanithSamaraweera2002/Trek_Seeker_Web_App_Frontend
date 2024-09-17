import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getTravelersAPIRequest } from '../../../api/traveler/travelers';
import { FetchTravelersInterface, FetchTravelersPropsInterface } from '../../../interfaces/travelersInterface';

const initialState: FetchTravelersPropsInterface = {
  getTravelersLoading: false,
  getTravelersData: { data: [], total: 0, page: 0, totalPages: 0 },
  getTravelersStatus: 'IDLE',
  getTravelersError: null,
};

export const getTravelersRequest: any = createAsyncThunk(
  'travelers/get/all',
  async (searchParams: FetchTravelersInterface, thunkAPI: any) => {
    try {
      const response: any = await getTravelersAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getTravelersSlice = createSlice({
  name: 'getTravelers',
  initialState,
  reducers: {
    clearFetchTravelersResponse: (state) => {
      state.getTravelersLoading = false;
      state.getTravelersData = { data: [], total: 0, page: 0, totalPages: 0 };
      state.getTravelersStatus = 'IDLE';
      state.getTravelersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTravelersRequest.pending, (state, action) => {
        state.getTravelersLoading = true;
        state.getTravelersStatus = 'PENDING';
      })
      .addCase(getTravelersRequest.fulfilled, (state, action) => {
        state.getTravelersLoading = false;
        state.getTravelersStatus = 'SUCCESS';
        state.getTravelersData = action.payload;
      })
      .addCase(getTravelersRequest.rejected, (state, action) => {
        state.getTravelersLoading = false;
        state.getTravelersError = action.payload;
        state.getTravelersStatus = 'FAILED';
      });
  },
});

export const { clearFetchTravelersResponse } = getTravelersSlice.actions;

export const getTravelersSelector = (state: RootState) => state.FetchTravelers;

export default getTravelersSlice.reducer;
