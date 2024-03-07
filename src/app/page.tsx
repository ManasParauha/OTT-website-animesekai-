"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import NavbarMD from "@/components/NavbarMD";



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
    
    <main className="flex ">
      <NavbarMD/>
     
      
    </main>
  );
}


