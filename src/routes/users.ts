/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from "express";
import { Document, Types } from "mongoose";
import { UserInterface } from "../db/interfaces/user_interface.js";
import { User, middlewareUserRemoveRelated } from "../db/models/user.js";
import { userDocToUser } from "../db/models/user.js";
import { getQueryParamName, sendError} from "./_common.js";

export const userRouter = express.Router();

/**
 * Method to delete a user from the database by ID
 */
userRouter.delete("/users/:id", async (req, resp) => {
  try {
    await middlewareUserRemoveRelated(req.params.id)
    await User.findByIdAndDelete(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to get a user from the database by ID
 */
userRouter.get("/users/:id", async (req, resp) => {
  let user
  try {
    user = await User.findById(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!user) {
    sendError(resp, `Not Found: User with ID '${req.params.id}'`, 404)
    return
  }
  resp.send(userDocToUser(user))
})

/**
 * Method to update a usr from the database by ID
 */
userRouter.put("/users/:id", async (req, resp) => {
  let user: (Document<unknown, UserInterface> & Omit<UserInterface & { _id: Types.ObjectId; }, never>) | null
  try {
    user = await User.findById(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!user) {
    sendError(resp, `Not Found: User with ID '${req.params.id}'`, 404)
    return
  }

  Object.keys(req.body).forEach(key => (user as any)[key] = req.body[key])
  
  try {
    await user.save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to delete a user from the database by name
 */
userRouter.delete("/users", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return
  const user = await findOneByName(name, resp)
  if (!user) return;
  await middlewareUserRemoveRelated(user._id)
  await user.deleteOne()
  resp.sendStatus(204)
})

/**
 * Method to get a user from the database by name
 */
userRouter.get("/users", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return;
  const user = await findOneByName(name, resp)
  if (!user) return;
  resp.send(userDocToUser(user))
})

/**
 * Method to insert a user to the database
 */
userRouter.post("/users", async (req, resp) => {
  try {
    await new User(req.body).save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.status(201).send(req.body)
})

/**
 * Method to update a user from the database by name
 */
userRouter.put("/users", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return;
  const user = await findOneByName(name, resp)
  if (!user) return;

  Object.keys(req.body).forEach(key => (user as any)[key] = req.body[key])
  
  try {
    await user.save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Function to search a user
 */
async function findOneByName(name: string, resp: Response): Promise<any> {
  let users
  try {
    users = await User.find({name})
  } catch (e) {
    sendError(resp, e)
    return undefined
  }
  if (users.length > 1) {
    sendError(resp, `Conflict: More than one user matches the name '${name}', use ID instead.`, 409)
    return undefined
  }
  if (users.length < 1) {
    sendError(resp, `Not Found: User with name '${name}'`, 404)
    return undefined
  }
  return users[0]
}
