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
import { useRef } from 'react'






interface Episode {
  episodeNo: number;
  thumbnail: string;
  url: string;
}

interface FormData {
  title: string;
  description: string;
  thumbnail: string;
  episodes: Episode[];
}


const page = () => {

  const { edgestore } = useEdgeStore();



  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    thumbnail: '',
    episodes: [],
  });

  const [episode, setEpisode] = useState<Episode>({
    episodeNo: 0,
    thumbnail: '',
    url: '',
  });

  const [episodeProgress, setEpisodeProgress] = useState(0);
  const [episodeVideoProgress, setEpisodeVideoProgress] = useState(0);
  const [seriesProgress, setSeriesProgress] = useState(0);

  const [seriesThumbnail, setSeriesThumbnail] = React.useState<File>();
  const [episodeThumbnail, setEpisodeThumbnail] = React.useState<File>();
  const [file, setFile] = React.useState<File>();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEpisodeChange = (e: any) => {
    setEpisode({ ...episode, [e.target.name]: e.target.value });
  };

  // const handleEpisodeThumbnailUpload = async (e: any) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     // Replace with your file upload logic (e.g., using edgestore)
  //     const response = await uploadFile(file, setEpisodeProgress);
  //     if (response.success) {
  //       setEpisode({ ...episode, thumbnail: response.url });
  //       toast.success("Episode Thumbnail uploaded successfully!");
  //     } else {
  //       toast.error("Error uploading episode thumbnail!");
  //     }
  //   }
  // };

  // const handleSeriesThumbnailUpload = async (e: any) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     // Replace with your file upload logic (e.g., using edgestore)
  //     const response = await uploadFile(file, setSeriesProgress);
  //     if (response.success) {
  //       setFormData({ ...formData, thumbnail: response.url });
  //       toast.success("Series Thumbnail uploaded successfully!");
  //     } else {
  //       toast.error("Error uploading series thumbnail!");
  //     }
  //   }
  // };
  

  
   
  const addEpisode = () => {
    setFormData({ ...formData, episodes: [...formData.episodes, episode] });

    toast.success("episode added successfully")
    setEpisodeProgress(0);
    setEpisodeVideoProgress(0);
   
    
    
    
    setEpisode({ episodeNo: formData.episodes.length + 1, thumbnail: '', url: '' }); // Set episode number based on existing episodes
    
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/admin/upload/animeSeries', formData ,  {
        headers: {
          'Content-Type': 'application/json' // Ensure correct content type
        }
      });
      console.log(response.data);
      toast.success('Anime Series created successfully!');
      setFormData({ title: '', description: '', thumbnail: '', episodes: [] });
      setSeriesProgress(0);
    } catch (error) {
      console.error(error);
      toast.error('Error creating anime series!');
    }
  };

  // Replace with your actual file upload logic (consider using a library)
  // const uploadFile = async (file, onProgressChange) => {
  //   // Simulate upload progress
  //   for (let i = 0; i <= 100; i += 10) {
  //     onProgressChange(i);
  //     await new Promise((resolve) => setTimeout(resolve, 100));
  //   }
  //   return { success: true, url: 'https://example.com/uploaded-file.jpg' }; // Replace with actual URL
  // };




  return (
    <div className="h-screen w-screen overflow-hidden flex justify-center items-center ">
      <div className="border-border w-[99vw] sm:w-[57vw] md:w-[47vw] h-[90vh] border-2 flex flex-col gap-4 justify-start px-7 py-14 overflow-y-auto ">

        <h6 className="text-xl font-bold">Upload Anime Series</h6>
        <div>
          <p className="text-sm font-semibold">Title</p>
          <Input type="text" placeholder="title" value={formData.title} onChange={handleChange} name="title" />
        </div>
        <div>
          <p className="text-sm font-semibold">Description</p>
          <Input type="textarea" placeholder="description" value={formData.description} onChange={handleChange} name="description" />
        </div>
        <div ><p className=' text-sm font-semibold'> Thumbnail</p>
          <Progress value={seriesProgress} className=' my-2' />
          <div className='flex'>
            <Input type="file" onChange={(e) => {
              setSeriesThumbnail(e.target.files?.[0])
            }} />
            <Button onClick={async () => {
              if (seriesThumbnail) {
                const res = await edgestore.publicFiles.upload({
                  file: seriesThumbnail,
                  onProgressChange: (progress) => {
                    setSeriesProgress(progress)
                  }
                })

                toast.success(" Series thumbnail uploaded succesfully!")

                const updatedVideo = { ...formData, thumbnail: res.url };
                setFormData(updatedVideo);

                console.log(res.url)
                console.log(formData)

              }
            }}>confirm</Button></div></div>
        <div>
          {/* <h6 className="text-sm font-semibold">Episodes</h6> */}
          
            <div  className="flex flex-col gap-2 mb-4 border-b border-gray-200 pb-2">
              <p className="text-sm font-semibold">Episode {episode.episodeNo + 1}</p>
              <div>
                <div ><p className=' text-sm font-semibold'> Thumbnail</p>
                  <Progress value={episodeProgress} className=' my-2' />
                  <div className='flex'>
                    <Input type="file"  onChange={(e) => {
                      setEpisodeThumbnail(e.target.files?.[0])
                    }}   />
                    <Button onClick={async () => {
                      if (episodeThumbnail) {
                        const res = await edgestore.publicFiles.upload({
                          file: episodeThumbnail,
                          onProgressChange: (progress) => {
                            setEpisodeProgress(progress)
                          }
                        })

                        toast.success("Episode thumbnail uploaded succesfully!")

                        const updatedVideo = { ...episode, thumbnail: res.url };
                        setEpisode(updatedVideo);

                        console.log(res.url)
                        console.log(episode)

                      }
                    }}>confirm</Button></div></div>
              </div>
              <div ><p className=' text-sm font-semibold'> Video</p>
                <Progress value={episodeVideoProgress} className=' my-2' />
                <div className='flex'>
                  <Input type="file"   onChange={(e) => {
                    setFile(e.target.files?.[0]) 
                  }} />
                  <Button onClick={async () => {
                    if (file) {
                      const res = await edgestore.publicFiles.upload({
                        file,
                        onProgressChange: (progress) => {
                          setEpisodeVideoProgress(progress)
                        }
                      })

                      toast.success("Ready to upload")

                      const updatedVideo = { ...episode, url: res.url };
                      setEpisode(updatedVideo);

                      console.log(res.url)
                      console.log(episode)

                    }
                  }}>confirm</Button></div></div>
            </div>
          
          <Button onClick={addEpisode} >Add Episode</Button>
        </div>
        <Button onClick={handleSubmit}>Upload Series</Button>

      </div>
    </div>
  )
}

export default page
