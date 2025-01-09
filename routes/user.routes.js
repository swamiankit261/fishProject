import express from "express";
import { createUser, getUserProfile, loginUser, logoutUser, updateUserProfile } from "../controllers/user.controller.js";
import { AuthenticationJWT } from "../middlewares/auth.middleware.js";

const rout = express.Router();

rout.route("/register").post(createUser);
rout.route("/login").get(loginUser);
rout.route("/logout").get(AuthenticationJWT, logoutUser);
rout.route("/profile").get(AuthenticationJWT, getUserProfile);
rout.route("/updateUser").put(AuthenticationJWT, updateUserProfile);

export default rout;