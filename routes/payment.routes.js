import express from "express";
import { AuthenticationJWT, Authorization } from "../middlewares/auth.middleware.js";
import { createPayment,getPayment,updatePayment,deletePayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", AuthenticationJWT, createPayment);
router.get("/", AuthenticationJWT, Authorization("admin"), getPayment);
router.put("/:id", AuthenticationJWT, Authorization("admin"), updatePayment);
router.delete("/:id", AuthenticationJWT, Authorization("admin"), deletePayment);

export default router;