import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema<IUser>({
    id: {
        type:Number,
        unique: true
    },

    role: {
        type: String,
        default: 'user'
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    }
});

UserSchema.plugin(AutoIncrement, {inc_field: 'id'});

export const User = mongoose.model('User', UserSchema);
