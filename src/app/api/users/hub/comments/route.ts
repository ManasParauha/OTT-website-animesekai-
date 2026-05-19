// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbConfig/dbConfig"
import Comment from '@/models/commetSchema';
import Hub from '@/models/hubModel';
import { getDataFromToken } from "@/helpers/getDataFromToken";

// POST /api/comments
connect()
export  async function POST(req: NextRequest) {
 
    try {
      let userId: string;
      try {
        userId = getDataFromToken(req);
      } catch {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const reqBody = await req.json();
      const {content, hubId} = reqBody;
      const trimmedContent = typeof content === 'string' ? content.trim() : '';

      if (!trimmedContent || !hubId) {
        return NextResponse.json({ message: 'Comment and hub are required' }, { status: 400 });
      }
      
       
      // Create a new comment
      const newComment = await Comment.create({ content: trimmedContent, userId, hubId });

      const savedComment =await newComment.save()
      // Optionally, add comment reference to Hub
      await Hub.findByIdAndUpdate(hubId, { $push: { comments: newComment._id } });

     return NextResponse.json({ message: 'Comment added successfully', comment: savedComment }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error adding comment', error }, { status: 500 });
    }
  
}
