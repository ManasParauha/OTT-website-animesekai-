"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={logout}>logout</Button>
    </main>
  );
}


