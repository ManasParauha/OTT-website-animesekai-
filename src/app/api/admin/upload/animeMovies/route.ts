import {connect} from "@/dbConfig/dbConfig"
import Movie from "@/models/movieModel.js"
import { NextRequest,NextResponse } from "next/server"
import { denyIfNotAdmin } from "@/helpers/adminAuth";


connect()

export async function POST(request:NextRequest) {
    const denied = await denyIfNotAdmin(request);
    if (denied) return denied;

    try {
        const reqBody = await request.json();
        const {title, description,url,thumbnail} = reqBody;

        if (!title?.trim() || !url?.trim() || !thumbnail?.trim()) {
            return NextResponse.json({error:"title, video URL, and thumbnail are required"},{status:400})
        }

        //check if video already exists

        const movie = await Movie.findOne({title})

        if(movie){
            return NextResponse.json({error:"video already exists"},{status:400})   
        }

      

        

       const newMovie =  new Movie({
            title,
            description,
            url,
            thumbnail
        })

        const savedMovie =await newMovie.save()

        console.log(savedMovie)

        return NextResponse.json({
            message:"Movie created succesfully",
            success:true,
            savedMovie
        })

        
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})       
    }
    
}



