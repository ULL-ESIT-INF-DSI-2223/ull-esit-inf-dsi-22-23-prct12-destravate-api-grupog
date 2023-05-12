import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { UserInterface } from '../interfaces/user_interface.js';
import { UserSchema } from '../schemas/user_schema.js';

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
