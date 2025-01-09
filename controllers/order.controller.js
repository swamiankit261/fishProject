import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

export const createOrder = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        console.error("Order", result)
        throw new ApiError(400, result.array().map(error => `${error.msg}`));
    }

    const { orderItems, shippingAddress, paymentMethod, paymentInfo, paidAt, taxPrice, shippingPrice, totalPrice, itemsPrice } = req.body;

    const { address, city, state, country, postalCode, phone } = shippingAddress;



    const newOrder = new Order({
        shippingAddress: { address, city, state, country, postalCode, phone },
        orderItems: orderItems,
        user: req.user._id,
        paymentMethod,
        paidAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    if (paymentMethod === "Stripe") {
        newOrder.paymentInfo = paymentInfo
    }

    const createdOrder = await Order.create(newOrder);


    res.status(201).json(new ApiResponse(201, createdOrder, "order placed successfully.!"));
});