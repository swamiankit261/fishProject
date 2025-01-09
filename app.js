import process from "node:process";
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

// import routes
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import orderRoute from "./routes/order.routes.js";

// Load environment variables from.env file
dotenv.config({ path: "./.env" });

// Enable CORS
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

export { app };