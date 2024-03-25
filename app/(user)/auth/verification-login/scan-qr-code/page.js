"use client";

import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Password from "@/app/_ui/components/inputs/Password";
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";

export default function VerificaitonLogin() {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const toggleShowOtpVisibility = () => {
    setShowOtp((prevPasswordState) => !prevPasswordState);
  };

  const handleOtpChange = (e) => {
    const newPassword = e.target.value;
    setOtp(newPassword);
  };

  const GetQRCode = async () => {
    try {
      setLoadingQr(true);

      const res = await fetch(`${APIKEY}register/2fa`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      console.log("after useeffect: ", data);
      setQrCode(data.data.qrcode);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    GetQRCode();
  }, []);

  return (
    <main className="h-auth-screen -500 flex relative">
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
        <div className="w-[65%]">
          <h1 className="text-heading-1 w-[80%]">Scan QR Code</h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            Use the google authenticator app to scan the QR code. This will pair
            the app with your account and generate your OTP.
          </p>

          <form action="">
            <div className="bg-input-container relative mb-8">
              <Password
                showPassword={showOtp}
                value={otp}
                toggleShowIcon={toggleShowOtpVisibility}
                onChange={handleOtpChange}
                hasTooltip={false}
                placeholder={"Input OTP"}
              />
            </div>

            <AuthButton value={"Verify"} />
          </form>
          <div className="flex items-center mt-4 justify-between">
            <a href="#" className="block text-text-description text-LG-normal">
              Need help?
            </a>
          </div>
        </div>

        <div className="absolute bottom-[10%] left-[9.5%]">
          <p className="text-Base-normal text-text-description">
            &copy; 2024 Sector. All right reserved.
          </p>
        </div>
      </section>
      <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
        <Image
          src={`data:image/png;base64,${qrCode}`}
          width={435}
          height={435}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
