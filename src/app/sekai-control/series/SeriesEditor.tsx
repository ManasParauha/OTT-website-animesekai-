"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import MediaPreview from "../MediaPreview";

type EpisodeItem = {
  _id?: string;
  episodeNo: number;
  thumbnail: string;
  url: string;
};

type SeriesForm = {
  title: string;
  description: string;
  thumbnail: string;
  episodes: EpisodeItem[];
};

const emptySeriesForm: SeriesForm = {
  title: "",
  description: "",
  thumbnail: "",
  episodes: [],
};

export default function SeriesEditor({ seriesId }: { seriesId?: string }) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [form, setForm] = useState<SeriesForm>(emptySeriesForm);
  const [isLoading, setIsLoading] = useState(Boolean(seriesId));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingLabel, setUploadingLabel] = useState("");

  const sortedEpisodes = useMemo(
    () => [...form.episodes].sort((a, b) => a.episodeNo - b.episodeNo),
    [form.episodes]
  );

  useEffect(() => {
    if (!seriesId) return;

    const fetchSeries = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/admin/series/${seriesId}`);
        const series = response.data.series;
        setForm({
          title: series.title || "",
          description: series.description || "",
          thumbnail: series.thumbnail || "",
          episodes: Array.isArray(series.episodes)
            ? series.episodes.map((episode: EpisodeItem, index: number) => ({
                _id: episode._id,
                episodeNo: Number.isFinite(Number(episode.episodeNo)) ? Number(episode.episodeNo) : index,
                thumbnail: episode.thumbnail || "",
                url: episode.url || "",
              }))
            : [],
        });
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Could not load series.");
        router.push("/sekai-control?tab=series");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [seriesId, router]);

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

  const handleSeriesThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "Series thumbnail");
    if (url) {
      setForm((current) => ({ ...current, thumbnail: url }));
    }
    event.target.value = "";
  };

  const updateEpisode = (index: number, patch: Partial<EpisodeItem>) => {
    setForm((current) => ({
      ...current,
      episodes: current.episodes.map((episode, episodeIndex) =>
        episodeIndex === index ? { ...episode, ...patch } : episode
      ),
    }));
  };

  const handleEpisodeFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "thumbnail" | "url",
    label: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, label);
    if (url) {
      updateEpisode(index, { [field]: url });
    }
    event.target.value = "";
  };

  const addEpisode = () => {
    setForm((current) => ({
      ...current,
      episodes: [
        ...current.episodes,
        {
          episodeNo: current.episodes.length,
          thumbnail: "",
          url: "",
        },
      ],
    }));
  };

  const removeEpisode = (index: number) => {
    setForm((current) => ({
      ...current,
      episodes: current.episodes
        .filter((_, episodeIndex) => episodeIndex !== index)
        .map((episode, episodeIndex) => ({ ...episode, episodeNo: episodeIndex })),
    }));
  };

  const saveSeries = async () => {
    try {
      setIsSaving(true);
      const payload = {
        ...form,
        episodes: sortedEpisodes,
      };

      if (seriesId) {
        await axios.put(`/api/admin/series/${seriesId}`, payload);
        toast.success("Series updated");
      } else {
        await axios.post("/api/admin/series", payload);
        toast.success("Series created");
      }
      router.push("/sekai-control?tab=series");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Series save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5">
          <Button asChild variant="ghost" className="w-fit gap-2 px-0">
            <Link href="/sekai-control?tab=series">
              <ArrowBackIcon fontSize="small" />
              Back to control
            </Link>
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Sekai Control</p>
            <h1 className="text-3xl font-bold">{seriesId ? "Edit Series" : "Upload Series"}</h1>
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
            <p className="text-sm text-muted-foreground">Loading series...</p>
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
                <Label>Series Thumbnail URL</Label>
                <Input value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} />
                <Input type="file" accept="image/*" onChange={handleSeriesThumbnailUpload} />
                <MediaPreview label="Series Thumbnail" type="image" url={form.thumbnail} />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Episodes</h2>
                  <p className="text-sm text-muted-foreground">Add or update episode thumbnails and videos.</p>
                </div>
                <Button type="button" variant="outline" className="gap-2" onClick={addEpisode}>
                  <AddCircleIcon fontSize="small" />
                  Add Episode
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {form.episodes.map((episode, index) => (
                  <div key={`${episode._id || "new"}-${index}`} className="grid gap-3 rounded-md border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">Episode {episode.episodeNo + 1}</h3>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeEpisode(index)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label>Episode Number</Label>
                      <Input
                        type="number"
                        min={0}
                        value={episode.episodeNo}
                        onChange={(event) => updateEpisode(index, { episodeNo: Number(event.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Thumbnail URL</Label>
                      <Input value={episode.thumbnail} onChange={(event) => updateEpisode(index, { thumbnail: event.target.value })} />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleEpisodeFileUpload(event, index, "thumbnail", `Episode ${episode.episodeNo + 1} thumbnail`)
                        }
                      />
                      <MediaPreview label={`Episode ${episode.episodeNo + 1} Thumbnail`} type="image" url={episode.thumbnail} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Video URL</Label>
                      <Input value={episode.url} onChange={(event) => updateEpisode(index, { url: event.target.value })} />
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(event) =>
                          handleEpisodeFileUpload(event, index, "url", `Episode ${episode.episodeNo + 1} video`)
                        }
                      />
                      <MediaPreview label={`Episode ${episode.episodeNo + 1} Video`} type="video" url={episode.url} />
                    </div>
                  </div>
                ))}
                {!form.episodes.length && (
                  <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">
                    No episodes yet. Add one before publishing a watchable series.
                  </p>
                )}
              </div>

              <Button type="button" className="gap-2" disabled={isSaving} onClick={saveSeries}>
                <SaveIcon fontSize="small" />
                {seriesId ? "Save Series" : "Create Series"}
              </Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
