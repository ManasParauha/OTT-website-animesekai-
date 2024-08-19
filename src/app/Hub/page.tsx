"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import NavbarMD from '@/components/NavbarMD';
import Navbar from '@/components/Navbar';


const page = () => {
  return (
    <div className='flex'>
      <NavbarMD />
      <div className='h-screen w-screen flex-col  overflow-y-auto flex py-5 gap-2'>




        <div className=' h-[10vh] flex justify-center  '><Button className='w-[50vw]'>Upload</Button></div>


        <div className='text-foreground  h-[90vh] flex flex-col items-center w-full p-6   '>

          <div className='flex flex-col  items-start p-5 border-border border-2 gap-2  '>
            <h4 className=''>Manas Parauha</h4>
            <div className='w-full flex justify-center items-center'>
              <video height={300} width={300} controls src="https://videos.pexels.com/video-files/26214359/11939615_640_360_25fps.mp4"></video></div>
            <div className='flex flex-col gap-2'>

              <h4>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, debitis!
              </h4>
              <div className='flex gap-5 justify-start w-full '>
                <FavoriteBorderIcon />
                <ChatBubbleOutlineIcon />
                <SendIcon />
              </div>

            </div>
          </div>

        </div>

      </div>
      <Navbar />
    </div>
  )
}

export default page
