import { dataOverview } from "@/app/_lib/TempDataOverview";
import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";
import CompromiseButton from "@/app/_ui/components/buttons/CompromiseButton";
import OutlineButton from "@/app/_ui/components/buttons/OutlineButton";
import OverviewCard from "@/app/_ui/dashboard/OverviewCard";
import "@/app/_ui/CheckboxCustom2.css";

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

            <div className="mt-8">
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
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
