"use client";

import {
  compromisedDataUrl,
  compromisedDataUser,
} from "@/app/_lib/TempCompromisedData";
import { dataOverview } from "@/app/_lib/TempDataOverview";
import { antivirusData, malwareData } from "@/app/_lib/TempMalwareData";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import PieChartCard from "@/app/_ui/components/cards/PieChartCard";
import ChartBarHorizontal from "@/app/_ui/components/charts/ChartBarHorizontal";
import ChartBarVertical from "@/app/_ui/components/charts/ChartBarVertical";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import { useEffect, useState } from "react";
import { Select, ConfigProvider } from "antd";
import { useRouter, redirect } from "next/navigation";
import { APIDATAV1, APIKEY } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { produce } from "immer";
import Image from "next/image";
import { DeleteCookies } from "@/app/_lib/helpers/DeleteCookies";
import { RedirectToLogin } from "@/app/_lib/helpers/RedirectToLogin";
import {
  TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_ALL,
  TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_EMPLOYEE,
  TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_USER,
  TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2023,
  TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2024,
} from "@/app/_lib/variables/Variables";
import { useSelector, useDispatch } from "react-redux";
import { setChangeUrl } from "@/app/_lib/store/features/Home/ChangeUrlSlice";

import clsx from "clsx";
import { setUrlData } from "@/app/_lib/store/features/Home/ChooseUrlSlice";
import { WidthNumberTopCompromisedVirusAndMalware } from "@/app/_lib/helpers/WidthNumberTopComrpomised";
import {
  setBreachesEmployee,
  setBreachesEmployeeAndUsers,
  setBreachesUsers,
  setIcon,
  setLastUpdateUsers,
  setUrl,
} from "@/app/_lib/store/features/Breaches/BreachesSlices";
import {
  setLoadingBreachesOverview,
  setLoadingListDomainUsers,
  setLoadingTopCompromiseAntivirus,
  setLoadingTopCompromiseMalware,
  setLoadingTopCompromiseUrl,
  setLoadingTopCompromiseUser,
} from "@/app/_lib/store/features/Home/LoadingOverviewSlices";
import { getRefreshToken } from "@/app/_lib/token/getRefreshToken";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
// import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";

import dayjs from "dayjs";

