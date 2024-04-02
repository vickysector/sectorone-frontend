import { configureStore } from "@reduxjs/toolkit";
import ChangeUrlReducer from "./features/Home/ChangeUrlSlice";
import ChooseUrlReducer from "./features/Home/ChooseUrlSlice";
import BreachesSlices from "./features/Breaches/BreachesSlices";
import LoadingSlices from "./features/Compromised/LoadingSlices";
import DetailSlices from "./features/Compromised/DetailSlices";

export const store = configureStore({
  reducer: {
    changeUrl: ChangeUrlReducer,
    chooseUrl: ChooseUrlReducer,
    breaches: BreachesSlices,
    compromised: LoadingSlices,
    detailComrpomise: DetailSlices,
  },
});
