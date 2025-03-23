import User from "../models/user.model.js";
import process from "node:process";
import bcrypt from 'bcrypt';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { UploadCloudinary } from "../utils/uploadCloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";


const options = () => ({
    // expire: new Date(Date.now() +
    //     (process.env.ACCESS_TOKEN_EXPIRY
    //         ? process.env.ACCESS_TOKEN_EXPIRY * 24 * 60 * 60 * 1000
    //         : 7 * 24 * 60 * 60 * 1000
    //     )
    // ).toUTCString(),
    maxAge: process.env.ACCESS_TOKEN_EXPIRY
        ? process.env.ACCESS_TOKEN_EXPIRY * 24 * 60 * 60 * 1000 // Days in milliseconds
        : 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS only in production
    sameSite: "None", // Uncomment this for CSRF protection
    path: "/", // Uncomment this if you want the cookie accessible site-wide
})

export const createUser = asyncHandler(async (req, res) => {
    const { userName, email, avatar, password } = req.body;

    if (!(userName && email && password)) throw new ApiError(400, "Please fill all the fields.!");

    const existUsre = await User.findOne({ email });

    if (existUsre) throw new ApiError(409, "User already exists.!");

    const fields = {
        userName,
        email,
        password,
    };

    let image;
    if (avatar) {
        image = await UploadCloudinary(avatar, "user");
    }

    if (image) {
        fields.avatar = {
            public_id: image.public_id,
            url: image.url,
        };
    };

    const user = await User.create(fields);

    if (!user) throw new ApiError(400, "User not created.!");

    res.status(201).json(new ApiResponse(201, user, "User created successfully.!"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) throw new ApiError(400, "Please fill all the requred fields.!");

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.matchPassword(password))) throw new ApiError(401, "Invalid email or password.!");

    const token = user.generateAccessToken();

    res.status(200).cookie("accessToken", token, options()).json(new ApiResponse(200, { token }, "User logged in successfully.!"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "None",
        path: '/',
    }
    console.log("in logout", process.env.NODE_ENV, options)
    res.clearCookie("accessToken", options).json(new ApiResponse(200, req.user.userName, "User logged out successfully.!"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "User profile fetched successfully.!"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { userName, email, avatar, password } = req.body;

    if (!(userName || email || avatar || password)) throw new ApiError(400, "please fill in at least one field.!!");

    if (email && req.user.email === email) throw new ApiError(400, "email is already in use.!!");
    // if (userName && req.user.userName === userName) throw new ApiError(400, "userName is already in use.!!");
    if (!/^(?=.*[A-Z])|(?=.*\d).{8,}$/.test(password)) throw new ApiError(400, "Password must contain at least 8 characters, one uppercase, one number.!!");

    const updateFields = {};

    if (userName) updateFields.userName = userName;
    if (email) updateFields.email = email;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    if (avatar) {
        if (req.user.avatar.public_id) {
            cloudinary.uploader.destroy(req.user.avatar.public_id);
        }
        const image = await UploadCloudinary(avatar, "user");
        updateFields.avatar = {
            public_id: image.public_id,
            url: image.url,
        };
    };

    console.log(updateFields);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updateFields }, { new: true, runValidators: true });

    if (!updatedUser) throw new ApiError(400, "User not updated.!");

    res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully.!"));
});