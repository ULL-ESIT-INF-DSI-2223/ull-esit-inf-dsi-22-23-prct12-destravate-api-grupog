import { TrackInterface } from "../interfaces/track_interface.js";
import { Schema } from 'mongoose';
import { CoordinatesSchema } from "./coordinates_schema.js";

/**
 * 
 */
export const TrackSchema = new Schema<TrackInterface> ({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("invalid name");
      }
    }
  },
  start: {
    type: CoordinatesSchema,
    required: true
  },
  end: {
    type: CoordinatesSchema,
    required: true
  },
  distanceKm: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0 || value > 41_000 || isNaN(value)) {
        throw new Error("invalid distance in kilometers");
      }
    }
  },
  averageSlope: {
    type: Number,
    required: true,
  },
  userIds: {
    type: [String],
    required: true,
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  },
  averageScore: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 1 || value > 10 || isNaN(value)) {
        throw new Error("invalid average score");
      }
    }
  }
})
