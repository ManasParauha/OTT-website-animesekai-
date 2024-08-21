import mongoose from "mongoose";
import { type } from "os";


const hubSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false
    },
    thumbnail:{
         type:String,
         required:true
    },
    url:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
})


const Hub = mongoose.models.hubs || mongoose.model("hubs",hubSchema)

export default Hub; 