import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

const page = () => {
    return (
        <div className=' h-screen w-screen overflow-hidden flex text-foreground'>
            <div className=' hidden md:block h-screen w-[50vw] bg-lime-300'></div>
            <div className=' h-screen w-screen  md:w-[50vw] bg-background text-foreground flex justify-center items-center '>
                <div className='   border-border   h-[75vh] w-[70vw] sm:w-[40vw] md:w-[32vw] flex flex-col justify-center  gap-5'>
                    <h6 className=' text-xl font-bold'>Create an account</h6>
                    <div><p className=' text-sm font-semibold'>Your email</p>
                        <Input type="email" placeholder="Email" /></div>
                    <div><p className=' text-sm font-semibold'>Password</p>
                        <Input type="email" placeholder="Password" /></div>
                    <div><p className=' text-sm font-semibold'>Confirm password</p>
                        <Input type="email" placeholder="Confirm password" />
                    </div>
                    <Button>Create an account</Button>
                    <p className=' text-sm'>Already have an account?<Button asChild variant="link">
                        <Link href="/Login">Login</Link>
                    </Button></p>

                </div>
            </div>

        </div>
    )
}

export default page
