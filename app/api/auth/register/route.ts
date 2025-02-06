import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username } = body; // Include username

        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Email, password, and username are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUserByEmail = await User.findOne({ email: email });
        const existingUserByUsername = await User.findOne({ username: username }); // Check for existing username

        if (existingUserByEmail) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        if (existingUserByUsername) {
            return NextResponse.json(
                { error: "User with this username already exists" },
                { status: 400 }
            );
        }

        const newUser = await User.create({
            email: email,
            password: password,
            username: username // Save the username
        });

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username, // Include username in response
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
