"use client";

import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import ChartBarVertical from "@/app/_ui/components/charts/ChartBarVertical";

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
    </main>
  );
}
