import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { TrackInterface } from '../interfaces/track_interface.js';
import { TrackSchema } from '../schemas/track_schema.js';
import { Challenge } from './challenge.js';
import { Group } from './group.js';
import { User } from './user.js';

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
    _id: ti._id,
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

export async function middlewareTrackRemoveRelated(id: string): Promise<unknown> {
  const promiseList: Promise<unknown>[] = []
  for (const challenge of await Challenge.find({ routes: id })) {
    challenge.routes = challenge.routes.filter(routeId => routeId !== id)
    promiseList.push(challenge.save())
  }
  for (const group of await Group.find({ $or: [{favoriteRoutes: id}, {"routeHistory.routeId": id}] })) {
    group.favoriteRoutes = group.favoriteRoutes.filter(routeId => routeId !== id)
    group.routeHistory = group.routeHistory.filter(rh => rh.routeId.toString() !== id)
    promiseList.push(group.save())
  }
  for (const user of await User.find({ $or: [{favoriteRoutes: id}, {"routeHistory.routeId": id}] })) {
    user.favoriteRoutes = user.favoriteRoutes.filter(routeId => routeId !== id)
    user.routeHistory = user.routeHistory.filter(rh => rh.routeId.toString() !== id)
    promiseList.push(user.save())
  }
  return Promise.all(promiseList)
}
