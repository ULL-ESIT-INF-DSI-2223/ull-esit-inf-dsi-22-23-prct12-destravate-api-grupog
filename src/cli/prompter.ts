import Database from "../db/database.js";

/**
 * Prompter represents the basic prompter for a given class.
 */
export default abstract class Prompter {
  /**
   * constructor creates a new prompter using the Database provided.
   * @param db Database for querying during prompts.
   */
  constructor(protected db: Database) {}

  /**
   * add creates a new object of the prompter type.
   */
  abstract add(): Promise<void>

  /**
   * delete removes multiple object of the prompter type from the database.
   */
  abstract delete(): Promise<void>

  /**
   * edit modifies an object of the prompter type from the database.
   */
  abstract edit(): Promise<void>

  /**
   * print shows the list of objects of the prompter type contained in the database, sorted by the criteria defined by
   * the user.
   */
  abstract print(): Promise<void>
}
