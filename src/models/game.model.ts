import mongoose from "mongoose";
import { PriceI } from "../interfaces/price.interface";
import { GameI } from "../interfaces/game.interface";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PriceSchema = new mongoose.Schema<PriceI>({
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

const GameSchema = new mongoose.Schema<GameI>({
    _id: {
        type: Number,
        unique: true,
    },

    name: {
        type: String,
        required: true,
    },

    detailed_description: {
        type: String,
        required: true,
    },

    developers: {
        type: [String],
        required: true,
    },

    category: {
        type: [String],
        required: true,
    },

    price: {
        type: [PriceSchema],
        required: true,
    },

    supported_languages: {
        type: String,
        required: true,
    },

    popularity_score: {
        type: Number,
        required: true,
    },

    header_image: {
        type: String,
        required: true,
    },

    release_date: {
        type: String,
        required: true,
    },
});

GameSchema.plugin(AutoIncrement, { inc_field: '_id' });

export const Game = mongoose.model('Game', GameSchema);