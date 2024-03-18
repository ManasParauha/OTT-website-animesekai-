"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import poster from "../../../public/Poster.jpg"

const page = () => {
  const router = useRouter();
  const [user,setUser] = React.useState({
    email:"",
    password:""
  })
  const onLogin = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/users/login",user)
      console.log("login succesfull", response.data)
      toast.success("Login success");
      router.push("/")
    } catch ( error:any) {

      console.log("Login failed",error.message);
      toast.error(error.message);
      
    }
    finally{
      setLoading(false);
    }
  }
  const [loading, setLoading] = React.useState(false);
  return (
    <div className=' h-screen w-screen overflow-hidden flex text-foreground'>
      <div className=' hidden md:block h-screen w-[50vw] bg-black'>
        <Image
        src={poster}
        className=' h-screen w-[50vw]  object-contain'
        alt='poster-image'
        />
      </div>
      <div className=' h-screen w-screen md:w-[50vw] bg-background text-foreground flex justify-center items-center flex-col '>
      {loading? (<Button disabled >
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>) : (<Button disabled  className=' invisible'>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>)}
        <div className=' mr-4 sm:mr-0 border-border h-[75vh] w-[60vw] sm:w-[44vw] md:w-[32vw] flex flex-col justify-center  gap-5'>

          <h6 className=' text-xl font-bold'>Sign in to your account</h6>

          <div><p className=' text-sm font-semibold'>Your email</p>
            <Input type="email" value={user.email} placeholder="Email"  onChange={(e) => setUser({...user, email: e.target.value})} /></div>
          <div><p className=' text-sm font-semibold'>Password</p>
            <Input type="password" value={user.password} placeholder="Password"  onChange={(e) => setUser({...user, password: e.target.value})} /></div>
            <div className='flex flex-row-reverse'>
            <Button asChild variant="link">
                        <Link href="/Login">Forgot password?</Link>
                    </Button>
            </div>
            <Button onClick={onLogin}>Sign in</Button>
            <p className=' text-sm'>Don't have a account yet?<Button asChild variant="link">
                        <Link href="/Signup">Sign up</Link>
                    </Button></p>

        </div>
      </div>
    </div>
  )
}

export default page
