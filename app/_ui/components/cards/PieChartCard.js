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

export default function PieChartCard({ compromisedData }) {
  return (
    <>
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
    </>
  );
}
