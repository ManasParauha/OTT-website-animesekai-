import {connect} from "@/dbConfig/dbConfig"
import Series from "@/models/seriesModel"
import { NextRequest,NextResponse } from "next/server"


connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {title, description,thumbnail,episodes} = reqBody;

        console.log(reqBody)

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
        return NextResponse.json({error:error.massage},{status:500})       
    }
    
}



