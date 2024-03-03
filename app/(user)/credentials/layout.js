import Sidenav from "@/app/_ui/dashboard/Sidenav";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  return (
    <main className="">
      <nav className="py-1.5 px-8 flex items-center justify-between">
        <Image
          src={"/images/sector_logo.png"}
          alt="Logo Sector"
          width={92}
          height={38}
        />
        <div className="flex items-center">
          <Image
            src={"/images/sector_notification.svg"}
            alt="Notif"
            width={22}
            height={22}
            className="mr-5"
          />
          <Image
            src={"/images/sector_avatar.svg"}
            alt="Avatar Profile"
            width={28}
            height={28}
          />
        </div>
      </nav>
      <section className="bg-input-container flex">
        <aside className=" h-auth-screen w-[230px] flex-none ">
          <Sidenav />
        </aside>
        <div className="bg-orange-600 flex-grow">{children}</div>
      </section>
    </main>
  );
}
