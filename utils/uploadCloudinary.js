import cloudinary from "cloudinary";
export const UploadCloudinary = async (file, folderName) => {
    if (!(file && folderName)) throw new Error("Please provide a file and folder name.!");
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
            file,
            { folder: `${folderName}`, resource_type: "image", width: 250, crop: "scale" }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
};