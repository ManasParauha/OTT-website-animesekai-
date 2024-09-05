

import { NextRequest, NextResponse } from "next/server";
import Movie from "@/models/movieModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const video = await Movie.findOne({}).select("-password");
        
        // const video = await Movie.aggregate([
        //     { $sample: { size: 1 } }, // Select one random document
        //     { $project: { password: 0 } } // Exclude the password field
        //   ]);

        return NextResponse.json({
            mesaaage: "Movie found",
            data: video
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

