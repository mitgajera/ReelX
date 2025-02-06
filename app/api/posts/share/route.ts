import { NextRequest, NextResponse } from "next/server";
import Post from "@lib/models/post.model.ts";

export async function POST(req: NextRequest) {
    try {
        const { postId, userId } = await req.json();

        if (!postId || !userId) {
            return NextResponse.json(
                { error: "Post ID and User ID are required" },
                { status: 400 }
            );
        }

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Logic for sharing the post can be implemented here
        return NextResponse.json(
            { message: "Post shared successfully" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
