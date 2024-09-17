import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getTripByIdAPIRequest } from '../../../api/trips/trips';
import { FetchTripByIdInterface, FetchTripByIdPropsInterface } from '../../../interfaces/tripsInterface';

const initialState: FetchTripByIdPropsInterface = {
  getTripByIdLoading: false,
  getTripByIdData: {},
  getTripByIdStatus: 'IDLE',
  getTripByIdError: null,
};

export const getTripByIdRequest: any = createAsyncThunk(
  'trips/get/trip',
  async (searchParams: FetchTripByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await getTripByIdAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getTripSlice = createSlice({
  name: 'getTrip',
  initialState,
  reducers: {
    clearGetTripResponse: (state) => {
      state.getTripByIdLoading = false;
      state.getTripByIdStatus = 'IDLE';
      state.getTripByIdData = {};
      state.getTripByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTripByIdRequest.pending, (state, action) => {
        state.getTripByIdLoading = true;
        state.getTripByIdStatus = 'PENDING';
      })
      .addCase(getTripByIdRequest.fulfilled, (state, action) => {
        state.getTripByIdData = action.payload;
        state.getTripByIdStatus = 'SUCCESS';
        state.getTripByIdLoading = false;
      })
      .addCase(getTripByIdRequest.rejected, (state, action) => {
        state.getTripByIdLoading = false;
        state.getTripByIdError = action.payload;
        state.getTripByIdStatus = 'FAILED';
      });
  },
});

export const { clearGetTripResponse } = getTripSlice.actions;

export const getTripSelector = (state: RootState) => state.FetchTripById;

export default getTripSlice.reducer;
