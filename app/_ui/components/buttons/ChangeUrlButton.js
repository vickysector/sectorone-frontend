import clsx from "clsx";

export default function ChangeUrlButton({ children, disabled, onClick }) {
  return (
    <button
      className={clsx(
        "py-2 px-4 bg-input-container border-input-border border-2 rounded-lg text-LG-normal text-primary-base ",
        !disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer opacity-100"
      )}
      disabled={!disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
