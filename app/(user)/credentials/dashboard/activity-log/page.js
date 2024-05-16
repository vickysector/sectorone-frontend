"use client";

import ExportButton from "@/app/_ui/components/buttons/ExportButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import ChartBarVerticalStealer from "@/app/_ui/components/charts/ChartBarVerticalStealer";
import { Select, ConfigProvider, Pagination, DatePicker, Spin } from "antd";
import Image from "next/image";
import clsx from "clsx";
import { EyeOutlined, BookOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingLogState } from "@/app/_lib/store/features/LogActivity/LoadingLogSlices";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { useRouter, redirect } from "next/navigation";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";

const { RangePicker } = DatePicker;

export default function ActivityLogUserPage() {
  const [logActivityData, setLogActivityData] = useState(null);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [page, setPage] = useState(1);

  const [filterApplied, setFilterApplied] = useState(false); // state for make sure data after search and rangedate is running once

  const dispatch = useDispatch();
  const router = useRouter();

  const loadingLogActivityData = useSelector(
    (state) => state.activityLogLoading.status
  );

  const handleSetKeyword = (e) => {
    setKeywordSearch(e.target.value);
  };

  const handleHitSearch = () => {
    setPage(1);
    fetchLogActivity(keywordSearch);
  };

  const handlePageChange = (page) => {
    // console.log(page);
    setPage(page);
  };

  const fetchLogActivity = async (keyword = "") => {
    try {
      dispatch(setLoadingLogState(true));
      if (!filterApplied && keyword) {
        setPage(1);
        setFilterApplied(true);
      }
      const res = await fetch(
        `${APIDATAV1}setting/activity?page=${page}&limit=10&search=${keyword}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      if (data.data === null) {
        // throw new Error("");
        throw res;
      }

      setLogActivityData({
        data: data.data,
        count: data.count_data,
        size: data.size,
      });

      return res;
    } catch (error) {
      setLogActivityData(null);
      return error;
    } finally {
      dispatch(setLoadingLogState(false));
    }
  };

  const fetchLogActivityWithRefreshToken = async (keyword = "") => {
    await fetchWithRefreshToken(fetchLogActivity, router, dispatch, keyword);
  };

  useEffect(() => {
    // fetchLogActivity(keywordSearch);
    fetchLogActivityWithRefreshToken(keywordSearch);
  }, [page]);

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-8">Activity log</h1>
        <div className="mt-4 bg-white  rounded-lg">
          <section className="p-8">
            <div className=" ">
              <div className="flex items-center">
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[400px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full  "
                    )}
                    placeholder={"Search activity "}
                    onChange={handleSetKeyword}
                    value={keywordSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleHitSearch();
                      }
                    }}
                  />
                  <div
                    className="px-3 cursor-pointer"
                    onClick={handleHitSearch}
                  >
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
            {loadingLogActivityData ? (
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
              logActivityData && (
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
                      {logActivityData.data.map((data, index) => (
                        <tr
                          className="border-b-[2px] border-[#D5D5D5]"
                          key={data.id}
                        >
                          <td className="py-[19px] px-[16px]"> {index + 1} </td>
                          <td className="py-[19px] px-[16px]">
                            {" "}
                            {convertDateFormat(data.CreatedAt)}{" "}
                          </td>
                          <td className="py-[19px] px-[16px]">
                            {" "}
                            {data.devices}{" "}
                          </td>
                          <td className="py-[19px] px-[16px]">
                            {" "}
                            {data.ipAddress}{" "}
                          </td>
                          <td className="py-[19px] px-[16px]">
                            {" "}
                            {data.activity}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between my-[19px] mx-[16px]">
                    <p className="text-Base-normal text-[#676767] ">
                      Showing {logActivityData.size} to {logActivityData.count}{" "}
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
                          total={logActivityData.count}
                          showSizeChanger={false}
                          style={{ color: "#FF6F1E" }}
                          hideOnSinglePage={true}
                          onChange={handlePageChange}
                          current={page}
                        />
                      </ConfigProvider>
                    </div>
                  </div>
                </div>
              )
            )}

            {logActivityData === null && (
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
