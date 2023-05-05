import { GroupInterface } from "../interfaces/group_interface.js";
import { Schema } from 'mongoose';

/**
 * 
 */
export const GroupSchema = new Schema<GroupInterface>({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("invalid name");
      }
    },
    unique: true
  },
  participants: {
    type: [String],
    required: true
  },
  favoriteRoutes: {
    type: [String],
    required: false
  },
  createdBy: {
    type: String,
    required: true
  },
  routeHistory: {
    type: [String],
    required: false
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  },
})
