import { User } from "../models/user.model.js";
import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";


const generateTokens =async(userid)=>{
   const user  = await User.findById(userid);
   const accessToken =await user.generateAccessToken();
   const refreshToken = await user.generateRefreshToken();

   user.refreshToken = refreshToken;

   user.save({validateBeforeSave:false});


   return {refreshToken,accessToken}
}

const createUser = async(req,res)=>{
    const {phoneno , password , name } = req.body;

     const user  = await User.findOne(
        {
         phoneno:phoneno
        }
     )

     if(user) return res.json(new ApiError(400,"user already exists"));

     const createUser = await User.create({
        name,
        phoneno,
        password
     });

     if( !createUser ) return res.json(new ApiError(500,"internalServer error while creating user"));

     const createdUser = await User.findById(createUser._id).select("-password");

     if( !createdUser ) return res.json(new ApiError(500,"error while access data of user"));

     return res.json(
        new ApiResponse(200,createUser,"user created Successfully")
     )
}

const userLogin = async(req,res)=>{
    const {phoneno,password} = req.body;


    if(!phoneno || phoneno.trim()=="" ) return res.json(new ApiError(400,"invalid number"));

    const phone = Number(phoneno)

    const checkuser = await User.find({phoneno:phone});
    
    if(!password || password.trim()=="") return res.json(new ApiError(400,"invalid password"));

    if(!checkuser[0]) return res.json(new ApiError(400,"user doesnt exist"));

     const user = await User.findById(checkuser[0]?._id);

     const compare = await user.comparePassword(password);

     
     if(!compare) return res.json(new ApiError(400,"wrong password"));
     
     const {refreshToken,accessToken} = await generateTokens(checkuser[0]?._id);
    

   const garuntiedUser = await User.findById(user._id).select("-password -refreshToken");

   const options={
      httpOnly:true,
      secure:true
  }

   return res
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new ApiResponse(200,garuntiedUser,"user logged in successfully")
   )
}


const userLogout = async(req,res)=>{
   const userid = req.user?._id;

   if( !userid ) return res.json(new ApiError(400,"invalid userid"));

  
   const user = await User.findById(userid);

   if( !user ) return res.json(new ApiError(400,"user missing"));

   const options={
      httpOnly:true,
      secure:true
  }

  return res
  .cookie("accessToken",options)
  .cookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user successfully logged out"))
}

const userDetails = async(req,res)=>{
  
  return res
  .json(
   new ApiResponse(200,req.user,"details fetched successfully")
  )
}

const fetchUsers = async(socket,data,io)=>{
   const userid = socket.user._id.toString();
   const phone = Number(data);
   const user = await User.find({
      phoneno:phone
   }).select("-password -refreshToken");
  
   io.to(userid).emit("search-chats",user);
}

export{
   createUser,
   userLogin,
   userLogout,
   userDetails,
   fetchUsers
}