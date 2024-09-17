import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { updateTravelerAPIRequest } from '../../../api/traveler/travelers';
import { UpdateTravlerInterface, UpdateTravelerPropsInterface } from '../../../interfaces/travelersInterface';

const initialState: UpdateTravelerPropsInterface = {
  editTravelerLoading: false,
  editTravelerData: {},
  editTravelerError: null,
  editTravelerStatus: 'IDLE',
};

export const updateTravelerRequest: any = createAsyncThunk(
  'traveler/edit',
  async (traveler: UpdateTravlerInterface, thunkAPI: any) => {
    try {
      const response: any = await updateTravelerAPIRequest(traveler);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const editTravelerSlice = createSlice({
  name: 'editTravelers',
  initialState,
  reducers: {
    clearEditTravelersResponse: (state) => {
      state.editTravelerLoading = false;
      state.editTravelerData = {};
      state.editTravelerStatus = 'IDLE';
      state.editTravelerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTravelerRequest.pending, (state, action) => {
        state.editTravelerLoading = true;
        state.editTravelerStatus = 'PENDING';
      })
      .addCase(updateTravelerRequest.fulfilled, (state, action) => {
        state.editTravelerLoading = false;
        state.editTravelerStatus = 'SUCCESS';
        state.editTravelerData = action.payload;
      })
      .addCase(updateTravelerRequest.rejected, (state, action) => {
        state.editTravelerLoading = false;
        state.editTravelerError = action.payload;
        state.editTravelerStatus = 'FAILED';
      });
  },
});

export const { clearEditTravelersResponse } = editTravelerSlice.actions;

export const editTravelersSelector = (state: RootState) => state.EditTraveler;

export default editTravelerSlice.reducer;
