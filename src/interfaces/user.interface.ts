import mongoose from "mongoose";

export interface IUser {
    id?: number;
    role: string;
    email: string;
    username: string;
    password: string;
}