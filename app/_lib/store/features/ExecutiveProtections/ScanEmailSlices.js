import { createSlice } from "@reduxjs/toolkit";

const ScanEmailSlice = createSlice({
  name: "Scan Email",
  initialState: {
    isScanNow: false,
    scannedEmail: "",
  },
  reducers: {
    setIsScanNow(state, action) {
      state.isScanNow = action.payload;
    },
    setScannedEmail(state, action) {
      state.scannedEmail = action.payload;
    },
  },
});

export const { setIsScanNow, setScannedEmail } = ScanEmailSlice.actions;

export default ScanEmailSlice.reducer;
