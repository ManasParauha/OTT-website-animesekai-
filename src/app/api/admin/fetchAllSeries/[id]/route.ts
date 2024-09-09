// app/api/series/[id]/route.ts

import { NextResponse } from 'next/server';
import Series from '@/models/seiresModel'; 
import { connect } from "@/dbConfig/dbConfig";


connect()
export async function GET(request: Request, { params }: { params: { id: string } }) {
 

  try {
    const series = await Series.findById(params.id);
    if (!series) {
      return NextResponse.json({ message: 'Series not found' }, { status: 404 });
    }

    return NextResponse.json(series, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching series details', error }, { status: 500 });
  }
}
