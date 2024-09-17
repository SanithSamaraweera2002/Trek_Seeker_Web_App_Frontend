import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addDestinationAPIRequest } from '../../../api/destinations/destinations';
import { AddDestinationsInterface, AddDestinationsPropsInterface } from '../../../interfaces/destinationsInterface';

const initialState: AddDestinationsPropsInterface = {
  addDestinationLoading: false,
  addDestinationData: {},
  addDestinationError: null,
  addDestinationStatus: 'IDLE',
};

export const addDestinationRequest: any = createAsyncThunk(
  'admin/destinations/add',
  async (destination: AddDestinationsInterface, thunkAPI: any) => {
    try {
      const response: any = await addDestinationAPIRequest(destination);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const addDestinationSlice = createSlice({
  name: 'addDestinations',
  initialState,
  reducers: {
    clearAddDestinationsResponse: (state) => {
      state.addDestinationLoading = false;
      state.addDestinationData = {};
      state.addDestinationStatus = 'IDLE';
      state.addDestinationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDestinationRequest.pending, (state, action) => {
        state.addDestinationLoading = true;
        state.addDestinationStatus = 'PENDING';
      })
      .addCase(addDestinationRequest.fulfilled, (state, action) => {
        state.addDestinationLoading = false;
        state.addDestinationStatus = 'SUCCESS';
        state.addDestinationData = action.payload;
      })
      .addCase(addDestinationRequest.rejected, (state, action) => {
        state.addDestinationLoading = false;
        state.addDestinationError = action.payload;
        state.addDestinationStatus = 'FAILED';
      });
  },
});

export const { clearAddDestinationsResponse } = addDestinationSlice.actions;

export const addDestinationsSelector = (state: RootState) => state.AddDestination;

export default addDestinationSlice.reducer;
