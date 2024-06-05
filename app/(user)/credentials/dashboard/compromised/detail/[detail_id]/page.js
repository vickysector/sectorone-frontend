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

export default function DetailCompromised() {
  const [selectValidasi, setSelectValidasi] = useState();
  const [validasiSuccess, setValidasiSuccess] = useState(null);

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
  console.log("details compromised section: ", detailsCompromisedFilters);

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

    console.log("triggered handlevalidation: ", value);
    fetchUpdateValidateTestingWithRefreshToken(value);
  };

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
        <div onClick={handleBackToCompromise} className="hover:cursor-pointer">
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black ml-3">Details</h1>
        <div className="ml-auto flex ">
          <button className="bg-white border-[1px] border-[#D5D5D5] rounded-[8px] text-primary-base py-2 px-4 flex items-center mr-4">
            <BookmarkBorderOutlinedIcon style={{ fontSize: "22px" }} />
            <p className="ml-2">Bookmark</p>
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
            <button className="bg-[#9254DE] text-white text-LG-normal py-2 px-8 rounded-[8px] hover:-translate-y-1 transition-all flex items-center">
              <TipsAndUpdatesOutlinedIcon style={{ fontSize: "19px" }} />
              <p className="ml-3">Try Sector AI</p>
            </button>
          </div>
        </section>
      </section>
    </>
  );
}
