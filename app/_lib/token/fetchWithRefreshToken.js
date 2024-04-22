import { DeleteCookies } from "../helpers/DeleteCookies";
import { getRefreshToken } from "./getRefreshToken";

export const fetchWithRefreshToken = async (fetchFunction, ...args) => {
  try {
    await fetchFunction(...args);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      try {
        await getRefreshToken();
        console.log("running inside refreshtoken ");
        await fetchFunction(...args);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Handle refresh token failure (e.g., logout, redirect to login)
        DeleteCookies();
      }
    } else {
      console.error("Error fetching data:", error);
      // Handle other errors
    }
  }
};
