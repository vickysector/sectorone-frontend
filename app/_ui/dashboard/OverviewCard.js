import Image from "next/image";

export default function OverviewCard({ image, total, descriptions }) {
  return (
    <>
      <div className="bg-white border-2 border-input-border rounded-lg p-4 flex items-center w-full [&:not(:last-child)]:mr-4 ">
        <Image alt="logo" src={image} width={48} height={48} />
        <div className="ml-4">
          <h1 className="text-black text-heading-2">{total}</h1>
          <p className="text-text-description text-LG-normal">{descriptions}</p>
        </div>
      </div>
    </>
  );
}
