"use client";

import clsx from "clsx";
import { useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

export default function Chunk({ children, level }) {
  const [show, setShow] = useState(false);

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
          "bg-white shadow-md p-3 rounded-lg flex items-center justify-between absolute top-[-50px] left-[-50px] w-full",
          !show ? "hidden" : "show"
        )}
      >
        {children}
        <CloseCircleOutlined onClick={handleCloseShow} />
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
