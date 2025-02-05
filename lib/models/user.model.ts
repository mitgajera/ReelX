import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
    email: string;
    name?: string;
    password?: string;
    provider?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        
        name: {
            type: String,
            required: false
        },

        password: {
            type: String,
            required: false
        },

        provider: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function(next) {
    if(this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next()
});

const User = models?.User || model<User>("User", userSchema);

export default User;