import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
    email: string;
    username: string; // New field for username
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
        
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Ensure username is in lowercase
            validate: {
                validator: function(v: string) {
                    return /^[a-z0-9]+$/.test(v); // Only allow lowercase letters and numbers
                },
                message: props => `${props.value} is not a valid username!`
            }
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
    next();
});

const User = models?.User || model<User>("User", userSchema);

export default User;
