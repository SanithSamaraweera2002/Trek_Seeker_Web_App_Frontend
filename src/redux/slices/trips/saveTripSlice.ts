import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { TripSaveInterface, TripSavePropsInterface } from '../../../interfaces/tripsInterface';
import { saveTripAPIRequest } from '../../../api/trips/trips';

const initialState: TripSavePropsInterface = {
  saveTripLoading: false,
  saveTripData: {},
  saveTripError: null,
  saveTripStatus: 'IDLE',
};

export const saveTripRequest: any = createAsyncThunk(
  'trip/save',
  async (tripData: TripSaveInterface, thunkAPI: any) => {
    try {
      const response: any = await saveTripAPIRequest(tripData);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const saveTripSlice = createSlice({
  name: 'saveTrip',
  initialState,
  reducers: {
    clearSaveTripResponse: (state) => {
      state.saveTripLoading = false;
      state.saveTripStatus = 'IDLE';
      state.saveTripData = {};
      state.saveTripError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTripRequest.pending, (state, action) => {
        state.saveTripLoading = true;
        state.saveTripStatus = 'PENDING';
      })
      .addCase(saveTripRequest.fulfilled, (state, action) => {
        state.saveTripData = action.payload;
        state.saveTripStatus = 'SUCCESS';
        state.saveTripLoading = false;
      })
      .addCase(saveTripRequest.rejected, (state, action) => {
        state.saveTripLoading = false;
        state.saveTripError = action.payload;
        state.saveTripStatus = 'FAILED';
      });
  },
});

export const { clearSaveTripResponse } = saveTripSlice.actions;

export const saveTripSelector = (state: RootState) => state.SaveTrip;

export default saveTripSlice.reducer;
