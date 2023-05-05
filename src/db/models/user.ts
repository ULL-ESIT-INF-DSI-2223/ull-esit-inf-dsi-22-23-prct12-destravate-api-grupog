import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { UserInterface } from '../interfaces/user_interface.js';
import { UserSchema } from '../schemas/user_schema.js';

/**
 * 
 */
export const User = model<UserInterface>(Collection.USERS, UserSchema)