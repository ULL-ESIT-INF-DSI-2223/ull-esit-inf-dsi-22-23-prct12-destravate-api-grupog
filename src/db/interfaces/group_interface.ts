import { ActivityType } from "../activity_type.js";
import { Document } from 'mongoose';

/**
 * 
 */
export interface GroupInterface extends Document {
  name: string;
  participants: string[];
  favoriteRoutes: string[];
  routeHistory: string[];
  createdBy: string;
  activity: ActivityType;
}