"use client";

import Image from "next/image";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "@/app/_ui/Tooltip.css";
import "@/app/_ui/CheckboxCustom.css";
import { useState, useRef } from "react";
import clsx from "clsx";

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

  const checkPasswordRequirements = (password) => {
    const minLength = 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(
      password
    );
    const isLengthValid = password.length >= minLength;

    return isLengthValid && hasNumberOrSymbol;
  };

  const calculatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    // Assign scores based on different criteria
    const lengthScore = Math.min(password.length / minLength, 1);
    const uppercaseScore = hasUppercase ? 1 : 0;
    const lowercaseScore = hasLowercase ? 1 : 0;
    const numberScore = hasNumber ? 1 : 0;
    const symbolScore = hasSymbol ? 1 : 0;

    // Calculate the overall strength as the average of individual scores
    const overallStrength =
      lengthScore + uppercaseScore + lowercaseScore + numberScore + symbolScore;

    return overallStrength;
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

  console.log(retypePassword.length);
  console.log("password match error : ", passwordMatchError);

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
                  !checkPasswordRequirements(password) ? "block" : "hidden"
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
                checkPasswordRequirements(password) ? "block" : "hidden"
              )}
            >
              <div className="w-[85%] h-3 bg-[#0000000F] rounded-lg">
                <div
                  className={clsx(
                    " h-3 rounded-lg ",
                    calculatePasswordStrength(password) === 1 &&
                      "w-[20%] bg-red-500",
                    calculatePasswordStrength(password) === 2 &&
                      "w-[40%] bg-red-300",
                    calculatePasswordStrength(password) === 3 &&
                      "w-[60%] bg-orange-400",
                    calculatePasswordStrength(password) === 4 &&
                      "w-[80%] bg-blue-600",
                    calculatePasswordStrength(password) === 5 &&
                      "w-[100%] bg-success"
                  )}
                ></div>
              </div>
              <p
                className={clsx(
                  calculatePasswordStrength(password) === 1 && " text-red-500",
                  calculatePasswordStrength(password) === 2 && " text-red-300",
                  calculatePasswordStrength(password) === 3 &&
                    " text-orange-400",
                  calculatePasswordStrength(password) === 4 && " text-blue-600",
                  calculatePasswordStrength(password) === 5 && " text-success"
                )}
              >
                {calculatePasswordStrength(password) === 1 && "Bad"}
                {calculatePasswordStrength(password) === 2 && "Weak"}
                {calculatePasswordStrength(password) === 3 && "Medium"}
                {calculatePasswordStrength(password) === 4 && "Good"}
                {calculatePasswordStrength(password) === 5 && "Strong"}
              </p>
            </div>
            <div className=" mt-4 text-right relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                className={clsx(
                  "  w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal",
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
              className="cursor-pointer w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal text-text-disabled"
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
