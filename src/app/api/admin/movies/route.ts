import { NextRequest, NextResponse } from "next/server";
import Movie from "@/models/movieModel";
import { connect } from "@/dbConfig/dbConfig";
import { denyIfNotAdmin } from "@/helpers/adminAuth";

connect();

export const dynamic = "force-dynamic";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateMoviePayload(body: any) {
  const title = text(body.title);
  const description = text(body.description);
  const thumbnail = text(body.thumbnail);
  const url = text(body.url);

  if (!title || !thumbnail || !url) {
    return { error: "Title, thumbnail, and video URL are required." };
  }

  return {
    data: {
      title,
      description,
      thumbnail,
      url,
    },
  };
}

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  try {
    const movies = await Movie.find().sort({ _id: -1 });
    return NextResponse.json({ movies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = validateMoviePayload(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const existingMovie = await Movie.findOne({ title: result.data.title });
    if (existingMovie) {
      return NextResponse.json({ error: "Movie already exists." }, { status: 400 });
    }

    const movie = await Movie.create(result.data);
    return NextResponse.json({ movie }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

