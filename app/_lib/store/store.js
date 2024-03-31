import { configureStore } from "@reduxjs/toolkit";
import ChangeUrlReducer from "./features/Home/ChangeUrlSlice";
import ChooseUrlReducer from "./features/Home/ChooseUrlSlice";

export const store = configureStore({
  reducer: {
    changeUrl: ChangeUrlReducer,
    chooseUrl: ChooseUrlReducer,
  },
});
