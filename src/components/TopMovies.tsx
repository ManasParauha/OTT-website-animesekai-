import React from 'react'
import Image from 'next/image'
import poster from "../../public/blur.jpg"
import { Button } from "@/components/ui/button"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TopMovies = () => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<
  {title:string,
  description:string,
  thumbnail:string,
  url:string
  }[]>([])


  useEffect(() => {
    const movieDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/admin/fetchMoviesHome');
      // console.log(res.data.data);
      setData(res.data.data)
      } catch (error:any) {
        console.log("movie fetching failed",error.message);
        toast.error(error.message);
      }
      finally{
        setIsLoading(false);
      }



    }

    movieDetails()


  }, []);




  return (
    <div className='flex flex-col gap-3 w-full mt-4   '> 

    <h6 className='text-3xl font-bold'>Top Movies</h6>

    <div className='flex overflow-x-auto h-48 hidescroll w-full gap-2 '>


      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={data[0]?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  '  height={400} width={600} />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><Link href={
            {
              pathname:'/Player',
              query:data[0]
            }
          }> <PlayArrowIcon /> Play Now</Link></Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      <div className='group relative flex justify-center h-40 w-60  '>
        <Image src={poster} alt='#' className='min-h-40 min-w-60  ' />
        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity  '></p>
        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><PlayArrowIcon/>Play Now</Button>
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

      </div>
      

    </div>
     
     
      
    </div>
  )
}

export default TopMovies
