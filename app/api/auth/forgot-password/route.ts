import { NextRequest, NextResponse } from "next/server";
import User from "'@lib/models/user.model.ts'";
import send

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        user.otp = otp; // Store OTP in user model
        user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
        await user.save();

        await sendOtp(email, otp); // Send OTP to user's email

        return NextResponse.json(
            { message: "OTP sent to email" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An error occurred" },
            { status: 500 }
        );
    }
}
