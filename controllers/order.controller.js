import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

export const createOrder = asyncHandler(async (req, res) => {

    const result = validationResult(req);

    if (!result.isEmpty()) throw new ApiError(400, result.array().map(error => `${error.msg}`));


    const { orderItems, shippingAddress, paymentMethod, paymentInfo, gst, shippingPrice, } = req.body;

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
            let tex = itemsPrice * Number(gst) / 100;
            totalPrice = itemsPrice + tex + Number(shippingPrice);
        }
    };


    const newOrder = new Order({
        shippingAddress: { address, city, state, country, postalCode, phone },
        orderItems: orderItems,
        user: req.user._id,
        paymentMethod,
        itemsPrice,
        gst: gst,
        shippingPrice: shippingPrice,
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

    const { id, status, page = 1, limit = 3 } = req.query;

    // const { orderStatus } = req.body;

    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide a valid order ID.");

    // if (id) {
    //     if (!orderStatus) throw new ApiError(400, "Please provide a valid orderStatus.!");
    // }

    // Constants
    const VALID_STATUSES = ["Pending", "Canceled", "Shipped", "Delivered", "Returned"];
    const MAX_LIMIT = 100;
    if (status && !VALID_STATUSES.includes(status)) {
        throw new ApiError(400, "Invalid filter query status. Valid statuses are: Pending, Canceled, Shipped, Delivered, Returned.");
    }

    // if (id && orderStatus) {
    //     if (!VALID_STATUSES.includes(orderStatus)) {
    //         throw new ApiError(400, "Invalid order status. Valid statuses are: Pending, Canceled, Shipped, Delivered, Returned.");
    //     }
    //     const order = await Order.findById(id);
    //     if (!order) throw new ApiError(404, "Order not found.!");

    //     if (order.orderStatus === orderStatus) throw new ApiError(400, `The order is already in the '${orderStatus}' state.`);

    //     const disallowedTransitions = {
    //         Returned: ["Pending", "Canceled", "Shipped", "Delivered"],
    //         Delivered: ["Pending", "Canceled", "Shipped"],
    //         Canceled: ["Delivered", "Shipped", "Returned"],
    //         Shipped: ["Returned", "Pending"],
    //         Pending: ["Returned"]
    //     };

    //     if (disallowedTransitions[order.orderStatus]?.includes(orderStatus)) throw new ApiError(400, `Cannot update order from '${order.orderStatus}' to '${orderStatus}'.`);

    //     await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    // }

    // Build aggregation pipeline
    const buildOrderPipeline = () => {
        const pipeline = [];

        // if (id) {
        //     pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(id) } });
        // }

        if (status) {
            pipeline.push({ $match: { orderStatus: { $regex: status, $options: "i" } } });
        }



        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $facet: {
                    totalResults: [{ $count: "count" }],
                    orders: [
                        {
                            $project: {
                                _id: 1,
                                shippingAddress: 1,
                                orderItems: 1,
                                user: 1,
                                paymentMethod: 1,
                                itemsPrice: 1,
                                gst: 1,
                                shippingPrice: 1,
                                totalPrice: 1,
                                orderStatus: 1,
                                paidAt: 1,
                                deliveredAt: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $skip: (parseInt(page, 10) - 1) * cappedLimit },
                        { $limit: cappedLimit }
                    ]
                }
            }
        );

        return pipeline;
    };

    const cappedLimit = Math.min(parseInt(limit, 10), MAX_LIMIT);
    const pipeline = buildOrderPipeline();
    const [results] = await Order.aggregate(pipeline);

    const totalResults = results?.totalResults[0]?.count || 0;
    const orders = results?.orders || [];
    const totalPages = Math.ceil(totalResults / cappedLimit);

    res.status(200).json(
        new ApiResponse(
            200,
            { orders, totalResults, totalPages, currentPage: parseInt(page, 10) },
            "All orders retrieved successfully!"
        )
    );
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id, orderStatus } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide a valid order ID.");


    const VALID_STATUSES = ["Pending", "Canceled", "Shipped", "Delivered", "Returned"];
    if (!VALID_STATUSES.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status. Valid statuses are: Pending, Canceled, Shipped, Delivered, Returned.");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found.");

    if (order.orderStatus === orderStatus) throw new ApiError(400, `The order is already in the '${orderStatus}' state.`);

    const disallowedTransitions = {
        Returned: ["Pending", "Canceled", "Shipped", "Delivered"],
        Delivered: ["Pending", "Canceled", "Shipped"],
        Canceled: ["Delivered", "Shipped", "Returned"],
        Shipped: ["Returned", "Pending"],
        Pending: ["Returned"]
    };

    if (disallowedTransitions[order.orderStatus]?.includes(orderStatus)) throw new ApiError(400, `Cannot update order from '${order.orderStatus}' to '${orderStatus}'.`);


    const fields = {
        orderStatus: orderStatus,
    }
    if (orderStatus === 'Delivered') {
        fields.paidAt = Date.now();
        fields.deliveredAt = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: fields }, { new: true });

    if (!updatedOrder) throw new ApiError(404, "Order not found during update.");


    // Respond with success
    res.json(new ApiResponse(200, updatedOrder, "Order status updated successfully."));
});