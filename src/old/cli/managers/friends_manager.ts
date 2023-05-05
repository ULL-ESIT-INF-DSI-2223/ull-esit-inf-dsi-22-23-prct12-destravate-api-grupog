import inquirer from "inquirer";
import Database from "../../db/database.js";
import { users } from "../choices.js";
import SessionManager from "./session_manager.js";

export default class FriendsManager {
  /**
   * Constructor creates a new FriendsManager object using the DB and Session managers provided.
   * @param db Database to use.
   * @param session SessionManager to use.
   */
  constructor(private db: Database, private session: SessionManager) {}
  /**
   * This function changes a user's friend list. You can add or remove friends from the potential ones in the database
   */
  async edit(): Promise<void> {
    const user = this.session.currentUser();
    if (!user) {
      return;
    }

    const { friends } = await inquirer.prompt([{
      type: "checkbox",
      name: "friends",
      message: `Selecione los amigos a añadir o eliminar:`,
      default: user.friends,
      choices: users(this.db),
    }]);

    user.friends = friends;
    await this.db.setUser(user);
    this.session.refresh();
  }
}
