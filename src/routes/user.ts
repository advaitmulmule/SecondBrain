import {RequestHandler, Router} from 'express';
import User from '../model/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret= process.env.SECRET;
if (!secret) {
    throw new Error("SECRET environment variable is not set");
}
const router = Router();

const signupHandler: RequestHandler= async (req,res)=> {
    const {username, password}= req.body;
    const existingUser = await User.findOne({username});
    if(!username || !password) {
        res.status(400).json({message: "Username and password are required"});
        return;
    }
    if(existingUser){
        res.status(400).json({message: "Username already exists"});
        return;
    }
    if( password.length < 6) {
        res.status(400).json({message: "Password must be at least 6 characters long"});
        return;
    }
    await User.create({username, password});
    const token = jwt.sign({username}, secret);
    res.status(201).json({message: "User created successfully", token});
};

router.post('/signup', signupHandler);

const signinHandler:RequestHandler= async (req,res) => {
    const {username, password} = req.body;
    const user= await User.findOne({username});
    const token= req.headers.authorization;
    try{
        if(!token){
            throw new Error("Token is required");
        }
        const decoded = jwt.verify(token, secret);
        if ((decoded as JwtPayload).username !== username) {
            throw new Error("Invalid token");
        }
    }catch (error) {
        res.status(401).json({message: "Invalid token"});
        return;
    }
    if (!user || user.password !== password) {
        res.status(401).json({message: "Invalid credentials"});
    }else{
        res.status(200).json({message: "Signin successful", userId: user._id});
    }
};

router.post('/signin', signinHandler);

export default router;