import * as http from "node:http";
import express from "express";
import challenges from "./challenges.js";
import groups from "./groups.js";
import tracks from "./tracks.js";
import users from "./users.js";
import { sendError } from "./_common.js";

export function start(port: number): http.Server {
  const app = express();
  app.use(express.json());

  challenges(app)
  groups(app)
  tracks(app)
  users(app)

  app.all("*", (_, resp) => sendError(resp, "Not found: Endpoint or Method", 404))
  return app.listen(port)
}
