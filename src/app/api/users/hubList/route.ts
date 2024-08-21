import { NextRequest, NextResponse } from "next/server";
import Hub from "@/models/hubModel.js"; // Make sure this is the correct model
import User from "@/models/userModel.js";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
    try {
        // Fetch all hubs
        const hubs = await Hub.find();

        // Initialize an array to store hubs with user data
        const hubsWithUserData = [];

        // Loop through each hub to get the associated user's data
        for (const hub of hubs) {
            const userId = hub.user;

            // Fetch the user's data using the ID
            const user = await User.findById(userId).select('username photo');

            // Append user data to the hub object
            hubsWithUserData.push({
                ...hub.toObject(),
                user: {
                    username: user.username,
                    photo: user.photo
                }
            });
        }

        return NextResponse.json({
            message: "Videos found",
            data: hubsWithUserData
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
