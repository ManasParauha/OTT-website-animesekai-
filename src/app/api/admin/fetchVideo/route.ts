

import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/videoModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const video = await Video.findOne({}).select("-password");
        return NextResponse.json({
            mesaaage: "Video found",
            data: video
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

