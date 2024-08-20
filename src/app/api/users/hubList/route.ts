

import { NextRequest, NextResponse } from "next/server";
import Hub from "@/models/movieModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const hub = await Hub.find();
        return NextResponse.json({
            message: "Videos found",
            data: hub
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

