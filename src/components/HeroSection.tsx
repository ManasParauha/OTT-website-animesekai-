"use client"
import React from 'react'
import Image from 'next/image'
import TestImage from '../../public/TestPoster.jpg'
import { Button } from "@/components/ui/button"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useEffect } from 'react';



const HeroSection = () => {
  const [title,setTitle] = React.useState("");
  const [description,setDescription] = React.useState("");
  const [url,seturl] = React.useState("");
     
  useEffect(() => {
    const videoDetails = async () => {
        const res = await axios.get('/api/admin/fetchVideo');
        console.log(res.data);
        setTitle(res.data.data.title)
        setDescription(res.data.data.description)
        seturl(res.data.data.url)
        
    }

    videoDetails()

    
  }, []);

  return (
    <div className='w-full h-72 md:h-96 relative overflow-hidden  '>
      
      <div className=' overflow-hidden'> <video src={url} autoPlay muted className='h-full w-full opacity-[0.7]'></video></div>



      <div className='absolute top-20 sm:top-9 md:top-36 left-7 flex flex-col justify-center text-foreground w-[80%] sm:w-[60%] md:w-[50%] gap-4'>
        <h6 className=' font-bold text-4xl sm:text-5xl '>Demon Slayer</h6>
        <p className='font-semibold h-16 w-full md:h-20 text-ellipsis  overflow-hidden text-sm text-justify sm:block hidden'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium voluptas magni odio adipisci quos, in doloribus sapiente voluptate cum quidem reiciendis officia incidunt dolore dicta odit? Quia ratione quasi nam est nihil!
        </p>
        <div className='flex  gap-2 w-full'>
        <Button><PlayArrowIcon className="mr-2 h-4 w-4"/>Play</Button>
        <Button><InfoIcon className="mr-2 h-4 w-4"/>Info</Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
