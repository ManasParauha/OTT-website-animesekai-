// app/api/watchlist/get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Watchlist from '@/models/watchlistModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const watchlist = await Watchlist.find({ userId }).populate('animeId');
    return NextResponse.json(watchlist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
