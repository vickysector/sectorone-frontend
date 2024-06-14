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
import SecurityIcon from "@mui/icons-material/Security";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import ScreenSearchDesktopOutlinedIcon from "@mui/icons-material/ScreenSearchDesktopOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";

const links = [
  {
    name: "Overview",
    href: "/credentials/dashboard",
    icon: InsertChartOutlinedIcon,
  },
  {
    name: "Compromised",
    href: "/credentials/dashboard/compromised",
    hrefDetail: "/credentials/dashboard/compromised/detail",
    icon: ScreenSearchDesktopIcon,
  },
  {
    name: "Stealer",
    href: "/credentials/dashboard/stealer",
    icon: CoronavirusIcon,
  },
  {
    name: "Executive protection",
    href: "/credentials/dashboard/executive-protections",
    hrefDetail: "/credentials/dashboard/executive-protections/detail",
    icon: SecurityIcon,
  },
  {
    name: "Search by keyword",
    href: "/credentials/dashboard/search-by-keyword",
    icon: ManageSearchOutlinedIcon,
  },
  {
    name: "Activity Log",
    href: "/credentials/dashboard/activity-log",
    icon: HistoryOutlinedIcon,
  },
  {
    name: "Settings",
    href: "/credentials/dashboard/manage-accounts",
    icon: SettingsApplicationsOutlinedIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center mb-4 py-1.5 px-2 text-center hover:bg-primary-base text-text-description hover:text-white overflow-hidden rounded-lg",
              {
                "bg-primary-base text-white": pathname === link.href,
              },
              {
                "bg-primary-base text-white": pathname.includes(
                  link.hrefDetail
                ),
              }
            )}
          >
            <LinkIcon
              className="link-icon"
              style={{
                fontSize: "20px",
                color: pathname === link.href && "#fff",
              }}
            />
            <p
              className={clsx(
                "ml-3  text-LG-normal hover:text-white text-left flex-grow text-nowrap",
                {
                  "text-white text-LG-strong": pathname === link.href,
                },
                {
                  "text-white text-LG-strong": pathname.includes(
                    link.hrefDetail
                  ),
                }
              )}
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
