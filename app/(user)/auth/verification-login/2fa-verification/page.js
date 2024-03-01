"use client";

import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState, useRef } from "react";
import Password from "@/app/_ui/components/inputs/Password";

export default function FaAuthPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const toggleShowOtpVisibility = () => {
    setShowOtp((prevPasswordState) => !prevPasswordState);
  };

  const handleOtpChange = (e) => {
    const newPassword = e.target.value;
    setOtp(newPassword);
  };

  return (
    <main className="h-auth-screen -500 flex relative">
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
        <div className="w-[65%]">
          <h1 className="text-heading-1 w-[80%]">Enter verification code</h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            We notification you the four digit code to your 2FA account enter
            the code below to confirm your account.
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
          src={"/images/sector_2fa_auth_verif.svg"}
          width={500}
          height={500}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
