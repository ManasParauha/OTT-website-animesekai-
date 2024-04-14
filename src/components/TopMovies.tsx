import React from 'react'
import Image from 'next/image'
import poster from "../../public/blur.jpg"
import { Button } from "@/components/ui/button"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const TopMovies = () => {
  return (
    <div className='flex flex-col gap-3 w-full mt-4   '> 

    <h6 className='text-3xl font-bold'>Top Movies</h6>

    <div className='flex overflow-x-auto h-48 hidescroll w-full gap-2 '>


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
