"use client";

import Image from "next/image";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "@/app/_ui/Tooltip.css";
import "@/app/_ui/CheckboxCustom.css";
import { useState, useRef } from "react";
import clsx from "clsx";
import { CheckPasswordRequirements } from "@/app/_lib/PasswordRequirements";
import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import Password from "@/app/_ui/components/inputs/Password";
import Link from "next/link";
import { APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie } from "cookies-next";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const router = useRouter();

  const toggleShowPasswordVisibility = () => {
    setShowPassword((prevPasswordState) => !prevPasswordState);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`${APIKEY}auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          Authorization: "app_secret!!!",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false || !data.data) {
        throw new Error(data.message);
      }

      setCookie("access_token", data.data.access_token);

      PushToQrCode();
    } catch (error) {
      setIsError(true);
      setErrorMessage("Incorrect Email or Password. Please Try Again!");
      setTimeout(() => {
        setIsError(false);
      }, 5000);
    } finally {
      setLoading(false);
    }

    setPassword("");
    setEmail("");
  };

  const PushToQrCode = async () => {
    try {
      setLoadingQr(true);

      const res = await fetch(`${APIKEY}register/2fa`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.data === null) {
        router.push("/auth/verification-login/2fa-verification");
        return;
      }
      if (data.data !== null) {
        router.push("/auth/verification-login/scan-qr-code");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQr(false);
    }
  };

  const canSumbit = password && email;

  return (
    <main className="h-auth-screen -500 flex relative">
      <div className={clsx(loading || loadingQr ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full relative ">
        <div className="">
          <h1 className="text-heading-1 w-[80%]">
            Securing your digital world
          </h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            Welcome back, please login to your account.
          </p>

          <form action="">
            <div className="bg-input-container relative ">
              <input
                type="email"
                className={clsx(
                  " w-full bg-input-container py-1.5 px-3  border-2 rounded-lg text-Base-normal border-input-border"
                )}
                placeholder={"Email"}
                onChange={handleEmailChange}
                value={email}
              />
              {/* <p className="text-Base-normal text-error mt-2 ">
                Incorrect Email. Please Try Again{" "}
              </p> */}
            </div>
            <div className="mt-4 mb-8">
              <div className="  text-right relative ">
                <Password
                  showPassword={showPassword}
                  value={password}
                  toggleShowIcon={toggleShowPasswordVisibility}
                  onChange={handlePasswordChange}
                  hasTooltip={false}
                  placeholder={"Password"}
                />
              </div>
              {/* <p className="text-Base-normal text-error mt-2 ">
                Incorrect Password. Please Try Again{" "}
              </p> */}
            </div>

            <AuthButton
              agreements={canSumbit}
              value={"Login"}
              onClick={handleSubmit}
            />
          </form>
          <div className="flex items-center mt-4 justify-between">
            <a href="#" className="block text-text-description text-LG-normal">
              Need help?
            </a>
            <Link
              href="/auth/reset-password"
              className="block text-LG-normal text-primary-base"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[10%] left-[19%]">
          <p className="text-Base-normal text-text-description">
            &copy; 2024 Sector. All right reserved.
          </p>
        </div>
        <div
          className={clsx(
            "absolute left-[19%] top-[11%] bg-[#FFF1F0] py-2 px-8 text-Base-normal text-black rounded-lg shadow-lg",
            isError ? "visible" : "hidden"
          )}
        >
          {errorMessage}
        </div>
      </section>
      <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
        <Image
          src={"/images/sector_image_auth_login.svg"}
          width={640}
          height={640}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
