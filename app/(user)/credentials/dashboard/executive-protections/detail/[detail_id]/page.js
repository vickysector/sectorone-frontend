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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { FormattedParagraph } from "@/app/_ui/components/details/paragraphAi";
import { DetailDescriptions } from "@/app/_ui/components/details/detailsDescriptions";
import { setIsDetailActive } from "@/app/_lib/store/features/KeywordSearch/KeywordSearchSlices";

export default function DetailCompromised() {
  const [selectValidasi, setSelectValidasi] = useState();
  const [validasiSuccess, setValidasiSuccess] = useState(null);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(null);
  const [allData, setAllData] = useState();
  const [loadingSectorAi, setLoadingSectorAi] = useState();
  const [aiGenerated, setAiGenerated] = useState(null);

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
    if (getCookie("user_status")) {
      dispatch(setIsDetailActive(true));
    } else {
      fetchPostTrySectorAiWithRefreshToken();
    }
  };

  const PostTrySectorAi = async () => {
    try {
      // dispatch(setLoadingState(true));
      setLoadingSectorAi(true);

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
      setAiGenerated(data.data.description);
      return res;
    } catch (error) {
      // setBookmarkSuccess(false);
      setAiGenerated(null);
      console.log("error: ", error);
      return error;
    } finally {
      // dispatch(setLoadingState(false));
      setLoadingSectorAi(false);
      setTimeout(() => {
        // setBookmarkSuccess(null);
      }, 5000);
    }
  };

  const fetchPostTrySectorAiWithRefreshToken = async () => {
    await fetchWithRefreshToken(PostTrySectorAi, router, dispatch);
  };

  // End of: Handle AI - Post

  // Start of: Handle AI - GET

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
      setAiGenerated(data.data.description);
      return res;
    } catch (error) {
      // setBookmarkSuccess(false);
      console.log("error get: ", error);
      setAiGenerated(null);
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

  // End of: Handle AI - GET

  // Start of: Handle PDF Download

  const handleDownloadPdf = () => {
    FetchHandledownloadPdfWithRefreshToken();
  };

  const FetchHandledownloadPdf = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}donwload/recommendation?id=${detailsCompromisedData.info_1.idDetailData}&type=executive`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      console.log("res blob pdf: ", res);

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const blob = await res.blob();
      // Check if the `window` object is defined (browser environment)

      console.log("blob files pdf: ", blob);
      if (typeof window !== "undefined") {
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Recommendation-Steps-for-${detailsCompromisedData.info_2.Email}-data.pdf`; // Set the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return res;
      } else {
        console.log(
          "Server-side rendering detected, cannot create download link"
        );

        return res;
      }
    } catch (error) {
      console.log("Error export to pdf");

      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const FetchHandledownloadPdfWithRefreshToken = async () => {
    await fetchWithRefreshToken(FetchHandledownloadPdf, router, dispatch);
  };

  // End of: Handle PDF Download

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
      {/* <section className="bg-gradient-to-b from-[#F8ECFF] to-white mt-8 rounded-2xl p-8">
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
      </section> */}

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
              className={clsx(
                " text-white text-LG-normal py-2 px-8 rounded-[8px] hover:-translate-y-1 transition-all flex items-center",
                // loadingSectorAi ? "bg-[#D5D5D5]" : "bg-[#9254DE]",
                aiGenerated !== null || loadingSectorAi
                  ? "bg-[#00000004] hover:-translate-y-0 cursor-not-allowed  border-[1px] border-[#D5D5D5]"
                  : "bg-[#9254DE]"
              )}
              onClick={handlePostTrySectorAi}
              disabled={loadingSectorAi ? true : false || aiGenerated !== null}
            >
              <TipsAndUpdatesOutlinedIcon
                style={{
                  fontSize: "19px",
                  color: `${
                    loadingSectorAi || aiGenerated !== null
                      ? "#00000040"
                      : "white"
                  }`,
                }}
              />
              <p
                className={clsx(
                  "ml-3 text-LG-normal",
                  loadingSectorAi || aiGenerated !== null
                    ? "text-[#00000040]"
                    : "text-white"
                )}
              >
                {" "}
                {loadingSectorAi ? "Loading..." : "Try Sector AI"}{" "}
              </p>
            </button>
          </div>
        </section>
        <section
          className={clsx(
            "bg-white rounded-[16px] border-[1px] border-[#EFDBFF] mt-8 p-8",
            loadingSectorAi ? "visible" : "hidden"
          )}
        >
          <div
            className={clsx(
              "text-center text-[#D3ADF7] text-LG-normal flex items-center justify-center ",
              loadingSectorAi ? "visible" : "hidden"
            )}
          >
            <AutoAwesomeIcon />
            <p className={clsx("ml-[10px]")}>Sector AI is writing ...</p>
          </div>
        </section>
        <section
          className={clsx(
            "bg-white rounded-[16px] border-[1px] border-[#EFDBFF] mt-8 p-8",
            aiGenerated === null ? "hidden" : "visible"
          )}
        >
          <div className="w-full">
            <div className="flex justify-between items-start">
              <h1 className={clsx("text-heading-3 text-black mb-8")}>
                Recommendations
              </h1>
              <button
                className={clsx(
                  "flex items-center text-Base-normal text-primary-base bg-white border-[1px] rounded-[6px] border-[#D5D5D5] px-6 py-1"
                )}
                onClick={handleDownloadPdf}
              >
                <SaveAltIcon />
                <p className={clsx("ml-2")}>Download PDF</p>
              </button>
            </div>
            {/* <p> {aiGenerated && aiGenerated.replace(/"/g, " ")} </p> */}
            <div>
              <h2 className="text-XL-strong text-black mb-3">
                Data Leak Analysis
              </h2>
              <FormattedParagraph response={aiGenerated && aiGenerated} />
              <DetailDescriptions />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
