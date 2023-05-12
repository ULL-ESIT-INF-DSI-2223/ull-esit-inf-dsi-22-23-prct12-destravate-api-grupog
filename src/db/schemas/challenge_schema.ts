import { ChallengeInterface } from "../interfaces/challenge_interface.js"
import { Schema } from 'mongoose';

/**
 * Schema to represent a challenge following ChallengeInterface
 */
export const ChallengeSchema = new Schema<ChallengeInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  routes: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
  userIds: [{
    type: String,
    ref: "User"
  }],
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  }
})
