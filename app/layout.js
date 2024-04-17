import "./globals.css";
import localFont from "next/font/local";

const myFont = localFont({
  src: [
    {
      path: "./../public/fonts/SFPRODISPLAYREGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../public/fonts/SFPRODISPLAYSEMIBOLD.ttf",
      weight: "600",
      style: "semi-bold",
    },
  ],
});

export const metadata = {
  title: "Sector One",
  description: "Securing Your Digital World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  );
}
