import { model } from 'mongoose';
import { GroupInterface } from '../interfaces/group_interface.js';
import { Collection } from '../collection.js';
import { GroupSchema } from '../schemas/group_schema.js';

/**
 * 
 */
export const Group = model<GroupInterface>(Collection.GROUPS, GroupSchema)

export function groupDocToGroup(gi: GroupInterface): unknown {
  return {
    id: gi._id,
    name: gi.name,
    participants: gi.participants,
    favoriteRoutes: gi.favoriteRoutes,
    routeHistory: gi.routeHistory,
    createdBy: gi.createdBy,
    activity: gi.activity
  }
}