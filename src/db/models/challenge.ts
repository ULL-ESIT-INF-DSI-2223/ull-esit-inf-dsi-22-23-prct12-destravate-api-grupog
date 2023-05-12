import { model } from 'mongoose';
import { Collection } from '../collection.js';
import { ChallengeSchema } from '../schemas/challenge_schema.js';
import { ChallengeInterface } from '../interfaces/challenge_interface.js';

/**
  * Model of a Challenge, using the Schema of the Challenge
 */
export const Challenge = model<ChallengeInterface>(Collection.CHALLENGES, ChallengeSchema)

/**
 * Function made to return to the client a JSON with the data we want
 * @param ci. interface of the Challege
 */
export function challengeDocToChallenge(ci: ChallengeInterface): unknown {
  return {
    id: ci._id,
    name: ci.name,
    routes: ci.routes,
    userIds: ci.userIds,
    activity: ci.activity,
  }
}
