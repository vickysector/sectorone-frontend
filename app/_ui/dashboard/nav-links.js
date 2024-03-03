"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import "./nav-links.css";
import {
  SafetyOutlined,
  LineChartOutlined,
  BugOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const links = [
  {
    name: "Overview",
    href: "/credentials/dashboard",
    icon: LineChartOutlined,
  },
  {
    name: "Compromised",
    href: "/credentials/dashboard/compromised",
    icon: SafetyOutlined,
  },
  {
    name: "Stealer",
    href: "/credentials/dashboard/stealer",
    icon: BugOutlined,
  },
  {
    name: "Activity Log",
    href: "/credentials/dashboard/activity-log",
    icon: HistoryOutlined,
  },
  {
    name: "Settings",
    href: "/credentials/dashboard/manage-accounts",
    icon: SettingOutlined,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center mb-4 py-3 px-8 text-center hover:bg-primary-base text-text-description hover:text-white",
              {
                "bg-primary-base text-white": pathname === link.href,
              }
            )}
          >
            <LinkIcon
              className="link-icon"
              style={{
                fontSize: "24px",
                color: pathname === link.href ? "#fff" : "#676767",
              }}
            />
            <p
              className={clsx("ml-4  text-LG-normal hover:text-white", {
                "text-white text-LG-strong": pathname === link.href,
              })}
            >
              {" "}
              {link.name}{" "}
            </p>
          </Link>
        );
      })}
    </>
  );
}
