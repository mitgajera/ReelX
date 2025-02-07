"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
                </div>

                <div className="mt-8 space-y-6">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
} 