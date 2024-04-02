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
import { Pagination, ConfigProvider, DatePicker } from "antd";
import { useEffect, useState } from "react";
import {
  setBreachesEmployee,
  setBreachesEmployeeAndUsers,
  setBreachesUsers,
  setIcon,
  setLastUpdateUsers,
  setUrl,
} from "@/app/_lib/store/features/Breaches/BreachesSlices";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";
import {
  DETAIL_COMPROMISED_COMPROMISE_DEVICES,
  DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE,
  DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY,
  DETAIL_COMPROMISED_COMPROMISE_USERS,
} from "@/app/_lib/variables/Variables";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import {
  CalculatePasswordStrengthWithReturnString,
  convertDateFormat,
} from "@/app/_lib/CalculatePassword";

// const dataSource = [
//   {
//     id: 1,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Weak",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 2,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Medium",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 3,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Strong",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 4,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Medium",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 5,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Medium",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 6,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Strong",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 7,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Medium",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 8,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Weak",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 9,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Weak",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
//   {
//     id: 10,
//     date: "27/12/2023 02:23",
//     url: "adminpanel.sector.co",
//     login: "Example@mail.com",
//     pass: "Pass1234",
//     strength: "Weak",
//     action: (
//       <div className="flex">
//         <div>
//           <EyeOutlined style={{ fontSize: "18px" }} />
//         </div>
//         <div className="ml-auto mr-auto">
//           <BookOutlined style={{ fontSize: "18px" }} />
//         </div>
//       </div>
//     ),
//   },
// ];

const { RangePicker } = DatePicker;

