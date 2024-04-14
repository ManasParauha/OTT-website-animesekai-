

import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/videoModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const video = await Video.find().limit(3);
        return NextResponse.json({
            mesaaage: "Videos found",
            data: video
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

