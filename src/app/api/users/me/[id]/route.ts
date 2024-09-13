import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/userModel';
import {connect} from "@/dbConfig/dbConfig"; //  Adjust the import path based on your project structure

// Fetch user details by ID
connect()
export async function GET(request:NextRequest, { params }: { params: { id: string } }) {
  

  const { id } = params; // Extract the user ID from the request URL

  try {
    const user = await User.findById(id); // Fetch the user from the database using Mongoose
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user); // Return the user details
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}
