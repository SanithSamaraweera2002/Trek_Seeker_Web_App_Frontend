import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  FetchHotelRecommendationsInterface,
  FetchHotelRecommendationsPropsInterface,
} from '../../../interfaces/hotelsinterface';
import { getHotelRecommendationsAPIRequest } from '../../../api/hotels/hotels';

const initialState: FetchHotelRecommendationsPropsInterface = {
  getHotelRecommendationsLoading: false,
  getHotelRecommendationsIdData: {},
  getHotelRecommendationsError: null,
  getHotelRecommendationsStatus: 'IDLE',
};

export const getHotelRecommendationsRequest: any = createAsyncThunk(
  'hotel/recommendations',
  async (hotelData: FetchHotelRecommendationsInterface, thunkAPI: any) => {
    try {
      const response: any = await getHotelRecommendationsAPIRequest(hotelData);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const getHotelRecommendationsSlice = createSlice({
  name: 'getHotelRecommendations',
  initialState,
  reducers: {
    clearFetchHotelRecommendationsResponse: (state) => {
      state.getHotelRecommendationsLoading = false;
      state.getHotelRecommendationsStatus = 'IDLE';
      state.getHotelRecommendationsIdData = {};
      state.getHotelRecommendationsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHotelRecommendationsRequest.pending, (state, action) => {
        state.getHotelRecommendationsLoading = true;
        state.getHotelRecommendationsStatus = 'PENDING';
      })
      .addCase(getHotelRecommendationsRequest.fulfilled, (state, action) => {
        state.getHotelRecommendationsIdData = action.payload;
        state.getHotelRecommendationsStatus = 'SUCCESS';
        state.getHotelRecommendationsLoading = false;
      })
      .addCase(getHotelRecommendationsRequest.rejected, (state, action) => {
        state.getHotelRecommendationsLoading = false;
        state.getHotelRecommendationsError = action.payload;
        state.getHotelRecommendationsStatus = 'FAILED';
      });
  },
});

export const { clearFetchHotelRecommendationsResponse } = getHotelRecommendationsSlice.actions;

export const getHotelRecommendationsSelector = (state: RootState) => state.FetchHotelRecommendations;

export default getHotelRecommendationsSlice.reducer;
