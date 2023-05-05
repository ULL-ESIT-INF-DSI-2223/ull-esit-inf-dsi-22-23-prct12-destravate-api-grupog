import { UserInterface } from "../interfaces/user_interface.js";
import { Schema } from 'mongoose';

/**
 * 
 */
export const UserSchema = new Schema<UserInterface>({
  uid: {
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
    unique: true
  },
  friends: {
    type: [String],
    required: false
  },
  groupFriends: {
    type: [String],
    required: false
  },
  favoriteRoutes: {
    type: [String],
    required: false
  },
  activeChallenges: {
    type: [String],
    required: false
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
