import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';

/**
 * Interface to represent a challenge
 */
export interface ChallengeInterface extends Document {
  name: string;
  routes: string[];
  userIds: string[];
  activity: ActivityType;
}
