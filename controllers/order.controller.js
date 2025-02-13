import { asyncHandler } from "../utils/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/apiResponse.js";

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
        newOrder.paymentInfo = {
            id: paymentInfo.id,
            status: paymentInfo.status
        }
    };

    if (paymentMethod === "UPI" && (!paymentInfo.paymentId && !paymentInfo.phoneNo && !paymentInfo.upiID)) {
        throw new ApiError(400, "Please provide paymentId/Transaction ID, phoneNo, upiID for UPI payment method.");
    }

    if (paymentMethod === "UPI") {
        newOrder.paymentInfo = {
            paymentId: paymentInfo.paymentId,
            phoneNo: paymentInfo.phoneNo,
            upiID: paymentInfo.upiID,
        }
    }
    if (paymentMethod !== "Cash on delivery") {
        newOrder.paidAt = Date.now();
    }

    const createdOrder = await Order.create(newOrder);

    new ApiResponse(201, createdOrder, "order placed successfully.!").send(res);
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

    const { id, status, page = 1, limit = 8 } = req.query;

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
                                "user.userName": 1,
                                paymentMethod: 1,
                                itemsPrice: 1,
                                gst: 1,
                                shippingPrice: 1,
                                totalPrice: 1,
                                paymentInfo: 1,
                                paymentStatus: 1,
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
    const currentPage = parseInt(page, 10) <= totalPages ? parseInt(page, 10) : 1;

    new ApiResponse(200, { orders, totalResults, totalPages, currentPage }, "All orders retrieved successfully!").send(res);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id, orderStatus, paymentStatus } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Invalid order ID.");

    const VALID_STATUSES = ["Pending", "Canceled", "Shipped", "Delivered", "Returned"];
    const VALID_PAYMENT_STATUSES = ['Pending', 'Completed', 'Failed', "Refunded"];

    if (orderStatus && !VALID_STATUSES.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status. Valid statuses are: Pending, Canceled, Shipped, Delivered, Returned.");
    }
    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        throw new ApiError(400, "Invalid payment status. Valid statuses are: Pending, Completed, Failed, Refunded.");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found.");

    if (orderStatus && order.orderStatus === orderStatus) {
        throw new ApiError(400, `Order is already '${orderStatus}'.`);
    }
    if (paymentStatus && order.paymentStatus === paymentStatus) {
        throw new ApiError(400, `Payment status is already '${paymentStatus}'.`);
    }
    if (orderStatus === "Canceled" && order.paymentStatus === "Completed") {
        throw new ApiError(400, "Cannot cancel a paid order.");
    }
    if (["Pending", "Completed", "Failed"].includes(paymentStatus) && ["Delivered", "Canceled", "Returned"].includes(order.orderStatus)) {
        throw new ApiError(400, `Cannot update payment status for a ${order.orderStatus.toLowerCase()} order.`);
    }

    const invalidTransitions = {
        Returned: ["Pending", "Canceled", "Shipped", "Delivered"],
        Delivered: ["Pending", "Canceled", "Shipped"],
        Canceled: ["Delivered", "Shipped", "Returned"],
        Shipped: ["Returned", "Pending"],
        Pending: ["Returned"]
    };

    if (invalidTransitions[order.orderStatus]?.includes(orderStatus)) {
        throw new ApiError(400, `Cannot orderStatus from '${order.orderStatus}' to '${orderStatus}'.`);
    }

    if (orderStatus && ["Pending", "Failed"].includes(order.paymentStatus) && order.paymentMethod === "UPI") {
        throw new ApiError(400, "Payment must be completed before updating order status.");
    }

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    if (orderStatus === "Delivered") {
        if (order.paymentMethod === "Cash on delivery") updateFields.paidAt = Date.now();
        updateFields.deliveredAt = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updatedOrder) throw new ApiError(404, "Order not found during update.");

    const resMessage = orderStatus ? "Order status updated successfully." : "Payment status updated successfully.";
    new ApiResponse(200, updatedOrder, resMessage).send(res);
});

// Admin only
export const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
    const { id, paymentStatus } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide a valid order ID.");

    const VALID_STATUSES = ['Pending', 'Completed', 'Failed', "Refunded"];
    if (!VALID_STATUSES.includes(paymentStatus)) {
        throw new ApiError(400, "Invalid payment status. Valid statuses are: Pending, Completed, Failed.");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.paymentStatus === paymentStatus) throw new ApiError(400, `The order is already in the '${paymentStatus}' payment state.`);
    const disallowedPaymentStatus = {
        Completed: ["Pending"],
        Failed: ["Pending", "Completed"]
    };

    if (disallowedPaymentStatus[order.paymentStatus]?.includes(paymentStatus)) {
        throw new ApiError(400, `Cannot update order payment status from '${order.paymentStatus}' to '${paymentStatus}'.`)
    };

    const fields = {
        paymentStatus: paymentStatus,
    };

    if (paymentStatus === 'Completed') {
        fields.paidAt = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: fields }, { new: true });

    if (!updatedOrder) throw new ApiError(404, "Order not found during update.");

    new ApiResponse(200, updatedOrder, "Order payment status updated successfully.").send(res);
});