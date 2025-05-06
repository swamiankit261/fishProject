import process from "node:process";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 3000;


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})


app.use(errorMiddleware);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.info(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("MongoDB connection failed!", err);
    process.exit(1); // Exit the process with failure
});