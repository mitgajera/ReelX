import mongoose, { Schema, models, model } from "mongoose";

export interface Post {
    userId: mongoose.Types.ObjectId;
    content: string;
    likes: number;
    comments: Array<{
        userId: mongoose.Types.ObjectId;
        content: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<Post>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: [{
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User"
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    { timestamps: true }
);

const Post = models?.Post || model<Post>("Post", postSchema);

export default Post;
