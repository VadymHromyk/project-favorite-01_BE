import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "locations" },
      (err, result) => {
        if (err) {
          if (err.http_code === 400) {
            return reject(createHttpError(400, "Invalid image file"));
          }
          return reject(err);
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });

export const deleteImageFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId);
