import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Movie from "@/models/movieModel";
import { connect } from "@/dbConfig/dbConfig";
import { denyIfNotAdmin } from "@/helpers/adminAuth";
import { deleteEdgeStoreFiles } from "@/lib/edgestoreServer";

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid movie id." }, { status: 400 });
  }

  try {
    const movie = await Movie.findById(params.id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }

    return NextResponse.json({ movie }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid movie id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const result = validateMoviePayload(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const duplicate = await Movie.findOne({
      _id: { $ne: params.id },
      title: result.data.title,
    });

    if (duplicate) {
      return NextResponse.json({ error: "Another movie already uses this title." }, { status: 400 });
    }

    const movie = await Movie.findByIdAndUpdate(params.id, result.data, { new: true });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }

    return NextResponse.json({ movie }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid movie id." }, { status: 400 });
  }

  try {
    const movie = await Movie.findById(params.id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    }

    await deleteEdgeStoreFiles([movie.thumbnail, movie.url]);
    await Movie.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Movie deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
