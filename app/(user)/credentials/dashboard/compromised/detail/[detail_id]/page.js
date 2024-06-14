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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { FormattedParagraph } from "@/app/_ui/components/details/paragraphAi";
import { DetailDescriptions } from "@/app/_ui/components/details/detailsDescriptions";

export default function DetailCompromised() {
  const [selectValidasi, setSelectValidasi] = useState();
  const [validasiSuccess, setValidasiSuccess] = useState(null);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(null);
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

  const Date = {
    title: "Date",
    data: [
      {
        id: 1,
        key: "Date identified",
        value:
          hasOwnProperty("datetime_added") &&
          convertDateFormat(detailsCompromisedData.datetime_added),
      },
      {
        id: 2,
        key: "Date compromised",
        value:
          hasOwnProperty("datetime_compromised") &&
          convertDateFormat(detailsCompromisedData.datetime_compromised),
      },
    ],
  };

  const Account = {
    title: "Account",
    data: [
      {
        id: 1,
        key: "URL",
        value: hasOwnProperty("url") && (
          <a
            href={`${detailsCompromisedData.url}`}
            className="underline"
            target="_blank"
          >
            {detailsCompromisedData.url}
          </a>
        ),
      },
      {
        id: 2,
        key: "Login",
        value: hasOwnProperty("login") && detailsCompromisedData.login,
      },
      {
        id: 3,
        key: "Password",
        value: hasOwnProperty("password") && detailsCompromisedData.password,
      },
    ],
  };

  const Devices = {
    title: "Devices",
    data: [
      {
        id: 1,
        key: "Device name",
        value:
          hasOwnProperty("computer_name") &&
          detailsCompromisedData.computer_name,
      },
      {
        id: 2,
        key: "Machine ID",
        value:
          hasOwnProperty("machine_id") && detailsCompromisedData.machine_id,
      },
      {
        id: 3,
        key: "Path",
        value: hasOwnProperty("path") && detailsCompromisedData.path,
      },
    ],
  };

  const Others = {
    title: "Others",
    data: [
      {
        id: 1,
        key: "IP Address",
        value: hasOwnProperty("ip") && detailsCompromisedData.ip,
      },
      {
        id: 2,
        key: "Location",
        value: hasOwnProperty("location") && detailsCompromisedData.location,
      },
      {
        id: 3,
        key: "Antivirus",
        value:
          hasOwnProperty("antivirus") &&
          detailsCompromisedData.antivirus.length === 0
            ? "-"
            : hasOwnProperty("antivirus") &&
              detailsCompromisedData.antivirus.join(),
      },
    ],
  };

  function hasOwnProperty(property) {
    return detailsCompromisedData.hasOwnProperty(property) ? true : false;
  }

  function handleBackToCompromise() {
    // router.back();
    router.push("/credentials/dashboard/compromised");
  }

  const handleValidation = (value) => {
    setSelectValidasi(value);

    if (detailsCompromisedData.status_validasi === "-") {
      fetchCheckboxMultipleValidatedWithRefreshToken();
    } else {
      fetchUpdateValidateTestingWithRefreshToken(value);
    }
  };

  // Start of: Handle Update Validate

  const UpdateValidateTesting = async (validasi) => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/${detailsCompromisedSection}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: detailsCompromisedData.id,
            status_validasi: validasi,
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.success === false) {
        // throw new Error("");
        throw res;
      }

      if (data.success) {
        setValidasiSuccess(true);
        let newDataDetails = {
          ...detailsCompromisedData,
          status_validasi: validasi,
        };
        dispatch(setDataDetails(newDataDetails));
        return res;
      }
    } catch (error) {
      setValidasiSuccess(false);
      console.log("error : ", error);
      // return res
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setValidasiSuccess(null);
      }, 5000);
    }
  };

  const fetchUpdateValidateTestingWithRefreshToken = async (validasi) => {
    await fetchWithRefreshToken(
      UpdateValidateTesting,
      router,
      dispatch,
      validasi
    );
  };

  const CheckboxMultipleValidated = async () => {
    try {
      dispatch(setLoadingState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/${detailsCompromisedSection}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [detailsCompromisedData.id],
            status_validasi: "valid",
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      setValidasiSuccess(true);
      let newDataDetails = {
        ...detailsCompromisedData,
        status_validasi: "valid",
      };
      dispatch(setDataDetails(newDataDetails));
      return res;
    } catch (error) {
      setValidasiSuccess(false);
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setValidasiSuccess(null);
      }, 5000);
    }
  };

  const fetchCheckboxMultipleValidatedWithRefreshToken = async () => {
    await fetchWithRefreshToken(CheckboxMultipleValidated, router, dispatch);
  };

  // End of: Handle Update Validate

  // Start of: Handle Bookmark

  const handleBookmark = () => {
    fetchBookmarkFunctionalityWithRefreshToken();
  };

  const BookmarkFunctionality = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}status/domain/${detailsCompromisedSection}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [detailsCompromisedData.id],
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (!data.success) {
        // throw new Error("");
        throw res;
      }

      setBookmarkSuccess(true);
      let newDataDetails = {
        ...detailsCompromisedData,
        is_boomark: !detailsCompromisedData.is_boomark,
      };
      dispatch(setDataDetails(newDataDetails));
      return res;
    } catch (error) {
      setBookmarkSuccess(false);
      return error;
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        setBookmarkSuccess(null);
      }, 5000);
    }
  };

  const fetchBookmarkFunctionalityWithRefreshToken = async () => {
    await fetchWithRefreshToken(BookmarkFunctionality, router, dispatch);
  };

  // End of: Handle Bookmark

  // Start of: Handle AI - Post

  const handlePostTrySectorAi = () => {
    fetchPostTrySectorAiWithRefreshToken();
  };

  const PostTrySectorAi = async () => {
    try {
      // dispatch(setLoadingState(true));
      setLoadingSectorAi(true);

      const res = await fetch(`${APIDATAV1}recommendation`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: detailsCompromisedData.id,
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

  // Start of: Handle AI - Get

  const GetTrySectorAI = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}recommendation?id=${detailsCompromisedData.id}`,
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

  // End of: Handle AI - Get

  useEffect(() => {
    if (!hasOwnProperty("id")) {
      return redirect("/credentials/dashboard/compromised");
    }
  }, []);

  return (
    <>
      <section className="flex items-center relative">
        <Alert
          message={"Success change status"}
          type="success"
          showIcon
          closable={true}
          style={{
            position: "absolute",
            // top: "32px",
            left: "20%",
            right: "20%",
            textAlign: "left",
          }}
          className={clsx(
            validasiSuccess !== null
              ? validasiSuccess
                ? "visible"
                : "hidden"
              : "hidden"
          )}
        />
        <Alert
          message={"Failed change status"}
          type="error"
          showIcon
          closable={true}
          style={{
            position: "absolute",
            // top: "32px",
            left: "20%",
            right: "20%",
            textAlign: "left",
          }}
          className={clsx(
            validasiSuccess !== null
              ? !validasiSuccess
                ? "visible"
                : "hidden"
              : "hidden"
          )}
        />
        <Alert
          message={"Success Change Bookmark status"}
          type="success"
          showIcon
          closable={true}
          style={{
            position: "absolute",
            // top: "32px",
            left: "20%",
            right: "20%",
            textAlign: "left",
          }}
          className={clsx(
            bookmarkSuccess !== null
              ? bookmarkSuccess
                ? "visible"
                : "hidden"
              : "hidden"
          )}
        />
        <Alert
          message={"Failed Change Bookmark status"}
          type="error"
          showIcon
          closable={true}
          style={{
            position: "absolute",
            // top: "32px",
            left: "20%",
            right: "20%",
            textAlign: "left",
          }}
          className={clsx(
            bookmarkSuccess !== null
              ? !bookmarkSuccess
                ? "visible"
                : "hidden"
              : "hidden"
          )}
        />
        <div onClick={handleBackToCompromise} className="hover:cursor-pointer">
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black ml-3">Details</h1>
        <div className="ml-auto flex ">
          <button
            className={clsx(
              "bg-white border-[1px] border-[#D5D5D5] rounded-[8px] text-primary-base py-2 px-4 flex items-center mr-4",
              detailsCompromisedData.is_boomark ? "hidden" : "visible"
            )}
            onClick={handleBookmark}
          >
            <BookmarkBorderOutlinedIcon style={{ fontSize: "22px" }} />
            <p className="ml-2">Bookmark</p>
          </button>
          <button
            className={clsx(
              "bg-white border-[1px] border-primary-base rounded-[8px] text-primary-base py-2 px-4 flex items-center mr-4",
              !detailsCompromisedData.is_boomark ? "hidden" : "visible"
            )}
            onClick={handleBookmark}
          >
            <BookmarkRemoveIcon style={{ fontSize: "22px" }} />
            <p className="ml-2">Unmarked</p>
          </button>
          {/* <button className="bg-primary-base rounded-[8px] text-white py-2 px-4 ml-4 ">
            Validate
          </button> */}
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: `${
                  detailsCompromisedData.status_validasi === "-" ||
                  detailsCompromisedData.status_validasi === "invalid"
                    ? "#F7F7F7"
                    : "white"
                }`,
                colorBorder: `${
                  detailsCompromisedData.status_validasi === "-" ||
                  detailsCompromisedData.status_validasi === "invalid"
                    ? "#D5D5D5"
                    : "#52C41A"
                }`,
                colorText: `${
                  detailsCompromisedData.status_validasi === "-" ||
                  detailsCompromisedData.status_validasi === "invalid"
                    ? "#000000E0"
                    : "#52C41A"
                }`,
                fontWeightStrong: true,
              },
              components: {
                Select: {
                  optionActiveBg: "#F7F7F7",
                  optionSelectedBg: "#FFEBD4",
                },
              },
            }}
          >
            <Select
              defaultValue={
                detailsCompromisedData.status_validasi === "-" ||
                detailsCompromisedData.status_validasi === "invalid"
                  ? "invalid"
                  : "valid"
              }
              value={
                detailsCompromisedData.status_validasi === "-" ||
                detailsCompromisedData.status_validasi === "invalid"
                  ? "invalid"
                  : "valid"
              }
              style={{ width: 91, height: "42px" }}
              onChange={(value) => handleValidation(value)}
              options={[
                {
                  value: "invalid",
                  label: "Invalid",
                },

                {
                  value: "valid",
                  label: "Valid",
                },
              ]}
              className={clsx(
                detailsCompromisedFilters === DETAIL_COMPROMISED_BOOKMARK
                  ? "hidden"
                  : "visible"
              )}
            />
          </ConfigProvider>
        </div>
      </section>
      <section className="bg-white rounded-2xl px-8 py-8 mt-6">
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5]">
          <DetailItems items={Date} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Account} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Devices} />
        </div>
        <div className=" mt-8">
          <DetailItems items={Others} />
        </div>
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
              >
                <SaveAltIcon />
                <p className={clsx("ml-2")}>Download PDF</p>
              </button>
            </div>
            {/* <p> {aiGenerated && aiGenerated.replace(/"/g, " ")} </p> */}
            <div>
              <h2 className="text-XL-strong text-black mb-3">
                Incident summary
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
