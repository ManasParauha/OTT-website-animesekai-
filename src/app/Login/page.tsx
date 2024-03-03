import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

const page = () => {
  return (
    <div className=' h-screen w-screen overflow-hidden flex text-foreground'>
      <div className=' hidden md:block h-screen w-[50vw] bg-lime-300'></div>
      <div className=' h-screen w-screen md:w-[50vw] bg-background text-foreground flex justify-center items-center '>
        <div className=' mr-4 sm:mr-0 border-border h-[75vh] w-[60vw] sm:w-[44vw] md:w-[32vw] flex flex-col justify-center  gap-5'>

          <h6 className=' text-xl font-bold'>Sign in to your account</h6>

          <div><p className=' text-sm font-semibold'>Your email</p>
            <Input type="email" placeholder="Email" /></div>
          <div><p className=' text-sm font-semibold'>Password</p>
            <Input type="email" placeholder="Password" /></div>
            <div className='flex flex-row-reverse'>
            <Button asChild variant="link">
                        <Link href="/Login">Forgot password?</Link>
                    </Button>
            </div>
            <Button>Sign in</Button>
            <p className=' text-sm'>Don't have a account yet?<Button asChild variant="link">
                        <Link href="/Signup">Sign in</Link>
                    </Button></p>

        </div>
      </div>
    </div>
  )
}

export default page
