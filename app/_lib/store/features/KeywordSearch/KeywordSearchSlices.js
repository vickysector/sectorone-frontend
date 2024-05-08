import { createSlice } from "@reduxjs/toolkit";

const KeywordSearchSlice = createSlice({
  name: "Keyword Search",
  initialState: {
    callAddKeywordFunctions: null,
    isAddedKeyword: false,
    idCategory: "",
  },
  reducers: {
    setCallAddKeywordFunctions(state, action) {
      state.callAddKeywordFunctions = action.payload;
    },
    setIsAddedKeyword(state, action) {
      state.isAddedKeyword = action.payload;
    },
    setIdCategory(state, action) {
      state.idCategory = action.payload;
    },
  },
});

export const { setCallAddKeywordFunctions, setIsAddedKeyword, setIdCategory } =
  KeywordSearchSlice.actions;

export default KeywordSearchSlice.reducer;
