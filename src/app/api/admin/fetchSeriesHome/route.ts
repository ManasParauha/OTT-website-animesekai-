

import { NextRequest, NextResponse } from "next/server";
import Series from "@/models/seiresModel.js";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        
        const series = await Series.find().limit(3);
        return NextResponse.json({
            mesaaage: "series found",
            data: series
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

