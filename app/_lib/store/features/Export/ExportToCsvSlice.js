import { createSlice } from "@reduxjs/toolkit";

const ExportToCSVSlice = createSlice({
  name: "Export to CSV",
  initialState: {
    confirm: false,
    status: false,
    data: {
      total: 0,
      section: "",
    },
  },
  reducers: {
    setConfirmExportToCsv(state, action) {
      state.confirm = action.payload;
    },
    setStatusExportToCsv(state, action) {
      state.status = action.payload;
    },
    setDataExportToCsv(state, action) {
      state.data = action.payload;
    },
    clearDataExportToCsv(state, action) {
      state.data = {};
    },
  },
});

export const {
  setConfirmExportToCsv,
  setStatusExportToCsv,
  setDataExportToCsv,
  clearDataExportToCsv,
} = ExportToCSVSlice.actions;

export default ExportToCSVSlice.reducer;
