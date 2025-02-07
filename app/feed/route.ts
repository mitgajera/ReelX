import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Video from "@/lib/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to fetch videos" },

            { status: 200 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized request" },
                { status: 401 }
            )
        }

        await dbConnect();
        const body = await request.json()
        if (!body.title || !body.description || !body.videourl) {
            return NextResponse.json(
                { error: "Missing required feilds" },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const video = await Video.create(videoData);
        return NextResponse.json(video);
    }
    catch (error) {
        return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create video" },

            { status: 200 }
        );
    }
}
