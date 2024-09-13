// components/LikeButton.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';

interface LikeButtonProps {
  hubId: string;
  initialLikes: number;
  userHasLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ hubId, initialLikes, userHasLiked }) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState(userHasLiked);

  const handleLike = async () => {
    try {
      const response = await axios.post('/api/users/hub/like', { hubId });
      if (response.status === 200) {
        
        setLikes(response.data.likes);
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  return (
    <Button className='flex gap-2' onClick={handleLike} variant='ghost'>
      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />} {likes}
    </Button>
  );
};

export default LikeButton;
