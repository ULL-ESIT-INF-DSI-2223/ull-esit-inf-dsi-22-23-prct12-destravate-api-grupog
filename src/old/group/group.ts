import { ActivityType, activityTypeToString } from "../activity_type.js";
import { getBorderCharacters, table } from "table";
import { GroupData } from "./group_data.js";
import RouteHistoryGroup from "./route_history_group.js";

/**
 * Group class represents a Group in the application.
 */
export default class Group {
  public id: string;
  public name: string;
  public participants: string[];
  public favoriteRoutes: string[];
  public routeHistory: RouteHistoryGroup[];
  public createdBy: string;
  public activity: ActivityType;

  /**
   * Creates a new Group object from the data provided.
   * @param id Group ID.
   * @param name Name of the group.
   * @param participants List of participants of the group.
   * @param favoriteRoutes List of favorite routes of the group.
   * @param routeHistory Historic data of the routes done by the group.
   * @param createdBy Owner ID.
   * @param activity Activity type of the group.
   */
  constructor(id: string, name: string, participants: string[], favoriteRoutes: string[], routeHistory: RouteHistoryGroup[], createdBy: string, activity: ActivityType) { 
    this.id = id;
    this.name = name;
    this.participants = participants;
    this.favoriteRoutes = favoriteRoutes;
    this.routeHistory = routeHistory;
    this.createdBy = createdBy;
    this.activity = activity;
  }

  /**
   * parse function parses a Group object from GroupData.
   * @param data Data to parse into a Group object.
   * @returns The group object generated using the data provided.
   */
  static parse(data: GroupData): Group {
    return new Group(
      data.id,
      data.name,
      data.participants,
      data.favoriteRoutes,
      data.routeHistory,
      data.createdBy,
      data.activity
    )
  }

  /**
   * weeklyGroupKmStatistics return the sum of kms of the routes done by the group in the last 7 days.
   * @returns Sum of kms done by the group in the last 7 days.
   */
  weeklyGroupKmStatistics(): number {
    const todaysDate = new Date();
    const oneWeekLess = new Date();
    oneWeekLess.setDate(todaysDate.getDate() - 7);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneWeekLess ? route.kms : 0), 0)
  }

  /**
   * weeklyGroupSlopeStatistics return the sum of meters changed in the routes done by the group in the last 7 days.
   * @returns Sum of meters changed by the group in the last 7 days.
   */
  weeklyGroupSlopeStatistics(): number {
    const todaysDate = new Date();
    const oneWeekLess = new Date();
    oneWeekLess.setDate(todaysDate.getDate() - 7);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneWeekLess ? route.averageSlope : 0), 0)
  }

  /**
   * monthlyGroupKmStatistics return the sum of kms of the routes done by the group in the last 30 days.
   * @returns Sum of kms done by the group in the last 30 days.
   */
  monthlyGroupKmStatistics(): number {
    const todaysDate: Date = new Date();
    const oneMonthLess = new Date();
    oneMonthLess.setDate(todaysDate.getDate() - 30);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneMonthLess ? route.kms : 0), 0)
  }

  /**
   * monthlyGroupSlopeStatistics return the sum of meters changed in the routes done by the group in the last 30 days.
   * @returns Sum of meters changed by the group in the last 30 days.
   */
  monthlyGroupSlopeStatistics(): number {
    const todaysDate: Date = new Date();
    const oneMonthLess = new Date();
    oneMonthLess.setDate(todaysDate.getDate() - 30);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneMonthLess ? route.averageSlope : 0), 0)
  }

  /**
   * monthlyGroupKmStatistics return the sum of kms of the routes done by the group in the last 365 days.
   * @returns Sum of kms done by the group in the last 365 days.
   */
  yearlyGroupKmStatistics(): number {
    const todaysDate: Date = new Date();
    const oneYearLess = new Date();
    oneYearLess.setDate(todaysDate.getDate() - 365);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneYearLess ? route.kms : 0), 0)
  }

  /**
   * monthlyGroupSlopeStatistics return the sum of meters changed in the routes done by the group in the last 365 days.
   * @returns Sum of meters changed by the group in the last 365 days.
   */
  yearlyGroupSlopeStatistics(): number {
    const todaysDate: Date = new Date();
    const oneYearLess = new Date();
    oneYearLess.setDate(todaysDate.getDate() - 365);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneYearLess ? route.averageSlope : 0), 0)
  }

  /**
   * top3UsersByAccDistance returns the top 3 users of the group sorted by most kms.
   * @returns Top 3 users of the group (based in kms)
   */
  top3UsersByAccDistance(): string[] {
    return this.top3UsersByField("kms")
  }

  /**
   * top3UsersByAccSlope returns the top 3 users of the group sorted by most accumulated slope.
   * @returns Top 3 users of the group (based in accumulated slope)
   */
  top3UsersByAccSlope(): string[] {
    return this.top3UsersByField("averageSlope")
  }

  /**
   * top3UsersByField returns the top 3 users of the group sorted by the field provided (descending).
   * @returns Top 3 users of the group (based in the field provided, descending)
   */
  top3UsersByField(field: string): string[] {
    return Array.from(this.routeHistory.reduce((acc, val) => {
      val.participants.forEach(userID => {
        let userAcc = acc.get(userID);
        if (!userAcc) {
          userAcc = 0
        }
        acc.set(userID, userAcc + (val as never)[field]);
      });
      return acc
    }, new Map<string, number>())).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
  }

  /**
   * printTable prints a table containing the list of groups provided.
   * @param list List of groups to print.
   */
  static printTable(list: Group[]): void {
    const tableData = [[
      "Identificador",
      "Nombre",
      "Participantes",
      "Total Km Semanales",
      "Total Km Mensuales",
      "Total Km Anuales",
      "Total de Elevacion semanal",
      "Total de Elevacion mensual",
      "Total de Elevacion anual",
      "Rutas Favoritas",
      "Historial de rutas",
      "Creador",
      "Actividad",
    ]] as unknown[][]
  
    list.forEach(group => tableData.push([
      group.id,
      group.name,
      group.participants.map((participant) => participant),
      group.weeklyGroupKmStatistics(),
      group.weeklyGroupSlopeStatistics(),
      group.monthlyGroupKmStatistics(),
      group.monthlyGroupSlopeStatistics(),
      group.yearlyGroupKmStatistics(),
      group.yearlyGroupSlopeStatistics(),
      group.favoriteRoutes.map((route) => route),
      group.routeHistory.map((route) => route.routeId),
      group.createdBy,
      activityTypeToString(group.activity),
    ]))

    console.log(table(tableData, {
      border: getBorderCharacters("norc"),
      columnDefault: {alignment: "center"},
      drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
    }))
  }

  /**
   * printTableLessInfo is a method that prints a new table only with basic information
   * of the groups that are provided
   * @param list List of groups to print.
   */
  static printTableLessInfo(list: Group[]): void {
    const tableData = [[
      "Identificador",
      "Nombre",
      "Participantes",
      "Rutas Favoritas",
      "Historial de rutas",
      "Creador",
      "Actividad",
    ]] as unknown[][]
  
    list.forEach(group => tableData.push([
      group.id,
      group.name,
      group.participants.map((participant) => participant),
      group.favoriteRoutes.map((route) => route),
      group.routeHistory.map((route) => route.routeId),
      group.createdBy,
      activityTypeToString(group.activity),
    ]))

    console.log(table(tableData, {
      border: getBorderCharacters("norc"),
      columnDefault: {alignment: "center"},
      drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
    }))
  }
}
