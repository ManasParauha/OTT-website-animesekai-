"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import MediaPreview from "../MediaPreview";

type StagedFile = {
  file: File;
  previewUrl: string;
};

type EpisodeItem = {
  _id?: string;
  episodeNo: number;
  thumbnail: string;
  url: string;
  thumbnailFile?: StagedFile | null;
  videoFile?: StagedFile | null;
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

function toPayloadEpisodes(episodes: EpisodeItem[]) {
  return episodes.map(({ thumbnailFile, videoFile, ...episode }, index) => ({
    ...episode,
    episodeNo: index,
  }));
}

export default function SeriesEditor({ seriesId }: { seriesId?: string }) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const objectUrlsRef = useRef<string[]>([]);
  const [form, setForm] = useState<SeriesForm>(emptySeriesForm);
  const [seriesThumbnailFile, setSeriesThumbnailFile] = useState<StagedFile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(seriesId));
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
            ? series.episodes
                .map((episode: EpisodeItem, index: number) => ({
                  _id: episode._id,
                  episodeNo: Number.isFinite(Number(episode.episodeNo)) ? Number(episode.episodeNo) : index,
                  thumbnail: episode.thumbnail || "",
                  url: episode.url || "",
                }))
                .sort((a: EpisodeItem, b: EpisodeItem) => a.episodeNo - b.episodeNo)
                .map((episode: EpisodeItem, index: number) => ({ ...episode, episodeNo: index }))
            : [],
        });
        setSeriesThumbnailFile(null);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Could not load series.");
        router.push("/sekai-control?tab=series");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [seriesId, router]);

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

  const clearSeriesThumbnailFile = (stagedFile = seriesThumbnailFile) => {
    revokeStagedFile(stagedFile);
    setSeriesThumbnailFile(null);
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

  const handleSeriesThumbnailSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const stagedFile = createStagedFile(file);
    revokeStagedFile(seriesThumbnailFile);
    setSeriesThumbnailFile(stagedFile);
    event.target.value = "";
  };

  const updateSeriesThumbnailUrl = (value: string) => {
    clearSeriesThumbnailFile();
    setForm((current) => ({ ...current, thumbnail: value }));
  };

  const updateEpisode = (index: number, patch: Partial<EpisodeItem>) => {
    setForm((current) => ({
      ...current,
      episodes: current.episodes.map((episode, episodeIndex) =>
        episodeIndex === index ? { ...episode, ...patch } : episode
      ),
    }));
  };

  const handleEpisodeFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "thumbnail" | "url"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const stagedKey = field === "thumbnail" ? "thumbnailFile" : "videoFile";
    const stagedFile = createStagedFile(file);
    revokeStagedFile(form.episodes[index]?.[stagedKey]);
    updateEpisode(index, { [stagedKey]: stagedFile });
    event.target.value = "";
  };

  const updateEpisodeMediaUrl = (index: number, field: "thumbnail" | "url", value: string) => {
    const stagedKey = field === "thumbnail" ? "thumbnailFile" : "videoFile";
    revokeStagedFile(form.episodes[index]?.[stagedKey]);
    updateEpisode(index, { [field]: value, [stagedKey]: null });
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
    revokeStagedFile(form.episodes[index]?.thumbnailFile);
    revokeStagedFile(form.episodes[index]?.videoFile);
    setForm((current) => ({
      ...current,
      episodes: current.episodes
        .filter((_, episodeIndex) => episodeIndex !== index)
        .map((episode, episodeIndex) => ({ ...episode, episodeNo: episodeIndex })),
    }));
  };

  const validateSeriesForm = () => {
    if (!form.title.trim()) {
      toast.error("Series title is required.");
      return false;
    }

    if (!form.description.trim()) {
      toast.error("Series description is required.");
      return false;
    }

    if (!form.thumbnail.trim() && !seriesThumbnailFile) {
      toast.error("Series thumbnail is required.");
      return false;
    }

    const invalidEpisodeIndex = form.episodes.findIndex(
      (episode) =>
        (!episode.thumbnail.trim() && !episode.thumbnailFile) ||
        (!episode.url.trim() && !episode.videoFile)
    );

    if (invalidEpisodeIndex !== -1) {
      toast.error(`Episode ${invalidEpisodeIndex + 1} needs a thumbnail and video.`);
      return false;
    }

    return true;
  };

  const uploadStagedSeriesFiles = async () => {
    let nextForm: SeriesForm = {
      ...form,
      episodes: form.episodes.map((episode) => ({ ...episode })),
    };

    if (seriesThumbnailFile) {
      const thumbnail = await uploadFile(seriesThumbnailFile.file, "Uploading series thumbnail");
      nextForm = { ...nextForm, thumbnail };
      setForm(nextForm);
      clearSeriesThumbnailFile(seriesThumbnailFile);
    }

    for (let index = 0; index < nextForm.episodes.length; index += 1) {
      let episode = nextForm.episodes[index];

      if (episode.thumbnailFile) {
        const thumbnail = await uploadFile(
          episode.thumbnailFile.file,
          `Uploading episode ${index + 1} thumbnail`
        );
        revokeStagedFile(episode.thumbnailFile);
        episode = { ...episode, thumbnail, thumbnailFile: null };
        nextForm.episodes[index] = episode;
        nextForm = { ...nextForm, episodes: [...nextForm.episodes] };
        setForm(nextForm);
      }

      if (episode.videoFile) {
        const url = await uploadFile(episode.videoFile.file, `Uploading episode ${index + 1} video`);
        revokeStagedFile(episode.videoFile);
        episode = { ...episode, url, videoFile: null };
        nextForm.episodes[index] = episode;
        nextForm = { ...nextForm, episodes: [...nextForm.episodes] };
        setForm(nextForm);
      }
    }

    return nextForm;
  };

  const saveSeries = async () => {
    if (!validateSeriesForm()) return;

    try {
      setIsSaving(true);
      const uploadedForm = await uploadStagedSeriesFiles();
      const payload = {
        ...uploadedForm,
        episodes: toPayloadEpisodes(uploadedForm.episodes),
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
      toast.error(error.response?.data?.error || error.message || "Series save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveButtonLabel = uploadingLabel
    ? `${uploadingLabel} ${uploadProgress}%`
    : isSaving
      ? seriesId
        ? "Saving Series..."
        : "Creating Series..."
      : seriesId
        ? "Save Series"
        : "Create Series";

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
                <Input value={form.thumbnail} onChange={(event) => updateSeriesThumbnailUrl(event.target.value)} />
                <Input type="file" accept="image/*" onChange={handleSeriesThumbnailSelection} />
                <MediaPreview label="Series Thumbnail" type="image" url={seriesThumbnailFile?.previewUrl || form.thumbnail} />
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
                      <h3 className="font-semibold">Episode {index + 1}</h3>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeEpisode(index)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label>Thumbnail URL</Label>
                      <Input
                        value={episode.thumbnail}
                        onChange={(event) => updateEpisodeMediaUrl(index, "thumbnail", event.target.value)}
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleEpisodeFileSelection(event, index, "thumbnail")}
                      />
                      <MediaPreview
                        label={`Episode ${index + 1} Thumbnail`}
                        type="image"
                        url={episode.thumbnailFile?.previewUrl || episode.thumbnail}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Video URL</Label>
                      <Input value={episode.url} onChange={(event) => updateEpisodeMediaUrl(index, "url", event.target.value)} />
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(event) => handleEpisodeFileSelection(event, index, "url")}
                      />
                      <MediaPreview
                        label={`Episode ${index + 1} Video`}
                        type="video"
                        url={episode.videoFile?.previewUrl || episode.url}
                      />
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
