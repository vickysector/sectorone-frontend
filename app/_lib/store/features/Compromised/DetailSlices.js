import { createSlice } from "@reduxjs/toolkit";

const DetailSlice = createSlice({
  name: "Detail State",
  initialState: {
    status: false,
    data: {},
  },
  reducers: {
    setDetailState(state, action) {
      state.status = action.payload;
    },
    setDataDetails(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setDetailState, setDataDetails } = DetailSlice.actions;

export default DetailSlice.reducer;
