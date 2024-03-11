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



export default function Home() {
  const router = useRouter()
  const logout = async ()=>{
      try {
        await axios.get("/api/users/logout")
        toast.success("Logout Successful")
        router.push("/Login")
      } catch (error:any) {

        console.log(error.message);

        toast.error(error.message)
        
      }
  }
  return (
    
    <main className="flex flex-col md:flex-row">
      <div className="fixed left-0 top-0 z-10"><NavbarMD/></div>
      
      <LogoUser/>
      <div className="md:w-full md:ml-24"><HeroSection/></div>
     



     <Navbar/> 
    </main>
  );
}


