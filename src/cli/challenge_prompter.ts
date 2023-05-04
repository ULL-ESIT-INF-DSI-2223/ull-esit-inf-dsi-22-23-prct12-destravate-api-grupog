import inquirer from "inquirer";
import Database from "../db/database.js";
import Challenge from "../challenge/challenge.js";
import { compareStringsFirstIgnoringCase } from "../utils/sort_func.js";
import Prompter from "./prompter.js";
import { activityTypes, challenges, routes, users } from "./choices.js";

/**
 * ChallengePrompter creates a new Prompter object for the Challenges. It can manage user input related to this class.
 */
export default class ChallengePrompter extends Prompter {
  /**
   * constructor creates a new prompter using the Database provided.
   * @param db Database for querying during prompts.
   */
  constructor(db: Database) {
    super(db);
  }

  /**
   * add creates a new Challenge from the user inputs and adds it to the database.
   */
  async add(): Promise<void> {
    await this.db.addChallenge(await this.dataPrompt());
  }

  /**
   * delete removes multiple Challenges from the database based on the user input.
   */
  async delete(): Promise<void> {
    (
      await inquirer.prompt([
        {
          type: "checkbox",
          name: "challenges",
          message: "Seleccione los retos que desea borrar:",
          choices: challenges(this.db),
        },
      ])
    ).challenges.forEach(
      async (id: string) => await this.db.deleteChallenge(id)
    );
  }

  /**
   * edit modifies a Challenge from the database based on the user input.
   */
  async edit(): Promise<void> {
    const { challengeID } = await inquirer.prompt([
      {
        type: "list",
        name: "challengeID",
        message: "Seleccione el reto a editar:",
        choices: challenges(this.db),
      },
    ]);

    const c = this.db.challenges().find((c) => c.id === challengeID);
    if (!c) {
      throw new Error(`somehow a non existing ID (${challengeID}) was chosen`);
    }

    await this.db.setChallenge(
      await this.dataPrompt({
        id: c.id,
        name: c.name,
        userIds: c.userIds,
        routes: c.routes,
        activityType: c.activity,
      })
    );
  }

  /**
   * print shows the list of challenges contained in the database, sorted by the criteria defined by the user.
   */
  async print(): Promise<void> {
    // Let user select sort function
    const { sortFunc } = await inquirer.prompt([
      {
        type: "list",
        name: "sortFunc",
        message: "¿Desea aplicar un criterio de ordenación?",
        choices: [
          { name: "No", value: undefined },
          {
            name: "Nombre",
            value: (a: Challenge, b: Challenge) =>
              compareStringsFirstIgnoringCase(a.name, b.name),
          },
          {
            name: "Número de rutas que tiene el reto",
            value: (a: Challenge, b: Challenge) =>
              a.routes.length - b.routes.length,
          },
          {
            name: "Longitud",
            value: (a: Challenge, b: Challenge) => a.totalKm - b.totalKm,
          },
          {
            name: "Número de usuarios lo están haciendo",
            value: (a: Challenge, b: Challenge) =>
              a.userIds.length - b.userIds.length,
          },
          {
            name: "Tipo de Actividad",
            value: (a: Challenge, b: Challenge) => a.activity - b.activity,
          },
        ],
      },
    ]);

    // Do shallow copy to avoid modifying DB while still being performant
    const challenges = this.db.challenges().slice();

    if (sortFunc) {
      // Apply sort function and ask if want reverse order
      challenges.sort(sortFunc);
      if (
        (
          await inquirer.prompt([
            {
              type: "list",
              name: "reverse",
              message: "¿En qué sentido?",
              choices: [
                { name: "Ascendente", value: false },
                { name: "Descendente", value: true },
              ],
            },
          ])
        ).reverse
      ) {
        challenges.reverse();
      }
    }

    // Print
    Challenge.printTable(challenges);

    // Pause
    await inquirer.prompt([
      {
        type: "input",
        name: ".",
        message: "Pulse Enter para continuar...",
      },
    ]);
  }

  /**
   * dataPrompt prompts the user for a Challenge's data, using the defaults values if provided.
   * @param defaults Default values for each field.
   * @returns A new challenge created from the user input.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async dataPrompt(defaults?: any): Promise<Challenge> {
    if (!defaults) {
      defaults = { id: "" };
    }

    const input = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Defina el nombre del reto:",
        default: defaults.name,
        validate: (input: string) => {
          if (input === "") {
            return "El nombre no puede estar vacío";
          }
          if (
            this.db
              .challenges()
              .findIndex((challenge) => challenge.name === input) >= 0
          ) {
            return "Ya existe un reto con este nombre";
          } else {
            return true;
          }
        },
      },
      {
        type: "checkbox",
        name: "routes",
        message: "Seleccione las rutas que tendrá el reto:",
        default: defaults.routes,
        choices: routes(this.db),
      },
      {
        type: "checkbox",
        name: "userIds",
        message: "Seleccione los usuarios que han realizado el reto:",
        default: defaults.userIds,
        choices: users(this.db),
      },
      {
        type: "list",
        name: "activityType",
        message: "Seleccione el tipo de actividad del reto:",
        default: defaults.activityType,
        choices: activityTypes(),
      },
    ]);

    return new Challenge(
      defaults.id,
      input.name,
      input.routes.map((routeID: string) =>
        this.db.routes().find((route) => route.id === routeID)
      ),
      input.userIds,
      input.activityType
    );
  }
}
