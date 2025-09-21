// models/user.model.js
import mongoose from "mongoose";
import { type } from "node:os";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ProfilePicture: { type: String, default: "" },
    gender: { type: String, enum: ['male', 'female'] },
    islawyer : {type:Boolean,default:false}
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
