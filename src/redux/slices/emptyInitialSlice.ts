import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const emptySlice = createSlice({
  name: 'empty',
  initialState,
  reducers: {},
});

export default emptySlice.reducer;
