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

export default function UserDashboardPage() {
  const [yearSelect, setYearSelect] = useState(
    TOTAL_COMPROMISED_OVERVIEW_SELECT_YEAR_2024
  );
  const [statusSelect, setStatusSelect] = useState(
    TOTAL_COMPROMISED_OVERVIEW_SELECT_STATUS_ALL
  );
  const [loadingBreaches, setLoadingBreaches] = useState(false);
  const [loadingTopCompromised, setLoadingTopCompromised] = useState(false);

  // Start of: Breaches Data
  const [breachesAll, setBreachesAll] = useState();
  const [employeeBreaches, setEmployeeBreaches] = useState();
  const [usersBreaches, setUserBreaches] = useState();
  const [urlBreaches, setUrlBreaches] = useState();
  const [iconBreaches, setIconBreaches] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [usersData, setUsersData] = useState();
  const [employeeData, setEmployeeData] = useState();
  const [userTopCompromised, setUserTopCompromised] = useState();
  const [urlTopCompromised, setUrlTopCompromised] = useState();
  const [antivirusTopCompromised, setAntivirusTopCompromised] = useState();
  const [malwareTopCompromised, setMalwareTopCompromised] = useState();

  // End of: Breaches Data
  const router = useRouter();

  const selectYearChange = (value) => {
    setYearSelect(value);
  };

  const selectStatusChange = (value) => {
    setStatusSelect(value);
  };

  const getBreachesData = async () => {
    try {
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
        DeleteCookies();
        RedirectToLogin();
      }

      const data = await res.json();

      setBreachesAll(data.data.all_breaches);
      setEmployeeBreaches(data.data.employee_breaches);
      setUserBreaches(data.data.user_breaches);
      setUrlBreaches(data.data.name_domain);
      setIconBreaches(data.data.icon_domain);
      setLastUpdate(data.data.last_update);
      setUsersData(data.data.user);
      setEmployeeData(data.data.employee);
    } catch (error) {}
  };

  useEffect(() => {
    getBreachesData();
    // getRefreshToken();
  }, [yearSelect]);

  //  Start of: Get data Top Compromised

  const getTopCompromisedUser = async () => {
    try {
      const res = await fetch(`${APIDATAV1}overview/top/user`, {
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

      setUserTopCompromised(data.data.top_user);
    } catch (error) {
    } finally {
    }
  };

  const getTopCompromisedUrl = async () => {
    try {
      const res = await fetch(`${APIDATAV1}overview/top/url`, {
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

      setUrlTopCompromised(data.data.top_url);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getTopCompromisedUser();
    getTopCompromisedUrl();
  }, []);

  //  End of: Get data Top Compromised

  // Start of: Get data Top Antivirus and Malware

  const getTopComrpomisedAntivirus = async () => {
    try {
      const res = await fetch(`${APIDATAV1}overview/top/antivirus`, {
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

      console.log("data antivirus: ", data);

      setAntivirusTopCompromised(data.data.top_url);
    } catch (error) {
    } finally {
    }
  };

  const getTopComrpomisedMalware = async () => {
    try {
      const res = await fetch(`${APIDATAV1}overview/top/malware`, {
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

      console.log("data malware: ", data);

      setMalwareTopCompromised(data.data.top_malware);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getTopComrpomisedAntivirus();
    getTopComrpomisedMalware();
  }, []);

  // End of: Get data Top Antivirus and Malware

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-4">Overview</h1>
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
              <ChangeUrlButton>Change URL</ChangeUrlButton>
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
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-8 flex justify-center items-center w-full relative">
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
          <div className="bg-white border-input-border border-2 rounded-xl p-8 items-center flex flex-col text-center">
            {antivirusTopCompromised ? (
              <div className="border-l-2 border-b-2 border-input-border w-full h-auto p-5">
                {antivirusData.map((data) => (
                  <div className="mb-4" key={data.id}>
                    <ChartBarHorizontal
                      name={data.name}
                      number={data.number}
                      isAntivirus={true}
                      datasets={antivirusTopCompromised}
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
          <div className="bg-white border-input-border border-2 rounded-xl p-8 items-center flex flex-col text-center">
            {malwareTopCompromised ? (
              <div className="border-l-2 border-b-2 border-input-border w-full h-auto p-5">
                {malwareData.map((data) => (
                  <div className="mb-4" key={data.id}>
                    <ChartBarHorizontal
                      name={data.name}
                      number={data.number}
                      isMalware={true}
                      datasets={malwareTopCompromised}
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
