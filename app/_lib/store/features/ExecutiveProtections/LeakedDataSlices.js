import { createSlice } from "@reduxjs/toolkit";

const LeakedDataSlice = createSlice({
  name: "Leaked Data Slices",
  initialState: {
    email: "",
    leakedData: null,
    totalExposures: "",
    isVerified: false,
  },
  reducers: {
    setEmailScannedData(state, action) {
      state.email = action.payload;
    },
    setLeakedData(state, action) {
      state.leakedData = action.payload;
    },
    setTotalExposures(state, action) {
      state.totalExposures = action.payload;
    },
    setEmailIsVerified(state, action) {
      state.isVerified = action.payload;
    },
  },
});

export const {
  setEmailScannedData,
  setLeakedData,
  setTotalExposures,
  setEmailIsVerified,
} = LeakedDataSlice.actions;

export default LeakedDataSlice.reducer;
