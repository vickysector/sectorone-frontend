import NavLinks from "./nav-links";

export default function Sidenav() {
  return (
    <div className="h-full">
      <div className="pt-9 text-center px-5">
        {/* <div className="bg-blue-500 w-[50px] h-[50px] rounded-full absolute top-0 right-[-50px]"></div> */}
        <NavLinks />
      </div>
    </div>
  );
}
