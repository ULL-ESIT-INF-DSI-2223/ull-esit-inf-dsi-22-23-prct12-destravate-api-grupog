import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { TrackInterface } from '../interfaces/track_interface.js';
import { TrackSchema } from '../schemas/track_schema.js';

/**
 * 
 */
export const Track = model<TrackInterface>(Collection.TRACKS, TrackSchema);

export function trackDocToTrack(ti: TrackInterface): unknown {
  return {
    id: ti._id,
    name: ti.name,
    start: ti.start,
    end: ti.end,
    distanceKm: ti.distanceKm,
    averageSlope: ti.averageSlope,
    userIds: ti.userIds,
    activity: ti.activity,
    averageScore: ti.averageScore
  }
}
