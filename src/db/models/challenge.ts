import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { ChallengeSchema } from '../schemas/challenge_schema.js';
import { ChallengeInterface } from '../interfaces/challenge_interface.js';

/**
 * 
 */
export const Challenge = model<ChallengeInterface>(Collection.CHALLENGES, ChallengeSchema)

export function challengeDocToChallenge(ci: ChallengeInterface): unknown {
  return {
    id: ci._id,
    name: ci.name,
    routes: ci.routes,
    userIds: ci.userIds,
    activity: ci.activity,
  }
}
