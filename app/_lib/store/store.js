import { configureStore } from "@reduxjs/toolkit";
import ChangeUrlReducer from "./features/Home/ChangeUrlSlice";

export const store = configureStore({
  reducer: {
    changeUrl: ChangeUrlReducer,
  },
});
