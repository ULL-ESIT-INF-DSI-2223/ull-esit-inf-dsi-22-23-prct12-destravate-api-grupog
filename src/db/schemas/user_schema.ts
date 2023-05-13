import { UserInterface } from "../interfaces/user_interface.js";
import { Schema } from 'mongoose';
import { TrackHistoryEntrySchema } from "./track_history_entry_schema.js";

/**
 * Schema to represent a user following UserInterface
 */
export const UserSchema = new Schema<UserInterface>({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("invalid name");
      }
    },
  },
  friends: [{
    type: String,
    ref: "User"
  }],
  groupFriends: [{
    type: Schema.Types.ObjectId,
    ref: "Group"
  }],
  favoriteRoutes: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
  activeChallenges: [{
    type: Schema.Types.ObjectId,
    ref: "Challenge"
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
