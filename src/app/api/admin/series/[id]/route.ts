import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Series from "@/models/seriesModel";
import { connect } from "@/dbConfig/dbConfig";
import { denyIfNotAdmin } from "@/helpers/adminAuth";
import { deleteEdgeStoreFiles } from "@/lib/edgestoreServer";

connect();

export const dynamic = "force-dynamic";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateEpisodes(episodes: unknown) {
  if (!Array.isArray(episodes)) {
    return { data: [] };
  }

  const normalizedEpisodes = episodes.map((episode: any, index: number) => ({
    episodeNo: Number.isFinite(Number(episode.episodeNo)) ? Number(episode.episodeNo) : index,
    thumbnail: text(episode.thumbnail),
    url: text(episode.url),
  }));

  const hasInvalidEpisode = normalizedEpisodes.some(
    (episode) => !episode.thumbnail || !episode.url
  );

  if (hasInvalidEpisode) {
    return { error: "Every episode needs a thumbnail and video URL." };
  }

  return { data: normalizedEpisodes };
}

function validateSeriesPayload(body: any) {
  const title = text(body.title);
  const description = text(body.description);
  const thumbnail = text(body.thumbnail);
  const episodes = validateEpisodes(body.episodes);

  if (!title || !description || !thumbnail) {
    return { error: "Title, description, and thumbnail are required." };
  }

  if ("error" in episodes) {
    return { error: episodes.error };
  }

  return {
    data: {
      title,
      description,
      thumbnail,
      episodes: episodes.data,
    },
  };
}

function collectSeriesUrls(series: any) {
  return [
    series.thumbnail,
    ...(Array.isArray(series.episodes)
      ? series.episodes.flatMap((episode: any) => [episode.thumbnail, episode.url])
      : []),
  ];
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid series id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const result = validateSeriesPayload(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const duplicate = await Series.findOne({
      _id: { $ne: params.id },
      title: result.data.title,
    });

    if (duplicate) {
      return NextResponse.json({ error: "Another series already uses this title." }, { status: 400 });
    }

    const series = await Series.findByIdAndUpdate(params.id, result.data, { new: true });

    if (!series) {
      return NextResponse.json({ error: "Series not found." }, { status: 404 });
    }

    return NextResponse.json({ series }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid series id." }, { status: 400 });
  }

  try {
    const series = await Series.findById(params.id);

    if (!series) {
      return NextResponse.json({ error: "Series not found." }, { status: 404 });
    }

    await deleteEdgeStoreFiles(collectSeriesUrls(series));
    await Series.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Series deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

