"use client"
import React from 'react'
import Link from 'next/link'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
import poster from "../../../public/blur.jpg"
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import { useState } from 'react';
import WatchlistButton from '@/components/WatchlistButton';

const Series = () => {


  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  interface Episode {
    episodeNo: number;
    thumbnail: string;
    url: string;
  }
  
  interface Series {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    episodes?: Episode[];
  }

const [data, setData] = useState<Series[]>([]);

const serializedData = JSON.stringify(data);



  useEffect(() => {
    const seriesDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/admin/fetchAllSeries');
        // console.log(res.data.data);
        setData(res.data.data)
      } catch (error: any) {
        console.log("video fetching failed", error.message);
        toast.error(error.message);
      }
      finally {
        setIsLoading(false);
      }



    }

    seriesDetails()


  }, []);

  
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    const userDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setUser(res.data.data._id)
    }

    userDetails()

    
  }, []);


  return (
    <div className='md:ml-24 flex items-start p-10 flex-wrap justify-center md:justify-start  w-screen gap-5'>

      { Array.isArray(data) && data.map((data) => (

        <div className='group relative flex justify-center h-40 w-60 ' key={data.title}>

          <Image src={ data?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  ' height={400} width={600} />

          <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-10  '>{data.title}</p>

          <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute left-6 bottom-3 z-20'>

            <Link href ={`/Series/${data._id}`}> <PlayArrowIcon />Open</Link>

          </Button>
         

             <div className='absolute bottom-3 right-6 z-10  transition-opacity group-hover:opacity-100 opacity-0 '><WatchlistButton userId={user} videoId={data._id} videoType="series"  /></div>

          

          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>
          

        </div>

      ))}

      <div className='mt-60'></div>

    </div>
  )
}

export default Series
