import { ActivityType } from "../activity_type.js";
import { ChallengeData } from "./challenge_data.js";
import Route from "../route/route.js";
import Database from "../db/database.js";

/**
 * Challenge class represents the challenges inside the app.
 */
export default class Challenge {
  public id: string;
  public name: string;
  public routes: Route[];
  public totalKm: number;
  public userIds: string[];
  public activity: ActivityType;

  /**
   * constructor creates a new Challenge object from the data provided.
   * @param id ID of the challenge.
   * @param name Name of the challenge.
   * @param routes List of routes that are part of the challenge
   * @param totalKm Total length of all routes of the challenge.
   * @param userIds List of users that have traveled through the challenge.
   * @param activity Type of activity in this challenge.
   */
  constructor(
    id: string,
    name: string,
    routes: Route[],
    userIds: string[],
    activity: ActivityType
  ) {
    if (name === "") {
      throw new Error("invalid name");
    }

    this.id = id;
    this.name = name;
    this.routes = routes;
    this.totalKm = routes.reduce((acc, r) => acc + r.distanceKm, 0);
    this.userIds = userIds;
    this.activity = activity;
  }

  /**
   * Function to parse the data from the database.
   * @param data Data from the database.
   * @returns Challenge parsed from the data provided.
   */
  static parse(data: ChallengeData, db: Database): Challenge {
    const routes: Route[] = [];
    data.routes.forEach((routeID) => {
      const route = db.routes().find((route) => route.id === routeID);
      if (!route) {
        throw new Error(
          `no route with matching ID (${routeID}) was found parsing Challenge`
        );
      }
      routes.push(route);
    });
    return new Challenge(
      data.id,
      data.name,
      routes,
      data.userIds,
      data.activity
    );
  }

  /**
   *
   * Function to prepare the Challenge object for insertion in the Database
   * @returns ChallengeData to insert in the database.
   */
  toJSON(): ChallengeData {
    return {
      id: this.id,
      name: this.name,
      routes: this.routes.map((route) => route.id),
      userIds: this.userIds,
      activity: this.activity,
    };
  }
}
