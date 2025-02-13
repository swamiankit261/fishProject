import Payment from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createPayment = asyncHandler(async (req, res) => {
    const { amount, paymentId, upiId, phoneNo, } = req.body;

    const requiredFields = [amount, paymentId, upiId, phoneNo].filter(
        (item) => item !== null && item !== undefined && item !== ""
    );

    if (requiredFields) throw new ApiError("All fields are required", 400);

    const payment = await Payment.create({
        amount,
        paymentId,
        upiId,
        phoneNo,
        userId: req.user._id,
    });


    new ApiResponse(201, payment, "Payment created successfully.!").send(res);
});


export const updatePayment = asyncHandler(async (req, res) => { });
export const getPayment = asyncHandler(async (req, res) => { });
export const deletePayment = asyncHandler(async (req, res) => { });