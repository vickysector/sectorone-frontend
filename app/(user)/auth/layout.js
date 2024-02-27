import Image from "next/image";

export default function UserAuthLayout({ children }) {
  return (
    <main>
      <nav>
        <Image
          src={"/images/sector_logo.png"}
          alt="Logo Sector"
          width={92}
          height={38}
        />
      </nav>
      <section>{children}</section>
    </main>
  );
}
