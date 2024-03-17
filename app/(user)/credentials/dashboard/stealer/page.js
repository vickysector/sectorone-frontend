"use client";

import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import ChartBarVerticalStealer from "@/app/_ui/components/charts/ChartBarVerticalStealer";
import { Select, ConfigProvider, Pagination, DatePicker } from "antd";
import Image from "next/image";
import clsx from "clsx";
import { EyeOutlined, BookOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const dataSource = [
  {
    id: 1,
    date: "27/12/2023 02:23",
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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
    malware: "Redline",
    devices: "DEKSTOP-JA6HR45",
    path: `C:\\Users\\yasin\\Documents\\MinorPolicy\\RBKsn8K9
    ZUwyhuRoWbSX77gL.exe`,
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

export default function StealerUserPage() {
  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-4">Stealer</h1>
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
        </div>
      </section>
      <section className="mt-8">
        <h1 className="text-heading-4 text-black ">Total Stealer</h1>
        <div className="p-8 bg-white border-input-border border-2 mt-4 rounded-[16px]">
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: "#F7F7F7",
                colorBorder: "#D5D5D5",
                colorText: "#000000E0",
                fontWeightStrong: true,
              },
              components: {
                Select: {
                  optionActiveBg: "#F7F7F7",
                  optionSelectedBg: "#FFEBD4",
                },
              },
            }}
          >
            <Select
              defaultValue="all"
              style={{ width: 91 }}
              // onChange={handleChange}
              options={[
                { value: "all", label: "All time" },

                { value: "malware", label: "Malware" },
              ]}
            />

            <Select
              defaultValue="all"
              style={{ width: 200 }}
              // onChange={handleChange}
              options={[
                { value: "all", label: "All (Employee & User)" },
                { value: "user", label: "User" },
                { value: "employee", label: "Emlpoyee" },
              ]}
              className="ml-8"
            />
          </ConfigProvider>
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-8 flex justify-center items-center w-full relative">
            <ChartBarVerticalStealer />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-heading-4 text-black">
          Total device compromised: 100
        </h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8">
            <OutlineButton
              isActive={true}
              total={100}
              value={"Data compromise "}
            />
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
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                    )}
                    placeholder={"Search by Malware/Devices name"}
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
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: "#F7F7F7",
                        colorBorder: "#D5D5D5",
                        colorText: "#000000E0",
                        fontWeightStrong: true,
                        colorPrimary: "#FF6F1E",
                        lineWidth: 2,
                      },
                      components: {
                        DatePicker: {
                          cellHeight: 20,
                          cellWidth: 32,
                          hoverBorderColor: "#FF6F1E",
                          cellActiveWithRangeBg: "#FFEBD4",
                          cellRangeBorderColor: "#FFD3A8",
                          activeBorderColor: "#FFEBD4",
                        },
                      },
                    }}
                  >
                    <RangePicker
                      renderExtraFooter={() => "extra footer"}
                      // onChange={handleRangePicker}
                      className="ml-8"
                      size="large"
                    />
                  </ConfigProvider>
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
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Date added
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Malware
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Devices name
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[400px]">
                      Path malware
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
                      <td className="py-[19px] px-[16px]"> {data.malware} </td>
                      <td className="py-[19px] px-[16px]"> {data.devices} </td>
                      <td className="py-[19px] px-[16px] max-w-[400px]">
                        {" "}
                        {data.path}{" "}
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