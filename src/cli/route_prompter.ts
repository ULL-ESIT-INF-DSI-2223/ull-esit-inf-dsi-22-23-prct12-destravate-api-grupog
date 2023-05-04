import inquirer from "inquirer";
import Database from "../db/database.js";
import Coordinates from "../route/coordinates.js";
import Route from "../route/route.js";
import { compareStringsFirstIgnoringCase } from "../utils/sort_func.js";
import Prompter from "./prompter.js";
import { activityTypes, routes, users } from "./choices.js";

/**
 * RoutePrompter creates a new Prompter object for the Routes. It can manage user input related to this class.
 */
export default class RoutePrompter extends Prompter {
  /**
   * constructor creates a new prompter using the Database provided.
   * @param db Database for querying during prompts.
   */
  constructor(db: Database) {
    super(db)
  }

  /**
   * add creates a new Route from the user inputs and adds it to the database.
   */
  async add(): Promise<void> {
    await this.db.addRoute(await this.dataPrompt())
  }

  /**
   * delete removes multiple Routes from the database based on the user input.
   */
  async delete(): Promise<void> {
    (await inquirer.prompt([{
      type: "checkbox",
      name: "routes",
      message: "Seleccione las ruta que desea borrar:",
      choices: routes(this.db)
    }])).routes.forEach(async (id: string) => await this.db.deleteRoute(id));
  }

  /**
   * edit modifies a Route from the database based on the user input.
   */
  async edit(): Promise<void> {
    const { routeID } = (await inquirer.prompt([{
      type: "list",
      name: "routeID",
      message: "Seleccione la ruta a editar:",
      choices: routes(this.db)
    }]))

    const r = this.db.routes().find(r => r.id === routeID)
    if (!r) {
      throw new Error(`somehow a non existing route ID (${routeID}) was chosen`);
    }

    await this.db.setRoute(await this.dataPrompt({
      id: r.id,
      name: r.name,
      startLatitude: r.start.latitude,
      startLongitude: r.start.longitude,
      startMOSL: r.start.mosl,
      endLatitude: r.end.latitude,
      endLongitude: r.end.longitude,
      endMOSL: r.end.mosl,
      distanceKm: r.distanceKm,
      averageSlope: r.averageSlope,
      userIds: r.userIds,
      activityType: r.activity,
      averageScore: r.averageScore
    }))
  }

  /**
   * print shows the list of routes contained in the database, sorted by the criteria defined by the user.
   */
  async print(): Promise<void> {
    // Let user select sort function
    const { sortFunc } = await inquirer.prompt([{
      type: "list",
      name: "sortFunc",
      message: "¿Desea aplicar un criterio de ordenación?",
      choices: [
        {name: "No", value: undefined},
        {name: "Nombre", value: (a: Route, b: Route) => compareStringsFirstIgnoringCase(a.name, b.name)},
        {name: "Número de usuarios que la han hecho", value: (a: Route, b: Route) => a.userIds.length - b.userIds.length},
        {name: "Longitud", value: (a: Route, b: Route) => a.distanceKm - b.distanceKm},
        {name: "Calificación media", value: (a: Route, b: Route) => a.averageScore - b.averageScore},
        {name: "Tipo de Actividad", value: (a: Route, b: Route) => a.activity - b.activity},
      ]
    }])
    
    // Do shallow copy to avoid modifying DB while still being performant
    const routes = this.db.routes().slice()

    if (sortFunc) {
      // Apply sort function and ask if want reverse order
      routes.sort(sortFunc)
      if ((await inquirer.prompt([{
        type: "list",
        name: "reverse",
        message: "¿En qué sentido?",
        choices: [
          {name: "Ascendente", value: false},
          {name: "Descendente", value: true},
        ]
      }])).reverse) {
        routes.reverse()
      }
    }

    // Print
    Route.printTable(routes)

    // Pause
    await inquirer.prompt([{
      type: "input",
      name: ".",
      message: "Pulse Enter para continuar..."
    }])
  }

