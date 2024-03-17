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
      barPercentage: 0.6,
    },
  ],
};

export default function ChartBarVerticalStealer() {
  return (
    <>
      <Bar options={options} data={data} className="mt-12" />
    </>
  );
}
