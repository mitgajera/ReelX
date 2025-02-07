import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required" },
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

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        user.password = newPassword; // Update the password
        user.otp = undefined; // Clear the OTP
        user.otpExpires = undefined; // Clear the OTP expiration
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
