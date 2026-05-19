import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Watchlist from "@/models/watchlistModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";


connect()


export async function DELETE(request: NextRequest) {


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

        const removedItem = await Watchlist.findOneAndDelete({ userId, videoId, videoType });

        if(!removedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item removed successfully", removedItem }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
