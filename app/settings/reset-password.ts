import { NextRequest, NextResponse } from "next/server";
import  User  from "@/lib/models/user.model"; 

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { email, newPassword } = body;
    if (!email || !newPassword) {
        return NextResponse.json(
            { error: "Email and new password are required" },
            { status: 400 }
        );
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        user.password = newPassword;
        await user.save();

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
