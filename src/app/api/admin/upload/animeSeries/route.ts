import {connect} from "@/dbConfig/dbConfig"
import Series from "@/models/seriesModel"
import { NextRequest,NextResponse } from "next/server"
import { denyIfNotAdmin } from "@/helpers/adminAuth";


connect()

export async function POST(request:NextRequest) {
    const denied = await denyIfNotAdmin(request);
    if (denied) return denied;

    try {
        const reqBody = await request.json();
        const {title, description,thumbnail,episodes} = reqBody;

        if (!title?.trim() || !description?.trim() || !thumbnail?.trim()) {
            return NextResponse.json({error:"title, description, and thumbnail are required"},{status:400})
        }

        if (!Array.isArray(episodes)) {
            return NextResponse.json({error:"episodes must be an array"},{status:400})
        }

        //check if video already exists

        const series = await Series.findOne({title})

        if(series){
            return NextResponse.json({error:"series already exists"},{status:400})   
        }

      

        

       const newSeries =  new Series({
            title,
            description,
            thumbnail,
            episodes
        })

        const savedSeries =await newSeries.save()

        console.log(savedSeries)

        return NextResponse.json({
            message:"Series created succesfully",
            success:true,
            savedSeries
        })

        
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})       
    }
    
}



