"use client"
import React from 'react'
import Image from 'next/image'
import poster from '../../public/blur.jpg'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useEffect } from 'react';
import Link from 'next/link';

type HeroItem = {
  type?: "movie" | "series";
  id?: string;
  title: string;
  seriesTitle?: string;
  description: string;
  thumbnail: string;
  url?: string;
  episodeNo?: number;
};

function HeroSkeleton() {
  return (
    <div className='w-full h-72 md:h-96 relative overflow-hidden bg-background'>
      <Skeleton className='absolute inset-0 h-full w-full rounded-none' />
      <div className='absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20' />
      <div className='absolute top-20 sm:top-9 md:top-36 left-7 flex w-[80%] sm:w-[60%] md:w-[50%] flex-col gap-4'>
        <Skeleton className='h-12 w-64 max-w-full sm:h-14 sm:w-80' />
        <div className='hidden flex-col gap-2 sm:flex'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-11 w-24' />
          <Skeleton className='h-11 w-24' />
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {

  const [data,setData] = React.useState<HeroItem | null>(null);
 
     
  useEffect(() => {
    const heroDetails = async () => {
      try {
        const res = await axios.get('/api/admin/fetchHeroVideo');
        setData(res.data.data || null)
      } catch (error) {
        console.log("hero fetching failed", error);
        setData(null);
      }
    }

    heroDetails()

    
  }, []);

  if (!data) {
    return <HeroSkeleton />;
  }

  const hero = data;
  const hasPlayableMedia = Boolean(hero.url);

  return (
    <div className='w-full h-72 md:h-96 relative overflow-hidden  '>
      <Image
        src={hero.thumbnail || poster}
        alt={hero.title || "Anime Sekai"}
        fill
        priority
        className='object-cover opacity-[0.7]'
      />
      <div className='absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent' />

      <div className='absolute top-20 sm:top-9 md:top-36 left-7 flex flex-col justify-center text-foreground w-[80%] sm:w-[60%] md:w-[50%] gap-4'>
        <h6 className=' font-bold text-4xl sm:text-5xl '>{hero.title}</h6>
        <p className='font-semibold h-16 w-full md:h-20 text-ellipsis  overflow-hidden text-sm text-justify sm:block hidden'> {hero.description}
        </p>
        <div className='flex  gap-2 w-full'>
          {hasPlayableMedia && (
            <Button asChild>
              <Link href={
                {
                  pathname:'/Player',
                  query: hero
                }
              }> <PlayArrowIcon className="mr-2 h-4 w-4" /> Play</Link>
            </Button>
          )}
          <Button variant="secondary"><InfoIcon className="mr-2 h-4 w-4"/>Info</Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
