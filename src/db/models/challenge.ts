import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { ChallengeSchema } from '../schemas/challenge_schema.js';
import { ChallengeInterface } from '../interfaces/challenge_interface.js';

/**
 * 
 */
export const Challenge = model<ChallengeInterface>(Collection.CHALLENGES, ChallengeSchema)