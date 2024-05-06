"use client";

import {
  CalculatePasswordStrength,
  GetCalculatePasswordStrengthByNumber,
} from "@/app/_lib/CalculatePassword";
import { CheckPasswordRequirements } from "@/app/_lib/PasswordRequirements";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Password from "@/app/_ui/components/inputs/Password";
import { ProgressBar } from "@/app/_ui/components/utils/ProgressBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import { SecondaryButton } from "@/app/_ui/components/buttons/SecondaryButton";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { useRouter, redirect } from "next/navigation";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useSelector, useDispatch } from "react-redux";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";

export default function ResetPasswordPage() {
  const [agreements, setAgreements] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFound, setEmailFound] = useState(false);

  const scannedEmail = useSelector((state) => state.scanEmail.scannedEmail);

  const handleOtp = (e) => {
    setEmail(e.target.value);
  };

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmitOtp = () => {
    callSendOtpScannedEmail();
  };

  const fetchSendOtpScannedEmail = async () => {
    try {
      setLoading(true);

      //   if (!filterApplied && (keyword || startDate || endDate)) {
      //     setPage(1);
      //     setFilterApplied(true);
      //   }

      const res = await fetch(`${APIDATAV1}validate/protection`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: getCookie("scanned_user"),
          code: email,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();
      console.log("data send otp: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        // dispatch(setScannedId(data.data.id));
        // dispatch(setScannedEmail(data.data.search));
        // setCookie("scanned_user", data.data.id);
        // setCookie("scanned_email", data.data.search);
        deleteCookie("scanned_user");
        deleteCookie("scanned_email");
        router.push("/credentials/dashboard/executive-protections");

        return res;
      }
    } catch (error) {
      setError(true);
      setErrorMessage("OTP is Not Valid");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const callSendOtpScannedEmail = async () => {
    await fetchWithRefreshToken(fetchSendOtpScannedEmail, router, dispatch);
  };

  useEffect(() => {
    if (!getCookie("access_token") || !getCookie("refresh_token")) {
      // router.push("/credentials/dashboard");
      return redirect("/auth/login");
    }
  }, []);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className={clsx(loading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      {/* <div className={clsx(emailFound ? "visible" : "hidden")}>
        <div className="fixed top-0 left-0 bottom-[0] right-0 z-20 bg-[#000000B2] flex items-center justify-center">
          <div className="bg-white rounded-lg p-[32px]">
            <h1 className="text-LG-strong">Enter security code</h1>
            <p className="text-Base-normal text-text-description mt-[30px] w-[85%]">
              Instructions to reset your password have been sent to:
            </p>
            <h2 className="text-Base-strong my-2">{email}</h2>
            <p className="text-Base-normal text-text-description mb-2">
              If you don’t receive it, Please contact support
            </p>
            <div className="flex mt-10 justify-end">
              <div>
                <SecondaryButton value={"Cancel"} href={"/auth/login"} />
              </div>
              <div className="ml-2 items-center">
                <PrimaryButton value={"Done"} href={"/auth/login"} />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-white w-[50%] py-[40px] px-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[80%] mx-auto">
          <Image
            src={"/images/SectorOne.png"}
            alt="Logo Sector"
            width={92}
            height={38}
          />

          <Image
            src={"/images/sector_image_auth_lock.svg"}
            alt="Logo Sector"
            width={200}
            height={200}
          />

          <h1 className="text-heading-2 text-black mb-4">
            Enter security code
          </h1>
          <p className="text-text-description text-LG-normal mb-8">
            We sent a code to{" "}
            <span className="text-LG-strong text-black">
              {getCookie("scanned_email")}
            </span>
          </p>
          <div className="w-full">
            <div className="bg-input-container w-full relative ">
              <input
                type="password"
                className={clsx(
                  " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal ",
                  error ? "border-error outline-error" : "border-input-border"
                )}
                placeholder={"Input OTP"}
                value={email}
                onChange={handleOtp}
              />
            </div>
            <p
              className={clsx(
                "text-Base-normal text-error mt-2 text-left",
                error ? "visible" : "hidden"
              )}
            >
              {errorMessage}
            </p>
          </div>

          <div className="w-full m-8">
            <AuthButton
              value={"Validate"}
              agreements={email}
              onClick={handleSubmitOtp}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
