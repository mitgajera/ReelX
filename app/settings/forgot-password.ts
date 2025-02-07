import { NextRequest, NextResponse } from "next/server";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { email } = body;
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        await sendResetPasswordEmail(email);
        return NextResponse.json({ message: "Password reset email sent successfully" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
    }
}
