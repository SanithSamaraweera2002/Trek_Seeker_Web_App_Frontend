import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import {
  UpdateDestinationsInterface,
  UpdateDestinationsPropsInterface,
} from '../../../interfaces/destinationsInterface';
import { updateDestinationAPIRequest } from '../../../api/destinations/destinations';

const initialState: UpdateDestinationsPropsInterface = {
  editDestinationsLoading: false,
  editDestinationsData: {},
  editDestinationsError: null,
  editDestinationsStatus: 'IDLE',
};

export const updateDestinationRequest: any = createAsyncThunk(
  'admin/destinations/edit',
  async (destination: UpdateDestinationsInterface, thunkAPI: any) => {
    try {
      const response: any = await updateDestinationAPIRequest(destination);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const editDestinationSlice = createSlice({
  name: 'editDestinations',
  initialState,
  reducers: {
    clearEditDestinationsResponse: (state) => {
      state.editDestinationsLoading = false;
      state.editDestinationsData = {};
      state.editDestinationsStatus = 'IDLE';
      state.editDestinationsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDestinationRequest.pending, (state, action) => {
        state.editDestinationsLoading = true;
        state.editDestinationsStatus = 'PENDING';
      })
      .addCase(updateDestinationRequest.fulfilled, (state, action) => {
        state.editDestinationsLoading = false;
        state.editDestinationsStatus = 'SUCCESS';
        state.editDestinationsData = action.payload;
      })
      .addCase(updateDestinationRequest.rejected, (state, action) => {
        state.editDestinationsLoading = false;
        state.editDestinationsError = action.payload;
        state.editDestinationsStatus = 'FAILED';
      });
  },
});

export const { clearEditDestinationsResponse } = editDestinationSlice.actions;

export const editDestinationsSelector = (state: RootState) => state.EditDestination;

export default editDestinationSlice.reducer;
