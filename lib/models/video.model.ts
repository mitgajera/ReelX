import mongoose, { Schema, models, model } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const

export interface Video {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    createdAt?: Date;
    transformation?: {
        width: number;
        height: number;
        quality?: number;
        crop: "center" | "top" | "bottom" | "left" | "right";
        gravity: "north" | "east" | "south" | "west";
        rotate: "auto" | "90" | "180" | "270";
    }
}

const videoSchema = new Schema<Video>({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    videoUrl: {
        type: String,
        required: true
    },

    thumbnailUrl: {
        type: String,
        required: true
    },

    controls: {
        type: Boolean,
        default: true
    },

    transformation: {
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width
        },

        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height
        },

        quality: {
            type: Number,
            min: 1,
            max: 100
        },

        crop: {
            type: String,
            default: "center",
            enum: ["center", "top", "bottom", "left", "right"]
        },

        gravity: {
            type: String,
            default: "north",
            enum: ["north", "east", "south", "west"]
        },

        rotate: {
            type: String,
            default: "auto",
            enum: ["auto", "90", "180", "270"]
        }
    }
},

{ timestamps: true }
);

const Video = models?.Video || model<Video>("Video", videoSchema);

export default Video;