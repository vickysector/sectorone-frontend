import Image from "next/image";
import { DownloadOutlined } from "@ant-design/icons";

export default function ExportButton({ onClick }) {
  return (
    <button
      className="py-2 px-5 flex items-center bg-blue-export cursor-pointer rounded-lg"
      onClick={onClick}
    >
      <DownloadOutlined style={{ color: "white" }} />
      <p className="ml-3 text-white text-LG-normal">Export CSV</p>
    </button>
  );
}
