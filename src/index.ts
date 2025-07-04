import express from 'express';
import mongoose from 'mongoose';
import User from './model/user';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/signup', async (req,res) => {
    const {username, password}= req.body;
    await User.create({username, password});
    res.status(201).json({message: "User created successfully"});
});

app.post('/api/v1/signin', async (req,res) => {
    const {username, password} = req.body;
    const user= await User.findOne({username});
    if (!user || user.password !== password) {
        res.status(401).json({message: "Invalid credentials"});
    }else{
        res.status(200).json({message: "Signin successful", userId: user._id});
    }
    
});

app.post('/api/v1/content', (req, res) => {

});

app.get('/api/v1/content', (req, res) => {

});

app.delete('/api/v1/content', (req, res) => {

});

app.post('/api/v1/brain/share', (req, res) => {

});

app.get('/api/v1/brain/:shareLink', (req, res) => {

});