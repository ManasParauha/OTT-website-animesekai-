import mongoose from "mongoose";


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
    }
})


const Hub = mongoose.models.hubs || mongoose.model("hubs",hubSchema)

export default Hub; 