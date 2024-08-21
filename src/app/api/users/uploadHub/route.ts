import { connect } from "@/dbConfig/dbConfig"
import Hub from "@/models/hubModel.js"
import { NextRequest, NextResponse } from "next/server"

import { getDataFromToken } from "@/helpers/getDataFromToken";


connect()

export async function POST(request: NextRequest) {
    try {

          // Get user ID from token
          const userId = await getDataFromToken(request);

          if (!userId) {
              return NextResponse.json({ error: "User authentication failed" }, { status: 401 });
          }


        const reqBody = await request.json();
        const { title, description, url, thumbnail } = reqBody;

        console.log(reqBody)

        //check if hub already exists

        const hub = await Hub.findOne({ title })

        if (hub) {
            return NextResponse.json({ error: "video already exists" }, { status: 400 })
        }





        const newHub = new Hub({
            title,
            description,
            url,
            thumbnail,
            user:userId
        })

        const savedHub = await newHub.save()

        console.log(savedHub)

        return NextResponse.json({
            message: "video created succesfully",
            success: true,
            savedHub
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.massage }, { status: 500 })
    }

}



