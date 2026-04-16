import { v2 as cloudinary} from "cloudinary";
import { config } from "dotenv";
import fs from "fs";

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_COULD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SCRET
}); 

export const cloudinaryConfig = cloudinary;

// export const uploadOnCloudinary = async (file) => {
//     try {
//         if(!file) return null;
//         const response = await cloudinary.uploader.upload(file);
//         return response;
//     } catch (error) {
//         console.log("error in uploadOnCloudinary",error.message);
//         return null;
//     }
// }