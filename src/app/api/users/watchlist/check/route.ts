import Watchlist from '@/models/watchlistModel';
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const videoId = searchParams.get('videoId');
    const videoType = searchParams.get('videoType');

    // Find the watchlist item using query parameters
    const watchlistItem = await Watchlist.findOne({
      userId,
      videoId,
      videoType,
    });

    // Return true if the item is found, false otherwise
    const isInWatchlist = Boolean(watchlistItem);

    return NextResponse.json({ isInWatchlist }, { status: 200 });
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    return NextResponse.json({ error: 'Error checking watchlist status' }, { status: 500 });
  }
}
