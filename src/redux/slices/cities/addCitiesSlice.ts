import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { addCityAPIRequest } from '../../../api/city/cities';
import { AddCitiesInterface, AddCitiesPropsInterface } from '../../../interfaces/countriesInterface';

const initialState: AddCitiesPropsInterface = {
  addCityLoading: false,
  addCityData: {},
  addCityError: null,
  addCityStatus: 'IDLE',
};

export const addCityRequest: any = createAsyncThunk(
  'admin/cities/add',
  async (city: AddCitiesInterface, thunkAPI: any) => {
    try {
      const response: any = await addCityAPIRequest(city);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const addCitySlice = createSlice({
  name: 'addCities',
  initialState,
  reducers: {
    clearAddCitiesResponse: (state) => {
      state.addCityLoading = false;
      state.addCityData = {};
      state.addCityStatus = 'IDLE';
      state.addCityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCityRequest.pending, (state, action) => {
        state.addCityLoading = true;
        state.addCityStatus = 'PENDING';
      })
      .addCase(addCityRequest.fulfilled, (state, action) => {
        state.addCityLoading = false;
        state.addCityStatus = 'SUCCESS';
        state.addCityData = action.payload;
      })
      .addCase(addCityRequest.rejected, (state, action) => {
        state.addCityLoading = false;
        state.addCityError = action.payload;
        state.addCityStatus = 'FAILED';
      });
  },
});

export const { clearAddCitiesResponse } = addCitySlice.actions;

export const addCitiesSelector = (state: RootState) => state.AddCity;

export default addCitySlice.reducer;
