/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from "crypto"
import inquirer from "inquirer";
import Database from "../../db/database.js";
import User from "../../user/user.js";
import { UserData } from "../../user/user_data.js";
import { hashPassword, passwordMatches } from "../../utils/password.js";
import { activityTypes, users } from "../choices.js";

export default class SessionManager {
  private db: Database
  private user: UserData | null
  /**
   * Creates a new SessionManager using the Database provided.
   * @param db Database to use.
   */
  constructor(db: Database) {
    this.db = db
    this.user = null
  }

  /**
   * 
   */
  async checkSession(): Promise<void> {
    for (let firstTry = true; !this.user; firstTry = false) {
      if (!firstTry) {
        console.log("¡Credenciales inválidas!")
      }

      this.user = await ((this as any)[(await inquirer.prompt([{
        type: "list",
        name: "callable",
        message: "Elija una acción:",
        choices: [
          {name: "Iniciar sesión", value: "login"},
          {name: "Registrarse", value: "register"},
        ]
      }])).callable]())
    }
  }
  /**
   * Returns the session's user
   * @returns 
   */
  currentUser(): UserData|null {
    return this.user ? this.user : null
  }
  /**
   * Checks if the sessions's user is Admin
   * @returns 
   */
  isAdmin(): boolean {
    return (!!this.user) && this.user.isAdmin
  }

  /**
   * Logout the session's user
   */
  logout(): void {
    this.user = null
  }

  refresh(): void {
    if (!this.user) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = this.db.userData().find(user => user.id === this.user!.id)
    this.user = user ? user : null
  }

  /**
   * With this function you can log in as a user. You have to introduce your password
   * @returns 
   */
  protected async login(): Promise<UserData|null> {
    const credentials = await inquirer.prompt([
      {
        type: "list",
        name: "user",
        message: "Iniciar sesión como usuario:",
        choices: users(this.db)
      },
      {
        type: "password",
        name: "pass",
        message: "Contraseña:",
        mask: "*"
      },
    ])
    
    const user = this.db.userData().find(user => user.id === credentials.user)
    if (!user) {
      throw new Error(`somehow a non existing user ID (${credentials.user}) was chosen`);
    }

    if (passwordMatches(credentials.pass, user.passwordHash)) {
      return user
    }
    return null
  }

  /**
   * Function to register a user, create it and add it to the database
   * @returns 
   */
  protected async register(): Promise<UserData|null> {
    const { id, name, pass, activity } = await inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "Defina su ID de usuario:",
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
      },
      {
        type: "input",
        name: "name",
        message: "Defina su nombre de usuario:",
        validate: (input: string) => input !== "" ? true : "El nombre no puede estar vacío"
      },
      {
        type: "password",
        name: "pass",
        message: "Introduzca su contraseña:",
        mask: "*",
        validate: (p: string) => p.length >= 4 ? true : "La contraseña debe contener al menos 4 carácteres",
      },
      {
        type: "list",
        name: "activity",
        message: "Seleccione el tipo de actividad que va a realizar:",
        choices: activityTypes()
      },
    ])

    const data: UserData = {
      id,
      name,
      activity,
      isAdmin: false,
      passwordHash: hashPassword(pass),
      friends: [],
      groupFriends: [],
      favoriteRoutes: [],
      activeChallenges: [],
      routeHistory: []
    }
    this.db.addUser(User.parse(data))
    return data
  }
}
