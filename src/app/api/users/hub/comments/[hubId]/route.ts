// app/api/comments/[hubId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect} from '@/dbConfig/dbConfig'
import Comment from '@/models/commetSchema'


connect()
// Fetch comments for a specific Hub post by hubId
export async function GET(req: NextRequest, { params }: { params: { hubId: string } }) {
  const { hubId } = params;

  try {
   // Ensure the database is connected

    // Find all comments associated with the given hubId
    const comments = await Comment.find({ hubId });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments', error }, { status: 500 });
  }
}
