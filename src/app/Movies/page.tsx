"use client"
import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast'
import Link from 'next/link';
import Image from 'next/image';
import poster from "../../../public/Poster.jpg"
import { Button } from '@/components/ui/button'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Movies = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<
        {
            title: string,
            description: string,
            thumbnail: string,
            url: string
        }[]>([])


    useEffect(() => {
        const movieDetails = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('/api/admin/fetchMoviesHome');
                // console.log(res.data.data);
                setData(res.data.data)
            } catch (error: any) {
                console.log("movie fetching failed", error.message);
                toast.error(error.message);
            }
            finally {
                setIsLoading(false);
            }



        }

        movieDetails()


    }, []);



    return (
        <div className='md:ml-24 flex items-start p-10 flex-wrap justify-center md:justify-start w-screen gap-5'>

            {data.map((data) => (

                <div className='group relative flex justify-center h-40 w-60 ' key={data.title}>

                    <Image src={data?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  ' height={400} width={600} />

                    <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-10  '>{data.title}</p>

                    <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'>

                        <Link href={
                            {
                                pathname: '/Player',
                                query: data

                            }
                        }> <PlayArrowIcon /> Play Now</Link>

                    </Button>

                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

                </div>

            ))}

        </div>
    )
}
  

export default Movies
