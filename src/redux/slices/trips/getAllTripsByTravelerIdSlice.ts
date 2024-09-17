import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getAllTripsAPIRequest } from '../../../api/trips/trips';
import {
  FetchAllTripsByTravelerIdIdInterface,
  FetchAllTripsByTravelerIdPropsInterface,
} from '../../../interfaces/tripsInterface';

const initialState: FetchAllTripsByTravelerIdPropsInterface = {
  getAllTripsByTravelerIdLoading: false,
  getAllTripsByTravelerIdData: {},
  getAllTripsByTravelerIdStatus: 'IDLE',
  getAllTripsByTravelerIdError: null,
};

export const getAllTripsRequest: any = createAsyncThunk(
  'trips/get/all',
  async (searchParams: FetchAllTripsByTravelerIdIdInterface, thunkAPI: any) => {
    try {
      const response: any = await getAllTripsAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getAllTripsSlice = createSlice({
  name: 'getAllTrips',
  initialState,
  reducers: {
    clearGetAllTripsResponse: (state) => {
      state.getAllTripsByTravelerIdLoading = false;
      state.getAllTripsByTravelerIdStatus = 'IDLE';
      state.getAllTripsByTravelerIdData = {};
      state.getAllTripsByTravelerIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTripsRequest.pending, (state, action) => {
        state.getAllTripsByTravelerIdLoading = true;
        state.getAllTripsByTravelerIdStatus = 'PENDING';
      })
      .addCase(getAllTripsRequest.fulfilled, (state, action) => {
        state.getAllTripsByTravelerIdData = action.payload;
        state.getAllTripsByTravelerIdStatus = 'SUCCESS';
        state.getAllTripsByTravelerIdLoading = false;
      })
      .addCase(getAllTripsRequest.rejected, (state, action) => {
        state.getAllTripsByTravelerIdLoading = false;
        state.getAllTripsByTravelerIdError = action.payload;
        state.getAllTripsByTravelerIdStatus = 'FAILED';
      });
  },
});

export const { clearGetAllTripsResponse } = getAllTripsSlice.actions;

export const getAllTripsSelector = (state: RootState) => state.FetchAllTrips;

export default getAllTripsSlice.reducer;
