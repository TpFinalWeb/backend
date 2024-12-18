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
  },

  num_vote: {
    type: Number,
    min: 0,
  },

  score: {
    type: Number,
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
    platforms: {
      type: [String],
    },
  },

  genres: [
    {
      _id: false,
      genre_category: {
        type: String,
  
      },
      genre_category_id: {
        type: Number,
  
      },
      genre_id: {
        type: Number,
  
      },
      genre_name: {
        type: String,
  
      },
    },
  ],

  platforms: [
    {
      _id: false,
      platform_id: {
        type: Number,
  
      },
      platform_name: {
        type: String,
  
      },
      first_release_date: {
        type: String,
  
      },
    },
  ],
});

export const Game = mongoose.model("Game", GameSchema);
