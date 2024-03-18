"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavbarMD from "@/components/NavbarMD";
import Navbar from "@/components/Navbar";
import LogoUser from "@/components/LogoUser";
import HeroSection from "@/components/HeroSection";
import TopSeries from "@/components/TopSeries";
import TopMovies from "@/components/TopMovies";


export default function Home() {
  const router = useRouter()
  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("Logout Successful")
      router.push("/Login")
    } catch (error: any) {

      console.log(error.message);

      toast.error(error.message)

    }
  }
  return (

    // <main className="flex flex-col md:flex-row">
    //   <div className="fixed left-0 top-0 z-10"><NavbarMD/></div>

    //   <LogoUser/>
    //   <div className="md:w-full md:ml-24"><HeroSection/></div>




    //  <Navbar/> 
    // </main>
    <main className="w-[100%]">

      <div className="w-full flex">
        <div className="fixed hidden md:block left-0 top-0 z-10"><NavbarMD /></div>
        <div className="w-full relative md:ml-24 flex flex-col overflow-x-hidden">
          <LogoUser />
          <HeroSection />
          <TopMovies />
          <TopSeries/>


          <Navbar />
          <div className="h-20 md:h-0"></div>




        </div>
      </div>

    </main>
  );
}


