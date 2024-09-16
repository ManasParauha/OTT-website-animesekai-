"use client"

import { useState , useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {Button} from '@/components/ui/button';


// Define the props type for the component
interface WatchlistButtonProps {
  userId: string;
  videoId: string;
  videoType: string;
  onWatchlistChange ?: () => void;
}


export default function WatchlistButton({
  userId,
  videoId,
  videoType,
  onWatchlistChange
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>();


  useEffect(() => {
    const checkWatchlistStatus = async () => {
      try {
        const response = await axios.get('/api/users/watchlist/check', {
          params: { userId, videoId, videoType },
        });
        // Assume the API returns a boolean indicating watchlist status
        setIsInWatchlist(response.data.isInWatchlist);
      } catch (error) {
        console.error('Error checking watchlist status:', error);
      }
    };

    checkWatchlistStatus();
  }, [userId, videoId, videoType]);

  const handleWatchlistToggle = async () => {
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        await axios.delete('/api/users/watchlist/remove', {
          data: { userId, videoId, videoType },
        });
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        await axios.post('/api/users/watchlist/add', { userId, videoId, videoType });
        setIsInWatchlist(true);
      }
      if (onWatchlistChange) {
        onWatchlistChange(); // Notify the parent component about the change
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  return (
    <Button
      onClick={handleWatchlistToggle}
      className={`px-4 py-2 rounded `}
    >
      {isInWatchlist ?  <CloseIcon/> : <AddIcon/> }
    </Button>
  );
}







