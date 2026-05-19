import { NextRequest, NextResponse } from "next/server";
import Series from "@/models/seriesModel";
import { connect } from "@/dbConfig/dbConfig";
import { denyIfNotAdmin } from "@/helpers/adminAuth";

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

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  try {
    const series = await Series.find().sort({ _id: -1 });
    return NextResponse.json({ series }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = validateSeriesPayload(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const existingSeries = await Series.findOne({ title: result.data.title });
    if (existingSeries) {
      return NextResponse.json({ error: "Series already exists." }, { status: 400 });
    }

    const series = await Series.create(result.data);
    return NextResponse.json({ series }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

