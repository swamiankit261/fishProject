import { body } from "express-validator";
export const isOrder = [
    body("shippingAddress.address", "Shipping address is required.").notEmpty().bail(),
    body("shippingAddress.city", "City is required.").notEmpty(),
    body("shippingAddress.state", "State is required.").notEmpty().bail(),
    body("shippingAddress.country", "Country is required.").notEmpty(),
    body("shippingAddress.postalCode", "Postal code is required.").notEmpty().bail(),
    body("shippingAddress.phone", "Phone number is required.")
        .notEmpty()
        .bail()
        .isNumeric()
        .withMessage("Phone number must be a valid number."),
    body("orderItems", "Order items array is required.")
        .notEmpty()
        .isArray()
        .bail(),
    body("orderItems.*.item", "Order item ID is required.")
        .notEmpty()
        .bail()
        .matches(/^[0-9a-fA-F]{24}$/)
        .withMessage("Invalid product ID format."),
    body("orderItems.*.quantity", "Quantity is required.")
        .notEmpty()
        .bail()
        .isNumeric()
        .withMessage("Quantity must be a number."),
    body("orderItems.*.price", "Order item price is required.")
        .notEmpty(),
    body("paymentMethod", "Payment method is required.")
        .notEmpty()
        .bail()
        .isIn(['Phone pay', 'Stripe', 'Cash on delivery'])
        .withMessage("Payment method must be 'Phone pay', 'Stripe', or 'Cash on delivery'."),
    body("paymentInfo")
        .optional()
        .notEmpty()
        .withMessage("Payment info is required if provided."),
    body("paymentInfo.id", "Payment ID is required.")
        .optional()
        .notEmpty(),
    body("paymentInfo.status", "Payment status is required.")
        .optional()
        .notEmpty(),
    // body("paidAt")
    //     .optional()
    //     .isDate()
    //     .withMessage("PaidAt must be a valid date.")
    //     .bail()
    //     .custom(async (value, { req }) => {
    //         if (value) {
    //             const date = new Date(value);
    //             const currentDate = new Date();
    //             if (date > currentDate) {
    //                 return Promise.reject("PaidAt date must be in the past.");
    //             }
    //         } else if (req.body.paymentMethod !== "Cash on delivery") {
    //             return Promise.reject("PaidAt is required for non-COD payment methods.");
    //         }
    //         return true;
    //     }),
    // body("itemsPrice", "Items price is required.")
    //     .notEmpty()
    //     .bail()
    //     .isNumeric()
    //     .withMessage("Items price must be a number."),
    // body("taxPrice", "Tax price must be a number.")
    //     .optional()
    //     .isNumeric(),
    // body("shippingPrice", "Shipping price is required.")
    //     .notEmpty()
    //     .bail()
    //     .isNumeric()
    //     .withMessage("Shipping price must be a number."),
    // body("totalPrice", "Total price is required.")
    //     .notEmpty()
    //     .bail()
    //     .isNumeric()
    //     .withMessage("Total price must be a number."),
];