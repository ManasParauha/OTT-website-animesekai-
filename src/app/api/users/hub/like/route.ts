// src/app/api/hub/like/route.ts
import { NextResponse, NextRequest } from 'next/server';
import Hub from '@/models/hubModel'; // Update the import path based on your project structure
import { connect } from "@/dbConfig/dbConfig"; // Make sure to connect to your database
import { getDataFromToken } from '@/helpers/getDataFromToken';
import mongoose from 'mongoose';

connect();

export async function POST(request: NextRequest) {
    try {
        const { hubId } = await request.json();
        const userId = getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const hub = await Hub.findById(hubId);
        if (!hub) {
            return NextResponse.json({ message: 'Hub not found' }, { status: 404 });
        }

        if (!hub.likedBy) {
            hub.likedBy = [];
        }

        // Convert userId to ObjectId 
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (hub.likedBy.includes(userObjectId)) {
            // User has already liked, so unlike it
            hub.likes = Math.max((hub.likes || 0) - 1, 0); // Decrease like count, ensuring it doesn't go below 0
            hub.likedBy = hub.likedBy.filter((id:any) => !id.equals(userObjectId)); // Remove user from likedBy
        } else {
            // User has not liked yet, so like it
            hub.likes = (hub.likes || 0) + 1; // Increase like count
            hub.likedBy.push(userObjectId); // Add user to likedBy
        }

        await hub.save();

        return NextResponse.json({ likes: hub.likes, isLiked: hub.likedBy.includes(userObjectId) }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating Hub', error }, { status: 500 });
    }
}
