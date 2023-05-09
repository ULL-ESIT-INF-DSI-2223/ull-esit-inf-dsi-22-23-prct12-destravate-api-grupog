/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from "express";
import { Group, groupDocToGroup } from "../db/models/group.js";
import { getQueryParamName, sendError } from "./_common.js";
import { Document, Types } from "mongoose";
import { GroupInterface } from "../db/interfaces/group_interface.js";

/**
 * Different operations on the Group Route:
 *  - Delete: remove a group from database
 *  - Post: create a group on the database
 *  - Get: sends to the client the information saved on the database
 *  - Put: modify a group on the database
 * @param app Expess default server
 */
export default function groups(app: Express) {
  app.delete("/groups/:id", async (req, resp) => {
    try {
      await Group.findByIdAndDelete(req.params.id)
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })

  app.get("/groups/:id", async (req, resp) => {
    let group
    try {
      group = await Group.findById(req.params.id)
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!group) {
      sendError(resp, `Not Found: Group with ID '${req.params.id}'`, 404)
      return
    }
    resp.send(groupDocToGroup(group))
  })
  
  app.put("/groups/:id", async (req, resp) => {
    let group: (Document<unknown, GroupInterface> & Omit<GroupInterface & { _id: Types.ObjectId; }, never>) | null
    try {
      group = await Group.findById(req.params.id)
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!group) {
      sendError(resp, `Not Found: Group with ID '${req.params.id}'`, 404)
      return
    }

    Object.keys(req.body).forEach(key => (Group as any)[key] = req.body[key])
    
    try {
      await group.save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })
  
  app.delete("/groups", async (req, resp) => {
    const name = getQueryParamName(req, resp)
    if (!name) return
    try {
      await Group.findOneAndDelete({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })
  
  app.get("/groups", async (req, resp) => {
    const name = getQueryParamName(req, resp)
    if (!name) return;
    let group
    try {
      group = await Group.findOne({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!group) {
      sendError(resp, `Not Found: Group with name '${name}'`, 404)
      return
    }
    resp.send(groupDocToGroup(group))
  })
  
  app.post("/groups", async (req, resp) => {
    try {
      await new Group(req.body).save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.status(201).send(req.body)
  })
  
  app.put("/groups", async (req, resp) => {
    const name = getQueryParamName(req, resp)

    let group: (Document<unknown, GroupInterface> & Omit<GroupInterface & { _id: Types.ObjectId; }, never>) | null
    try {
      group = await Group.findOneAndUpdate({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!group) {
      sendError(resp, `Not Found: Group with name '${name}'`, 404)
      return
    }

    Object.keys(req.body).forEach(key => (group as any)[key] = req.body[key])
    
    try {
      await group.save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
	})
}
