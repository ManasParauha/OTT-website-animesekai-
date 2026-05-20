"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import MediaPreview from "../MediaPreview";

type MovieForm = {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

const emptyMovieForm: MovieForm = {
  title: "",
  description: "",
  thumbnail: "",
  url: "",
};

export default function MovieEditor({ movieId }: { movieId?: string }) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [form, setForm] = useState<MovieForm>(emptyMovieForm);
  const [isLoading, setIsLoading] = useState(Boolean(movieId));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingLabel, setUploadingLabel] = useState("");

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/movies/${movieId}`);
        const movie = response.data.movie;
        setForm({
          title: movie.title || "",
          description: movie.description || "",
          thumbnail: movie.thumbnail || "",
          url: movie.url || "",
        });
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Could not load movie.");
        router.push("/sekai-control?tab=movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, router]);

  const uploadFile = async (file: File, label: string) => {
    setUploadingLabel(label);
    setUploadProgress(0);
    try {
      const upload = await edgestore.adminFiles.upload({
        file,
        onProgressChange: setUploadProgress,
      });
      toast.success(`${label} uploaded`);
      return upload.url;
    } catch (error: any) {
      toast.error(error.message || `${label} upload failed`);
      return "";
    } finally {
      setUploadingLabel("");
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "url",
    label: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, label);
    if (url) {
      setForm((current) => ({ ...current, [field]: url }));
    }
    event.target.value = "";
  };

  const saveMovie = async () => {
    try {
      setIsSaving(true);
      if (movieId) {
        await axios.put(`/api/admin/movies/${movieId}`, form);
        toast.success("Movie updated");
      } else {
        await axios.post("/api/admin/movies", form);
        toast.success("Movie created");
      }
      router.push("/sekai-control?tab=movies");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Movie save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5">
          <Button asChild variant="ghost" className="w-fit gap-2 px-0">
            <Link href="/sekai-control?tab=movies">
              <ArrowBackIcon fontSize="small" />
              Back to control
            </Link>
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Sekai Control</p>
            <h1 className="text-3xl font-bold">{movieId ? "Edit Movie" : "Upload Movie"}</h1>
          </div>
        </header>

        {uploadingLabel && (
          <div className="rounded-md border border-border p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{uploadingLabel}</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        <form className="flex flex-col gap-4 rounded-md border border-border p-5" onSubmit={(event) => event.preventDefault()}>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading movie...</p>
          ) : (
            <>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Thumbnail URL</Label>
                <Input value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} />
                <Input type="file" accept="image/*" onChange={(event) => handleFileUpload(event, "thumbnail", "Movie thumbnail")} />
                <MediaPreview label="Thumbnail" type="image" url={form.thumbnail} />
              </div>
              <div className="grid gap-2">
                <Label>Video URL</Label>
                <Input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
                <Input type="file" accept="video/*" onChange={(event) => handleFileUpload(event, "url", "Movie video")} />
                <MediaPreview label="Video" type="video" url={form.url} />
              </div>
              <Button type="button" className="gap-2" disabled={isSaving} onClick={saveMovie}>
                <SaveIcon fontSize="small" />
                {movieId ? "Save Movie" : "Create Movie"}
              </Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
