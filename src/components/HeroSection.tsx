"use client"
import React from 'react'
import Image from 'next/image'
import TestImage from '../../public/TestPoster.jpg'
import { Button } from "@/components/ui/button"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useEffect } from 'react';
import Link from 'next/link';



const HeroSection = () => {

  const [data,setData] = React.useState({
    title: "",
    description: "",
    thumbnail: "",
    url: "",
  });
 
     
  useEffect(() => {
    const videoDetails = async () => {
        const res = await axios.get('/api/admin/fetchHeroVideo');
        console.log(res.data);
        setData(res.data.data)
        
    }

    videoDetails()

    
  }, []);

  return (
    <div className='w-full h-72 md:h-96 relative overflow-hidden  '>
      
      <div className=' overflow-hidden'> <video  src={data.url} poster={data.thumbnail} autoPlay muted className='h-full w-full opacity-[0.7]'></video></div>



      <div className='absolute top-20 sm:top-9 md:top-36 left-7 flex flex-col justify-center text-foreground w-[80%] sm:w-[60%] md:w-[50%] gap-4'>
        <h6 className=' font-bold text-4xl sm:text-5xl '>{data.title}</h6>
        <p className='font-semibold h-16 w-full md:h-20 text-ellipsis  overflow-hidden text-sm text-justify sm:block hidden'> {data.description}
        </p>
        <div className='flex  gap-2 w-full'>
        <Button><Link href={
            {
              pathname:'/Player',
              query:data
            }
          }> <PlayArrowIcon className="mr-2 h-4 w-4" /> Play</Link></Button>
        <Button><InfoIcon className="mr-2 h-4 w-4"/>Info</Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
