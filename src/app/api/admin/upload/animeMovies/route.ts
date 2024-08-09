import {connect} from "@/dbConfig/dbConfig"
import Movie from "@/models/movieModel.js"
import { NextRequest,NextResponse } from "next/server"


connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {title, description,url,thumbnail} = reqBody;

        console.log(reqBody)

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
        return NextResponse.json({error:error.massage},{status:500})       
    }
    
}



