import { DeleteCookies } from "../helpers/DeleteCookies";
import { getRefreshToken } from "./getRefreshToken";

export const fetchWithRefreshToken = async (fetchFunction, router, ...args) => {
  try {
    // await fetchFunction(...args);
    let success = await fetchFunction(...args);
    console.log("succes breaches: ", success.status);
    if (success.status !== 200) {
      throw success;
    }
  } catch (error) {
    console.log("error breaches : ", error);
    if (error.status === 401 || error.status === 403) {
      try {
        // await getRefreshToken();
        // console.log("running inside refreshtoken ");
        // await fetchFunction(...args);
        let success = await getRefreshToken();

        console.log("success refresh token: ", success);

        if (success.status !== 200) {
          throw new Error("");
        }

        await fetchFunction(...args);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Handle refresh token failure (e.g., logout, redirect to login)
        DeleteCookies();
        console.log("cookie deleted because refresh token is failed");
      }
    } else {
      console.error("Error fetching data:", error);

      DeleteCookies();
      // Handle other errors
    }
  }
};
