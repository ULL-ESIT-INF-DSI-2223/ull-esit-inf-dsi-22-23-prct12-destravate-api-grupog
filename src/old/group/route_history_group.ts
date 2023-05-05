import RouteHistory, { RouteHistoryData } from "../user/route_history.js";

/**
 * Class to represent the information of a route it contains:
 *  - The ID of the route
 *  - The date in which it was done
 *  - The kms of the route
 *  - The average slope of the route
 *  - The users that participated on the route
 */
export default class RouteHistoryGroup extends RouteHistory {
  public participants: string[];

  /**
   * Constructor of the object RouteHistoryGroup
   * @param routeId 
   * @param date 
   * @param kms 
   * @param averageSlope 
   * @param participants 
   */
  constructor(routeId: string, date: Date, kms: number, averageSlope: number, participants: string[]) {
    super(routeId, date, kms, averageSlope);
    this.participants = participants;
  }
  
  /**
   * Static method to parse information
   * @param data 
   * @returns 
   */
  static parse(data: RouteHistoryGroupData): RouteHistoryGroup {
    return new RouteHistoryGroup(
      data.routeId,
      new Date(data.date),
      data.kms,
      data.averageSlope,
      data.participants
    )
  }
}

/**
 * Interface made to known the data of a route that will be read from the db
 */
export interface RouteHistoryGroupData extends RouteHistoryData {
  participants: string[]
}
