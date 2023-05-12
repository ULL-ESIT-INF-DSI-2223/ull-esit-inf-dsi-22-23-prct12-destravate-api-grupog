import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { UserInterface } from '../interfaces/user_interface.js';
import { UserSchema } from '../schemas/user_schema.js';
import { Challenge } from './challenge.js';
import { Track } from './track.js';
import { Group, middlewareGroupRemoveRelated } from './group.js';

/**
 * Model of a User, using the Schema of User
 */
export const User = model<UserInterface>(Collection.USERS, UserSchema)

/**
 * Function made to return to the client a JSON with the data we want
 * @param ui. interface of the user
 */
export function userDocToUser(ui: UserInterface): unknown {
  return {
    _id: ui._id,
    name: ui.name,
    friends: ui.friends,
    groupFriends: ui.groupFriends,
    favoriteRoutes: ui.favoriteRoutes,
    activeChallenges: ui.activeChallenges,
    routeHistory: ui.routeHistory,
    activity: ui.activity
  }
}

export async function middlewareUserRemoveRelated(id: string): Promise<unknown> {
  const promiseList: Promise<unknown>[] = []
  for (const challenge of await Challenge.find({ userIds: id })) {
    challenge.userIds = challenge.userIds.filter(userId => userId !== id)
    promiseList.push(challenge.save())
  }
  for (const track of await Track.find({ userIds: id })) {
    track.userIds = track.userIds.filter(userId => userId !== id)
    promiseList.push(track.save())
  }
  for (const group of await Group.find({createdBy: {$ne: id}, participants: id})) {
    group.participants = group.participants.filter(userId => userId !== id)
    promiseList.push(group.save())
  }
  for (const group of await Group.find({createdBy: id})) {
    promiseList.push(middlewareGroupRemoveRelated(group._id))
    promiseList.push(group.deleteOne())
  }
  return Promise.all(promiseList)
}
