import { Router } from "express";
import { createPost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";
import multer from "multer";

const postRouter = Router();


postRouter.route("/create-post").post(
    (req, res, next) => {
      
        upload.array('images', 100)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error("Multer error:", err);
                return res.status(400).json({ message: `File upload error: ${err.message}`, code: err.code });
            } else if (err) {
                 console.error("Unknown upload error:", err);
                 return res.status(500).json({ message: `Unknown upload error: ${err.message}` });
            }
            console.log('Files received:', req.files ? req.files.length : 0); 
            next();
        });
    }, 
    createPost 
);

export default postRouter;