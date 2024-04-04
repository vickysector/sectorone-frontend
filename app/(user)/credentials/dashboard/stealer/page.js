"use client";

import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import ChartBarVerticalStealer from "@/app/_ui/components/charts/ChartBarVerticalStealer";
import {
  Select,
  ConfigProvider,
  Pagination,
  DatePicker,
  Spin,
  BookFilled,
} from "antd";
import Image from "next/image";
import clsx from "clsx";
import { EyeOutlined, BookOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { useEffect, useState } from "react";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import { setUrlData } from "@/app/_lib/store/features/Home/ChooseUrlSlice";
import { setLoadingStealerState } from "@/app/_lib/store/features/Stealer/LoadingStelaerSlices";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";

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
  const [breachesAll, setBreachesAll] = useState();
  const [employeeBreaches, setEmployeeBreaches] = useState();
  const [usersBreaches, setUserBreaches] = useState();
  const [urlBreaches, setUrlBreaches] = useState();
  const [iconBreaches, setIconBreaches] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [domainUsers, setDomainUsers] = useState();
  const [stealersdata, setStealersData] = useState();
  const [mapStealerData, setMapStealerData] = useState(null);
  const [mapStealerBookmarkData, setMapStealerbookmarkData] = useState(null);
  const [selectSection, setSelectSection] = useState("stealer");

  const [page, setPage] = useState(1);
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inputSearch, setInputSearch] = useState();

  const handleSetPageDefault = (value) => {
    setPage(value);
  };

  const handleSetBookmarkPage = (value) => {
    setBookmarkPage(value);
  };

  const dispatch = useDispatch();

  const loadingStealerData = useSelector(
    (state) => state.stealerLoading.status
  );

  const handleChangeUrlOpen = (value) => {
    dispatch(setChangeUrl(true));
  };

  const handleSearchKeyword = (e) => {
    setInputSearch(e.target.value);
  };

  const handleRangePicker = (date, datestring) => {
    setStartDate(datestring[0]);
    setEndDate(datestring[1]);
  };

  const handleSelectSection = (value) => {
    setSelectSection(value.target.name);
  };

  const handleClickSearch = () => {
    switch (selectSection) {
      case "stealer":
        fetchStealerData(inputSearch);
        break;
      case "bookmark-stealer":
        fetchStealerBookmarkData(inputSearch);
        break;
      default:
        break;
    }
  };

  const getBreachesData = async () => {
    try {
      const res = await fetch(
        `${APIDATAV1}breaches?year=2024&type=overview&status=all`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setUrlBreaches(data.data.name_domain);
      setIconBreaches(data.data.icon_domain);
      setLastUpdate(data.data.last_update);
    } catch (error) {}
  };

  const getListDomainUsers = async () => {
    try {
      const res = await fetch(`${APIDATAV1}list/domain`, {
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

      setDomainUsers(data.data);
      dispatch(setUrlData(data.data));
    } catch (error) {
    } finally {
    }
  };

  const getBreachesDataStealer = async () => {
    try {
      const res = await fetch(`${APIDATAV1}breaches/stealer?year=2024`, {
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

      console.log("data : ", data);

      setUrlBreaches(data.data.name_domain);
      setIconBreaches(data.data.icon_domain);
      setLastUpdate(data.data.last_update);
      setStealersData(data.data.stealer);
    } catch (error) {}
  };

  const fetchStealerData = async (keyword = "") => {
    try {
      dispatch(setLoadingStealerState(true));
      const res = await fetch(
        `${APIDATAV1}stealer?page=${page}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        // setDataSource(mappedEmployeedata);
        setMapStealerData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      setDataSource("error bro: ", error);
      setMapStealerData(null);
    } finally {
      dispatch(setLoadingStealerState(false));
    }
  };

  const fetchStealerBookmarkData = async (keyword = "") => {
    try {
      dispatch(setLoadingStealerState(true));
      const res = await fetch(
        `${APIDATAV1}status/domain/stealer/boomark?page=${bookmarkPage}&start_date=${startDate}&end_date=${endDate}&search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      if (data.data === null) {
        throw new Error("");
      }

      if (data.data) {
        // setDataSource(mappedEmployeedata);
        setMapStealerbookmarkData({
          data: data.data,
          count: data.count_data,
          size: data.size,
        });
      }
    } catch (error) {
      // setDataSource(null);
      setMapStealerbookmarkData(null);
    } finally {
      dispatch(setLoadingStealerState(false));
    }
  };

  useEffect(() => {
    getListDomainUsers();
    getBreachesData();
    getBreachesDataStealer();
  }, []);

  useEffect(() => {
    switch (selectSection) {
      case "stealer":
        fetchStealerData(inputSearch);
        break;
      case "bookmark-stealer":
        fetchStealerBookmarkData(inputSearch);
        break;
      default:
        break;
    }
  }, [page, startDate, endDate, bookmarkPage]);

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-4">Stealer</h1>
        <div className="bg-white  p-12 rounded-xl">
          <div className="flex items-center">
            <div className="h-[80px] w-[80px] bg-input-container ">
              <Image
                width={80}
                height={80}
                src={iconBreaches && iconBreaches}
                alt="Icon Logo Users"
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
                {domainUsers && domainUsers.length > 1
                  ? "Change URL"
                  : "No Data"}
              </ChangeUrlButton>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h1 className="text-heading-4 text-black ">Total Stealer</h1>
        <div className="p-8 bg-white border-input-border border-2 mt-4 rounded-[16px]">
          {/* <ConfigProvider
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
          </ConfigProvider> */}
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-8 flex justify-center items-center w-full relative">
            <ChartBarVerticalStealer stealerData={stealersdata} />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-heading-4 text-black">
          Total device compromised: {mapStealerData && mapStealerData.count}
        </h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8">
            <OutlineButton
              isActive={selectSection === "stealer"}
              total={mapStealerData && mapStealerData.count}
              value={"Data compromise "}
              nameData={"stealer"}
              onClick={handleSelectSection}
            />
            <OutlineButton
              isActive={selectSection === "bookmark-stealer"}
              total={mapStealerBookmarkData && mapStealerBookmarkData.count}
              value={"Bookmark "}
              nameData={"bookmark-stealer"}
              onClick={handleSelectSection}
            />

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
                    onChange={handleSearchKeyword}
                    value={inputSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleClickSearch();
                      }
                    }}
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
            {loadingStealerData ? (
              <div className="text-center">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#FF6F1E",
                    },
                  }}
                >
                  <Spin size="large" />
                </ConfigProvider>
              </div>
            ) : (
              <>
                {selectSection === "stealer" && mapStealerData && (
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
                        {mapStealerData.data.map((data, index) => (
                          <tr
                            className="border-b-[2px] border-[#D5D5D5]"
                            key={data.id}
                          >
                            <td className="py-[19px] px-[16px]">
                              {" "}
                              {index + 1}{" "}
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {convertDateFormat(data.datetime_added)}
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {" "}
                              {data.malware_name}{" "}
                            </td>
                            <td className="py-[19px] px-[16px]">
                              {" "}
                              {data.computer_name}{" "}
                            </td>
                            <td className="py-[19px] px-[16px] max-w-[400px]">
                              {" "}
                              {data.path}{" "}
                            </td>
                            <td className="py-[19px] px-[16px]">
                              <div className="flex">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => handleDetails(data)}
                                >
                                  <EyeOutlined style={{ fontSize: "18px" }} />
                                </div>
                                <div
                                  className="ml-auto mr-auto cursor-pointer"
                                  onClick={() =>
                                    handleUnBookmarkConfirm(
                                      data.id,
                                      DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                    )
                                  }
                                >
                                  <BookOutlined style={{ fontSize: "18px" }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between my-[19px] mx-[16px]">
                      <p className="text-Base-normal text-[#676767] ">
                        Showing {mapStealerData.size} to {mapStealerData.count}{" "}
                        entries
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
                            total={mapStealerData && mapStealerData.count}
                            showSizeChanger={false}
                            style={{ color: "#FF6F1E" }}
                            current={page}
                            onChange={handleSetPageDefault}
                          />
                        </ConfigProvider>
                      </div>
                    </div>
                  </div>
                )}
                {selectSection === "stealer" && mapStealerData === null && (
                  <div className="text-center flex flex-col justify-center items-center">
                    <div>
                      <Image
                        src={"/images/no_result_found_compromised.svg"}
                        alt="search icon"
                        width={129}
                        height={121}
                      />
                    </div>
                    <div className="mt-5">
                      <h1 className="text-heading-3">No results found</h1>
                      <p className="text-text-description text-LG-normal mt-4">
                        Try different keywords or remove search filters
                      </p>
                    </div>
                  </div>
                )}
                {selectSection === "bookmark-stealer" &&
                  mapStealerBookmarkData && (
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
                          {mapStealerBookmarkData.data.map((data, index) => (
                            <tr
                              className="border-b-[2px] border-[#D5D5D5]"
                              key={data.id}
                            >
                              <td className="py-[19px] px-[16px]">
                                {" "}
                                {index + 1}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {convertDateFormat(data.datetime_added)}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {" "}
                                {data.malware_name}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                {" "}
                                {data.computer_name}{" "}
                              </td>
                              <td className="py-[19px] px-[16px] max-w-[400px]">
                                {" "}
                                {data.path}{" "}
                              </td>
                              <td className="py-[19px] px-[16px]">
                                <div className="flex">
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => handleDetails(data)}
                                  >
                                    <EyeOutlined style={{ fontSize: "18px" }} />
                                  </div>
                                  <div
                                    className="ml-auto mr-auto cursor-pointer"
                                    onClick={() =>
                                      handleUnBookmarkConfirm(
                                        data.id,
                                        DETAIL_COMPROMISED_COMPROMISE_EMPLOYEE
                                      )
                                    }
                                  >
                                    <BookFilled
                                      style={{
                                        fontSize: "18px",
                                        color: "#FFD591",
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex items-center justify-between my-[19px] mx-[16px]">
                        <p className="text-Base-normal text-[#676767] ">
                          Showing {mapStealerBookmarkData.size} to{" "}
                          {mapStealerBookmarkData.count} entries
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
                              total={
                                mapStealerBookmarkData &&
                                mapStealerBookmarkData.count
                              }
                              showSizeChanger={false}
                              style={{ color: "#FF6F1E" }}
                              current={bookmarkPage}
                              onChange={handleSetBookmarkPage}
                            />
                          </ConfigProvider>
                        </div>
                      </div>
                    </div>
                  )}
                {selectSection === "bookmark-stealer" &&
                  mapStealerBookmarkData === null && (
                    <div className="text-center flex flex-col justify-center items-center">
                      <div>
                        <Image
                          src={"/images/no_result_found_compromised.svg"}
                          alt="search icon"
                          width={129}
                          height={121}
                        />
                      </div>
                      <div className="mt-5">
                        <h1 className="text-heading-3">No results found</h1>
                        <p className="text-text-description text-LG-normal mt-4">
                          Try different keywords or remove search filters
                        </p>
                      </div>
                    </div>
                  )}
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
