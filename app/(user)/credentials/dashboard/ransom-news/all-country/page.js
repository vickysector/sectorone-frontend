"use client";

import {
  LAST_100_CYBERATTACKS,
  RECENT_CYBERATTACKS,
} from "@/app/_lib/variables/Variables";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import { useEffect, useState } from "react";
import { ConfigProvider, Table, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import clsx from "clsx";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import LaunchIcon from "@mui/icons-material/Launch";
import Image from "next/image";
import Link from "next/link";
import {
  setContent,
  setTitle,
} from "@/app/_lib/store/features/Ransomware/DetailsSlices";

export default function AllCyberAttacksPage() {
  const [last100ransomware, setLast100Cyberattacks] = useState();
  const [selectOptions, setSelectOptions] = useState([]);

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  // Start of: Handle function

  const handleMigrateContent = (title, summary) => {
    dispatch(setContent(summary));
    dispatch(setTitle(title));

    router.push("/credentials/dashboard/ransom-news/all-country/details");
  };

  // End of: Handle function

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

  const fetchAllCountryOnSelect = async () => {
    const url1 = `${APIDATAV1}ransomware/list/country`;
    const url2 = `${APIDATAV1}ransomware/country?id=`;

    try {
      dispatch(setLoadingState(true));

      const res1 = await fetch(url1, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      });

      if (res1.status === 401 || res1.status === 403) {
        return res1;
      }

      const data1 = await res1.json();

      console.log("allcountry data: ", data1);

      if (data1.data === null) {
        throw res1;
      }

      const updatedData = await Promise.all(
        data1.data.map(async (item) => {
          const res2 = await fetch(`${url2}${item.id.toLowerCase()}`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${getCookie("access_token")}`,
            },
          });

          if (res2.status === 401 || res2.status === 403) {
            return res2;
          }

          const data2 = await res2.json();

          console.log("allcountry data (data2): ", data2);

          //   return {
          //     ...item,
          //     title: data2.data.title,
          //   };
          return {
            value: item.id.toLowerCase(),
            label: data2.data.title,
          };
        })
      );

      console.log("allcountry data (updatedData): ", updatedData);
      setSelectOptions(updatedData);
    } catch (error) {
      console.log("inside catch allcountry: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
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
    fetchAllCyberAttarcksWithRefreshToken();
    fetchAllCountryOnSelect();
  }, []);

  console.log("allcyberattacks data: ", last100ransomware);

  // End of: API Intregations

  console.log("select options: ", selectOptions);

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

        // fetchToChangeCountry(param1.country).then((data) => {
        //   console.log("allcyberattacks countryname: ", data);

        //   newCountryName = data.data.title;
        // });

        return (
          <div className="flex items-center">
            <Link key={param1.title} href={"/"}>
              <Image
                width={32}
                height={24}
                src={param1.image}
                alt="Country Icon"
              />
            </Link>
          </div>
        );
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
            onClick={() => handleMigrateContent(param1.title, param1.summary)}
          >
            Details
          </button>
        );
      },
    },
  ];

  // End of: Table Recent CyberAttacks

  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">All country</h1>
      <div className="bg-white rounded-lg mt-4">
        <section className="p-8">
          <section>
            <Select
              defaultValue="af"
              style={{
                width: 160,
              }}
              //   onChange={handleChange}
              options={selectOptions}
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
              <Table
                columns={columnsLastCyberattacks}
                dataSource={last100ransomware}
              />
            </ConfigProvider>
          </section>
        </section>
      </div>
    </main>
  );
}
