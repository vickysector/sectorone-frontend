"use client";

import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { DetailItems } from "@/app/_ui/components/details/detailsItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { useEffect, useState } from "react";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import {
  Pagination,
  ConfigProvider,
  DatePicker,
  Spin,
  Select,
  Checkbox,
  Popover,
  Alert,
} from "antd";
import clsx from "clsx";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { getCookie } from "cookies-next";
import { setDataDetails } from "@/app/_lib/store/features/Compromised/DetailSlices";
import { DETAIL_COMPROMISED_BOOKMARK } from "@/app/_lib/variables/Variables";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { DetailItemsExecutive } from "@/app/_ui/components/details/detailsItemExecutive";

export default function DetailCompromised() {
  const [selectValidasi, setSelectValidasi] = useState();
  const [validasiSuccess, setValidasiSuccess] = useState(null);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(null);
  const [allData, setAllData] = useState();

  const detailsCompromisedData = useSelector(
    (state) => state.detailComrpomise.data
  );

  const detailsCompromisedSection = useSelector(
    (state) => state.detailComrpomise.sections
  );

  const detailsCompromisedFilters = useSelector(
    (state) => state.detailComrpomise.filters
  );

  const router = useRouter();
  const dispatch = useDispatch();

  console.log("details compromised data: ", detailsCompromisedData);
  console.log("details compromised section: ", detailsCompromisedSection);
  console.log("details compromised filters: ", detailsCompromisedFilters);

  function handleBackToCompromise() {
    // router.back();
    router.push("/credentials/dashboard/executive-protections");
  }

  function sliceObject(obj, chunkSize = 3) {
    const entries = Object.entries(obj);
    if (entries.length <= chunkSize) return [obj];

    const result = [];
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      result.push(Object.fromEntries(chunk));
    }
    return result;
  }

  // Start of: Handle AI - Post

  const handlePostTrySectorAi = () => {
    fetchPostTrySectorAiWithRefreshToken();
  };

  const PostTrySectorAi = async () => {
    try {
      // dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}recommendation?type=executive`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: detailsCompromisedData.info_1.idDetailData,
        }),
      });

      console.log("res: ", res);

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();
      console.log("response success: ", data);

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      return res;
    } catch (error) {
      // setBookmarkSuccess(false);
      console.log("error: ", error);
      return error;
    } finally {
      // dispatch(setLoadingState(false));
      setTimeout(() => {
        // setBookmarkSuccess(null);
      }, 5000);
    }
  };

  const fetchPostTrySectorAiWithRefreshToken = async () => {
    await fetchWithRefreshToken(PostTrySectorAi, router, dispatch);
  };

  // End of: Handle AI - Post

  // Start of: Handle AI - Post

  const GetTrySectorAI = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}recommendation?id=${detailsCompromisedData.info_1.idDetailData}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      console.log("res get: ", res);

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();
      console.log("response success get: ", data);

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      return res;
    } catch (error) {
      // setBookmarkSuccess(false);
      console.log("error get: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        // setBookmarkSuccess(null);
      }, 5000);
    }
  };

  const fetchGetTrySectorAIWithRefreshToken = async () => {
    await fetchWithRefreshToken(GetTrySectorAI, router, dispatch);
  };

  useEffect(() => {
    fetchGetTrySectorAIWithRefreshToken();
  }, []);

  // End of: Handle AI - Post

  useEffect(() => {
    if (!detailsCompromisedData?.info_1?.idDetailData) {
      return redirect("/credentials/dashboard/executive-protections");
    }
  }, []);

  return (
    <>
      <section className="flex items-center relative">
        <div onClick={handleBackToCompromise} className="hover:cursor-pointer">
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black ml-3">Details</h1>
      </section>
      <section className="bg-white rounded-2xl px-8 py-8 mt-6">
        {detailsCompromisedData &&
          detailsCompromisedData?.info_3?.map((data, index) => {
            return (
              <div className=" pb-8 border-b-[1px] border-[#D5D5D5]" key={data}>
                <DetailItemsExecutive items={data} />
              </div>
            );
          })}
      </section>
      <section className="bg-gradient-to-b from-[#F8ECFF] to-white mt-8 rounded-2xl p-8">
        <section className="flex items-center justify-between">
          <div className="max-w-[755px] break-words">
            <h2 className=" text-black text-heading-4">
              Get data security recommendations from Sector
            </h2>
            <p className="text-Base-normal text-text-description mt-2">
              Hacker can access your account and will most likely try to use it
              to commit crimes. Get data security recommendations from Sector
              AI.
            </p>
          </div>
          <div>
            <button
              className="bg-[#9254DE] text-white text-LG-normal py-2 px-8 rounded-[8px] hover:-translate-y-1 transition-all flex items-center"
              onClick={handlePostTrySectorAi}
            >
              <TipsAndUpdatesOutlinedIcon style={{ fontSize: "19px" }} />
              <p className="ml-3">Try Sector AI</p>
            </button>
          </div>
        </section>
      </section>
    </>
  );
}
