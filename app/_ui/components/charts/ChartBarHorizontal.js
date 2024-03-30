import clsx from "clsx";

export default function ChartBarHorizontal({
  name,
  number,
  isMalware,
  isAntivirus,
  isHighest,
  datasets,
}) {
  return (
    <div className={clsx(`flex items-center `)}>
      <div
        className={clsx(
          `w-[${number}%] rounded-tr-lg rounded-br-lg   h-[28px]  flex items-center `,
          isAntivirus && "bg-blue-chart",
          isMalware && "bg-gold-chart"
        )}
      >
        <div className={``}></div>
        <p className={clsx("ml-4 text-white text-SM-normal")}>{name}</p>
      </div>
      <p className="text-black text-SM-normal ml-3">{number}</p>
    </div>
  );
}
