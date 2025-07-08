import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {createHmac, randomBytes} from "node:crypto";
import { IUser, IUserModel } from "../types/user";
dotenv.config();

const secret = process.env.SECRET;
if (!secret) {
    throw new Error("SECRET environment variable is not set");
}

const userSchema=new Schema<IUser, IUserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt:{
        type:String
    }
});

userSchema.pre("save", function(next){
    const user = this;
    if (!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedPass= createHmac("sha256", salt).update(user.password).digest("hex");
    user.password = hashedPass;
    user.salt = salt;
    next();
});

userSchema.static("matchPassword", async function (username:string, password:string):Promise<string> {
    const user = await this.findOne({username});
    if (!user){
        throw new Error("User not found");
    }
    const salt = user.salt;
    const hashedPass=user.password;
    const hashedInputPass = createHmac("sha256", salt).update(password).digest("hex");
    if (hashedInputPass !== hashedPass) {
        throw new Error("Invalid password");
    }
    const token= jwt.sign({_id:user._id, username: user.username}, secret);
    return token;
});

const User = model<IUser,IUserModel>("User", userSchema);
export default User;

