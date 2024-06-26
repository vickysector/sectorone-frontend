"use client";

import Image from "next/image";
import clsx from "clsx";
import { RightOutlined } from "@ant-design/icons";
import Menu from "@/app/_ui/components/accounts-menu/Menu";
import { useSelector, useDispatch } from "react-redux";
import { setDocumentationSectorApiStatus } from "@/app/_lib/store/features/Accounts/DocumentationSlices";

const documentation = {
  title: "Sector API(s)",
  description:
    "Sector API Connect is a full lifecycle API management solution that uses an intuitive experience to help consistently create, manage, secure, socialize and APIs, helping power digital transformation on premises and across security.",
  imageLink: "images/sector_accounts_documentation.svg",
  href: "#",
};

const changePassword = {
  title: "Change password",
  description: "Last changed 01 Jan 2023",
  imageLink: "images/sector_accounts_change-password.svg",
  href: "/accounts/manage-accounts/reset-password",
};

export default function SettingsUserPage() {
  const dispatch = useDispatch();

  const handleOpenDocumentation = () => {
    dispatch(setDocumentationSectorApiStatus(true));
  };

  return (
    <main>
      <section>
        <h1 className="text-black text-heading-2">Settings</h1>
        <section className="bg-white rounded-lg p-8 mt-8">
          <section>
            <h1 className="text-heading-4 text-black">Documentation</h1>
            <div className="mt-4">
              <Menu data={documentation} onClick={handleOpenDocumentation} />
            </div>
          </section>
          <section className="mt-8">
            <h1 className="text-black text-heading-4">Account</h1>
            <div className="mt-4">
              <Menu data={changePassword} />
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
