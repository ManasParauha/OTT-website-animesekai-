import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Watchlist from "@/models/watchlistModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";


connect()


export async function POST(request: NextRequest) {


    try {
        let userId: string;
        try {
            userId = getDataFromToken(request);
        } catch {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reqBody = await request.json();
        const { videoId, videoType } = reqBody;

        if (!videoId || !videoType) {
            return NextResponse.json({ error: "Missing watchlist item details" }, { status: 400 });
        }

        const existingItem = await Watchlist.findOne({ userId, videoId, videoType });
        if (existingItem) {
            return NextResponse.json({ error: "Item already exists" }, { status: 400 });
        }

        const newItem = new Watchlist({
            userId,
            videoId,
            videoType
        });

        const savedItem = await newItem.save();
        return NextResponse.json({ message: "Item added successfully", savedItem }, { status: 200 });

    } catch (error) {
           return NextResponse.json({ error }, { status: 500 });
    }
}
