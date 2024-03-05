import ChangeUrlButton from "@/app/_ui/components/buttons/ChangeUrlButton";

export default function UserDashboardPage() {
  return (
    <>
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
    </>
  );
}
