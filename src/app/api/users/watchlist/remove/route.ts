import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Watchlist from "@/models/watchlistModel";


connect()


export async function DELETE(request: NextRequest) {


    try {
        const reqBody = await request.json();
        const { userId, videoId, videoType } = reqBody;

        const removedItem = await Watchlist.findOneAndDelete({ userId, videoId, videoType });

        if(!removedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item removed successfully", removedItem }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}