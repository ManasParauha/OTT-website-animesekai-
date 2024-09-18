import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"
import Watchlist from "@/models/watchlistModel";
import Movie from "@/models/movieModel";
import Series from "@/models/seriesModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";


connect()
export async function GET(request: NextRequest) {

    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const watchlistItems = await Watchlist.find({ userId });
        

        // if(!watchlistItems.length) { return NextResponse.json({ error: "No items found in your watchlist." }, { status: 404 }); }

        const populatedWatchlist = await Promise.all(
            watchlistItems.map(async (item) => {
              let video;
              if (item.videoType === 'series') {
                video = await Series.findById(item.videoId);
              } else if (item.videoType === 'movies') {
                video = await Movie.findById(item.videoId);
              }
      
              if (!video) {
                return null;
              }
      
              return {
                ...item.toObject(),
                videoDetails: video,
              };
            })
          );
      
          // Filter out null items
          const filteredWatchlist = populatedWatchlist.filter((item) => item !== null);
        

        return NextResponse.json({ watchlistItems: filteredWatchlist }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}