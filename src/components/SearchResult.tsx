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


const SearchResult = ({ query }: { query: string }) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<
        {
            title: string,
            description: string,
            thumbnail: string,
            episode: number,
            url: string
        }[]>([])

    useEffect(() => {
        const videoDetails = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get('/api/admin/fetchTopMovies');
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

        videoDetails()


    }, []);

    const filteredData = Array.isArray(data) ? data.filter((item) => {
        return item.title.toLowerCase().includes(query.toLowerCase());
    }) : [];

    console.log(data)

    return (
        <div>
            {Array.isArray(data) && data.length === 0 && (
                <p>No video files found</p>
            )}

            <div className='flex w-full mt-4 gap-4 flex-wrap justify-center items-center  '>
                {Array.isArray(data) && filteredData.map((item, index) => (

                    
                        <div key={index} className='group relative flex justify-center h-40 w-60'>
                            <Image src={item.thumbnail} alt='poster'
                                height={400} width={600} className='min-h-40 min-w-60' />

                            <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-20'>{item.title}</p>
                            <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'> <Link href={
                                {
                                    pathname: '/Player',
                                    query: item
                                }
                            }> <PlayArrowIcon /> Play Now</Link></Button>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition duration-300"></div>

                        </div>

                    



                ))}
            </div>

        </div>
    )
}

export default SearchResult
