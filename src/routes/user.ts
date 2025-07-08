import {RequestHandler, Router} from 'express';
import User from '../model/user';


const router = Router();

const signupHandler: RequestHandler= async (req,res)=> {
    const {username, password}= req.body;
    const existingUser= await User.findOne({username});
    try{
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
        res.status(201).json({message: "User created successfully"});
    }catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({message: "Internal server error"});
        return;
    }
};

router.post('/signup', signupHandler);

const signinHandler:RequestHandler= async (req,res) => {
    const {username, password} = req.body;
    const user= await User.findOne({username});
    try{
        const token= await User.matchPassword(username, password);
        res.cookie('token',token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({message: "Signin successful", token});
        return;
    }catch (error) {
        res.status(401).json({message: "Invalid username or password"});
        return;
    }
};

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({message: "Logged out successfully"});
});

router.post('/signin', signinHandler);

export default router;