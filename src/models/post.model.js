import mongoose, { Schema } from "mongoose";


const postSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        required:true
    },
    imageurl:[
        {
            type:String
        }
    ]
},{timestamps:true});


export const Post = mongoose.model("posts",postSchema);