import Image from "next/image";
import { EyeOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <main className="h-auth-screen -500 flex relative">
      <section className="flex-1 flex flex-col items-center justify-center h-full w-full ">
        <div className="">
          <h1 className="text-heading-1">Create password</h1>
          <p className="text-LG-normal text-text-description mt-[8px] mb-8">
            To get started, let’s set up a strong password for your account
          </p>

          <form action="">
            <div className="bg-input-container relative">
              <input
                type="password"
                className=" w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
                placeholder="Password"
              />
              <EyeOutlined
                className="absolute top-[50%] right-4 translate-y-[-50%]"
                style={{ color: "#00000040" }}
              />
            </div>
            <div className=" mt-4 text-right relative">
              <input
                type="password"
                className="  w-full bg-input-container py-1.5 px-3 border-input-border border-2 rounded-lg text-Base-normal"
                placeholder="Retype password"
              />
              <EyeOutlined
                className="absolute top-[50%] right-4 translate-y-[-50%]"
                style={{ color: "#00000040" }}
              />
            </div>

            <div className="mt-4 mb-8 ">
              <label for="agreements" className="flex items-center mr-1.5">
                <input
                  type="checkbox"
                  name=""
                  id="agreements"
                  value="I agree to the Terms & Conditions and Privacy Policy"
                  className="accent-primary-base bg-white text-Base-normal"
                />
                <p className="text-Base-normal ml-1.5">
                  I agree to the Terms & Conditions and Privacy Policy
                </p>
              </label>
            </div>
          </form>
        </div>
      </section>
      <section className="flex-1 bg-primary-200 w-full h-full flex items-center justify-center">
        <Image
          src={"/images/sector_image_auth_lock.svg"}
          width={640}
          height={640}
          alt="hero image auth"
        />
      </section>
    </main>
  );
}
