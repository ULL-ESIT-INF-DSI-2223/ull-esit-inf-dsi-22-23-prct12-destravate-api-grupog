import { model } from 'mongoose';
import { GroupInterface } from '../interfaces/group_interface.js';
import { Collection } from '../collection.js';
import { GroupSchema } from '../schemas/group_schema.js';

/**
 * 
 */
export const Group = model<GroupInterface>(Collection.GROUPS, GroupSchema)