import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';
import { TrackHistoryEntryInterface } from "./track_history_interface.js";

/**
 * Interface to represent a User
 */
export interface UserInterface extends Document {
  _id: string; 
  name: string;
  friends: string[];
  groupFriends: string[]
  favoriteRoutes: string[];
  activeChallenges: string[];
  routeHistory: TrackHistoryEntryInterface[];
  activity: ActivityType;
}
