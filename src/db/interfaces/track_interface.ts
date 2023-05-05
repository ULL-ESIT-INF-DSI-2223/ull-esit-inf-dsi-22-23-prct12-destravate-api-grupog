import { ActivityType } from "../activity_type.js"
import { CoordinatesInterface } from "./coordinate_interface.js"
import { Document } from 'mongoose';

/**
 * 
 */
export interface TrackInterface extends Document {
  name: string,
  start: CoordinatesInterface,
  end: CoordinatesInterface,
  distanceKm: number,
  averageSlope: number,
  userIds: string[],
  activity: ActivityType,
  averageScore: number
}
