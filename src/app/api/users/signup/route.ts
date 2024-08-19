import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel.js"
import { NextRequest,NextResponse } from "next/server"
import bcyrptjs from "bcryptjs"

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const {username,email,password,photo} = reqBody;

        console.log(reqBody)

        //check if user already exists

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error:"user already exists"},{status:400})   
        }

        //hash password

        const salt = await bcyrptjs.genSalt(10)
        const hashedPassword = await bcyrptjs.hash(password,salt)

       const newUser =  new User({
            username,
            email,
            password : hashedPassword,
            photo
        })

        const savedUser =await newUser.save()

        console.log(savedUser)

        return NextResponse.json({
            message:"user created succesfully",
            success:true,
            savedUser
        })

        
    } catch (error:any) {
        return NextResponse.json({error:error.massage},{status:500})       
    }
    
}



