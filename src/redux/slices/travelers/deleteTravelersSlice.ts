import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { deleteTravelerAPIRequest } from '../../../api/traveler/travelers';
import { FetchTravelerByIdInterface, DeleteTravelerPropsInterface } from '../../../interfaces/travelersInterface';

const initialState: DeleteTravelerPropsInterface = {
  deleteTravelerLoading: false,
  deleteTravelerData: {},
  deleteTravelerStatus: 'IDLE',
  deleteTravelerError: null,
};

export const deleteTravelerRequest: any = createAsyncThunk(
  'traveler/delete',
  async (searchParams: FetchTravelerByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await deleteTravelerAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const deleteTravelerSlice = createSlice({
  name: 'deleteTravelers',
  initialState,
  reducers: {
    clearDeleteTravelersResponse: (state) => {
      state.deleteTravelerLoading = false;
      state.deleteTravelerData = {};
      state.deleteTravelerStatus = 'IDLE';
      state.deleteTravelerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTravelerRequest.pending, (state, action) => {
        state.deleteTravelerLoading = true;
        state.deleteTravelerStatus = 'PENDING';
      })
      .addCase(deleteTravelerRequest.fulfilled, (state, action) => {
        state.deleteTravelerLoading = false;
        state.deleteTravelerStatus = 'SUCCESS';
        state.deleteTravelerData = action.payload;
      })
      .addCase(deleteTravelerRequest.rejected, (state, action) => {
        state.deleteTravelerLoading = false;
        state.deleteTravelerError = action.payload;
        state.deleteTravelerStatus = 'FAILED';
      });
  },
});

export const { clearDeleteTravelersResponse } = deleteTravelerSlice.actions;

export const deleteTravelersSelector = (state: RootState) => state.DeleteTraveler;

export default deleteTravelerSlice.reducer;
