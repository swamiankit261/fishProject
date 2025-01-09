import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "fishImages", // Replace with your Cloudinary folder name
        quality: "auto:best",
        format: "jpg",
        transformation: [{ width: 400, height: 500, crop: "fill" }],
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "gif", "svg"],
    }
});

export const upload = multer({ storage: storage });