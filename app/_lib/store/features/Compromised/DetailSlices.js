import { createSlice } from "@reduxjs/toolkit";

const DetailSlice = createSlice({
  name: "Detail State",
  initialState: {
    status: false,
    data: {},
    statusExecutive: false,
    dataExecutiveKeys: [],
    dataExecutiveValues: {},
  },
  reducers: {
    setDetailState(state, action) {
      state.status = action.payload;
    },
    setDataDetails(state, action) {
      state.data = action.payload;
    },
    setDetailExecutiveState(state, action) {
      state.statusExecutive = action.payload;
    },
    setDataExecutiveKeysDetails(state, action) {
      state.dataExecutiveKeys = action.payload;
    },
    setDataExecutiveValuesDetails(state, action) {
      state.dataExecutiveValues = action.payload;
    },
  },
});

export const {
  setDetailState,
  setDataDetails,
  setDetailExecutiveState,
  setDataExecutiveKeysDetails,
  setDataExecutiveValuesDetails,
} = DetailSlice.actions;

export default DetailSlice.reducer;
