"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import TvIcon from "@mui/icons-material/Tv";
import { Button } from "@/components/ui/button";

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

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"movies" | "series">(
    tabParam === "series" ? "series" : "movies"
  );
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (tabParam === "movies" || tabParam === "series") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const deleteMovie = async (movie: MovieItem) => {
    if (!window.confirm(`Delete "${movie.title}" from database and EdgeStore?`)) return;

    try {
      await axios.delete(`/api/admin/movies/${movie._id}`);
      toast.success("Movie deleted");
      await fetchContent();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Movie delete failed.");
    }
  };

  const deleteSeries = async (series: SeriesItem) => {
    if (!window.confirm(`Delete "${series.title}" and every episode file from EdgeStore?`)) return;

    try {
      await axios.delete(`/api/admin/series/${series._id}`);
      toast.success("Series deleted");
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

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{activeTab === "movies" ? "Movies" : "Series"}</h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === "movies"
                  ? "Manage movie records and their stored video assets."
                  : "Manage series records, thumbnails, and episode assets."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={fetchContent} disabled={isLoading}>
                Refresh
              </Button>
              <Button asChild className="gap-2">
                <Link href={activeTab === "movies" ? "/sekai-control/movies/new" : "/sekai-control/series/new"}>
                  <AddCircleIcon fontSize="small" />
                  {activeTab === "movies" ? "New Movie" : "New Series"}
                </Link>
              </Button>
            </div>
          </div>

          {activeTab === "movies" ? (
            <div className="grid gap-3">
              {movies.map((movie) => (
                <article
                  key={movie._id}
                  className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[160px_1fr_auto] md:items-center"
                >
                  <img src={movie.thumbnail} alt={movie.title} className="aspect-video w-full rounded object-cover md:w-[160px]" />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">{movie.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{movie.description || "No description"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild type="button" variant="outline" size="icon">
                      <Link href={`/sekai-control/movies/${movie._id}/edit`}>
                        <EditIcon fontSize="small" />
                      </Link>
                    </Button>
                    <Button type="button" variant="destructive" size="icon" onClick={() => deleteMovie(movie)}>
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </div>
                </article>
              ))}
              {!movies.length && (
                <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No movies found.</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {seriesList.map((series) => (
                <article
                  key={series._id}
                  className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[160px_1fr_auto] md:items-center"
                >
                  <img src={series.thumbnail} alt={series.title} className="aspect-video w-full rounded object-cover md:w-[160px]" />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">{series.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{series.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{series.episodes?.length || 0} episodes</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild type="button" variant="outline" size="icon">
                      <Link href={`/sekai-control/series/${series._id}/edit`}>
                        <EditIcon fontSize="small" />
                      </Link>
                    </Button>
                    <Button type="button" variant="destructive" size="icon" onClick={() => deleteSeries(series)}>
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </div>
                </article>
              ))}
              {!seriesList.length && (
                <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No series found.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
