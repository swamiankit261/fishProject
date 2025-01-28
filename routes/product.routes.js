import express from "express";
import { AuthenticationJWT, Authorization } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { bestSellerProduct, createProduct, deleteProduct, getAdminProducts, getProductById, homepageProduct, searchAndFindProducts, updateProduct } from "../controllers/product.controller.js";

const rout = express.Router();

rout.route("/create").post(AuthenticationJWT, Authorization("admin"), upload.array("file", 4), createProduct);
rout.route("/update/:id").patch(AuthenticationJWT, Authorization("admin"), upload.array("file", 4), updateProduct);
rout.route("/delete/:id").delete(AuthenticationJWT, Authorization("admin"), deleteProduct);
rout.route("/adminProduct").get(AuthenticationJWT, Authorization("admin"), getAdminProducts)
rout.route("/search").get(searchAndFindProducts);
rout.route("/homeProduct").get(homepageProduct);
rout.route("/bestSeller").get(bestSellerProduct);
rout.route("/getProduct/:id").get(getProductById);


export default rout;