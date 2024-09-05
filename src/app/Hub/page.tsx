"use client"; // Ensure this is set at the top

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import NavbarMD from "@/components/NavbarMD";
import Navbar from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic"; // Import dynamic to handle client-side-only components

// Lazy load components that may cause SSR issues
const SearchBar = dynamic(() => import("@/components/SearchBar"), { ssr: false });

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

const Page = () => {
  const [video, setVideo] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [tprogress, setTprogress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<HubData[]>([]);

  // Prevent accessing undefined during server-side rendering
  const { edgestore } = typeof window !== "undefined" ? useEdgeStore() : { edgestore: null };

  const router = typeof window !== "undefined" ? useRouter() : null;

  const onUpload = async () => {
    try {
      const response = await axios.post("/api/users/uploadHub", video);
      console.log("Upload success", response.data);
      toast.success("Uploaded Successfully");
      window.location.reload();
    } catch (error: any) {
      console.log("Upload failed!", error);
      toast.error(error.message || "Upload failed!");
    }
  };

  useEffect(() => {
    const hubDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/users/hubList");
        setData(res.data.data || []);
      } catch (error: any) {
        console.log("Fetching failed", error.message || "error");
        toast.error(error.message || "Fetching failed");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data only on the client
    if (typeof window !== "undefined") {
      hubDetails();
    }
  }, []);

  return (
    <div className="flex">
      <div className="fixed hidden md:block left-0 top-0 z-10">
        <NavbarMD />
      </div>
      <div className="h-screen w-screen flex-col overflow-y-auto flex py-5 gap-2 items-center">
        <div className="h-[10vh] flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-[50vw]">Upload</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Label>Enter Title</Label>
              <Input
                type="text"
                placeholder="Title"
                value={video.title}
                onChange={(e) =>
                  setVideo({ ...video, title: e.target.value })
                }
              />
              <Label>Enter Description</Label>
              <Textarea
                placeholder="Type your description here."
                value={video.description}
                onChange={(e) =>
                  setVideo({ ...video, description: e.target.value })
                }
              />
              <Label>Upload Thumbnail</Label>
              <Progress value={tprogress} className="my-2" />
              <div className="flex">
                <Input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
                <Button
                  onClick={async () => {
                    if (thumbnail && edgestore) {
                      const res = await edgestore.publicFiles.upload({
                        file: thumbnail,
                        onProgressChange: setTprogress,
                      });
                      toast.success("Thumbnail uploaded successfully!");
                      setVideo((prev) => ({ ...prev, thumbnail: res.url }));
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
              <Label>Upload Video</Label>
              <Progress value={progress} className="my-2" />
              <div className="flex">
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                  onClick={async () => {
                    if (file && edgestore) {
                      const res = await edgestore.publicFiles.upload({
                        file,
                        onProgressChange: setProgress,
                      });
                      toast.success("Ready to upload");
                      setVideo((prev) => ({ ...prev, url: res.url }));
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
              <Button type="submit" onClick={onUpload}>
                Submit
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lazy loaded SearchBar to prevent SSR issues */}
        <SearchBar />

        <div className="text-foreground h-[90vh] flex flex-col items-center w-full p-6">
          {data.length > 0 && (
            <div className="flex flex-col items-start p-5 border-border border-2 gap-2">
              <div className="flex items-center gap-2">
                {data[0]?.user?.photo && (
                  <Image
                    src={data[0].user.photo}
                    alt="photo"
                    height={30}
                    width={30}
                    className="rounded-full"
                  />
                )}
                <h4>{data[0]?.user?.username}</h4>
              </div>
              <h4>{data[0]?.title}</h4>
              <div className="w-full flex justify-center items-center">
                <video height={300} width={300} controls src={data[0]?.url} />
              </div>
              <div className="flex flex-col gap-2">
                <h4>{data[0]?.description}</h4>
                <div className="flex gap-5 justify-start w-full">
                  <FavoriteBorderIcon />
                  <ChatBubbleOutlineIcon />
                  <SendIcon />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Page;
