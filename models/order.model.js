import mongoose from "mongoose";
import autoPopulate from "mongoose-autopopulate";

// Define constants for enums
const paymentTypes = ['Phone pay', 'Stripe', 'Cash on delivery'];
const orderStatuses = ['Pending', 'Canceled', 'Shipped', 'Delivered', 'Returned'];

const orderSchema = new mongoose.Schema(
    {
        shippingAddress: {
            address: {
                type: String,
                minLength: [5, "address '{VALUE}' should have more than 5 characters!"],
                maxLength: [50, "address cannot exceed 50 characters!"],
                required: [true, "Address is required"]
            },
            city: {
                type: String,
                minLength: [2, "city '{VALUE}' should have more than 2 characters"],
                maxLength: [30, "city cannot exceed 30 characters"],
                lowercase: true,
                required: [true, "City is required"]
            },
            state: {
                type: String,
                minLength: [2, "state '{VALUE}' should have more than 2 characters"],
                maxLength: [30, "state cannot exceed 30 characters"],
                lowercase: true,
                required: [true, "State is required"]
            },
            country: {
                type: String,
                minLength: [2, "country '{VALUE}' should have more than 2 characters"],
                maxLength: [30, "country cannot exceed 30 characters"],
                lowercase: true,
                default: "USA", required: [true, "Country is required"]
            },
            postalCode: {
                type: String,
                minLength: [2, "postal code '{VALUE}' should have more than 2 characters"],
                maxLength: [10, "postal code cannot exceed 10 characters"],
                required: [true, "Postal code is required"]
            },
            phone: {
                type: String,
                required: [true, "Phone number is required"],
                validate: {
                    validator: function (v) {
                        return /^[0-9]{10}$/.test(v); // Validates 10-digit phone number
                    },
                    message: props => `${props.value} is not a valid phone number.!`
                }
            },
        },
        orderItems: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: [true, "Quantity is required"] },
                price: { type: Number, required: [true, "Price is required."] }
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Add an index for better query performance
            autopopulate: { select: 'userName email' } // Automatically populate these fields
        },
        paymentMethod: {
            type: String,
            enum: {
                values: paymentTypes,
                message: '{VALUE} is not a supported payment type'
            },
            required: true
        },
        paymentInfo: {
            id: { type: String },
            status: { type: String }
        },
        paidAt: {
            type: Date,
        },
        itemsPrice: {
            type: Number,
            default: 0,
            required: [true, "Items price is required"]
        },
        taxPrice: {
            type: Number,
            default: 0,
            required: [true, "Tax price is required"]
        },
        shippingPrice: {
            type: Number,
            default: 0,
            required: [true, "Shipping price is required"]
        },
        totalPrice: {
            type: Number,
            default: 0,
            required: [true, "Total price is required"]
        },
        orderStatus: {
            type: String,
            enum: {
                values: orderStatuses,
                message: '{VALUE} is not a valid order status'
            },
            default: 'Pending',
        },
        deliveredAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Virtual for computed total price
orderSchema.virtual('computedTotalPrice').get(function () {
    return this.itemsPrice + this.taxPrice + this.shippingPrice;
});

// Enable auto-populate plugin
orderSchema.plugin(autoPopulate);

// Export the model
export default mongoose.model("Order", orderSchema);
