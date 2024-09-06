import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from '../lib/edgestore';
import NavbarMD from "@/components/NavbarMD";
import LogoUser from "@/components/LogoUser";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}> <EdgeStoreProvider><ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className=" w-full relative  flex flex-col overflow-x-hidden  ">

          <div className="fixed hidden md:block left-0 top-0 z-10 "><NavbarMD /></div>

          <LogoUser />

          {children}

          <Navbar />

          </div>

        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </ThemeProvider> </EdgeStoreProvider> </body>
    </html>
  );
}
