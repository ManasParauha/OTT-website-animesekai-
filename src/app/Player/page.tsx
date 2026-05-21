"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import poster from "../../../public/blur.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import HighQualityIcon from "@mui/icons-material/HighQuality";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpeedIcon from "@mui/icons-material/Speed";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QualityOption = {
  label: string;
  url: string;
};

type VideoDetails = {
  title?: string;
  seriesTitle?: string;
  description?: string;
  episodeNo?: string | number;
  url?: string;
  thumbnail?: string;
  qualities?: QualityOption[];
};

type PlayerSearchParams = {
  title?: string;
  seriesTitle?: string;
  description?: string;
  episodeNo?: string | number;
  url?: string;
  thumbnail?: string;
  videoDetails?: string;
  qualities?: string;
};

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const skipSeconds = 15;

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getMediaDuration(videoElement?: HTMLVideoElement | null) {
  if (!videoElement) return 0;

  if (Number.isFinite(videoElement.duration) && videoElement.duration > 0) {
    return videoElement.duration;
  }

  const seekable = videoElement.seekable;
  if (seekable.length > 0) {
    const seekableEnd = seekable.end(seekable.length - 1);
    if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
      return seekableEnd;
    }
  }

  return 0;
}

function parseJsonObject(value?: string): unknown {
  if (!value) return {};

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse video details:", error);
    return {};
  }
}

function normalizeQualities(video: VideoDetails, rawQualities?: string) {
  const rawParsedQualities = parseJsonObject(rawQualities);
  const parsedQualities = (Array.isArray(video.qualities)
    ? video.qualities
    : Array.isArray(rawParsedQualities)
      ? rawParsedQualities
      : []) as QualityOption[];

  const validQualities = parsedQualities.filter((quality) => quality?.label && quality?.url);

  if (validQualities.length) {
    return validQualities;
  }

  return video.url ? [{ label: "Source", url: video.url }] : [];
}

