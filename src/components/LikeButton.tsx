// components/LikeButton.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {Button} from '@/components/ui/button';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';

interface LikeButtonProps {
  hubId: string;
  initialLikes: number;
  userHasLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ hubId, initialLikes,userHasLiked }) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState(userHasLiked);

 

  const handleLike = async () => {
    if (isLiked) return; // Prevent multiple likes by the same user

    try {
      const response = await axios.post('/api/users/hub/like', { hubId });
      if (response.status === 200) {
        setLikes(response.data.likes);
        setIsLiked(true);
      }
    } catch (error) {   
      console.error('Failed to like the hub:', error);
    }
  };



  return (
   <Button className='flex gap-2' onClick={handleLike} disabled={isLiked} variant='ghost' >
   {isLiked ? <FavoriteIcon />  :  <FavoriteBorderIcon /> } {likes}
   </Button>
  );
};

export default LikeButton;
