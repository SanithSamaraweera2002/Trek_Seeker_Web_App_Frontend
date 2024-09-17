import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { TripCreateInterface, TripCreatePropsInterface } from '../../../interfaces/tripsInterface';
import { createTripAPIRequest } from '../../../api/trips/trips';
import { startLoading, stopLoading } from '../loading/loadingSlice';

const initialState: TripCreatePropsInterface = {
  createTripLoading: false,
  createTripData: {},
  createTripError: null,
  createTripStatus: 'IDLE',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createTripRequest: any = createAsyncThunk(
  'trip/create',
  async (userData: TripCreateInterface, thunkAPI: any) => {
    thunkAPI.dispatch(startLoading());
    try {
      const response: any = await createTripAPIRequest(userData);
      await delay(3000);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      await delay(3000);
      return thunkAPI.rejectWithValue(error.response.data);
    } finally {
      thunkAPI.dispatch(stopLoading());
    }
  }
);

const createTripSlice = createSlice({
  name: 'createTrip',
  initialState,
  reducers: {
    clearCreateTripResponse: (state) => {
      state.createTripLoading = false;
      state.createTripStatus = 'IDLE';
      state.createTripData = {};
      state.createTripError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTripRequest.pending, (state, action) => {
        state.createTripLoading = true;
        state.createTripStatus = 'PENDING';
      })
      .addCase(createTripRequest.fulfilled, (state, action) => {
        state.createTripData = action.payload;
        state.createTripStatus = 'SUCCESS';
        state.createTripLoading = false;
      })
      .addCase(createTripRequest.rejected, (state, action) => {
        state.createTripLoading = false;
        state.createTripError = action.payload;
        state.createTripStatus = 'FAILED';
      });
  },
});

export const { clearCreateTripResponse } = createTripSlice.actions;

export const createTripSelector = (state: RootState) => state.CreateTrip;

export default createTripSlice.reducer;
