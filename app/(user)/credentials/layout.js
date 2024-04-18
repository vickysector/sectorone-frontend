"use client";

import Sidenav from "@/app/_ui/dashboard/Sidenav";
import Image from "next/image";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect } from "next/navigation";
import { LogoutOutlined } from "@ant-design/icons";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import { useSelector, useDispatch } from "react-redux";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";
import { setDetailState } from "@/app/_lib/store/features/Compromised/DetailSlices";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import copy from "copy-to-clipboard";
import {
  setBookmarkBannerSuccess,
  setBookmarkConfirmState,
  setBookmarkStatusData,
} from "@/app/_lib/store/features/Compromised/BookmarkSlices";
import {
  setUnBookmarkBannerSuccess,
  setUnBookmarkConfirmState,
  setUnBookmarkStatusData,
} from "@/app/_lib/store/features/Compromised/UnBookmarkSlices";
import {
  clearIds,
  setBannerMultipleBookmark,
  setBannerMultipleValidated,
  setMarkedAsBookmark,
  setMarkedAsValidated,
  setSuccessMultipleBookmark,
  setSuccessMultipleValidated,
} from "@/app/_lib/store/features/Compromised/CheckboxSlices";
import LoadingStateCard from "@/app/_ui/components/utils/LoadingStateCard";
import { setConfirmExportToCsv } from "@/app/_lib/store/features/Export/ExportToCsvSlice";
import { setConfirmExportToCsvCompromise } from "@/app/_lib/store/features/Export/ExportToCsvCompromiseSlice";

