

import { NextRequest, NextResponse } from "next/server";
import Movie from "@/models/movieModel.js";
import Series from "@/models/seriesModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export const dynamic = "force-dynamic";

function normalizeMovie(movie: any) {
  return {
    type: "movie",
    id: movie._id,
    title: movie.title,
    description: movie.description || "",
    thumbnail: movie.thumbnail,
    url: movie.url,
  };
}

function normalizeSeries(series: any) {
  const firstEpisode = Array.isArray(series.episodes)
    ? [...series.episodes].sort((a: any, b: any) => Number(a.episodeNo) - Number(b.episodeNo))[0]
    : null;

  return {
    type: "series",
    id: series._id,
    title: series.title,
    seriesTitle: series.title,
    description: series.description || "",
    thumbnail: series.thumbnail,
    episodeNo: firstEpisode?.episodeNo ?? 0,
    url: firstEpisode?.url || "",
  };
}

async function pickRandomHeroItem() {
  const [movies, seriesList] = await Promise.all([
    Movie.aggregate([{ $sample: { size: 1 } }]),
    Series.aggregate([{ $sample: { size: 1 } }]),
  ]);

  const candidates = [
    ...movies.map(normalizeMovie),
    ...seriesList.map(normalizeSeries),
  ].filter((item) => item.thumbnail && item.title);

  if (!candidates.length) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export async function GET(request:NextRequest){

    try {
        const heroItem = await pickRandomHeroItem();

        return NextResponse.json({
            message: heroItem ? "Hero item found" : "No hero item found",
            data: heroItem
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

