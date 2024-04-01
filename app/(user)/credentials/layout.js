"use client";

import Sidenav from "@/app/_ui/dashboard/Sidenav";
import Image from "next/image";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect } from "next/navigation";
import { LogoutOutlined } from "@ant-design/icons";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { LoadingSpin } from "@/app/_ui/components/utils/LoadingSpin";
import { PrimaryButton } from "@/app/_ui/components/buttons/PrimaryButton";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import { useSelector, useDispatch } from "react-redux";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";

export default function DashboardLayout({ children }) {
  const [hide, setHide] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [errorLogout, setErrorLogout] = useState(false);
  const [usersData, setUsersData] = useState();
  const [sessionExpired, setSessionExpired] = useState();
  const [isUrlListSelected, setIsUrlListSelected] = useState(false);
  const [idDomainUrl, setIdDomainUrl] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [reloadChange, setReloadChange] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const changeUrlState = useSelector((state) => state.changeUrl.status);
  const UrlsList = useSelector((state) => state.chooseUrl.urlData);

  // Start of: Checking Users Credentials

  const CredentialsEmail = getCookie("email_credentials");
  const CredentialsAccess_Token = getCookie("access_token");
  const CredentialsRefresh_Token = getCookie("refresh_token");

  // End of: Checking Users Credentials

  const toggleHideIcon = () => {
    setHide((prevState) => !prevState);
  };

  const handleChangeUrlClose = () => {
    dispatch(setChangeUrl(false));
  };

  // Start of: Update Domain

  const handleUrlListSelected = (domain) => {
    if (getCookie("user_identifier") != domain) {
      setIsUrlListSelected(true);
      setIdDomainUrl(domain);
      console.log("domain: ", domain);
    }
  };

  const handleUrlListCancel = () => {
    setIdDomainUrl("");
    setIsUrlListSelected(false);
  };

  const handleUrlListYes = () => {
    UpdateDomain();
    if (reloadChange) {
      window.location.reload();
    }
  };

  const UpdateDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${CredentialsAccess_Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_domain: idDomainUrl,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data.Severity === "ERROR") {
        DeleteCookies();
        RedirectToLogin();
      }
      setReloadChange(true);
    } catch (error) {
    } finally {
    }
  };

  // End of: Update Domain

  // Start of: Handle Logout

  const toggleAccount = () => {
    setAccountShow((prevState) => !prevState);
  };

  const Logout = async () => {
    try {
      setLogoutLoading(true);
      const res = await fetch(`${APIDATAV1}logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${CredentialsAccess_Token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("");
      }

      const data = await res.json();

      if (data.success) {
        DeleteCookies();
        router.push("/auth/login");
      }
    } catch (error) {
      setErrorLogout(true);
      setTimeout(() => {
        setErrorLogout(false);
      }, 3000);
    } finally {
      setLogoutLoading(false);
    }
  };

  // End of: Handle Logout

  // Start of: Handle Get Users and Get ID Users.

  const getUsersData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}setting/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setUsersData(data.data.email);
    } catch (error) {
    } finally {
    }
  };

  const getUserDomain = async () => {
    try {
      const res = await fetch(`${APIDATAV1}domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setCookie("user_identifier", data.data.id_domain);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getUsersData();
    getUserDomain();
  }, []);

  // End of: Handle Get Users and Get ID Users.

  // Start of: Refresh Token

  const getRefreshToken = async () => {
    try {
      const res = await fetch(`${APIKEY}refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: "app_secret!!!",
        },
      });

      console.log("refresh token res: ", res);

      if (res.status === 401 || res.status === 403 || res.status === 400) {
        setSessionExpired(true);
        setTimeout(() => {
          setSessionExpired(false);
          DeleteCookies();
          router.push("/auth/login");
        }, 7000);
      }

      const data = await res.json();

      deleteCookie("access_token");
      setCookie("access_token", data.data.access_token);

      console.log("refresh token data: ", data);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    const IntervalId = setInterval(() => {
      getRefreshToken();
    }, 15 * 60 * 1000);

    return () => clearInterval(IntervalId);
  }, []);

  // End of: Refresh Token

  useEffect(() => {
    if (
      !CredentialsEmail ||
      !CredentialsAccess_Token ||
      !CredentialsRefresh_Token
    ) {
      return redirect("/auth/login");
    }
  }, []);

  return (
    <main className="relative bg-input-container">
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center text-black ",
          isUrlListSelected ? "visible" : "hidden"
        )}
      >
        <div className={clsx("rounded-lg bg-white p-[28px] w-[35%] ")}>
          <h1 className="text-LG-strong mb-4">
            {" "}
            Are you sure change to this Domain?{" "}
          </h1>
          <p className="mb-6 text-text-description ">
            After change it will automatically refresh and load all data
            relevant to this domain
          </p>
          <div className="flex">
            <button
              className="bg-primary-base px-[20px] py-[8px] rounded-lg text-white"
              onClick={handleUrlListYes}
            >
              Yes
            </button>
            <button
              className="bg-white border-[1px] border-input-border px-[20px] py-[8px] rounded-lg ml-4"
              onClick={handleUrlListCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-40 flex items-center justify-center text-black",
          changeUrlState ? "visible" : "hidden"
        )}
      >
        <div className="w-[45%] bg-white rounded-lg p-[32px]  overflow-y-scroll max-h-[370px] ">
          <div className="flex justify-between border-b-[1px] pb-6 border-[#D5D5D5] ">
            <h1 className="text-LG-strong">URL list</h1>
            <CloseOutlined
              style={{ color: "#676767" }}
              onClick={handleChangeUrlClose}
            />
          </div>
          <div className="mt-6">
            <div className=" bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-full ">
              <input
                type="email"
                className={clsx(
                  " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                )}
                placeholder={"Search by URL"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="px-3 cursor-pointer">
                <Image
                  src={"/images/sector_image_search.svg"}
                  alt="search icon"
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <div className="mt-8">
              {UrlsList &&
                UrlsList.filter((data) =>
                  data.name_domain
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).map((data) => (
                  <div
                    className={clsx(
                      "flex justify-between items-center  hover:opacity-70 transition-all mt-6",
                      getCookie("user_identifier") == data.id_domain
                        ? "cursor-not-allowed opacity-75"
                        : "cursor-pointer"
                    )}
                    key={data.id_domain}
                    onClick={() => handleUrlListSelected(data.id_domain)}
                  >
                    {" "}
                    <h1 className="text-Base-normal">
                      {data.name_domain}
                    </h1>{" "}
                    <p
                      className={clsx(
                        "bg-primary-base rounded-lg px-[20px] py-[3px] text-white",
                        getCookie("user_identifier") == data.id_domain
                          ? "visible"
                          : "hidden"
                      )}
                    >
                      Active
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center",
          sessionExpired ? "visible" : "hidden"
        )}
      >
        <div className="bg-white p-[32px] rounded-lg w-[30%]">
          <h1 className="text-LG-strong ">User session expired</h1>
          <p className="text-Base-normal text-text-description mt-[12px]">
            You have been logged out. if you still operating this site you must
            re-Login
          </p>
          <p className="text-Base-strong text-primary-base mt-6">
            You will automatically redirected to Login Page or You can
            immedieately to Login Page by Clicking the button below
          </p>
          <div className="mt-8 flex justify-end ">
            <div>
              <PrimaryButton value={"Login"} href={"/auth/login"} />
            </div>
          </div>
        </div>
      </div>

      <div className={clsx(logoutLoading ? "visible" : "hidden")}>
        <LoadingSpin />
      </div>
      <nav className="py-1.5 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-10 bg-white">
        <Image
          src={"/images/sector_logo.png"}
          alt="Logo Sector"
          width={92}
          height={38}
        />
        <div className="flex items-center">
          <div className="cursor-pointer">
            <Image
              src={"/images/sector_notification.svg"}
              alt="Notif"
              width={22}
              height={22}
              className="mr-5"
            />
          </div>
          <div className="cursor-pointer" onClick={toggleAccount}>
            <Image
              src={"/images/sector_avatar.svg"}
              alt="Avatar Profile"
              width={28}
              height={28}
            />
          </div>
          <div
            className={clsx(
              "fixed right-[48px] top-[50px] bg-white p-[32px] shadow-xl rounded-2xl transition-all ",
              accountShow ? "visible" : "hidden"
            )}
          >
            <p className="text-heading-4"> {usersData && usersData} </p>
            <div className="w-full h-[1px] bg-input-border my-[24px]"></div>
            <div className="flex items-center cursor-pointer" onClick={Logout}>
              <div>
                <Image
                  src={"/images/image_logout.svg"}
                  alt="Avatar Profile"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-error ml-[8px]">Log out of account</p>
            </div>
          </div>
        </div>
      </nav>
      <section className="bg-input-container flex relative">
        <div
          className={clsx(
            "fixed top-[50px] left-[50%] translate-x-[-50%] bg-white p-[20px] shadow-lg transition-all",
            errorLogout ? "visible" : "hidden"
          )}
        >
          <h1 className="text-text-description ">
            Oops ada keslaahan saat Logout
          </h1>
        </div>
        <aside
          className={clsx(
            " h-auth-screen  flex-none transition-all fixed left-0 bottom-0 bg-white z-10 border-r-2 border-r-input-border ",
            hide ? "w-[102px]" : "w-[260px] overflow-x-hidden overflow-y-hidden"
          )}
        >
          {/* <div className="mt-2 flex justify-end mr-5">
            <MenuFoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "hidden" : "visible"
              )}
              onClick={toggleHideIcon}
            />
            <MenuUnfoldOutlined
              style={{ fontSize: "20px" }}
              className={clsx(
                "cursor-pointer mt-3",
                hide ? "visible" : "hidden"
              )}
              onClick={toggleHideIcon}
            />
          </div> */}
          <Sidenav />
          <div
            className={clsx(
              "bg-white border-2 border-input-border w-[38px] h-[38px] rounded-full fixed top-[208px] transition-all z-10 flex items-center justify-center cursor-pointer",
              hide ? "left-[87px]" : "left-[240px]"
            )}
            onClick={toggleHideIcon}
          >
            <LeftOutlined
              style={{ fontSize: "16px" }}
              className={clsx("cursor-pointer", hide ? "hidden" : "visible")}
            />
            <RightOutlined
              style={{ fontSize: "16px" }}
              className={clsx("cursor-pointer", hide ? "visible" : "hidden")}
            />
          </div>
        </aside>
        <div
          className={clsx(
            "flex-grow min-h-screen h-full  min-w-screen w-full fixed bg-input-container left-0 right-0 overflow-y-auto  pt-[75px] transition-all pr-[32px] pb-[64px]",
            hide ? "pl-[130px]" : "pl-[290px]"
          )}
        >
          {children}
        </div>
      </section>
    </main>
  );
}
