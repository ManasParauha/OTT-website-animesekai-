"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import MediaPreview from "../MediaPreview";

type MovieForm = {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

type StagedFile = {
  file: File;
  previewUrl: string;
};

type StagedMovieFiles = {
  thumbnail: StagedFile | null;
  url: StagedFile | null;
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
  const objectUrlsRef = useRef<string[]>([]);
  const [form, setForm] = useState<MovieForm>(emptyMovieForm);
  const [stagedFiles, setStagedFiles] = useState<StagedMovieFiles>({
    thumbnail: null,
    url: null,
  });
  const [isLoading, setIsLoading] = useState(Boolean(movieId));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingLabel, setUploadingLabel] = useState("");

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

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

  const createStagedFile = (file: File): StagedFile => {
    const previewUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(previewUrl);
    return { file, previewUrl };
  };

  const revokeStagedFile = (stagedFile?: StagedFile | null) => {
    if (!stagedFile) return;

    URL.revokeObjectURL(stagedFile.previewUrl);
    objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== stagedFile.previewUrl);
  };

  const clearStagedFile = (field: keyof StagedMovieFiles, stagedFile = stagedFiles[field]) => {
    revokeStagedFile(stagedFile);
    setStagedFiles((current) => ({ ...current, [field]: null }));
  };

  const uploadFile = async (file: File, label: string) => {
    setUploadingLabel(label);
    setUploadProgress(0);
    try {
      const upload = await edgestore.adminFiles.upload({
        file,
        onProgressChange: setUploadProgress,
      });
      return upload.url;
    } catch (error: any) {
      throw new Error(error.message || `${label} upload failed`);
    } finally {
      setUploadingLabel("");
      setUploadProgress(0);
    }
  };

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof StagedMovieFiles
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const stagedFile = createStagedFile(file);
    revokeStagedFile(stagedFiles[field]);
    setStagedFiles((current) => ({ ...current, [field]: stagedFile }));
    event.target.value = "";
  };

  const updateMediaUrl = (field: keyof StagedMovieFiles, value: string) => {
    clearStagedFile(field);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateMovieForm = () => {
    if (!form.title.trim()) {
      toast.error("Movie title is required.");
      return false;
    }

    if (!form.thumbnail.trim() && !stagedFiles.thumbnail) {
      toast.error("Movie thumbnail is required.");
      return false;
    }

    if (!form.url.trim() && !stagedFiles.url) {
      toast.error("Movie video is required.");
      return false;
    }

    return true;
  };

  const uploadStagedMovieFiles = async () => {
    let payload = { ...form };

    if (stagedFiles.thumbnail) {
      const thumbnail = await uploadFile(stagedFiles.thumbnail.file, "Uploading movie thumbnail");
      payload = { ...payload, thumbnail };
      setForm((current) => ({ ...current, thumbnail }));
      clearStagedFile("thumbnail", stagedFiles.thumbnail);
    }

    if (stagedFiles.url) {
      const url = await uploadFile(stagedFiles.url.file, "Uploading movie video");
      payload = { ...payload, url };
      setForm((current) => ({ ...current, url }));
      clearStagedFile("url", stagedFiles.url);
    }

    return payload;
  };

  const saveMovie = async () => {
    if (!validateMovieForm()) return;

    try {
      setIsSaving(true);
      const payload = await uploadStagedMovieFiles();

      if (movieId) {
        await axios.put(`/api/admin/movies/${movieId}`, payload);
        toast.success("Movie updated");
      } else {
        await axios.post("/api/admin/movies", payload);
        toast.success("Movie created");
      }
      router.push("/sekai-control?tab=movies");
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || "Movie save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveButtonLabel = uploadingLabel
    ? `${uploadingLabel} ${uploadProgress}%`
    : isSaving
      ? movieId
        ? "Saving Movie..."
        : "Creating Movie..."
      : movieId
        ? "Save Movie"
        : "Create Movie";

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
                <Input value={form.thumbnail} onChange={(event) => updateMediaUrl("thumbnail", event.target.value)} />
                <Input type="file" accept="image/*" onChange={(event) => handleFileSelection(event, "thumbnail")} />
                <MediaPreview label="Thumbnail" type="image" url={stagedFiles.thumbnail?.previewUrl || form.thumbnail} />
              </div>
              <div className="grid gap-2">
                <Label>Video URL</Label>
                <Input value={form.url} onChange={(event) => updateMediaUrl("url", event.target.value)} />
                <Input type="file" accept="video/*" onChange={(event) => handleFileSelection(event, "url")} />
                <MediaPreview label="Video" type="video" url={stagedFiles.url?.previewUrl || form.url} />
              </div>
              <Button type="button" className="gap-2" disabled={isSaving} onClick={saveMovie}>
                {isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon fontSize="small" />}
                {saveButtonLabel}
              </Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
