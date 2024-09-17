import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { deleteTripAPIRequest } from '../../../api/trips/trips';
import { DeleteTripPropsInterface, FetchTripByIdInterface } from '../../../interfaces/tripsInterface';

const initialState: DeleteTripPropsInterface = {
  deleteTripByIdLoading: false,
  deleteTripByIdData: {},
  deleteTripByIdStatus: 'IDLE',
  deleteTripByIdError: null,
};

export const deleteTripRequest: any = createAsyncThunk(
  'trip/delete',
  async (searchParams: FetchTripByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await deleteTripAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const deleteTripSlice = createSlice({
  name: 'deleteTrip',
  initialState,
  reducers: {
    clearDeleteTripResponse: (state) => {
      state.deleteTripByIdLoading = false;
      state.deleteTripByIdData = {};
      state.deleteTripByIdStatus = 'IDLE';
      state.deleteTripByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTripRequest.pending, (state, action) => {
        state.deleteTripByIdLoading = true;
        state.deleteTripByIdStatus = 'PENDING';
      })
      .addCase(deleteTripRequest.fulfilled, (state, action) => {
        state.deleteTripByIdLoading = false;
        state.deleteTripByIdStatus = 'SUCCESS';
        state.deleteTripByIdData = action.payload;
      })
      .addCase(deleteTripRequest.rejected, (state, action) => {
        state.deleteTripByIdLoading = false;
        state.deleteTripByIdError = action.payload;
        state.deleteTripByIdStatus = 'FAILED';
      });
  },
});

export const { clearDeleteTripResponse } = deleteTripSlice.actions;

export const deleteTripSelector = (state: RootState) => state.DeleteTrip;

export default deleteTripSlice.reducer;
