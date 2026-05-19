"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import SaveIcon from "@mui/icons-material/Save";
import TvIcon from "@mui/icons-material/Tv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";

type MovieItem = {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  url: string;
};

type EpisodeItem = {
  _id?: string;
  episodeNo: number;
  thumbnail: string;
  url: string;
};

type SeriesItem = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  episodes: EpisodeItem[];
};

type MovieForm = Omit<MovieItem, "_id">;
type SeriesForm = Omit<SeriesItem, "_id">;

const emptyMovieForm: MovieForm = {
  title: "",
  description: "",
  thumbnail: "",
  url: "",
};

const emptySeriesForm: SeriesForm = {
  title: "",
  description: "",
  thumbnail: "",
  episodes: [],
};

export default function AdminDashboard() {
  const { edgestore } = useEdgeStore();
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [movieForm, setMovieForm] = useState<MovieForm>(emptyMovieForm);
  const [seriesForm, setSeriesForm] = useState<SeriesForm>(emptySeriesForm);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingLabel, setUploadingLabel] = useState("");

  const sortedEpisodes = useMemo(
    () => [...seriesForm.episodes].sort((a, b) => a.episodeNo - b.episodeNo),
    [seriesForm.episodes]
  );

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const [moviesResponse, seriesResponse] = await Promise.all([
        axios.get("/api/admin/movies"),
        axios.get("/api/admin/series"),
      ]);
      setMovies(Array.isArray(moviesResponse.data.movies) ? moviesResponse.data.movies : []);
      setSeriesList(Array.isArray(seriesResponse.data.series) ? seriesResponse.data.series : []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not load admin content.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

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

  const handleMovieFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "url",
    label: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, label);
    if (url) {
      setMovieForm((current) => ({ ...current, [field]: url }));
    }
    event.target.value = "";
  };

  const handleSeriesThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "Series thumbnail");
    if (url) {
      setSeriesForm((current) => ({ ...current, thumbnail: url }));
    }
    event.target.value = "";
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

  const resetMovieForm = () => {
    setMovieForm(emptyMovieForm);
    setEditingMovieId(null);
  };

  const resetSeriesForm = () => {
    setSeriesForm(emptySeriesForm);
    setEditingSeriesId(null);
  };

  const saveMovie = async () => {
    try {
      setIsSaving(true);
      if (editingMovieId) {
        await axios.put(`/api/admin/movies/${editingMovieId}`, movieForm);
        toast.success("Movie updated");
      } else {
        await axios.post("/api/admin/movies", movieForm);
        toast.success("Movie created");
      }
      resetMovieForm();
      await fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Movie save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const editMovie = (movie: MovieItem) => {
    setActiveTab("movies");
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title || "",
      description: movie.description || "",
      thumbnail: movie.thumbnail || "",
      url: movie.url || "",
    });
  };

  const deleteMovie = async (movie: MovieItem) => {
    if (!window.confirm(`Delete "${movie.title}" from database and EdgeStore?`)) return;

    try {
      await axios.delete(`/api/admin/movies/${movie._id}`);
      toast.success("Movie deleted");
      if (editingMovieId === movie._id) resetMovieForm();
      await fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Movie delete failed.");
    }
  };

  const updateEpisode = (index: number, patch: Partial<EpisodeItem>) => {
    setSeriesForm((current) => ({
      ...current,
      episodes: current.episodes.map((episode, episodeIndex) =>
        episodeIndex === index ? { ...episode, ...patch } : episode
      ),
    }));
  };

  const addEpisode = () => {
    setSeriesForm((current) => ({
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
    setSeriesForm((current) => ({
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
        ...seriesForm,
        episodes: sortedEpisodes,
      };

      if (editingSeriesId) {
        await axios.put(`/api/admin/series/${editingSeriesId}`, payload);
        toast.success("Series updated");
      } else {
        await axios.post("/api/admin/series", payload);
        toast.success("Series created");
      }
      resetSeriesForm();
      await fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Series save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const editSeries = (series: SeriesItem) => {
    setActiveTab("series");
    setEditingSeriesId(series._id);
    setSeriesForm({
      title: series.title || "",
      description: series.description || "",
      thumbnail: series.thumbnail || "",
      episodes: Array.isArray(series.episodes)
        ? series.episodes.map((episode, index) => ({
            _id: episode._id,
            episodeNo: Number.isFinite(Number(episode.episodeNo)) ? Number(episode.episodeNo) : index,
            thumbnail: episode.thumbnail || "",
            url: episode.url || "",
          }))
        : [],
    });
  };

  const deleteSeries = async (series: SeriesItem) => {
    if (!window.confirm(`Delete "${series.title}" and every episode file from EdgeStore?`)) return;

    try {
      await axios.delete(`/api/admin/series/${series._id}`);
      toast.success("Series deleted");
      if (editingSeriesId === series._id) resetSeriesForm();
      await fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Series delete failed.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Sekai Control</p>
            <h1 className="text-3xl font-bold">Content Manager</h1>
          </div>
          <div className="flex rounded-md border border-border p-1">
            <Button
              type="button"
              variant={activeTab === "movies" ? "default" : "ghost"}
              className="gap-2"
              onClick={() => setActiveTab("movies")}
            >
              <MovieCreationIcon fontSize="small" />
              Movies
            </Button>
            <Button
              type="button"
              variant={activeTab === "series" ? "default" : "ghost"}
              className="gap-2"
              onClick={() => setActiveTab("series")}
            >
              <TvIcon fontSize="small" />
              Series
            </Button>
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

        {activeTab === "movies" ? (
          <section className="grid gap-5 lg:grid-cols-[minmax(320px,420px)_1fr]">
            <form className="flex flex-col gap-4 rounded-md border border-border p-5" onSubmit={(event) => event.preventDefault()}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{editingMovieId ? "Edit Movie" : "New Movie"}</h2>
                {editingMovieId && (
                  <Button type="button" variant="outline" onClick={resetMovieForm}>
                    Cancel
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={movieForm.title} onChange={(event) => setMovieForm({ ...movieForm, title: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={movieForm.description} onChange={(event) => setMovieForm({ ...movieForm, description: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Thumbnail URL</Label>
                <Input value={movieForm.thumbnail} onChange={(event) => setMovieForm({ ...movieForm, thumbnail: event.target.value })} />
                <Input type="file" accept="image/*" onChange={(event) => handleMovieFileUpload(event, "thumbnail", "Movie thumbnail")} />
              </div>
              <div className="grid gap-2">
                <Label>Video URL</Label>
                <Input value={movieForm.url} onChange={(event) => setMovieForm({ ...movieForm, url: event.target.value })} />
                <Input type="file" accept="video/*" onChange={(event) => handleMovieFileUpload(event, "url", "Movie video")} />
              </div>
              <Button type="button" className="gap-2" disabled={isSaving} onClick={saveMovie}>
                <SaveIcon fontSize="small" />
                {editingMovieId ? "Save Movie" : "Create Movie"}
              </Button>
            </form>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Movies</h2>
                <Button type="button" variant="outline" onClick={fetchContent} disabled={isLoading}>
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3">
                {movies.map((movie) => (
                  <article key={movie._id} className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                    <img src={movie.thumbnail} alt={movie.title} className="aspect-video w-full rounded object-cover md:w-[120px]" />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{movie.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{movie.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => editMovie(movie)}>
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" onClick={() => deleteMovie(movie)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                  </article>
                ))}
                {!movies.length && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No movies found.</p>}
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[minmax(340px,520px)_1fr]">
            <form className="flex flex-col gap-4 rounded-md border border-border p-5" onSubmit={(event) => event.preventDefault()}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{editingSeriesId ? "Edit Series" : "New Series"}</h2>
                {editingSeriesId && (
                  <Button type="button" variant="outline" onClick={resetSeriesForm}>
                    Cancel
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={seriesForm.title} onChange={(event) => setSeriesForm({ ...seriesForm, title: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={seriesForm.description} onChange={(event) => setSeriesForm({ ...seriesForm, description: event.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Series Thumbnail URL</Label>
                <Input value={seriesForm.thumbnail} onChange={(event) => setSeriesForm({ ...seriesForm, thumbnail: event.target.value })} />
                <Input type="file" accept="image/*" onChange={handleSeriesThumbnailUpload} />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <h3 className="font-semibold">Episodes</h3>
                <Button type="button" variant="outline" className="gap-2" onClick={addEpisode}>
                  <AddCircleIcon fontSize="small" />
                  Add Episode
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {seriesForm.episodes.map((episode, index) => (
                  <div key={`${episode._id || "new"}-${index}`} className="grid gap-3 rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <Label>Episode</Label>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeEpisode(index)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={episode.episodeNo}
                      onChange={(event) => updateEpisode(index, { episodeNo: Number(event.target.value) })}
                    />
                    <Label>Thumbnail URL</Label>
                    <Input value={episode.thumbnail} onChange={(event) => updateEpisode(index, { thumbnail: event.target.value })} />
                    <Input type="file" accept="image/*" onChange={(event) => handleEpisodeFileUpload(event, index, "thumbnail", `Episode ${episode.episodeNo + 1} thumbnail`)} />
                    <Label>Video URL</Label>
                    <Input value={episode.url} onChange={(event) => updateEpisode(index, { url: event.target.value })} />
                    <Input type="file" accept="video/*" onChange={(event) => handleEpisodeFileUpload(event, index, "url", `Episode ${episode.episodeNo + 1} video`)} />
                  </div>
                ))}
              </div>

              <Button type="button" className="gap-2" disabled={isSaving} onClick={saveSeries}>
                <SaveIcon fontSize="small" />
                {editingSeriesId ? "Save Series" : "Create Series"}
              </Button>
            </form>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Series</h2>
                <Button type="button" variant="outline" onClick={fetchContent} disabled={isLoading}>
                  Refresh
                </Button>
              </div>
              <div className="grid gap-3">
                {seriesList.map((series) => (
                  <article key={series._id} className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                    <img src={series.thumbnail} alt={series.title} className="aspect-video w-full rounded object-cover md:w-[120px]" />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{series.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{series.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{series.episodes?.length || 0} episodes</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => editSeries(series)}>
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" onClick={() => deleteSeries(series)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                  </article>
                ))}
                {!seriesList.length && <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No series found.</p>}
              </div>
            </div>
          </section>
        )}

        <div className="h-16" />
      </div>
    </main>
  );
}
