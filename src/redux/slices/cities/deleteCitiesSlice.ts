import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { deleteCityAPIRequest } from '../../../api/city/cities';
import { FetchCityByIdInterface, DeleteCityPropsInterface } from '../../../interfaces/countriesInterface';

const initialState: DeleteCityPropsInterface = {
  deleteCityLoading: false,
  deleteCityData: {},
  deleteCityStatus: 'IDLE',
  deleteCityError: null,
};

export const deleteCityRequest: any = createAsyncThunk(
  'admin/cities/delete',
  async (searchParams: FetchCityByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await deleteCityAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const deleteCitySlice = createSlice({
  name: 'deleteCities',
  initialState,
  reducers: {
    clearDeleteCitiesResponse: (state) => {
      state.deleteCityLoading = false;
      state.deleteCityData = {};
      state.deleteCityStatus = 'IDLE';
      state.deleteCityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCityRequest.pending, (state, action) => {
        state.deleteCityLoading = true;
        state.deleteCityStatus = 'PENDING';
      })
      .addCase(deleteCityRequest.fulfilled, (state, action) => {
        state.deleteCityLoading = false;
        state.deleteCityStatus = 'SUCCESS';
        state.deleteCityData = action.payload;
      })
      .addCase(deleteCityRequest.rejected, (state, action) => {
        state.deleteCityLoading = false;
        state.deleteCityError = action.payload;
        state.deleteCityStatus = 'FAILED';
      });
  },
});

export const { clearDeleteCitiesResponse } = deleteCitySlice.actions;

export const deleteCitiesSelector = (state: RootState) => state.DeleteCity;

export default deleteCitySlice.reducer;
