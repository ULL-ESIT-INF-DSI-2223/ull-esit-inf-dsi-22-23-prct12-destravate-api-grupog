import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';
import { TrackHistoryEntryInterface } from "./track_history_interface.js";
/**
 * Interface to represent a Group 
 */
export interface GroupInterface extends Document {
  name: string;
  participants: string[];
  favoriteRoutes: string[];
  routeHistory: TrackHistoryEntryInterface[];
  createdBy: string;
  activity: ActivityType;
}
