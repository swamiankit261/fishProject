import mongoose from 'mongoose';
import process from "node:process";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "please enter a userName.!!"],
        trim: true,
        lowercase: true,
        minLength: [3, "userName must be at least 3 characters long.!"],
        maxLength: [20, "userName must be at most 20 characters long.!"]
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email !!"],
        unique: [true, "Please enter a valid email.!!"],
        index: true,
        validate: [function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }, "Email address must begin with a letter or underscore character and contain only alphanumeric characters.!!"],
        trim: true,
    },
    avatar: {
        public_id: { // cloudinary image id
            type: String,
        },
        url: { // cloudinary url
            type: String,
        }
    },
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "please enter a password.!!"],
        minLength: [8, "password must be at least 8 characters long.!"],
        match: [/^(?=.*[A-Z])|(?=.*\d).{8,}$/, "Password must contain at least 8 characters, one uppercase, one number.!!"],
        select: false // this field will not be included in the output
    }
}, { timestamps: true });

// hash the password before saving to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    try {
        return jwt.sign(
            { id: this._id, email: this.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}d` }
        );
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Token generation failed");
    }
};



export default mongoose.model("User", userSchema);