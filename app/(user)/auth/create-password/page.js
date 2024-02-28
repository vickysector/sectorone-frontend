"use client";

import Image from "next/image";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "@/app/_ui/Tooltip.css";
import { useState } from "react";
import clsx from "clsx";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const toggleShowPasswordVisibility = () => {
    setShowPassword((prevPasswordState) => !prevPasswordState);
  };
  const toggleShowRetypePasswordVisibility = () => {
    setShowRetypePassword((prevPasswordState) => !prevPasswordState);
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
            <div className="bg-input-container relative has-tooltip">
              <input
                type={showPassword ? "text" : "password"}
                className=" w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
                placeholder="Password"
              />
              <span
                className={`tooltip  bg-white absolute top-[100%] left-0 shadow-lg w-[60%] p-3 rounded-md`}
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
            <div className=" mt-4 text-right relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                className="  w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
                placeholder="Retype password"
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

            <div className="mt-4 mb-8 ">
              <label htmlFor="agreements" className="flex items-center mr-1.5">
                <input
                  type="checkbox"
                  name=""
                  id="agreements"
                  value="I agree to the Terms & Conditions and Privacy Policy"
                  className="accent-primary-base bg-white text-Base-normal"
                />
                <p className="text-Base-normal ml-1.5 text-text-description">
                  I agree to the Terms & Conditions and Privacy Policy
                </p>
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
