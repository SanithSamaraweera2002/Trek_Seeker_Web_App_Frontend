import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { updateCityAPIRequest } from '../../../api/city/cities';
import { UpdateCitiesInterface, UpdateCitiesPropsInterface } from '../../../interfaces/countriesInterface';

const initialState: UpdateCitiesPropsInterface = {
  editCitiesLoading: false,
  editCitiesData: {},
  editCitiesError: null,
  editCitiesStatus: 'IDLE',
};

export const updateCityRequest: any = createAsyncThunk(
  'admin/cities/edit',
  async (city: UpdateCitiesInterface, thunkAPI: any) => {
    try {
      const response: any = await updateCityAPIRequest(city);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const editCitySlice = createSlice({
  name: 'editCities',
  initialState,
  reducers: {
    clearEditCitiesResponse: (state) => {
      state.editCitiesLoading = false;
      state.editCitiesData = {};
      state.editCitiesStatus = 'IDLE';
      state.editCitiesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCityRequest.pending, (state, action) => {
        state.editCitiesLoading = true;
        state.editCitiesStatus = 'PENDING';
      })
      .addCase(updateCityRequest.fulfilled, (state, action) => {
        state.editCitiesLoading = false;
        state.editCitiesStatus = 'SUCCESS';
        state.editCitiesData = action.payload;
      })
      .addCase(updateCityRequest.rejected, (state, action) => {
        state.editCitiesLoading = false;
        state.editCitiesError = action.payload;
        state.editCitiesStatus = 'FAILED';
      });
  },
});

export const { clearEditCitiesResponse } = editCitySlice.actions;

export const editCitiesSelector = (state: RootState) => state.EditCity;

export default editCitySlice.reducer;
