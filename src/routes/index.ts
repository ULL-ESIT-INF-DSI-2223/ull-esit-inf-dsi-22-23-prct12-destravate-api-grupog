import * as http from "node:http";
import express from "express";
import { challengeRouter } from "./challenges.js";
import { groupRouter } from "./groups.js";
import { trackRouter } from "./tracks.js";
import { userRouter } from "./users.js";
import { sendError } from "./_common.js";

/**
 * Function to start the server and enable routes
 */
export function start(port: number): http.Server {
  const app = express();
  app.use(express.json());

  app.use(challengeRouter)
  app.use(groupRouter)
  app.use(trackRouter)
  app.use(userRouter)

  app.all("*", (_, resp) => sendError(resp, "Not found: Endpoint or Method", 404))
  return app.listen(port)
}
