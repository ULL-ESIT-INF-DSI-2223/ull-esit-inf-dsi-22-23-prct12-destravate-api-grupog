/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { Challenge } from "../db/models/challenge.js";
import { challengeDocToChallenge } from "../db/models/challenge.js";
import { getQueryParamName, sendError } from "./_common.js";
import { Document, Types } from "mongoose";
import { ChallengeInterface } from "../db/interfaces/challenge_interface.js";

export const challengeRouter = express.Router();

/**
 * Method to delete a cahllenge from the database by ID
 */
challengeRouter.delete("/challenges/:id", async (req, resp) => {
  
  resp.sendStatus(204)
  try {
    await Challenge.findByIdAndDelete(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to get a challenge from the database by ID
 */
challengeRouter.get("/challenges/:id", async (req, resp) => {
  let challenge
  try {
    challenge = await Challenge.findById(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!challenge) {
    sendError(resp, `Not Found: Challenge with ID '${req.params.id}'`, 404)
    return
  }
  resp.send(challengeDocToChallenge(challenge))
})

/**
 * Method to update a challenge from the database by ID
 */
challengeRouter.put("/challenges/:id", async (req, resp) => {
  let challenge: (Document<unknown, ChallengeInterface> & Omit<ChallengeInterface & { _id: Types.ObjectId; }, never>) | null
  try {
    challenge = await Challenge.findById(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!challenge) {
    sendError(resp, `Not Found: Challenge with ID '${req.params.id}'`, 404)
    return
  }
  
  Object.keys(req.body).forEach(key => (challenge as any)[key] = req.body[key])

  try {
    await challenge.save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to delete a challenge from the database by name
 */
challengeRouter.delete("/challenges", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return
  try {
    await Challenge.findOneAndDelete({name})
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to get a challenge from the database by name
 */
challengeRouter.get("/challenges", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return;
  let challenge
  try {
    challenge = await Challenge.findOne({name})
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!challenge) {
    sendError(resp, `Not Found: Challenge with name '${name}'`, 404)
    return
  }
  resp.send(challengeDocToChallenge(challenge))
})

/**
 * Method to insert a challenge to the database
 */
challengeRouter.post("/challenges", async (req, resp) => {
  try {
    await new Challenge(req.body).save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.status(201).send(req.body)
})

/**
 * Method to update a challenge from the database by name
 */
challengeRouter.put("/challenges", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  
  let challenge: (Document<unknown, ChallengeInterface> & Omit<ChallengeInterface & { _id: Types.ObjectId; }, never>) | null
  try {
    challenge = await Challenge.findOneAndUpdate({name})
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!challenge) {
    sendError(resp, `Not found: Challenge with name '${name}'`, 404)
    return
  }
  
  Object.keys(req.body).forEach(key => (challenge as any)[key] = req.body[key])
  
  try {
    await challenge.save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})
