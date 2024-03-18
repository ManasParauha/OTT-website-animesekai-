import React, { useEffect } from 'react'
import Image from 'next/image'
import Logo from "../../public/logo.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
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

const LogoUser = () => {

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
     <header className='md:hidden bg-background w-full h-16 flex  items-center p-5 justify-between'>
        <Image src={Logo} width={50} height={15} alt='Logo'/>
        
        <div className='flex gap-2'>
        
        <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className='flex gap-3'
                    ><AccountCircleIcon /> <p >{data === "Username" ? "Username" : `${data}` }</p></Button>
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
            <Button onClick={logout}  ><LogoutIcon/></Button>
        </div>
 
     </header>
  )
}

export default LogoUser
