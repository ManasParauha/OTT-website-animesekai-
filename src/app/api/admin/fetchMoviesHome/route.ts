

import { NextRequest, NextResponse } from "next/server";
import Movie from "@/models/movieModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const movie = await Movie.find().limit(3);
        return NextResponse.json({
            mesaaage: "Videos found",
            data: movie
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

