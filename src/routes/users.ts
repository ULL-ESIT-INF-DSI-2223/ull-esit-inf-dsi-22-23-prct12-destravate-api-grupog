/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from "express";
import { Document, Types } from "mongoose";
import { UserInterface } from "../db/interfaces/user_interface.js";
import { User } from "../db/models/user.js";
import { userDocToUser } from "../db/models/user.js";
import { getQueryParamName, sendError} from "./_common.js";

/**
 * Different operations on the User Route:
 *  - Delete: remove a user from database
 *  - Post: create a user on the database
 *  - Get: sends to the client the information saved on the database
 *  - Put: modify a user on the database
 * @param app Expess default server
 */
export default function users(app: Express) {
  app.delete("/users/:id", async (req, resp) => {
    try {
      await User.findByIdAndDelete(req.params.id)
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })

  app.get("/users/:id", async (req, resp) => {
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
  
  app.put("/users/:id", async (req, resp) => {
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
  
  app.delete("/users", async (req, resp) => {
    const name = getQueryParamName(req, resp)
    if (!name) return
    try {
      await User.findOneAndDelete({name})
    } catch (e) {
      sendError(resp, e)
      return
    }		
    resp.sendStatus(204)
  })
  
  app.get("/users", async (req, resp) => {
    const name = getQueryParamName(req, resp)
    if (!name) return;

    let user
    try{
      user = await User.findOne({name}) 
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!user) {
      sendError(resp, `Not Found: User with name '${name}'`, 404)
      return
    }
    resp.send(userDocToUser(user))
  })
  
  app.post("/users", async (req, resp) => {
    try {
      await new User(req.body).save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.status(201).send(req.body)
  })
  
  app.put("/users", async (req, resp) => {
    const name = getQueryParamName(req, resp)

    let user: (Document<unknown, UserInterface> & Omit<UserInterface & { _id: Types.ObjectId; }, never>) | null
    try {
      user = await User.findOneAndUpdate({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!user) {
      sendError(resp, `Not Found: User with name '${name}'`, 404)
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
}
