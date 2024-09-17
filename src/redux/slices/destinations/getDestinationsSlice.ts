import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchDestinationsInterface, FetchDestinationsPropsInterface } from '../../../interfaces/destinationsInterface';
import { getDestinationsAPIRequest } from '../../../api/destinations/destinations';

const initialState: FetchDestinationsPropsInterface = {
  getDestinationsLoading: false,
  getDestinationsData: { data: [], total: 0, page: 0, totalPages: 0 },
  getDestinationsStatus: 'IDLE',
  getDestinationsError: null,
};

export const getDestinationsRequest: any = createAsyncThunk(
  'admin/destinations/get',
  async (searchParams: FetchDestinationsInterface, thunkAPI: any) => {
    try {
      const response: any = await getDestinationsAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getDestinationsSlice = createSlice({
  name: 'getDestinations',
  initialState,
  reducers: {
    clearFetchDestinationsResponse: (state) => {
      state.getDestinationsLoading = false;
      state.getDestinationsData = { data: [], total: 0, page: 0, totalPages: 0 };
      state.getDestinationsStatus = 'IDLE';
      state.getDestinationsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDestinationsRequest.pending, (state, action) => {
        state.getDestinationsLoading = true;
        state.getDestinationsStatus = 'PENDING';
      })
      .addCase(getDestinationsRequest.fulfilled, (state, action) => {
        state.getDestinationsLoading = false;
        state.getDestinationsStatus = 'SUCCESS';
        state.getDestinationsData = action.payload;
      })
      .addCase(getDestinationsRequest.rejected, (state, action) => {
        state.getDestinationsLoading = false;
        state.getDestinationsError = action.payload;
        state.getDestinationsStatus = 'FAILED';
      });
  },
});

export const { clearFetchDestinationsResponse } = getDestinationsSlice.actions;

export const getDestinationsSelector = (state: RootState) => state.FetchDestinations;

export default getDestinationsSlice.reducer;
