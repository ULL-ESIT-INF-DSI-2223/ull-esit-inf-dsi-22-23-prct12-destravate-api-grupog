import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { UserInterface } from '../interfaces/user_interface.js';
import { UserSchema } from '../schemas/user_schema.js';

/**
 * 
 */
export const User = model<UserInterface>(Collection.USERS, UserSchema)

export function userDocToUser(ui: UserInterface): unknown {
  return {
    id: ui._id,
    uid: ui.uid,
    name: ui.name,
    friends: ui.friends,
    gruoupFriends: ui.groupFriends,
    favoriteRoutes: ui.favoriteRoutes,
    activeChallenges: ui.activeChallenges,
    routeHistory: ui.routeHistory,
    activity: ui.activity
  }
}
