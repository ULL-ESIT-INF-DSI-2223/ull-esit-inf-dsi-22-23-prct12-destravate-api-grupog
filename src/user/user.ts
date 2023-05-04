import { ActivityType, activityTypeToString } from "../activity_type.js";
import { getBorderCharacters, table } from "table";
import RouteHistory from "./route_history.js";
import { UserData } from "./user_data.js";

/**
 * User class represents a user in the app.
 */
export default class User {
  public id: string; 
  public name: string;
  public friends: string[];
  public groupFriends: string[]
  public favoriteRoutes: string[];
  public activeChallenges: string[];
  public routeHistory: RouteHistory[];
  public activity: ActivityType;
  public passwordHash: string;
  public isAdmin: boolean;

  /**
   * Creates a new User with the data provided.
   * @param id User ID.
   * @param name User name.
   * @param friends List of friends of the user.
   * @param groupFriends Group of friends of the user.
   * @param favoriteRoutes List of favorite routes of the user.
   * @param activeChallenges List of active challenge IDs of the user.
   * @param routeHistory Historic data of the routes done by the user.
   * @param activity Activity type the user do.
   * @param passwordHash Hash of the user's password.
   * @param isAdmin Whether the user is admin or not.
   */
  constructor(id: string, name: string, friends: string[], groupFriends: string[], favoriteRoutes: string[], activeChallenges: string[], routeHistory: RouteHistory[], activity: ActivityType, passwordHash: string, isAdmin: boolean) {
    this.id = id;
    this.name = name;
    this.friends = friends;
    this.groupFriends = groupFriends;
    this.favoriteRoutes = favoriteRoutes;
    this.activeChallenges = activeChallenges;
    this.routeHistory = routeHistory;
    this.activity = activity;
    this.passwordHash = passwordHash;
    this.isAdmin = isAdmin;
  }

  /**
   * parse function parses the UserData provided into a new User.
   * @param data Raw UserData.
   * @returns User created by the data provided.
   */
  static parse(data: UserData): User {
    return new User(
      data.id,
      data.name,
      data.friends,
      data.groupFriends,
      data.favoriteRoutes,
      data.activeChallenges,
      data.routeHistory.map(data => RouteHistory.parse(data)),
      data.activity,
      data.passwordHash,
      data.isAdmin
    )
  }

  /**
   * weeklyKmStatistics return the sum of kms of the routes done by the user in the last 7 days.
   * @returns Sum of kms done by the user in the last 7 days.
   */
  weeklyKmStatistics(): number {
    const todaysDate: Date = new Date();
    const oneWeekLess = new Date();
    oneWeekLess.setDate(todaysDate.getDate() - 7);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneWeekLess ? route.kms : 0), 0)
  }

  /**
   * weeklySlopeStatistics return the sum of meters changed in the routes done by the user in the last 7 days.
   * @returns Sum of meters changed by the user in the last 7 days.
   */
  weeklySlopeStatistics(): number {
    const todaysDate: Date = new Date();
    const oneWeekLess = new Date();
    oneWeekLess.setDate(todaysDate.getDate() - 7);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneWeekLess ? route.averageSlope : 0), 0)
  }

  /**
   * monthlyKmStatistics return the sum of kms of the routes done by the user in the last 30 days.
   * @returns Sum of kms done by the user in the last 30 days.
   */
  monthlyKmStatistics(): number {
    const todaysDate: Date = new Date();
    const oneMonthLess = new Date();
    oneMonthLess.setDate(todaysDate.getDate() - 30);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneMonthLess ? route.kms : 0), 0)
  }

  /**
   * monthlySlopeStatistics return the sum of meters changed in the routes done by the user in the last 30 days.
   * @returns Sum of meters changed by the user in the last 30 days.
   */
  monthlySlopeStatistics(): number {
    const todaysDate: Date = new Date();
    const oneMonthLess = new Date();
    oneMonthLess.setDate(todaysDate.getDate() - 30);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneMonthLess ? route.averageSlope : 0), 0)
  }

  /**
   * yearlyKmStatistics return the sum of kms of the routes done by the user in the last 365 days.
   * @returns Sum of kms done by the user in the last 365 days.
   */
  yearlyKmStatistics(): number {
    const todaysDate: Date = new Date();
    const oneYearLess = new Date();
    oneYearLess.setDate(todaysDate.getDate() - 365);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneYearLess ? route.kms : 0), 0)
  }

  /**
   * yearlySlopeStatistics return the sum of meters changed in the routes done by the user in the last 365 days.
   * @returns Sum of meters changed by the user in the last 365 days.
   */
  yearlySlopeStatistics(): number {
    const todaysDate: Date = new Date();
    const oneYearLess = new Date();
    oneYearLess.setDate(todaysDate.getDate() - 365);
    return this.routeHistory.reduce((acc, route) => acc + (route.date >= oneYearLess ? route.averageSlope : 0), 0)
  }

  /**
   * printTable prints a table containing the list of users provided.
   * @param list List of users to print.
   */
  static printTable(list: User[]): void {
    const tableData = [[
      "Identificador",
      "Nombre",
      "Amigos",
      "Grupos de Amigos",
      "Km Semanales",
      "Elevacion Semanal",
      "Km Mensuales",
      "Elevacion Mensual",
      "Km Anuales",
      "Elevacion Anual",
      "Rutas Favoritas",
      "Retos activos",
      "Historial de rutas",
      "Actividad",
    ]] as unknown[][]

    list.forEach(user => tableData.push([
      user.id,
      user.name,
      user.friends.map((friend) => friend),
      user.groupFriends.map((group) => group),
      user.weeklyKmStatistics(),
      user.weeklySlopeStatistics(),
      user.monthlyKmStatistics(),
      user.monthlySlopeStatistics(),
      user.yearlyKmStatistics(),
      user.yearlySlopeStatistics(),
      user.favoriteRoutes.map((route) => route),
      user.activeChallenges.map((challenge) => challenge),
      user.routeHistory.map((route) => route.routeId),
      activityTypeToString(user.activity),
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
   * @param list List of users to print.
   */
  static printTableLessInfo(list: User[]): void {
    const tableData = [[
      "Identificador",
      "Nombre",
      "Amigos",
      "Grupos de Amigos",
      "Rutas Favoritas",
      "Retos activos",
      "Historial de rutas",
      "Actividad",
    ]] as unknown[][]

    list.forEach(user => tableData.push([
      user.id,
      user.name,
      user.friends.map((friend) => friend),
      user.groupFriends.map((group) => group),
      user.favoriteRoutes.map((route) => route),
      user.activeChallenges.map((challenge) => challenge),
      user.routeHistory.map((route) => route.routeId),
      activityTypeToString(user.activity),
    ]))

    console.log(table(tableData, {
      border: getBorderCharacters("norc"),
      columnDefault: {alignment: "center"},
      drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
    }))
  }
}
