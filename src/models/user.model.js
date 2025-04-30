import mongoose from "mongoose";
import bcrypt from "bcrypt"
import JWT from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    phoneno:{
        type:Number,
        required:true,
        unique:true,
    },
    imageurl:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})


userSchema.pre("save",async function (next) {
    if( !this.isModified("password")) next();

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword =  function(password){
    return  bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken= async function(){
    return await JWT.sign(
        {
            _id:this._id,
            name:this.name,
            phoneno:this.phoneno
        },
        process.env.ACCESSTOKEN,
        {
            expiresIn:process.env.ACCESSTOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken= function(){
    return JWT.sign(
        {
            _id :this._id
        },
        process.env.REFRESHTOKEN,
        {
            expiresIn:process.env.REFRESHTOKEN_EXPIRY
        }
    )
}



export  const User =  mongoose.model("users",userSchema);