// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig"
import Comment from '@/models/commetSchema';
import Hub from '@/models/hubModel';

// POST /api/comments
connect()
export  async function POST(req: NextRequest) {
 
    try {
      const reqBody = await req.json();
      const {content, userId, hubId} = reqBody;
      
       
      // Create a new comment
      const newComment = await Comment.create({ content, userId, hubId });

      const savedComment =await newComment.save()
      // Optionally, add comment reference to Hub
      await Hub.findByIdAndUpdate(hubId, { $push: { comments: newComment._id } });

     return NextResponse.json({ message: 'Comment added successfully', comment: savedComment });
    } catch (error) {
      return NextResponse.json({ message: 'Error adding comment', error });
    }
  
}
