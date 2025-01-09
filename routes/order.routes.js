import express from "express";
import { AuthenticationJWT } from "../middlewares/auth.middleware.js";
import { isOrder } from "../middlewares/validator.middlewares.js";
import { createOrder } from "../controllers/order.controller.js";


const route = express.Router();

route.route("/newOrder").post(AuthenticationJWT, isOrder, createOrder)


export default route;