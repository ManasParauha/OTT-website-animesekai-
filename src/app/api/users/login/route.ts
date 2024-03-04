import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel.js"
import { NextRequest,NextResponse } from "next/server"
import bcyrptjs from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST ( request: NextRequest){
    try {
        const reqBody = await request.json();
        const {email,password} = reqBody;
        console.log(reqBody);

        //check if user exists
      const user =  await  User.findOne({email})

      if(!user){
        return NextResponse.json({error:"User does not exits"},{status:400})
      }

      //check the password is correct

      const validPassword = await bcyrptjs.compare(password,user.password);
      if(!validPassword){
        return NextResponse.json({error:"Password incorrect!"},{status:400})
      }
      //create a token data

      const tokenData = {
        id: user._id,
        username:user.username,
        email:user.email
      }

      //create token
       const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"})

       const response = NextResponse.json({
        message:"Login succesfull",
        success:true,
       })

       response.cookies.set("token",token,{httpOnly:true})

       return response;
    } catch (error:any) {
        return NextResponse.json({error:error.massage},{status:500})
    }
}

