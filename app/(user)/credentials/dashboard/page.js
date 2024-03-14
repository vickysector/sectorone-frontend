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
import { useState } from "react";
import { Select, ConfigProvider } from "antd";

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

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <main>
      <section>
        <h1 className="text-heading-2 text-black mb-4">Overview</h1>
        <div className="bg-white  p-12 rounded-xl">
          <div className="flex items-center">
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
          <div className="mt-8 flex justify-between">
            {dataOverview.map((data) => (
              <OverviewCard
                key={data.id}
                descriptions={data.desc}
                image={data.imageLink}
                total={data.total}
              />
            ))}
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
              defaultValue="2024"
              style={{ width: 91 }}
              onChange={handleChange}
              options={[
                { value: "2024", label: "2024" },

                { value: "2023", label: "2023" },
              ]}
            />

            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={handleChange}
              options={[
                { value: "all", label: "All (Employee & User)" },
                { value: "user", label: "User" },
                { value: "employee", label: "Emlpoyee" },
              ]}
              className="ml-8"
            />
          </ConfigProvider>
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
                    isAntivirus={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[50%] h-full ml-6 ">
          <h1 className="text-heading-4 text-black mb-6">
            Top malware compromised
          </h1>
          <div className="bg-white border-input-border border-2 rounded-xl p-8 items-center flex flex-col text-center">
            <div className="border-l-2 border-b-2 border-input-border w-full h-auto p-5">
              {malwareData.map((data) => (
                <div className="mb-4" key={data.id}>
                  <ChartBarHorizontal
                    name={data.name}
                    number={data.number}
                    isMalware={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
