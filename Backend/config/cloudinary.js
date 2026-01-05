import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const cloudinaryUpload = async (filePath) => {

    cloudinary.config({

        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_APL_SECRET
    });

    try {

        const uploadResult = await cloudinary.uploader
        .upload(filePath)
        fs.unlinkSync(filePath) // remove file from server after upload
        return uploadResult.secure_url

    } catch (error) {
        fs.unlinkSync(filePath)
        throw new Error("Cloudinary upload error")

    }

}

export default cloudinaryUpload