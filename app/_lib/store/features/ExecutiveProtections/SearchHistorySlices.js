const { createSlice } = require("@reduxjs/toolkit");

const SearchHistorySlice = createSlice({
  name: "Search History",
  initialState: {
    historySearchEmailVerified: false,
  },
  reducers: {
    setHistorySearchEmailVerified(state, action) {
      state.historySearchEmailVerified = action.payload;
    },
  },
});

export const { setHistorySearchEmailVerified } = SearchHistorySlice.actions;

export default SearchHistorySlice.reducer;
