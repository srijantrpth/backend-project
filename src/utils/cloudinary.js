import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully

    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath); // used to remove locally saved temporary file if their upload failed on cloudinary
    return null;
  }
};

export { uploadOnCloudinary };
