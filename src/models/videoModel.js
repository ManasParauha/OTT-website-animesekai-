import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    thumbnail:{
         type:String,
         required:true
    },
    url:{
        type:String,
        required:true,
    },
    episode:{
        type:Number,
        required:false,
    },
    description:{
        type:String,
        required:false
    }

})


const Video = mongoose.models.videos || mongoose.model("videos",videoSchema)

export default Video; 