import { ChallengeInterface } from "../interfaces/challenge_interface.js"
import { Schema } from 'mongoose';

/**
 * 
 */
export const ChallengeSchema = new Schema<ChallengeInterface> ({
  name: {
    type: String,
    required: true,
    unique: true
  },
  routes: {
    type: [String],
    required: true
  },
  userIds: {
    type: [String],
    required: true,
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  }
})
