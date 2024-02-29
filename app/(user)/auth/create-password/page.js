"use client";

import Image from "next/image";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "@/app/_ui/Tooltip.css";
import "@/app/_ui/CheckboxCustom.css";
import { useState, useRef } from "react";
import clsx from "clsx";
import {
  CalculatePasswordStrength,
  GetCalculatePasswordStrengthByNumber,
} from "@/app/_lib/CalculatePassword";
import { CheckPasswordRequirements } from "@/app/_lib/PasswordRequirements";

export default function Home() {
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
  };

  const handleRetypePasswordChange = (e) => {
    const newRetypePassword = e.target.value;
    setRetypePassword(newRetypePassword);

    // Check if retype password matches after retype password change
    setPasswordMatchError(password !== newRetypePassword);
  };

  const handleAgreements = (e) => {
    setAgreements((prevState) => !prevState);
  };

  return (
    <main className="h-auth-screen -500 flex relative">
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
        <div className="">
          <h1 className="text-heading-1">Create password</h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            To get started, let’s set up a strong password for your account
          </p>

          <form action="">
            <div className="bg-input-container relative ">
              <input
                type={showPassword ? "text" : "password"}
                className=" w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              <span
                className={clsx(
                  " z-10  bg-white absolute top-[100%] left-0 shadow-lg w-[60%] p-3 rounded-md",
                  isPasswordFocused ? "block" : "hidden",
                  !passwordRequirement ? "block" : "hidden"
                )}
              >
                <h1 className="text-Base-strong text-black mb-2.5">
                  Password requirements
                </h1>
                <p className="text-Base-normal text-black">
                  Password must have 8 character or longer. At least one number
                  or symbol (like !@#$%^)
                </p>
              </span>
              <EyeOutlined
                className={clsx(
                  "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
                  !showPassword ? "hidden" : "block"
                )}
                style={{ color: "#00000040" }}
                onClick={toggleShowPasswordVisibility}
              />
              <EyeInvisibleOutlined
                className={clsx(
                  "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
                  showPassword ? "hidden" : "block"
                )}
                style={{ color: "#00000040" }}
                onClick={toggleShowPasswordVisibility}
              />
            </div>
            <div
              className={clsx(
                "w-full flex items-center justify-between mt-3",
                passwordRequirement ? "block" : "hidden"
              )}
            >
              <div className="w-[85%] h-3 bg-[#0000000F] rounded-lg">
                <div
                  className={clsx(
                    " h-3 rounded-lg ",
                    strength_1 && "w-[20%] bg-red-500",
                    strength_2 && "w-[40%] bg-red-300",
                    strength_3 && "w-[60%] bg-orange-400",
                    strength_4 && "w-[80%] bg-blue-600",
                    strength_5 && "w-[100%] bg-success"
                  )}
                ></div>
              </div>
              <p
                className={clsx(
                  strength_1 && " text-red-500",
                  strength_2 && " text-red-300",
                  strength_3 && " text-orange-400",
                  strength_4 && " text-blue-600",
                  strength_5 && " text-success"
                )}
              >
                {strength_1 && "Bad"}
                {strength_2 && "Weak"}
                {strength_3 && "Medium"}
                {strength_4 && "Good"}
                {strength_5 && "Strong"}
              </p>
            </div>
            <div className=" mt-4 text-right relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                className={clsx(
                  "  w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal",
                  passwordMatchError && retypePassword.length !== 0
                    ? "border-error outline-error"
                    : "border-input-border"
                )}
                placeholder="Retype password"
                value={retypePassword}
                onChange={handleRetypePasswordChange}
              />
              <EyeOutlined
                className={clsx(
                  "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
                  !showRetypePassword ? "hidden" : "block"
                )}
                style={{ color: "#00000040" }}
                onClick={toggleShowRetypePasswordVisibility}
              />

              <EyeInvisibleOutlined
                className={clsx(
                  "absolute top-[50%] right-4 translate-y-[-50%] cursor-pointer",
                  showRetypePassword ? "hidden" : "block"
                )}
                style={{ color: "#00000040" }}
                onClick={toggleShowRetypePasswordVisibility}
              />
            </div>
            <div className="w-full mt-2">
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

            <div className="mt-4 mb-8 flex items-center mr-1.5">
              <input
                type="checkbox"
                name=""
                id="agreements"
                value="I agree to the Terms & Conditions and Privacy Policy"
                className=" text-Base-normal"
                checked={agreements}
                onChange={handleAgreements}
              />
              <label
                htmlFor="agreements"
                className="text-Base-normal ml-1.5 text-text-description"
              >
                I agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className={clsx(
                "cursor-pointer w-full  py-1.5 px-3  rounded-lg text-Base-normal ",
                !agreements
                  ? "cursor-not-allowed bg-input-container border-input-border border-2 text-text-disabled"
                  : "bg-primary-base border-2 border-primary-base text-white"
              )}
              disabled={!agreements}
            >
              Create Password
            </button>
          </form>
        </div>
        <div className="absolute bottom-[10%] left-[9.5%]">
          <p className="text-Base-normal text-text-description">
            &copy; 2024 Sector. All right reserved.
          </p>
        </div>
      </section>
      <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
        <Image
          src={"/images/sector_image_auth_lock.svg"}
          width={640}
          height={640}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
