import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { FetchCitiesInterface, FetchCitiesPropsInterface } from '../../../interfaces/countriesInterface';
import { getCitiesAPIRequest } from '../../../api/city/cities';

const initialState: FetchCitiesPropsInterface = {
  getCitiesLoading: false,
  getCitiesData: { data: [], total: 0, page: 0, totalPages: 0 },
  getCitiesStatus: 'IDLE',
  getCitiesError: null,
};

export const getCitiesRequest: any = createAsyncThunk(
  'admin/cities/get',
  async (searchParams: FetchCitiesInterface, thunkAPI: any) => {
    try {
      const response: any = await getCitiesAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const getCitiesSlice = createSlice({
  name: 'getCities',
  initialState,
  reducers: {
    clearFetchCitiesResponse: (state) => {
      state.getCitiesLoading = false;
      state.getCitiesData = { data: [], total: 0, page: 0, totalPages: 0 };
      state.getCitiesStatus = 'IDLE';
      state.getCitiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCitiesRequest.pending, (state, action) => {
        state.getCitiesLoading = true;
        state.getCitiesStatus = 'PENDING';
      })
      .addCase(getCitiesRequest.fulfilled, (state, action) => {
        state.getCitiesLoading = false;
        state.getCitiesStatus = 'SUCCESS';
        state.getCitiesData = action.payload;
      })
      .addCase(getCitiesRequest.rejected, (state, action) => {
        state.getCitiesLoading = false;
        state.getCitiesError = action.payload;
        state.getCitiesStatus = 'FAILED';
      });
  },
});

export const { clearFetchCitiesResponse } = getCitiesSlice.actions;

export const getCitiesSelector = (state: RootState) => state.FetchCities;

export default getCitiesSlice.reducer;
