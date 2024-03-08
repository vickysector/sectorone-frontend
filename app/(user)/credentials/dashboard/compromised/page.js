import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import "@/app/_ui/CheckboxCustom2.css";
import clsx from "clsx";
import Image from "next/image";
import ExportButton from "@/app/_ui/components/buttons/ExportButton";

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
      <section className="mt-10">
        <h1 className="text-heading-4 text-black">Detail compromised</h1>
        <div className="mt-4 bg-white border-2 border-input-border rounded-lg">
          <section className="p-8 border-b-2 border-input-border ">
            <CompromiseButton isActive={true} total={300} value={"Employee"} />

            <CompromiseButton isActive={false} total={300} value={"User"} />

            <CompromiseButton
              isActive={false}
              total={100}
              value={"Third-party"}
            />

            <CompromiseButton isActive={false} total={100} value={"Device"} />
          </section>
          <section className="p-8">
            <OutlineButton
              isActive={true}
              total={100}
              value={"Data compromise "}
            />
            <OutlineButton isActive={false} total={100} value={"Validated "} />
            <OutlineButton isActive={false} total={100} value={"Bookmark "} />

            <div className="mt-8 ">
              <div className="flex items-center">
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="agreements"
                    value="I agree to the Terms & Conditions and Privacy Policy"
                    className=" text-Base-normal"
                  />
                  <label
                    htmlFor="agreements"
                    className="text-Base-normal ml-1.5 text-text-description"
                  ></label>
                </div>
                <div className="ml-4 bg-input-container border-input-border flex items-center justify-between border-t-2 border-b-2 border-r-2 rounded-lg w-[470px]">
                  <input
                    type="email"
                    className={clsx(
                      " bg-transparent  py-1.5 px-3  border-r-2  text-Base-normal w-full cursor-pointer "
                    )}
                    placeholder={"Search by URL/Email"}
                  />
                  <div className="px-3 cursor-pointer">
                    <Image
                      src={"/images/sector_image_search.svg"}
                      alt="search icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
                <div className="ml-auto ">
                  <ExportButton />
                </div>
              </div>
            </div>
          </section>
          <section>{/* TODO */}</section>
        </div>
      </section>
    </main>
  );
}
