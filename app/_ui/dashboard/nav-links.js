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
    name: "Executive protection",
    href: "/credentials/dashboard/executive-protections",
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
              }
            )}
          >
            <LinkIcon
              className="link-icon"
              style={{
                fontSize: "18px",
                color: pathname === link.href && "#fff",
              }}
            />
            <p
              className={clsx(
                "ml-3  text-LG-normal hover:text-white text-left flex-grow text-nowrap",
                {
                  "text-white text-LG-strong": pathname === link.href,
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
