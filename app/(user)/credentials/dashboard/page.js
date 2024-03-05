"use client";

import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import ChartBarVertical from "@/app/_ui/components/charts/ChartBarVertical";
import Chunk from "@/app/_ui/components/compromised/chunk";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3, 11, 8, 6, 18],
      backgroundColor: [
        "#1677FF",
        "#FFD591",
        "#69B1FF",
        "#95DE64",
        "#13C2C2",
        "#A0D911",
        "#597EF7",
        "#52C41A",
        "#FAAD14",
        "#FADb14",
      ],
      borderColor: [
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
      ],
      borderWidth: 1,
    },
  ],
};

const compromisedData = [
  {
    key: 1,
    data: "http://Sector.com/Signup/Regform",
    color: "blue-chart",
  },
  {
    key: 2,
    data: "http://Sector.com/Signup/Regform",
    color: "orange-3-chart",
  },
  {
    key: 3,
    data: "http://Sector.com/Signup/Regform",
    color: "blue-4-chart",
  },
  {
    key: 4,
    data: "http://Sector.com/Signup/Regform",
    color: "green-4-chart",
  },
  {
    key: 5,
    data: "http://Sector.com/Signup/Regform",
    color: "cyan-6-chart",
  },
  {
    key: 6,
    data: "http://Sector.com/Signup/Regform",
    color: "lime-6-chart",
  },
  {
    key: 7,
    data: "http://Sector.com/Signup/Regform",
    color: "geekblue-5-chart",
  },
  {
    key: 8,
    data: "http://Sector.com/Signup/Regform",
    color: "success-chart",
  },
  {
    key: 9,
    data: "http://Sector.com/Signup/Regform",
    color: "gold-chart",
  },
  {
    key: 10,
    data: "http://Sector.com/Signup/Regform",
    color: "gold-2-chart",
  },
];

export default function UserDashboardPage() {
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
          <button>2024</button>
          <button>All (Employee & User)</button>
          <div className="border-2 border-input-border rounded-[16px] mt-4 p-8 flex justify-center items-center w-full relative">
            <ChartBarVertical />
          </div>
        </div>
      </section>
      <section className="flex mt-8">
        <div className="w-[50%] h-full ">
          <h1>Top compromised URL(s) </h1>
          <div className="bg-white border-input-border border-2 rounded-lg p-8 items-center flex flex-col text-center">
            <div className=" h-[300px]">
              <Doughnut data={data} />
            </div>
            <div className="mt-8 self-start">
              {compromisedData.map((data, index) => (
                <Chunk key={data.key} level={data.color}>
                  {data.data}
                </Chunk>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[50%] ml-6 h-full">
          <h1>Top compromised User(s)</h1>
          <div className="bg-white border-input-border border-2 rounded-lg p-8 flex items-center justify-center">
            <Doughnut data={data} />
          </div>
        </div>
      </section>
    </main>
  );
}
