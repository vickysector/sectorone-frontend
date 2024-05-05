"use client";

import { AuthButton } from "@/app/_ui/components/buttons/AuthButton";
import { ExecutiveProtectionInfo } from "@/app/_ui/components/cards/ExecutiveProtectionInfo";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import PasswordIcon from "@mui/icons-material/Password";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsScanNow,
  setScannedEmail,
} from "@/app/_lib/store/features/ExecutiveProtections/ScanEmailSlices";

const informations = [
  {
    id: 1,
    icon: WebAssetIcon,
    title: "What is the dark web?",
    descriptions:
      "The dark web is a part of the internet that allows people to hide their identity and location from others as well as from law enforcement. As a result, the dark web can be used to sell stolen personal info.",
  },
  {
    id: 2,
    icon: CoronavirusIcon,
    title: "What is malware?",
    descriptions: `"Malicious software" is a type of software designed to damage computers. Malicious software can steal sensitive information from your computer, slow it down, or even send fake emails from your email account without your knowledge.`,
  },
  {
    id: 3,
    icon: ReportGmailerrorredIcon,
    title: "What is a phishing attack?",
    descriptions: `Phishing is usually done through emails, advertisements, or through sites that look similar to sites you already use. For example, you may get an email that looks like it's from a bank asking you to confirm a bank account number.`,
  },
  {
    id: 3,
    icon: PasswordIcon,
    title: "Tips to create a strong password",
    descriptions: `Using the same password over and over again can be risky. If someone gets your password for one of your accounts, they can use that password to control your email accounts, social media profiles, and even your money.`,
  },
];

export default function ExecutiveProtections() {
  const [email, setEmail] = useState("");

  const canSend = email;
  const dispatch = useDispatch();

  const handleScanNow = () => {
    if (canSend) {
      dispatch(setIsScanNow(true));
      dispatch(setScannedEmail(email));
    }
  };

  return (
    <main>
      <section className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[64px] ">
        <div>
          <h1 className="text-heading-3 text-black">
            Has your personal data been exposed?
          </h1>
          <h2 className="text-Base-normal text-text-description mt-[12px]">
            Scan your primary email to see your digital footprint.
          </h2>
        </div>
        <div className="mt-[32px] w-full">
          <div className="flex text-center justify-center items-center">
            <input
              type="text"
              className="rounded-md px-3 py-[5px] border-input-border border-2 w-[50%] text-LG-normal text-black"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="ml-4">
              <AuthButton
                value={"Scan now"}
                agreements={canSend}
                onClick={handleScanNow}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md text-center p-[64px] mt-8 ">
        <h1 className="text-heading-4 text-black">Looking to learn more?</h1>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {informations.map((data) => {
            const Icon = data.icon;

            return (
              <div key={data.id}>
                <ExecutiveProtectionInfo
                  Icon={Icon}
                  title={data.title}
                  descriptions={data.descriptions}
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
