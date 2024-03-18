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
import { useState } from "react";
import clsx from "clsx";

export default function ResetPasswordUserAfterLogin() {
  const [agreements, setAgreements] = useState(false);

  return (
    <main className="h-screen bg-input-container flex items-center justify-center">
      <div className="bg-white w-[50%] py-[40px] px-[110px]">
        <div className="text-center flex items-center justify-center flex-col w-[80%] mx-auto">
          <Image
            src={"/images/sector_logo.png"}
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

          <h1 className="text-heading-2 text-black mb-4">Reset password</h1>
          <p className="text-text-description text-LG-normal mb-8">
            If you’d like to change your password, enter your current passwords
            here.
          </p>
          <div className="bg-input-container w-full relative ">
            <input
              type="email"
              className={clsx(
                " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal border-input-border"
              )}
              placeholder={"Email"}
            />
          </div>

          <div className="w-full m-8">
            <AuthButton value={"Reset password"} agreements={agreements} />
          </div>
        </div>
      </div>
    </main>
  );
}
