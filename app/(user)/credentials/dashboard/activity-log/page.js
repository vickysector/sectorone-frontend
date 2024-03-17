"use client";

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
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Change password",
  },
  {
    id: 2,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Change password",
  },
  {
    id: 3,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Change password",
  },
  {
    id: 4,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Login",
  },
  {
    id: 5,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Logout",
  },
  {
    id: 6,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Logout",
  },
  {
    id: 7,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Login",
  },
  {
    id: 8,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Login",
  },
  {
    id: 9,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Logout",
  },
  {
    id: 10,
    date: "27/12/2023 02:23",
    devices: "DEKSTOP-JA6HR45",
    ip_address: `175.25.171.166`,
    description: "Logout",
  },
];
export default function ActivityLogUserPage() {
  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-8">Activity log</h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8">
            <div className=" ">
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
                    placeholder={"Search activity "}
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
              </div>
            </div>
          </section>
          <section className="p-8 mt-[-30px]">
            <div className="border-2 rounded-xl border-input-border">
              <table className="bg-white  w-full rounded-xl">
                <thead className="text-black text-Base-strong bg-[#00000005]">
                  <tr className="border-b-[1px] border-[#D5D5D5]">
                    <td className="py-[19px] px-[16px]  border-r-[1px] border-input-border border-dashed ">
                      No
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Date activity
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      Devices name
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                      IP address
                    </td>
                    <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed ">
                      Description
                    </td>
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
                      <td className="py-[19px] px-[16px]"> {data.devices} </td>
                      <td className="py-[19px] px-[16px]">
                        {" "}
                        {data.ip_address}{" "}
                      </td>
                      <td className="py-[19px] px-[16px]">
                        {" "}
                        {data.description}{" "}
                      </td>
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
            <p className="mt-4 text-Base-normal text-text-description">
              Activities that have been in the activity log for more than 90
              days will be automatically deleted.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}