export default function UserDashboardPage() {
  const [yearSelect, setYearSelect] = useState(
    TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2024
  );
  const [statusSelect, setStatusSelect] = useState(
    TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_ALL
  );
  const [loadingBreaches, setLoadingBreaches] = useState(false);
  const [loadingTopCompromised, setLoadingTopCompromised] = useState(false);

  // Start of: Timer
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [intervalRef, setIntervalRef] = useState(null);

  // End of: Timer

  // Start of: Breaches Data
  // const [breachesAll, setBreachesAll] = useState();
  // const [employeeBreaches, setEmployeeBreaches] = useState();
  // const [usersBreaches, setUserBreaches] = useState();
  // const [urlBreaches, setUrlBreaches] = useState();
  // const [iconBreaches, setIconBreaches] = useState();
  // const [lastUpdate, setLastUpdate] = useState();
  const [usersData, setUsersData] = useState();
  const [employeeData, setEmployeeData] = useState();
  const [userTopCompromised, setUserTopCompromised] = useState();
  const [urlTopCompromised, setUrlTopCompromised] = useState();
  const [antivirusTopCompromised, setAntivirusTopCompromised] = useState();
  const [malwareTopCompromised, setMalwareTopCompromised] = useState();
  // const [domainUsers, setDomainUsers] = useState();

  // End of: Breaches Data
  const router = useRouter();
  const dispatch = useDispatch();

  const changeUrlState = useSelector((state) => state.changeUrl);
  const domainUsers = useSelector((state) => state.chooseUrl.urlData);

  const breachesAll = useSelector((state) => state.breaches.breachesAll);

  const employeeBreaches = useSelector(
    (state) => state.breaches.breachesEmployee
  );

  const usersBreaches = useSelector((state) => state.breaches.breachesUsers);

  const urlBreaches = useSelector((state) => state.breaches.url);

  const iconBreaches = useSelector((state) => state.breaches.icon);

  const lastUpdate = useSelector((state) => state.breaches.lastUpdate);

  const selectYearChange = (value) => {
    setYearSelect(value);
  };

  const selectStatusChange = (value) => {
    setStatusSelect(value);
  };

  const handleChangeUrlOpen = (value) => {
    dispatch(setChangeUrl(true));
  };

  const getBreachesData = async () => {
    try {
      dispatch(setLoadingBreachesOverview(true));

      const res = await fetch(
        `${APIDATAV1}breaches?year=${yearSelect}&type=overview&status=all`,
        {
          method: "GET",
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

      // setBreachesAll(data.data.all_breaches);
      // setEmployeeBreaches(data.data.employee_breaches);
      // setUserBreaches(data.data.user_breaches);
      // setUrlBreaches(data.data.name_domain);
      // setIconBreaches(data.data.icon_domain);
      // setLastUpdate(data.data.last_update);
      dispatch(setBreachesEmployeeAndUsers(data.data.all_breaches));
      dispatch(setBreachesEmployee(data.data.employee_breaches));
      dispatch(setBreachesUsers(data.data.user_breaches));
      dispatch(setUrl(data.data.name_domain));
      dispatch(setIcon(data.data.icon_domain));
      dispatch(setLastUpdateUsers(data.data.last_update));
      setUsersData(data.data.user);
      setEmployeeData(data.data.employee);

      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingBreachesOverview(false));
    }
  };

  const fetchDataBreachesWithRefreshToken = async () => {
    console.log("running get data bracheswith refresh token");
    await fetchWithRefreshToken(getBreachesData, router, dispatch);
  };

  // const fetchBreachesDataWithRefreshToken = async () => {
  //   try {
  //     let success = await getBreachesData();
  //     console.log("succes breaches: ", success.status);
  //     if (success.status !== 200) {
  //       throw success;
  //     }
  //   } catch (error) {
  //     console.log("error breaches : ", error);
  //     if (error.status === 401 || error.status === 403) {
  //       console.log("error breaches inside if : ", error);
  //       try {
  //         let success = await getRefreshToken();

  //         console.log("success refresh token: ", success);

  //         if (success.status !== 200) {
  //           throw new Error("");
  //         }

  //         await getBreachesData();
  //       } catch (refreshError) {
  //         console.error("Refresh token failed:", refreshError);
  //         // Handle refresh token failure (e.g., logout, redirect to login)
  //         DeleteCookies();
  //         console.log("cookie deleted because refresh token is failed");
  //       }
  //     } else {
  //       console.error("Error fetching breaches data:", error);
  //       // Handle other errors
  //       DeleteCookies();
  //       // RedirectToLogin();
  //     }
  //   }
  // };

  useEffect(() => {
    // getBreachesData();
    // fetchBreachesDataWithRefreshToken();
    fetchDataBreachesWithRefreshToken();
  }, [yearSelect]);

  // Start of: Timer

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000); // Update every second

    setIntervalRef(interval);

    return () => {
      clearInterval(interval); // Clean up the interval on unmount
    };
  }, []);

  // End of: Timer

  // Start of: Change URL - Get Domain USERS

  const getListDomainUsers = async () => {
    try {
      dispatch(setLoadingListDomainUsers(true));

      const res = await fetch(`${APIDATAV1}list/domain`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      // setDomainUsers(data.data);
      dispatch(setUrlData(data.data));

      // return data.success;
      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingListDomainUsers(false));
    }
  };

  const fetchListDomainUsersWithRefreshToken = async () => {
    await fetchWithRefreshToken(getListDomainUsers, router, dispatch);
  };

  useEffect(() => {
    // getListDomainUsers();
    // fetchListDomainWithRefreshToken();
    fetchListDomainUsersWithRefreshToken();
  }, []);

  // End of: Change URL - Get Domain USERS

  //  Start of: Get data Top Compromised

  const getTopCompromisedUser = async () => {
    try {
      dispatch(setLoadingTopCompromiseUser(true));

      const res = await fetch(`${APIDATAV1}overview/top/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setUserTopCompromised(data.data.top_user);

      // return data.success;
      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingTopCompromiseUser(false));
    }
  };

  const fetchTopCompromiseUserWithRefreshToken = async () => {
    await fetchWithRefreshToken(getTopCompromisedUser, router, dispatch);
  };

  const getTopCompromisedUrl = async () => {
    try {
      dispatch(setLoadingTopCompromiseUrl(true));

      const res = await fetch(`${APIDATAV1}overview/top/url`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setUrlTopCompromised(data.data.top_url);

      // return data.success;
      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingTopCompromiseUrl(false));
    }
  };

  const fetchTopCompromiseUrlWithRefreshToken = async () => {
    await fetchWithRefreshToken(getTopCompromisedUrl, router, dispatch);
  };

  useEffect(() => {
    // getTopCompromisedUser();
    // getTopCompromisedUrl();
    fetchTopCompromiseUserWithRefreshToken();
    fetchTopCompromiseUrlWithRefreshToken();
  }, []);

  //  End of: Get data Top Compromised

  // Start of: Get data Top Antivirus and Malware

  const getTopComrpomisedAntivirus = async () => {
    try {
      dispatch(setLoadingTopCompromiseAntivirus(true));

      const res = await fetch(`${APIDATAV1}overview/top/antivirus`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setAntivirusTopCompromised(data.data.top_url);

      // return data.success;
      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingTopCompromiseAntivirus(false));
    }
  };

  const fetchTopCompromiseAntivirusWithRefreshToken = async () => {
    await fetchWithRefreshToken(getTopComrpomisedAntivirus, router, dispatch);
  };

  const getTopComrpomisedMalware = async () => {
    try {
      dispatch(setLoadingTopCompromiseMalware(true));

      const res = await fetch(`${APIDATAV1}overview/top/malware`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // DeleteCookies();
        // RedirectToLogin();
        return res;
      }

      const data = await res.json();

      setMalwareTopCompromised(data.data.top_malware);
      // return data.success;
      return res;
    } catch (error) {
    } finally {
      dispatch(setLoadingTopCompromiseMalware(false));
    }
  };

  const fetchTopCompromiseMalwawreWithRefreshToken = async () => {
    await fetchWithRefreshToken(getTopComrpomisedMalware, router, dispatch);
  };

  useEffect(() => {
    // getTopComrpomisedAntivirus();
    // getTopComrpomisedMalware();
    fetchTopCompromiseAntivirusWithRefreshToken();
    fetchTopCompromiseMalwawreWithRefreshToken();
  }, []);

  // End of: Get data Top Antivirus and Malware

  return (
    <main>
      {/* <div
        className={clsx(
          "fixed top-0 bottom-0 left-0 right-0 bg-black w-full z-50 flex items-center justify-center"
        )}
      ></div> */}

      <section>
        <h1 className="text-heading-2 text-black mb-4">Overview</h1>
        <div className="bg-white  p-12 rounded-xl shadow-md">
          <div className="flex items-center">
            <div>
              <div className="h-[32px] w-[32px] bg-input-container flex">
                <Image
                  width={32}
                  height={32}
                  src={iconBreaches && iconBreaches}
                  alt="Icon Logo Users"
                  // style={{
                  //   objectFit: "cover",
                  //   backgroundSize: "cover",
                  //   width: "100%",
                  // }}
                />
                <h1 className="text-heading-3 ml-4">
                  {urlBreaches && urlBreaches}
                </h1>
              </div>
              <div className="">
                {/* <h2 className="text-LG-normal text-text-description mt-2">
                  Last update: {lastUpdate && lastUpdate}
                </h2> */}
                <p className="text-LG-normal text-text-description mt-2">
                  This Company is scanned by SectorOne per{" "}
                  <span className="text-primary-base">
                    {" "}
                    {currentTime.format("DD MMMM YYYY HH:mm:ss")}
                  </span>{" "}
                </p>
              </div>
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
      </section>
      <section className="mt-8">
        <h1 className="text-heading-4 text-black ">Total compromised</h1>
        <div className="p-8 bg-white  mt-4 rounded-[16px]">
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
              defaultValue={yearSelect}
              value={yearSelect}
              style={{ width: 91 }}
              onChange={selectYearChange}
              options={[
                {
                  value: TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2024,
                  label: "2024",
                },

                {
                  value: TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2023,
                  label: "2023",
                },
              ]}
            />

            <Select
              defaultValue={statusSelect}
              value={statusSelect}
              style={{ width: 200 }}
              onChange={selectStatusChange}
              options={[
                {
                  value: TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_ALL,
                  label: "All (Employee & User)",
                },
                {
                  value: TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_USER,
                  label: "User",
                },
                {
                  value: TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_EMPLOYEE,
                  label: "Emlpoyee",
                },
              ]}
              className="ml-8"
            />
          </ConfigProvider>
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-12 flex justify-center items-center w-full relative">
            <ChartBarVertical
              employeeData={employeeData}
              usersData={usersData}
              minValue={0}
              status={statusSelect}
            />
          </div>
        </div>
      </section>
      <section className="flex mt-10">
        <div className="w-[50%] h-full ">
          <h1 className="text-heading-4 text-black mb-6">
            Top compromised URL(s){" "}
          </h1>
          <PieChartCard
            compromisedData={compromisedDataUrl}
            datasets={urlTopCompromised && urlTopCompromised}
          />
        </div>
        <div className="w-[50%] ml-6 h-full">
          <h1 className="text-heading-4 text-black mb-6">
            Top compromised User(s)
          </h1>
          <PieChartCard
            compromisedData={compromisedDataUser}
            datasets={userTopCompromised && userTopCompromised}
          />
        </div>
      </section>
      <section className="flex mt-10">
        <div className="w-[50%] h-full ">
          <h1 className="text-heading-4 text-black mb-6">
            Top antivirus compromised
          </h1>
          <div className="bg-white  rounded-xl p-8 items-center flex flex-col text-center">
            {antivirusTopCompromised ? (
              <div
                className="border-l-2 border-b-2 border-input-border w-full h-auto p-5"
                key={"antivirus"}
              >
                {antivirusTopCompromised.map((data, index) => (
                  <div className="mb-4" key={data.id}>
                    <ChartBarHorizontal
                      name={data.antivirus_name}
                      number={data.count}
                      isAntivirus={true}
                      datasets={antivirusTopCompromised}
                      width={WidthNumberTopCompromisedVirusAndMalware[index]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No Data Available</p>
            )}
          </div>
        </div>
        <div className="w-[50%] h-full ml-6 ">
          <h1 className="text-heading-4 text-black mb-6">
            Top malware compromised
          </h1>
          <div className="bg-white rounded-xl p-8 items-center flex flex-col text-center">
            {malwareTopCompromised ? (
              <div
                className="border-l-2 border-b-2 border-input-border w-full h-auto p-5"
                key={"malware"}
              >
                {malwareTopCompromised.map((data, index) => (
                  <div className="mb-4" key={data.id}>
                    <ChartBarHorizontal
                      name={data.malware_name}
                      number={data.count}
                      isMalware={true}
                      datasets={malwareTopCompromised}
                      width={WidthNumberTopCompromisedVirusAndMalware[index]}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No Data Available</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
