// app/api/watchlist/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Watchlist from '@/models/watchlistModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function DELETE(request: NextRequest) {
  try {
    const { userId, animeId } = await request.json();

    await Watchlist.findOneAndDelete({ userId, animeId });

    return NextResponse.json({ message: 'Removed from watchlist' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
