"use client";

import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import "@/app/_ui/CheckboxCustom2.css";
import clsx from "clsx";
import Image from "next/image";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import { EyeOutlined, BookOutlined } from "@ant-design/icons";
import { Pagination, ConfigProvider } from "antd";
import { useState } from "react";

const dataSource = [
  {
    id: 1,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Weak",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Medium",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 3,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Strong",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 4,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Medium",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 5,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Medium",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 6,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Strong",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 7,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Medium",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 8,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Weak",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 9,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Weak",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
  {
    id: 10,
    date: "27/12/2023 02:23",
    url: "adminpanel.sector.co",
    login: "Example@mail.com",
    pass: "Pass1234",
    strength: "Weak",
    action: (
      <div className="flex">
        <div>
          <EyeOutlined style={{ fontSize: "18px" }} />
        </div>
        <div className="ml-auto mr-auto">
          <BookOutlined style={{ fontSize: "18px" }} />
        </div>
      </div>
    ),
  },
];

export default function CompromisedDashboard() {
  const [showDate, setShowDate] = useState(false);

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">Compromised</h1>
      <div className="bg-white  p-12 rounded-xl">
        <div className="flex items-center">
          <div className="h-[80px] w-[80px] bg-input-container "></div>
          <div className="ml-4">
            <h1 className="text-heading-3">URL name</h1>
            <h2 className="text-LG-strong text-text-description mt-2">
              Last update: 08 Jan 2023/02:00
            </h2>
          </div>
          <div className="flex flex-grow justify-end items-center">
            <ChangeUrlButton>Change URL</ChangeUrlButton>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          {dataOverview.map((data) => (
            <OverviewCard
              key={data.id}
              descriptions={data.desc}
              image={data.imageLink}
              total={data.total}
            />
          ))}
        </div>
      </div>
      <section className="mt-10">
        <h1 className="text-heading-4 text-black">Detail compromised</h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8 border-b-2 border-input-border ">
            <CompromiseButton isActive={true} total={300} value={"Employee"} />

            <CompromiseButton isActive={false} total={300} value={"User"} />

            <CompromiseButton
              isActive={false}
              total={100}
              value={"Third-party"}
            />

            <CompromiseButton isActive={false} total={100} value={"Device"} />
          </section>
          <section className="p-8">
            <OutlineButton
              isActive={true}
              total={100}
              value={"Data compromise "}
            />
            <OutlineButton isActive={false} total={100} value={"Validated "} />
            <OutlineButton isActive={false} total={100} value={"Bookmark "} />

            <div className="mt-8 ">
              <div className="flex items-center">
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="agreements"
                    value="I agree to the Terms & Conditions and Privacy Policy"
                    className=" text-Base-normal"
                  />
                  <label
                    htmlFor="agreements"
                    className="text-Base-normal ml-1.5 text-text-description"
                  ></label>
                </div>
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[470px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                    )}
                    placeholder={"Search by URL/Email"}
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
                <div className="ml-auto ">
                  <ExportButton />
                </div>
              </div>
            </div>
          </section>
          <section className="p-8">
            <div className="border-2 rounded-xl border-input-border">
              <table className="bg-white  w-full rounded-xl">
                <thead className="text-black text-Base-strong bg-[#00000005]">
                  <tr className="border-b-[1px] border-[#D5D5D5]">
                    <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                      No
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed flex justify-between">
                      Date compromised
                      <Image
                        alt="Sort by date"
                        width={8}
                        height={8}
                        src={"/images/sector_sort.svg"}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      URL
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Login
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Password
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Password strength
                    </td>
                    <td className="py-[19px] px-[16px]">Action</td>
                  </tr>
                </thead>
                <tbody className="text-Base-normal text-text-description">
                  {dataSource.map((data, index) => (
                    <tr
                      className="border-b-[2px] border-[#D5D5D5]"
                      key={data.id}
                    >
                      <td className="py-[19px] px-[16px]"> {index + 1} </td>
                      <td className="py-[19px] px-[16px]"> {data.date} </td>
                      <td className="py-[19px] px-[16px]"> {data.url} </td>
                      <td className="py-[19px] px-[16px]"> {data.login} </td>
                      <td className="py-[19px] px-[16px]"> {data.pass} </td>
                      <td className="py-[19px] px-[16px]">
                        {" "}
                        <p
                          className={clsx(
                            data.strength.toLowerCase() === "weak" &&
                              "text-pink",
                            data.strength.toLowerCase() === "medium" &&
                              "text-text-orange",
                            data.strength.toLowerCase() === "strong" &&
                              "text-text-green"
                          )}
                        >
                          {data.strength}
                        </p>{" "}
                      </td>
                      <td className="py-[19px] px-[16px]"> {data.action} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between my-[19px] mx-[16px]">
                <p className="text-Base-normal text-[#676767] ">
                  Showing 10 to 100 entries
                </p>
                <div>
                  <ConfigProvider
                    theme={{
                      components: {
                        Pagination: {
                          itemActiveBg: "#FF6F1E",
                          itemLinkBg: "#fff",
                          itemInputBg: "#fff",
                        },
                      },
                      token: {
                        colorPrimary: "white",
                      },
                    }}
                  >
                    <Pagination
                      type="primary"
                      defaultCurrent={1}
                      total={50}
                      showSizeChanger={false}
                      style={{ color: "#FF6F1E" }}
                    />
                  </ConfigProvider>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
