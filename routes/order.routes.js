import express from "express";
import { AuthenticationJWT, Authorization } from "../middlewares/auth.middleware.js";
import { isOrder } from "../middlewares/validator.middlewares.js";
import { createOrder, getAllOrders, getMyOrder, getOrder } from "../controllers/order.controller.js";


const route = express.Router();

route.route("/newOrder").post(AuthenticationJWT, isOrder, createOrder);
route.route("/singalOrder/:id").get(AuthenticationJWT, Authorization("admin"), getOrder);
route.route("/myOrder").get(AuthenticationJWT, getMyOrder);
route.route("/getAllOrder").get(AuthenticationJWT, Authorization("admin"), getAllOrders);


export default route;