import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { registerTravelerAPIRequest } from '../../../api/traveler/travelers';
import { AddTravelerInterface, AddTravelerPropsInterface } from '../../../interfaces/travelersInterface';

const initialState: AddTravelerPropsInterface = {
  addTravelerLoading: false,
  addTravelerData: {},
  addTravelerError: null,
  addTravelerStatus: 'IDLE',
};

export const registerTravelerRequest: any = createAsyncThunk(
  'traveler/register',
  async (traveler: AddTravelerInterface, thunkAPI: any) => {
    try {
      const response: any = await registerTravelerAPIRequest(traveler);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const registerTravelerSlice = createSlice({
  name: 'registerTraveler',
  initialState,
  reducers: {
    clearAddTravelersResponse: (state) => {
      state.addTravelerLoading = false;
      state.addTravelerData = {};
      state.addTravelerStatus = 'IDLE';
      state.addTravelerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerTravelerRequest.pending, (state, action) => {
        state.addTravelerLoading = true;
        state.addTravelerStatus = 'PENDING';
      })
      .addCase(registerTravelerRequest.fulfilled, (state, action) => {
        state.addTravelerLoading = false;
        state.addTravelerStatus = 'SUCCESS';
        state.addTravelerData = action.payload;
      })
      .addCase(registerTravelerRequest.rejected, (state, action) => {
        state.addTravelerLoading = false;
        state.addTravelerError = action.error.message;
        state.addTravelerStatus = 'FAILED';
      });
  },
});

export const { clearAddTravelersResponse } = registerTravelerSlice.actions;

export const registerTravelersSelector = (state: RootState) => state.RegisterTraveler;

export default registerTravelerSlice.reducer;
