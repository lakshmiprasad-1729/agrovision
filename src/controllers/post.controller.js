import uploadOnCloudinary from "../custom/uploadonCloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";

const createPost  = async(req,res)=>{

    const phoneno = req.query.phoneno;

    if(!phoneno) return res.json(new ApiError(400,"invalid phone number"));


    const user = await User.find({
        phoneno:phoneno
    })


    if(user.length == 0) return res.json(new ApiError(400,"invalid user"));

    let images = req.files;

    if(!images || images.length == 0) return res.json( 
        new ApiError(400,"file is empty")
    )
     
    let imageurls = [];
    for(let i = 0 ; i < images.length ; i++){
       let imageurl = await uploadOnCloudinary(images[i].path);
       imageurls = [...imageurls,imageurl];
    }

    const createPost = await Post.create(
        {
            userid:user[0]._id,
            imageurl:imageurls
        }
    )

    if(!createPost) return res.json(new ApiError(500,"error while creating post"));

 
    return res.json(
        new ApiResponse(200,createPost,"created post successfully")
    )
}


export {
    createPost
}