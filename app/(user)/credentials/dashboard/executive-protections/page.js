"use client";

import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { ExecutiveProtectionInfo } from "@/app/_ui/components/cards/ExecutiveProtectionInfo";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import PasswordIcon from "@mui/icons-material/Password";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCallScannedEmailFunctions,
  setIsScanNow,
  setScannedEmail,
  setScannedId,
} from "@/app/_lib/store/features/ExecutiveProtections/ScanEmailSlices";
import { useRouter, redirect } from "next/navigation";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { Alert, Checkbox, ConfigProvider, Pagination, Space } from "antd";
import clsx from "clsx";
import Image from "next/image";
import {
  setEmailIsVerified,
  setErrorLeakedData,
  setIsUsersDontShowAgain,
  setIsUsersDontShowAgainTemp,
  setLeakedData,
  setTotalExposures,
  setUsersCredit,
} from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";
import {
  setDataDetails,
  setDataExecutiveKeysDetails,
  setDataExecutiveValuesDetails,
  setDetailExecutiveState,
  setFilters,
  setSection,
} from "@/app/_lib/store/features/Compromised/DetailSlices";
import { ExecutiveProtectionsFirstAccess } from "@/app/_ui/components/cards/ExecutiveProtectionsFirstAccess";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  setCallDeleteSearchHistory,
  setHistorySearchEmailVerified,
  setIsConfirmDeleteHistory,
} from "@/app/_lib/store/features/ExecutiveProtections/SearchHistorySlices";

const informations = [
  {
    id: 1,
    icon: WebAssetIcon,
    title: "What is the dark web?",
    descriptions:
      "The dark web is a part of the internet that allows people to hide their identity and location from others as well as from law enforcement. As a result, the dark web can be used to sell stolen personal info.",
  },
  {
    id: 2,
    icon: CoronavirusIcon,
    title: "What is malware?",
    descriptions: `"Malicious software" is a type of software designed to damage computers. Malicious software can steal sensitive information from your computer, slow it down, or even send fake emails from your email account without your knowledge.`,
  },
  {
    id: 3,
    icon: ReportGmailerrorredIcon,
    title: "What is a phishing attack?",
    descriptions: `Phishing is usually done through emails, advertisements, or through sites that look similar to sites you already use. For example, you may get an email that looks like it's from a bank asking you to confirm a bank account number.`,
  },
  {
    id: 3,
    icon: PasswordIcon,
    title: "Tips to create a strong password",
    descriptions: `Using the same password over and over again can be risky. If someone gets your password for one of your accounts, they can use that password to control your email accounts, social media profiles, and even your money.`,
  },
];

const informationsDontShowAgain = [
  {
    id: 1,
    icon: DocumentScannerIcon,
    title: "Scan your email for data leaks",
    descriptions:
      "Run a one-time scan to see if your email address is on the dark web.",
  },
  {
    id: 2,
    icon: LockOutlinedIcon,
    title: "Take action to protect your account",
    descriptions: `Take preemptive action based on the guidance on what to do if your data leak info is discovered.`,
  },
  {
    id: 3,
    icon: CheckCircleOutlinedIcon,
    title: "Data security recommendations",
    descriptions: `Get recommendations to secure your account from data leaks.`,
  },
];

