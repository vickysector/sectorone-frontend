"use client";

import { useRouter, redirect } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { convertDateFormat } from "@/app/_lib/CalculatePassword";
import { useEffect } from "react";

export default function RecentPageDetails() {
  // Start of: Redux

  const dispatch = useDispatch();
  const router = useRouter();

  const allDetailRansomware = useSelector(
    (state) => state.ransomwareAllDetailContent.allDataRansomware
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
          <section>
            <h2 className="text-heading-4 text-black mb-4">Date</h2>
            <div className="flex">
              <div className="basis-1/2">
                <h3 className="text-black text-LG-strong">Discovered</h3>
                <p className="text-LG-normal text-text-description ">
                  {" "}
                  {convertDateFormat(allDetailRansomware.discovered)}{" "}
                </p>
              </div>
              <div className="basis-1/2">
                <h3 className="text-black text-LG-strong">Published</h3>
                <p className="text-LG-normal text-text-description ">
                  {convertDateFormat(allDetailRansomware.published)}
                </p>
              </div>
            </div>
          </section>

          <div className="h-[1px] bg-input-border my-8"></div>

          <section>
            <h2 className="text-heading-4 text-black mb-4">Ransom details</h2>
            <div className="flex">
              <div className="basis-1/3">
                <div>
                  <h3 className="text-black text-LG-strong">Name</h3>
                  <p className="text-LG-normal text-text-description ">
                    {" "}
                    {allDetailRansomware && allDetailRansomware.group_name}{" "}
                  </p>
                </div>
                <div className="mt-6 break-words">
                  <h3 className="text-black text-LG-strong">URL</h3>
                  <p className="text-LG-normal text-text-description max-w-[330px] ">
                    {" "}
                    {allDetailRansomware &&
                    allDetailRansomware.post_url.length === 0 ? (
                      "-"
                    ) : (
                      <a
                        href={
                          allDetailRansomware && allDetailRansomware.post_url
                        }
                        className="underline"
                        target="_blank"
                      >
                        {" "}
                        {allDetailRansomware &&
                          allDetailRansomware.post_url}{" "}
                      </a>
                    )}
                  </p>
                </div>
              </div>
              <div className="basis-1/3">
                <div>
                  <h3 className="text-black text-LG-strong">Description</h3>
                  <p className="text-LG-normal text-text-description ">
                    {allDetailRansomware &&
                    allDetailRansomware.activity.length === 0
                      ? "-"
                      : allDetailRansomware && allDetailRansomware.activity}
                  </p>
                </div>
                <div className="mt-6 break-words">
                  <h3 className="text-black text-LG-strong">Proof</h3>
                  <p className="text-LG-normal text-text-description max-w-[330px] ">
                    {allDetailRansomware &&
                    allDetailRansomware.screenshot.length === 0 ? (
                      "-"
                    ) : (
                      <a
                        href={
                          allDetailRansomware && allDetailRansomware.screenshot
                        }
                        target="_blank"
                        className="underline"
                      >
                        {allDetailRansomware && allDetailRansomware.screenshot}
                      </a>
                    )}
                  </p>
                </div>
              </div>
              <div className="basis-1/3">
                <h3 className="text-black text-LG-strong">Title</h3>
                <p className="text-LG-normal text-text-description ">
                  {allDetailRansomware &&
                  allDetailRansomware.post_title.length === 0
                    ? "-"
                    : allDetailRansomware && allDetailRansomware.post_title}
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
