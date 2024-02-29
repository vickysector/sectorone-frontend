import clsx from "clsx";

export function AuthButton({ agreements }) {
  return (
    <button
      type="submit"
      className={clsx(
        "cursor-pointer w-full  py-1.5 px-3  rounded-lg text-Base-normal ",
        !agreements
          ? "cursor-not-allowed bg-input-container border-input-border border-2 text-text-disabled"
          : "bg-primary-base border-2 border-primary-base text-white"
      )}
      disabled={!agreements}
    >
      Create Password
    </button>
  );
}
