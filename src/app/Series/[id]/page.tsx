

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import poster from "../../../../public/blur.jpg"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from 'next/link';
interface Episode {
    episodeNo: number;
    thumbnail: string;
    url: string;
}

interface Series {
    title: string;
    description: string;
    thumbnail: string;
    episodes: Episode[];
}

const SeriesDetails = () => {
    const { id } = useParams(); // Get series ID from the URL
    const [series, setSeries] = useState<Series | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchSeriesDetails = async () => {
            try {
                const response = await axios.get(`/api/admin/fetchAllSeries/${id}`);
                setSeries(response.data);
            } catch (error) {
                console.error('Error fetching series details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeriesDetails();
    }, [id]);

    if (loading) return <div className='h-screen w-screen items-center justify-center flex'><Button className='' disabled ><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait </Button></div>;
    if (!series) return <p>Series not found.</p>;

    return (
        <div className='md:ml-24 p-5 flex flex-col gap-10'>

            <div className='flex gap-2'>


                <Image src={series.thumbnail} width={550} height={350} alt='Thumbnail' />



                <div className='flex flex-col gap-5 p-5'>
                    <h1 className='text-3xl text-foreground font-bold'>{series.title}</h1>
                    <p className=' font-extralight text-sm text-foreground'>{series.description}</p>
                </div>

            </div>

            <div className='flex flex-col gap-4'>
 
                <h1 className='text-foreground text-2xl'>Episodes</h1>


                {series.episodes.map((episode) => (
                    <div className='group relative flex justify-center h-40 w-60 ' key={episode.episodeNo}>

                        <Image src={episode?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  ' height={400} width={600} />

                        <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-10  '>{episode.episodeNo + 1}</p>

                        <Button className=' transition-opacity gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'>

                            <Link href={{

                                pathname : '/Player',
                                query : {...episode , seriesTitle : series.title}

                            }} > <PlayArrowIcon /> Play Now</Link>

                        </Button>

                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>

                    </div>))}


            </div>

        </div>
    );
};

export default SeriesDetails;
