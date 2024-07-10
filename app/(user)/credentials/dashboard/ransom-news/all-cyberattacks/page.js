"use client";

import {
  LAST_100_CYBERATTACKS,
  RECENT_CYBERATTACKS,
} from "@/app/_lib/variables/Variables";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import clsx from "clsx";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import LaunchIcon from "@mui/icons-material/Launch";

export default function AllCyberAttacksPage() {
  const [selectedButton, setSelectedButton] = useState(LAST_100_CYBERATTACKS);
  const [last100ransomware, setLast100Cyberattacks] = useState();
  const [recentCyberattacks, setRecentCyberattacks] = useState();
  const [countryName, setCountryName] = useState("");

  const handleButtonClick = (value) => {
    setSelectedButton(value.target.name);
  };

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  // Start of: API Intregations

  const fetchAllCyberAttacks = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}ransomware/allcyberattacks`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data allcyberattacks: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setLast100Cyberattacks(data.data);

        return res;
      }
    } catch (error) {
      console.log("inside catch allcyberattacks: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchAllCyberAttarcksWithRefreshToken = async () => {
    await fetchWithRefreshToken(fetchAllCyberAttacks, router, dispatch);
  };

  const fetchRecentCyberAttacks = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}ransomware/recentcyberattacks`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data allcyberattacks (recent): ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setRecentCyberattacks(data.data);

        return res;
      }
    } catch (error) {
      console.log("inside catch allcyberattacks (recent): ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchRecentCyberAttarcksWithRefreshToken = async () => {
    await fetchWithRefreshToken(fetchRecentCyberAttacks, router, dispatch);
  };

  const fetchToChangeCountry = async (country) => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(`${APIDATAV1}ransomware/country?id=${country}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data allcyberattacks country: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        return data;
      }
    } catch (error) {
      console.log("inside catch allcyberattacks country: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  useEffect(() => {
    switch (selectedButton) {
      case LAST_100_CYBERATTACKS:
        fetchAllCyberAttarcksWithRefreshToken();
      case RECENT_CYBERATTACKS:
        fetchRecentCyberAttarcksWithRefreshToken();
      default:
        break;
    }
  }, []);

  console.log("allcyberattacks data: ", last100ransomware);

  // End of: API Intregations

  // Start of: Table Last 100 Cyberattacks

  const columnsLastCyberattacks = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        console.log("inside render (param1): ", param1);
        console.log("inside render (record): ", record);
        console.log("inside render (index): ", index);
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p>{convertDateFormat(param1.added)}</p>;
      },
    },
    {
      title: "Country",

      key: "country",
      render: (param1) => {
        let newCountryName;

        fetchToChangeCountry(param1.country).then((data) => {
          console.log("allcyberattacks countryname: ", data);

          newCountryName = data.data.title;
        });

        return <>{newCountryName}</>;
      },
    },
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Victim",
      dataIndex: "victim",
      key: "victim",
    },
    {
      title: "URL",

      key: "url",
      render: (param1) => {
        return (
          <a href={`${param1.url}`} target="_blank">
            <LaunchIcon style={{ color: "#FF6F1E" }} />
          </a>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1, record) => {
        return (
          <button
            className={clsx(
              `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
            )}
          >
            Details
          </button>
        );
      },
    },
  ];

  // End of: Table Recent CyberAttacks

  // Start of: Table Recent Cyberattacks

  const columnsRecentCyberattacks = [
    {
      title: "No",
      key: "no",
      render: (param1, record, index) => {
        console.log("inside render (param1): ", param1);
        console.log("inside render (record): ", record);
        console.log("inside render (index): ", index);
        return <p>{index + 1}</p>;
      },
    },
    {
      title: "Date added",
      key: "added",
      render: (param1) => {
        return <p>{convertDateFormat(param1.added)}</p>;
      },
    },
    {
      title: "Country",

      key: "country",
      render: (param1) => {
        fetchToChangeCountry("in").then((data) => {
          console.log("allcyberattacks countryname: ", data.data.title);

          setCountryName(data.data.title);
        });

        return <p>{countryName}</p>;
      },
    },
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
    },
    {
      title: "Victim",
      dataIndex: "victim",
      key: "victim",
    },
    {
      title: "URL",

      key: "url",
      render: (param1) => {
        return (
          <a href={`${param1.url}`} target="_blank">
            <LaunchIcon style={{ color: "#FF6F1E" }} />
          </a>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (param1, record) => {
        return (
          <button
            className={clsx(
              `py-2 px-4 rounded-md text-primary-base text-Base-normal border-[1px] border-input-border `
            )}
          >
            Details
          </button>
        );
      },
    },
  ];

  // End of: Table Recent Cyberattacks

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">All Cyber Attacks</h1>
      <div className="bg-white rounded-lg mt-4">
        <section className="p-8">
          <section>
            <CompromiseButton
              value={"Last 100 cyberattacks"}
              nameData={LAST_100_CYBERATTACKS}
              isActive={selectedButton === LAST_100_CYBERATTACKS}
              onClick={handleButtonClick}
            />
            <CompromiseButton
              value={"Recent cyberattacks"}
              nameData={RECENT_CYBERATTACKS}
              isActive={selectedButton === RECENT_CYBERATTACKS}
              onClick={handleButtonClick}
            />
          </section>
          <section className={clsx("mt-8")}>
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
              {selectedButton === LAST_100_CYBERATTACKS && (
                <Table
                  columns={columnsLastCyberattacks}
                  dataSource={last100ransomware}
                />
              )}

              {selectedButton === RECENT_CYBERATTACKS && (
                <Table
                  columns={columnsRecentCyberattacks}
                  dataSource={recentCyberattacks}
                  pagination={false}
                />
              )}
            </ConfigProvider>
          </section>
        </section>
      </div>
    </main>
  );
}
