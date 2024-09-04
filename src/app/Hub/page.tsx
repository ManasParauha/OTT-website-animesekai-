"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import NavbarMD from '@/components/NavbarMD';
import Navbar from '@/components/Navbar';
import { Textarea } from '@/components/ui/textarea';
import { useEdgeStore } from '@/lib/edgestore'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useEffect } from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';


const page = () => {
  const [video, setVideo] = React.useState({
    title: "",
    description: "",
    url: "",
    thumbnail: ''
  })

  const [file, setFile] = React.useState<File>();
  const [thumbnail, setThumbnail] = React.useState<File>();
  const [tprogress, setTprogress] = React.useState(0)

  const [progress, setProgress] = React.useState(0)

  const { edgestore } = useEdgeStore();

  const onUpload = async () => {

    try {

      const response = await axios.post("/api/users/uploadHub", video)
      console.log("Upload success", response.data)
      toast.success("Uploaded Succesful");
      window.location.reload();


    } catch (error: any) {
      console.log("Upload failed!", error)
      toast.error(error.message)
    }
  }



  interface User {
    username: string;
    photo: string;
  }

  interface HubData {
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    user: User;
  }

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<HubData[]>([]);


  useEffect(() => {
    const hubDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/users/hubList');
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

    hubDetails()


  }, []);



  const router = useRouter();





  return (
    <div className='flex'>
      <div className="fixed hidden md:block left-0 top-0 z-10"><NavbarMD /></div>
      <div className='h-screen w-screen flex-col  overflow-y-auto flex py-5 gap-2 items-center'>

        <div className=' h-[10vh] flex justify-center  '> <Dialog>
          <DialogTrigger asChild>
            <Button className='w-[50vw]'>Upload</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div><Label>Enter Title</Label>
              <Input type='text' placeholder="title" value={video.title}
                onChange={(e) => setVideo({ ...video, title: e.target.value })} /></div>
            <div><Label>Enter Description</Label>
              <Textarea placeholder="Type your Description here." value={video.description}
                onChange={(e) => setVideo({ ...video, description: e.target.value })} /></div>
            <div><Label>Upload Thumbnail</Label>
              <Progress value={tprogress} className=' my-2' />
              <div className='flex'><Input type='file' onChange={(e) => {
                setThumbnail(e.target.files?.[0])
              }} /><Button onClick={async () => {
                if (thumbnail) {
                  const res = await edgestore.publicFiles.upload({
                    file: thumbnail,
                    onProgressChange: (progress) => {
                      setTprogress(progress)
                    }
                  })

                  toast.success("thumbnail uploaded succesfully!")

                  const updatedVideo = { ...video, thumbnail: res.url };
                  setVideo(updatedVideo);

                  console.log(res.url)
                  console.log(video)

                }
              }}>Confirm</Button></div></div>
            <div><Label>Upload Video</Label>
              <Progress value={progress} className=' my-2' />
              <div className='flex'><Input type='file' onChange={(e) => {
                setFile(e.target.files?.[0])
              }} /><Button onClick={async () => {
                if (file) {
                  const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                      setProgress(progress)
                    }
                  })

                  toast.success("Ready to upload")

                  const updatedVideo = { ...video, url: res.url };
                  setVideo(updatedVideo);

                  console.log(res.url)
                  console.log(video)

                }
              }}>confirm</Button></div></div>
            <Button type='submit' onClick={onUpload}>Submit</Button>
          </DialogContent>
        </Dialog>
        </div>


        <SearchBar/>




        <div className='text-foreground  h-[90vh] flex flex-col items-center w-full p-6   '>

          <div className='flex flex-col  items-start p-5 border-border border-2 gap-2  '>
            <div className='flex items-center gap-2'>
              <Image src={data[0]?.user.photo} alt='photo' height={30} width={30} className='rounded-full' />
              <h4 className=''>{data[0]?.user.username}</h4>
            </div>
            <h4>{data[0]?.title}</h4>
            <div className='w-full flex justify-center items-center'>
              <video height={300} width={300} controls src={data[0]?.url}></video></div>
            <div className='flex flex-col gap-2'>

              <h4>{data[0]?.description}</h4>
              <div className='flex gap-5 justify-start w-full '>
                <FavoriteBorderIcon />
                <ChatBubbleOutlineIcon />
                <SendIcon />
              </div>

            </div>
          </div>

        </div>

      </div>


      <Navbar />
    </div>

  )
}

export default page