export default function CompromisedDashboard() {
  const [showDate, setShowDate] = useState(false);
  const [selectedButton, setSelectedButton] = useState(
    DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
  );
  const [dataSource, setDataSource] = useState();

  const dispatch = useDispatch();

  const domainUsers = useSelector((state) => state.chooseUrl.urlData);

  const breachesAll = useSelector((state) => state.breaches.breachesAll);

  const employeeBreaches = useSelector(
    (state) => state.breaches.breachesEmployee
  );

  const usersBreaches = useSelector((state) => state.breaches.breachesUsers);

  const urlBreaches = useSelector((state) => state.breaches.url);

  const iconBreaches = useSelector((state) => state.breaches.icon);

  const lastUpdate = useSelector((state) => state.breaches.lastUpdate);

  const handleChangeUrlOpen = (value) => {
    dispatch(setChangeUrl(true));
  };

  const handleRangePicker = (date, datestring) => {
    console.log("date : ", date);
    console.log("datestring: ", datestring);
  };

  const mapEmployeeData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_compromised),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div className="cursor-pointer">
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div className="ml-auto mr-auto cursor-pointer">
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapUsersData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_compromised),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div className="cursor-pointer">
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div className="ml-auto mr-auto cursor-pointer">
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapThirdPartyData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_compromised),
      url: item.url,
      login: item.login,
      pass: item.password,
      strength: CalculatePasswordStrengthWithReturnString(item.password)
        .strengthLabel,
      action: (
        <div className="flex">
          <div className="cursor-pointer">
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div className="ml-auto mr-auto cursor-pointer">
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  const mapDevicesData = (data) => {
    return data.map((item) => ({
      id: item.id,
      date: convertDateFormat(item.datetime_compromised),
      devices_name: item.computer_name,
      ip: item.ip,
      action: (
        <div className="flex">
          <div className="cursor-pointer">
            <EyeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div className="ml-auto mr-auto cursor-pointer">
            <BookOutlined style={{ fontSize: "18px" }} />
          </div>
        </div>
      ),
    }));
  };

  // Start of: Fetch Data compromised

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}compromised/employee`, {
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

      console.log("data employee: ", data);

      const mappedEmployeedata = mapEmployeeData(data.data);
      setDataSource(mappedEmployeedata);
    } catch (error) {
    } finally {
    }
  };

  const fetchUsersData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}compromised/users`, {
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

      const mappedUsersData = mapUsersData(data.data);
      setDataSource(mappedUsersData);
    } catch (error) {
    } finally {
    }
  };

  const fetchThirdPartyData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}compromised/thirdparty`, {
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

      const mappedThirdParty = mapThirdPartyData(data.data);
      setDataSource(mappedThirdParty);
    } catch (error) {
    } finally {
    }
  };

  const fetchDevicesData = async () => {
    try {
      const res = await fetch(`${APIDATAV1}compromised/devices`, {
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

      const mappedDevicesData = mapDevicesData(data.data);
      setDataSource(mappedDevicesData);
    } catch (error) {
    } finally {
    }
  };

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
  };

  console.log("selectedbutton ", selectedButton);

  useEffect(() => {
    // fetchEmployeeData();
    switch (selectedButton) {
      case DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE:
        fetchEmployeeData();
        break;
      case DETAIL_COMPROMISED_COMPROMISE_DEVICES:
        fetchDevicesData();
        break;
      // Add more cases for other buttons if needed
      case DETAIL_COMPROMISED_COMPROMISE_USERS:
        fetchUsersData();
        break;
      case DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY:
        fetchThirdPartyData();
        break;
      default:
        break;
    }
  }, [selectedButton]);

  // End of: Fetch Data compromised

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">Compromised</h1>
      <div className="bg-white  p-12 rounded-xl">
        <div className="flex items-center">
          <div className="h-[80px] w-[80px] bg-input-container ">
            <Image
              width={80}
              height={80}
              src={iconBreaches && iconBreaches}
              alt="Icon Logo Users"
              // style={{
              //   objectFit: "cover",
              //   backgroundSize: "cover",
              //   width: "100%",
              // }}
            />
          </div>
          <div className="ml-4">
            <h1 className="text-heading-3">{urlBreaches && urlBreaches}</h1>
            <h2 className="text-LG-strong text-text-description mt-2">
              {lastUpdate && lastUpdate}
            </h2>
          </div>
          <div className="flex flex-grow justify-end items-center">
            <ChangeUrlButton
              onClick={handleChangeUrlOpen}
              disabled={domainUsers && domainUsers.length > 1}
            >
              {domainUsers && domainUsers.length > 1 ? "Change URL" : "No Data"}
            </ChangeUrlButton>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <OverviewCard
            descriptions={"Corporate credentials found"}
            image={"/images/sector_image_magnifier.svg"}
            total={breachesAll && breachesAll}
          />
          <OverviewCard
            descriptions={"Employee compromised"}
            image={"/images/sector_image_location-like.svg"}
            total={employeeBreaches && employeeBreaches}
          />
          <OverviewCard
            descriptions={"User compromised"}
            image={"/images/sector_image_user-like.svg"}
            total={usersBreaches && usersBreaches}
          />
        </div>
      </div>
      <section className="mt-10">
        <h1 className="text-heading-4 text-black">Detail compromised</h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8 border-b-2 border-input-border ">
            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
              }
              total={300}
              value={"Employee"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE}
            />

            <CompromiseButton
              isActive={selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS}
              total={300}
              value={"User"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_USERS}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY
              }
              total={100}
              value={"Third-party"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY}
            />

            <CompromiseButton
              isActive={
                selectedButton === DETAIL_COMPROMISED_COMPROMISE_DEVICES
              }
              total={100}
              value={"Device"}
              onClick={handleButtonClick}
              nameData={DETAIL_COMPROMISED_COMPROMISE_DEVICES}
            />
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
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]">
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
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: "#F7F7F7",
                        colorBorder: "#D5D5D5",
                        colorText: "#000000E0",
                        fontWeightStrong: true,
                        colorPrimary: "#FF6F1E",
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
                      onChange={handleRangePicker}
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
                    {selectedButton ===
                      DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE ||
                    selectedButton === DETAIL_COMPROMISED_COMPROMISE_USERS ||
                    selectedButton ===
                      DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY ? (
                      <>
                        <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed">
                          Date compromised
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
                      </>
                    ) : (
                      <>
                        <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                          Date compromised
                        </td>
                        <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                          Devices name
                        </td>
                        <td className="py-[19px] px-[16px] border-r-[1px] border-input-border border-dashed w-[360px]">
                          IP address
                        </td>
                        <td className="py-[19px] px-[16px]">Action</td>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="text-Base-normal text-text-description">
                  {dataSource &&
                    dataSource.map((data, index) => (
                      <tr
                        className="border-b-[2px] border-[#D5D5D5]"
                        key={data.id}
                      >
                        <td className="py-[19px] px-[16px]"> {index + 1} </td>
                        {selectedButton ===
                          DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE && (
                          <>
                            <td className="py-[19px] px-[16px]">{data.date}</td>
                            <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                              {data.url}
                            </td>
                            <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                              {data.login}
                            </td>
                            <td className="py-[19px] px-[16px]">{data.pass}</td>
                            <td className="py-[19px] px-[16px]">
                              <p
                                className={clsx(
                                  "Medium" === "Weak" && "text-pink",
                                  "Medium" === "Medium" && "text-text-orange",
                                  "Medium" === "Strong" && "text-text-green"
                                )}
                              >
                                Medium
                              </p>
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {data.action}
                            </td>
                          </>
                        )}
                        {selectedButton ===
                          DETAIL_COMPROMISED_COMPROMISE_USERS && (
                          <>
                            <td className="py-[19px] px-[16px]">{data.date}</td>
                            <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                              {data.url}
                            </td>
                            <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                              {data.login}
                            </td>
                            <td className="py-[19px] px-[16px]">{data.pass}</td>
                            <td className="py-[19px] px-[16px]">
                              <p
                                className={clsx(
                                  "Medium" === "Weak" && "text-pink",
                                  "Medium" === "Medium" && "text-text-orange",
                                  "Medium" === "Strong" && "text-text-green"
                                )}
                              >
                                Medium
                              </p>
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {data.action}
                            </td>
                          </>
                        )}
                        {selectedButton ===
                          DETAIL_COMPROMISED_COMPROMISE_THIRDPARTY && (
                          <>
                            <td className="py-[19px] px-[16px]">{data.date}</td>
                            <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                              {data.url}
                            </td>
                            <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                              {data.login}
                            </td>
                            <td className="py-[19px] px-[16px]">{data.pass}</td>
                            <td className="py-[19px] px-[16px]">
                              <p
                                className={clsx(
                                  "Medium" === "Weak" && "text-pink",
                                  "Medium" === "Medium" && "text-text-orange",
                                  "Medium" === "Strong" && "text-text-green"
                                )}
                              >
                                Medium
                              </p>
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {data.action}
                            </td>
                          </>
                        )}
                        {selectedButton ===
                          DETAIL_COMPROMISED_COMPROMISE_DEVICES && (
                          <>
                            <td className="py-[19px] px-[16px]">{data.date}</td>
                            <td className="py-[19px] px-[16px] w-[100px] text-wrap">
                              {data.devices_name}
                            </td>
                            <td className="py-[19px] px-[16px] text-wrap w-[100px]">
                              {data.ip}
                            </td>

                            <td className="py-[19px] px-[16px]">
                              {data.action}
                            </td>
                          </>
                        )}
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