export default function DashboardLayout({ children }) {
  const [hide, setHide] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);
  const [usersData, setUsersData] = useState();
  const [sessionExpired, setSessionExpired] = useState();
  const [isUrlListSelected, setIsUrlListSelected] = useState(false);
  const [idDomainUrl, setIdDomainUrl] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [reloadChange, setReloadChange] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const changeUrlState = useSelector((state) => state.changeUrl.status);
  const UrlsList = useSelector((state) => state.chooseUrl.urlData);
  const loadingCompromisedData = useSelector(
    (state) => state.compromised.status
  );
  const loadingActivityLogData = useSelector(
    (state) => state.activityLogLoading.status
  );
  const loadingStealerData = useSelector(
    (state) => state.stealerLoading.status
  );
  const detailsCompromisedState = useSelector(
    (state) => state.detailComrpomise.status
  );
  const detailsCompromisedData = useSelector(
    (state) => state.detailComrpomise.data
  );

  const bookmarkCompromisedState = useSelector(
    (state) => state.bookmarkCompromise.status
  );

  const bookmarkCompromisedId = useSelector(
    (state) => state.bookmarkCompromise.id_data
  );

  const bookmarkCompromiseDomain = useSelector(
    (state) => state.bookmarkCompromise.domain
  );

  const unbookmarkCompromisedState = useSelector(
    (state) => state.unbookmarkCompromise.status
  );

  const unbookmarkCompromisedId = useSelector(
    (state) => state.unbookmarkCompromise.id_data
  );

  const unbookmarkCompromiseDomain = useSelector(
    (state) => state.unbookmarkCompromise.domain
  );

  const loadingBreachesOverview = useSelector(
    (state) => state.overviewLoading.breachesState.status
  );

  const loadingListDomainUsersOverview = useSelector(
    (state) => state.overviewLoading.listDomainUsersState.status
  );

  const loadingTopCompromisedUserOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseUserState.status
  );

  const loadingTopCompromiseUrlOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseUrlState.status
  );

  const loadingTopCompromiseAntivirusOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseAntivirusState.status
  );

  const loadingTopCompromiseMalwareOverview = useSelector(
    (state) => state.overviewLoading.topCompromiseMalwareState.status
  );

  // console.log(
  //   "loading top compromise malware: ",
  //   loadingTopCompromiseMalwareOverview
  // );

  // Start of: Checking Users Credentials

  const CredentialsEmail = getCookie("email_credentials");
  const CredentialsAccess_Token = getCookie("access_token");
  const CredentialsRefresh_Token = getCookie("refresh_token");

  // End of: Checking Users Credentials

  const toggleHideIcon = () => {
    setHide((prevState) => !prevState);
  };

  const handleChangeUrlClose = () => {
    dispatch(setChangeUrl(false));
  };

  const handleBookmarkCompromisedClose = () => {
    dispatch(setBookmarkConfirmState(false));
  };

  const handleUnBookmarkCompromisedClose = () => {
    dispatch(setUnBookmarkConfirmState(false));
  };

  // Start of: Handle Compromised Export to CSV

  const confirmCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.confirm
  );

  const sectionCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.section
  );

  const subSectionCompromiseExportToCSV = useSelector(
    (state) => state.exportToCsvCompromise.subSection
  );

  const callExportToCSVCompromise = useSelector(
    (state) => state.exportToCsvCompromise.callExportToCSVCompromise
  );

  const handleCloseCompromiseExportToCSV = () => {
    dispatch(setConfirmExportToCsvCompromise(false));
  };

  const handleConfirmYesCompromiseExportToCSV = () => {
    callExportToCSVCompromise();
    dispatch(setConfirmExportToCsvCompromise(false));
  };

  // End of: Handle Compromised Export to CSV

  // Start of: Handle Stealer Export to CSV

  const confirmStealerExportToCSV = useSelector(
    (state) => state.exportToCsv.confirm
  );

  const selectSectionStealer = useSelector(
    (state) => state.exportToCsv.selectSection
  );

  const exportToCSVDefaultStealer = useSelector(
    (state) => state.exportToCsv.exportToCsvDefault
  );

  const exportToCSVBookmarkStealer = useSelector(
    (state) => state.exportToCsv.exportToCsvBookmark
  );

  const handleCloseStealerExportToCsv = () => {
    dispatch(setConfirmExportToCsv(false));
  };

  const handleConfirmYesStealerExportToCsv = () => {
    switch (selectSectionStealer) {
      case "stealer":
        exportToCSVDefaultStealer();
        dispatch(setConfirmExportToCsv(false));
        break;
      case "bookmark-stealer":
        exportToCSVBookmarkStealer();
        dispatch(setConfirmExportToCsv(false));
        break;
      default:
        break;
    }
  };

  // End of: Handle Stelaer Export to CSV

  // Start of: Handle Checkboxes Bookmark in Compromised pages

  const allCheckboxesIdData = useSelector((state) => state.checkbox.ids);
  const confirmCheckboxIdsData = useSelector(
    (state) => state.checkbox.markedAsBookmark
  );
  const multipleBookmarkStatus = useSelector((state) => state.checkbox.status);

  console.log("all data id checkbox from compromised: ", allCheckboxesIdData);

  const handleCloseConfirmCheckboxIdsData = () => {
    dispatch(setMarkedAsBookmark(false));
  };

  const handleMultipleBookmarkCheckbox = () => {
    CheckboxMultipleBookmark();
    dispatch(clearIds());
    dispatch(setMarkedAsBookmark(false));
  };

  const CheckboxMultipleBookmark = async () => {
    try {
      dispatch(setSuccessMultipleBookmark(null));

      const res = await fetch(
        `${APIDATAV1}status/domain/${multipleBookmarkStatus}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${CredentialsAccess_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: allCheckboxesIdData,
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("");
      }

      dispatch(setSuccessMultipleBookmark(true));
      dispatch(setBannerMultipleBookmark(true));
      dispatch(clearIds());
    } catch (error) {
      dispatch(setBannerMultipleBookmark(false));
      dispatch(clearIds());
    } finally {
      dispatch(clearIds());
      setTimeout(() => {
        dispatch(setBannerMultipleBookmark(null));
      }, 9000);
    }
  };

  // End of: Handle Checkboxes Bookmark in Compromised pages

  // Start of: Handle Checkboxes Validated in Compromised pages

  const confirmCheckboxIdsDataValidated = useSelector(
    (state) => state.checkbox.markedAsValidated
  );

  const handleCloseConfirmCheckboxIdsDataValidated = () => {
    dispatch(setMarkedAsValidated(false));
  };

  const handleMultipleValidatedCheckbox = () => {
    CheckboxMultipleValidated();
    dispatch(clearIds());
    dispatch(setMarkedAsValidated(false));
  };

  const CheckboxMultipleValidated = async () => {
    try {
      dispatch(setSuccessMultipleValidated(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${multipleBookmarkStatus}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${CredentialsAccess_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: allCheckboxesIdData,
            status_validasi: "valid",
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("");
      }

      dispatch(setSuccessMultipleValidated(true));
      dispatch(setBannerMultipleValidated(true));
      dispatch(clearIds());
    } catch (error) {
      dispatch(setBannerMultipleValidated(false));
      dispatch(clearIds());
    } finally {
      dispatch(clearIds());
      setTimeout(() => {
        dispatch(setBannerMultipleValidated(null));
      }, 9000);
    }
  };

  // End of: Handle Checkboxes Validated in Compromised pages

  // Start of: Update Domain

  const handleUrlListSelected = (domain) => {
    if (getCookie("user_identifier") != domain) {
      setIsUrlListSelected(true);
      setIdDomainUrl(domain);
      console.log("domain: ", domain);
    }
  };

  const handleUrlListCancel = () => {
    setIdDomainUrl("");
    setIsUrlListSelected(false);
  };

  const handleUrlListYes = () => {
    UpdateDomain();
    window.location.reload();
  };

  const handleBookmarkCompromiseData = () => {
    BookmarkCompromisedData();
    dispatch(setBookmarkConfirmState(false));
  };

  const handleUnBookmarkCompromiseData = () => {
    UnBookmarkCompromisedData();
    dispatch(setUnBookmarkConfirmState(false));
  };

  const handleDetailCompromisedState = () => {
    dispatch(setDetailState(false));
  };

  const copyToClipboard = (text) => {
    copy(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const BookmarkCompromisedData = async () => {
    try {
      dispatch(setBookmarkStatusData(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${bookmarkCompromiseDomain}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${CredentialsAccess_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [`${bookmarkCompromisedId}`],
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("");
      }

      dispatch(setBookmarkStatusData(true));
      dispatch(setBookmarkBannerSuccess(true));
    } catch (error) {
      dispatch(setBookmarkStatusData(false));
      dispatch(setBookmarkBannerSuccess(false));
    } finally {
      setTimeout(() => {
        dispatch(setBookmarkBannerSuccess(null));
      }, 9000);
    }
  };

  const UnBookmarkCompromisedData = async () => {
    try {
      dispatch(setUnBookmarkStatusData(null));
      const res = await fetch(
        `${APIDATAV1}status/domain/${unbookmarkCompromiseDomain}/boomark`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${CredentialsAccess_Token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: [`${unbookmarkCompromisedId}`],
          }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("");
      }

      dispatch(setUnBookmarkStatusData(true));
      dispatch(setUnBookmarkBannerSuccess(true));
    } catch (error) {
      dispatch(setUnBookmarkStatusData(false));
      dispatch(setUnBookmarkBannerSuccess(false));
    } finally {
      setTimeout(() => {
        dispatch(setUnBookmarkBannerSuccess(null));
      }, 9000);
    }
  };

  const UpdateDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${CredentialsAccess_Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_domain: idDomainUrl,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data.Severity === "ERROR") {
        DeleteCookies();
        RedirectToLogin();
      }
      // setReloadChange(true);
    } catch (error) {
    } finally {
    }
  };

  // End of: Update Domain

  // Start of: Handle Logout

  const toggleAccount = () => {
    setAccountShow((prevState) => !prevState);
  };

  const Logout = async () => {
    try {
      setLogoutLoading(true);
      const res = await fetch(`${APIDATAV1}logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${CredentialsAccess_Token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("");
      }

      const data = await res.json();

      if (data.success) {
        DeleteCookies();
        router.push("/auth/login");
      }
    } catch (error) {
      setErrorLogout(true);
      setTimeout(() => {
        setErrorLogout(false);
      }, 3000);
    } finally {
      setLogoutLoading(false);
    }
  };

  // End of: Handle Logout

  // Start of: Handle Get Users and Get ID Users.

  const getUsersData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}setting/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setUsersData(data.data.email);
    } catch (error) {
    } finally {
    }
  };

  const getUserDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setCookie("user_identifier", data.data.id_domain);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getUsersData();
    getUserDomain();
  }, []);

  // End of: Handle Get Users and Get ID Users.

  // Start of: Refresh Token

  const getRefreshToken = async () => {
    try {
      const res = await fetch(`${APIKEY}refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: "app_secret!!!",
        },
      });

      console.log("refresh token res: ", res);

      if (res.status === 401 || res.status === 403 || res.status === 400) {
        setSessionExpired(true);
        setTimeout(() => {
          setSessionExpired(false);
          DeleteCookies();
          router.push("/auth/login");
        }, 7000);
      }

      const data = await res.json();

      deleteCookie("access_token");
      setCookie("access_token", data.data.access_token);

      console.log("refresh token data: ", data);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    const IntervalId = setInterval(() => {
      getRefreshToken();
    }, 15 * 60 * 1000);

    return () => clearInterval(IntervalId);
  }, []);

  // End of: Refresh Token

  useEffect(() => {
    if (
      !CredentialsEmail ||
      !CredentialsAccess_Token ||
      !CredentialsRefresh_Token
    ) {
      return redirect("/auth/login");
    }
  }, []);

  return (
    <main className="relative bg-input-container">
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          confirmCompromiseExportToCSV ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure you want to export this {
              sectionCompromiseExportToCSV
            }{" "}
            {subSectionCompromiseExportToCSV} data?
          </h1>
          <p className="mb-6 text-text-description ">
            Exported file only contain data that you seen in page.
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleConfirmYesCompromiseExportToCSV}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleCloseCompromiseExportToCSV}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          confirmStealerExportToCSV ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure you want to export this data?
          </h1>
          <p className="mb-6 text-text-description ">
            Exported file only contain data that you seen in page.
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleConfirmYesStealerExportToCsv}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleCloseStealerExportToCsv}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          confirmCheckboxIdsDataValidated ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure to Validated this {allCheckboxesIdData.length} data ?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After Validated this data you can see more details in Validated
            Sections
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleMultipleValidatedCheckbox}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleCloseConfirmCheckboxIdsDataValidated}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          confirmCheckboxIdsData ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure to Bookmark this {allCheckboxesIdData.length} data ?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After Bookmark this data will not available in Data Bookmark. you
            will meet this data in Data Compromised section.
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleMultipleBookmarkCheckbox}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleCloseConfirmCheckboxIdsData}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          unbookmarkCompromisedState ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure UnBookmark this Data?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After Un Bookmark this data will not available in Data Bookmark. you
            will meet this data in Data Compromised section.
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleUnBookmarkCompromiseData}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleUnBookmarkCompromisedClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-50 flex items-center justify-center text-black ",
          bookmarkCompromisedState ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure Bookmark this Data?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After Bookmark this data will not available in Data Compromised. you
            will meet this data in Bookmark section.
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleBookmarkCompromiseData}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleBookmarkCompromisedClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-[#000000B2] w-full z-40 flex items-center justify-center text-black ",
          detailsCompromisedState ? "visible" : "hidden"
        )}
      >
        <div className="w-[30%] bg-white rounded-lg p-[32px]  overflow-y-scroll h-[650px] relative">
          <div
            className={clsx(
              "fixed right-[50%] translate-x-[50%] top-[50%]  bg-white p-2 border-2 border-input-border rounded-lg ",
              copied ? "visible" : "hidden"
            )}
          >
            <p className="text-Base-normal text-text-description">Copied!</p>
          </div>
          <div className="flex justify-between border-b-[1px] pb-6 border-[#D5D5D5] ">
            <h1 className="text-LG-strong">Details</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleDetailCompromisedState}
            />
          </div>
          <div className="mt-6">
            <div>
              <h1 className="text-LG-strong">Date identified</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {convertDateFormat(detailsCompromisedData.datetime_added) ??
                  "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Date compromised</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {convertDateFormat(
                  detailsCompromisedData.datetime_compromised
                ) ?? "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Url</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {detailsCompromisedData.url ?? "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Login</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {detailsCompromisedData.login ?? "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Password</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {detailsCompromisedData.password ?? "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Device name</h1>
              <div className="flex justify-between items-center mt-1">
                <h2 className="text-text-description text-LG-normal ">
                  {detailsCompromisedData.computer_name ?? "-"}
                </h2>
                <CopyOutlined
                  style={{ fontSize: "21px", color: "#FF6F1E" }}
                  className="mr-2 ml-3 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(detailsCompromisedData.computer_name ?? "-")
                  }
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Machine ID</h1>

              <div className="flex justify-between items-center mt-1">
                <h2 className="text-text-description text-LG-normal mt-1">
                  {detailsCompromisedData.machine_id ?? "-"}
                </h2>
                <CopyOutlined
                  style={{ fontSize: "21px", color: "#FF6F1E" }}
                  className="mr-2 ml-3 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(detailsCompromisedData.machine_id ?? "-")
                  }
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Path</h1>

              <div className="flex justify-between items-center mt-1">
                <h2 className="text-text-description text-LG-normal mt-1">
                  {detailsCompromisedData.path ?? "-"}
                </h2>
                <CopyOutlined
                  style={{ fontSize: "21px", color: "#FF6F1E" }}
                  className="mr-2 ml-3 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(detailsCompromisedData.path ?? "-")
                  }
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">IP address</h1>

              <div className="flex justify-between items-center mt-1">
                <h2 className="text-text-description text-LG-normal mt-1">
                  {detailsCompromisedData.ip ?? "-"}
                </h2>
                <CopyOutlined
                  style={{ fontSize: "21px", color: "#FF6F1E" }}
                  className="mr-2 ml-3 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(detailsCompromisedData.ip ?? "-")
                  }
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Location</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {detailsCompromisedData.location ?? "-"}
              </h2>
            </div>
            <div className="mt-8">
              <h1 className="text-LG-strong">Antivirus</h1>
              <h2 className="text-text-description text-LG-normal mt-1">
                {detailsCompromisedData.antivirus ?? "-"}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* Start of: Loading State Cards */}

      <LoadingStateCard loading={loadingStealerData} />
      <LoadingStateCard loading={loadingActivityLogData} />
      <LoadingStateCard loading={loadingCompromisedData} />

      {/* Start = Overview */}
      <LoadingStateCard loading={loadingBreachesOverview} />
      <LoadingStateCard loading={loadingListDomainUsersOverview} />
      <LoadingStateCard loading={loadingTopCompromisedUserOverview} />
      <LoadingStateCard loading={loadingTopCompromiseUrlOverview} />
      <LoadingStateCard loading={loadingTopCompromiseAntivirusOverview} />
      <LoadingStateCard loading={loadingTopCompromiseMalwareOverview} />

      {/* End = Overview */}

      {/* End of: Loading State Cards */}

      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center text-black ",
          isUrlListSelected ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure change to this Domain?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After change it will automatically refresh and load all data
            relevant to this domain
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleUrlListYes}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleUrlListCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-40 flex items-center justify-center text-black",
          changeUrlState ? "visible" : "hidden"
        )}
      >
        <div className="w-[45%] bg-white rounded-lg p-[32px]  overflow-y-scroll max-h-[370px] ">
          <div className="flex justify-between border-b-[1px] pb-6 border-[#D5D5D5] ">
            <h1 className="text-LG-strong">URL list</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleChangeUrlClose}
            />
          </div>
          <div className="mt-6">
            <div className=" bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-full ">
              <input
                type="email"
                className={clsx(
                  " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                )}
                placeholder={"Search by URL"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="px-3 cursor-pointer">
                <Image
                  src={"/images/sector_image_search.svg"}
                  alt="search icon"
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <div className="mt-8">
              {UrlsList &&
                UrlsList.filter((data) =>
                  data.name_domain
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).map((data) => (
                  <div
                    className={clsx(
                      "flex justify-between items-center  hover:opacity-70 transition-all mt-6",
                      getCookie("user_identifier") == data.id_domain
                        ? "cursor-not-allowed opacity-75"
                        : "cursor-pointer"
                    )}
                    key={data.id_domain}
                    onClick={() => handleUrlListSelected(data.id_domain)}
                  >
                    {" "}
                    <h1 className="text-Base-normal">
                      {data.name_domain}
                    </h1>{" "}
                    <p
                      className={clsx(
                        "bg-primary-base rounded-lg px-[20px] py-[3px] text-white",
                        getCookie("user_identifier") == data.id_domain
                          ? "visible"
                          : "hidden"
                      )}
                    >
                      Active
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          sessionExpired ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">User session expired</h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            You have been logged out. if you still operating this site you must
            re-Login
          </p>
          <p className="text-Base-strong text-primary-base mt-6">
            You will automatically redirected to Login Page or You can
            immedieately to Login Page by Clicking the button below
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <PrimaryButton value={"Login"} href={"/auth/login"} />
            </div>
          </div>
        </div>
      </div>

      <div className={clsx(logoutLoading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <nav className="py-1.5 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-10 bg-white border-b-2 border-b-input-border">
        <Image
          src={"/images/sector_logo.png"}
          alt="Logo Sector"
          width={92}
          height={38}
        />
        <div className="flex items-center">
          <div className="cursor-pointer">
            <Image
              src={"/images/sector_notification.svg"}
              alt="Notif"
              width={22}
              height={22}
              className="mr-5"
            />
          </div>
          <div className="cursor-pointer" onClick={toggleAccount}>
            <Image
              src={"/images/sector_avatar.svg"}
              alt="Avatar Profile"
              width={28}
              height={28}
            />
          </div>
          <div
            className={clsx(
              "fixed right-[48px] top-[50px] bg-white p-[32px] shadow-xl rounded-2xl transition-all ",
              accountShow ? "visible" : "hidden"
            )}
          >
            <p className="text-heading-4"> {usersData && usersData} </p>
            <div className="w-full h-[1px] bg-input-border my-[24px]"></div>
            <div className="flex items-center cursor-pointer" onClick={Logout}>
              <div>
                <Image
                  src={"/images/image_logout.svg"}
                  alt="Avatar Profile"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-primary-base ml-[8px]">Log out of account</p>
            </div>
          </div>
        </div>
      </nav>
      <section className="bg-input-container flex relative">
        <div
          className={clsx(
            "fixed top-[50px] left-[50%] translate-x-[-50%] bg-white p-[20px] shadow-lg transition-all",
            errorLogout ? "visible" : "hidden"
          )}
        >
          <h1 className="text-text-description ">
            Oops ada keslaahan saat Logout
          </h1>
        </div>
        <aside
          className={clsx(
            " h-auth-screen  flex-none transition-all fixed left-0 bottom-0 bg-white z-10 border-r-2 border-r-input-border border-t-2 border-t-input-border ",
            hide ? "w-[102px]" : "w-[260px] overflow-x-hidden overflow-y-hidden"
          )}
        >
          {/* <div className="mt-2 flex justify-end mr-5">
            <MenuFoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "hidden" : "visible"
              )}
              onClick={toggleHideIcon}
            />
            <MenuUnfoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "visible" : "hidden"
              )}
              onClick={toggleHideIcon}
            />
          </div> */}
          <Sidenav />
          <div
            className={clsx(
              "bg-white border-2 border-input-border w-[38px] h-[38px] rounded-full fixed top-[208px] transition-all z-10 flex items-center justify-center cursor-pointer",
              hide ? "left-[87px]" : "left-[240px]"
            )}
            onClick={toggleHideIcon}
          >
            <LeftOutlined
              style={{ fontSize: "16px" }}
              className={clsx("cursor-pointer", hide ? "hidden" : "visible")}
            />
            <RightOutlined
              style={{ fontSize: "16px" }}
              className={clsx("cursor-pointer", hide ? "visible" : "hidden")}
            />
          </div>
        </aside>
        <div
          className={clsx(
            "flex-grow min-h-screen h-full  min-w-screen w-full fixed bg-input-container left-0 right-0 overflow-y-auto  pt-[75px] transition-all pr-[32px] pb-[64px]",
            hide ? "pl-[130px]" : "pl-[290px]"
          )}
        >
          {children}
        </div>
      </section>
    </main>
  );
}
