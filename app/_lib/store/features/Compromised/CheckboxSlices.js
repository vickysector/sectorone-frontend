import { createSlice } from "@reduxjs/toolkit";

const CheckboxSlice = createSlice({
  name: "Checkbox Slice",
  initialState: {
    ids: [],
    markedAsBookmark: false,
    status: "",
    success: null,
    banner: null,
  },
  reducers: {
    addIdtoIds(state, action) {
      state.ids.push(action.payload);
    },
    removeIdtoIds(state, action) {
      let temp = state.ids.filter((id) => id !== action.payload);

      state.ids = temp;
    },
    clearIds(state, action) {
      state.ids = [];
    },
    setMarkedAsBookmark(state, action) {
      state.markedAsBookmark = action.payload;
    },
    setStatusMultipleBookmark(state, action) {
      state.status = action.payload;
    },
    setSuccessMultipleBookmark(state, action) {
      state.success = action.payload;
    },
    setBannerMultipleBookmark(state, action) {
      state.banner = action.payload;
    },
  },
});

export const {
  addIdtoIds,
  removeIdtoIds,
  clearIds,
  setMarkedAsBookmark,
  setStatusMultipleBookmark,
  setSuccessMultipleBookmark,
  setBannerMultipleBookmark,
} = CheckboxSlice.actions;

export default CheckboxSlice.reducer;
