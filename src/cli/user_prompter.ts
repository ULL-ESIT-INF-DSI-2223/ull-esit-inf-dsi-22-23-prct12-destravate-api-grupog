import { randomUUID } from "crypto"
import inquirer from "inquirer";
import Database from "../db/database.js";
import User from "../user/user.js";
import { compareStringsFirstIgnoringCase } from "../utils/sort_func.js";
import Prompter from "./prompter.js";
import { activityTypes, routes, users, groups, challenges } from "./choices.js";
import { appName } from "../consts.js";
import RouteHistory from "../user/route_history.js";
import { hashPassword } from "../utils/password.js";
import { promptForRouteHistory } from "./route_history_helper.js";

/**
 * UserPrompter creates a new Prompter object for the User. It can manage user input related to this class.
 */
export default class UserPrompter extends Prompter {
  /**
   * constructor creates a new prompter using the Database provided.
   * @param db Database for querying during prompts.
   */
  constructor(db: Database) {
    super(db)
  }

  /**
   * add creates a new User from the user inputs and adds it to the database.
   */
  async add(): Promise<void> {
    await this.db.addUser(await this.dataPrompt())
  }

  /**
   * delete removes multiple Users from the database based on the user input.
   */
  async delete(): Promise<void> {
    (await inquirer.prompt([{
      type: "checkbox",
      name: "users",
      message: "Seleccione los usuarios que desea borrar:",
      choices: users(this.db)
    }])).users.forEach(async (id: string) => await this.db.deleteUser(id));
  }

  /**
   * edit modifies a User from the database based on the user input.
   */
  async edit(): Promise<void> {
    const { userID } = (await inquirer.prompt([{
      type: "list",
      name: "userID",
      message: "Seleccione el usuario a editar:",
      choices: users(this.db)
    }]))

    const u = this.db.users().find(u => u.id === userID)
    if (!u) {
      throw new Error(`somehow a non existing user ID (${userID}) was chosen`);
    }

    await this.db.setUser(await this.dataPrompt({
      id: u.id,
      name: u.name,
      friends: u.friends,
      groupFriends: u.groupFriends,
      favouriteRoutes: u.favoriteRoutes,
      activeChallenges: u.activeChallenges,
      routeHistory: u.routeHistory,
      activity: u.activity,
      passwordHash: u.passwordHash,
      isAdmin: u.isAdmin
    }))
  }

  /**
   * print shows the list of users contained in the database, sorted by the criteria defined by the user.
   */
  async print(): Promise<void> {
    // Let user select sort function
    const { sortFunc } = await inquirer.prompt([{
      type: "list",
      name: "sortFunc",
      message: "¿Desea aplicar un criterio de ordenación?",
      choices: [
        {name: "No", value: undefined},
        {name: "Nombre", value: (a: User, b: User) => compareStringsFirstIgnoringCase(a.name, b.name)},
        {name: "Estadisticas en Km semanales", value: (a: User, b: User) => a.weeklyKmStatistics() - b.weeklyKmStatistics()},
        {name: "Estadisticas en elevación semanales", value: (a: User, b: User) => a.weeklySlopeStatistics() - b.weeklySlopeStatistics()},
        {name: "Estadisticas en Km mensuales", value: (a: User, b: User) => a.monthlyKmStatistics() - b.monthlyKmStatistics()},
        {name: "Estadisticas en elevación mensuales", value: (a: User, b: User) => a.monthlySlopeStatistics() - b.monthlySlopeStatistics()},
        {name: "Estadisticas en Km anuales", value: (a: User, b: User) => a.yearlyKmStatistics() - b.yearlyKmStatistics()},
        {name: "Estadisticas en elevación anuales", value: (a: User, b: User) => a.yearlySlopeStatistics() - b.yearlySlopeStatistics()},
        {name: "Tipo de Actividad", value: (a: User, b: User) => a.activity - b.activity},
      ]
    }])
    
    // Do shallow copy to avoid modifying DB while still being performant
    const users = this.db.users().slice()

    if (sortFunc) {
      // Apply sort function and ask if want reverse order
      users.sort(sortFunc)
      if ((await inquirer.prompt([{
        type: "list",
        name: "reverse",
        message: "¿En qué sentido?",
        choices: [
          {name: "Ascendente", value: false},
          {name: "Descendente", value: true},
        ]
      }])).reverse) {
        users.reverse()
      }
    }

    // Print
    User.printTable(users)

    // Pause
    await inquirer.prompt([{
      type: "input",
      name: ".",
      message: "Pulse Enter para continuar..."
    }])
  }

  /**
   * dataPrompt prompts the user for a User's data, using the defaults values if provided.
   * @param defaults Default values for each field.
   * @returns A new user created from the user input.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async dataPrompt(defaults?: any): Promise<User> {
    const defaultWasNotDefined = !defaults
    if (defaultWasNotDefined) {
      defaults = {}
    }

    const questions = [
      {
        type: "input",
        name: "name",
        message: "Defina el nombre del usuario:",
        default: defaults.name,
        validate: (input: string) => input !== "" ? true : "El nombre no puede estar vacío"
      },
      {
        type: "checkbox",
        name: "friends",
        message: `Indique sus amigos en ${appName}:`,
        default: defaults.userIds,
        choices: users(this.db)
      },
      {
        type: "checkbox",
        name: "groupFriends",
        message: `Indique sus grupos de amigos en ${appName}:`,
        default: defaults.groupFriends,
        choices: groups(this.db)
      },
      {
        type: "checkbox",
        name: "favoriteRoutes",
        message: "Indique sus rutas favoritas:",
        default: defaults.favoriteRoutes,
        choices: routes(this.db)
      },
      {
        type: "checkbox",
        name: "activeChallenges",
        message: "Indique los retos que quieres activar: ",
        default: defaults.activeChallenges,
        choices: challenges(this.db)
      },
      {
        type: "list",
        name: "activity",
        message: "Seleccione el tipo de actividad que vas a realizar:",
        default: defaults.activityType,
        choices: activityTypes()
      },
      {
        type: "password",
        name: "password",
        message: `Introduzca una contraseña para el usuario${defaults.passwordHash ? " (dejar en blanco para no modificar)" : ""}:`,
        mask: "*",
        validate: (p: string) => defaults.passwordHash || p !== ""
      },
      {
        type: "confirm",
        name: "isAdmin",
        message: "¿Dar permisos de administración al usuario?",
        default: defaults.isAdmin
      },
      {
        type: "checkbox",
        name: "routeIDs",
        message: "Indica las rutas que has terminado:",
        default: defaults.routeHistory?.map((rh: RouteHistory) => rh.routeId),
        choices: routes(this.db)
      }
    ] as unknown[]

    if (defaultWasNotDefined) {
      questions.unshift({
        type: "input",
        name: "id",
        message: "Defina el ID del usuario:",
        default: randomUUID(),
        validate: (id: string) => {

          if (id === "") {
            return "El ID no puede estar vacío"
          }

          if (this.db.users().findIndex(user => user.id === id) >= 0) {
            return "Ya existe un usuario con este ID"
          }

          return true
        } 
      })
    }

    const input = await inquirer.prompt(questions)
    
    return new User(
      input.id,
      input.name,
      input.friends,
      input.groupFriends,
      input.favoriteRoutes,
      input.activeChallenges,
      await promptForRouteHistory(this.db, input.routeIDs, input.routeHistory),
      input.activity,
      input.password === "" ? defaults.passwordHash : hashPassword(input.password),
      input.isAdmin
    )
  }
}
