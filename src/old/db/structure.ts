import Route from "../route/route.js";
import { UserData } from "../user/user_data.js";
import { ChallengeData } from "../challenge/challenge_data.js";
import { GroupData } from "../group/group_data.js";

/**
 * DatabaseStructure type represents the structure of the database.
 */
export type DatabaseStructure = {
  challenges: ChallengeData[];
  groups: GroupData[];
  routes: Route[];
  users: UserData[];
};

/**
 * Collection enum enumerates all the collections in the database.
 */
export enum Collection {
  CHALLENGES = "challenges",
  GROUPS = "groups",
  ROUTES = "routes",
  USERS = "users",
}
