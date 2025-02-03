import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function dbConnect() {
    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }

        cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
            return mongoose.connection;
        })
        .catch((error) => {
            console.error("Database connection error:", error);
            throw error;
        });
    } 

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error("Error with cached connection:", error);
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
