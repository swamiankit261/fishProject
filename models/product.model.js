import mongoose from "mongoose";

const reviews = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, "Rating is required!"],
        min: [1, "Rating cannot be less than 1."],
        max: [5, "Rating cannot be more than 5."]
    },
    comment: {
        type: String,
        required: [true, "Comment is required!"],
        trim: true,
        minLength: [5, "Comment '{VALUE}' should have more than 5 characters!"],
        maxLength: [500, "Comment cannot exceed 500 characters!"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema(
    {
        fishName: {
            type: String,
            required: [true, "Fish name is required!"],
            unique: true,
            lowercase: true,
            trim: true,
            minLength: [3, "Fish name '{VALUE}' should have more than 3 characters!"],
            maxLength: [30, "Fish name cannot exceed 30 characters!"]
        },
        description: {
            type: String,
            required: [true, "Description is required!"],
            trim: true,
            minLength: [10, "Description '{VALUE}' should have more than 10 characters!"],
            maxLength: [500, "Description cannot exceed 200 characters!"]
        },
        price: {
            type: Number,
            required: [true, "Price is required!"],
            min: [1, "Price cannot be less than 1."],
            max: [99999, "Price cannot exceed 5 digits."]
        },
        countInStock: {
            type: Number,
            required: [true, "Stock count is required!"],
            min: [0, "Stock count cannot be negative."]
        },
        images: [
            {
                filename: {
                    type: String,
                    required: [true, "Image filename is required!"]
                },
                path: {
                    type: String,
                    required: [true, "Image path is required!"]
                }
            }
        ],
        category: {
            type: String,
            required: [true, "Category is required!"],
            trim: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required!"]
        },
        size: [{
            type: Number,
            required: [true, "Size is required!"]
        }],
        numOfReviews: {
            type: Number,
            default: 0
        },
        bestSeller: {
            type: Boolean,
            default: false
        },
        reviews: {
            type: [reviews]
        }
    },
    { timestamps: true }
);

// Add a custom validator to the 'images' field to limit the number of images
productSchema.path('images').validate(function (value) {
    return value.length <= 4; // Max 4 images allowed
}, 'You can only upload up to 4 images.!');

export default mongoose.model("Product", productSchema);