import { ActivityType } from "../activity_type.js";

/**
 * Interface made to know the data of a challenge that will be read from de db
 */
export interface ChallengeData {
  id: string;
  name: string;
  routes: string[];
  userIds: string[];
  activity: ActivityType;
}
