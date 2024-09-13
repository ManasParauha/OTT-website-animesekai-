
import { NextResponse } from 'next/server';
import Series from '@/models/seriesModel';
import { connect } from "@/dbConfig/dbConfig";


interface Episode {
    episodeNo: number;
    thumbnail: string;
    url: string;
  }
  
  interface SeriesType {
    title: string;
    episodes: Episode[];
  }
  connect();
  export async function GET() {
    try {
      
  
      // Fetch all series with their episodes and cast them to the expected type
      const seriesData = await Series.find({}, 'title episodes').lean() as SeriesType[];
  
      // Extract and format episodes from each series
      const allEpisodes = seriesData.flatMap((series) =>
        series.episodes.map((episode) => ({
          seriesTitle: series.title,
          episodeNo: episode.episodeNo,
          thumbnail: episode.thumbnail,
          url: episode.url,
        }))
      );
  
      // Return the episodes data as JSON
      return NextResponse.json(allEpisodes);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
    }
  }