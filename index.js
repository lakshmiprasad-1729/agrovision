import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './src/routes/user.router.js';
import connectDB from './src/database/connectDB.js';
import dotenv from 'dotenv'
import postRouter from './src/routes/post.router.js';

dotenv.config();

const app = express();
app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


app.use('/',userRouter);
app.use('/posts',postRouter);


connectDB();


// app.set("io",io);
// io.use((socket,next)=>{
//     const cookies = socket.handshake.headers.cookie;

//     if(!cookies) return next(new ApiError(400,"invalid token"));

//      console.log(socket.handshake);
//      next();
// })


app.listen(5500,()=>{
    console.log("server is listening on port 5500");
})

  