import express from 'express';
import mongoose from 'mongoose';
import userrouter from './routes/user';
import contentrouter from './routes/content';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
mongoose.connect(process.env.Mongo_URL || 'mongodb://127.0.0.1:27017/secondbrain');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/user', userrouter);
app.use('/api/v1/content', contentrouter);

app.post('/api/v1/brain/share', (req, res) => {

});

app.get('/api/v1/brain/:shareLink', (req, res) => {

});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});