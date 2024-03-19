"use client";

import Sidenav from "@/app/_ui/dashboard/Sidenav";
import Image from "next/image";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import clsx from "clsx";

export default function DashboardLayout({ children }) {
  const [hide, setHide] = useState(false);

  const toggleHideIcon = () => {
    setHide((prevState) => !prevState);
  };

  return (
    <main className="relative bg-input-container">
      <nav className="py-1.5 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-10 bg-white">
        <Image
          src={"/images/sector_logo.png"}
          alt="Logo Sector"
          width={92}
          height={38}
        />
        <div className="flex items-center">
          <Image
            src={"/images/sector_notification.svg"}
            alt="Notif"
            width={22}
            height={22}
            className="mr-5"
          />
          <Image
            src={"/images/sector_avatar.svg"}
            alt="Avatar Profile"
            width={28}
            height={28}
          />
        </div>
      </nav>
      <section className="bg-input-container flex relative">
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
        </aside>
        <div
          className={clsx(
            "bg-white border-2 border-input-border w-[38px] h-[38px] rounded-full absolute top-[208px] transition-all z-10 flex items-center justify-center cursor-pointer",
            hide ? "left-[87px]" : "left-[15.9%]"
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
