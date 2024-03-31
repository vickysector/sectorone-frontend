"use client";

import Image from "next/image";
import { Provider } from "react-redux";
import { store } from "../_lib/store/store";

export default function Home({ children }) {
  return <Provider store={store}> {children} </Provider>;
}
