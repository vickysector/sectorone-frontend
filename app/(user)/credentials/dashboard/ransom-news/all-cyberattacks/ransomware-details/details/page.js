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
import ImageIcon from "@mui/icons-material/Image";
import { setAllDataRansomware } from "@/app/_lib/store/features/Ransomware/DetailsRansomwareSlices";

export default function DetailsCountryCyberAttacksPageAllCyberAttack() {
  // Start of: state

  const [ransomwareData, setRansomwareData] = useState();

  const searchParams = useSearchParams();

  const ransomware = searchParams.get("ransomware");

  // End of: state

  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  // End of: Redux

  // Start of: API Intregations

  const fetchAllRansomwareHub = async () => {
    try {
      dispatch(setLoadingState(true));

      const res = await fetch(
        `${APIDATAV1}ransomware/groupvictims?name=${ransomware}`,
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
        setRansomwareData(data.data);
        // console.log("allcountry data (updatedData in table): ", updatedData);

        return res;
      }
    } catch (error) {
      console.log("inside catch allcyberattacks: ", error);
      return error;
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const fetchAllRansomwareWithRefreshToken = async () => {
    await fetchWithRefreshToken(fetchAllRansomwareHub, router, dispatch);
  };

  useEffect(() => {
    fetchAllRansomwareWithRefreshToken();
  }, []);

  // End of: API Intregations

  //   Start of: Handle function

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  const handleMigrateContent = (allData, ransomware) => {
    dispatch(setAllDataRansomware(allData));

    router.push(
      `/credentials/dashboard/ransom-news/all-cyberattacks/ransomware-details/${ransomware}/details`
    );
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
      title: "Published",
      key: "published",
      render: (param1) => {
        return <p>{convertDateFormat(param1.published)}</p>;
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
            <p>{param1.group_name}</p>
          </div>
        );
      },
    },
    {
      title: "URL",

      key: "url",
      render: (param1) => {
        return (
          <div>
            <a
              href={`${param1.post_url}`}
              target="_blank"
              className={clsx(
                param1.post_url.length === 0 ? "hidden" : "visible"
              )}
            >
              <LaunchIcon style={{ color: "#FF6F1E" }} />
            </a>
            <p
              className={clsx(
                param1.post_url.length !== 0 ? "hidden" : "visible"
              )}
            >
              {" "}
              -
            </p>
          </div>
        );
      },
    },
    {
      title: "Proof",

      key: "proof",
      render: (param1) => {
        return (
          <div>
            <a
              href={`${param1.screenshot}`}
              target="_blank"
              className={clsx(
                param1.screenshot.length === 0 ? "hidden" : "visible"
              )}
            >
              <ImageIcon style={{ color: "#FF6F1E" }} />
            </a>
            <p
              className={clsx(
                param1.screenshot.length !== 0 ? "hidden" : "visible"
              )}
            >
              {" "}
              -
            </p>
          </div>
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
            onClick={() => handleMigrateContent(param1, param1.group_name)}
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
          {" "}
          {ransomwareData && ransomwareData[0].group_name}{" "}
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
              dataSource={ransomwareData}
            />
          </ConfigProvider>
        </section>
      </div>
    </main>
  );
}
