import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;
if (!secret) {
    throw new Error("SECRET environment variable is not set");
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.static("matchPassword", async function (username, password) {
    const user = await this.findOne({username});
    if (!user){
        return false;
    }
    if (user.password !== password){
        return false;
    }
    const token= jwt.sign({username: user.username}, secret);
    return token;
});

const User = model("User", userSchema);
export default User;
