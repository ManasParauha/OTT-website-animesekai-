"use client"
import React, { use, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ReloadIcon } from "@radix-ui/react-icons"

const page = () => {

    const router = useRouter()

    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: ""
    })

    const onSignUp = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/users/signup", user)
            console.log("signup success", response.data)
            router.push("/Login");
        } catch (error) {
            console.log("sign up failed!", error)

        }
        finally {
            setLoading(false)
        }
    }
    const [loading, setLoading] = React.useState(false);
    return (
        <div className=' h-screen w-screen overflow-hidden flex text-foreground'>
            <div className=' hidden md:block h-screen w-[50vw] bg-lime-300'></div>
            <div className=' h-screen w-screen  md:w-[50vw] bg-background text-foreground flex justify-center items-center flex-col '>
                {loading ? (<Button disabled >
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>) : (<Button disabled className=' invisible'>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </Button>)}
                <div className='   border-border   h-[75vh] w-[70vw] sm:w-[40vw] md:w-[32vw] flex flex-col justify-center  gap-5'>
                    <h6 className=' text-xl font-bold'>Create an account</h6>
                    <div><p className=' text-sm font-semibold'>Username</p>
                        <Input type="text" value={user.username} placeholder="Username" onChange={(e) => setUser({ ...user, username: e.target.value })} /></div>
                    <div><p className=' text-sm font-semibold'>Your email</p>
                        <Input type="email" value={user.email} placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} /></div>
                    <div><p className=' text-sm font-semibold'>Password</p>
                        <Input type="password" value={user.password} placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} /></div>

                    <Button onClick={onSignUp}>Create an account</Button>
                    <p className=' text-sm'>Already have an account?<Button asChild variant="link">
                        <Link href="/Login">Login</Link>
                    </Button></p>

                </div>
            </div>

        </div>
    )
}

export default page
