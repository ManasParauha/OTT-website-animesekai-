import {connect} from "@/dbConfig/dbConfig"
import Video from "@/models/videoModel.js"
import { NextRequest,NextResponse } from "next/server"


connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {title, description,episode,url} = reqBody;

        console.log(reqBody)

        //check if video already exists

        const video = await Video.findOne({title},{episode})

        if(video){
            return NextResponse.json({error:"video already exists"},{status:400})   
        }

      

        

       const newVideo =  new Video({
            title,
            description,
            episode,
            url
        })

        const savedVideo =await newVideo.save()

        console.log(savedVideo)

        return NextResponse.json({
            message:"Video created succesfully",
            success:true,
            savedVideo
        })

        
    } catch (error:any) {
        return NextResponse.json({error:error.massage},{status:500})       
    }
    
}



