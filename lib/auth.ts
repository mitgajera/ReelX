import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "./db";
import User from "./models/user.model";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    throw error
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                try {
                    await dbConnect();
                    const userExists = await User.findOne({ email: profile?.email });
                    
                    if (!userExists && profile?.email) {
                        await User.create({
                            email: profile.email,
                            name: profile.name,
                            provider: "google"
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error during Google sign in:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account, profile }) {
            if (account?.provider === "google") {
                if (user) {
                    token.id = user.id;
                }
                token.name = profile?.name;
                token.image = profile?.image;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.image = token.image as string;
            }
            return session;
        }
    },

    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/login"
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },

    secret: process.env.NEXTAUTH_SECRET
}