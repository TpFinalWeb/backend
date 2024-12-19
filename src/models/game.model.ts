// src/models/game.model.ts

import mongoose, { Schema, Document } from "mongoose";
import { GameI } from "../interfaces/game.interface";

interface GameDocument extends GameI, Document {}

const GameSchema = new Schema<GameDocument>({
  name: {
    type: String,
    required: true,
  },

  detailed_description: {
    type: String,
    required: true,
  },

  num_vote: {
    type: Number,
    required: true,
    min: 0,
  },

  score: {
    type: Number,
    required: true,
    min: 0,
  },

  sample_cover: {
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    image: {
      type: String,
    },
    thumbnail_image: {
      type: String,
    },
    platforms: [
      {
        type: String,
      },
    ],
  },

  genres: [
    {
      _id: false,
      genre_category: {
        type: String,
        required: true,
      },
      genre_category_id: {
        type: Number,
        required: true,
      },
      genre_id: {
        type: Number,
        required: true,
      },
      genre_name: {
        type: String,
        required: true,
      },
    },
  ],

  platforms: [
    {
      _id: false,
      platform_id: {
        type: Number,
        required: true,
      },
      platform_name: {
        type: String,
        required: true,
      },
      first_release_date: {
        type: String,
        required: true,
      },
    },
  ],
});

export const Game = mongoose.model("Game", GameSchema);