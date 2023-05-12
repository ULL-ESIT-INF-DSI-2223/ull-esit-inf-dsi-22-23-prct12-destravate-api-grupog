/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { Group, groupDocToGroup } from "../db/models/group.js";
import { getQueryParamName, sendError } from "./_common.js";
import { Document, Types } from "mongoose";
import { GroupInterface } from "../db/interfaces/group_interface.js";



export const groupRouter = express.Router();

/**
 * Method to delete a group from the database by ID
 */
groupRouter.delete("/groups/:id", async (req, resp) => {
  try {
    await Group.findByIdAndDelete(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})


/**
 * Method to get a group from the database by ID
 */
groupRouter.get("/groups/:id", async (req, resp) => {
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

/**
 * Method to update a group from the database by ID
 */
groupRouter.put("/groups/:id", async (req, resp) => {
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


/**
 * Method to delete a group from the database by name
 */
groupRouter.delete("/groups", async (req, resp) => {
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


/**
 * Method to get a group from the database by name
 */
groupRouter.get("/groups", async (req, resp) => {
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


/**
 * Method to insert a group to the database
 */
groupRouter.post("/groups", async (req, resp) => {
  try {
    await new Group(req.body).save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.status(201).send(req.body)
})


/**
 * Method to update a group from the database by name
 */
groupRouter.put("/groups", async (req, resp) => {
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
