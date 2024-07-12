"use client";

import { useRouter, redirect } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";

export default function RecentPageDetails() {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  const detailsContentCyberAccack = useSelector(
    (state) => state.ransomwareDetailContent.content
  );
  const detailsTitleCyberAccack = useSelector(
    (state) => state.ransomwareDetailContent.title
  );

  // End of: Redux

  //   Start of: Handle function

  const handleBackToAllcyberattacks = () => {
    router.back();
  };

  //   End of: Handle function

  return (
    <main>
      <div className={clsx("flex items-center mb-4")}>
        <div onClick={handleBackToAllcyberattacks}>
          <ArrowBackIcon />
        </div>
        <h1 className="text-heading-2 text-black  ml-4">Details</h1>
      </div>
      <div className="bg-white rounded-lg mt-4">
        <section className="p-8">
          <h1 className={clsx("text-heading-3 text-black mb-4")}>
            {" "}
            {detailsTitleCyberAccack}{" "}
          </h1>
          <p className={clsx("text-Base-normal text-text-description")}>
            {" "}
            {detailsContentCyberAccack}{" "}
          </p>
        </section>
      </div>
    </main>
  );
}
