import { NextRequest, NextResponse } from "next/server";
import Video from "@/lib/models/video.model";
import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        await dbConnect(); // Ensure the database connection is established

        const { title, description, videoUrl, thumbnailUrl, userId } = await req.json();

        if (!title || !description || !videoUrl || !thumbnailUrl || !userId) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const newVideo = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            userId,
        });

        await newVideo.save();

        return NextResponse.json(
            { message: "Video uploaded successfully", video: newVideo },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
