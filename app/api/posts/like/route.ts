import { NextRequest, NextResponse } from "next/server";
import Post from "@/lib/models/post.model";

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

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id: string) => id !== userId);
            await post.save();
            return NextResponse.json(
                { message: "Like removed successfully", likes: post.likes.length },
                { status: 200 }
            );
        } else {
            post.likes.push(userId);
            await post.save();
            return NextResponse.json(
                { message: "Post liked successfully", likes: post.likes.length },
                { status: 200 }
            );
        }

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
