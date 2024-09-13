
"use client";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopSeries from "@/components/TopSeries";
import TopMovies from "@/components/TopMovies";

import { useEffect, useState } from "react";
import Watchlist from "@/components/Watchlist";




export default function Home() {
  // const router = useRouter()
  // const logout = async () => {
  //   try {
  //     await axios.get("/api/users/logout")
  //     toast.success("Logout Successful")
  //     router.push("/Login")
  //   } catch (error: any) {

  //     console.log(error.message);

  //     toast.error(error.message)

  //   }
  // }

  const [data, setData] = useState<string>("");
  useEffect(() => {
    const userDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data._id)
    }

    userDetails()

    
  }, []);
  return (

    // <main className="flex flex-col md:flex-row">
    //   <div className="fixed left-0 top-0 z-10"><NavbarMD/></div>

    //   <LogoUser/>
    //   <div className="md:w-full md:ml-24"><HeroSection/></div>




    //  <Navbar/> 
    // </main>
    <main className="w-[100%]">

      <div className="w-full flex">

        {/* <div className="fixed hidden md:block left-0 top-0 z-10"><NavbarMD /></div> */}

        <div className="w-full relative md:ml-24 flex flex-col overflow-x-hidden">
          
          <HeroSection />


          <Watchlist userId={data}/>
         
         
          <TopSeries/>
          <TopMovies />
          
          


          {/* <Navbar /> */}
          
          <div className="h-20 md:h-0"></div>




        </div>
      </div>

    </main>
  );
}


