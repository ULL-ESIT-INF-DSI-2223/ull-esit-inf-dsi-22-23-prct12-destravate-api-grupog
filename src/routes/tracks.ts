/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { Track, middlewareTrackRemoveRelated } from "../db/models/track.js";
import { trackDocToTrack } from "../db/models/track.js";
import { getQueryParamName, sendError } from "./_common.js";
import { Document, Types } from "mongoose";
import { TrackInterface } from "../db/interfaces/track_interface.js";

export const trackRouter = express.Router();

/**
 * Method to delete a track from the database by ID
 */
trackRouter.delete("/tracks/:id", async (req, resp) => {
  try {
    await middlewareTrackRemoveRelated(req.params.id)
    await Track.findByIdAndDelete(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})

/**
 * Method to get a track from the database by ID
 */
trackRouter.get("/tracks/:id", async (req, resp) => {
  let track
  try {
    track = await Track.findById(req.params.id)
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!track) {
    sendError(resp, `Not Found: Track with ID '${req.params.id}'`, 404)
    return
  }
  resp.send(trackDocToTrack(track))
})


/**
 * Method to update a track from the database by ID
 */
trackRouter.put("/tracks/:id", async (req, resp) => {
  let track: (Document<unknown, TrackInterface> & Omit<TrackInterface & { _id: Types.ObjectId; }, never>) | null
  try {
    track = await Track.findByIdAndUpdate(req.params.id, req.body)
    if (!track) {
      sendError(resp, `Not Found: Track with ID '${req.params.id}'`, 404)
      return
    }
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})


/**
 * Method to delete a track from the database by name
 */
trackRouter.delete("/tracks", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return
  
  let track
  try {
    track = await Track.findOne({name})
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (track) {
    await middlewareTrackRemoveRelated(track._id)
    await track.deleteOne()
  }
  resp.sendStatus(204)
})


/**
 * Method to get a track from the database by name
 */
trackRouter.get("/tracks", async (req, resp) => {
  const name = getQueryParamName(req, resp)
  if (!name) return;

  let track
  try {
    track = await Track.findOne({name})
  } catch (e) {
    sendError(resp, e)
    return
  }
  if (!track) {
    sendError(resp, `Not Found: Track with name '${name}'`, 404)
    return
  }
  resp.send(trackDocToTrack(track))
})


/**
 * Method to insert a track to the database
 */
trackRouter.post("/tracks", async (req, resp) => {
  try {
    await new Track(req.body).save()
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.status(201).send(req.body)
})


/**
 * Method to update a track from the database by name
 */
trackRouter.put("/tracks", async (req, resp) => {
  const name = getQueryParamName(req, resp)

  let track: (Document<unknown, TrackInterface> & Omit<TrackInterface & { _id: Types.ObjectId; }, never>) | null
  try {
    track = await Track.findOneAndUpdate({name}, req.body)
    if (!track) {
      sendError(resp, `Not Found: Track with name '${name}'`, 404)
      return
    }
  } catch (e) {
    sendError(resp, e)
    return
  }
  resp.sendStatus(204)
})
