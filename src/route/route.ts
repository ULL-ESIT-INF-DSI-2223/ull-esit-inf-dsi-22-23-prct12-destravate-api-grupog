import { getBorderCharacters, table } from "table";
import { ActivityType, activityTypeToString } from "../activity_type.js";
import Coordinates from "./coordinates.js";

/**
 * Route class represents a route in the app.
 */
export default class Route {
  public id: string
  public name: string
  public start: Coordinates
  public end: Coordinates
  public distanceKm: number
  public averageSlope: number
  public userIds: string[]
  public activity: ActivityType
  public averageScore: number

  /**
   * constructor creates a new Route object from the data provided.
   * @param id ID of the route.
   * @param name Name of the route.
   * @param start Geographic coordinates of the starting point of the route.
   * @param end Geographic coordinates of the ending point of the route.
   * @param distanceKm Length of the route, in kilometers.
   * @param averageSlope Average slope of the route, in meters.
   * @param userIds List of users that have traveled through the route.
   * @param activity Type of activity in this route.
   * @param averageScore Average score of this route.
   */
  constructor(id: string, name: string, start: Coordinates, end: Coordinates, distanceKm: number,
      averageSlope: number, userIds: string[], activity: ActivityType, averageScore: number) {
    
    if (name === "") {
      throw new Error("invalid name");
    }
    if (distanceKm < 0 || distanceKm > 41_000 || isNaN(distanceKm)) {
      throw new Error("invalid distance in kilometers");
    }
    if (averageScore < 1 || averageScore > 10 || isNaN(averageScore)) {
      throw new Error("invalid average score");
    }

    this.id = id
    this.name = name
    this.start = start
    this.end = end
    this.distanceKm = distanceKm
    this.averageSlope = averageSlope
    this.userIds = userIds
    this.activity = activity
    this.averageScore = averageScore
  }

  /**
   * printTable prints a table containing the list of routes provided.
   * @param list List of routes to print.
   */
  static printTable(list: Route[]): void {
    const tableData = [[
      "Identificador",
      "Nombre",
      "Punto de inicio",
      "Punto de finalización",
      "Longitud",
      "Inclinación media",
      "Usuarios que la han hecho",
      "Tipo de actividad",
      "Puntuación media"
    ]] as unknown[][]
  
    list.forEach(route => tableData.push([
      route.id,
      route.name,
      Coordinates.toString(route.start),
      Coordinates.toString(route.end),
      `${route.distanceKm} km`,
      `${route.averageSlope}°`,
      route.userIds,
      activityTypeToString(route.activity),
      `${route.averageScore}/10`
    ]))

    console.log(table(tableData, {
      border: getBorderCharacters("norc"),
      columnDefault: {alignment: "center"},
      drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
    }))
  }
}
