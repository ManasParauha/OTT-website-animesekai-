import React from 'react'
import Image from 'next/image';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import {Button} from "@/components/ui/button";
import { useState,useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
interface User {
    _id: string;
    username: string;
    photo: string;
  
  }
  
  interface HubData {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    user: User;
    likes: string[]
  }
  
const ViewHubs = ({ data }: { data: HubData[]}  ) => {

    
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    const userDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setUser(res.data.data._id)
    }

    userDetails()

    
  }, []);

    const [isLiked, setIsLiked] = useState(false);

    const [hubData, setHubData] = useState<HubData[]> ([]);

    useEffect(() => {
        data.forEach((hubData) => {
            setIsLiked(hubData.likes.includes(user));
            setHubData(data);
          });
      }, [data, user]);


      
    
      const handleLikeClick = async (hub: HubData) => {
        try {
          // Update isLiked state locally
          setIsLiked(!isLiked);
          
          // Make API call to like/unlike endpoint
          await axios.post(`/api/users/hub/like/${hub._id}`, {
            like: !isLiked,
          });
        } catch (error: any) {
          console.error("Like/Unlike failed", error.message || "error");
          toast.error(error.message || "Like/Unlike failed");
        }
      };



  return (
    <div className="text-foreground h-[90vh] flex flex-col gap-5 items-center w-full p-6">
    {data.map(  (data) => (


     <div className="flex flex-col items-start p-5 border-border border-2 gap-5 w-72">
        <div className="flex items-center gap-2">
          {data.user?.photo && (
            <Image
              src={data.user.photo}
              alt="photo"
              height={30}
              width={30}
              className="rounded-full"
            />
          )}
          <h4>{data?.user?.username}</h4>
        </div>
        <h4>{data?.title}</h4>
        <div className="w-full flex justify-center items-center">
          <video  height={300} width={300} controls src={data?.url} />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className=" whitespace-nowrap overflow-hidden text-ellipsis w-60 ">{data?.description}</h4>
          <div className="flex gap-5 justify-start w-full">
           <Button onClick={() => handleLikeClick(data)} >
           {isLiked? 'Unlike' : 'Like'} <FavoriteBorderIcon  /></Button>
            <ChatBubbleOutlineIcon />
            <SendIcon />
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default ViewHubs
