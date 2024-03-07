import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";

export default function CompromisedDashboard() {
  return (
    <main>
      <h1 className="text-heading-2 text-black mb-4">Compromised</h1>
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
    </main>
  );
}
