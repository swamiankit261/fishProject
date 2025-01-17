import process from "node:process";
import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

export const createOrder = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) throw new ApiError(400, result.array().map(error => `${error.msg}`));


    const { orderItems, shippingAddress, paymentMethod, paymentInfo } = req.body;

    const { address, city, state, country, postalCode, phone } = shippingAddress;

    let itemsPrice = 0;
    let totalPrice = 0;

    for (const key in orderItems) {
        if (Object.prototype.hasOwnProperty.call(orderItems, key)) {
            const element = orderItems[key];
            const product = await Product.findById(element.item);
            if (!product) throw new ApiError(404, `Product not found with id: ${element.item}`);
            if (element.quantity > product.countInStock) throw new ApiError(400, `Not enough stock for product with id: ${element.item}`);
            product.countInStock -= element.quantity;
            await product.save(); // update the stock in the database
            itemsPrice += product.price * element.quantity;
            let tex = itemsPrice * Number(process.env.TAXPRICE) / 100;
            totalPrice = itemsPrice + tex + Number(process.env.SHIPPINGPRICE);
            console.info("element", product.countInStock);
        }
    };


    const newOrder = new Order({
        shippingAddress: { address, city, state, country, postalCode, phone },
        orderItems: orderItems,
        user: req.user._id,
        paymentMethod,
        itemsPrice,
        taxPrice: process.env.TAXPRICE,
        shippingPrice: process.env.SHIPPINGPRICE,
        totalPrice,
    });

    if (paymentMethod === "Stripe") {
        newOrder.paymentInfo = paymentInfo
    };
    if (paymentMethod !== "Cash on delivery") {
        newOrder.paidAt = Date.now();
    }

    const createdOrder = await Order.create(newOrder);


    res.status(201).json(new ApiResponse(201, createdOrder, "order placed successfully.!"));
});

// admin only
export const getOrder = asyncHandler(async (req, res) => {

    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) throw new ApiError(400, "please provide a valid order id.!");
    const order = await Order.findById(req.params.id)

    if (!order) throw new ApiError(404, "Order not found");
    res.json(new ApiResponse(200, order, "order retrieved successfully.!"));
});

export const getMyOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) throw new ApiError(404, "your Order not found.!");

    res.json(new ApiResponse(200, orders, "your orders retrieved successfully.!"));
});

export const getAllOrders = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.aggregate(
        // {
        //     $match: {

        //     }
        // },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            },
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    );

    res.json(new ApiResponse(200, orders, "all orders retrieved successfully.!"));
});