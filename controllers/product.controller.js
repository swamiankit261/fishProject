import Product from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";


export const createProduct = asyncHandler(async (req, res) => {
    const { fishName, description, price, countInStock, category, size } = req.body;

    const requiredFields = [fishName, description, price, countInStock, category, size].every(
        (item) => item !== null && item !== undefined && item !== ""
    );


    if (!requiredFields) throw new ApiError(400, "give all required fields.!");

    if (!req.files || req.files.length === 0) throw new ApiError(400, "please provide images.!");

    const fields = {
        fishName,
        description,
        user: req.user._id,
        price,
        countInStock,
        category,
        size,
        images: [],
    };



    for (let index = 0; index < req.files.length; index++) {
        const element = req.files[index];
        fields.images.push({
            path: element.path,
            filename: element.filename,
        });
    }

    const product = await Product.create(fields);

    res.status(201).json(new ApiResponse(201, product, "product created successfully.!"));
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fishName, description, price, countInStock, category, size } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide product valid ID.!");

    // Check if at least one field is provided
    if (![fishName, description, price, countInStock, category, size].some(item => item)) {
        throw new ApiError(400, "At least one field is required.");
    }

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found.!");

    const fields = { fishName, description, price, countInStock, category, size };
    // const images = [];

    const images = product.images;

    // Handle file uploads
    if (req.files && req.files.length > 0) {
        for (const [index, element] of req.files.entries()) {
            const existingImage = images[index].filename;

            // Delete existing image in Cloudinary if present
            if (existingImage) await cloudinary.uploader.destroy(existingImage);

            // Replace the image at the current index
            images.splice(index, 1, { path: element.path, filename: element.filename });
        }

        product.images = images; // Save updated images
    }

    // Update product in the database
    Object.keys(fields).forEach(key => {
        if (fields[key] !== undefined) {
            product[key] = fields[key];
        }
    });

    await product.save();

    res.status(200).json(new ApiResponse(200, [], "Product updated successfully.!"));
});

export const searchAndFindProducts = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, sort } = req.query;

    // Utility to build match conditions
    const buildMatchConditions = (query) => {
        const { search, category, size, minPrice, maxPrice } = query;

        const conditions = {};

        // Search conditions across fields
        if (search) {
            conditions.$or = [
                { fishName: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { size: { $regex: search, $options: "i" } }
            ];
            if (/^\d+(\.\d+)?$/.test(search)) {
                conditions.$or.push({ price: Number(search) });
            }
        };


        if (category) conditions.category = { $regex: category, $options: "i" };
        if (size) conditions.size = { $regex: size, $options: "i" };
        if (minPrice || maxPrice) {
            conditions.price = {};
            if (minPrice) conditions.price.$gte = Number(minPrice);
            if (maxPrice) conditions.price.$lte = Number(maxPrice);
        };

        return conditions;
    };

    // Utility to build sorting criteria
    const buildSortCriteria = (sort) => {
        const defaultSort = { price: 1, numOfReviews: -1, createdAt: -1 };
        if (!sort) return defaultSort;
        const [key, value] = sort.split(":");
        return { ...defaultSort, [key]: value === "desc" ? -1 : 1 };
    };



    const matchConditions = buildMatchConditions(req.query);

    // paginate results
    const cappedLimit = Math.min(parseInt(limit, 10), 100);
    const skip = (parseInt(page, 10) - 1) * cappedLimit;

    let pipeline = [];

    // Add match stage to the pipeline
    if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions });
    };

    pipeline.push({
        $facet: {
            totalResults: [{ $count: "count" }],
            products: [
                {
                    $project: {
                        fishName: 1,
                        price: 1,
                        countInStock: 1,
                        images: 1,
                        category: 1,
                        size: 1,
                        numOfReviews: { $sum: "$reviews.rating" },
                        createdAt: 1
                    }
                },
                { $sort: buildSortCriteria(sort) },
                { $skip: skip },
                { $limit: cappedLimit }
            ]
        }
    });

    // Execute the aggregation
    const [result] = await Product.aggregate(pipeline);

    const products = result.products;
    const totalResults = result.totalResults[0].count;

    // Response
    res.status(200).json(new ApiResponse(200, {
        products,
        totalResults,
        totalPages: Math.ceil(totalResults / cappedLimit),
        currentPage: parseInt(page, 10)
    }, "Products retrieved successfully!"));
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide product valid ID.!");

    const product = await Product.findById(id).populate("user", "name email");

    if (!product) throw new ApiError(404, "Product not found.!");

    res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully.!"));
});



export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide product valid ID.!");
    const product = await Product.findByIdAndDelete(id).select("images");

    if (!product) throw new ApiError(404, "Product not found.!");

    product.images.forEach(async image => await cloudinary.uploader.destroy(image.filename))

    // await Product.findByIdAndDelete(id);


    res.status(200).json(new ApiResponse(200, { _id: product._id }, "Product deleted successfully.!"));
});