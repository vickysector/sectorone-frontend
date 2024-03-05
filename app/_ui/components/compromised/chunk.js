"use client";

import clsx from "clsx";
import copy from "copy-to-clipboard";
import { useState } from "react";
import { CloseCircleOutlined, CopyOutlined } from "@ant-design/icons";

export default function Chunk({ children, level }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    copy(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleOpenShow = () => {
    setShow(true);
  };

  const handleCloseShow = () => {
    setShow(false);
  };

  return (
    <main className="relative">
      <div
        className={clsx(
          "absolute right-[-60px] top-[-20px] bg-white p-2 border-2 border-input-border rounded-lg ",
          copied ? "visible" : "hidden"
        )}
      >
        <p className="text-Base-normal text-text-description">Copied!</p>
      </div>
      <div
        className={clsx(
          "bg-white shadow-md p-3 rounded-lg flex items-center justify-between absolute top-[-50px] left-[-50px]",
          !show ? "hidden" : "show"
        )}
      >
        {children}
        <CopyOutlined
          style={{ fontSize: "21px", color: "#FF6F1E" }}
          className="mr-2 ml-3 cursor-pointer"
          onClick={() => copyToClipboard(children)}
        />
        <CloseCircleOutlined
          onClick={handleCloseShow}
          style={{ fontSize: "21px", color: "#CF1322" }}
          className="cursor-pointer"
        />
      </div>

      <div
        className=" flex items-center mb-2 cursor-pointer"
        onClick={handleOpenShow}
      >
        {" "}
        <span
          className={clsx(
            "w-[16px] h-[16px]  block rounded-[50%]",
            `bg-${level}`
          )}
        ></span>{" "}
        <p className="ml-3 text-LG-normal text-black">{children}</p>{" "}
      </div>
    </main>
  );
}
