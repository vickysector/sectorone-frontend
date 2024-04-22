import Image from "next/image";
import { DownloadOutlined } from "@ant-design/icons";
import clsx from "clsx";

export default function ExportButton({ onClick, disabled }) {
  return (
    <button
      className={clsx(
        "py-2 px-5 flex items-center bg-blue-export  rounded-lg",
        disabled === null
          ? "cursor-not-allowed opacity-30"
          : "cursor-pointer opacity-100"
      )}
      onClick={onClick}
      disabled={disabled === null}
    >
      {disabled === null ? (
        <p className="text-white text-LG-normal">Cannot Export</p>
      ) : (
        <>
          <DownloadOutlined style={{ color: "white" }} />
          <p className="ml-3 text-white text-LG-normal">Export CSV</p>
        </>
      )}
    </button>
  );
}