  /**
   * dataPrompt prompts the user for a Route's data, using the defaults values if provided.
   * @param defaults Default values for each field.
   * @returns A new route created from the user input.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async dataPrompt(defaults?: any): Promise<Route> {
    if (!defaults) {
      defaults = {id: ""}
    }

    const input = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Defina el nombre de la ruta:",
        default: defaults.name,
        validate: (input: string) => input !== "" ? true : "El nombre no puede estar vacío"
      },
      {
        type: "number",
        name: "startLatitude",
        message: "Defina la latitud del punto de inicio de la ruta (positivo = norte, negativo = sur):",
        default: defaults.startLatitude,
        validate: (input: number) => input >= -90 && input <= 90 ? true : "La latitud debe valer entre -90 y 90 grados"
      },
      {
        type: "number",
        name: "startLongitude",
        message: "Defina la longitud del punto de inicio de la ruta (positivo = este, negativo = oeste):",
        default: defaults.startLongitude,
        validate: (input: number) => input >= -180 && input <= 180 ? true : "La longitud debe valer entre -180 y 180 grados"
      },
      {
        type: "number",
        name: "startMOSL",
        message: "Defina los metros sobre el nivel del mar del punto de inicio de la ruta:",
        default: defaults.startMOSL,
        validate: (input: number) => input >= -500 && input <= 10_000 ? true : "La cifra de metros sobre el nivel del mar debe valer entre -500 y 10.000 metros"
      },
      {
        type: "number",
        name: "endLatitude",
        message: "Defina la latitud del punto de finalización de la ruta (positivo = norte, negativo = sur):",
        default: defaults.endLatitude,
        validate: (input: number) => input >= -90 && input <= 90 ? true : "La latitud debe valer entre -90 y 90 grados"
      },
      {
        type: "number",
        name: "endLongitude",
        message: "Defina la longitud del punto de finalización de la ruta (positivo = este, negativo = oeste):",
        default: defaults.endLongitude,
        validate: (input: number) => input >= -180 && input <= 180 ? true : "La longitud debe valer entre -180 y 180 grados"
      },
      {
        type: "number",
        name: "endMOSL",
        message: "Defina los metros sobre el nivel del mar del punto de finalización de la ruta:",
        default: defaults.endMOSL,
        validate: (input: number) => input >= -500 && input <= 10_000 ? true : "La cifra de metros sobre el nivel del mar debe valer entre -500 y 10.000 metros"
      },
      {
        type: "number",
        name: "distanceKm",
        message: "Defina la longitud de la ruta en kilómetros:",
        default: defaults.distanceKm,
        validate: (input: number) => input >= 0 && input <= 41_000 ? true : "La ruta debe medir 0 km como mínimo y 41.000 km como máximo"
      },
      {
        type: "number",
        name: "averageSlope",
        message: "Defina la inclinación media de la ruta (positivo = ascendente, negativo = descendente):",
        default: defaults.averageSlope,
        validate: (input: number) => input >= -90 && input <= 90 ? true : "La inclinación debe valer entre -90 y 90 grados"
      },
      {
        type: "checkbox",
        name: "userIds",
        message: "Seleccione los usuarios que han realizado la ruta:",
        default: defaults.userIds,
        choices: users(this.db)
      },
      {
        type: "list",
        name: "activityType",
        message: "Seleccione el tipo de actividad de la ruta:",
        default: defaults.activityType,
        choices: activityTypes()
      },
      {
        type: "number",
        name: "averageScore",
        message: "Defina la puntuación media de la ruta (del 1 al 10):",
        default: defaults.averageScore,
        validate: (input: number) => input >= 1 && input <= 10 ? true : "La puntuación media debe estar entre el 1 y el 10"
      }
    ])

    return new Route(
      defaults.id,
      input.name,
      new Coordinates(input.startLatitude, input.startLongitude, input.startMOSL),
      new Coordinates(input.endLatitude, input.endLongitude, input.endMOSL),
      input.distanceKm,
      input.averageSlope,
      input.userIds,
      input.activityType,
      input.averageScore
    )
  }
}
