/**
 * Class to represent the information of a route it contains:
 *  - The ID of the route
 *  - The date in which it was done
 *  - The kms of the route
 *  - The average slope of the route
 */
export default class RouteHistory {
  public routeId: string;
  public date: Date;
  public kms: number;
  public averageSlope: number;
  
  /**
   * Constructor of the object RouteHistory
   * @param routeId 
   * @param date 
   * @param kms 
   * @param averageSlope 
   */
  constructor(routeId: string, date: Date, kms: number, averageSlope: number) {
    this.routeId = routeId;
    this.date = date;
    this.kms = kms;
    this.averageSlope = averageSlope;
  }

  /**
   * Static method to parse information
   * @param data 
   * @returns 
   */
  static parse(data: RouteHistoryData): RouteHistory {
    return new RouteHistory(
      data.routeId,
      new Date(data.date),
      data.kms,
      data.averageSlope
    )
  }
}

/**
 * Interface made to known the data of a route that will be read from the db
 */
export interface RouteHistoryData {
  routeId: string
  date: string
  kms: number
  averageSlope: number
}
