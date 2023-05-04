import { ActivityType } from "../activity_type.js";
import Database from "../db/database.js";
import {
  compareStrings,
  compareStringsFirstIgnoringCase,
} from "../utils/sort_func.js";

/**
 * Choice type represents a generic choice for inquirer.js
 */
export type Choice<T> = {
  name: string;
  value: T;
};

/**
 * activityTypes function returns a list of choices for all Activity Types.
 * @returns A list of all the activity type choices.
 */
export function activityTypes(): Choice<ActivityType>[] {
  return [
    {
      name: "Correr",
      value: ActivityType.RUNNING,
    },
    {
      name: "Ciclismo",
      value: ActivityType.BICYCLE,
    },
  ];
}

/**
 * routes function returns a list of choices for all routes.
 * @param db Database to read the routes from.
 * @returns A list of all the route choices, using their ID as value.
 */
export function routes(db: Database): Choice<string>[] {
  return db
    .routes()
    .reduce((acc, route) => {
      acc.push({
        name: route.name,
        value: route.id,
      });
      return acc;
    }, [] as Choice<string>[])
    .sort(sortByNameThenValue);
}

/**
 * challenge function returns a list of choices for all challenges.
 * @param db Database to read the challenge from.
 * @returns A list of all the challenge choices, using their ID as value.
 */
export function challenges(db: Database): Choice<string>[] {
  return db
    .challengeData()
    .reduce((acc, challenge) => {
      acc.push({
        name: challenge.name,
        value: challenge.id,
      });
      return acc;
    }, [] as Choice<string>[])
    .sort(sortByNameThenValue);
}

/**
 * routes function returns a list of choices for all users.
 * @param db Database to read the users from.
 * @returns A list of all the user choices, using their ID as value.
 */
export function users(db: Database): Choice<string>[] {
  return db
    .userData()
    .reduce((acc, user) => {
      acc.push({
        name: `${user.name} (${user.id})`,
        value: user.id,
      });
      return acc;
    }, [] as Choice<string>[])
    .sort(sortByNameThenValue);
}

/**
 * routes function returns a list of choices for all users.
 * @param db Database to read the users from.
 * @param ownerID ID of the owner to filter by.
 * @returns A list of all the user choices, using their ID as value.
 */
export function groups(db: Database, ownerID?: string): Choice<string>[] {
  const groupList = db.groupData()
  if (ownerID) {
    groupList.filter(group => group.createdBy === ownerID)
  }
  return groupList.reduce((acc, group) => {
    acc.push({
      name: `${group.name} (${group.id})`,
      value: group.id
    })
    return acc
  }, [] as Choice<string>[]).sort(sortByNameThenValue)
}

/**
 * sortByNameThenValue is a generic comparison function for sorting all the choices provided first by name (ignoring
 * case), then by name (case sensitive) and last by value.
 * @param a First choice.
 * @param b Second choice.
 * @returns 1 if a goes after b, -1 if a goes before b, or 0 if they are identical.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortByNameThenValue(a: Choice<any>, b: Choice<any>): number {
  const diff = compareStringsFirstIgnoringCase(a.name, b.name);
  if (diff !== 0) {
    return diff;
  }
  return compareStrings(a.value, b.value);
}
