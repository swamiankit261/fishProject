import jwt from "jsonwebtoken";
import process from "node:process";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";


export const AuthenticationJWT = asyncHandler(async (req, _, next) => {

    const token = req.cookies?.access_token ?? req.header("Authorization")?.replace("Bearer ", "");


    if (!token || token === "undefined") {
        throw new ApiError(401, "No token provided!");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const id = decodedToken.id
    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(401, "please login to access this resource.!");
    }

    req.user = user;
    next();
});
export const Authorization = (...role) => (req, res, next) => {
    if (!role.includes(req.user.role)) next(new ApiError(403, `RoleError: ${req.user.role} is note allowed to access this resorce.!`))
    next();
}
