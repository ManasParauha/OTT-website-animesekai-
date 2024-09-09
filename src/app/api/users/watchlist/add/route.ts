// app/api/watchlist/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Watchlist from '@/models/watchlistModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const { userId, animeId } = await request.json();

    // Check if the anime is already in the user's watchlist
    const existingItem = await Watchlist.findOne({ userId, animeId });
    if (existingItem) {
      return NextResponse.json({ message: 'Already in watchlist' }, { status: 400 });
    }

    // Add the anime to the watchlist
    const newItem = new Watchlist({ userId, animeId });
    await newItem.save();

    return NextResponse.json({ message: 'Added to watchlist' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
