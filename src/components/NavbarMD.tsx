"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/logo.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TvIcon from '@mui/icons-material/Tv';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LogoutIcon from '@mui/icons-material/Logout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import poster from "../../public/blur.jpg"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Logo1 from "../../public/Logo1.png"
import Logo2 from "../../public/Logo2.png"

const NavbarMD = () => {

  const { setTheme } = useTheme()

  const router = useRouter()


  const [data, setData] = React.useState("Username");
  const [photo, setPhoto] = React.useState("");

  useEffect(() => {
    const userDetails = async () => {
      const res = await axios.get('/api/users/me');
      console.log(res.data);
      setData(res.data.data.username)
      setPhoto(res.data.data.photo)
    }

    userDetails()


  }, []);




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
    <nav className=' bg-background/65 text-foreground h-screen w-24 hidden md:flex flex-col  items-center  justify-around hover:w-48 transition-all group  ' >


      <Image src={Logo1} alt='Logo' height={60} width={60} />



      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className='flex gap-3 p-5'
          ><Image src={photo || poster} alt='profile' height={30} width={30} className=' rounded-full' /> <p className='hidden group-hover:block transition '>{data === "Username" ? "Username" : `${data}`}</p></Button>
        </SheetTrigger>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
             
         
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value={data === "Username" ? "Username" : `${data}`} className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ul className='flex flex-col gap-12'>

        <Link href="/search"><li className='flex gap-6 font-semibold'><SearchIcon /><p className=' transition hidden group-hover:block cursor-pointer'>Search</p></li></Link>

        <Link href="/"><li className='flex gap-6 font-semibold '><HomeIcon /> <p className=' transition hidden group-hover:block cursor-pointer'>Home</p></li></Link>

        <Link href="/Hub"><li className='flex gap-6 font-semibold '><AddCircleIcon/> <p className=' transition hidden group-hover:block cursor-pointer'>Hub</p></li></Link>

        <Link href="/Series"><li className='flex gap-6 font-semibold' ><TvIcon /> <p className=' transition hidden group-hover:block cursor-pointer'>Series</p></li></Link>

        <Link href="/Movies"><li className='flex gap-6 font-semibold'><MovieCreationIcon /> <p className=' transition hidden group-hover:block cursor-pointer'>Movies</p></li></Link>


      </ul>

      <Button onClick={logout} ><LogoutIcon /><p className='transition hidden group-hover:block'>Logout</p></Button>

    </nav>

  )
}

export default NavbarMD
