import clsx from "clsx";

export default function ChartBarHorizontal({ name, number }) {
  return (
    <div className={clsx(`flex items-center w-[${number}%]`)}>
      <span
        className={clsx(
          ` w-full rounded-tr-lg rounded-br-lg bg-blue-chart h-[28px]  flex items-center `
        )}
      >
        <p className="ml-4 text-white text-SM-normal">{name}</p>
      </span>
      <p className="text-black text-SM-normal ml-3">{number}</p>
    </div>
  );
}
