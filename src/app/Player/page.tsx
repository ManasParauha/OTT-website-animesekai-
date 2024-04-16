"use client"
import React from 'react'
import NavbarMD from "@/components/NavbarMD";
import Navbar from "@/components/Navbar";
import LogoUser from "@/components/LogoUser";
import Image from 'next/image';
import poster from '../../../public/blur.jpg'




// https://files.edgestore.dev/8ntc2l4n0afyxvtk/publicFiles/_public/81febc2c-dd14-41cc-9687-9667061ff3d2.mp4


const page = ({
    searchParams
}:{
searchParams:{
      title:string,
      description:string,
      episode?:number,
      url:string
}}
) => {
  
    return (
        <div className='flex bg-background'>

            <div className="fixed hidden md:block left-0 top-0 z-10"><NavbarMD /></div>
            <div className="w-full relative md:ml-32 flex flex-col overflow-x-hidden items-center ">
                <LogoUser />
                
                <video controls src={searchParams.url} className=' object-fill w-full h-[40vh]  sm:h-[50vh] md:w-[80vw] md:h-[70vh]  md:mt-10 sm:mt-16 mt-20 '></video>

                <div className='flex gap-2 mt-3 w-full md:ml-28'>
                    <Image src={poster} alt='Thumbnail' className='h-20 w-28'/>
                    <div className='flex gap-1 flex-col '>
                        <h6 className='text-foreground text-2xl font-semibold'>{searchParams.title}</h6>
                        <p className='text-muted-foreground text-sm'>Episode - {searchParams.episode}</p>
                    </div>

                </div>


                <Navbar />
                <div className="h-20 md:h-0"></div>




            </div>


        </div>
    )
}

export default page
