"use client";

import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    legend: {
      display: false,

      position: "top",
      align: "start",
      labels: {
        usePointStyle: true,
        boxHeight: 11,
        boxWidth: 25,
        font: {
          color: "#000000",
          size: "16px",
          lineHeight: "24px",
          weight: "500",
        },
      },
    },
    layout: {
      padding: {
        top: 20, // Adjust the top padding as needed
        bottom: 10, // Adjust the bottom padding as needed
      },
    },
    afterFit: function (chart, opt) {
      chart.plugins.register({
        afterFit: function () {
          this.height = this.height + 150;
        },
      });
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Okt",
  "Nov",
  "Dec",
];

const data = {
  labels,
  datasets: [
    {
      label: "Employees",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "#FAAD14",
      borderRadius: 5,
    },
    {
      label: "Users",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "#1677FF",
      borderRadius: 5,
    },
  ],
};

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
            <div className="absolute top-[32px] left-[32px] flex items-center">
              {" "}
              <span className="w-[16px] h-[16px] bg-orange-chart block rounded-[50%]"></span>{" "}
              <p className="ml-3 text-LG-normal text-black">Employee</p>{" "}
            </div>
            <div className="absolute top-[32px] left-[150px] flex items-center">
              {" "}
              <span className="w-[16px] h-[16px] bg-blue-chart block rounded-[50%]"></span>{" "}
              <p className="ml-3 text-LG-normal text-black">Users</p>{" "}
            </div>
            <Bar options={options} data={data} className="mt-12" />
          </div>
        </div>
      </section>
    </main>
  );
}
