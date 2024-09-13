"use client"

import { useState } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {Button} from '@/components/ui/button';

// Define the props type for the component
interface WatchlistButtonProps {
  userId: string;
  videoId: string;
  videoType: string;
}

export default function WatchlistButton({
  userId,
  videoId,
  videoType,
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

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
