import {v2 as cloudinary} from 'cloudinary'
import ApiError from '../utilities/ApiError.js'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    
    
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log('File uploaded to Cloudinary:', response.url);

        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", localFilePath, err);
            } else {
                console.log("Successfully deleted local file:", localFilePath);
            }
        });

        return response.url; 

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        try {
            fs.unlinkSync(localFilePath); 
            console.log("Cleaned up local file after failed upload:", localFilePath);
        } catch (cleanupError) {
            console.error("Error cleaning up local file after failed upload:", localFilePath, cleanupError);
        }
        return null;
    }
};

export default uploadOnCloudinary