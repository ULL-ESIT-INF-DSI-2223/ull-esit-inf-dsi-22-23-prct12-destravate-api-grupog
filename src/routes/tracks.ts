/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from "express";
import { Track } from "../db/models/track.js";
import { trackDocToTrack } from "../db/models/track.js";
import { getQueryParamName, sendError } from "./_common.js";
import { Document, Types } from "mongoose";
import { TrackInterface } from "../db/interfaces/track_interface.js";

/**
 * Different operations on the Track Route:
 *  - Delete: remove a track from database
 *  - Post: create a track on the database
 *  - Get: sends to the client the information saved on the database
 *  - Put: modify a track on the database
 * @param app Expess default server
 */
export default function tracks(app: Express) {
  app.delete("/tracks/:id", async (req, resp) => {
    try {
      await Track.findByIdAndDelete(req.params.id)
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })

  app.get("/tracks/:id", async (req, resp) => {
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
  
  app.put("/tracks/:id", async (req, resp) => {
    let track: (Document<unknown, TrackInterface> & Omit<TrackInterface & { _id: Types.ObjectId; }, never>) | null
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

    Object.keys(req.body).forEach(key => (track as any)[key] = req.body[key])
    
    try {
      await track.save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })
  
  app.delete("/tracks", async (req, resp) => {
    const name = getQueryParamName(req, resp)
    if (!name) return
    
    try {
      await Track.findOneAndDelete({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
  })
  
  app.get("/tracks", async (req, resp) => {
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
  
  app.post("/tracks", async (req, resp) => {
    try {
      await new Track(req.body).save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.status(201).send(req.body)
  })
  
  app.put("/tracks", async (req, resp) => {
    const name = getQueryParamName(req, resp)

    let track: (Document<unknown, TrackInterface> & Omit<TrackInterface & { _id: Types.ObjectId; }, never>) | null
    try {
      track = await Track.findOneAndUpdate({name})
    } catch (e) {
      sendError(resp, e)
      return
    }
    if (!track) {
      sendError(resp, `Not Found: Track with name '${name}'`, 404)
      return
    }

    Object.keys(req.body).forEach(key => (track as any)[key] = req.body[key])
    
    try {
      await track.save()
    } catch (e) {
      sendError(resp, e)
      return
    }
    resp.sendStatus(204)
	})
}
