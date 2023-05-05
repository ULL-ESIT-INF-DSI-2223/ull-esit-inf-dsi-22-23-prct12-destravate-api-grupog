import inquirer from "inquirer";
import Database from "../../db/database.js";
import ChallengePrompter from "../challenge_prompter.js";
import GroupPrompter from "../group_prompter.js";
import Prompter from "../prompter.js";
import RoutePrompter from "../route_prompter.js";
import UserPrompter from "../user_prompter.js";
import SessionManager from "./session_manager.js";

/**
 * Class to manage all the things that a admin should be able to do
 */
export default class AdminManager {
  protected challenge: Prompter
  protected group: Prompter
  protected route: Prompter
  protected session: SessionManager
  protected user: Prompter

  /**
   * Creates a new AdminManager using the DB and SessionManager provided.
   * @param db Database to use.
   * @param session SessionManager to use..
   */
  constructor(db: Database, session: SessionManager) {
    this.challenge = new ChallengePrompter(db)
    this.group = new GroupPrompter(db)
    this.route = new RoutePrompter(db)
    this.session = session
    this.user = new UserPrompter(db)
  }

  /**
   * main methods is the main menu provided by this manager.
   */
  async main(): Promise<void> {
    for (;;) {
      if (!this.session.isAdmin()) {
        return;
      }

      const { operation } = await inquirer.prompt([{
        type: "list",
        name: "operation",
        message: "Menú de administración",
        choices: [
          {name: "Añadir nueva ruta", value: "addRoute"},
          {name: "Añadir nuevo grupo", value: "addGroup"},
          {name: "Añadir nuevo reto", value: "addChallenge"},
          {name: "Añadir nuevo usuario", value: "addUser"},
          {name: "Borrar grupos", value: "deleteGroups"},
          {name: "Borrar retos", value: "deleteChallenges"},
          {name: "Borrar rutas", value: "deleteRoutes"},
          {name: "Borrar usuarios", value: "deleteUsers"},
          {name: "Editar grupo", value: "editGroup"},
          {name: "Editar reto", value: "editChallenge"},
          {name: "Editar ruta", value: "editRoute"},
          {name: "Editar usuario", value: "editUser"},
          {name: "Ver todas las rutas", value: "printRoutes"},
          {name: "Ver todos los grupos", value: "printGroups"},
          {name: "Ver todos los retos", value: "printChallenges"},
          {name: "Ver todos los usuarios", value: "printUsers"},
          {name: "Volver", value: "back"},
        ]
      }])

      switch (operation) {
        case "addRoute":
          await this.route.add();
          break;
        case "addGroup":
          await this.group.add();
          break;
        case "addChallenge":
          await this.challenge.add();
          break;
        case "addUser":
          await this.user.add();
          break;
        case "deleteGroups":
          await this.group.delete();
          break;
        case "deleteChallenges":
          await this.challenge.delete();
          break;
        case "deleteRoutes":
          await this.route.delete();
          break;
        case "deleteUsers":
          await this.user.delete();
          this.session.refresh();
          break;
        case "editGroup":
          await this.group.edit();
          break;
        case "editChallenge":
          await this.challenge.edit();
          break;
        case "editRoute":
          await this.route.edit();
          break;
        case "editUser":
          await this.user.edit();
          this.session.refresh();
          break;
        case "printRoutes":
          await this.route.print();
          break;
        case "printGroups":
          await this.group.print();
          break;
        case "printChallenges":
          await this.challenge.print();
          break;
        case "printUsers":
          await this.user.print();
          break;
        case "back":
          return;
        default:
          throw new Error(`unexpected operation: ${operation}`);
      }
    }
  }
}
