import clsx from "clsx";

export default function OutlineButton({ isActive, value, total }) {
  return (
    <>
      <button
        className={clsx(
          " pb-3 [&:not(:first-child)]:ml-6",
          isActive
            ? "border-b-2 border-primary-base text-Base-strong text-primary-base"
            : " text-text-description text-Base-normal"
        )}
      >
        {value} ({total})
      </button>
    </>
  );
}
