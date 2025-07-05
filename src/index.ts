import express from 'express';
import mongoose from 'mongoose';
import User from './model/user';
import userrouter from './routes/user'; 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/user', userrouter);

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