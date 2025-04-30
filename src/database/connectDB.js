import mongoose from "mongoose";


const connectDB = async()=>{

    try {
        const db = await mongoose.connect(process.env.DB_URL,{dbName:"chat-app"});
        console.log("database connected ")
        
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;