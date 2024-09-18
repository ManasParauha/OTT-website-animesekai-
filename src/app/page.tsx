
"use client";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TopSeries from "@/components/TopSeries";
import TopMovies from "@/components/TopMovies";

import { useEffect, useState } from "react";
import Watchlist from "@/components/Watchlist";



interface VideoDetails {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  episodes:[]
  // Add other fields as necessary
}

interface WatchlistItem {
  _id: string;
  userId: string;
  videoId: string;
  videoType: 'series' | 'movies';
  videoDetails?: VideoDetails;
}

interface WatchlistResponse {
  watchlistItems: WatchlistItem[];
}

interface WatchlistProps {
  userId: string;
}




export default function Home() {


 
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const [dummyState, setDummyState] = useState(0);
  
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get<WatchlistResponse>('/api/users/watchlist/fetch');

        console.log('Watchlist Response:', response.data); // Log to check the response

        if (response.data.watchlistItems.length > 0) {
          setWatchlist(response.data.watchlistItems);
          setError(null);
        } else {
          setWatchlist([]);
          setError(null);
        }

        setDummyState((prev)=>prev+1);
      } catch (error: any) {
        console.error('Error fetching watchlist:', error.response?.data || error.message);
        setError('Error fetching your watchlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchWatchlist();
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

    <main className="w-[100%]">

      <div className="w-full flex">

     

        <div className="w-full relative md:ml-24 flex flex-col overflow-x-hidden">
          
          <HeroSection />


          <Watchlist userId={user} watchlist={watchlist} loading={loading} error={error} onWatchlistChange={fetchWatchlist}/>
         
         
          <TopSeries onWatchlistChange={fetchWatchlist}/>
          <TopMovies onWatchlistChange={fetchWatchlist} />
          
          


          
          <div className="h-20 md:h-0"></div>




        </div>
      </div>

    </main>
  );
}


