import Product from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { array } from "yup";


export const createProduct = asyncHandler(async (req, res, next) => {
    try {
        const { fishName, description, price, countInStock, category, size, bestSeller } = req.body;


        const requiredFields = [fishName, description, price, countInStock, category, size].every(
            (item) => item !== null && item !== undefined && item !== ""
        );


        if (!requiredFields) throw new ApiError(400, "give all required fields.!");

        if (!req.files || req.files.length === 0) throw new ApiError(400, "please provide images.!");

        // console.log('size Error------------:', req.body.size.map(Number));
        let parsedSize = [];

        try {
            parsedSize = typeof size === "string" ? JSON.parse(size) : size;
            if (!Array.isArray(parsedSize) || parsedSize.some(val => isNaN(Number(val)))) {
                throw new Error("Size must be an array of numbers.");
            }
        } catch {
            throw new ApiError(400, "Invalid size format.!");
        }

        const fields = {
            fishName,
            description,
            user: req.user._id,
            price,
            countInStock,
            category,
            size: parsedSize.map(Number),
            images: [],
        };

        if (bestSeller) {
            fields.bestSeller = bestSeller;
        }


        for (let index = 0; index < req.files.length; index++) {
            const element = req.files[index];
            fields.images.push({
                path: element.path,
                filename: element.filename,
            });
        }

        const product = await Product.create(fields);

        res.status(201).json(new ApiResponse(201, product, "product created successfully.!"));
    } catch (error) {
        next(error);
        req.files.forEach(async (file) => await cloudinary.uploader.destroy(file.filename));
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fishName, description, price, countInStock, category, size, existingImages, bestSeller } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide a valid product ID.");

    if (![fishName, description, price, countInStock, category, size, bestSeller, req.files].some(item => item)) {
        throw new ApiError(400, "At least one field is required.");
    }

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found.");

    const fields = { fishName, description, price, countInStock, category, bestSeller };
    if (size) {
        fields.size = typeof size === 'string' ? JSON.parse(size).map(Number) : size;
    }

    let images = [];

    // Parse existingImages from req.body
    const parsedExistingImages = Array.isArray(existingImages)
        ? existingImages
        : existingImages ? [existingImages] : [];

    // Clean up cloudinary images if needed
    for (let i = 0; i < product.images.length; i++) {
        const originalImage = product.images[i];

        // If this original image is not in existingImages, delete it from Cloudinary
        const stillExists = parsedExistingImages.includes(originalImage.path);
        if (!stillExists) {
            await cloudinary.uploader.destroy(originalImage.filename);
        }
    }

    // Add back existingImages that are still needed
    for (let imgPath of parsedExistingImages) {
        const original = product.images.find(img => img.path === imgPath);
        if (original) images.push(original);
    }

    // Add new uploaded files
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            images.push({ path: file.path, filename: file.filename });
        }
    }

    // Replace product images with new image array
    product.images = images;

    // Update other fields
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined) {
            product[key] = value;
        }
    });

    await product.save();

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully."));
});

export const searchAndFindProducts = asyncHandler(async (req, res) => {

    const { page = 1, limit = 12, sort } = req.query;

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
                conditions.$or.push({ price: { $lte: Number(search) } });
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
        const defaultSort = { createdAt: -1, numOfReviews: -1 };
        if (!sort) return defaultSort;

        const [key, value] = sort.split(":");

        const newSort = { [key]: value === "desc" ? -1 : 1 };
        if (key === "createdAt") {
            return { ...defaultSort, ...newSort };
        } else {
            return { ...newSort, ...defaultSort };
        }
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

    // console.log(`Pipeline`, buildSortCriteria(sort))

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
    const totalResults = result.totalResults[0]?.count;

    const totalPages = Math.ceil(totalResults / cappedLimit);

    const currentPage = parseInt(page, 10) <= totalPages ? parseInt(page, 10) : 1;

    // Response
    res.status(200).json(new ApiResponse(200, {
        products,
        totalResults,
        totalPages,
        currentPage
    }, "Products retrieved successfully!"));
});

export const homepageProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({}).limit(10).sort({ createdAt: -1 }).populate("user", "name email");
    if (!products) throw new ApiError(404, "No products found.!");
    res.status(200).json(new ApiResponse(200, products, "Home page products retrieved successfully.!"));
});

export const bestSellerProduct = asyncHandler(async (_, res) => {
    const products = await Product.find({ bestSeller: true }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json(new ApiResponse(200, products, "bestSeller products retrieved successfully"))
});

export const getAdminProducts = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const { page = 1, limit = 10 } = req.query;

    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new ApiError(404, "Please provide a valid ID.");
    }

    const pipelines = [];

    if (id) {
        pipelines.push({ $match: { _id: new mongoose.Types.ObjectId(id) } });
    }

    // Paginate results
    const cappedLimit = Math.min(parseInt(limit, 10), 100); // Limit to a maximum of 100
    const skip = (parseInt(page, 10) - 1) * cappedLimit;

    pipelines.push(
        { $sort: { numOfReviews: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: cappedLimit }
    );

    const results = await Product.aggregate(pipelines);

    const totalDocuments = await Product.countDocuments();

    const totalResults = id
        ? results.length
        : totalDocuments;
    const totalPages = Math.ceil(totalResults / cappedLimit);
    const currentPage = parseInt(page, 10) <= totalPages ? parseInt(page, 10) : 1;

    res.status(200).send(
        new ApiResponse(200, {
            results, totalDocuments,
            totalResults,
            totalPages,
            currentPage
        }, "Admin products fetched successfully!")
    );
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide product valid ID.!");

    const product = await Product.findById(id).populate("user", "name email");

    if (!product) throw new ApiError(404, "Product not found.!");

    res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully.!"));
});



export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new ApiError(400, "Please provide valid product ID.!");
    const product = await Product.findByIdAndDelete(id).select("images");

    if (!product) throw new ApiError(404, "Product not found.!");

    product.images.forEach(async image => await cloudinary.uploader.destroy(image.filename))

    // await Product.findByIdAndDelete(id);


    res.status(200).json(new ApiResponse(200, { _id: product._id }, "Product deleted successfully.!"));
});