import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { deleteDestinationAPIRequest } from '../../../api/destinations/destinations';
import {
  FetchDestinationByIdInterface,
  DeleteDestinationPropsInterface,
} from '../../../interfaces/destinationsInterface';

const initialState: DeleteDestinationPropsInterface = {
  deleteDestinationLoading: false,
  deleteDestinationData: {},
  deleteDestinationStatus: 'IDLE',
  deleteDestinationError: null,
};

export const deleteDestinationRequest: any = createAsyncThunk(
  'admin/destinations/delete',
  async (searchParams: FetchDestinationByIdInterface, thunkAPI: any) => {
    try {
      const response: any = await deleteDestinationAPIRequest(searchParams);
      return response;
    } catch (error: any) {
      if (!error?.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error?.response.data);
    }
  }
);

const deleteDestinationSlice = createSlice({
  name: 'deleteDestinations',
  initialState,
  reducers: {
    clearDeleteDestinationsResponse: (state) => {
      state.deleteDestinationLoading = false;
      state.deleteDestinationData = {};
      state.deleteDestinationStatus = 'IDLE';
      state.deleteDestinationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteDestinationRequest.pending, (state, action) => {
        state.deleteDestinationLoading = true;
        state.deleteDestinationStatus = 'PENDING';
      })
      .addCase(deleteDestinationRequest.fulfilled, (state, action) => {
        state.deleteDestinationLoading = false;
        state.deleteDestinationStatus = 'SUCCESS';
        state.deleteDestinationData = action.payload;
      })
      .addCase(deleteDestinationRequest.rejected, (state, action) => {
        state.deleteDestinationLoading = false;
        state.deleteDestinationError = action.payload;
        state.deleteDestinationStatus = 'FAILED';
      });
  },
});

export const { clearDeleteDestinationsResponse } = deleteDestinationSlice.actions;

export const deleteDestinationsSelector = (state: RootState) => state.DeleteDestination;

export default deleteDestinationSlice.reducer;
