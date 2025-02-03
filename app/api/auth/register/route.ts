import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if(!email || !password){
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            )
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" },
                { status: 400 }
            )
        }

        await dbConnect();

        const existingUser = await User.findOne({ email: email });

        if(existingUser){
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        } 

        const newUser = await User.create({
            email: email,
            password: password
        });   

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                password: newUser.password,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        }, { status: 201 });

    } catch(error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}