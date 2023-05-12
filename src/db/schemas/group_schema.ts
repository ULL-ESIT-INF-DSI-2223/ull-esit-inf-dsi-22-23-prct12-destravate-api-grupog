import { GroupInterface } from "../interfaces/group_interface.js";
import { Schema } from 'mongoose';
import { TrackHistoryEntrySchema } from "./track_history_entry_schema.js";

/**
 * Schema to represent a group
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
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  favoriteRoutes: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
  createdBy: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  routeHistory: {
    type: [TrackHistoryEntrySchema],
    required: true
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  },
})
