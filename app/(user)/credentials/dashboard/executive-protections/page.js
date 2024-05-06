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
import { Alert, Space } from "antd";
import clsx from "clsx";
import Image from "next/image";
import { setLeakedData } from "@/app/_lib/store/features/ExecutiveProtections/LeakedDataSlices";

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

export default function ExecutiveProtections() {
  const [email, setEmail] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  // const [isEmailVerified, setIsEmailVerified] = useState(
  //   hasCookie("scanned_verified")
  // );

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

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleScanNow = () => {
    if (canSend) {
      dispatch(setIsScanNow(true));
      dispatch(setScannedEmail(email));
      dispatch(setCallScannedEmailFunctions(callSendOtpScannedEmail));
    }
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

      if (res.status === 400) {
        setIsErrorEmail(true);
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
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
        deleteCookie("scanned_user");
        deleteCookie("scanned_email");
        deleteCookie("scanned_verified");
        return res;
      }

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data executive: ", data);

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

      if (data.List["No results found"].Data.length === 0) {
        dispatch(setLeakedData([]));
        return res;
      } else {
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const callGetDetailLeakedData = async () => {
    await fetchWithRefreshToken(fetchGetDetailLeakedData, router, dispatch);
  };

  // useEffect(() => {
  //   callGetDetailLeakedData();
  // }, [isEmailVerified]);

  useEffect(() => {
    if (isEmailVerified) {
      callGetDetailLeakedData();
      setEmail(scannedEmail);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsErrorEmail(false);
    }, 4000);
  }, [isErrorEmail]);

  return (
    <main>
      <section className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[96px] relative ">
        <Alert
          message="Email is not valid"
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
          <div className="flex text-center justify-center items-center">
            <input
              type="text"
              className="rounded-md px-3 py-[5px] border-input-border border-2 w-[50%] text-LG-normal text-black"
              placeholder="name@mail.com"
              value={email}
              onChange={handleChangeEmail}
            />
            <div className="ml-4">
              <AuthButton
                value={"Scan now"}
                agreements={canSend}
                onClick={handleScanNow}
              />
            </div>
          </div>
        </div>
      </section>
      <section
        className={clsx(
          "flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[64px] mt-8 ",
          // hasCookie("scanned_verified") &&
          //   getCookie("scanned_verified") === "true"
          //   ? "hidden"
          //   : "visible"
          !isEmailVerified && !scannedEmail ? "visible" : "hidden"
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
          "flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[64px] mt-8 ",
          // hasCookie("scanned_verified") &&
          //   getCookie("scanned_verified") === "true"
          //   ? "visible"
          //   : "hidden"
          isEmailVerified && dataLeaked.length !== 0 ? "visible" : "hidden"
        )}
      >
        <h1 className="text-heading-4 text-black">Results of your data leak</h1>
        <h2 className="text-Base-normal text-text-description mt-3 max-w-[450px]">
          Get details on data breaches that leak your info on the dark web. See
          how you can become more secure based on each result.
        </h2>
      </section>
      <section
        className={clsx(
          "flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[64px] mt-8 ",
          // hasCookie("scanned_verified") &&
          //   getCookie("scanned_verified") === "true"
          //   ? "visible"
          //   : "hidden"
          isEmailVerified && dataLeaked.length === 0 ? "visible" : "hidden"
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
    </main>
  );
}
