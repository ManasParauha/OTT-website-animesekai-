"use client"
import React from 'react'
import Image from 'next/image'
import poster from "../../public/blur.jpg"
import { Button } from "@/components/ui/button"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { useState } from 'react'
import WatchlistButton from './WatchlistButton'









// interface DataItem {
//   title: string;
//   description: string;
//   thumbnail: string; // Optional property (can be undefined)
//   url: string;
//   episode:Number
// }

// React.useState<DataItem[]>([])



const TopSeries = () => {
  // const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<
    {
      seriesTitle: string,
      thumbnail: string,
      episodeNo: number,
      url: string,
      id: string,
      _id: string
    }[]>([])


  useEffect(() => {
    const seriesDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/admin/fetchSeriesHome1');
        // console.log(res.data.data);
        setData(res.data)
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

    <div className='flex flex-col gap-3 w-full mt-4 '>

      <h6 className='text-3xl font-bold'>
        Top Series
      </h6>



      <div className='flex overflow-x-auto h-48 hidescroll w-full gap-2 '>



        {Array.isArray(data) && data.map((data) => (<div key={data?._id} className='group relative flex justify-center h-40 w-60 '>

          <Image src={data?.thumbnail || poster} alt='#' className='min-h-40 min-w-60' height={400} width={600} />

          <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-20'>{data?.seriesTitle || "title"}</p>

          <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex left-6 absolute bottom-3 z-20'> <Link href={
            {
              pathname: '/Player',
              query: data
            }
          }> <PlayArrowIcon /> Play Now</Link></Button>

          <div className='absolute bottom-3 right-6 z-10  transition-opacity group-hover:opacity-100 opacity-0 ' >

            {user && (
              <WatchlistButton userId={user} videoId={data.id} videoType={"series"} />
            )}

          </div>


          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

        </div>))}






      </div>



    </div >
  )
}

export default TopSeries
