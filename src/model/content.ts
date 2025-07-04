import { Schema, model } from "mongoose";

const contentTypes = ["article", "image", "video", "audio"];

const contentSchema = new Schema({
    link: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: contentTypes,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Content = model("Content", contentSchema);
export default Content;