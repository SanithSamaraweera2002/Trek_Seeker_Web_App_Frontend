import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getTravelerByIdAPIRequest } from '../../../api/traveler/travelers';
import { FetchTravelerByIdPropsInterface, FetchTravelerByIdInterface } from '../../../interfaces/travelersInterface';

const initialState: FetchTravelerByIdPropsInterface = {
  fetchTravelerByIdLoading: false,
  fetchTravelerByIdData: {},
  fetchTravelerByIdStatus: 'IDLE',
  fetchTravelerByIdError: null,
};

export const getTravelerByIdRequest: any = createAsyncThunk(
  'travelers/get/id',
  async (searchParams: FetchTravelerByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await getTravelerByIdAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getTravelerSlice = createSlice({
  name: 'getTraveler',
  initialState,
  reducers: {
    clearGetTravelerByIdResponse: (state) => {
      state.fetchTravelerByIdLoading = false;
      state.fetchTravelerByIdStatus = 'IDLE';
      state.fetchTravelerByIdData = {};
      state.fetchTravelerByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTravelerByIdRequest.pending, (state, action) => {
        state.fetchTravelerByIdLoading = true;
        state.fetchTravelerByIdStatus = 'PENDING';
      })
      .addCase(getTravelerByIdRequest.fulfilled, (state, action) => {
        state.fetchTravelerByIdData = action.payload;
        state.fetchTravelerByIdStatus = 'SUCCESS';
        state.fetchTravelerByIdLoading = false;
      })
      .addCase(getTravelerByIdRequest.rejected, (state, action) => {
        state.fetchTravelerByIdLoading = false;
        state.fetchTravelerByIdError = action.payload;
        state.fetchTravelerByIdStatus = 'FAILED';
      });
  },
});

export const { clearGetTravelerByIdResponse } = getTravelerSlice.actions;

export const getTravelerSelector = (state: RootState) => state.FetchTravelerById;

export default getTravelerSlice.reducer;
