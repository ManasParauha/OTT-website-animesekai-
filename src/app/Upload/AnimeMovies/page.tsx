"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useEdgeStore } from '@/lib/edgestore'
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"


const page = () => {

  const [video, setVideo] = React.useState({
    title: "",
    description: "",
    url: "",
    thumbnail:''
  })

  const [file, setFile] = React.useState<File>();
  const [thumbnail, setThumbnail] = React.useState<File>();

  const [progress, setProgress] = React.useState(0)
  const [tprogress, setTprogress] = React.useState(0)



  const { edgestore } = useEdgeStore();

  const onUpload = async () => {

    try {

      const response = await axios.post("/api/admin/upload/animeMovies", video)
      console.log("Upload success", response.data)
      toast.success("Uploaded Succesful")


    } catch (error: any) {
      console.log("Upload failed!", error)
      toast.error(error.message)
    }
  }

  return (
    <div className=' h-screen w-screen overflow-hidden flex justify-center items-center  '>

      <div className=' border-border w-[99vw]   sm:w-[57vw] md:w-[47vw] h-[90vh] border-2 flex flex-col gap-5 justify-center px-7'>

        <h6 className=' text-xl font-bold'>Upload the Movie here</h6>

        <div><p className=' text-sm font-semibold'> Title</p>
          <Input type="text" placeholder="title" value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })} /></div>

        <div><p className=' text-sm font-semibold'> Description</p>
          <Input type="textarea" placeholder="description" value={video.description}
            onChange={(e) => setVideo({ ...video, description: e.target.value })} /></div>

        

        <div ><p className=' text-sm font-semibold'> Thumbnail</p>
          <Progress value={tprogress}  className=' my-2' />
          <div className='flex'>
            <Input type="file" onChange={(e) => {
              setThumbnail(e.target.files?.[0])
            }} />
            <Button onClick={async () => {
              if (thumbnail) {
                const res = await edgestore.publicFiles.upload({
                  file:thumbnail,
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
            }}>confirm</Button></div></div>
        <div ><p className=' text-sm font-semibold'> Video</p>
          <Progress value={progress} className=' my-2' />
          <div className='flex'>
            <Input type="file" onChange={(e) => {
              setFile(e.target.files?.[0])
            }} />
            <Button onClick={async () => {
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

        <Button onClick={onUpload}>Upload</Button>

      </div>


    </div>
  )
}

export default page
