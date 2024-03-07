"use client";

import {
  compromisedDataUrl,
  compromisedDataUser,
} from "@/app/_lib/TempCompromisedData";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import PieChartCard from "@/app/_ui/components/cards/PieChartCard";
import ChartBarHorizontal from "@/app/_ui/components/charts/ChartBarHorizontal";
import ChartBarVertical from "@/app/_ui/components/charts/ChartBarVertical";
import { useState } from "react";

const antivirusData = [
  {
    id: 1,
    name: "Smadav",
    number: 100,
  },
  {
    id: 2,
    name: "Windows Defender",
    number: 90,
  },
  {
    id: 3,
    name: "MACKEEPER",
    number: 80,
  },
  {
    id: 4,
    name: "TOTALAV",
    number: 70,
  },
  {
    id: 5,
    name: "SurfShak",
    number: 60,
  },
  {
    id: 6,
    name: "NORD",
    number: 50,
  },
  {
    id: 7,
    name: "avast",
    number: 40,
  },
  {
    id: 8,
    name: "AVIRA",
    number: 30,
  },
  {
    id: 9,
    name: "PCPROTECT",
    number: 20,
  },
  {
    id: 10,
    name: "PANDA",
    number: 10,
  },
];

export default function UserDashboardPage() {
  const [yearSelect, setYearSelect] = useState(null);
  const [statusSelect, setStatusSelect] = useState(null);

  const selectYearChange = (event) => {
    setYearSelect(event.target.value);

    console.log("user : ", event.target.value);
  };

  const selectStatusChange = (event) => {
    setStatusSelect(event.target.value);

    console.log("user : ", event.target.value);
  };

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-4">Overview</h1>
        <div className="bg-white flex items-center p-12 rounded-xl">
          <div className="h-[80px] w-[80px] bg-input-container "></div>
          <div className="ml-4">
            <h1 className="text-heading-3">URL name</h1>
            <h2 className="text-LG-strong text-text-description mt-2">
              Last update: 08 Jan 2023/02:00
            </h2>
          </div>
          <div className="flex flex-grow justify-end items-center">
            <ChangeUrlButton>Change URL</ChangeUrlButton>
          </div>
        </div>
      </section>
      <section className="mt-8">
        <h1 className="text-heading-4 text-black ">Total compromised</h1>
        <div className="p-8 bg-white border-input-border border-2 mt-4 rounded-[16px]">
          <select
            name="years"
            id="years"
            onChange={selectYearChange}
            className="border-2 border-input-border rounded-lg bg-input-container py-2 px-4 text-Base-normal text-text-color custom-select"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <select
            name="status"
            id="status"
            onChange={selectYearChange}
            className="border-2 border-input-border rounded-lg bg-input-container py-2 px-4 text-Base-normal text-text-color custom-select ml-8"
          >
            <option value="All">All (Employee & User)</option>
            <option value="Employee">Employee</option>
            <option value="User">User</option>
          </select>
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-8 flex justify-center items-center w-full relative">
            <ChartBarVertical />
          </div>
        </div>
      </section>
      <section className="flex mt-10">
        <div className="w-[50%] h-full ">
          <h1 className="text-heading-4 text-black mb-6">
            Top compromised URL(s){" "}
          </h1>
          <PieChartCard compromisedData={compromisedDataUrl} />
        </div>
        <div className="w-[50%] ml-6 h-full">
          <h1 className="text-heading-4 text-black mb-6">
            Top compromised User(s)
          </h1>
          <PieChartCard compromisedData={compromisedDataUser} />
        </div>
      </section>
      <section className="flex mt-10">
        <div className="w-[50%] h-full ">
          <h1 className="text-heading-4 text-black mb-6">
            Top antivirus compromised
          </h1>
          <div className="bg-white border-input-border border-2 rounded-xl p-8 items-center flex flex-col text-center">
            <div className="border-l-2 border-b-2 border-input-border w-full h-auto p-5">
              {antivirusData.map((data) => (
                <div className="mb-4" key={data.id}>
                  <ChartBarHorizontal
                    name={data.name}
                    number={data.number}
                    key={data.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[50%] ml-6 h-full">
          <h1 className="text-heading-4 text-black mb-6">
            Top malware compromised
          </h1>
          <PieChartCard compromisedData={compromisedDataUser} />
        </div>
      </section>
    </main>
  );
}
