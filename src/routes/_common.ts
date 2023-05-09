import { Request, Response } from "express";
import { isError } from "../utils/errors.js";

/**
 * Function to get the name from the string Query
 * @param req request query
 * @param resp response to the client
 * @returns a string that contains the name variable
 */
export function getQueryParamName(req: Request, resp: Response): string|undefined {
  if (typeof req.query.name !== "string") {
    resp.status(400).send({error: "Bad request: query param 'name' required"})
    return
  }
  return req.query.name
}

/**
 * Sends a error message to the client
 * @param resp response to the client
 * @param e error
 * @param status status that will be send to the client
 */
export function sendError(resp: Response, e: unknown, status = 400) {
  if (isError(e)) {
    e = e.message
  }
  resp.status(status).send({error: e})
}
