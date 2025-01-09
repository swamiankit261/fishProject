import express from "express";
import { AuthenticationJWT, Authorization } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, deleteProduct, getProductById, searchAndFindProducts, updateProduct } from "../controllers/product.controller.js";

const rout = express.Router();

rout.route("/create").post(AuthenticationJWT, Authorization("admin"), upload.array("file", 4), createProduct);
rout.route("/update/:id").patch(AuthenticationJWT, Authorization("admin"), upload.array("file", 4), updateProduct);
rout.route("/delete").delete(AuthenticationJWT, Authorization("admin"), deleteProduct);
rout.route("/search").get(searchAndFindProducts);
rout.route("/getProduct/:id").get(getProductById);


export default rout;