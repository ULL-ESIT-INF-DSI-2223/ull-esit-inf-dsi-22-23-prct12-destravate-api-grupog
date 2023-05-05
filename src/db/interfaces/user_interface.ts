import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';

/**
 * 
 */
export interface UserInterface extends Document {
  uid: string; 
  name: string;
  friends: string[];
  groupFriends: string[]
  favoriteRoutes: string[];
  activeChallenges: string[];
  routeHistory: string[];
  activity: ActivityType;
}