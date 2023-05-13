import { model } from 'mongoose';
import { GroupInterface } from '../interfaces/group_interface.js';
import { Collection } from '../collection.js';
import { GroupSchema } from '../schemas/group_schema.js';
import { User } from './user.js';

/**
  * Model of a Group, using the Schema of Group
 */
export const Group = model<GroupInterface>(Collection.GROUPS, GroupSchema)

/**
 * Function made to return to the client a JSON with the data we want
 * @param gi. interface of the Group
 */
export function groupDocToGroup(gi: GroupInterface): unknown {
  return {
    _id: gi._id,
    name: gi.name,
    participants: gi.participants,
    favoriteRoutes: gi.favoriteRoutes,
    routeHistory: gi.routeHistory,
    createdBy: gi.createdBy,
    activity: gi.activity
  }
}

export async function middlewareGroupRemoveRelated(id: string): Promise<unknown> {
  const promiseList: Promise<unknown>[] = []
  for (const user of await User.find({ groupFriends: id })) {
    user.groupFriends = user.groupFriends.filter(groupId => groupId.toString() !== id.toString())
    promiseList.push(user.save())
  }
  return Promise.all(promiseList)
}
