"use client";

import { useRouter, redirect, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { fetchWithRefreshToken } from "@/app/_lib/token/fetchWithRefreshToken";
import { APIDATAV1 } from "@/app/_lib/helpers/APIKEYS";
import { useEffect, useState } from "react";
import { setLoadingState } from "@/app/_lib/store/features/Compromised/LoadingSlices";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";
import LaunchIcon from "@mui/icons-material/Launch";
import Image from "next/image";
import Link from "next/link";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { ConfigProvider, Table } from "antd";
import {
  setContent,
  setTitle,
} from "@/app/_lib/store/features/Ransomware/DetailsSlices";

export default function DetailsCountryCyberAttacksPageAllCyberAttack({
  params,
}) {
  // Start of: state

  const [countryName, setCountryName] = useState("");
  const [last100ransomware, setLast100Cyberattacks] = useState();

  const searchParams = useSearchParams();

  const country = searchParams.get("country");

  // End of: state

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  // Start of: API Intregations

  const fetchCountryName = async () => {
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

      console.log("data allcyberattacks (recent): ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        setCountryName(data.data.title);
        return res;
      }
    } catch (error) {
      console.log("inside catch allcyberattacks (recent): ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchCountryNameWithRefreshToken = async () => {
    await fetchWithRefreshToken(fetchCountryName, router, dispatch);
  };

  const fetchAllCountryCyberAttack = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}ransomware/countryattacks?id=${country}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        return res;
      }

      const data = await res.json();

      console.log("data allcyberattacks: ", data);

      if (data.data === null) {
        throw res;
      }

      if (data.data) {
        // const updatedData = await Promise.all(
        //   data.data.map(async (item) => {
        //     const res2 = await fetch(
        //       `${APIDATAV1}ransomware/country?id=${item.country.toLowerCase()}`,
        //       {
        //         method: "GET",
        //         credentials: "include",
        //         headers: {
        //           Authorization: `Bearer ${getCookie("access_token")}`,
        //         },
        //       }
        //     );

        //     if (res2.status === 401 || res2.status === 403) {
        //       return res2;
        //     }

        //     const data2 = await res2.json();

        //     console.log("allcountry data (data2): ", data2);

        //     if (data.data === null) {
        //       throw res2;
        //     }

        //     return {
        //       ...item,
        //       title: data2.data.title,
        //     };
        //   })
        // );
        setLast100Cyberattacks(data.data);
        console.log("allcountry data (updatedData in table): ", updatedData);

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
    await fetchWithRefreshToken(fetchAllCountryCyberAttack, router, dispatch);
  };

  useEffect(() => {
    fetchCountryNameWithRefreshToken();
    fetchAllCyberAttarcksWithRefreshToken();
  }, []);

  // End of: API Intregations

  //   Start of: Handle function

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const handleMigrateContent = (title, summary) => {
    dispatch(setContent(summary));
    dispatch(setTitle(title));

    router.push("/credentials/dashboard/ransom-news/all-country/details");
  };

  //   End of: Handle function

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
      title: "Discovered",
      key: "added",
      render: (param1) => {
        return <p>{convertDateFormat(param1.discovered)}</p>;
      },
    },
    {
      title: "Country",

      key: "country",
      render: (param1) => {
        return (
          <div className="flex items-center">
            <Image
              width={32}
              height={24}
              src={param1.image}
              alt="Country Icon"
              className="rounded-md"
            />
            <p className="ml-2"> {param1.title} </p>
          </div>
        );
      },
    },
    {
      title: "Ransomware",

      key: "ransomware",
      render: (param1) => {
        return (
          <div>
            <Link
              className="underline"
              href={`/credentials/dashboard/ransom-news/all-cyberattacks/ransomware-details/details?ransomware=${param1.group_name}`}
            >
              {param1.group_name}
            </Link>
          </div>
        );
      },
    },
    {
      title: "URL",

      key: "url",
      render: (param1) => {
        return (
          <a
            href={`${param1.post_url.length === 0 ? "#" : param1.post_url}`}
            target="_blank"
          >
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
            onClick={() =>
              handleMigrateContent(param1.post_title, param1.activity)
            }
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
      <div className={clsx("flex items-center mb-4")}>
        <div onClick={handleBackToAllcyberattacks}>
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black  ml-4">
          {countryName.length !== 0 && countryName}
        </h1>
      </div>
      <div className="bg-white rounded-lg mt-4">
        <section className="p-8">
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
      </div>
    </main>
  );
}
