import inquirer from "inquirer";
import Database from "../db/database.js";
import RouteHistoryGroup from "../group/route_history_group.js";
import Route from "../route/route.js";
import RouteHistory from "../user/route_history.js"
import { users } from "./choices.js";

interface routeHistData {
  year?: number
  month?: number
  day?: number
  participants?: string[]
}

export function promptForRouteHistory(db: Database, routeIDs: string[], originalRouteHistory?: RouteHistory[]): Promise<RouteHistory[]> {
  return genericPrompt<RouteHistory>(db, routeIDs, originalRouteHistory, async (defaults: routeHistData, r: Route) => {
    const {y, m, d} = await inquirer.prompt([
      {
        type: "number",
        name: "y",
        message: `Indique el año en el que ha realizado la ruta ${r.name}:`,
        default: defaults.year,
        validate: (y: number) => y >= 1979 && y <= new Date().getFullYear() ? true : "El año debe estar entre 1970 y el actual"
      },
      {
        type: "number",
        name: "m",
        message: `Indique (con número) el mes en el que ha realizado la ruta ${r.name}:`,
        default: defaults.month,
        validate: (m: number) => m >= 1 && m <= 12 ? true : "Mes inválido"
      },
      {
        type: "number",
        name: "d",
        message: `Indique el día del mes en el que ha realizado la ruta ${r.name}:`,
        default: defaults.day,
        validate: (d: number) => d >= 1 && d <= 31 ? true : "Día del mes inválido"
      }
    ])
    return new RouteHistory(r.id, new Date(y, m-1, d, 0, 0, 0, 0), r.distanceKm, r.averageSlope)
  })
}

export function promptForRouteHistoryGroup(db: Database, routeIDs: string[], originalRouteHistory?: RouteHistoryGroup[]): Promise<RouteHistoryGroup[]> {
  return genericPrompt<RouteHistoryGroup>(db, routeIDs, originalRouteHistory, async (defaults: routeHistData, r: Route) => {
    const {y, m, d, participants} = await inquirer.prompt([
      {
        type: "number",
        name: "y",
        message: `Indique el año en el que el grupo ha realizado la ruta ${r.name}:`,
        default: defaults.year,
        validate: (y: number) => y >= 1979 && y <= new Date().getFullYear() ? true : "El año debe estar entre 1970 y el actual"
      },
      {
        type: "number",
        name: "m",
        message: `Indique (con número) el mes en el que el grupo ha realizado la ruta ${r.name}:`,
        default: defaults.month,
        validate: (m: number) => m >= 1 && m <= 12 ? true : "Mes inválido"
      },
      {
        type: "number",
        name: "d",
        message: `Indique el día del mes en el que el grupo ha realizado la ruta ${r.name}:`,
        default: defaults.day,
        validate: (d: number) => d >= 1 && d <= 31 ? true : "Día del mes inválido"
      },
      {
        type: "checkbox",
        name: "participants",
        message: `Indique los usuarios que han participado en la ruta ${r.name}:`,
        default: defaults.participants,
        choices: users(db)
      }
    ])
    return new RouteHistoryGroup(r.id, new Date(y, m-1, d, 0, 0, 0, 0), r.distanceKm, r.averageSlope, participants)
  })
}

async function genericPrompt<T extends RouteHistory>(
    db: Database,
    routeIDs: string[],
    originalRouteHistory: T[]|undefined,
    specializationFn: (defaults: routeHistData, r: Route, db?: Database) => Promise<T>
    ): Promise<T[]> {
  
  const result = [] as T[]
  for (const routeID of routeIDs) {
    const defaults: routeHistData = {}

    // Get the original date if exist
    if (originalRouteHistory) {
      const existingRouteHistory = originalRouteHistory.find(rh => rh.routeId === routeID)
      if (existingRouteHistory) {
        defaults.year = existingRouteHistory.date.getFullYear();
        defaults.month = existingRouteHistory.date.getMonth() + 1;
        defaults.day = existingRouteHistory.date.getDate();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        defaults.participants = (existingRouteHistory as any).participants
      }
    }

    const route = db.routes().find(r => r.id === routeID);
    if (!route) {
      throw new Error(`somehow a non existing route ID (${routeID}) was chosen`);
    }
    result.push(await specializationFn(defaults, route, db))
  }
  return result
}
