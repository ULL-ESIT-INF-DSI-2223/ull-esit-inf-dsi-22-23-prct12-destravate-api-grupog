import Database from "../../db/database.js";
import Group from "../../group/group.js"
import SessionManager from "./session_manager.js";
import Route from "../../route/route.js";
import User from "../../user/user.js";
import { getBorderCharacters, table } from "table";

/**
 * Class made to manage all the functionalities in which something must be printed on the screen for regular users.
 */
export default class PrintManager {
  /**
   * Creates a new Manager using the database provided.
   * @param db Database to use.
   */
  constructor(private db: Database) {}

  /**
   * Method to print all the groups on the system
   */
  printGroups(): void {
    const groups = this.db.groups().slice();
    Group.printTableLessInfo(groups);
  }

  /**
   * Method to print all the routes on the system
   */
  printRoutes(): void {
    const routes = this.db.routes().slice();
    Route.printTable(routes);
  }

  /**
   * Method to print all the users on the system
   */
  printUsers(): void {
    const users = this.db.users().slice();
    User.printTableLessInfo(users);
  }

  /**
   * Method to print from each group the TOP 3 user
   * using the km acumulated.
   */
  printTop3UsersKm(): void {
    const groups = this.db.groups().slice();
    groups.forEach((group) => {
      const topUsers = group.top3UsersByAccDistance();
      const tableData = [[
        "Grupo",
        "Numero 1",
        "Numero 2",
        "Numero 3"
      ]] as unknown[][]

      tableData.push([
        group.name,
        topUsers[0],
        topUsers[1],
        topUsers[2]
      ])

      console.log(table(tableData, {
        border: getBorderCharacters("norc"),
        columnDefault: {alignment: "center"},
        drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
      }))
    })
  }

  /**
   * Method to print from each group the TOP 3 user
   * using the slope acumulated.
   */
  printTop3UsersSlope(): void {
    const groups = this.db.groups().slice();
    groups.forEach((group) => {
      const topUsers = group.top3UsersByAccSlope();
      const tableData = [[
        "Grupo",
        "Numero 1",
        "Numero 2",
        "Numero 3"
      ]] as unknown[][]

      tableData.push([
        group.name,
        topUsers[0],
        topUsers[1],
        topUsers[2]
      ])

      console.log(table(tableData, {
        border: getBorderCharacters("norc"),
        columnDefault: {alignment: "center"},
        drawHorizontalLine: (lineIndex: number, rowCount: number) => lineIndex < 2 || lineIndex === rowCount
      }))
    })
  }
}
