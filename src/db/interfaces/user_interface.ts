import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';
import { TrackHistoryEntryInterface } from "./track_history_interface.js";

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
  routeHistory: TrackHistoryEntryInterface[];
  activity: ActivityType;
}
