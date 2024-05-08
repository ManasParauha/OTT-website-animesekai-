import React, { useEffect, useState } from 'react'
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
const NavbarMD = () => {

    const router = useRouter()

 
    const [data,setData] = React.useState("Username");

    useEffect(() => {
        const userDetails = async () => {
            const res = await axios.get('/api/users/me');
            console.log(res.data);
            setData(res.data.data.username)
        }

        userDetails()
    
        
      }, []);




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
        <nav className=' bg-background/65 text-foreground h-screen w-24 hidden md:flex flex-col  items-center  justify-around hover:w-48 transition-all group  ' >


            <Image src={Logo} alt='Logo' height={60} width={60} />

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className='flex gap-3'
                    ><AccountCircleIcon /> <p className='hidden group-hover:block transition '>{data === "Username" ? "Username" : `${data}` }</p></Button>
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
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value="Pedro Duarte" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input id="username" value="@peduarte" className="col-span-3" />
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
                <li className='flex gap-6 font-semibold' ><TvIcon /> <p className=' transition hidden group-hover:block cursor-pointer'>Series</p></li>
                <li className='flex gap-6 font-semibold'><MovieCreationIcon /> <p className=' transition hidden group-hover:block cursor-pointer'>Movies</p></li>
            </ul>

            <Button onClick={logout} ><LogoutIcon/><p className='transition hidden group-hover:block'>Logout</p></Button>

        </nav>

    )
}

export default NavbarMD
