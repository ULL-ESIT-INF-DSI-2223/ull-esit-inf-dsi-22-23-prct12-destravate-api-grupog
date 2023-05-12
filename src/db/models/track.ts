import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { TrackInterface } from '../interfaces/track_interface.js';
import { TrackSchema } from '../schemas/track_schema.js';

/**
 * Model of a Track, using the Schema of the Track
 */
export const Track = model<TrackInterface>(Collection.TRACKS, TrackSchema);

/**
 * Function made to return to the client a JSON with the data we want
 * @param ti. interface of the Track
 */
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
