"use client";

import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { DetailItems } from "@/app/_ui/components/details/detailsItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, redirect } from "next/navigation";

export default function DetailCompromised() {
  const detailsCompromisedData = useSelector(
    (state) => state.detailComrpomise.data
  );

  const router = useRouter();

  console.log("details compromised data: ", detailsCompromisedData);

  const Date = {
    title: "Date",
    data: [
      {
        id: 1,
        key: "Date identified",
        value:
          hasOwnProperty("datetime_added") &&
          convertDateFormat(detailsCompromisedData.datetime_added),
      },
      {
        id: 2,
        key: "Date compromised",
        value:
          hasOwnProperty("datetime_compromised") &&
          convertDateFormat(detailsCompromisedData.datetime_compromised),
      },
    ],
  };

  const Account = {
    title: "Account",
    data: [
      {
        id: 1,
        key: "URL",
        value: hasOwnProperty("url") && (
          <a
            href={`${detailsCompromisedData.url}`}
            className="underline"
            target="_blank"
          >
            {detailsCompromisedData.url}
          </a>
        ),
      },
      {
        id: 2,
        key: "Login",
        value: hasOwnProperty("login") && detailsCompromisedData.login,
      },
      {
        id: 3,
        key: "Password",
        value: hasOwnProperty("password") && detailsCompromisedData.password,
      },
    ],
  };

  const Devices = {
    title: "Devices",
    data: [
      {
        id: 1,
        key: "Device name",
        value:
          hasOwnProperty("computer_name") &&
          detailsCompromisedData.computer_name,
      },
      {
        id: 2,
        key: "Machine ID",
        value:
          hasOwnProperty("machine_id") && detailsCompromisedData.machine_id,
      },
      {
        id: 3,
        key: "Path",
        value: hasOwnProperty("path") && detailsCompromisedData.path,
      },
    ],
  };

  const Others = {
    title: "Others",
    data: [
      {
        id: 1,
        key: "IP Address",
        value: hasOwnProperty("ip") && detailsCompromisedData.ip,
      },
      {
        id: 2,
        key: "Location",
        value: hasOwnProperty("location") && detailsCompromisedData.location,
      },
      {
        id: 3,
        key: "Antivirus",
        value:
          hasOwnProperty("antivirus") &&
          detailsCompromisedData.antivirus.length === 0
            ? "-"
            : hasOwnProperty("antivirus") &&
              detailsCompromisedData.antivirus.join(),
      },
    ],
  };

  function hasOwnProperty(property) {
    return detailsCompromisedData.hasOwnProperty(property) ? true : false;
  }

  function handleBackToCompromise() {
    // router.back();
    router.push("/credentials/dashboard/compromised");
  }

  return (
    <>
      <section className="flex items-center">
        <div onClick={handleBackToCompromise} className="hover:cursor-pointer">
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black ml-3">Details</h1>
      </section>
      <section className="bg-white rounded-lg px-8 py-8 mt-6">
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5]">
          <DetailItems items={Date} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Account} />
        </div>
        <div className=" pb-8 border-b-[1px] border-[#D5D5D5] mt-8">
          <DetailItems items={Devices} />
        </div>
        <div className=" mt-8">
          <DetailItems items={Others} />
        </div>
      </section>
    </>
  );
}
