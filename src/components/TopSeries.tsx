"use client"
import React from 'react'
import Image from 'next/image'
import poster from "../../public/blur.jpg"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import axios from 'axios';
import { useEffect } from 'react';
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

interface props {
  onWatchlistChange ?: () => void
}

function TopSeriesSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='relative h-40 w-60 min-w-60 overflow-hidden'>
          <Skeleton className='h-full w-full rounded-none' />
          <div className='absolute inset-0 bg-gradient-to-t from-background/70 to-transparent' />
          <Skeleton className='absolute left-4 top-4 h-6 w-32' />
          <Skeleton className='absolute bottom-4 left-4 h-9 w-28' />
        </div>
      ))}
    </>
  );
}

const TopSeries = ({onWatchlistChange}: props)  => {
  // const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<
    {
      title: string,
      description: string,
      thumbnail: string,
      episodes: {
        episodeNo: number,
        thumbnail: string,
        url: string,
      }[],
      _id: string,
    }[]>([])


  useEffect(() => {
    const seriesDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/admin/fetchSeriesHome');
        setData(res.data.data || [])
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



        {isLoading ? <TopSeriesSkeleton /> : Array.isArray(data) && data.map((data) => (<div key={data?._id} className='group relative flex justify-center h-40 w-60 '>

          <Image src={data?.thumbnail || poster} alt='#' className='min-h-40 min-w-60' height={400} width={600} />

          <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-20'>{data?.title || "title"}</p>

          <div className='absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button asChild className='min-w-0 flex-1 gap-2'>
              <Link href={`/Series/${data._id}`}>
                <OpenInNewIcon /> Open Series
              </Link>
            </Button>

            {user && (
              <WatchlistButton userId={user} videoId={data._id} videoType={"series"} onWatchlistChange={onWatchlistChange} />
            )}

          </div>


          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

        </div>))}






      </div>



    </div >
  )
}

export default TopSeries
