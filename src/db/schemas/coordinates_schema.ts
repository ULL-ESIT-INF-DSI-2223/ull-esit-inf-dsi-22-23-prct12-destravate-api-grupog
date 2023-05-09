import { Schema } from 'mongoose';
import { CoordinatesInterface } from "../interfaces/coordinate_interface.js";

/**
 * 
 */
export const CoordinatesSchema = new Schema<CoordinatesInterface>({
  latitude: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value > 90 || value < -90 || isNaN(value)) {
        throw new Error("Invalid North-South Coordinate");
      }
    }
  },
  longitude: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value > 180 || value < -180 || isNaN(value)) {
        throw new Error("Invalid East-West Coordinate");
      }
    }
  },
  mosl: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value > 10_000 || value < -500 || isNaN(value)) {
        throw new Error("Invalid meters over sea level");
      }
    }
  }
}, {_id: false})