export default function ExecutiveProtections() {
  const [email, setEmail] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allRecentSearch, setAllRecentSearch] = useState();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isCheckDontShowAgain, setIsCheckDontShowAgain] = useState(false);
  const [triggerChange, setTriggerChange] = useState(false);
  const [triggerTrueVerified, setTriggerTrueVerified] = useState(false);
  const [localUsersCredit, setLocalUsersCredit] = useState();

  console.log("local users credit: ", localUsersCredit);

  const canSend = email;
  const dispatch = useDispatch();
  const router = useRouter();

  const isEmailVerified = useSelector(
    (state) => state.executiveProtections.isVerified
  );
  const scannedEmail = useSelector((state) => state.executiveProtections.email);

  const dataLeaked = useSelector(
    (state) => state.executiveProtections.leakedData
  );

  const errorDataLeaked = useSelector(
    (state) => state.executiveProtections.errorLeakedData
  );

  const totalExposures = useSelector(
    (state) => state.executiveProtections.totalExposures
  );

  const usersCredit = useSelector(
    (state) => state.executiveProtections.usersCredit
  );
  const usersDontShowAgain = useSelector(
    (state) => state.executiveProtections.isUsersDontShowAgain
  );
  const usersDontShowAgainTemp = useSelector(
    (state) => state.executiveProtections.isUsersDontShowAgainTemp
  );

  const historySearchEmailVerified = useSelector(
    (state) => state.searchHistory.historySearchEmailVerified
  );

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

  const handleChangeEmail = (e) => {
    setEmail(e.target.value.trim());
    // allRecentSearch &&
    //   allRecentSearch.map((data) => {
    //     console.log("data search: ", data.search);
    //     console.log("e.target.value: ", e.target.value);
    //     if (data.search === e.target.value) {
    //       console.log("masuk if");
    //       dispatch(setHistorySearchEmailVerified(true));
    //       setCookie("scanned_email", e.target.value);
    //     } else {
    //       console.log("masuk else");
    //       dispatch(setHistorySearchEmailVerified(false));
    //       deleteCookie("scanned_email");
    //     }
    //   });

    const isMatch =
      allRecentSearch &&
      allRecentSearch.some((data) => data.search === e.target.value.trim());

    if (isMatch) {
      console.log("masuk if");
      dispatch(setHistorySearchEmailVerified(true));
      setCookie("scanned_email", e.target.value);
    } else {
      console.log("masuk else");
      dispatch(setHistorySearchEmailVerified(false));
      deleteCookie("scanned_email");
    }
  };

  const handleClickSearchHistoryEmail = (email, verified) => {
    setEmail(email);
    dispatch(setHistorySearchEmailVerified(verified));
    setCookie("scanned_email", email);
  };

  const handleDontShowAgaoinCheck = (e) => {
    setIsCheckDontShowAgain(e.target.checked);
  };

  const handleButtonDontShowAgain = () => {
    if (isCheckDontShowAgain) {
      callPatchUsersStatusCredit();
    } else {
      dispatch(setIsUsersDontShowAgainTemp(true));
    }
  };

  const handleScanNow = () => {
    if (canSend) {
      if (!historySearchEmailVerified) {
        dispatch(setIsScanNow(true));
        dispatch(setScannedEmail(email));
        dispatch(setCallScannedEmailFunctions(callSendOtpScannedEmail));
      }

      if (historySearchEmailVerified) {
        dispatch(setEmailIsVerified(true));
        callGetDetailLeakedData();
        dispatch(setHistorySearchEmailVerified(false));
      }
    }
  };

  const handleDeleteIndividual = (id) => {
    dispatch(setIsConfirmDeleteHistory(true));
    dispatch(setCallDeleteSearchHistory(() => deleteRecentSearchData(id)));
  };

  const handleDeleteAll = () => {
    dispatch(setIsConfirmDeleteHistory(true));
    dispatch(setCallDeleteSearchHistory(deleteAllRecentSearchData));
    // deleteAllRecentSearchData();
  };

  const handleIsEmailFocusTrue = () => {
    setIsEmailFocused(true);
  };

  const handleIsEmailFotusFalse = () => {
    setIsEmailFocused(false);
  };

  const handleDetails = (item) => {
    // dispatch(setDetailExecutiveState(true));
    // dispatch(setDataExecutiveKeysDetails(keys));
    // dispatch(setDataExecutiveValuesDetails(values));
    console.log("item handledetails: ", item);
    dispatch(setDataDetails(item));
    router.push(
      `/credentials/dashboard/executive-protections/detail/${item.info_1.idDetailData}`,
      {
        scroll: true,
      }
    );
  };

  const fetchSendOtpScannedEmail = async () => {
    try {
      dispatch(setLoadingState(true));

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(
        `${APIDATAV1}validate/protection?search=${email}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      // if (res.status === 400) {
      //   setIsErrorEmail(true);
      //   console.log("error bunggg  di 400....", res);

      //   return res;
      // }

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setIsErrorEmail(true);
        setErrorMessage(data.message);
        throw res;
      }

      if (data.data) {
        dispatch(setScannedId(data.data.id));
        dispatch(setScannedEmail(data.data.search));
        setCookie("scanned_user", data.data.id);
        setCookie("scanned_email", data.data.search);
        router.push("/verifications/send-otp-scanned-email");
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callSendOtpScannedEmail = async () => {
    await fetchWithRefreshToken(fetchSendOtpScannedEmail, router, dispatch);
  };

  const fetchGetDetailLeakedData = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerTrueVerified(false);

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(
        `${APIDATAV1}protection?search=${getCookie("scanned_email")}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data executive: ", data);

      if (data.error) {
        dispatch(setErrorLeakedData(true));
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      // if (data.data) {
      //   dispatch(setScannedId(data.data.id));
      //   dispatch(setScannedEmail(data.data.search));
      //   setCookie("scanned_user", data.data.id);
      //   setCookie("scanned_email", data.data.search);
      //   router.push("/verifications/send-otp-scanned-email");
      //   return res;
      // }

      if ("No results found" in data.List) {
        dispatch(setLeakedData(null));
        setTriggerTrueVerified(true);
        return res;
      } else {
        let totalItems = Object.keys(data.List).length;
        dispatch(setLeakedData(data));
        dispatch(setTotalExposures(totalItems));
        setTriggerTrueVerified(true);
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      setTriggerTrueVerified(true);
      dispatch(setLoadingState(false));
      callGetUsersStatusCredit();
    }
  };

  const callGetDetailLeakedData = async () => {
    await fetchWithRefreshToken(fetchGetDetailLeakedData, router, dispatch);
  };

  const fetchGetUsersStatus = async () => {
    try {
      dispatch(setLoadingState(true));

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(`${APIDATAV1}information/protection`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        // dispatch(setUsersCredit(data.data));
        console.log("data ini adalah penentuan credit: ", data.data);
        setLocalUsersCredit(data.data);
        dispatch(setIsUsersDontShowAgain(data.data.is_protection));
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callGetUsersStatusCredit = async () => {
    await fetchWithRefreshToken(fetchGetUsersStatus, router, dispatch);
  };

  const patchGetUsersStatus = async () => {
    try {
      dispatch(setLoadingState(true));

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(`${APIDATAV1}information/protection`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_protection: isCheckDontShowAgain,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.error) {
        return res;
      }

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        // dispatch(setUsersCredit(data.data));
        dispatch(setIsUsersDontShowAgain(data.data.is_protection));
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callPatchUsersStatusCredit = async () => {
    await fetchWithRefreshToken(patchGetUsersStatus, router, dispatch);
  };

  const fetchRecentSearchData = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}protection`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setAllRecentSearch();
        throw res;
      }

      // if (data.data) {
      //   dispatch(setScannedId(data.data.id));
      //   dispatch(setScannedEmail(data.data.search));
      //   setCookie("scanned_user", data.data.id);
      //   setCookie("scanned_email", data.data.search);
      //   router.push("/verifications/send-otp-scanned-email");
      //   return res;
      // }
      setAllRecentSearch(data.data);
      return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callRecentSearchData = async () => {
    await fetchWithRefreshToken(fetchRecentSearchData, router, dispatch);
  };

  const DeleteRecentSearchData = async (deleteId = "") => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}protection`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setTriggerChange(true);
        throw res;
      }

      // return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const deleteRecentSearchData = async (id) => {
    await fetchWithRefreshToken(DeleteRecentSearchData, router, dispatch, id);
  };

  const DeleteAllRecentSearchData = async () => {
    try {
      dispatch(setLoadingState(true));

      setTriggerChange(false);

      const res = await fetch(`${APIDATAV1}protection`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 400) {
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        setTriggerChange(true);
        throw res;
      }

      // return res;
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const deleteAllRecentSearchData = async () => {
    await fetchWithRefreshToken(DeleteAllRecentSearchData, router, dispatch);
  };

  const MapLeakedData =
    dataLeaked &&
    Object.entries(dataLeaked.List).map(([website, data]) => {
      let leakedKeys = [];
      if (data.Data && data.Data.length > 0) {
        leakedKeys = Object.keys(data.Data[0]);
      }

      let idDetailData = dataLeaked.id;
      return { website, leakedKeys, idDetailData };
    });

  console.log("data leaked: ", dataLeaked);

  // useEffect(() => {
  //   callGetDetailLeakedData();
  // }, [isEmailVerified]);

  useEffect(() => {
    setTriggerChange(false);
    callRecentSearchData();
  }, [triggerChange]);

  useEffect(() => {
    callRecentSearchData();
    callGetUsersStatusCredit();
  }, []);

  useEffect(() => {
    if (isEmailVerified) {
      console.log("running is email verified");
      callGetDetailLeakedData();
      setEmail(scannedEmail);
      // callGetUsersStatusCredit();
    }
  }, []);

  useEffect(() => {
    // setTriggerTrueVerified(false);
    if (triggerTrueVerified) {
      console.log("jalan dong verified credit...");

      callGetUsersStatusCredit();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsErrorEmail(false);
    }, 4000);
  }, [isErrorEmail]);

  return (
    <>
      <main
        className={clsx(
          "bg-white rounded-lg shadow-md py-8 px-[120px] text-center",
          !usersDontShowAgain && !usersDontShowAgainTemp ? "visible" : "hidden"
        )}
      >
        <div className="mx-auto">
          <Image
            src={"/images/image_loadingState.svg"}
            alt="search icon"
            width={250}
            height={250}
            className="text-center mx-auto"
          />
        </div>
        <h1 className="my-7 text-heading-3 text-black">
          See if your email address is on the dark web
        </h1>
        {informationsDontShowAgain.map((data) => {
          const Icon = data.icon;

          return (
            <div key={data.id} className="mt-5">
              <ExecutiveProtectionsFirstAccess
                Icon={Icon}
                title={data.title}
                descriptions={data.descriptions}
              />
            </div>
          );
        })}
        <div className="flex justify-between items-center mt-10">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#FF6F1E",
              },
            }}
          >
            <Checkbox
              onChange={handleDontShowAgaoinCheck}
              checked={isCheckDontShowAgain}
            >
              Dont show this again
            </Checkbox>
          </ConfigProvider>

          <button
            className="rounded-md bg-primary-base text-white text-LG-normal py-1.5 px-3"
            onClick={handleButtonDontShowAgain}
          >
            Next
          </button>
        </div>
      </main>
      <main
        className={clsx(
          usersDontShowAgain || usersDontShowAgainTemp ? "visible" : "hidden"
        )}
      >
        <section className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center px-[96px] py-8 relative ">
          <Alert
            message={errorMessage ? errorMessage : "Email is not valid"}
            type="error"
            showIcon
            closable={true}
            style={{
              position: "absolute",
              top: "32px",
              left: "32px",
              right: "32px",
              textAlign: "left",
            }}
            className={clsx(isErrorEmail ? "visible" : "hidden")}
          />
          <div>
            <h1 className="text-heading-3 text-black">
              Has your personal data been exposed?
            </h1>
            <h2 className="text-Base-normal text-text-description mt-[12px]">
              Scan your primary email to see your digital footprint.
            </h2>
          </div>
          <div className="mt-[32px] w-full">
            <div className="flex text-center justify-center items-center relative">
              <input
                type="text"
                className="rounded-md px-3 py-[5px] border-input-border border-2 w-[50%] text-LG-normal text-black"
                placeholder="name@mail.com"
                value={email}
                onChange={handleChangeEmail}
                onFocus={handleIsEmailFocusTrue}
                // onBlur={handleIsEmailFotusFalse}
                onMouseEnter={handleIsEmailFocusTrue}
                // onMouseLeave={handleIsEmailFotusFalse}
              />
              {isEmailFocused && allRecentSearch && (
                <div
                  className="bg-white drop-shadow-lg rounded-md p-4 absolute top-[50px] left-[20%] right-[31%] max-h-[320px] overflow-y-scroll pointer-events-auto z-10"
                  onMouseEnter={handleIsEmailFocusTrue}
                  onMouseLeave={handleIsEmailFotusFalse}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <h1 className="text-Base-strong text-black">
                        Search history
                      </h1>
                      <p className="text-text-description text-SM-normal mt-1">
                        Rescanning these email addresses does not reduce your
                        search credit count.
                      </p>
                    </div>
                    <button
                      className="text-primary-base text-Base-normal"
                      onClick={handleDeleteAll}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-5">
                    {allRecentSearch &&
                      allRecentSearch.map((data) => (
                        <div
                          key={data.id}
                          className="mt-4 flex items-center justify-between cursor-pointer hover:bg-[#FFEBD4] px-1.5 py-1 rounded-md"
                        >
                          <div className="flex items-center">
                            <div>
                              <Image
                                src={"/images/recent_search_logo.svg"}
                                alt="search icon"
                                width={18}
                                height={18}
                              />
                            </div>
                            <h1
                              className="text-Base-normal text-black ml-3"
                              onClick={() =>
                                handleClickSearchHistoryEmail(
                                  data.search,
                                  data.verified
                                )
                              }
                            >
                              {data.search}
                            </h1>
                          </div>
                          <div className="cursor pointer">
                            <Image
                              src={"/images/close_recent_search_logo.svg"}
                              alt="search icon"
                              width={9}
                              height={9}
                              onClick={() => handleDeleteIndividual(data.id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="ml-4">
                <AuthButton
                  value={"Scan now"}
                  agreements={canSend}
                  onClick={handleScanNow}
                />
              </div>
            </div>
            <p className="text-SM-normal text-[#00000082] text-center mt-4 ml-[-25%]">
              You can only search a maximum of 10 searches.{" "}
              <span className="text-SM-strong text-primary-base">
                {localUsersCredit && localUsersCredit.credit}/10
              </span>{" "}
              Credits
            </p>
          </div>
        </section>
        <section
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center p-[64px] mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "hidden"
            //   : "visible"
            !isEmailVerified && !scannedEmail && !errorDataLeaked
              ? "visible"
              : "hidden"
          )}
        >
          <h1 className="text-heading-4 text-black">Looking to learn more?</h1>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {informations.map((data) => {
              const Icon = data.icon;

              return (
                <div key={data.id}>
                  <ExecutiveProtectionInfo
                    Icon={Icon}
                    title={data.title}
                    descriptions={data.descriptions}
                  />
                </div>
              );
            })}
          </div>
        </section>
        <section
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center p-[64px] mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            isEmailVerified && !errorDataLeaked && dataLeaked !== null
              ? "visible"
              : "hidden"
          )}
        >
          <h1 className="text-heading-4 text-black">
            Results of your data leak
          </h1>
          <h2 className="text-Base-normal text-text-description mt-3 max-w-[450px]">
            Get details on data breaches that leak your info on the dark web.
            See how you can become more secure based on each result.
          </h2>

          <div className="my-6 w-full">
            <Alert
              message={`We found ${totalExposures} exposures of your data.`}
              type="warning"
              showIcon
              closable
              style={{
                textAlign: "left",
              }}
            />
          </div>

          <div className="border-2 rounded-xl border-input-border w-full">
            <table className="bg-white  w-full rounded-xl text-left">
              <thead className="text-black text-Base-strong bg-[#00000005]">
                <tr className="border-b-[1px] border-[#D5D5D5]">
                  <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                    No
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Website Name
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Leaked Data
                  </td>
                  <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody className="text-Base-normal text-text-description">
                {MapLeakedData &&
                  MapLeakedData.map((data, index) => {
                    console.log("data leaked keys ", data.leakedKeys);
                    console.log(
                      "data leaked value ",
                      dataLeaked.List[data.website].Data[0]
                    );

                    console.log("data semua: ", data);

                    const formattedData = sliceObject(
                      dataLeaked.List[data.website].Data[0]
                    );

                    let allData = {
                      info_1: data,
                      info_2: dataLeaked.List[data.website].Data[0],
                      info_3: formattedData,
                    };

                    return (
                      <tr
                        className="border-b-[2px] border-[#D5D5D5]"
                        key={index}
                      >
                        <td className="py-[19px] px-[16px]"> {index + 1} </td>
                        <td className="py-[19px] px-[16px]">{data.website}</td>
                        <td className="py-[19px] px-[16px] w-[45%]">
                          {data.leakedKeys.map((key) => (
                            <>
                              <span
                                className="inline-block bg-white text-text-description rounded-[100px] border-[1px] border-[#D5D5D5] text-SM-normal py-1 px-4 mr-2 mt-2"
                                key={key}
                              >
                                {key}
                              </span>
                            </>
                          ))}
                        </td>
                        <td className="py-[19px] px-[16px]">
                          <button
                            className="rounded-md border-[1px] border-input-border text-primary-base text-Base-normal py-1.5 px-4"
                            onClick={() => handleDetails(allData)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="flex items-center justify-between my-[19px] mx-[16px]">
              <p className="text-Base-normal text-[#676767] ">
                Showing {totalExposures} to {totalExposures} entries
              </p>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Pagination: {
                        itemActiveBg: "#FF6F1E",
                        itemLinkBg: "#fff",
                        itemInputBg: "#fff",
                      },
                    },
                    token: {
                      colorPrimary: "white",
                    },
                  }}
                >
                  <Pagination
                    type="primary"
                    defaultCurrent={1}
                    total={totalExposures}
                    showSizeChanger={false}
                    style={{ color: "#FF6F1E" }}
                    // current={bookmarkPage}
                    // onChange={handleSetBookmarkPage}
                  />
                </ConfigProvider>
              </div>
            </div>
          </div>
        </section>
        <section
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center p-[64px] mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            isEmailVerified && !errorDataLeaked && dataLeaked === null
              ? "visible"
              : "hidden"
          )}
        >
          <div>
            <Image
              src={"/images/sector_confirmation_created_password_success.svg"}
              alt="search icon"
              width={129}
              height={121}
            />
          </div>
          <h1 className="text-heading-4 text-black">
            Your email account is safe!
          </h1>
          <h2 className="text-LG-normal text-text-description mt-3 max-w-[450px]">
            Nothing was found after scanning your email address.
          </h2>
        </section>

        <section
          className={clsx(
            "flex flex-col justify-center items-center bg-white rounded-lg  text-center p-[64px] mt-8 ",
            // hasCookie("scanned_verified") &&
            //   getCookie("scanned_verified") === "true"
            //   ? "visible"
            //   : "hidden"
            isEmailVerified && errorDataLeaked ? "visible" : "hidden"
          )}
        >
          {/* <div>
          <Image
            src={"/images/sector_confirmation_created_password_success.svg"}
            alt="search icon"
            width={129}
            height={121}
          />
        </div> */}
          <h1 className="text-heading-4 text-black">
            Oopss.. Something went wrong
          </h1>
          <h2 className="text-LG-normal text-text-description mt-3 max-w-[450px]">
            There are something trouble on server
          </h2>
        </section>
      </main>
    </>
  );
}
