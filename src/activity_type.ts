/**
 * ActivityType enum contains all the values for types of activities.
 */
export enum ActivityType {
  RUNNING,
  BICYCLE,
}

/**
 * activityTypeToString function returns a string in Spanish representing the activity type.
 * @param at ActivityType to evaluate.
 * @returns Activity type in Spanish.
 */
export function activityTypeToString(at: ActivityType): string {
  if (at === ActivityType.RUNNING) return "Correr"
  return "Ciclismo"
}