export default function PlayerPage({ searchParams }: { searchParams: PlayerSearchParams }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const pendingPlaybackRef = useRef<{ time: number; shouldPlay: boolean } | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parsedVideoDetails = useMemo(
    () => parseJsonObject(searchParams.videoDetails) as VideoDetails,
    [searchParams.videoDetails]
  );

  const video = useMemo<VideoDetails>(
    () => ({
      ...parsedVideoDetails,
      title: searchParams.title || parsedVideoDetails.title || "",
      seriesTitle: searchParams.seriesTitle || parsedVideoDetails.seriesTitle || "",
      description: searchParams.description || parsedVideoDetails.description || "",
      episodeNo: searchParams.episodeNo ?? parsedVideoDetails.episodeNo,
      url: searchParams.url || parsedVideoDetails.url || "",
      thumbnail: searchParams.thumbnail || parsedVideoDetails.thumbnail || "",
    }),
    [parsedVideoDetails, searchParams]
  );

  const qualityOptions = useMemo(
    () => normalizeQualities(video, searchParams.qualities),
    [video, searchParams.qualities]
  );

  const [activeSourceUrl, setActiveSourceUrl] = useState(video.url || "");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const title = video.title || video.seriesTitle || "Untitled";
  const episodeLabel =
    video.episodeNo !== undefined && video.episodeNo !== ""
      ? `Episode ${Number(video.episodeNo) + 1}`
      : "";
  const thumbnail = video.thumbnail || "";
  const activeQuality = qualityOptions.find((quality) => quality.url === activeSourceUrl) || qualityOptions[0];
  const seekDuration = duration || Math.max(currentTime, 1);

  const syncVideoDuration = useCallback((videoElement = videoRef.current) => {
    const nextDuration = getMediaDuration(videoElement);

    if (nextDuration > 0) {
      setDuration((currentDuration) =>
        Math.abs(currentDuration - nextDuration) > 0.25 ? nextDuration : currentDuration
      );
    }

    return nextDuration;
  }, []);

  useEffect(() => {
    setActiveSourceUrl(video.url || qualityOptions[0]?.url || "");
  }, [qualityOptions, video.url]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [activeSourceUrl]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.volume = volume;
    videoElement.muted = isMuted;
    videoElement.playbackRate = playbackRate;
  }, [isMuted, playbackRate, volume]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);

    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    controlsTimerRef.current = setTimeout(() => {
      if (!videoRef.current?.paused) {
        setControlsVisible(false);
      }
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  const playVideo = useCallback(async () => {
    try {
      await videoRef.current?.play();
    } catch {
      setControlsVisible(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !activeSourceUrl) return;

    if (videoElement.paused) {
      playVideo();
    } else {
      videoElement.pause();
    }
  }, [activeSourceUrl, playVideo]);

  const skipBy = useCallback((seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const mediaDuration = syncVideoDuration(videoElement) || duration;
    const targetTime = Math.max(videoElement.currentTime + seconds, 0);
    const nextTime = mediaDuration > 0 ? Math.min(targetTime, mediaDuration) : targetTime;

    videoElement.currentTime = nextTime;
    setCurrentTime(nextTime);
    showControlsTemporarily();
  }, [duration, showControlsTemporarily, syncVideoDuration]);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => !current);
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const toggleFullscreen = useCallback(async () => {
    if (!playerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await playerRef.current.requestFullscreen();
    }
  }, []);

  const handleSeek = (value: string) => {
    const nextTime = Number(value);
    if (!Number.isFinite(nextTime)) return;

    setCurrentTime(nextTime);

    if (videoRef.current) {
      syncVideoDuration(videoRef.current);
      videoRef.current.currentTime = nextTime;
    }

    showControlsTemporarily();
  };

  const changePlaybackRate = (value: string) => {
    const nextRate = Number(value);
    setPlaybackRate(nextRate);

    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const changeQuality = (url: string) => {
    if (!videoRef.current || url === activeSourceUrl) return;

    pendingPlaybackRef.current = {
      time: videoRef.current.currentTime,
      shouldPlay: !videoRef.current.paused,
    };
    setActiveSourceUrl(url);
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const mediaDuration = syncVideoDuration(videoElement);

    if (pendingPlaybackRef.current) {
      videoElement.currentTime = mediaDuration > 0
        ? Math.min(pendingPlaybackRef.current.time, mediaDuration)
        : pendingPlaybackRef.current.time;

      if (pendingPlaybackRef.current.shouldPlay) {
        playVideo();
      }

      pendingPlaybackRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
      }

      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePlay();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        skipBy(-10);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        skipBy(10);
      }

      if (event.key.toLowerCase() === "m") {
        toggleMute();
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [skipBy, toggleFullscreen, toggleMute, togglePlay]);

  return (
    <main className="min-h-screen bg-background text-foreground md:pl-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 py-4 sm:px-5 md:py-8">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" className="gap-2 px-0">
            <Link href="/">
              <ArrowBackIcon fontSize="small" />
              Back
            </Link>
          </Button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Space/K: play, arrows: seek, M: mute, F: fullscreen
          </p>
        </div>

        <section
          ref={playerRef}
          className="group relative aspect-video w-full overflow-hidden rounded-md border border-border bg-black shadow-2xl"
          onMouseMove={showControlsTemporarily}
          onFocus={showControlsTemporarily}
        >
          {activeSourceUrl ? (
            <video
              ref={videoRef}
              src={activeSourceUrl}
              poster={thumbnail || undefined}
              autoPlay
              playsInline
              className={`h-full w-full bg-black ${fitMode === "contain" ? "object-contain" : "object-cover"}`}
              onClick={togglePlay}
              onLoadedMetadata={handleLoadedMetadata}
              onLoadedData={(event) => syncVideoDuration(event.currentTarget)}
              onDurationChange={(event) => syncVideoDuration(event.currentTarget)}
              onCanPlay={(event) => syncVideoDuration(event.currentTarget)}
              onProgress={(event) => syncVideoDuration(event.currentTarget)}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
                syncVideoDuration(event.currentTarget);
              }}
              onPlay={() => {
                setIsPlaying(true);
                showControlsTemporarily();
              }}
              onPause={() => {
                setIsPlaying(false);
                setControlsVisible(true);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setControlsVisible(true);
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black">
              <p className="text-sm text-muted-foreground">No video source available.</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/55" />

          <div
            className={`absolute inset-0 flex flex-col justify-between p-3 text-white transition-opacity duration-200 sm:p-5 ${
              controlsVisible || !isPlaying ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                togglePlay();
              }
            }}
            onDoubleClick={toggleFullscreen}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-normal text-white/70">
                  {episodeLabel || "Now Playing"}
                </p>
                <h1 className="line-clamp-2 text-xl font-bold sm:text-3xl">{title}</h1>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/15 hover:text-white"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </Button>
            </div>

            <div className="flex flex-1 items-center justify-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/35 text-white hover:bg-white/15 hover:text-white"
                onClick={() => skipBy(-skipSeconds)}
                aria-label={`Skip back ${skipSeconds} seconds`}
              >
                -{skipSeconds}s
              </Button>
              <Button
                type="button"
                size="icon"
                className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                disabled={!activeSourceUrl}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/35 text-white hover:bg-white/15 hover:text-white"
                onClick={() => skipBy(skipSeconds)}
                aria-label={`Skip forward ${skipSeconds} seconds`}
              >
                +{skipSeconds}s
              </Button>
            </div>

            <div className="grid gap-3">
              <input
                type="range"
                min={0}
                max={seekDuration}
                step={0.1}
                value={Math.min(currentTime, seekDuration)}
                onChange={(event) => handleSeek(event.target.value)}
                className="h-1 w-full cursor-pointer accent-white"
                aria-label="Seek video"
                disabled={!activeSourceUrl}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/15 hover:text-white"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    disabled={!activeSourceUrl}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </Button>
                  <p className="min-w-24 text-sm font-medium text-white/90">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-black/35 px-2 py-1">
                    <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                      {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={(event) => {
                        const nextVolume = Number(event.target.value);
                        setVolume(nextVolume);
                        setIsMuted(nextVolume === 0);
                      }}
                      className="h-1 w-20 cursor-pointer accent-white"
                      aria-label="Volume"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" className="gap-2 text-white hover:bg-white/15 hover:text-white">
                        <SpeedIcon fontSize="small" />
                        {playbackRate}x
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={String(playbackRate)} onValueChange={changePlaybackRate}>
                        {playbackRates.map((rate) => (
                          <DropdownMenuRadioItem key={rate} value={String(rate)}>
                            {rate}x
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" className="gap-2 text-white hover:bg-white/15 hover:text-white">
                        <HighQualityIcon fontSize="small" />
                        {activeQuality?.label || "Source"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Quality</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={activeSourceUrl} onValueChange={changeQuality}>
                        {qualityOptions.map((quality) => (
                          <DropdownMenuRadioItem key={quality.url} value={quality.url}>
                            {quality.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-2 text-white hover:bg-white/15 hover:text-white"
                    onClick={() => setFitMode((current) => (current === "contain" ? "cover" : "contain"))}
                  >
                    <FitScreenIcon fontSize="small" />
                    {fitMode === "contain" ? "Fit" : "Fill"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/15 hover:text-white"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-md border border-border bg-background/60 p-3 sm:flex-row sm:items-center sm:p-4">
          <Image
            src={thumbnail || poster}
            width={160}
            height={90}
            alt={`${title} thumbnail`}
            className="aspect-video w-full rounded-md object-cover sm:w-40"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{episodeLabel || "Movie"}</p>
            <h2 className="text-2xl font-bold">{title}</h2>
            {video.description && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{video.description}</p>
            )}
          </div>
        </section>

        <div className="h-20 md:h-0" />
      </div>
    </main>
  );
}
