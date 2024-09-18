// // components/Watchlist.tsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Image from 'next/image';
// import WatchlistButton from './WatchlistButton';
// import poster from '../../public/blur.jpg';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import { ReloadIcon } from "@radix-ui/react-icons"
// // Define types for the data structure
// interface VideoDetails {
//   title: string;
//   description: string;
//   thumbnail: string;
//   url: string;
//   episodes:[]
//   // Add other fields as necessary
// }

// interface WatchlistItem {
//   _id: string;
//   userId: string;
//   videoId: string;
//   videoType: 'series' | 'movies';
//   videoDetails?: VideoDetails;
// }

// interface WatchlistResponse {
//   watchlistItems: WatchlistItem[];
// }

// interface WatchlistProps {
//   userId: string;
// }

// const Watchlist: React.FC<WatchlistProps> = ({ userId }) => {
//   const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);


//     const fetchWatchlist = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get<WatchlistResponse>('/api/users/watchlist/fetch', {
//           params: { userId },
//         });

//         console.log('Watchlist Response:', response.data); // Log to check the response

//         if (response.data.watchlistItems.length > 0) {
//           setWatchlist(response.data.watchlistItems);
//         } else {
//           setError('No items found in your watchlist.');
//         }
//       } catch (error: any) {
//         console.error('Error fetching watchlist:', error.response?.data || error.message);
//         setError('Error fetching your watchlist. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     useEffect(() => {
//       fetchWatchlist();
//     }, []);

//   const [user, setUser] = useState<string>("");
//   useEffect(() => {
//     const userDetails = async () => {
//         const res = await axios.get('/api/users/me');
//         console.log(res.data);
//         setUser(res.data.data._id)
//     }

//     userDetails()


//   }, []);

//   if (loading) return <Button disabled >
//   <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//   Please wait
// </Button>

//   if (error) return <div> </div>;

//   return (
//     <div className='flex flex-col gap-3 w-full mt-4   '>

//     <h6 className='text-3xl font-bold'>Watchlist</h6>

//     <div className='flex overflow-x-auto h-48 hidescroll w-full gap-2 '>


//       {Array.isArray(watchlist) && watchlist.map((data) => (<div className='group relative flex justify-center h-40 w-60  '>
//         <Image src={data.videoDetails?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  ' height={400} width={600} />
//         <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-20  '>{data?.videoDetails?.title || "title"}</p>
//        { <Button className=' transition-opacity left-6 gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><Link href={
//           {
//             pathname: '/Player',
//             query:  { videoDetails: JSON.stringify(data.videoDetails) }
//           }
//         }> <PlayArrowIcon /> Play Now</Link></Button>}

//         <div className='absolute bottom-3 right-6 z-10  transition-opacity group-hover:opacity-100 opacity-0 ' >

//           {user && (
//             <WatchlistButton userId={user} videoId={data.videoId} videoType={data.videoType} onWatchlistChange={fetchWatchlist} />
//           )}

//         </div>
//         <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>


//       </div>))}


//     </div>



//   </div>
//   );
// };

// export default Watchlist;









// components/Watchlist.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import WatchlistButton from './WatchlistButton';
import poster from '../../public/blur.jpg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ReloadIcon } from "@radix-ui/react-icons"
// Define types for the data structure
interface VideoDetails {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  episodes: []
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
  watchlist: WatchlistItem[];
  onWatchlistChange: () => void;
  loading: boolean;
  error: string | null;
}

const Watchlist: React.FC<WatchlistProps> = ({ userId, watchlist, onWatchlistChange, loading, error }) => {


  if (loading) return <Button disabled >
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
    Please wait
  </Button>

  if ( watchlist.length === 0) return <div> </div>;
  if(!watchlist) return <div> </div>;


  return (
    <div className='flex flex-col gap-3 w-full mt-4   ' >

      <h6 className='text-3xl font-bold'>Watchlist</h6>

      <div className='flex overflow-x-auto h-48 hidescroll w-full gap-2 '>


        {Array.isArray(watchlist) && watchlist.map((data) => (<div key={data.videoId} className='group relative flex justify-center h-40 w-60  '>
          <Image src={data.videoDetails?.thumbnail || poster} alt='#' className='min-h-40 min-w-60  ' height={400} width={600} />
          <p className='group-hover:opacity-100 opacity-0  absolute top-3 text-2xl font-semibold text-foreground transition-opacity z-20  '>{data?.videoDetails?.title || "title"}</p>
          {<Button className=' transition-opacity left-6 gap-2 group-hover:opacity-100 opacity-0 flex absolute bottom-3 z-20'><Link href={
            {
              pathname: '/Player',
              query: { videoDetails: JSON.stringify(data.videoDetails) }
            }
          }> <PlayArrowIcon /> Play Now</Link></Button>}

          <div className='absolute bottom-3 right-6 z-10  transition-opacity group-hover:opacity-100 opacity-0 ' >

            {userId && (
              <WatchlistButton userId={userId} videoId={data.videoId} videoType={data.videoType} onWatchlistChange={onWatchlistChange} />
            )}

          </div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300"></div>


        </div>))}


      </div>



    </div >
  );
};

export default Watchlist;





