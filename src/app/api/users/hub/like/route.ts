// src/app/api/hub/like/route.ts
import { NextResponse, NextRequest } from 'next/server';
import Hub from '@/models/hubModel'; // Update the import path based on your project structure
import { connect } from "@/dbConfig/dbConfig"; // Make sure to connect to your database
import { getDataFromToken } from '@/helpers/getDataFromToken';
import mongoose from 'mongoose';
connect()
export async function POST(request: NextRequest) {

    try {
        const { hubId } = await request.json();
        const userId = getDataFromToken(request);
       

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }



        // Find the Hub item by ID and increment the like count
        const hub = await Hub.findById(hubId);
        if (!hub) {
            return NextResponse.json({ message: 'Hub not found' }, { status: 404 });
        }

        if (!hub.likedBy) {
            hub.likedBy = [];
          }

   

        
        if (hub.likedBy.includes(userId)) {
            return NextResponse.json({ message: 'Already liked' }, { status: 400 });
        }
        hub.likes = (hub.likes || 0) + 1;
        hub.likedBy.push(userId);
        await hub.save();

        
        
       
        //   const updatedHub = await hub.save();

        console.log('Hub after update:', hub);
        






        return NextResponse.json({ likes: hub.likes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error liking Hub', error }, { status: 500 });
    }
}
