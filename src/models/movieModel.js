import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({

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
    description:{
        type:String,
        required:false
    }

})


const Movie = mongoose.models.movies || mongoose.model("movies",movieSchema)

export default Movie; 