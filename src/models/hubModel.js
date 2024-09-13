import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    commentText: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});


const hubSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    thumbnail: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comments'}],
    likes: {
            type: Number,
            default:0
        }
        
    ,
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users',default:[] }],
    savedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})


const Hub = mongoose.models.hubs || mongoose.model("hubs", hubSchema)

export default Hub; 