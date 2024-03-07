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

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [agreements, setAgreements] = useState(false);

  const toggleShowPasswordVisibility = () => {
    setShowPassword((prevPasswordState) => !prevPasswordState);
  };
  const toggleShowRetypePasswordVisibility = () => {
    setShowRetypePassword((prevPasswordState) => !prevPasswordState);
  };

  const { passwordRequirement } = CheckPasswordRequirements(password);
  const { overallStrength } = CalculatePasswordStrength(password);
  const { strength_1, strength_2, strength_3, strength_4, strength_5 } =
    GetCalculatePasswordStrengthByNumber(overallStrength);

  const strengths = {
    strength_1,
    strength_2,
    strength_3,
    strength_4,
    strength_5,
    passwordRequirement,
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Check if retype password matches after password change
    setPasswordMatchError(retypePassword !== newPassword);

    // TODO
    // setAgreements(!passwordMatchError);
  };

  const handleRetypePasswordChange = (e) => {
    const newRetypePassword = e.target.value;
    setRetypePassword(newRetypePassword);

    // Check if retype password matches after retype password change
    setPasswordMatchError(password !== newRetypePassword);

    // TODO
    // setAgreements(!retypePassword);
  };

  // TODO
  // const handleAgreements = (e) => {
  //   // setAgreements((prevState) => !prevState);
  //   setAgreements(
  //     !passwordMatchError && password.length > 8 && retypePassword.length > 8
  //   );
  // };

  // console.log("agreements", agreements);

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

          <h1 className="text-heading-2 text-black mb-4">Create password</h1>
          <p className="text-text-description text-LG-normal mb-8">
            Your new password must be different from previous  used passwords.
          </p>
          <div className="bg-input-container relative w-full text-left">
            <Password
              showPassword={showPassword}
              value={password}
              toggleShowIcon={toggleShowPasswordVisibility}
              isPasswordFocused={isPasswordFocused}
              passwordRequirement={passwordRequirement}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              hasTooltip={true}
              passwordMatchError={false}
              placeholder={"New password"}
            />
          </div>
          <ProgressBar data={strengths} />
          <div className=" mt-4 text-left relative w-full ">
            <Password
              showPassword={showRetypePassword}
              value={retypePassword}
              toggleShowIcon={toggleShowRetypePasswordVisibility}
              onChange={handleRetypePasswordChange}
              hasTooltip={false}
              passwordMatchError={passwordMatchError}
              placeholder={"Re-confirm password"}
            />
          </div>
          <div className="w-full mt-2 text-left">
            <p
              className={clsx(
                "text-Base-normal text-error",
                passwordMatchError ? "block" : "hidden",
                retypePassword.length === 0 ? "hidden" : "block"
              )}
            >
              Pasword do not match. Please try again.
            </p>
          </div>
          <div className="w-full m-8">
            <AuthButton value={"Reset password"} agreements={agreements} />
          </div>
        </div>
      </div>
    </main>
  );
}
