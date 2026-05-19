import Watchlist from '@/models/watchlistModel';
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let userId: string;
    try {
      userId = getDataFromToken(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    const videoType = searchParams.get('videoType');

    if (!videoId || !videoType) {
      return NextResponse.json({ error: 'Missing watchlist item details' }, { status: 400 });
    }

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
