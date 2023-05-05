import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';

/**
 * 
 */
export interface ChallengeInterface extends Document {
  name: string;
  routes: string[];
  userIds: string[];
  activity: ActivityType;
}