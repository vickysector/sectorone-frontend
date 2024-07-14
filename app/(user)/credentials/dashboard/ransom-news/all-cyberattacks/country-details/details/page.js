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

export default function DetailsCountryCyberAttacksPageAllCyberAttack({
  params,
}) {
  // Start of: state

  const [countryName, setCountryName] = useState("");

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

  useEffect(() => {
    fetchCountryNameWithRefreshToken();
  }, []);

  // End of: API Intregations

  //   Start of: Handle function

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  //   End of: Handle function

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
        <section className="p-8"></section>
      </div>
    </main>
  );
}
